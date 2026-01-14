import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ChevronLeft, Loader2, ShieldCheck, Mail, Lock, Sparkles, Building2, UserCircle, Briefcase, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = ({ role: initialRole }) => {
    const [selectedRole, setSelectedRole] = useState(initialRole || null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { loginWithRole } = useAuth();

    const roleData = {
        student: { label: 'Student', portal: 'Academy', color: 'indigo', icon: GraduationCap, bg: 'bg-indigo-600', text: 'text-indigo-600', shadow: 'shadow-indigo-500/20', desc: 'Learning & Growth' },
        faculty: { label: 'Faculty', portal: 'Educator', color: 'violet', icon: UserCircle, bg: 'bg-violet-600', text: 'text-violet-600', shadow: 'shadow-violet-500/20', desc: 'Teaching & Mentorship' },
        collegeAdmin: { label: 'Admin', portal: 'Institution', color: 'blue', icon: Building2, bg: 'bg-blue-600', text: 'text-blue-600', shadow: 'shadow-blue-500/20', desc: 'Management & Control' },
        placement: { label: 'Placement', portal: 'Career Hub', color: 'fuchsia', icon: Briefcase, bg: 'bg-fuchsia-600', text: 'text-fuchsia-600', shadow: 'shadow-fuchsia-500/20', desc: 'Opportunities & Success' },
        superAdmin: { label: 'Super Admin', portal: 'Global Control', color: 'emerald', icon: ShieldCheck, bg: 'bg-emerald-600', text: 'text-emerald-600', shadow: 'shadow-emerald-500/20', desc: 'Infrastructure & Safety' }
    };

    const currentRole = roleData[selectedRole] || null;

    useEffect(() => {
        if (selectedRole) {
            const demoCreds = {
                superAdmin: { e: 'muneeswaran@averqon.in', p: 'password123' },
                collegeAdmin: { e: 'admin@ait.edu', p: 'password123' },
                faculty: { e: 'faculty@ait.edu', p: 'password123' },
                student: { e: 'student@ait.edu', p: 'password123' },
                placement: { e: 'tpo@ait.edu', p: 'password123' }
            };
            if (demoCreds[selectedRole]) {
                setEmail(demoCreds[selectedRole].e);
                setPassword(demoCreds[selectedRole].p);
            }
        }
    }, [selectedRole]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await loginWithRole(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    if (!selectedRole) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 selection:bg-indigo-100">
                <div className="w-full max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-indigo-100 shadow-sm">
                            <Sparkles size={14} className="animate-pulse" /> Unified Authentication System
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">Select your <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">Portal</span></h1>
                        <p className="text-slate-500 font-medium text-lg max-w-xl mx-auto">Access your learning, teaching, or management environment through the designated gateway.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        {Object.entries(roleData).map(([id, data], index) => (
                            <motion.button
                                key={id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => navigate(`/login/${id === 'collegeAdmin' ? 'admin' : id.toLowerCase()}`)}
                                className="group relative bg-white p-8 rounded-[2.5rem] border border-slate-200 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all text-left flex flex-col h-full overflow-hidden"
                            >
                                <div className={`w-14 h-14 ${data.bg} rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg ${data.shadow} group-hover:scale-110 transition-transform duration-500`}>
                                    <data.icon size={28} />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">{data.label}</h3>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4">{data.desc}</p>

                                <div className="mt-auto pt-4 flex items-center gap-2 text-indigo-600 text-xs font-black opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                                    ENTER PORTAL <ChevronLeft size={16} className="rotate-180" />
                                </div>

                                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 rounded-full opacity-50 group-hover:bg-indigo-50 transition-colors" />
                            </motion.button>
                        ))}
                    </div>

                    <div className="mt-20 text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">AVERQON LEARN OS • v2.0.4</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white overflow-x-hidden selection:bg-slate-200">
            <div className="flex w-full min-h-screen">

                {/* Side: Welcome Mesh Illustration */}
                <div className={`hidden lg:flex w-[45%] ${currentRole.bg} relative overflow-hidden flex-col justify-between p-16`}>
                    {/* Dynamic Mesh Background */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute top-0 left-0 w-full h-full opacity-40 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.4),transparent_50%)]" />
                        <div className="absolute -top-1/4 -right-1/4 w-[150%] h-[150%] animate-spin-slow opacity-20 bg-[conic-gradient(from_0deg,transparent,rgba(255,255,255,0.4),transparent)]" />
                    </div>

                    <div className="relative z-10">
                        <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors font-black text-[10px] uppercase tracking-[0.4em] mb-20 group">
                            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
                        </Link>

                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            <div className="w-16 h-1 rounded-full bg-white/20" />
                            <h2 className="text-6xl xl:text-7xl font-black text-white leading-[0.9] tracking-tight">
                                {currentRole.portal.split(' ').map((word, i) => (
                                    <React.Fragment key={i}>
                                        {word}<br />
                                    </React.Fragment>
                                ))}
                                <span className="opacity-40 italic">Portal</span>
                            </h2>
                            <p className="text-xl text-white/50 font-medium max-w-sm leading-relaxed">Securely access your institutional workspace with Averqon Learn Identity.</p>
                        </motion.div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center justify-center flex-grow">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 1 }}
                            className="relative"
                        >
                            <img
                                src="/login_illustration_student.png"
                                alt="Portal Illustration"
                                className="w-full max-w-[450px] drop-shadow-[0_45px_100px_rgba(0,0,0,0.3)] filter contrast-110"
                                onError={(e) => { e.target.src = 'https://cdni.iconscout.com/illustration/premium/thumb/university-student-4475416-3721950.png'; }}
                            />
                        </motion.div>
                    </div>

                    <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-8">
                        <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.6em]">SECURE ACCESS POINT</p>
                        <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em]">0X-ENCRYPTED</p>
                    </div>
                </div>

                {/* Main: Login Details (Editorial Light) */}
                <div className="w-full lg:w-[55%] flex flex-col justify-center px-6 md:px-24 xl:px-40 py-12 lg:py-0 bg-white relative">
                    <div className="max-w-md w-full mx-auto space-y-8 lg:space-y-12">
                        {/* Mobile Back Button */}
                        <div className="lg:hidden mb-4">
                            <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 font-black text-[9px] uppercase tracking-widest group">
                                <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Portal Select
                            </Link>
                        </div>

                        <div className="space-y-4 text-center lg:text-left">
                            <div className={`w-20 h-20 ${currentRole.bg} rounded-[2rem] flex items-center justify-center text-white mx-auto lg:mx-0 shadow-2xl ${currentRole.shadow}`}>
                                <currentRole.icon size={40} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Welcome Back</h1>
                                <p className="text-slate-500 font-medium">Please enter your {currentRole.label.toLowerCase()} credentials.</p>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-red-50 text-red-600 text-xs p-5 rounded-2xl font-bold border border-red-100 italic"
                                >
                                    ⚠️ {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleLogin} className="space-y-8 lg:space-y-12">
                            <div className="space-y-2 group">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Email Identity</label>
                                    <Mail size={14} className="text-slate-200 group-focus-within:text-indigo-400 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    placeholder="yourname@averqon.com"
                                    className="w-full py-4 bg-slate-50 border-b-2 border-slate-100 text-slate-900 font-bold focus:outline-none focus:border-slate-900 transition-all placeholder:text-slate-300 px-1"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2 group">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Secret Key</label>
                                    <Lock size={14} className="text-slate-200 group-focus-within:text-indigo-400 transition-colors" />
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        placeholder="••••••••"
                                        className="w-full py-4 bg-slate-50 border-b-2 border-slate-100 text-slate-900 font-bold focus:outline-none focus:border-slate-900 transition-all placeholder:text-slate-300 px-1"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 p-2 transition-colors rounded-lg hover:bg-slate-100"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <button type="button" className="text-[10px] font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest decoration-2 underline-offset-8 hover:underline italic">
                                    Recover Account?
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full h-16 ${currentRole.bg} text-white font-black rounded-2xl transition-all shadow-2xl ${currentRole.shadow} active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3 text-lg hover:brightness-110 tracking-tight uppercase tracking-widest`}
                            >
                                {loading ? <Loader2 className="animate-spin" size={24} /> : "Authorize Access"}
                            </button>
                        </form>

                        <div className="pt-12 text-center lg:text-left flex flex-col sm:flex-row items-center gap-6">
                            <button onClick={() => navigate('/login')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-all flex items-center gap-2 px-6 py-3 bg-slate-50 hover:bg-indigo-50 rounded-xl group">
                                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Switch Portal
                            </button>
                            {!selectedRole.includes('superAdmin') && (
                                <p className="text-[10px] text-slate-400 font-bold">Don't have access? <Link to="/register" className="text-indigo-600 hover:underline">Contact Admin</Link></p>
                            )}
                        </div>
                    </div>

                    {/* Footer Branding */}
                    <div className="absolute bottom-10 left-0 w-full px-12 md:px-24 xl:px-40 flex justify-between items-center opacity-20 hidden lg:flex">
                        <p className="font-black text-[10px] tracking-tighter">AV-LRN CORE</p>
                        <div className="flex gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-900 opacity-50" />
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-900 opacity-20" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;
