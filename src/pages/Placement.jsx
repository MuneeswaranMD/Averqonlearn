import React from 'react';
import { Lock, Briefcase, TrendingUp, Building2, UserCheck, Search, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Placement = () => {
    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block py-1.5 px-4 rounded-full bg-purple-50 text-purple-600 font-bold text-xs uppercase tracking-widest mb-6">
                        Career Command Center
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                        Placement <span className="text-primary italic">Hub</span>
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
                        Connect with top recruiters, track applications, and manage high-velocity hiring drives from a single, unified dashboard.
                    </p>
                </motion.div>

                {/* Features Split */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
                    <div className="space-y-8">
                        {[
                            { t: "Recruitment Drives", d: "Exclusive access to on-campus & off-campus drives.", i: Building2, c: "bg-purple-50 text-purple-600" },
                            { t: "Application Tracking", d: "Real-time updates on your interview status.", i: TrendingUp, c: "bg-blue-50 text-blue-600" },
                            { t: "Profile Verification", d: "Verified academic and skill records for recruiters.", i: UserCheck, c: "bg-emerald-50 text-emerald-600" },
                        ].map((feat, i) => (
                            <div key={i} className="flex gap-6 p-6 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all">
                                <div className={`w-14 h-14 rounded-2xl ${feat.c} flex items-center justify-center shrink-0`}>
                                    <feat.i size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{feat.t}</h3>
                                    <p className="text-slate-500 leading-relaxed font-medium">{feat.d}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 bg-purple-500/5 blur-[80px] rounded-full" />
                        <div className="relative bg-white border border-slate-200 rounded-[3rem] p-10 shadow-2xl text-center">
                            <div className="w-20 h-20 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-8 text-purple-600 border border-purple-100">
                                <Lock size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4">Restricted Portal</h3>
                            <p className="text-slate-500 mb-8 font-medium leading-relaxed">
                                Placement drives, salary data, and recruiter connections are confidential. Access is strictly limited to verified final-year students and Placement Officers.
                            </p>
                            <Link to="/login" className="inline-flex px-8 py-4 bg-purple-600 text-white font-black rounded-2xl shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-all">
                                Login to Placement Portal
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Hiring Partners Ticker (Static) */}
                <div className="border-t border-slate-100 pt-16">
                    <p className="text-center text-slate-400 font-bold uppercase tracking-widest text-xs mb-8">Trusted by Hiring Partners</p>
                    <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale">
                        {['Google', 'Microsoft', 'Amazon', 'TCS', 'Infosys', 'Wipro'].map((logo, i) => (
                            <span key={i} className="text-xl font-black text-slate-300">{logo}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Placement;
