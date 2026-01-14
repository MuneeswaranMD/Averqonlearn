import React from 'react';
import {
    LayoutDashboard, BookOpen, Video, FileText, Bot,
    ClipboardList, BarChart3, Briefcase, GraduationCap,
    Award, User, Settings, Upload, FilePlus, Users,
    Building2, Target, Users2, ScrollText, Calendar, PieChart
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ role, activeTab, onTabChange, isOpen, onClose }) => {
    const location = useLocation();

    const menuConfigs = {
        student: [
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'subjects', label: 'My Subjects', icon: BookOpen },
            { id: 'videos', label: 'Video Classes', icon: Video },
            { id: 'notes', label: 'Notes', icon: FileText },
            { id: 'ai-tutor', label: 'AI Tutor', icon: Bot },
            { id: 'exams', label: 'Exams & Mock Tests', icon: ClipboardList },
            { id: 'results', label: 'My Results', icon: BarChart3 },
            { id: 'placements', label: 'Placements', icon: Briefcase },
            { id: 'resume', label: 'My Resume', icon: GraduationCap },
            { id: 'certificates', label: 'Certificates', icon: Award },
            { id: 'profile', label: 'Profile', icon: User },
        ],
        faculty: [
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'subjects', label: 'My Subjects', icon: BookOpen },
            { id: 'upload-videos', label: 'Upload Videos', icon: Video },
            { id: 'upload-notes', label: 'Upload Notes', icon: Upload },
            { id: 'create-exams', label: 'Create Exams', icon: FilePlus },
            { id: 'upload-marks', label: 'Upload Marks', icon: BarChart3 },
            { id: 'ai-performance', label: 'AI Performance', icon: Bot },
            { id: 'students', label: 'Students', icon: Users },
            { id: 'profile', label: 'Profile', icon: User },
        ],
        placement: [
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'companies', label: 'Companies', icon: Building2 },
            { id: 'jobs', label: 'Job Openings', icon: Target },
            { id: 'applications', label: 'Applications', icon: FileText },
            { id: 'shortlisting', label: 'Shortlisting', icon: ClipboardList },
            { id: 'skills', label: 'Student Skills', icon: BarChart3 },
            { id: 'resume-bank', label: 'Resume Bank', icon: ScrollText },
            { id: 'interviews', label: 'Interviews', icon: Calendar },
            { id: 'stats', label: 'Placement Stats', icon: PieChart },
        ],
        collegeAdmin: [
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'students', label: 'Students', icon: Users },
            { id: 'faculty', label: 'Faculty', icon: Users2 },
            { id: 'placements', label: 'Placement Officers', icon: Briefcase },
            { id: 'subjects', label: 'Subjects', icon: BookOpen },
            { id: 'units', label: 'Units', icon: FileText },
            { id: 'classes', label: 'Classes', icon: Video },
            { id: 'exams', label: 'Exams', icon: ClipboardList },
            { id: 'results', label: 'Results', icon: BarChart3 },
            { id: 'reports', label: 'Reports', icon: ScrollText },
            { id: 'settings', label: 'Settings', icon: Settings },
        ],
        superAdmin: [
            { id: 'dashboard', label: 'Global Overview', icon: LayoutDashboard },
            { id: 'colleges', label: 'Manage Colleges', icon: Building2 },
            { id: 'admins', label: 'College Admins', icon: Users2 },
            { id: 'analytics', label: 'Global Analytics', icon: PieChart },
            { id: 'logs', label: 'System Logs', icon: ScrollText },
            { id: 'settings', label: 'Global Settings', icon: Settings },
        ]
    };

    const menuItems = menuConfigs[role] || menuConfigs.student;

    return (
        <aside className={`w-72 bg-white border-r border-slate-200 fixed h-full z-40 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
            <div className="p-8 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-10 text-slate-900">
                    <img src="/logo_campus_os.png" alt="Averqon Logo" className="w-10 h-10 object-contain" />
                    <span className="text-2xl font-black tracking-tighter">Averqon<span className="text-primary italic">OS</span></span>
                </div>

                <nav className="space-y-1 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${activeTab === item.id
                                ? 'bg-primary text-white shadow-lg shadow-primary/20 translate-x-1'
                                : 'text-slate-500 hover:text-primary hover:bg-slate-50'
                                }`}
                        >
                            <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-primary transition-colors'} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto pt-8 border-t border-slate-100">
                    <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all group">
                        <Settings size={20} className="text-slate-400 group-hover:text-red-500 transition-colors" />
                        Settings
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
