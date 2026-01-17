import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-slate-950 text-white relative overflow-hidden pt-20 pb-10">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-blue-600 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
                    {/* Brand Section (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        <Link to="/" className="flex items-center gap-2 group">
                            <img src="/logo_campus_os.png" alt="Averqon Logo" className="w-10 h-10 object-contain" />
                            <span className="text-2xl font-black text-white tracking-tighter">
                                Averqon<span className="text-primary italic">OS</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 leading-relaxed font-medium pr-6">
                            The operating system for modern campuses. Unifying academics, placement, and administration into one seamless experience.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white hover:border-primary transition-all">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Sections (2 cols each -> 4 cols total) */}
                    <div className="lg:col-span-2">
                        <h4 className="font-bold text-white mb-6">Platform</h4>
                        <ul className="space-y-4">
                            {['About Us', 'Features', 'Pricing', 'Live Classes', 'Placements'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-slate-400 hover:text-primary transition-colors text-sm font-medium">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="font-bold text-white mb-6">Resources</h4>
                        <ul className="space-y-4">
                            {['Blog', 'Documentation', 'Community', 'Help Center', 'Partners'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-slate-400 hover:text-primary transition-colors text-sm font-medium">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter / Contact (4 cols) */}
                    <div className="lg:col-span-4 lg:pl-8">
                        <h4 className="font-bold text-white mb-6">Stay Updated</h4>
                        <p className="text-slate-400 text-sm mb-4">Get the latest feature updates and campus news.</p>
                        <form className="flex gap-2 mb-8">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full"
                            />
                            <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-xl transition-colors">
                                <ArrowRight size={18} />
                            </button>
                        </form>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-slate-400 text-sm">
                                <Mail size={16} className="text-primary" />
                                <span>support@averqon.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400 text-sm">
                                <MapPin size={16} className="text-primary" />
                                <span>Silicon Valley, CA, USA</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                        © {new Date().getFullYear()} Averqon Inc.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-slate-500 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">Privacy</a>
                        <a href="#" className="text-slate-500 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">Terms</a>
                        <a href="#" className="text-slate-500 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">Security</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
