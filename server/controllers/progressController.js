const CourseProgress = require('../models/CourseProgress');
const { Subject, Content } = require('../models/Subject');
const ExamResult = require('../models/ExamResult');
const Exam = require('../models/Exam');

// Internal Helper: Recalculate Progress & Status
const calculateStatus = async (progressDoc) => {
    try {
        const subject = await Subject.findById(progressDoc.subjectId);
        if (!subject) return;

        // 1. Video Progress
        // Get total video count for this subject
        const totalVideos = await Content.countDocuments({ subjectId: subject._id, type: 'video' });
        
        // Count watched videos (isCompleted: true)
        const watchedCount = progressDoc.watchedContent.filter(c => c.isCompleted).length;
        
        let videoPercentage = totalVideos === 0 ? 100 : (watchedCount / totalVideos) * 100;

        // 2. Exam Progress
        const criteria = subject.completionCriteria || {};
        const mandatoryExams = criteria.mandatoryExams || [];
        
        // Check exam results for mandatory exams
        let examsPassed = 0;
        let totalScore = 0;
        let examAttempts = 0;

        if (mandatoryExams.length > 0) {
            const results = await ExamResult.find({
                studentId: progressDoc.studentId,
                examId: { $in: mandatoryExams },
                status: 'Pass' // Only count passed exams
            });
            
            // Allow multiple attempts, check if *at least one* pass exists for each mandatory exam
            const uniquePassedExams = new Set(results.map(r => r.examId.toString()));
            examsPassed = uniquePassedExams.size;
        }

        // Calculate Overall Progress
        // Simple weighted average: 50% Videos, 50% Exams (if exams exist)
        let totalProgress = 0;
        if (mandatoryExams.length > 0) {
            const examPercentage = (examsPassed / mandatoryExams.length) * 100;
            totalProgress = (videoPercentage * 0.5) + (examPercentage * 0.5);
        } else {
            totalProgress = videoPercentage;
        }

        progressDoc.completionPercentage = Math.min(100, Math.round(totalProgress));

        // Determine Status
        if (progressDoc.completionPercentage === 100) {
            // Check if all mandatory exams are actually passed (redundant but safe)
            if (mandatoryExams.length > 0 && examsPassed < mandatoryExams.length) {
                progressDoc.status = 'In Progress'; // Can't be complete if exams are missing
            } else {
                progressDoc.status = 'Completed';
                if (!progressDoc.completedAt) progressDoc.completedAt = new Date();
            }
        } else if (progressDoc.completionPercentage > 0) {
            progressDoc.status = 'In Progress';
        }

        await progressDoc.save();
        return progressDoc;
    } catch (err) {
        console.error("Error recalculating progress:", err);
    }
};

// API: Track Video View
const updateVideoProgress = async (req, res) => {
    try {
        const { subjectId, contentId, watchedDuration, isCompleted } = req.body;
        const studentId = req.user._id;

        let progress = await CourseProgress.findOne({ studentId, subjectId });

        if (!progress) {
            progress = new CourseProgress({ studentId, subjectId, status: 'In Progress' });
        }

        // Update watchedContent array
        const contentIndex = progress.watchedContent.findIndex(c => c.contentId.toString() === contentId);
        
        if (contentIndex > -1) {
            progress.watchedContent[contentIndex].watchedDuration = watchedDuration;
            progress.watchedContent[contentIndex].lastAccess = Date.now();
            if (isCompleted) progress.watchedContent[contentIndex].isCompleted = true;
        } else {
            progress.watchedContent.push({
                contentId,
                watchedDuration,
                isCompleted: !!isCompleted,
                lastAccess: Date.now()
            });
        }

        await progress.save();
        
        // Background Recalculation
        await calculateStatus(progress);

        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// API: Get Student's Course Dashboard
const getStudentCourses = async (req, res) => {
    try {
        const studentId = req.user._id;
        // Fetch all subjects (assuming student is enrolled in all for now, or filter by batch)
        // In reality, we should filter by Student -> Batch -> Subjects.
        // For simplicity, we get progress for all subjects the student has touched.
        
        const progressDocs = await CourseProgress.find({ studentId }).populate('subjectId');
        res.json(progressDocs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// API: Get Full Exam History
const getExamHistory = async (req, res) => {
    try {
        const studentId = req.params.studentId || req.user._id; // Faculty can pass studentId
        
        const history = await ExamResult.find({ studentId })
            .populate('examId', 'title category type') // Populate exam details
            .sort({ submittedAt: -1 });

        const formattedHistory = history.map(h => ({
            examName: h.examId?.title || 'Unknown Exam',
            type: h.examId?.category || 'General',
            date: h.submittedAt,
            score: h.score,
            totalScore: h.totalScore,
            status: h.status,
            result: h.status === 'Pass' ? 'Pass' : 'Fail',
            language: h.answers.find(a => a.language)?.language || 'N/A'
        }));

        res.json(formattedHistory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// API: Get Progress Analysis (Avg scores, etc.)
const getPerformanceAnalysis = async (req, res) => {
    try {
        const studentId = req.params.studentId || req.user._id;

        const results = await ExamResult.find({ studentId });
        
        const totalExams = results.length;
        if (totalExams === 0) return res.json({ message: 'No data' });

        const totalScoreObtained = results.reduce((acc, curr) => acc + curr.score, 0);
        const totalMaxScore = results.reduce((acc, curr) => acc + curr.totalScore, 0);
        
        const avgScore = (totalScoreObtained / totalExams).toFixed(2);
        const percent = ((totalScoreObtained / totalMaxScore) * 100).toFixed(2);

        // Best & Worst
        const sorted = [...results].sort((a, b) => b.score - a.score);
        const best = sorted[0]?.score || 0;
        const lowest = sorted[sorted.length - 1]?.score || 0;

        // Topic/Category wise (Coding vs Aptitude)
        // Needs deep populate if category is in Exam
        const categoryStats = {};
        
        // We need to fetch exam details for categories if not populated
        // results already have examId, let's manually bucket them for speed or use aggregation
        // Using simple JS for now
        
        // Note: For production, Aggregation Pipeline is better.
        
        res.json({
            avgScore,
            percent,
            totalAttempts: totalExams,
            bestScore: best,
            lowestScore: lowest
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    updateVideoProgress,
    getStudentCourses,
    getExamHistory,
    getPerformanceAnalysis,
    calculateStatus // Exporting helper for use in examController if needed
};
