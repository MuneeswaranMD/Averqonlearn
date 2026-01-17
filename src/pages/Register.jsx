import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, User, ArrowRight, Loader2, Sparkles, Building2, Phone, Briefcase, CheckCircle2 } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        institutionName: '',
        contactPerson: '',
        email: '',
        phone: '',
        role: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call for booking
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
            // navigate('/dashboard'); // Maybe don't navigate immediately for a booking form
        }, 1500);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-slate-50 border border-slate-100 rounded-3xl p-10 text-center shadow-xl shadow-slate-200/50">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-4">Request Received!</h2>
                    <p className="text-slate-500 mb-8 leading-relaxed">
                        Thank you for your interest in Averqon LMS. Our institutional team will contact you at <span className="font-bold text-slate-700">{formData.email}</span> within 24 hours to schedule your personalized demo.
                    </p>
                    <Link to="/" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
                        <ArrowRight size={16} className="rotate-180" /> Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex overflow-x-hidden selection:bg-primary/10">
            {/* Left Decorative Section - Institutional Focus */}
            <div className="hidden lg:flex lg:w-[45%] bg-slate-950 relative overflow-hidden items-center justify-center p-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,71,230,0.15),transparent_70%)]" />

                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-spin-slow" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] animate-pulse" />

                <div className="relative z-10 max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-slate-300 text-xs font-black uppercase tracking-widest">
                            <Sparkles size={14} className="text-primary" /> Institutional Solutions
                        </div>

                        <h1 className="text-5xl xl:text-6xl font-black text-white leading-[1.1] tracking-tighter">
                            Transform your campus with <span className="text-primary">Averqon.</span>
                        </h1>

                        <p className="text-lg text-slate-400 font-medium leading-relaxed">
                            Deploy a world-class Learning Management System tailored for modern education. Seamless management, powerful analytics, and student success.
                        </p>

                        <div className="grid grid-cols-1 gap-5 pt-6">
                            {[
                                { title: 'Seamless Integration', desc: 'Works with your existing ERP & SIS.' },
                                { title: 'Advanced Analytics', desc: 'Track student performance in real-time.' },
                                { title: 'Scalable Infrastructure', desc: 'Built for 10,000+ concurrent users.' }
                            ].map((feat, i) => (
                                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default">
                                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">{feat.title}</h3>
                                        <p className="text-xs text-slate-400 font-medium mt-1">{feat.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Booking Form Section */}
            <div className="w-full lg:w-[55%] flex flex-col justify-center px-4 md:px-20 xl:px-32 py-8 lg:py-0 bg-white relative">
                <div className="max-w-xl w-full mx-auto">
                    <div className="mb-6 md:mb-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6"
                        >
                            <Building2 size={24} />
                        </motion.div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-2">Book Your LMS Portal</h2>
                        <p className="text-slate-500 font-medium text-sm">Fill in the details below to schedule a demo and get access credentials for your institution.</p>
                    </div>

                    <form onSubmit={handleBooking} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                        <div className="md:col-span-2 space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Institution Name</label>
                            <div className="relative group">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    required
                                    name="institutionName"
                                    type="text"
                                    value={formData.institutionName}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                                    placeholder="e.g. Springfield Institute of Technology"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Contact Person</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    required
                                    name="contactPerson"
                                    type="text"
                                    value={formData.contactPerson}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                                    placeholder="Full Name"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Role / Designation</label>
                            <div className="relative group">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    required
                                    name="role"
                                    type="text"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                                    placeholder="e.g. Principal / HOD"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Official Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    required
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                                    placeholder="contact@institution.edu"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Phone Number</label>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    required
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-slate-900 hover:bg-primary text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-primary/30 disabled:opacity-70 group"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        <span>Request Access</span>
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-500 font-medium text-sm">
                            Already have an admin account?
                            <Link to="/login" className="text-primary font-black ml-2 hover:underline decoration-2 underline-offset-4">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
