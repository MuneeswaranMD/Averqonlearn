import React, { useState, useEffect } from 'react';
import {
    ClipboardList, Calendar, Clock, Award,
    Zap, AlertCircle, Play, ChevronRight,
    Search, Filter, History
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StudentService } from '../../services/studentService';

const Exams = () => {
    const { collegeId, currentUser } = useAuth();
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExams = async () => {
            if (!collegeId) return;
            try {
                const data = await StudentService.getExams(collegeId);
                setExams(data);
            } catch (error) {
                console.error("Error fetching exams:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchExams();
    }, [collegeId]);

    const upcoming = exams.filter(e => !e.isCompleted);
    const mockTests = exams.filter(e => e.type === 'mock');

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Exams & Mock Tests</h1>
                    <p className="text-slate-500 mt-1">Manage your academic schedule and placement readiness tests.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                        <History size={18} /> Test History
                    </button>
                </div>
            </div>

            {/* Critical Alert */}
            {upcoming.some(e => e.isUrgent) && (
                <div className="bg-orange-50 border-2 border-orange-100 rounded-3xl p-6 flex items-center gap-6 animate-pulse">
                    <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                        <AlertCircle size={28} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-orange-900">Mandatory Assessment Due</h3>
                        <p className="text-sm font-medium text-orange-700">The "Python Fundamentals Certification" exam expires in 12 hours. Please complete it to maintain eligibility.</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upcoming Schedule */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">Academic Schedule</h2>
                        <div className="flex gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input type="text" placeholder="Search exams..." className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-primary text-sm" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {upcoming.map(exam => (
                            <div key={exam.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex flex-col items-center justify-center border border-slate-100 shrink-0 group-hover:bg-primary/5 group-hover:border-primary/20 transition-colors">
                                        <span className="text-[10px] items-center font-black text-slate-400 uppercase tracking-widest">{exam.month || 'OCT'}</span>
                                        <span className="text-2xl font-black text-slate-900">{exam.day || '24'}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-lg font-bold text-slate-900">{exam.title}</h3>
                                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${exam.type === 'Main' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                                {exam.type}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-6 text-slate-500 font-medium text-xs">
                                            <span className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400" /> {exam.time} • {exam.duration}</span>
                                            <span className="flex items-center gap-1.5"><ClipboardList size={14} className="text-slate-400" /> {exam.questions} Questions</span>
                                        </div>
                                    </div>
                                    <button className="px-6 py-3 bg-slate-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2">
                                        Details <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {loading && [1, 2, 3].map(i => (
                            <div key={i} className="bg-slate-100 h-24 rounded-3xl animate-pulse" />
                        ))}

                        {!loading && upcoming.length === 0 && (
                            <div className="bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-10 text-center">
                                <p className="text-slate-400 font-bold">No upcoming exams scheduled.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Placement Readiness */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-900">Placement Prep</h2>
                    <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-slate-200 relative overflow-hidden group">
                        <Zap className="absolute -top-4 -right-4 w-32 h-32 text-white/5 group-hover:rotate-12 transition-transform duration-500" />
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            Mock Tests <Award size={20} className="text-primary" />
                        </h3>
                        <div className="space-y-4">
                            {mockTests.map(mock => (
                                <div key={mock.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-sm font-bold text-white/90">{mock.title}</h4>
                                        <div className="text-primary"><ArrowUpRight size={16} /></div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black uppercase text-slate-400">Best Score: {mock.bestScore || 'N/A'}</span>
                                        <button className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors">
                                            Start <Play size={10} fill="currentColor" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {mockTests.length === 0 && (
                                <p className="text-slate-500 text-xs text-center font-bold py-4">No mock tests available.</p>
                            )}
                        </div>
                        <button className="w-full mt-8 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all uppercase text-xs tracking-widest">
                            Simulate Interview
                        </button>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4">Readiness Tip</h3>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">
                            Based on your last attempt, focus on <span className="text-primary font-bold">Array Manipulation</span> and <span className="text-primary font-bold">Time Complexity</span> for tomorrow's mock test.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Exams;
