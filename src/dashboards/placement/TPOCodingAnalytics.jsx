import React, { useState, useEffect } from 'react';
import {
    Download, Search, Filter, Trophy,
    Code2, Terminal, Users, UserCheck
} from 'lucide-react';
import { ExamService } from '../../services/examService';
import { exportToExcel, prepareTPODataForExport } from '../../utils/excelExport';

const TPOCodingAnalytics = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [minScore, setMinScore] = useState(0);

    useEffect(() => {
        const fetchTPO = async () => {
            try {
                const data = await ExamService.getTPOAnalytics();
                setResults(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTPO();
    }, []);

    const handleExport = () => {
        const data = prepareTPODataForExport(filteredResults);
        exportToExcel(data, 'Placement_Tech_Ready_List.xlsx');
    };

    const filteredResults = results.filter(r => {
        const matchesSearch = r.studentId?.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.studentId?.rollNo?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesScore = (r.score / r.totalScore) * 100 >= minScore;
        return matchesSearch && matchesScore;
    });

    if (loading) return <div className="p-20 text-center animate-pulse font-black text-secondary">SYNCING PLACEMENT TUNNEL...</div>;

    const topCoders = [...results].sort((a, b) => b.score - a.score).slice(0, 5);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-2xl font-black text-[#2b3674] tracking-tight flex items-center gap-3">
                        Placement Readiness Hub <Terminal size={24} className="text-primary" />
                    </h2>
                    <p className="text-secondary text-sm font-semibold opacity-70">Cross-institutional coding performance & eligibility metrics.</p>
                </div>
                <button onClick={handleExport} className="btn-primary !bg-emerald-500 !shadow-emerald-500/20 flex items-center gap-2">
                    <Download size={18} /> Export Eligibility List
                </button>
            </div>

            {/* Top Performers Shards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 card-main !p-10">
                    <div className="flex items-center gap-3 mb-8">
                        <Trophy size={24} className="text-amber-500" />
                        <h3 className="text-lg font-black text-[#2b3674] uppercase tracking-widest text-[11px]">Top Merit Shards (Elite Coders)</h3>
                    </div>
                    <div className="space-y-4">
                        {topCoders.map((coder, i) => (
                            <div key={i} className="flex items-center justify-between p-5 bg-[#f4f7fe]/50 border border-[#f4f7fe] rounded-3xl group hover:bg-white hover:shadow-xl transition-all">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center font-black text-primary shadow-sm">#{i + 1}</div>
                                    <div>
                                        <p className="text-sm font-extrabold text-[#2b3674]">{coder.studentId?.displayName}</p>
                                        <p className="text-[10px] font-black text-secondary uppercase tracking-widest opacity-60">
                                            {coder.studentId?.dept} • CGPA {coder.studentId?.cgpa}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black text-primary">{Math.round((coder.score / coder.totalScore) * 100)}%</p>
                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Score Multiplier</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card-main !p-10 bg-[#2b3674]">
                    <h3 className="text-white font-black text-[11px] uppercase tracking-widest mb-8 flex items-center gap-3">
                        <Filter size={18} className="text-primary" /> Eligibility Threshold
                    </h3>
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-white/50 uppercase tracking-widest block">Min Coding % ({minScore}%)</label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={minScore}
                                onChange={(e) => setMinScore(e.target.value)}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                        </div>
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                            <h4 className="text-2xl font-black text-white mb-1">{filteredResults.length}</h4>
                            <p className="text-[10px] font-black text-primary uppercase tracking-widest">Candidates Qualified</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Candidate Repository */}
            <div className="space-y-6">
                <div className="relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary" size={20} />
                    <input
                        type="text"
                        placeholder="Search candidates by name, roll no or skills..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-16 pr-8 py-5 bg-white border border-[#f4f7fe] rounded-[2rem] outline-none focus:border-primary text-sm font-bold shadow-sm"
                    />
                </div>

                <div className="card-main !p-0 overflow-hidden shadow-xl border-[#f4f7fe]">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#f4f7fe]/50 border-b border-[#f4f7fe]">
                                <tr>
                                    <th className="px-10 py-6 text-left text-[11px] font-black text-secondary uppercase tracking-widest">Candidate Shard</th>
                                    <th className="px-6 py-6 text-left text-[11px] font-black text-secondary uppercase tracking-widest">Skill Stack</th>
                                    <th className="px-6 py-6 text-center text-[11px] font-black text-secondary uppercase tracking-widest">Tech Index</th>
                                    <th className="px-6 py-6 text-center text-[11px] font-black text-secondary uppercase tracking-widest">CGPA Cluster</th>
                                    <th className="px-10 py-6 text-right text-[11px] font-black text-secondary uppercase tracking-widest">Placement Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f4f7fe]">
                                {filteredResults.map((res) => (
                                    <tr key={res._id} className="group hover:bg-[#f4f7fe]/30 transition-all">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-[#2b3674] text-white flex items-center justify-center font-black text-sm">
                                                    {res.studentId?.displayName?.[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-extrabold text-[#2b3674]">{res.studentId?.displayName}</p>
                                                    <p className="text-[10px] font-black text-secondary uppercase tracking-widest opacity-60">
                                                        {res.studentId?.rollNo} • {res.studentId?.dept}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex flex-wrap gap-2">
                                                {(res.studentId?.skills || ['N/A']).slice(0, 3).map((skill, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-slate-100 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-tighter">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            <div className="inline-flex flex-col items-center">
                                                <span className="text-sm font-black text-[#2b3674]">{Math.round((res.score / res.totalScore) * 100)}%</span>
                                                <span className="text-[8px] font-black text-secondary uppercase tracking-widest">Coding Score</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            <span className="px-3 py-1 bg-primary/5 text-primary rounded-xl font-black text-xs">
                                                {res.studentId?.cgpa || '8.0'}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${res.studentId?.placementProfile?.placed ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary/10 text-primary'
                                                }`}>
                                                {res.studentId?.placementProfile?.placed ? 'PLACED' : 'OPEN FOR OFFERS'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TPOCodingAnalytics;
