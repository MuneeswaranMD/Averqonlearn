import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, Mail, Lock, Sparkles, Building2, UserCircle, Briefcase, GraduationCap, X, Rocket, ShieldCheck, ChevronRight } from 'lucide-react';
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
        student: { label: 'Student', icon: GraduationCap, desc: 'Learning & Growth' },
        faculty: { label: 'Faculty', icon: UserCircle, desc: 'Teaching & Mentorship' },
        collegeAdmin: { label: 'Admin', icon: Building2, desc: 'Institution Management' },
        placement: { label: 'Placement', icon: Briefcase, desc: 'Career Services' },
        superAdmin: { label: 'Infrastructure', icon: ShieldCheck, desc: 'System Control' }
    };

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
            setError(err.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans transition-colors duration-300">
            {/* Background Decorations */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    animate={{ y: [0, -20, 0], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute top-[10%] left-[5%] w-96 h-96 bg-primary/20 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{ y: [0, 20, 0], opacity: [0.05, 0.1, 0.05] }}
                    transition={{ duration: 12, repeat: Infinity }}
                    className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"
                />
            </div>

            {/* Header / Logo */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex items-center gap-2 relative z-10"
            >
                <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/30">
                    <Rocket className="text-white fill-white" size={28} />
                </div>
                <span className="text-2xl font-black text-text-primary tracking-tight">Averqon<span className="text-primary italic">OS</span></span>
            </motion.div>

            <AnimatePresence mode="wait">
                {!selectedRole ? (
                    <motion.div
                        key="selection"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-4xl relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {Object.entries(roleData).map(([id, data], idx) => (
                            <motion.button
                                key={id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                onClick={() => setSelectedRole(id)}
                                className="card-main group text-left flex flex-col h-full hover:border-primary/20 hover:scale-[1.02] transition-all bg-card"
                            >
                                <div className="w-14 h-14 bg-background rounded-2xl flex items-center justify-center text-primary mb-6 transition-colors group-hover:bg-primary group-hover:text-white">
                                    <data.icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-text-primary mb-1">{data.label}</h3>
                                <p className="text-sm text-text-secondary font-medium leading-relaxed">{data.desc}</p>
                                <div className="mt-8 flex items-center gap-2 text-primary text-xs font-extrabold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                                    Launch Portal <ChevronRight size={14} />
                                </div>
                            </motion.button>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="login-form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="card-main w-full max-w-[450px] relative z-10 px-10 py-12 bg-card"
                    >
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-extrabold text-text-primary mb-2 tracking-tight">Getting Started</h2>
                            <p className="text-sm text-text-secondary font-semibold">Login to your {roleData[selectedRole].label.toLowerCase()} account!</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-error/10 border border-error/10 text-error text-xs font-bold rounded-2xl flex items-center gap-2">
                                <X size={14} /> {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-text-primary ml-1">Your Email</label>
                                <input
                                    type="email"
                                    required
                                    className="input-primary"
                                    placeholder="mail@institution.edu"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-bold text-text-primary ml-1">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="input-primary"
                                        placeholder="Min. 8 characters"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between px-1">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" className="w-5 h-5 rounded-md border-border bg-background text-primary focus:ring-primary/20 accent-primary" />
                                    <span className="text-xs font-bold text-text-primary">Keep me logged in</span>
                                </label>
                                <button type="button" className="text-xs font-bold text-primary hover:underline">Forgot password?</button>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full mt-4"
                            >
                                {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Sign In"}
                            </button>
                        </form>

                        <div className="mt-8 flex items-center gap-4">
                            <div className="flex-1 h-px bg-border" />
                            <span className="text-xs font-bold text-text-secondary uppercase">or</span>
                            <div className="flex-1 h-px bg-border" />
                        </div>

                        <button className="w-full mt-8 py-4 bg-background rounded-2xl flex items-center justify-center gap-3 text-sm font-bold text-text-primary hover:bg-border/50 transition-all border border-border">
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/smartlock/google.svg" className="w-5 h-5" alt="Google" />
                            Sign in with Google
                        </button>

                        <div className="mt-8 text-center text-sm font-semibold text-text-secondary">
                            Not registered yet? <button onClick={() => setSelectedRole(null)} className="text-primary font-bold hover:underline">Go back to selection</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <footer className="mt-12 text-xs font-bold text-text-secondary flex items-center gap-6 relative z-10">
                <span>© {new Date().getFullYear()} Averqon OS. All Rights Reserved.</span>
                <div className="flex gap-4">
                    <a href="#" className="hover:text-primary transition-colors">Marketplace</a>
                    <a href="#" className="hover:text-primary transition-colors">License</a>
                    <a href="#" className="hover:text-primary transition-colors">Terms</a>
                </div>
            </footer>
        </div>
    );
};

export default Login;
