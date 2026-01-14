import React from 'react';
import { Lock, Radio, Users, MessageSquare, Mic, Video, Calendar, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Live = () => {
    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-red-500/10 text-red-500 font-bold text-xs uppercase tracking-widest mb-6 border border-red-500/20">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        Live Learning Ecosystem
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                        Real-Time <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Interactive Classrooms</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
                        Experience immersive live sessions with industry mentors. Raise hands, ask doubts, and collaborate in real-time within our secure channel.
                    </p>
                </motion.div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {[
                        { t: "HD Video Streaming", d: "Crystal clear low-latency video", i: Video, c: "text-red-500" },
                        { t: "Instant Doubt Solving", d: "Live chat & voice interaction", i: MessageSquare, c: "text-orange-500" },
                        { t: "Breakout Rooms", d: " collaborative group study", i: Users, c: "text-purple-500" },
                    ].map((item, i) => (
                        <div key={i} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl hover:border-slate-700 transition-all">
                            <item.i size={32} className={`${item.c} mb-6`} />
                            <h3 className="text-xl font-bold mb-3">{item.t}</h3>
                            <p className="text-slate-500 font-medium">{item.d}</p>
                        </div>
                    ))}
                </div>

                {/* Secure Access Banner */}
                <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-12 relative overflow-hidden text-center max-w-4xl mx-auto">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-[100px]" />

                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-slate-700">
                            <Lock size={28} className="text-slate-400" />
                        </div>
                        <h2 className="text-3xl font-black mb-6">Secure Channel Access</h2>
                        <p className="text-slate-400 mb-10 text-lg max-w-2xl mx-auto leading-relaxed">
                            Live sessions are encrypted and exclusively accessible through the secure Averqon Campus OS portal for enrolled students and faculty.
                        </p>
                        <Link to="/login" className="inline-flex items-center gap-3 px-10 py-5 bg-red-600 text-white font-black rounded-2xl shadow-xl shadow-red-600/20 hover:bg-red-500 transition-all">
                            <Zap size={18} className="fill-white" /> Login to Join Session
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Live;
