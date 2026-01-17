import React, { useState, useEffect } from 'react';
import {
    Download, Search, Filter, ArrowLeft,
    BarChart3, Users, AlertCircle, CheckCircle2,
    Calendar, Clock, FileText, ChevronRight
} from 'lucide-react';
import { ExamService } from '../../services/examService';
import { exportToExcel, prepareExamDataForExport } from '../../utils/excelExport';
import { motion, AnimatePresence } from 'framer-motion';

const ExamAnalytics = ({ examId, onBack }) => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const data = await ExamService.getAnalytics(examId);
                setAnalytics(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [examId]);

    const handleExport = () => {
        if (!analytics) return;
        const data = prepareExamDataForExport(analytics.results);
        exportToExcel(data, `Exam_Report_${examId}.xlsx`);
    };

    if (loading) return <div className="p-20 text-center animate-pulse font-black text-secondary">DECRYPTING ANALYTICS...</div>;
    if (!analytics) return <div className="p-20 text-center">Analytics stream not found.</div>;

    const filteredResults = analytics.results.filter(r => {
        const matchesSearch = r.student?.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.student?.rollNo?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || r.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-3 bg-white border border-[#f4f7fe] rounded-2xl hover:bg-[#f4f7fe] transition-all">
                        <ArrowLeft size={20} className="text-[#2b3674]" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-black text-[#2b3674] tracking-tight">Assessment Analytics</h2>
                        <p className="text-[10px] font-black text-secondary uppercase tracking-widest mt-1">Institutional Performance Shard</p>
                    </div>
                </div>
                <button
                    onClick={handleExport}
                    className="btn-primary !bg-emerald-500 !shadow-emerald-500/20 flex items-center gap-2"
                >
                    <Download size={18} /> Export Excel Report
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Attempts', value: analytics.totalAttempts, icon: Users, color: '#4F47E6' },
                    { label: 'Avg Quotient', value: `${Math.round(analytics.averageScore)} pts`, icon: BarChart3, color: '#7b1fa2' },
                    { label: 'Validated (Pass)', value: analytics.passCount, icon: CheckCircle2, color: '#05cd99' },
                    { label: 'Anomalies (Flagged)', value: analytics.flaggedCount, icon: AlertCircle, color: '#ee5d50' },
                ].map((stat, i) => (
                    <div key={i} className="card-main !p-8 flex items-center gap-6">
                        <div className="p-4 rounded-2xl" style={{ backgroundColor: `${stat.color}10` }}>
                            <stat.icon size={24} style={{ color: stat.color }} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-extrabold text-[#2b3674]">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary" size={20} />
                    <input
                        type="text"
                        placeholder="Search student or roll no..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-white border border-[#f4f7fe] rounded-2xl outline-none focus:border-primary transition-all text-sm font-bold shadow-sm"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-8 py-4 bg-white border border-[#f4f7fe] rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-primary shadow-sm cursor-pointer"
                >
                    <option value="All">All Identities</option>
                    <option value="Pass">Passed</option>
                    <option value="Fail">Failed</option>
                    <option value="Flagged">Flagged (Violation)</option>
                </select>
            </div>

            {/* Table */}
            <div className="card-main !p-0 overflow-hidden shadow-xl border-[#f4f7fe]">
                <table className="w-full">
                    <thead className="bg-[#f4f7fe]/50 border-b border-[#f4f7fe]">
                        <tr>
                            <th className="px-10 py-6 text-left text-[11px] font-black text-secondary uppercase tracking-widest">Candidate Identity</th>
                            <th className="px-6 py-6 text-left text-[11px] font-black text-secondary uppercase tracking-widest">Metric Path</th>
                            <th className="px-6 py-6 text-left text-[11px] font-black text-secondary uppercase tracking-widest">Compiler Shard</th>
                            <th className="px-6 py-6 text-center text-[11px] font-black text-secondary uppercase tracking-widest">Security Status</th>
                            <th className="px-10 py-6 text-right text-[11px] font-black text-secondary uppercase tracking-widest">Score</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f4f7fe]">
                        {filteredResults.map((res) => (
                            <tr key={res.id} className="group hover:bg-[#f4f7fe]/30 transition-all cursor-pointer">
                                <td className="px-10 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm">
                                            {res.student?.displayName?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-extrabold text-[#2b3674]">{res.student?.displayName || 'Unknown'}</p>
                                            <p className="text-[10px] font-black text-secondary uppercase tracking-widest opacity-60">
                                                {res.student?.rollNo || 'ID: ' + res.id.slice(-6)} • {res.student?.dept || 'GEN'}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-6 text-[10px] font-black text-secondary uppercase tracking-widest">
                                    {new Date(res.submittedAt).toLocaleDateString()} • {new Date(res.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </td>
                                <td className="px-6 py-6">
                                    <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-[#2b3674] uppercase border border-slate-200">
                                        {res.languageUsed}
                                    </span>
                                </td>
                                <td className="px-6 py-6 text-center">
                                    <span className={`px-4 py-1.5 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-sm ${res.status === 'Pass' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                                            res.status === 'Flagged' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                                'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                                        }`}>
                                        {res.status}
                                    </span>
                                </td>
                                <td className="px-10 py-6 text-right">
                                    <span className="text-lg font-black text-[#2b3674]">{res.score}</span>
                                    <span className="text-xs font-bold text-secondary"> / {res.totalScore}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredResults.length === 0 && (
                    <div className="p-24 text-center">
                        <FileText size={48} className="text-secondary opacity-20 mx-auto mb-4" />
                        <p className="text-secondary font-black uppercase tracking-[0.3em] opacity-30">Null search intercept</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamAnalytics;
