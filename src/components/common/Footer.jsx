import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#0B0D17] border-t border-white/10 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <img src="/logo_campus_os.png" alt="Averqon Logo" className="w-12 h-12 object-contain" />
                            <span className="text-2xl font-black text-white tracking-tighter">
                                Averqon<span className="text-primary italic">OS</span>
                            </span>
                        </div>
                        <p className="text-text-secondary mb-6 leading-relaxed">
                            Empowering the next generation of tech leaders with industry-ready skills, live mentorship, and placement opportunities.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6">Quick Links</h4>
                        <ul className="space-y-4">
                            {['Home', 'About Us', 'Courses', 'Success Stories', 'Contact'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-text-secondary hover:text-primary transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Courses */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6">Top Courses</h4>
                        <ul className="space-y-4">
                            {['Full Stack Development', 'Data Science & AI', 'Cloud Computing', 'Cyber Security', 'UI/UX Design'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-text-secondary hover:text-primary transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-text-secondary">
                                <MapPin size={20} className="text-primary shrink-0 mt-1" />
                                <span>123 Tech Park, Innovation Street, Silicon Valley, CA</span>
                            </li>
                            <li className="flex items-center gap-3 text-text-secondary">
                                <Phone size={20} className="text-primary shrink-0" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3 text-text-secondary">
                                <Mail size={20} className="text-primary shrink-0" />
                                <span>hello@averqon.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Averqon Learn. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
