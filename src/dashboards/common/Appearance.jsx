import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { CheckCircle2, Moon, Sun, Monitor, Palette, Sparkles } from 'lucide-react';

const Appearance = () => {
    const { darkMode, toggleDarkMode, currentTheme, changeTheme, themes } = useTheme();

    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-20">
            <div>
                <h1 className="text-3xl font-black text-text-primary tracking-tight">Appearance & Theme</h1>
                <p className="text-text-secondary mt-1 font-medium">Personalize your dashboard with curated professional themes.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Mode Toggle */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-card border border-border rounded-[2rem] p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                <Monitor size={20} />
                            </div>
                            <h3 className="text-lg font-black text-text-primary">Display Mode</h3>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => !darkMode && toggleDarkMode()}
                                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${darkMode ? 'bg-primary/5 border-primary shadow-lg shadow-primary/5' : 'bg-background border-border hover:border-primary/30'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? 'bg-primary text-white' : 'bg-background text-text-secondary'}`}>
                                        <Moon size={18} />
                                    </div>
                                    <span className={`font-bold text-sm ${darkMode ? 'text-text-primary' : 'text-text-secondary'}`}>Dark Mode</span>
                                </div>
                                {darkMode && <CheckCircle2 size={18} className="text-primary" />}
                            </button>

                            <button
                                onClick={() => darkMode && toggleDarkMode()}
                                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${!darkMode ? 'bg-primary/5 border-primary shadow-lg shadow-primary/5' : 'bg-background border-border hover:border-primary/30'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${!darkMode ? 'bg-primary text-white' : 'bg-background text-text-secondary'}`}>
                                        <Sun size={18} />
                                    </div>
                                    <span className={`font-bold text-sm ${!darkMode ? 'text-text-primary' : 'text-text-secondary'}`}>Light Mode</span>
                                </div>
                                {!darkMode && <CheckCircle2 size={18} className="text-primary" />}
                            </button>
                        </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/10 p-6 rounded-[2rem] flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                            <Sparkles size={24} />
                        </div>
                        <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2">Pro Tip</p>
                        <p className="text-xs text-text-secondary font-medium leading-relaxed">
                            Dark mode reduces eye strain and looks incredibly premium with our vibrant theme gradients.
                        </p>
                    </div>
                </div>

                {/* Right: Theme Selection */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-10 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                <Palette size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-text-primary">Color Themes</h3>
                                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Select a professional palette</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {themes.map((theme) => (
                                <button
                                    key={theme.id}
                                    onClick={() => changeTheme(theme.id)}
                                    className={`relative flex items-center gap-4 p-5 rounded-[1.5rem] border transition-all group overflow-hidden ${currentTheme === theme.id ? 'bg-primary/5 border-primary ring-1 ring-primary/20 shadow-xl shadow-primary/5' : 'bg-background border-border hover:border-primary/50'}`}
                                >
                                    {/* Theme Indicator */}
                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110`}>
                                        {currentTheme === theme.id && <CheckCircle2 size={24} />}
                                    </div>

                                    <div className="flex flex-col text-left">
                                        <span className={`font-black text-sm uppercase tracking-wider ${currentTheme === theme.id ? 'text-primary' : 'text-text-primary group-hover:text-primary'}`}>
                                            {theme.name}
                                        </span>
                                        <span className="text-[10px] font-bold text-text-secondary">Professional Gradient</span>
                                    </div>

                                    {/* Ambient Glow behind selected */}
                                    {currentTheme === theme.id && (
                                        <div className={`absolute -right-4 -bottom-4 w-20 h-20 bg-gradient-to-br ${theme.gradient} opacity-10 blur-2xl rounded-full`} />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="mt-10 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
                            <p className="text-[11px] font-bold text-text-secondary italic">
                                * Your theme is saved automatically and persists after logout.
                            </p>
                            <button
                                onClick={() => changeTheme('indigo')}
                                className="px-6 py-2.5 bg-background border border-border text-text-secondary hover:text-primary hover:border-primary rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                            >
                                Reset to Default
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Appearance;
