import React, { useState, useEffect } from 'react';
import {
    ClipboardList, Calendar, Clock, Award,
    Zap, AlertCircle, Play, ChevronRight,
    Search, History, PlayCircle, MoreHorizontal
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ExamService } from '../../services/examService';
import ExamAttempt from '../../components/dashboard/ExamAttempt';

const Exams = () => {
    const { collegeId } = useAuth();
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeExam, setActiveExam] = useState(null);

    const fetchExams = async () => {
        try {
            const data = await ExamService.getExams();
            setExams(data);
        } catch (error) {
            console.error("Error fetching exams:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!collegeId) return;
        fetchExams();
    }, [collegeId]);

    if (activeExam) {
        return <ExamAttempt examId={activeExam} onComplete={() => { setActiveExam(null); fetchExams(); }} />;
    }

    const upcoming = exams.filter(e => e.status === 'Active');
    const mockTests = exams.filter(e => e.category === 'Company-Mock' || e.category === 'Coding');

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-dark tracking-tight">Assessments</h1>
                    <p className="text-secondary text-sm font-semibold">Manage your training schedule and mock tests.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-6 py-3 bg-white text-dark text-xs font-bold rounded-2xl hover:bg-[#f4f7fe] transition-all flex items-center gap-2 shadow-card border border-white uppercase tracking-widest">
                        <History size={16} /> History
                    </button>
                    <button className="btn-primary">
                        Results
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Schedule Area */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-extrabold text-dark tracking-tight">Training Schedule</h2>
                    </div>

                    <div className="space-y-4">
                        {upcoming.map(exam => (
                            <div key={exam._id} className="card-main !p-8 group hover:border-primary/20 transition-all">
                                <div className="flex items-center gap-6">
                                    {/* Date Visual */}
                                    <div className="w-20 h-20 rounded-3xl bg-[#f4f7fe] flex flex-col items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                                            {new Date(exam.scheduledDate).toLocaleDateString('en-US', { month: 'short' })}
                                        </span>
                                        <span className="text-3xl font-extrabold">{new Date(exam.scheduledDate).getDate()}</span>
                                    </div>

                                    {/* Exam Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-dark group-hover:text-primary transition-colors">{exam.title}</h3>
                                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary">
                                                {exam.category}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-6 text-secondary font-bold text-xs uppercase tracking-wider">
                                            <span className="flex items-center gap-2"><Clock size={16} className="text-primary" /> {exam.duration} Min</span>
                                            <span className="flex items-center gap-2"><PlayCircle size={16} className="text-primary" /> {exam.questions?.length || 0} Qs</span>
                                        </div>
                                    </div>

                                    {/* Action */}
                                    <button
                                        onClick={() => {
                                            const width = window.screen.availWidth;
                                            const height = window.screen.availHeight;
                                            window.open(
                                                `/test/${exam._id}`,
                                                'AverqonSecureExam',
                                                `width=${width},height=${height},menubar=no,toolbar=no,location=no,status=no,resizable=no,scrollbars=yes`
                                            );
                                        }}
                                        className="btn-primary !px-6 !py-3 !rounded-xl !text-xs"
                                    >
                                        Launch
                                    </button>
                                </div>
                            </div>
                        ))}

                        {loading && [1, 2].map(i => (
                            <div key={i} className="bg-white/50 h-32 rounded-5xl animate-pulse border border-[#f4f7fe]" />
                        ))}

                        {!loading && upcoming.length === 0 && (
                            <div className="p-20 text-center border-2 border-dashed border-[#f4f7fe] rounded-5xl">
                                <ClipboardList size={40} className="text-secondary opacity-30 mx-auto mb-4" />
                                <p className="text-secondary font-bold text-sm">No active assessments available.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Context Area */}
                <div className="space-y-6">
                    <h2 className="text-xl font-extrabold text-dark tracking-tight">Placement Prep</h2>

                    <div className="card-main !p-8 bg-primary">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white"><Award size={20} /></div>
                            <h3 className="font-extrabold text-white text-sm tracking-tight">Company Mocks</h3>
                        </div>

                        <div className="space-y-3">
                            {mockTests.map(mock => (
                                <div key={mock._id} onClick={() => setActiveExam(mock._id)} className="p-4 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20 transition-all cursor-pointer">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-white">{mock.title}</span>
                                        <ChevronRight size={14} className="text-white/50" />
                                    </div>
                                </div>
                            ))}
                            {mockTests.length === 0 && (
                                <p className="text-white/50 text-xs font-semibold py-4">No simulations assigned.</p>
                            )}
                        </div>

                        <button className="w-full mt-6 py-3 bg-white text-primary font-bold rounded-2xl text-xs uppercase tracking-widest hover:brightness-110 transition-all">
                            View All Simulations
                        </button>
                    </div>

                    <div className="card-main !p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-[#f4f7fe] flex items-center justify-center text-primary"><Zap size={20} /></div>
                            <h3 className="text-xs font-bold text-dark uppercase tracking-widest">AI Prep Tip</h3>
                        </div>
                        <p className="text-sm text-secondary leading-relaxed font-semibold">
                            Based on your latest trends, focus on <span className="text-dark">Cloud Arch</span>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Exams;

