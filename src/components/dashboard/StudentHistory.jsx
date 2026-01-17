import React, { useState, useEffect } from 'react';
import {
    Clock, CheckCircle2, XCircle, FileText,
    BarChart3, Calendar, Download, Search, Filter
} from 'lucide-react';
import { ProgressService } from '../../services/progressService';
import { exportToExcel } from '../../utils/excelExport';

const StudentHistory = ({ studentId }) => {
    // If studentId is provided, it's faculty view mode, else it's student self-view
    const [history, setHistory] = useState([]);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('All');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [histData, anaData] = await Promise.all([
                    studentId ? ProgressService.getStudentHistory(studentId) : ProgressService.getMyHistory(),
                    studentId ? ProgressService.getStudentAnalysis(studentId) : ProgressService.getMyAnalysis()
                ]);
                setHistory(histData);
                setAnalysis(anaData);
            } catch (err) {
                console.error("Failed to load history", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [studentId]);

    const handleExport = () => {
        exportToExcel(history, `Exam_History_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const filteredHistory = history.filter(h => filterType === 'All' || h.type === filterType);

    if (loading) return <div className="p-20 text-center font-black text-secondary animate-pulse">LOADING ACADEMIC RECORDS...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Analysis Cards */}
            {analysis && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="card-main !p-6 bg-[#2b3674] text-white">
                        <p className="text-[10px] uppercase tracking-widest opacity-70 mb-2">Technical Grade (Avg)</p>
                        <h3 className="text-3xl font-black">{analysis.avgScore} <span className="text-sm opacity-50">/ 100</span></h3>
                    </div>
                    <div className="card-main !p-6">
                        <p className="text-[10px] text-secondary uppercase tracking-widest opacity-70 mb-2">Peak Performance</p>
                        <h3 className="text-3xl font-black text-emerald-500">{analysis.bestScore}</h3>
                    </div>
                    <div className="card-main !p-6">
                        <p className="text-[10px] text-secondary uppercase tracking-widest opacity-70 mb-2">Attempts Logged</p>
                        <h3 className="text-3xl font-black text-primary">{analysis.totalAttempts}</h3>
                    </div>
                    <div className="card-main !p-6">
                        <p className="text-[10px] text-secondary uppercase tracking-widest opacity-70 mb-2">Overall %</p>
                        <h3 className="text-3xl font-black text-indigo-500">{analysis.percent}%</h3>
                    </div>
                </div>
            )}

            {/* History Table */}
            <div className="card-main !p-0 overflow-hidden border-[#f4f7fe]">
                <div className="p-6 border-b border-[#f4f7fe] flex justify-between items-center bg-white">
                    <h2 className="text-xl font-black text-[#2b3674] tracking-tight flex items-center gap-3">
                        <FileText size={20} className="text-primary" /> Examination Timeline
                    </h2>
                    <div className="flex gap-4">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-4 py-2 bg-[#f4f7fe] rounded-xl text-xs font-black uppercase tracking-widest outline-none border border-transparent focus:border-primary transition-all"
                        >
                            <option value="All">All Streams</option>
                            <option value="Aptitude">Aptitude</option>
                            <option value="Coding">Coding</option>
                            <option value="Technical">Technical</option>
                        </select>
                        <button onClick={handleExport} className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-100 transition-all flex items-center gap-2">
                            <Download size={14} /> Export (XLSX)
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#f4f7fe]/50">
                            <tr>
                                <th className="px-8 py-4 text-left text-[10px] font-black text-secondary uppercase tracking-widest">Protocol Name</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-secondary uppercase tracking-widest">Category</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-secondary uppercase tracking-widest">Timestamp</th>
                                <th className="px-6 py-4 text-center text-[10px] font-black text-secondary uppercase tracking-widest">Tech Stack</th>
                                <th className="px-6 py-4 text-center text-[10px] font-black text-secondary uppercase tracking-widest">Status</th>
                                <th className="px-8 py-4 text-right text-[10px] font-black text-secondary uppercase tracking-widest">Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f4f7fe]">
                            {filteredHistory.map((h, i) => (
                                <tr key={i} className="group hover:bg-[#f4f7fe]/30 transition-all">
                                    <td className="px-8 py-5">
                                        <p className="text-sm font-extrabold text-[#2b3674]">{h.examName}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${h.type === 'Coding' ? 'bg-indigo-50 text-indigo-500' :
                                                h.type === 'Aptitude' ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'
                                            }`}>
                                            {h.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-xs font-bold text-secondary">
                                        {new Date(h.date).toLocaleDateString()}
                                        <span className="block text-[10px] opacity-60 font-black uppercase">{new Date(h.date).toLocaleTimeString()}</span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className="font-mono text-xs text-slate-500">{h.language !== 'N/A' ? h.language : '-'}</span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className={`flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${h.status === 'Pass' ? 'text-emerald-500' :
                                                h.status === 'Flagged' ? 'text-red-500' : 'text-amber-500'
                                            }`}>
                                            {h.status === 'Pass' ? <CheckCircle2 size={14} /> : <XCircle size={14} />} {h.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <span className="text-lg font-black text-[#2b3674]">{h.score}</span>
                                        <span className="text-xs font-bold text-secondary"> / {h.totalScore}</span>
                                    </td>
                                </tr>
                            ))}
                            {filteredHistory.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center text-sm font-bold text-slate-300 uppercase tracking-widest">No Records Found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentHistory;
