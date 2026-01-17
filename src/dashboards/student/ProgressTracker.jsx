import React, { useState, useEffect } from 'react';
import { BookOpen, AlertCircle, CheckCircle2, PlayCircle } from 'lucide-react';
import StudentHistory from '../../components/dashboard/StudentHistory';
import { ProgressService } from '../../services/progressService';

const ProgressTracker = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await ProgressService.getMyCourses();
                setCourses(data);
            } catch (error) {
                console.error("Failed to fetch progress", error);
            }
        };

        fetchCourses();
        // Poll every 10 seconds for real-time updates
        const interval = setInterval(fetchCourses, 10000);
        return () => clearInterval(interval);
    }, []);

    const StatusBadge = ({ status }) => {
        const colors = {
            'Not Started': 'bg-slate-100 text-slate-500',
            'In Progress': 'bg-blue-50 text-blue-600',
            'Completed': 'bg-emerald-50 text-emerald-600',
            'Failed': 'bg-red-50 text-red-600'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${colors[status] || colors['Not Started']}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Academic Progress & History</h1>
                <p className="text-slate-500 mt-1">Track your course milestones and detailed assessment history.</p>
            </div>

            {/* Active Courses Grid */}
            <div className="space-y-6">
                <h2 className="text-xl font-black text-[#2b3674] flex items-center gap-2">
                    <BookOpen className="text-primary" size={20} /> My Learning Tracks
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.length > 0 ? courses.map((course, i) => (
                        <div key={i} className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                            {/* Progress Bar Background */}
                            <div className="absolute bottom-0 left-0 h-1.5 bg-slate-100 w-full">
                                <div
                                    className={`h-full ${course.status === 'Completed' ? 'bg-emerald-500' : 'bg-primary'} transition-all duration-1000`}
                                    style={{ width: `${course.completionPercentage}%` }}
                                />
                            </div>

                            <div className="flex justify-between items-start mb-4">
                                <StatusBadge status={course.status} />
                                <span className="font-black text-xs text-slate-400">{course.completionPercentage}%</span>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 mb-1">{course.subjectId?.title || 'Unknown Course'}</h3>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-6">
                                {course.subjectId?.dept || 'General'} • {course.subjectId?.instructorName || 'Faculty'}
                            </p>

                            <div className="flex gap-4 border-t border-slate-50 pt-4">
                                <div className="text-center flex-1">
                                    <h4 className="text-sm font-black text-slate-800">{course.watchedContent?.filter(c => c.isCompleted).length}</h4>
                                    <p className="text-[8px] uppercase tracking-widest text-slate-400">Videos Watched</p>
                                </div>
                                <div className="text-center flex-1 border-l border-slate-50">
                                    <h4 className="text-sm font-black text-slate-800">{course.examMetrics?.passedExamsCount || 0}</h4>
                                    <p className="text-[8px] uppercase tracking-widest text-slate-400">Exams Passed</p>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-3 p-10 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200 text-center">
                            <AlertCircle className="mx-auto text-slate-300 mb-2" size={32} />
                            <p className="text-slate-400 font-bold text-sm">No active course progress found.</p>
                            <p className="text-slate-400 text-xs mt-1">Start watching lectures or taking exams to see progress here.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Detailed History */}
            <div>
                <StudentHistory />
            </div>
        </div>
    );
};

export default ProgressTracker;
