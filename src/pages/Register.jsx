import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Loader2, Sparkles, GraduationCap, CheckCircle2 } from 'lucide-react';
import { AuthService } from '../services/auth';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await AuthService.register(name, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex overflow-x-hidden selection:bg-slate-200">
            {/* Left Decorative Section - Hidden on Mobile */}
            <div className="hidden lg:flex lg:w-[45%] bg-slate-950 relative overflow-hidden items-center justify-center p-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,71,230,0.15),transparent_70%)]" />

                {/* Animated Background Elements */}
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-spin-slow" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse" />

                <div className="relative z-10 max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-slate-300 text-xs font-black uppercase tracking-widest">
                            <Sparkles size={14} className="text-primary" /> Future of Learning
                        </div>

                        <h1 className="text-6xl font-black text-white leading-[1.1] tracking-tighter">
                            Start your <span className="text-primary">academic</span> journey today.
                        </h1>

                        <p className="text-xl text-slate-400 font-medium leading-relaxed">
                            Join thousands of students mastering technology through structured paths and live mentorship.
                        </p>

                        <div className="grid grid-cols-1 gap-6 pt-8">
                            {[
                                { title: 'Personalized Paths', desc: 'AI-driven curriculum tailored for you.' },
                                { title: 'Live Mentorship', desc: 'Direct access to industry experts.' }
                            ].map((feat, i) => (
                                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">{feat.title}</h3>
                                        <p className="text-sm text-slate-500 font-medium">{feat.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Registration Section */}
            <div className="w-full lg:w-[55%] flex flex-col justify-center px-6 md:px-24 xl:px-40 py-12 lg:py-0 bg-white relative">
                <div className="max-w-md w-full mx-auto">
                    <div className="mb-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white mb-6 shadow-xl shadow-primary/20"
                        >
                            <GraduationCap size={28} />
                        </motion.div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Create Account</h2>
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Student Portal Registration</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-red-50 border border-red-100 text-red-600 text-sm p-4 rounded-2xl mb-8 flex items-center gap-3 font-bold"
                        >
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    required
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-12 py-4 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                                    placeholder="Enter your full name"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Institutional Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-12 py-4 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                                    placeholder="name@email.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Secret Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    required
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-12 py-4 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary hover:bg-slate-900 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-2xl shadow-primary/20 hover:shadow-slate-900/20 disabled:opacity-70 group"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        <span>Create Identity</span>
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-slate-500 font-bold text-sm">
                            Already part of the academy?
                            <Link to="/login" className="text-primary font-black ml-2 hover:underline decoration-2 underline-offset-4">Log In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
