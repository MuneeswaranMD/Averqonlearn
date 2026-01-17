import React, { useState, useEffect } from 'react';
import {
    Folder, FileText, Download, Eye,
    Search, Filter, Plus, MoreHorizontal,
    ChevronRight, HardDrive, Clock, FileStack, Sparkles, BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StudentService } from '../../services/studentService';

const Notes = () => {
    const { collegeId, userData } = useAuth();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchNotes = async () => {
            if (!collegeId) return;
            try {
                const data = await StudentService.getContent({ collegeId, type: 'note' });
                setNotes(data);
            } catch (error) { console.error(error); } finally { setLoading(false); }
        };
        fetchNotes();
    }, [collegeId]);

    const filtered = notes.filter(n => n.title?.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Academic <span className="text-primary italic">Drive</span></h1>
                    <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Unified Knowledge Repository
                    </p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Search documents..."
                            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 transition-all text-sm font-bold shadow-sm"
                        />
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Stats Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-200">
                        <div className="flex justify-between items-start mb-10">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center"><HardDrive size={24} /></div>
                            <span className="text-[10px] items-center font-black text-emerald-400 uppercase tracking-widest">Storage</span>
                        </div>
                        <h3 className="text-2xl font-black mb-2">Drive Health</h3>
                        <p className="text-slate-400 text-xs font-medium mb-8 uppercase tracking-widest">Optimized & Synced</p>
                        <div className="space-y-2">
                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-400 rounded-full w-2/5" />
                            </div>
                            <p className="text-[10px] font-black text-white/50">214.5 MB used of 1 GB</p>
                        </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-100 rounded-[2.5rem] p-8">
                        <h4 className="text-emerald-900 font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Sparkles size={16} /> Insight Machine
                        </h4>
                        <p className="text-emerald-700/70 text-xs font-bold leading-relaxed italic">
                            All documents are being indexed by the AI Tutor for contextual Q&A assistance.
                        </p>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                            <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                                <FileStack size={22} className="text-primary" /> Recent Repository
                            </h2>
                            <span className="px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-xl font-black text-[10px] text-slate-400 uppercase tracking-widest">{filtered.length} Objects</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 text-[10px] uppercase font-black text-slate-400 tracking-widest border-b border-slate-100">
                                    <tr>
                                        <th className="px-8 py-6">Knowledge Asset</th>
                                        <th className="px-6 py-6 font-black">Meta / Subject</th>
                                        <th className="px-8 py-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filtered.map(file => (
                                        <tr key={file._id || file.id} className="hover:bg-slate-50/30 transition-all group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all shadow-sm">
                                                        <FileText size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 text-base mb-0.5">{file.title}</p>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Asset v1.2</span>
                                                            <div className="w-1 h-1 rounded-full bg-slate-200" />
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-1"><Clock size={10} /> Sync: Online</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{file.subjectId?.title || 'Core Academics'}</span>
                                                    <span className="text-[10px] font-black text-primary uppercase">Cluster: {file.unit || 'Standard'}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                    <button onClick={() => alert('AI Summarization Indexing...')} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-emerald-500 hover:border-emerald-100 transition-all"><BookOpen size={18} /></button>
                                                    <a href={file.url} target="_blank" rel="noreferrer" className="p-3 bg-slate-900 text-white rounded-xl hover:bg-primary transition-all shadow-lg shadow-slate-900/10"><Download size={18} /></a>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {loading && (
                                <div className="p-32 flex flex-col items-center justify-center text-slate-400">
                                    <div className="w-12 h-12 border-4 border-slate-100 border-t-primary rounded-full animate-spin mb-6" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Neural Sync in Progress</span>
                                </div>
                            )}

                            {!loading && filtered.length === 0 && (
                                <div className="p-32 text-center bg-slate-50/50 border-t border-slate-50">
                                    <div className="text-slate-300 mb-4 flex justify-center"><Folder size={48} /></div>
                                    <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Zero latency directory: No objects found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notes;
