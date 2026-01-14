import React from 'react';
import { Lock, BookOpen, Clock, Award, CheckCircle, Video, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

const Courses = () => {
    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-widest mb-4">
                        Premium Curriculum
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                        Industry-Grade <span className="text-primary">Masterclasses</span>
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                        Unlock a world of knowledge with our meticulously crafted courses.
                        From Full Stack Development to AI & ML, we have it all secure in our Campus OS.
                    </p>
                </div>

                {/* Restricted Content Notice */}
                <div className="bg-white border border-slate-200 rounded-[2rem] p-8 md:p-12 text-center shadow-xl shadow-slate-200/50 mb-20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-400">
                            <Lock size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Content Protected</h2>
                        <p className="text-slate-500 mb-8 max-w-lg mx-auto">
                            Our comprehensive library of 500+ hours of video content, project files, and assignments is exclusively available to registered students via the secure Campus OS portal.
                        </p>
                        <Link to="/login" className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                            Login to Access Library
                        </Link>
                    </div>
                </div>

                {/* Course Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-50 pointer-events-none select-none filter blur-[1px]">
                    {[
                        { t: "Full Stack Development", c: "Web", i: Code },
                        { t: "Data Science & AI", c: "Data", i: BookOpen },
                        { t: "DevOps Engineering", c: "Cloud", i: Clock },
                    ].map((item, i) => (
                        <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6">
                            <div className="w-full h-40 bg-slate-100 rounded-xl mb-4"></div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-400 uppercase">{item.c}</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{item.t}</h3>
                            <div className="h-4 w-3/4 bg-slate-100 rounded mb-4"></div>
                            <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                                <span className="h-8 w-20 bg-slate-100 rounded-lg"></span>
                                <span className="h-8 w-8 bg-slate-100 rounded-lg"></span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Courses;
