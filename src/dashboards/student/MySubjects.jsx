import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Filter, MoreVertical, PlayCircle, FileText, ChevronRight, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StudentService } from '../../services/studentService';

const SubjectViewer = ({ subject, onClose }) => {
    const [content, setContent] = useState({ videos: [], notes: [] });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('videos'); // videos or notes

    useEffect(() => {
        const fetchContent = async () => {
            if (!subject) return;
            setLoading(true);
            try {
                const videos = await StudentService.getContent({ subjectId: subject._id, type: 'video' }) || [];
                const notes = await StudentService.getContent({ subjectId: subject._id, type: 'note' }) || [];
                setContent({ videos, notes });
            } catch (err) { console.error(err); } finally { setLoading(false); }
        };
        fetchContent();
    }, [subject]);

    if (!subject) return null;

    return (
        <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-5xl h-[85vh] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
                <div className="p-10 border-b border-[#f4f7fe] flex justify-between items-center bg-[#f4f7fe]/30">
                    <div>
                        <h2 className="text-2xl font-black text-[#2b3674] tracking-tight">{subject.title}</h2>
                        <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mt-1">{subject.instructorName || 'Instructional Assets'}</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white rounded-2xl transition-all shadow-sm"><X size={24} className="text-[#2b3674]" /></button>
                </div>

                <div className="flex border-b border-[#f4f7fe] px-10 gap-8">
                    <button onClick={() => setActiveTab('videos')} className={`py-6 text-xs font-black uppercase tracking-widest border-b-4 transition-all ${activeTab === 'videos' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-[#2b3674]'}`}>Video Matrix</button>
                    <button onClick={() => setActiveTab('notes')} className={`py-6 text-xs font-black uppercase tracking-widest border-b-4 transition-all ${activeTab === 'notes' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-[#2b3674]'}`}>Notes Library</button>
                </div>

                <div className="flex-1 overflow-y-auto p-12 bg-[#f4f7fe]/20">
                    {loading ? (
                        <div className="py-20 text-center text-secondary font-black animate-pulse uppercase tracking-[0.3em]">Synchronizing Assets...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {(content[activeTab] || []).map(item => (
                                <div key={item._id || item.id} className="card-main !p-8 group hover:border-primary/20 transition-all">
                                    <div className={`aspect-video rounded-2xl mb-6 flex items-center justify-center shadow-inner ${activeTab === 'videos' ? 'bg-[#2b3674] text-white' : 'bg-orange-50 text-orange-500'}`}>
                                        {activeTab === 'videos' ? <PlayCircle size={40} className="group-hover:scale-110 transition-transform" /> : <FileText size={40} className="group-hover:scale-110 transition-transform" />}
                                    </div>
                                    <h4 className="font-extrabold text-[#2b3674] mb-4 line-clamp-2 leading-snug">{item.title}</h4>
                                    <a href={item.url} target="_blank" rel="noreferrer" className="block w-full text-center py-4 bg-[#f4f7fe] hover:bg-primary hover:text-white text-[#2b3674] text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-sm">
                                        {activeTab === 'videos' ? 'Stream Lecture' : 'Access PDF'}
                                    </a>
                                </div>
                            ))}
                            {(content[activeTab] || []).length === 0 && (
                                <div className="col-span-full py-24 text-center border-4 border-dashed border-[#f4f7fe] rounded-[3rem]">
                                    <p className="text-secondary font-black uppercase tracking-[0.2em] opacity-40">Zero {activeTab} detected</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const MySubjects = () => {
    const { currentUser } = useAuth();
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubject, setSelectedSubject] = useState(null);

    useEffect(() => {
        const fetchSubjects = async () => {
            if (!currentUser) return;
            try {
                const data = await StudentService.getEnrolledSubjects(currentUser.uid);
                setSubjects(data);
            } catch (error) {
                console.error("Error fetching subjects:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSubjects();
    }, [currentUser]);

    const filteredSubjects = subjects.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.instructor?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-[#2b3674] tracking-tight">Academic Landscape</h1>
                    <p className="text-secondary text-sm font-semibold">Your primary learning clusters and progress.</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 group w-full">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-primary transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search learning clusters or mentors..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-4 py-4 bg-white border border-[#f4f7fe] rounded-[1.5rem] outline-none focus:border-primary/50 text-sm font-bold shadow-sm transition-all"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button className="px-6 py-4 bg-white border border-[#f4f7fe] rounded-[1.5rem] text-secondary flex items-center gap-2 font-black text-[10px] uppercase tracking-widest hover:bg-[#f4f7fe] transition-all shadow-sm">
                        <Filter size={18} className="text-primary" /> Filter Matrix
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="card-main h-72 animate-pulse bg-white border-[#f4f7fe]" />
                    ))}
                </div>
            ) : filteredSubjects.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {filteredSubjects.map((subject, i) => (
                        <div key={i} className="card-main !p-10 group relative overflow-hidden flex flex-col hover:border-primary/20 transition-all">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-bl-[100px] -mr-20 -mt-20 group-hover:bg-primary/10 transition-all duration-700" />

                            <div className="flex justify-between items-start mb-10 relative z-10">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-[#f4f7fe] flex items-center justify-center text-primary shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                        <BookOpen size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-extrabold text-[#2b3674] leading-tight mb-1">{subject.title}</h3>
                                        <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">{subject.instructorName || subject.instructor || 'Lead Mentor'}</p>
                                    </div>
                                </div>
                                <button className="p-2 text-secondary hover:text-primary transition-colors">
                                    <MoreVertical size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-10 relative z-10">
                                <div className="p-5 bg-[#f4f7fe]/50 rounded-2xl border border-transparent group-hover:border-primary/5 transition-all">
                                    <p className="text-[9px] font-black text-secondary uppercase tracking-[0.2em] mb-2 flex gap-2">
                                        <FileText size={12} className="text-primary" /> Study Units
                                    </p>
                                    <p className="text-sm font-extrabold text-[#2b3674]">{subject.units || 'Core'} Modules</p>
                                </div>
                                <div className="p-5 bg-[#f4f7fe]/50 rounded-2xl border border-transparent group-hover:border-primary/5 transition-all">
                                    <p className="text-[9px] font-black text-secondary uppercase tracking-[0.2em] mb-2 flex gap-2">
                                        <PlayCircle size={12} className="text-primary" /> Digital Path
                                    </p>
                                    <p className="text-sm font-extrabold text-[#2b3674]">Active Access</p>
                                </div>
                            </div>

                            <div className="mt-auto space-y-3 mb-10 relative z-10">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-secondary">
                                    <span>Knowledge Sync</span>
                                    <span className="text-primary">{subject.progress || 0}%</span>
                                </div>
                                <div className="h-2.5 bg-[#f4f7fe] rounded-full overflow-hidden shadow-inner">
                                    <div className="h-full bg-primary rounded-full transition-all duration-1000 shadow-lg shadow-primary/20" style={{ width: `${subject.progress || 0}%` }} />
                                </div>
                            </div>

                            <div className="flex gap-4 relative z-10 mt-auto">
                                <button onClick={() => setSelectedSubject(subject)} className="btn-primary !flex-1 !py-4 shadow-xl">
                                    Resume Path <ChevronRight size={18} className="ml-1" />
                                </button>
                                <button onClick={() => setSelectedSubject(subject)} className="px-6 py-4 bg-white border border-[#f4f7fe] text-[#2b3674] font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-[#f4f7fe] transition-all shadow-sm">
                                    Analyze
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card-main !p-24 text-center border-4 border-dashed border-[#f4f7fe]">
                    <div className="w-24 h-24 bg-[#f4f7fe] rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-primary/30">
                        <BookOpen size={48} />
                    </div>
                    <h3 className="text-2xl font-black text-[#2b3674] mb-4">Zero Clusters Detected</h3>
                    <p className="text-secondary font-semibold max-w-sm mx-auto leading-relaxed">System failed to locate active learning paths matching your current authorization scope.</p>
                </div>
            )}
            {selectedSubject && <SubjectViewer subject={selectedSubject} onClose={() => setSelectedSubject(null)} />}
        </div>
    );
};

export default MySubjects;
