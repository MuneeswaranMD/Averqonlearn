const CodeExecutionService = require('../services/codeExecutionService');
const Exam = require('../models/Exam');
const ExamResult = require('../models/ExamResult');

const createExam = async (req, res) => {
    try {
        const { title, category, dept, year, batchId, scheduledDate, duration, questions, passingCriteria, negativeMarking, rules } = req.body;
        
        const exam = new Exam({
            title,
            category,
            collegeId: req.user.collegeId,
            dept,
            year,
            batchId,
            scheduledDate,
            duration,
            questions,
            passingCriteria,
            negativeMarking: negativeMarking || 0,
            rules: rules || { fullscreenRequired: true, maxWarnings: 3 },
            createdBy: req.user._id
        });

        await exam.save();
        res.status(201).json(exam);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getExams = async (req, res) => {
    try {
        console.log("getExams called by user:", req.user?._id, req.user?.role);
        const query = { collegeId: req.user.collegeId };
        
        if (req.user.role === 'student') {
            query.$or = [
                { batchId: req.user.batchId },
                { dept: req.user.dept || 'General', year: req.user.year }
            ];
            query.status = 'Active';
        } else if (req.user.role === 'faculty') {
            query.createdBy = req.user._id;
        }

        console.log("getExams query:", JSON.stringify(query));
        const exams = await Exam.find(query).sort({ scheduledDate: 1 });
        console.log("getExams found:", exams.length);
        res.json(exams);
    } catch (error) {
        console.error("Error in getExams:", error);
        res.status(500).json({ message: error.message });
    }
};

const getExamById = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);
        if (!exam) return res.status(404).json({ message: 'Exam not found' });
        res.json(exam);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const logViolation = async (req, res) => {
    try {
        const { examId, type } = req.body;
        let result = await ExamResult.findOne({ examId, studentId: req.user._id });
        
        if (!result) {
            result = new ExamResult({
                examId,
                studentId: req.user._id,
                score: 0,
                totalScore: 0,
                status: 'Fail'
            });
        }

        result.violations.push({ type });
        result.activityLog.push({
            action: type,
            details: 'Security Protocol Violation Detected',
            isViolation: true
        });
        result.warningCount += 1;
        
        const exam = await Exam.findById(examId);
        if (exam && result.warningCount >= exam.rules.maxWarnings) {
            result.status = 'Flagged';
        }

        await result.save();
        res.json({ warningCount: result.warningCount, status: result.status });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const logAction = async (req, res) => {
    try {
        const { examId, action, details } = req.body;
        let result = await ExamResult.findOne({ examId, studentId: req.user._id });

        if (!result) {
            result = new ExamResult({
                examId,
                studentId: req.user._id,
                score: 0,
                totalScore: 0,
                status: 'Fail'
            });
        }

        result.activityLog.push({
            action,
            details,
            isViolation: false
        });

        await result.save();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const submitExam = async (req, res) => {
    try {
        const { examId, answers, violations } = req.body;
        const exam = await Exam.findById(examId);
        if (!exam) return res.status(404).json({ message: 'Exam not found' });

        let totalPoints = 0;
        let earnedPoints = 0;
        const evaluatedAnswers = [];

        for (const q of exam.questions) {
            const userAnswer = answers.find(a => a.questionId === q._id.toString());
            const points = q.points || 1;
            totalPoints += points;

            let isCorrect = false;
            let pointsAwarded = 0;
            let extra = {};

            if (q.type === 'MCQ') {
                isCorrect = userAnswer && userAnswer.answer === q.correctAnswer;
                if (isCorrect) {
                    pointsAwarded = points;
                } else if (userAnswer && userAnswer.answer) {
                    pointsAwarded = -(exam.negativeMarking || 0);
                }
            } else if (q.type === 'Coding') {
                if (userAnswer && userAnswer.answer) {
                    const evalResult = await CodeExecutionService.evaluateSubmission(
                        userAnswer.answer, 
                        userAnswer.language || 'python', 
                        q.testCases, 
                        q.timeLimit
                    );
                    
                    isCorrect = evalResult.overallStatus === 'Accepted';
                    
                    // --- Advanced Scoring Logic ---
                    // 1. Base Score (Weighted)
                    let questionScore = 0;
                    const maxQuestionScore = points; 
                    
                    // Simple logic: if passed, get points. 
                    // To implement detailed weighting per test case, we need backend support for per-case weighting.
                    // For now, we assume equal weights or strict pass.
                    
                    // If partial marking allowed:
                    questionScore = (evalResult.passedCount / evalResult.totalCount) * points;

                    // 2. Performance Bonus
                    // Only if ALL cases passed
                    let performanceBonus = 0;
                    let codeQualityBonus = 0;
                    
                    if (isCorrect) {
                        const timeLimitMs = (q.timeLimit || 2) * 1000;
                        const avgTime = evalResult.averageTime;
                        
                        if (avgTime < timeLimitMs * 0.5) {
                            performanceBonus = Math.min(5, points * 0.2); 
                        } else if (avgTime < timeLimitMs * 0.8) {
                            performanceBonus = Math.min(2, points * 0.1); 
                        }
                        
                        // 3. Code Quality Bonus (from Linter)
                        // If qualityScore is > 8/10, give slight bonus
                        if (evalResult.qualityScore && evalResult.qualityScore >= 8) {
                            codeQualityBonus = 2; // Fixed bonus for clean code
                        }
                    }
                    
                    pointsAwarded = questionScore + performanceBonus + codeQualityBonus;
                    
                    extra = {
                        language: userAnswer.language,
                        testCasesReached: evalResult.passedCount,
                        totalTestCases: evalResult.totalCount,
                        executionTime: evalResult.averageTime,
                        performanceBonus,
                        codeQualityScore: evalResult.qualityScore || 0,
                        feedback: isCorrect ? 
                            (performanceBonus > 0 ? "Fast & Clean Code! ⚡" : (codeQualityBonus > 0 ? "Good Code Quality" : "Good Job")) 
                            : "Check edge cases"
                    };
                }
            }

            earnedPoints += pointsAwarded;
            evaluatedAnswers.push({
                questionId: q._id,
                userAnswer: userAnswer ? userAnswer.answer : '',
                isCorrect,
                pointsAwarded,
                timeSpent: userAnswer ? userAnswer.timeSpent : 0,
                ...extra
            });
        }

        const percentage = (earnedPoints / totalPoints) * 100;
        let status = percentage >= exam.passingCriteria ? 'Pass' : 'Fail';
        
        // If violations exceeded, status remains Flagged if already set by logViolation
        const existingResult = await ExamResult.findOne({ examId, studentId: req.user._id });
        if (existingResult && existingResult.status === 'Flagged') status = 'Flagged';

        const resultData = {
            examId,
            studentId: req.user._id,
            score: Math.max(0, earnedPoints), // Don't let score be negative
            totalScore: totalPoints,
            answers: evaluatedAnswers,
            status,
            violations: violations || (existingResult ? existingResult.violations : []),
            warningCount: existingResult ? existingResult.warningCount : 0,
            submittedAt: Date.now()
        };

        if (existingResult) {
            existingResult.set(resultData);
            result = await existingResult.save();
        } else {
            result = new ExamResult(resultData);
            await result.save();
        }

        // --- NEW: Trigger Course Progress Update ---
        try {
            // Find subjects that require this exam
            /* 
              We use a loose check. Ideally, we query:
              Subject.find({ 'completionCriteria.mandatoryExams': examId })
            */
            const { Subject } = require('../models/Subject');
            const CourseProgress = require('../models/CourseProgress');
            const { calculateStatus } = require('./progressController');

            const subjects = await Subject.find({ 'completionCriteria.mandatoryExams': examId });
            
            for (const subject of subjects) {
                let progress = await CourseProgress.findOne({ studentId: req.user._id, subjectId: subject._id });
                if (!progress) {
                    progress = new CourseProgress({ studentId: req.user._id, subjectId: subject._id, status: 'In Progress' });
                }
                await calculateStatus(progress);
            }
        } catch (progErr) {
            console.error("Progress Auto-Update Failed:", progErr);
            // Don't fail the exam submission for this
        }
        // -------------------------------------------

        res.status(201).json(result);
    } catch (error) {
        console.error("Submit Error:", error);
        res.status(500).json({ message: error.message });
    }
};

const getExamAnalytics = async (req, res) => {
    try {
        const { examId } = req.params;
        const results = await ExamResult.find({ examId })
            .populate('studentId', 'displayName email dept year rollNo batchId')
            .sort({ score: -1 });

        const analytics = {
            totalAttempts: results.length,
            averageScore: results.reduce((acc, curr) => acc + curr.score, 0) / (results.length || 1),
            passCount: results.filter(r => r.status === 'Pass').length,
            flaggedCount: results.filter(r => r.status === 'Flagged').length,
            results: results.map(r => ({
                id: r._id,
                student: r.studentId,
                score: r.score,
                totalScore: r.totalScore,
                status: r.status,
                warningCount: r.warningCount,
                submittedAt: r.submittedAt,
                languageUsed: r.answers.find(a => a.language)?.language || 'N/A',
                activityLog: r.activityLog
            }))
        };

        res.json(analytics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTPOAnalytics = async (req, res) => {
    try {
        // Find all coding exams for this college
        const exams = await Exam.find({ collegeId: req.user.collegeId, category: 'Coding' });
        const examIds = exams.map(e => e._id);

        const results = await ExamResult.find({ examId: { $in: examIds } })
            .populate('studentId', 'displayName email dept year rollNo batchId skills placementProfile')
            .populate('examId', 'title category')
            .sort({ score: -1 });

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const executeCode = async (req, res) => {
    try {
        const { code, language } = req.body;
        const result = await CodeExecutionService.execute(code, language);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getStudentResults = async (req, res) => {
    try {
        const results = await ExamResult.find({ studentId: req.user._id })
            .populate('examId', 'title category totalPoints passingCriteria')
            .sort({ submittedAt: -1 });

        const formattedResults = results.map(r => ({
            id: r._id,
            exam: r.examId.title,
            category: r.examId.category,
            score: r.score,
            totalScore: r.totalScore,
            status: r.status,
            date: r.submittedAt
        }));

        res.json(formattedResults);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createExam,
    getExams,
    getExamById,
    submitExam,
    getStudentResults,
    getExamAnalytics,
    getTPOAnalytics,
    logViolation,
    executeCode,
    logAction
};
