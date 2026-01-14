import React from 'react';
import { Lock, FileCheck, Brain, Target, ShieldCheck, Award, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Assessments = () => {
    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block py-1.5 px-4 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs uppercase tracking-widest mb-6">
                        AI-Powered Evaluation
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                        Smart <span className="text-primary italic">Assessments</span>
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
                        Test your skills with our adaptive testing engine. Get instant feedback, detailed analytics, and industry-recognized certification.
                    </p>
                </motion.div>

                {/* Main Card */}
                <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-xl shadow-slate-200/50 relative overflow-hidden text-center max-w-5xl mx-auto border border-slate-100">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500" />

                    {/* Feature Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 relative z-10">
                        {[
                            { t: "Adaptive Logic", i: Brain },
                            { t: "Proctored Exam", i: ShieldCheck },
                            { t: "Deep Analytics", i: BarChart3 },
                            { t: "Certifications", i: Award },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-lg transition-all group">
                                <item.i size={32} className="text-emerald-600 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{item.t}</span>
                            </div>
                        ))}
                    </div>

                    <div className="max-w-2xl mx-auto relative z-10">
                        <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-8 text-emerald-600 border border-emerald-100">
                            <Lock size={32} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-6">Exam Environment Secure</h2>
                        <p className="text-slate-500 mb-10 text-lg leading-relaxed font-medium">
                            Our assessment platform uses proctoring and AI analysis to ensure integrity. Access is strictly limited to authenticated users within the secure portal.
                        </p>

                        <Link to="/login" className="inline-flex px-12 py-5 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all hover:-translate-y-1">
                            Login to Start Assessment
                        </Link>
                    </div>

                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-50 rounded-full blur-[100px] opacity-60" />
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-50 rounded-full blur-[100px] opacity-60" />
                </div>
            </div>
        </div>
    );
};

export default Assessments;
