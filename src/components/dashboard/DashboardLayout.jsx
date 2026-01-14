import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Bell, Search, Menu } from 'lucide-react';

const DashboardLayout = ({ children, activeTab, onTabChange }) => {
    const { currentUser, logout, isSuperAdmin, isCollegeAdmin, isPlacement, isFaculty, isStudent } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const getRole = () => {
        if (isSuperAdmin) return 'superAdmin';
        if (isCollegeAdmin) return 'collegeAdmin';
        if (isPlacement) return 'placement';
        if (isFaculty) return 'faculty';
        return 'student';
    };

    const role = getRole();

    return (
        <div className="min-h-screen bg-slate-50 flex overflow-hidden">
            {/* Sidebar */}
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

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 lg:ml-72 flex flex-col h-screen overflow-hidden">
                {/* Topbar */}
                <header className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-10">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-500"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <div className="hidden md:flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl w-96">
                            <Search size={18} className="text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search everything..."
                                className="bg-transparent border-none outline-none text-sm w-full text-slate-900"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 md:gap-6">
                        <button className="relative p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                            <Bell size={22} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                        </button>

                        <div className="h-8 w-px bg-slate-200 mx-2" />

                        <div className="flex items-center gap-4">
                            <div className="hidden md:block text-right">
                                <p className="text-sm font-bold text-slate-900">{currentUser?.displayName || 'User'}</p>
                                <p className="text-xs font-semibold text-primary uppercase tracking-wider">{role}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary/20">
                                {currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
                            </div>
                            <button
                                onClick={logout}
                                className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                                title="Sign Out"
                            >
                                <LogOut size={22} />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
