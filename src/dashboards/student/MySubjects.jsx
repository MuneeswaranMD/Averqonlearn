import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Filter, MoreVertical, PlayCircle, FileText, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StudentService } from '../../services/studentService';

const MySubjects = () => {
    const { currentUser } = useAuth();
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">My Subjects</h1>
                    <p className="text-slate-500 mt-1">Access your enrolled courses and learning materials.</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row gap-4 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search subjects or instructors..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary transition-all text-sm"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 flex items-center gap-2 font-bold text-sm hover:bg-slate-100 transition-all">
                        <Filter size={18} /> Filter
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-slate-100 h-64 rounded-3xl animate-pulse" />
                    ))}
                </div>
            ) : filteredSubjects.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredSubjects.map((subject, i) => (
                        <div key={i} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500" />

                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-primary">
                                        <BookOpen size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">{subject.title}</h3>
                                        <p className="text-sm font-semibold text-slate-500">{subject.instructor || 'College Faculty'}</p>
                                    </div>
                                </div>
                                <button className="p-2 text-slate-300 hover:text-slate-600">
                                    <MoreVertical size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-8 relative z-10">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] items-center font-black text-slate-400 uppercase tracking-widest mb-1 flex gap-1">
                                        <FileText size={10} /> Study Units
                                    </p>
                                    <p className="font-bold text-slate-700">{subject.units || 0} Modules</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] items-center font-black text-slate-400 uppercase tracking-widest mb-1 flex gap-1">
                                        <PlayCircle size={10} /> Lectures
                                    </p>
                                    <p className="font-bold text-slate-700">{subject.videos || 0} Recorded</p>
                                </div>
                            </div>

                            <div className="space-y-2 mb-8 relative z-10">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-slate-500 uppercase tracking-wider">Completion Progress</span>
                                    <span className="text-primary">{subject.progress || 0}%</span>
                                </div>
                                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${subject.progress || 0}%` }} />
                                </div>
                            </div>

                            <div className="flex gap-4 relative z-10">
                                <button className="flex-1 py-3.5 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                                    Continue Learning <ChevronRight size={16} />
                                </button>
                                <button className="px-5 py-3.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all text-xs uppercase tracking-widest">
                                    Resources
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-3xl p-20 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No subjects found</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">We couldn't find any subjects matching your search or enrollment criteria.</p>
                </div>
            )}
        </div>
    );
};

export default MySubjects;
