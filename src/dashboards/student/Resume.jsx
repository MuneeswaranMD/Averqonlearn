import React, { useState, useEffect } from 'react';
import {
    FileText, Zap, Award, Target,
    Upload, Download, Edit3, Trash2,
    Eye, Sparkles, BrainCircuit, ChevronRight,
    AlertCircle, CheckCircle2, RefreshCcw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Resume = () => {
    const { currentUser } = useAuth();
    const [resumeData, setResumeData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResume = async () => {
            // Mock dynamic loading
            setLoading(true);
            setTimeout(() => {
                setResumeData({
                    score: 82,
                    lastUpdated: 'Oct 14, 2026',
                    fileName: 'Muneeswaran_Resume_v2.pdf',
                    keywords: ['Python', 'React', 'Firebase', 'Data Structures'],
                    missingKeywords: ['Redux', 'Dockers', 'AWS'],
                    atsAnalysis: 'High probability for Software Engineer roles.'
                });
                setLoading(false);
            }, 1000);
        };
        fetchResume();
    }, [currentUser]);

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Career Builder</h1>
                    <p className="text-slate-500 mt-1">Optimize your resume for applicant tracking systems (ATS).</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2">
                        <Upload size={18} /> Upload New Version
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ATS Analysis Score */}
                <div className="bg-white border border-slate-200 rounded-[40px] p-10 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-bl-full -mr-20 -mt-20 group-hover:scale-110 transition-all duration-700" />

                    <div className="relative z-10 text-center space-y-8">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">ATS Score</h3>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">A-Grade Potential</p>
                        </div>

                        <div className="relative w-48 h-48 mx-auto">
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-6xl font-black ${resumeData?.score >= 80 ? 'text-primary' : 'text-orange-500'}`}>{resumeData?.score || 0}</span>
                                <span className="text-slate-400 font-bold text-sm">/ 100</span>
                            </div>
                            <svg className="w-full h-full -rotate-90">
                                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                                <circle
                                    cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent"
                                    className="text-primary" strokeDasharray={552.92} strokeDashoffset={552.92 * (1 - (resumeData?.score || 0) / 100)}
                                />
                            </svg>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100 w-fit mx-auto">
                            <CheckCircle2 size={16} />
                            <span className="text-xs font-bold">Industry Ready</span>
                        </div>

                        <button className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 font-black rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all">
                            <RefreshCcw size={16} /> Re-scan Resume
                        </button>
                    </div>
                </div>

                {/* Resume Management */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Active Resume Card */}
                    <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl shadow-slate-200 relative overflow-hidden">
                        <Sparkles className="absolute top-8 right-8 text-white/10" size={64} />
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-10">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-primary border border-white/10 backdrop-blur-md">
                                        <FileText size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">{resumeData?.fileName || 'Loading...'}</h3>
                                        <p className="text-slate-400 text-xs font-medium">Last synced: {resumeData?.lastUpdated || 'Never'}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5"><Eye size={20} /></button>
                                    <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5"><Download size={20} /></button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                                    <h4 className="text-primary flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] mb-4">
                                        <BrainCircuit size={14} /> AI Analysis
                                    </h4>
                                    <p className="text-slate-300 text-sm font-medium leading-relaxed">
                                        {resumeData?.atsAnalysis || 'Analyzing your current resume for market fit...'}
                                    </p>
                                </div>
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                                    <h4 className="text-orange-400 flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] mb-4">
                                        <AlertCircle size={14} /> Gap Identified
                                    </h4>
                                    <p className="text-slate-300 text-sm font-medium leading-relaxed">
                                        Missing keywords: <span className="text-white font-bold">{resumeData?.missingKeywords.join(', ')}</span>
                                    </p>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                                Smart Editor <Edit3 size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Skill Tags */}
                    <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm">
                        <h4 className="text-slate-900 font-bold mb-6 flex items-center gap-2">
                            Detected Skills <Zap size={18} className="text-primary fill-primary/20" />
                        </h4>
                        <div className="flex flex-wrap gap-3">
                            {resumeData?.keywords.map((skill, i) => (
                                <span key={i} className="px-5 py-2.5 bg-slate-50 border border-slate-100 text-slate-600 text-xs font-bold rounded-2xl hover:bg-primary hover:text-white hover:border-primary transition-all cursor-default">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Resume;
