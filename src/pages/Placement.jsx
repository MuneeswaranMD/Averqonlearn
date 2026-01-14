import React from 'react';
import { Lock, Briefcase, TrendingUp, Building2, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Placement = () => {
    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <span className="inline-block py-1 px-3 rounded-full bg-purple-50 text-purple-600 font-bold text-xs uppercase tracking-widest mb-4">
                        Career Command Center
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                        Placement <span className="text-purple-600">Hub</span>
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                        Connect with top recruiters, track applications, and manage high-velocity hiring drives from a single dashboard.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
                    <div className="order-2 lg:order-1 relative">
                        <div className="absolute inset-0 bg-purple-100 rounded-[3rem] transform rotate-3" />
                        <div className="relative bg-white border border-slate-200 rounded-[3rem] p-10 shadow-2xl overflow-hidden">
                            {/* Mock Grid */}
                            <div className="space-y-6 opacity-40 filter blur-[1px]">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <div className="w-12 h-12 bg-slate-200 rounded-lg" />
                                        <div className="flex-1">
                                            <div className="h-4 w-32 bg-slate-200 rounded mb-2" />
                                            <div className="h-3 w-20 bg-slate-200 rounded" />
                                        </div>
                                        <div className="h-8 w-24 bg-purple-100 rounded-lg" />
                                    </div>
                                ))}
                            </div>

                            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center">
                                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4 text-purple-600">
                                    <Lock size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Restricted Access</h3>
                                <p className="text-slate-500 mb-6 text-sm">
                                    Placement drives, salary insights, and recruiter connections are confidential and securely accessible only to verified students and TPOs.
                                </p>
                                <Link to="/login" className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl shadow-lg hover:bg-purple-700 transition-all">
                                    Login to Portal
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2">
                        <div className="space-y-8">
                            {[
                                { t: "Recruitment Drives", d: "Exclusive access to on-campus & off-campus drives.", i: Building2 },
                                { t: "Application Tracking", d: "Real-time updates on your interview status.", i: TrendingUp },
                                { t: "Profile Verification", d: "Verified academic and skill records for recruiters.", i: UserCheck },
                            ].map((feat, i) => (
                                <div key={i} className="flex gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                                        <feat.i size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">{feat.t}</h3>
                                        <p className="text-slate-500 leading-relaxed">{feat.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Placement;
