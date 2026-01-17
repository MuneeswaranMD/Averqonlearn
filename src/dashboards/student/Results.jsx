import React, { useState, useEffect } from 'react';
import {
    BarChart3, Award, TrendingUp, Filter,
    Download, PieChart, ChevronRight, BookOpen,
    ArrowUpRight, Target
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { StudentService } from '../../services/studentService';

const Results = () => {
    const { currentUser } = useAuth();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            if (!currentUser) return;
            try {
                const data = await StudentService.getResults(currentUser.uid);
                setResults(data);
            } catch (error) {
                console.error("Error fetching results:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [currentUser]);

    const performanceData = [
        { sem: 'Sem 1', gpa: 7.8 },
        { sem: 'Sem 2', gpa: 8.2 },
        { sem: 'Sem 3', gpa: 8.5 },
        { sem: 'Sem 4', gpa: 8.1 },
        { sem: 'Sem 5', gpa: 8.8 },
        { sem: 'Sem 6', gpa: 9.2 },
    ];

    const stats = [
        { label: 'Overall CGPA', value: '8.45', icon: Target, color: 'text-primary', bg: 'bg-primary/10' },
        { label: 'Total Credits', value: '142', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Arrears (Active)', value: '0', icon: Award, color: 'text-orange-600', bg: 'bg-orange-50' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Academic Results</h1>
                    <p className="text-slate-500 mt-1">Detailed performance analysis and semester-wise transcripts.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                        <Download size={18} /> Download Transcript
                    </button>
                </div>
            </div>

            {/* Quick Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                <stat.icon size={28} />
                            </div>
                            <div className="flex items-center gap-1 text-[10px] items-center font-black px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg">
                                <ArrowUpRight size={12} /> TOP 5%
                            </div>
                        </div>
                        <div className="text-4xl font-black text-slate-900 mb-1">{stat.value}</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* GPA Trend Chart */}
                <div className="lg:col-span-2 col-span-1 min-w-0 bg-slate-900 rounded-[32px] p-8 text-white shadow-xl shadow-slate-200">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-xl font-bold mb-1">GPA Performance Trend</h3>
                            <p className="text-slate-400 text-xs font-medium">Visual tracking of semester-wise GPA</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                            <TrendingUp className="text-primary" />
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData}>
                                <defs>
                                    <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="rgb(var(--primary))" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="rgb(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                                <XAxis dataKey="sem" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis domain={[0, 10]} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '16px', border: '1px solid #334155', color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="gpa" stroke="rgb(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorGpa)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Subject Wise Distribution */}
                <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center justify-between">
                        Subject Grades <PieChart size={20} className="text-indigo-400" />
                    </h3>
                    <div className="space-y-6">
                        {results.length > 0 ? results.map((res, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-primary/20 transition-all">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-black text-primary border border-slate-200 shadow-sm">{res.grade}</div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-slate-800 underline-offset-4 decoration-primary group-hover:underline">{res.subject}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{res.sem || 'Recent'}</p>
                                </div>
                                <ChevronRight className="text-slate-300" size={16} />
                            </div>
                        )) : (
                            ['Data Structures', 'Python Fundamentals', 'Discrete Math'].map((subj, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 opacity-50">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-black text-slate-300 border border-slate-200">O</div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-slate-400">{subj}</h4>
                                        <p className="text-[10px] font-bold text-slate-300 uppercase">Wait for update</p>
                                    </div>
                                </div>
                            ))
                        )}
                        {loading && (
                            <div className="py-20 text-center text-slate-400 font-bold">Loading grades...</div>
                        )}
                    </div>
                    <button className="w-full mt-8 py-4 bg-slate-50 text-slate-700 font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-slate-100 transition-all">
                        Full Detailed Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Results;
