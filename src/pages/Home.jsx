import React from 'react';
import {
    ArrowRight, CheckCircle2, Video, Shield, Cpu,
    Users, GraduationCap, Building2, Briefcase,
    Bot, Database, LayoutDashboard, Zap,
    ArrowUpRight, Globe, Layers, ScrollText, CheckCircle, Target
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    const roles = [
        {
            role: "For Students",
            icon: GraduationCap,
            color: "text-blue-500",
            bg: "bg-blue-50",
            description: "A personalized learning and career ecosystem.",
            features: [
                "Access subjects, video lectures, and notes",
                "Attend exams and view results",
                "Get instant help from an AI Tutor",
                "Build resumes and apply for placements",
                "Track placement status and offers"
            ]
        },
        {
            role: "For Faculty",
            icon: Users,
            color: "text-emerald-500",
            bg: "bg-emerald-50",
            description: "A complete academic workspace.",
            features: [
                "Upload video lectures (YouTube supported)",
                "Share notes, PDFs, and PPTs",
                "Create internal exams and assignments",
                "Track student performance and attendance",
                "Identify weak students using analytics"
            ]
        },
        {
            role: "For Placement Officers",
            icon: Briefcase,
            color: "text-purple-500",
            bg: "bg-purple-50",
            description: "A recruitment command center.",
            features: [
                "Manage company partnerships",
                "Publish job drives with eligibility rules",
                "Filter students by CGPA and skills",
                "Track applications using a visual pipeline",
                "Monitor placement statistics in real time"
            ]
        },
        {
            role: "For College Administration",
            icon: Building2,
            color: "text-orange-500",
            bg: "bg-orange-50",
            description: "An institutional control system.",
            features: [
                "Manage faculty, students, and placement officers",
                "Upload students in bulk using Excel",
                "Organize departments and academic structure",
                "Monitor academic progress and placements",
                "Control access, security, and licenses"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-white selection:bg-primary/10">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02]" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-slate-900 text-white font-bold text-xs mb-8 tracking-widest uppercase">
                                <Zap size={14} className="text-yellow-400" /> Introducing Averqon Campus OS
                            </span>
                        </motion.div>

                        <motion.h1
                            className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.9]"
                            {...fadeIn}
                        >
                            A Smart Learning & <span className="text-primary italic">Placement</span> Operating System.
                        </motion.h1>

                        <motion.p
                            className="text-xl md:text-2xl text-slate-500 mb-12 leading-relaxed font-medium"
                            {...fadeIn}
                            transition={{ delay: 0.2 }}
                        >
                            The all-in-one digital ecosystem for colleges. academics, AI-powered learning, and career placement into a single, secure platform.
                        </motion.p>

                        <motion.div
                            className="flex flex-col sm:flex-row items-center justify-center gap-6"
                            {...fadeIn}
                            transition={{ delay: 0.3 }}
                        >
                            <Link to="/login" className="w-full sm:w-auto px-10 py-5 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-lg transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 group">
                                Launch Dashboard
                                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <button className="w-full sm:w-auto px-10 py-5 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-100 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3">
                                Watch Demo
                                <Video size={22} />
                            </button>
                        </motion.div>

                        <motion.div
                            className="mt-20 flex flex-wrap justify-center gap-12"
                            {...fadeIn}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="flex flex-col items-center">
                                <span className="text-4xl font-black text-slate-900">100%</span>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Unified Data</span>
                            </div>
                            <div className="w-px h-12 bg-slate-100 hidden sm:block" />
                            <div className="flex flex-col items-center">
                                <span className="text-4xl font-black text-slate-900">Live</span>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">AI Tutoring</span>
                            </div>
                            <div className="w-px h-12 bg-slate-100 hidden sm:block" />
                            <div className="flex flex-col items-center">
                                <span className="text-4xl font-black text-slate-900">End-to-End</span>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Placement Tracking</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Problem/Solution Section */}
            <section className="py-24 bg-slate-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div {...fadeIn}>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-8">
                                Why Averqon Campus OS?
                            </h2>
                            <p className="text-lg text-slate-500 mb-10 leading-relaxed font-medium">
                                Traditional college systems rely on disconnected tools — classroom portals, spreadsheets, emails, and messaging apps.
                                <span className="text-slate-900 border-b-2 border-primary/20 ml-1 italic font-bold">Averqon replaces all of that</span> with a single intelligent system that simplifies operations and boosts outcomes.
                            </p>
                            <div className="space-y-4">
                                {[
                                    "One platform for the entire institution",
                                    "Role-based dashboards for every user",
                                    "AI-powered academic support",
                                    "End-to-end placement management"
                                ].map((text, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                            <CheckCircle size={14} />
                                        </div>
                                        <span className="font-bold text-slate-700">{text}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full" />
                            <div className="relative bg-slate-900 rounded-[2.5rem] p-4 shadow-2xl overflow-hidden group">
                                <div className="p-8 space-y-6">
                                    <div className="flex gap-4">
                                        <div className="w-3 h-3 rounded-full bg-red-400" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                        <div className="w-3 h-3 rounded-full bg-emerald-400" />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="h-4 w-3/4 bg-slate-800 rounded-full" />
                                        <div className="h-4 w-1/2 bg-slate-800 rounded-full" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="h-32 bg-slate-800/50 rounded-2xl border border-slate-700/50" />
                                            <div className="h-32 bg-slate-800/50 rounded-2xl border border-slate-700/50" />
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent flex items-center justify-center">
                                    <img src="/logo_campus_os.png" alt="OS Logo" className="w-32 h-32 object-contain drop-shadow-2xl animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Role-Based Section */}
            <section className="py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase">Built for Every Role</h2>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">A Complete Institutional Control System</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {roles.map((item, i) => (
                            <motion.div
                                key={i}
                                {...fadeIn}
                                transition={{ delay: i * 0.1 }}
                                className="group p-10 bg-white border-2 border-slate-50 rounded-[2.5rem] hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 h-full flex flex-col"
                            >
                                <div className="flex items-start justify-between mb-8">
                                    <div className={`p-5 rounded-[2rem] ${item.bg} ${item.color}`}>
                                        <item.icon size={32} />
                                    </div>
                                    <span className="p-2.5 rounded-full bg-slate-50 text-slate-400 group-hover:text-primary group-hover:bg-primary/5 transition-colors">
                                        <ArrowUpRight size={20} />
                                    </span>
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-3">{item.role}</h3>
                                <p className="text-slate-500 font-medium mb-8 italic">{item.description}</p>
                                <ul className="space-y-4 mt-auto">
                                    {item.features.map((feat, idx) => (
                                        <li key={idx} className="flex gap-3 text-sm font-bold text-slate-700">
                                            <div className="shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <CheckCircle2 size={12} />
                                            </div>
                                            {feat}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI Tutor Section */}
            <section className="py-32 bg-slate-950 text-white overflow-hidden relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[150px] rounded-full" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 blur-[150px] rounded-full" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="order-2 lg:order-1 relative">
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                                        <Bot size={32} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-xl tracking-tight">AI Academic Assistant</h4>
                                        <div className="flex gap-2 mt-1">
                                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase rounded">Online</span>
                                            <span className="px-2 py-0.5 bg-white/10 text-slate-400 text-[10px] font-black uppercase rounded">v2.0</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 bg-white/5 rounded-2xl text-sm font-medium border border-white/5 italic text-slate-400">
                                        "How does recursion work in Java?"
                                    </div>
                                    <div className="p-5 bg-primary/20 rounded-2xl text-sm font-bold border border-primary/20 text-slate-200">
                                        Recursion is a process where a function calls itself. It needs a base case to stop...
                                    </div>
                                </div>
                            </div>
                        </div>
                        <motion.div className="order-1 lg:order-2" {...fadeIn}>
                            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-8">
                                AI-Powered <span className="text-primary italic">Learning</span> Assistant
                            </h2>
                            <p className="text-lg text-slate-400 mb-10 leading-relaxed">
                                Averqon Campus OS includes an AI Tutor that works as a personal academic assistant for students, providing 24/7 support.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {[
                                    { t: "Syllabus Mastery", i: ScrollText },
                                    { t: "Concept Simplifier", i: Zap },
                                    { t: "MCQ Generator", i: LayoutDashboard },
                                    { t: "Interview Prep", i: Target }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <item.i size={20} className="text-primary" />
                                        <span className="font-black text-sm uppercase tracking-wider">{item.t}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Infra / Multi-tenant Section */}
            <section className="py-32 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20 max-w-3xl mx-auto">
                        <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Scalable Infrastructure</h2>
                        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">Multi-College, Multi-Tenant Architecture</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Institutional Isolation",
                                desc: "Each college operates in a secure, isolated environment. Data is never shared across institutions.",
                                icon: Shield,
                                color: "text-red-500"
                            },
                            {
                                title: "SaaS-Ready Scale",
                                desc: "Scalable architecture perfect for universities, college groups, and large training institutions.",
                                icon: Globe,
                                color: "text-blue-500"
                            },
                            {
                                title: "Role-Based Access",
                                desc: "Secure authentication and authorization with granular control over every classroom action.",
                                icon: Layers,
                                color: "text-emerald-500"
                            }
                        ].map((item, i) => (
                            <div key={i} className="p-8 bg-white rounded-3xl border border-slate-100 h-full">
                                <div className={`w-14 h-14 rounded-2xl bg-white shadow-lg border border-slate-50 flex items-center justify-center ${item.color} mb-8`}>
                                    <item.icon size={28} />
                                </div>
                                <h4 className="text-xl font-black text-slate-900 mb-4">{item.title}</h4>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Final CTA */}
            <section className="py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-primary rounded-[4rem] p-12 lg:p-24 relative overflow-hidden text-center text-white">
                        <div className="absolute inset-0 bg-slate-900/10 pointer-events-none" />
                        <motion.div {...fadeIn}>
                            <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-8">
                                One Platform. One System. <span className="opacity-50 italic">Total Control.</span>
                            </h2>
                            <p className="text-xl mb-12 text-white/80 max-w-2xl mx-auto font-medium">
                                Ready to transform your campus with the future of education? Join Averqon Campus OS today.
                            </p>
                            <div className="flex flex-wrap justify-center gap-12 mb-16 opacity-80">
                                <div className="flex items-center gap-2"><CheckCircle size={20} /> <span className="font-bold text-sm tracking-widest uppercase">Performance Tracking</span></div>
                                <div className="flex items-center gap-2"><CheckCircle size={20} /> <span className="font-bold text-sm tracking-widest uppercase">Placement Boost</span></div>
                                <div className="flex items-center gap-2"><CheckCircle size={20} /> <span className="font-bold text-sm tracking-widest uppercase">Real-time Insights</span></div>
                            </div>
                            <Link to="/register" className="inline-flex px-12 py-6 bg-white text-primary hover:bg-slate-50 rounded-2xl font-black text-xl transition-all shadow-2xl shadow-slate-900/20 group">
                                Get Started Now
                                <ArrowRight size={24} className="ml-3 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            <footer className="py-12 text-center border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                    © {new Date().getFullYear()} Averqon Campus OS. Reserved for the Future of Colleges.
                </p>
            </footer>
        </div>
    );
};

export default Home;
