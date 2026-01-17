import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Bell, Search, Menu, Settings, Info, SearchIcon, Sun, Moon } from 'lucide-react';

const DashboardLayout = ({ children, activeTab, onTabChange }) => {
    const { currentUser, isSuperAdmin, isCollegeAdmin, isPlacement, isFaculty } = useAuth();
    const { darkMode, toggleDarkMode } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const role = isSuperAdmin ? 'superAdmin' : isCollegeAdmin ? 'collegeAdmin' : isPlacement ? 'placement' : isFaculty ? 'faculty' : 'student';

    return (
        <div className="min-h-screen bg-background flex overflow-hidden font-sans transition-colors duration-300">
            <Sidebar
                role={role}
                activeTab={activeTab}
                onTabChange={(tab) => {
                    onTabChange(tab);
                    setIsSidebarOpen(false);
                }}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-[45] lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <main className="flex-1 lg:pl-[290px] flex flex-col h-screen overflow-hidden">
                <header className="h-[90px] px-8 flex items-center justify-between shrink-0 relative z-40 bg-transparent">
                    <div className="flex items-center gap-6">
                        <button
                            className="lg:hidden p-3 bg-card shadow-sm border border-border rounded-2xl text-text-primary"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <div className="hidden lg:block">
                            <h1 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] mb-1">Navigation / Workspace</h1>
                            <h2 className="text-2xl font-black text-text-primary tracking-tight leading-none capitalize">{activeTab.split('-').join(' ')}</h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-2 bg-card rounded-[2rem] shadow-xl shadow-black/5 border border-border shrink-0">
                        <div className="flex items-center gap-4 bg-background px-5 py-3 rounded-[1.5rem] w-48 md:w-80 group focus-within:bg-card focus-within:shadow-inner transition-all border border-transparent focus-within:border-primary/20">
                            <SearchIcon size={18} className="text-text-secondary group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search workspace..."
                                className="bg-transparent border-none outline-none text-[11px] font-black w-full text-text-primary placeholder:text-text-secondary uppercase tracking-widest"
                            />
                        </div>

                        <div className="flex items-center gap-1 md:px-2 border-r border-border">
                            <button
                                onClick={toggleDarkMode}
                                className="p-3 text-text-secondary hover:text-primary transition-all hover:bg-background rounded-[1.25rem]"
                            >
                                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                            </button>

                            <button className="p-3 text-text-secondary hover:text-primary transition-all relative group hover:bg-background rounded-[1.25rem]">
                                <Bell size={20} />
                                <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-primary rounded-full border-2 border-card shadow-sm" />
                            </button>

                            <button className="p-3 text-text-secondary hover:text-primary transition-all hover:bg-background rounded-[1.25rem] hidden md:block">
                                <Settings size={20} />
                            </button>
                        </div>

                        <div className="flex items-center gap-4 pl-2 pr-1">
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-xs font-black text-text-primary tracking-tight">{currentUser?.displayName || 'Authorized User'}</span>
                                <span className="text-[9px] font-black text-primary uppercase tracking-widest">{role} node</span>
                            </div>
                            <div className="w-12 h-12 rounded-[1.25rem] cursor-pointer overflow-hidden border-2 border-primary/20 hover:border-primary transition-all shadow-md active:scale-95">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${currentUser?.displayName || 'User'}&background=6366f1&color=fff&bold=true&rounded=false`}
                                    alt="User Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto px-8 pb-10 custom-scrollbar mt-4">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
