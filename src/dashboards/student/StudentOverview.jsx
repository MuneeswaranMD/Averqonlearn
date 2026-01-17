import React, { useState, useEffect } from 'react';
import {
    BookOpen, Clock, MessageCircle, BarChart3,
    MoreHorizontal, ChevronDown, Rocket, Bot,
    GraduationCap, Calendar, Award, CheckCircle2, Code2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StudentService } from '../../services/studentService';

const StudentOverview = () => {
    const { currentUser } = useAuth();
    const [stats, setStats] = useState({
        completedCourses: 12,
        ongoingSubjects: 6,
        avgGrade: 'A',
        attendance: '92%'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!currentUser) return;
            try {
                // In a real app, we'd fetch actual student stats here
                // For now we use the initial state which looks good
            } catch (error) {
                console.error("Error fetching overview data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentUser]);

    const subjects = [
        { name: 'Data Structures', instructor: 'Dr. Smith', progress: 85, color: '#0f172a' },
        { name: 'Web Technology', instructor: 'Prof. Miller', progress: 45, color: '#05cd99' },
        { name: 'Cloud Computing', instructor: 'Dr. Wilson', progress: 23, color: '#ee5d50' }
    ];

    const upcomingTasks = [
        { title: 'Python Project', type: 'Assignment', due: 'Tomorrow', urgency: 'High' },
        { title: 'React Workshop', type: 'Live Session', due: 'Oct 24', urgency: 'Medium' },
        { title: 'Cloud Exam', type: 'Assessment', due: 'Oct 28', urgency: 'Low' }
    ];

    const Sparkline = ({ color }) => (
        <svg width="100%" height="40" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 35C15 35 25 10 40 10C55 10 65 30 80 30C95 30 100 5 100 5" stroke={color} strokeWidth="3" strokeLinecap="round" />
        </svg>
    );

    return (
        <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
            {/* Left Content Area (Main) */}
            <div className="flex-grow flex flex-col gap-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-[#2b3674] tracking-tight">Academic Pulse</h1>
                        <p className="text-secondary text-sm font-semibold">Welcome back, {currentUser?.displayName?.split(' ')[0] || 'Scholar'}!</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white border border-[#f4f7fe] px-5 py-3 rounded-2xl text-[10px] font-black text-secondary tracking-widest uppercase cursor-pointer hover:shadow-lg hover:shadow-primary/5 transition-all">
                        Timeline: <span className="text-primary italic">Semester 1</span>
                        <ChevronDown size={14} className="text-primary" />
                    </div>
                </div>

                {/* Primary Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {[
                        { label: 'Courses Done', value: '12', icon: CheckCircle2, bg: 'bg-blue-50', color: '#0f172a' },
                        { label: 'Active Topics', value: '06', icon: BookOpen, bg: 'bg-green-50', color: '#05cd99' },
                        { label: 'Merit Score', value: '8.4', icon: Award, bg: 'bg-orange-50', color: '#ffb547' },
                        { label: 'Attendance', value: '92%', icon: Clock, bg: 'bg-purple-50', color: '#7b1fa2' },
                        { label: 'Coding Pulse', value: 'Top 2%', icon: Code2, bg: 'bg-indigo-50', color: '#4F47E6' },
                    ].map((s, i) => (
                        <div key={i} className="card-main !p-6 flex items-center gap-4">
                            <div className={`p-3 ${s.bg} rounded-xl`}>
                                <s.icon size={20} style={{ color: s.color }} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-secondary uppercase tracking-[0.1em] mb-0.5">{s.label}</p>
                                <h3 className="text-lg font-extrabold text-[#2b3674]">{s.value}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Progress Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {subjects.map((s, idx) => (
                        <div key={idx} className="card-main !p-8 flex flex-col group hover:border-primary/20 transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-[#f4f7fe] text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                    <Rocket size={20} />
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${s.progress > 50 ? 'text-[#05cd99]' : 'text-primary'}`}>{s.progress}% Path</span>
                            </div>
                            <h3 className="font-extrabold text-[#2b3674] text-lg mb-1">{s.name}</h3>
                            <p className="text-[10px] font-black text-secondary uppercase tracking-[0.1em] mb-8">{s.instructor}</p>

                            <div className="mb-8">
                                <Sparkline color={s.color} />
                            </div>

                            <div className="mt-auto pt-6 border-t border-[#f4f7fe] flex justify-between items-center">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-7 h-7 rounded-full bg-[#f4f7fe] border-2 border-white flex items-center justify-center text-[8px] font-black text-secondary">
                                            {String.fromCharCode(64 + i)}
                                        </div>
                                    ))}
                                </div>
                                <button className="btn-primary !p-2 !rounded-xl !text-[10px] !font-black uppercase tracking-widest shadow-lg shadow-primary/20">Resume</button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tasks Table */}
                <div className="card-main !p-10">
                    <h2 className="text-xl font-extrabold text-[#2b3674] mb-10 tracking-tight">Imminent Milestones</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-[#f4f7fe]">
                                    <th className="pb-6 text-[11px] font-black text-secondary tracking-widest uppercase px-4 whitespace-nowrap">Task Identifier</th>
                                    <th className="pb-6 text-[11px] font-black text-secondary tracking-widest uppercase px-4 whitespace-nowrap">Category</th>
                                    <th className="pb-6 text-[11px] font-black text-secondary tracking-widest uppercase px-4 whitespace-nowrap">Deadline</th>
                                    <th className="pb-6 text-[11px] font-black text-secondary tracking-widest uppercase px-4 whitespace-nowrap text-center">Threat Level</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f4f7fe]">
                                {upcomingTasks.map((item, idx) => (
                                    <tr key={idx} className="group hover:bg-[#f4f7fe]/30 transition-colors">
                                        <td className="py-6 px-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-1.5 h-6 bg-primary/20 rounded-full group-hover:bg-primary transition-all" />
                                                <span className="text-sm font-bold text-[#2b3674]">{item.title}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-4 font-semibold text-secondary text-xs uppercase tracking-wider">{item.type}</td>
                                        <td className="py-6 px-4 text-xs font-black text-[#2b3674]">{item.due}</td>
                                        <td className="py-6 px-4 text-center">
                                            <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${item.urgency === 'High' ? 'bg-red-50 text-red-500' :
                                                item.urgency === 'Medium' ? 'bg-orange-50 text-orange-500' : 'bg-green-50 text-green-500'
                                                }`}>
                                                {item.urgency}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Right Sidebar Area */}
            <div className="lg:w-[380px] shrink-0 flex flex-col gap-8">
                {/* Meta-Scores */}
                <div className="card-main !p-10">
                    <p className="text-[11px] font-black text-secondary tracking-widest uppercase mb-10">Meta-Score Aggregation</p>
                    <div className="flex flex-col items-center mb-12">
                        <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                            <svg className="w-full h-full -rotate-90">
                                <circle cx="80" cy="80" r="70" stroke="#f4f7fe" strokeWidth="12" fill="transparent" />
                                <circle cx="80" cy="80" r="70" stroke="#0f172a" strokeWidth="12" fill="transparent" strokeDasharray="440" strokeDashoffset="110" strokeLinecap="round" className="transition-all duration-1000" />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="text-4xl font-black text-[#2b3674]">750</span>
                                <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Global Rank</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8 pt-8 border-t border-[#f4f7fe]">
                        {[
                            { label: 'Technical Proficiency', val: 78, max: 100 },
                            { label: 'Soft Skills Index', val: 64, max: 100 },
                            { label: 'Innovation Quotient', val: 42, max: 100 }
                        ].map((s, i) => (
                            <div key={i} className="space-y-3">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#2b3674]">
                                    <span>{s.label}</span>
                                    <span className="opacity-50">{s.val}%</span>
                                </div>
                                <div className="h-2 w-full bg-[#f4f7fe] rounded-full overflow-hidden">
                                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${s.val}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Timeline Feed */}
                <div className="card-main !p-10 flex-grow">
                    <p className="text-[11px] font-black text-secondary tracking-widest uppercase mb-10">Chronicle Feed</p>
                    <div className="space-y-10 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#f4f7fe]">
                        {[
                            { action: 'New Learning Fragment: Array Optimization', time: '5m' },
                            { action: 'Assessment Milestone: Python Level 1', time: '42m' },
                            { action: 'Faculty Interaction: Dr. Smith synchronized', time: '2h' },
                            { action: 'Peer Collaborative Pulse', time: '5h' }
                        ].map((item, idx) => (
                            <div key={idx} className="flex gap-6 relative z-10 group cursor-pointer">
                                <div className="w-[36px] h-[36px] rounded-2xl bg-white border-2 border-[#f4f7fe] group-hover:bg-primary group-hover:border-primary transition-all shadow-sm shrink-0 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary group-hover:bg-white transition-all" />
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="text-xs font-extrabold text-[#2b3674] leading-relaxed group-hover:text-primary transition-colors">{item.action}</h4>
                                    <p className="text-[10px] font-black text-secondary uppercase tracking-tighter opacity-70 mt-1">{item.time} ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentOverview;
