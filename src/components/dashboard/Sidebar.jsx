import React from 'react';
import {
    LayoutDashboard, BookOpen, Video, FileText, Bot,
    ClipboardList, BarChart3, Briefcase, GraduationCap,
    Award, User, Settings, Upload, FilePlus, Users,
    Building2, Target, Users2, ScrollText, Calendar, PieChart,
    ClipboardCheck, Rocket, ChevronUp, Shield, HelpCircle,
    LogOut, Sun, Moon, FileCode, TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ role, activeTab, onTabChange, isOpen }) => {
    const { logout } = useAuth();
    const { darkMode, toggleDarkMode } = useTheme();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const menuConfigs = {
        student: [
            { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
            { id: 'subjects', label: 'Subjects', icon: BookOpen },
            { id: 'ai-tutor', label: 'AI Tutor', icon: Bot },
            { id: 'exams', label: 'Assessments', icon: ClipboardList },
            { id: 'results', label: 'Results', icon: BarChart3 },
            { id: 'progress', label: 'Progress Tracker', icon: TrendingUp },
            { id: 'placements', label: 'Placements', icon: Briefcase },
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'appearance', label: 'Appearance', icon: Sun },
        ],
        faculty: [
            { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
            { id: 'subjects', label: 'Learning Units', icon: BookOpen },
            { id: 'create-exams', label: 'Assessments', icon: ClipboardList },
            { id: 'students', label: 'Candidate Pool', icon: Users },
            { id: 'profile', label: 'Faculty Profile', icon: User },
            { id: 'appearance', label: 'Appearance', icon: Sun },
        ],
        placement: [
            { id: 'dashboard', label: 'HQ Overview', icon: LayoutDashboard },
            { id: 'companies', label: 'Industry Partners', icon: Building2 },
            { id: 'jobs', label: 'Open Streams', icon: Target },
            { id: 'applications', label: 'Candidate Flow', icon: FileText },
            { id: 'exams', label: 'Assessment Hub', icon: ClipboardCheck },
            { id: 'technical-analytics', label: 'Tech-Prep Engine', icon: FileCode },
            { id: 'stats', label: 'Meta Stats', icon: PieChart },
            { id: 'appearance', label: 'Appearance', icon: Sun },
        ],
        collegeAdmin: [
            { id: 'dashboard', label: 'Admin Root', icon: LayoutDashboard },
            { id: 'students', label: 'Learners', icon: Users },
            { id: 'faculty', label: 'Staff Matrix', icon: Users2 },
            { id: 'batches', label: 'Cohorts', icon: Target },
            { id: 'settings', label: 'Security HQ', icon: Settings },
            { id: 'appearance', label: 'Appearance', icon: Sun },
        ],
        superAdmin: [
            { id: 'dashboard', label: 'Kernel Overview', icon: LayoutDashboard },
            { id: 'colleges', label: 'Managed Shards', icon: Building2 },
            { id: 'analytics', label: 'Global Stats', icon: PieChart },
            { id: 'settings', label: 'System Kernel', icon: Settings },
            { id: 'appearance', label: 'Appearance', icon: Sun },
        ]
    };

    const menuItems = menuConfigs[role] || menuConfigs.student;

    return (
        <aside className={`w-[290px] bg-card fixed h-full z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col font-sans border-r border-border`}>
            <div className="pt-10 px-10 flex flex-col h-full">
                {/* Brand */}
                <div className="flex items-center gap-4 mb-12">
                    <img src="/logo_campus_os.png" alt="Averqon Campus OS" className="w-10 h-10 object-contain drop-shadow-sm" />
                    <div className="flex flex-col">
                        <span className="text-xl font-black text-text-primary tracking-tight leading-none">Averqon</span>
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mt-1">Campus OS</span>
                    </div>
                </div>

                {/* Theme Toggle */}
                <div className="mb-6 px-2 flex items-center justify-between">
                    <p className="text-[10px] font-black text-text-secondary tracking-[0.2em] uppercase">Control Panel</p>
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 bg-background rounded-xl text-text-secondary hover:text-primary transition-colors"
                    >
                        {darkMode ? <Sun size={14} /> : <Moon size={14} />}
                    </button>
                </div>

                <nav className="space-y-1 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`w-full flex items-center justify-between py-4 px-4 rounded-2xl transition-all duration-300 group relative ${activeTab === item.id ? 'bg-background shadow-sm' : 'hover:bg-background/50'}`}
                        >
                            <div className="flex items-center gap-4">
                                <item.icon
                                    size={20}
                                    className={`transition-colors duration-300 ${activeTab === item.id ? 'text-primary' : 'text-text-secondary group-hover:text-primary'}`}
                                />
                                <span className={`text-[13px] tracking-tight transition-colors duration-300 ${activeTab === item.id ? 'text-text-primary font-black' : 'text-text-secondary font-extrabold group-hover:text-text-primary'}`}>
                                    {item.label}
                                </span>
                            </div>

                            {activeTab === item.id && (
                                <div className="h-full w-1.5 bg-primary rounded-full absolute right-0 top-0 translate-x-[-1px]" />
                            )}
                        </button>
                    ))}

                    {/* Logout Button in Nav */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 py-4 px-4 rounded-2xl transition-all duration-300 group hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                        <LogOut size={20} className="text-text-secondary group-hover:text-red-500 transition-colors" />
                        <span className="text-[13px] font-extrabold text-text-secondary group-hover:text-red-500 transition-colors tracking-tight">
                            Sign Out
                        </span>
                    </button>
                </nav>

                {/* System Status Card */}
                <div className="mt-auto mb-8 pt-6 border-t border-border">
                    <div className="bg-primary/5 rounded-[2rem] p-5 border border-primary/10 relative overflow-hidden group">
                        <div className="flex items-center gap-4 mb-5">
                            <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                                <Rocket size={18} />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] leading-none mb-1.5">Kernel v1.0.4</span>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-[11px] font-bold text-text-secondary truncate">Systems Nominal</span>
                                </div>
                            </div>
                        </div>

                        <button className="w-full py-3 bg-card hover:bg-primary hover:text-white border border-border hover:border-primary rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn">
                            <HelpCircle size={14} className="text-primary group-hover/btn:text-white transition-colors" />
                            Core Docs
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
