import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, BookOpen, MonitorPlay, Briefcase, Award, Info, User, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { AuthService } from '../../services/auth';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { currentUser, isAdmin, logout: handleCtxLogout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await handleCtxLogout();
            navigate('/');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/', icon: null },
        { name: 'Courses', path: '/courses', icon: BookOpen },
        { name: 'Live Classes', path: '/live', icon: MonitorPlay },
        { name: 'Placement Hub', path: '/placement', icon: Briefcase },
        { name: 'Assessments', path: '/assessments', icon: Award },
        { name: 'About', path: '/about', icon: Info },
    ];

    return (
        <nav
            className={clsx(
                'fixed w-full z-50 transition-all duration-300 border-b',
                scrolled ? 'bg-white/80 backdrop-blur-md border-slate-200 py-3 shadow-sm' : 'bg-transparent border-transparent py-5'
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-full">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <img src="/logo_campus_os.png" alt="Averqon Logo" className="w-10 h-10 object-contain drop-shadow-sm" />
                        <span className="text-2xl font-black text-slate-900 tracking-tighter">
                            Averqon<span className="text-primary italic">OS</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={clsx(
                                    'text-sm font-medium transition-colors duration-200 hover:text-primary relative group',
                                    location.pathname === link.path ? 'text-primary' : (scrolled ? 'text-slate-600' : 'text-slate-700')
                                )}
                            >
                                {link.name}
                                {location.pathname === link.path && (
                                    <motion.span
                                        layoutId="underline"
                                        className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full"
                                    />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        {currentUser ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    to="/dashboard"
                                    className="text-slate-600 hover:text-primary font-medium transition-colors"
                                >
                                    Dashboard
                                </Link>
                                {isAdmin && (
                                    <Link
                                        to="/admin"
                                        className="text-primary font-bold transition-colors"
                                    >
                                        Admin Panel
                                    </Link>
                                )}
                                <Link
                                    to="/profile"
                                    className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors border border-slate-200"
                                >
                                    <User size={20} />
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-5 py-2.5 rounded-full text-sm font-medium text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="relative group">
                                    <button className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 border border-slate-200 flex items-center gap-2">
                                        Portals <ChevronDown size={14} />
                                    </button>
                                    <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 z-50">
                                        <Link to="/login/student" className="block px-4 py-2 text-xs font-bold text-slate-600 hover:bg-purple-50 hover:text-purple-600 transition-colors">🎓 Student Portal</Link>
                                        <Link to="/login/faculty" className="block px-4 py-2 text-xs font-bold text-slate-600 hover:bg-violet-50 hover:text-violet-600 transition-colors">👨‍🏫 Faculty Portal</Link>
                                        <Link to="/login/admin" className="block px-4 py-2 text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">🏢 Admin Portal</Link>
                                        <Link to="/login/placement" className="block px-4 py-2 text-xs font-bold text-slate-600 hover:bg-fuchsia-50 hover:text-fuchsia-600 transition-colors">💼 Placement Portal</Link>
                                        <div className="my-1 border-t border-slate-100" />
                                        <Link to="/login/superadmin" className="block px-4 py-2 text-xs font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">⚡ Super Admin</Link>
                                    </div>
                                </div>
                                <Link
                                    to="/register"
                                    className="px-5 py-2.5 rounded-full text-sm font-medium bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-primary/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg text-slate-600 hover:text-primary hover:bg-slate-100 transition-colors"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-slate-200 shadow-xl overflow-hidden"
                    >
                        <div className="px-4 py-4 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors"
                                >
                                    {link.icon && <link.icon size={18} className="text-primary" />}
                                    <span className="font-medium">{link.name}</span>
                                </Link>
                            ))}
                            <div className="pt-4 mt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-3 rounded-xl text-center text-sm font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors"
                                >
                                    Log In
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-3 rounded-xl text-center text-sm font-bold text-white bg-primary hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
