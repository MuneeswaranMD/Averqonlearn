import React, { useState, useEffect } from 'react';
import {
    BookOpen, Clock, BarChart3, Rocket,
    Bot, Award, PlayCircle, FileText,
    ChevronRight, ArrowUpRight, Sparkles, BrainCircuit
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { StudentService } from '../../services/studentService';

const StudentOverview = () => {
    const { currentUser, collegeId } = useAuth();
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState([
        { label: 'Subjects Enrolled', value: '0', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Hours Learned', value: '0', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Average CGPA', value: '8.4', icon: BarChart3, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Exam Readiness', value: '92%', icon: Rocket, color: 'text-orange-600', bg: 'bg-orange-50' },
    ]);

    useEffect(() => {
        const fetchData = async () => {
            if (!currentUser) return;
            try {
                const fetchedSubjects = await StudentService.getEnrolledSubjects(currentUser.uid);
                setSubjects(fetchedSubjects);

                // Update stats based on fetched data
                setStats(prev => prev.map(s => {
                    if (s.label === 'Subjects Enrolled') return { ...s, value: fetchedSubjects.length.toString() };
                    return s;
                }));
            } catch (error) {
                console.error("Error fetching overview data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentUser]);

    const activityData = [
        { name: 'Mon', hours: 2 },
        { name: 'Tue', hours: 4.5 },
        { name: 'Wed', hours: 3 },
        { name: 'Thu', hours: 5.5 },
        { name: 'Fri', hours: 4 },
        { name: 'Sat', hours: 6 },
        { name: 'Sun', hours: 8 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Education Overview</h1>
                    <p className="text-slate-500 mt-1">Track your progress and upcoming academic goals.</p>
                </div>
                <div className="flex items-center gap-3 bg-white border border-slate-200 p-2 rounded-2xl shadow-sm">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
                        ))}
                    </div>
                    <div className="pr-2">
                        <p className="text-xs font-bold text-slate-900">42 Students</p>
                        <p className="text-[10px] text-slate-500 font-medium">Learning live now</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="p-2 transition-colors hover:bg-slate-50 rounded-lg cursor-pointer text-slate-400">
                                <ArrowUpRight size={18} />
                            </span>
                        </div>
                        <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
                        <div className="text-sm font-medium text-slate-500">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Learning Activity Chart */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Learning Activity</h3>
                            <p className="text-sm text-slate-500">Daily study hours this week</p>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
                            {['Week', 'Month'].map(tab => (
                                <button key={tab} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${tab === 'Week' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={activityData}>
                                <defs>
                                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4F47E6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#4F47E6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0' }}
                                />
                                <Area type="monotone" dataKey="hours" stroke="#4F47E6" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Placement Readiness & AI Tutor */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-primary to-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-primary/20 relative overflow-hidden group">
                        <Sparkles className="absolute top-4 right-4 text-white/20 animate-pulse" size={48} />
                        <h3 className="text-lg font-bold mb-2">Resume Score</h3>
                        <div className="flex items-end gap-2 mb-4">
                            <span className="text-4xl font-black">82</span>
                            <span className="text-white/60 font-bold text-sm mb-1">/ 100</span>
                        </div>
                        <p className="text-white/80 text-xs font-medium leading-relaxed mb-6">
                            Your resume is 82% ready for placements. Complete "Data Structures" to boost score to 90+.
                        </p>
                        <button className="w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                            Improve Resume <ChevronRight size={16} />
                        </button>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                                <BrainCircuit size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Ask AI Tutor</h3>
                        </div>
                        <div className="space-y-3">
                            <p className="text-slate-500 text-xs font-medium">Quick suggestions:</p>
                            {['Explain Big O Notation', 'Explain Recursion'].map((q, i) => (
                                <button key={i} className="w-full text-left p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 hover:border-primary/30 hover:bg-white transition-all">
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Course Progress Section */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Enrolled Subjects</h3>
                    <button className="text-primary text-sm font-bold hover:underline">View All</button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-slate-100 h-48 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : subjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {subjects.map((course, i) => (
                            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-primary/5 text-primary`}>
                                        <BookOpen size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{course.title}</h4>
                                        <p className="text-xs text-slate-500 font-medium">By {course.instructor || 'Staff'}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-500">Progress</span>
                                        <span className="text-primary">{course.progress || 0}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${course.progress || 0}%` }} />
                                    </div>
                                </div>
                                <button className="w-full mt-6 py-2.5 rounded-xl border border-slate-100 text-xs font-bold text-slate-600 hover:bg-primary hover:text-white hover:border-primary transition-all">
                                    Open Subject
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
                        <p className="text-slate-500 font-bold">No subjects enrolled yet.</p>
                        <button className="mt-4 text-primary font-bold text-sm">Explore Courses</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentOverview;
