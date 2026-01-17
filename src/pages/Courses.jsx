import React from 'react';
import { Lock, BookOpen, Clock, Code, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Courses = () => {
    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-6">
                        Premium Curriculum
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                        Industry-Grade <span className="text-primary italic">Masterclasses</span>
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
                        Unlock a world of knowledge with our meticulously crafted courses.
                        From Full Stack Development to AI & ML, we have it all secure in our Campus OS.
                    </p>
                </motion.div>

                {/* Categories */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {['Web Development', 'Data Science', 'Cloud & DevOps', 'Cyber Security', 'UI/UX Design'].map((cat, i) => (
                        <div key={i} className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm shadow-sm hover:border-primary/30 transition-all cursor-default">
                            {cat}
                        </div>
                    ))}
                </div>

                {/* Static Course Grid (Not Blurred) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 relative">
                    {[
                        { t: "Full Stack Web Development", c: "Development", i: Code, color: "text-blue-500", bg: "bg-blue-50" },
                        { t: "Data Science & AI/ML", c: "Data", i: BookOpen, color: "text-purple-500", bg: "bg-purple-50" },
                        { t: "Cloud Architecture (AWS)", c: "Cloud", i: Clock, color: "text-orange-500", bg: "bg-orange-50" },
                        { t: "Ethical Hacking & Security", c: "Security", i: Shield, color: "text-red-500", bg: "bg-red-50" },
                        { t: "UI/UX & Product Design", c: "Design", i: Code, color: "text-emerald-500", bg: "bg-emerald-50" },
                        { t: "Mobile App Development", c: "Mobile", i: Code, color: "text-primary", bg: "bg-primary/10" },
                    ].map((item, i) => (
                        <div key={i} className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                            <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-6`}>
                                <item.i size={24} />
                            </div>
                            <span className="inline-block px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">{item.c}</span>
                            <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-primary transition-colors">{item.t}</h3>
                            <p className="text-slate-400 text-sm font-medium mb-6">Comprehensive curriculum designed by industry experts with real-world projects.</p>

                            <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                                <Link to="/login" className="flex-1 py-2.5 bg-slate-900 text-white text-center rounded-xl text-sm font-bold hover:bg-primary transition-all flex items-center justify-center gap-2">
                                    <Lock size={14} /> Enroll Now
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Login Prompt Banner */}
                <div className="bg-primary rounded-[3rem] p-12 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black text-white mb-6">Ready to start your journey?</h2>
                        <p className="text-white/80 max-w-xl mx-auto mb-8 font-medium">
                            Join thousands of students learning on Averqon Campus OS. Get access to premium content, live mentorship, and placement support.
                        </p>
                        <Link to="/login" className="inline-flex px-8 py-4 bg-white text-primary font-black rounded-2xl hover:bg-slate-50 transition-all shadow-xl">
                            Login into Campus OS
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Courses;
