import React from 'react';
import { Lock, Radio, Users, MessageSquare, Mic } from 'lucide-react';
import { Link } from 'react-router-dom';

const Live = () => {
    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-red-500/10 text-red-400 font-bold text-xs uppercase tracking-widest mb-4 border border-red-500/20">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        Live Learning
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black mb-6">
                        Real-Time <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Video Classrooms</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Experience interactive live sessions with industry mentors. Raise hands, ask doubts, and collaborate in real-time.
                    </p>
                </div>

                <div className="bg-slate-800/50 border border-slate-700/50 rounded-[2rem] p-8 md:p-12 text-center relative overflow-hidden max-w-4xl mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent pointer-events-none" />

                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-slate-700 shadow-xl">
                            <Lock size={32} className="text-slate-500" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Secure Channel Access</h2>
                        <p className="text-slate-400 mb-10 max-w-lg mx-auto leading-relaxed">
                            Live sessions are encrypted and only accessible through the secure Averqon Campus OS portal for enrolled students and faculty.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 text-left">
                            {[
                                { t: "HD Video & Audio", d: "Crystal clear streaming", i: Radio },
                                { t: "Live Chat", d: "Instant doubt resolution", i: MessageSquare },
                                { t: "Interactive", d: "Polls & Breakout rooms", i: Users },
                            ].map((misc, i) => (
                                <div key={i} className="bg-slate-800 p-4 rounded-xl border border-slate-700/50">
                                    <misc.i size={20} className="text-red-500 mb-3" />
                                    <h4 className="font-bold text-sm mb-1">{misc.t}</h4>
                                    <p className="text-xs text-slate-500">{misc.d}</p>
                                </div>
                            ))}
                        </div>

                        <Link to="/login" className="inline-flex items-center justify-center px-10 py-4 bg-red-600 text-white font-bold rounded-2xl shadow-lg shadow-red-600/20 hover:bg-red-500 transition-all">
                            Login to Join Session
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Live;
