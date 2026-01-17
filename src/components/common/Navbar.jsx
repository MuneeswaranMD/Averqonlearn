import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Info, User, ChevronDown, Video, Briefcase, LayoutDashboard, Sun, Moon, Phone } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { currentUser, logout: handleCtxLogout } = useAuth();
    const { darkMode, toggleDarkMode } = useTheme();
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
        { name: 'About', path: '/about', icon: Info },
        { name: 'Contact', path: '/register', icon: Phone },
    ];

    return (
        <nav className="fixed top-0 left-0 w-full z-50 pointer-events-none flex flex-col items-center">
            <div className={clsx(
                "pointer-events-auto transition-all duration-300 w-full md:w-auto",
                "md:mt-6 md:rounded-full md:border md:border-border md:shadow-xl md:shadow-black/5",
                scrolled || isOpen ? "bg-card/90 backdrop-blur-xl border-border shadow-sm" : "bg-transparent md:bg-card/70 md:backdrop-blur-lg border-transparent",
                "px-4 md:px-6 py-3 md:py-3",
                isOpen && "bg-card"
            )}>
                <div className="flex items-center justify-between md:gap-8">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group mr-4 md:mr-0 pointer-events-auto">
                        <img src="/logo_campus_os.png" alt="Averqon Logo" className="w-8 h-8 md:w-9 md:h-9 object-contain" />
                        <span className="text-xl font-black text-text-primary tracking-tighter">
                            Averqon<span className="text-primary italic">OS</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1 bg-background/50 p-1 rounded-full border border-border">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={clsx(
                                    'relative px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-300',
                                    location.pathname === link.path
                                        ? 'text-text-primary bg-card shadow-sm'
                                        : 'text-text-secondary hover:text-primary hover:bg-background'
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Auth & Theme Buttons */}
                    <div className="hidden md:flex items-center gap-3 pl-4 border-l border-border">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 text-text-secondary hover:text-primary transition-all rounded-full hover:bg-background"
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {currentUser ? (
                            <div className="flex items-center gap-3">
                                <Link to="/dashboard" className="w-9 h-9 rounded-full bg-background flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white transition-all shadow-sm">
                                    <LayoutDashboard size={18} />
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-1.5 rounded-full text-xs font-black text-text-secondary border border-border hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 hover:border-red-200 transition-all uppercase tracking-wider"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="relative group">
                                    <button className="flex items-center gap-1 text-text-secondary hover:text-text-primary font-bold text-sm px-2 py-1">
                                        Portals <ChevronDown size={14} />
                                    </button>
                                    <div className="absolute top-full right-0 pt-4 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                        <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden p-1 shadow-black/10">
                                            {[
                                                { l: "Student Portal", p: "/login/student", c: "hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:text-blue-600" },
                                                { l: "Faculty Portal", p: "/login/faculty", c: "hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-600" },
                                                { l: "Admin Portal", p: "/login/admin", c: "hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:text-purple-600" },
                                                { l: "Placement Portal", p: "/login/placement", c: "hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:text-orange-600" }
                                            ].map((item, i) => (
                                                <Link key={i} to={item.p} className={`block px-4 py-2.5 text-xs font-bold text-text-secondary rounded-xl transition-colors ${item.c}`}>
                                                    {item.l}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <Link
                                    to="/login"
                                    className="bg-primary text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-primary/20 hover:brightness-110 transition-all transform hover:-translate-y-0.5"
                                >
                                    Login
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden items-center gap-2 pointer-events-auto">
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 text-text-secondary hover:text-primary transition-all rounded-full hover:bg-background"
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-text-secondary hover:text-primary transition-colors"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Content */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            className="md:hidden overflow-hidden w-full pointer-events-auto border-t border-border pt-2"
                        >
                            <div className="flex flex-col gap-2 pb-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        onClick={() => setIsOpen(false)}
                                        className="px-4 py-3 rounded-xl bg-background text-text-primary font-bold hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-3"
                                    >
                                        {link.icon && <link.icon size={18} />}
                                        {link.name}
                                    </Link>
                                ))}
                                {!currentUser ? (
                                    <div className="grid grid-cols-2 gap-3 mt-2">
                                        <Link
                                            to="/login"
                                            className="px-4 py-3 rounded-xl text-center text-sm font-bold bg-card border border-border text-text-primary hover:bg-background"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Log In
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="px-4 py-3 rounded-xl text-center text-sm font-bold bg-primary text-white shadow-lg shadow-primary/20"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Get Started
                                        </Link>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-3 rounded-xl text-center text-sm font-bold bg-red-50 dark:bg-red-950/20 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors mt-2"
                                    >
                                        Log Out
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};

export default Navbar;
