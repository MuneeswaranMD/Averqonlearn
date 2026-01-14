import React from 'react';
import { Lock, FileCheck, Brain, Target, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Assessments = () => {
    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <span className="inline-block py-1 px-3 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs uppercase tracking-widest mb-4">
                        AI-Powered Evaluation
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                        Smart <span className="text-emerald-600">Assessments</span>
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                        Test your skills with our adaptive testing engine. Get instant feedback, detailed analytics, and certification.
                    </p>
                </div>

                <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-xl shadow-slate-200/50 relative overflow-hidden text-center max-w-5xl mx-auto">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500" />

                    <div className="max-w-2xl mx-auto relative z-10">
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-600">
                            <Lock size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Exam Environment Secure</h2>
                        <p className="text-slate-500 mb-10 text-lg leading-relaxed">
                            Our assessment platform uses proctoring and AI analysis to ensure integrity. Access is strictly limited to authenticated users within the secure portal.
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                            {[
                                { t: "Adaptive", i: Brain },
                                { t: "Proctored", i: ShieldCheck },
                                { t: "Analytics", i: Target },
                                { t: "Certified", i: FileCheck },
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <item.i size={24} className="text-emerald-600" />
                                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">{item.t}</span>
                                </div>
                            ))}
                        </div>

                        <Link to="/login" className="inline-flex px-10 py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95">
                            Login to Start Assessment
                        </Link>
                    </div>

                    {/* Decorative Background Elements */}
                    <div className="absolute top-20 -left-20 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50" />
                    <div className="absolute bottom-20 -right-20 w-64 h-64 bg-teal-50 rounded-full blur-3xl opacity-50" />
                </div>
            </div>
        </div>
    );
};

export default Assessments;
