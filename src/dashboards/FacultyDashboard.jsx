import React, { useState, useEffect, useRef } from 'react';
import {
    Users, BookOpen, Video, FileText,
    ClipboardList, TrendingUp, AlertCircle, Plus,
    MoreVertical, ArrowUpRight, ArrowDownRight,
    LayoutDashboard, Activity, CheckCircle, Clock,
    Upload, FilePlus, Bot, User, Search, Filter,
    Download, PlayCircle, Eye, Trash2, X, Edit3,
    FileUp, FileDown, ChevronLeft, ChevronRight, CheckSquare, Square,
    Mic, Send, Award, Database
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { FacultyService } from '../services/facultyService';
import { AdminService } from '../services/adminService';
import { LiveService } from '../services/live';
import { AssessmentService } from '../services/assessment';

const UserModal = ({ isOpen, onClose, onSave, editingUser, role }) => {
    const [formData, setFormData] = useState({
        displayName: '', email: '', password: 'password123', dept: '', year: '1'
    });

    useEffect(() => {
        if (editingUser) {
            setFormData({
                displayName: editingUser.displayName || '',
                email: editingUser.email || '',
                password: editingUser.password || 'password123',
                dept: editingUser.dept || '',
                year: editingUser.year || '1'
            });
        } else {
            setFormData({ displayName: '', email: '', password: 'password123', dept: '', year: '1' });
        }
    }, [editingUser, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-black text-slate-900">{editingUser ? 'Edit' : 'Add'} {role}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-8 space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                        <input required value={formData.displayName} onChange={e => setFormData({ ...formData, displayName: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email</label>
                        <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Department</label>
                            <input required value={formData.dept} onChange={e => setFormData({ ...formData, dept: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold" placeholder="e.g. CSE" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Year</label>
                            <select value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold">
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
                            </select>
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 bg-slate-50 text-slate-500 font-bold rounded-xl text-sm">Cancel</button>
                        <button type="submit" className="px-8 py-2.5 bg-primary text-white font-black rounded-xl text-sm shadow-lg shadow-primary/20">Save {role}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ContentModal = ({ isOpen, onClose, onSave, type }) => {
    const [formData, setFormData] = useState({ title: '', subject: '', url: '' });
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-black text-slate-900">Upload {type === 'video' ? 'Lecture' : 'Material'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-8 space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Title</label>
                        <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Subject</label>
                        <input required value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{type === 'video' ? 'Video/YouTube Link' : 'Media/PDF Link'}</label>
                        <input required value={formData.url} onChange={e => setFormData({ ...formData, url: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold" />
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 bg-slate-50 text-slate-500 font-bold rounded-xl text-sm">Cancel</button>
                        <button type="submit" className="px-8 py-2.5 bg-primary text-white font-black rounded-xl text-sm shadow-lg shadow-primary/20 flex items-center gap-2"><Upload size={16} /> Publish Now</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const LiveModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({ title: '', time: '', platform: 'Zoom', attendees: 0 });
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-black text-slate-900 text-red-600 flex items-center gap-2"><Mic size={20} /> Schedule Live Class</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-8 space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Topic</label>
                        <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Time (e.g. 10:00 AM)</label>
                        <input required value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Platform</label>
                        <select value={formData.platform} onChange={e => setFormData({ ...formData, platform: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold">
                            <option>Zoom</option>
                            <option>Google Meet</option>
                            <option>YouTube Live</option>
                        </select>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 bg-slate-50 text-slate-500 font-bold rounded-xl text-sm">Cancel</button>
                        <button type="submit" className="px-8 py-2.5 bg-red-600 text-white font-black rounded-xl text-sm shadow-lg shadow-red-200 flex items-center gap-2"><Send size={16} /> Go Live</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const FacultyDashboard = ({ activeTab }) => {
    const { currentUser, collegeId, userData } = useAuth();
    const [stats, setStats] = useState([
        { label: 'Active Students', value: '0', change: '+0%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Courses Taught', value: '0', change: '0%', icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Quiz Completion', value: '0%', change: '+0%', icon: ClipboardList, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Avg. Test Score', value: '0/100', change: '0%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
    ]);

    const [taughtSubjects, setTaughtSubjects] = useState([]);
    const [students, setStudents] = useState([]);
    const [content, setContent] = useState([]);
    const [liveClasses, setLiveClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDept, setFilterDept] = useState('All');
    const [filterYear, setFilterYear] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchData = async () => {
        if (!currentUser || !collegeId) return;
        setLoading(true);
        try {
            const subjects = await FacultyService.getTaughtSubjects(currentUser.uid);
            setTaughtSubjects(subjects);

            if (activeTab === 'students') {
                const studentList = await AdminService.getUsersByRole(collegeId, 'student');
                setStudents(studentList);
            } else if (activeTab === 'upload-videos') {
                const videos = await FacultyService.getContentByFaculty(currentUser.uid, 'video');
                setContent(videos);
            } else if (activeTab === 'upload-notes') {
                const notes = await FacultyService.getContentByFaculty(currentUser.uid, 'note');
                setContent(notes);
            } else if (activeTab === 'live') {
                const l = await LiveService.getUpcomingClasses();
                setLiveClasses(l.filter(c => c.instructor === (userData?.displayName || 'Faculty')));
            }

            setStats(prev => prev.map(s => {
                if (s.label === 'Courses Taught') return { ...s, value: subjects.length.toString() };
                if (s.label === 'Active Students') {
                    // If we just fetched students, use that length, else use existing state
                    const count = (activeTab === 'students' && typeof studentList !== 'undefined') ? studentList.length : students.length;
                    return { ...s, value: count.toString() };
                }
                return s;
            }));
        } catch (error) {
            console.error("Faculty Data Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        setSelectedIds([]);
        setCurrentPage(1);
    }, [currentUser, collegeId, activeTab]);

    const handleSaveStudent = async (formData) => {
        try {
            if (selectedUser) {
                await AdminService.updateUser(selectedUser.id, formData);
            } else {
                await AdminService.addUser({
                    ...formData,
                    role: 'student',
                    collegeId,
                    collegeName: userData?.collegeName
                });
            }
            setIsUserModalOpen(false);
            setSelectedUser(null);
            fetchData();
        } catch (err) { console.error(err); }
    };


    const handleSaveContent = async (formData) => {
        try {
            const type = activeTab === 'upload-videos' ? 'video' : 'note';
            await FacultyService.uploadContent({
                ...formData,
                type,
                facultyId: currentUser.uid,
                collegeId
            });
            setIsModalOpen(false);
            fetchData();
        } catch (err) { console.error(err); }
    };

    const handleSaveLive = async (formData) => {
        try {
            await LiveService.createClass({
                ...formData,
                instructor: userData?.displayName || 'Faculty',
                collegeId,
                status: 'Live Now',
                startTime: new Date().toISOString()
            });
            setIsLiveModalOpen(false);
            fetchData();
        } catch (err) { console.error(err); }
    };

    const handleDeleteLive = async (id) => {
        if (window.confirm("End and remove this live class?")) {
            await LiveService.deleteClass(id);
            fetchData();
        }
    };

    const filteredStudents = students.filter(s => {
        const matchesSearch = s.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = filterDept === 'All' || s.dept === filterDept;
        const matchesYear = filterYear === 'All' || s.year === filterYear;
        return matchesSearch && matchesDept && matchesYear;
    });

    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const paginatedStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const renderStudents = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Student Management</h1>
                    <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest text-primary font-black">Total Active: {filteredStudents.length}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button onClick={() => { setSelectedUser(null); setIsUserModalOpen(true); }} className="px-6 py-2 bg-primary text-white font-black rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-primary/20">
                        <Plus size={16} /> Add Student
                    </button>
                    <button onClick={() => AdminService.exportToCSV(students, 'Faculty_Students')} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold text-slate-600 flex items-center gap-2 uppercase tracking-widest">
                        <FileDown size={16} /> Export
                    </button>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-primary transition-all text-sm font-medium"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        value={filterDept}
                        onChange={(e) => setFilterDept(e.target.value)}
                        className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600 font-bold text-sm outline-none cursor-pointer"
                    >
                        <option value="All">All Departments</option>
                        <option value="CSE">CSE</option>
                        <option value="IT">IT</option>
                        <option value="ECE">ECE</option>
                        <option value="EEE">EEE</option>
                        <option value="MECH">MECH</option>
                    </select>
                    <select
                        value={filterYear}
                        onChange={(e) => setFilterYear(e.target.value)}
                        className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600 font-bold text-sm outline-none cursor-pointer"
                    >
                        <option value="All">All Years</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                    </select>
                </div>
                {selectedIds.length > 0 && (
                    <button onClick={async () => { if (window.confirm(`Delete ${selectedIds.length} students?`)) { await AdminService.deleteMultipleUsers(selectedIds); setSelectedIds([]); fetchData(); } }} className="px-6 py-3 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-sm font-black flex items-center gap-2">
                        <Trash2 size={18} /> Delete Selected ({selectedIds.length})
                    </button>
                )}
            </div>

            <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 text-[10px] uppercase font-black text-slate-400 tracking-widest border-b border-slate-100">
                        <tr>
                            <th className="px-8 py-6 w-12"><input type="checkbox" onChange={e => setSelectedIds(e.target.checked ? paginatedStudents.map(s => s.id) : [])} checked={paginatedStudents.length > 0 && paginatedStudents.every(s => selectedIds.includes(s.id))} className="accent-primary" /></th>
                            <th className="px-4 py-6">Student Information</th>
                            <th className="px-6 py-6">Dept & Year</th>
                            <th className="px-8 py-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {paginatedStudents.map((s) => (
                            <tr key={s.id} className="hover:bg-slate-50/50 group transition-colors">
                                <td className="px-8 py-6"><input type="checkbox" checked={selectedIds.includes(s.id)} onChange={() => setSelectedIds(prev => prev.includes(s.id) ? prev.filter(i => i !== s.id) : [...prev, s.id])} className="accent-primary" /></td>
                                <td className="px-4 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400">{s.displayName?.charAt(0)}</div>
                                        <div>
                                            <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">{s.displayName}</p>
                                            <p className="text-[10px] text-slate-400 font-bold">{s.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-6 font-bold text-slate-500">
                                    <div className="flex flex-col">
                                        <span className="text-sm">{s.dept || 'Gen'}</span>
                                        <span className="text-[10px] text-primary">{s.year ? `${s.year}${s.year === '1' ? 'st' : s.year === '2' ? 'nd' : s.year === '3' ? 'rd' : 'th'} Year` : '—'}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setSelectedUser(s); setIsUserModalOpen(true); }} className="p-2.5 hover:bg-white rounded-xl text-slate-400 hover:text-primary transition-all border border-transparent hover:border-slate-100"><Edit3 size={18} /></button>
                                        <button onClick={async () => { if (window.confirm('Delete student?')) { await AdminService.deleteUser(s.id); fetchData(); } }} className="p-2.5 hover:bg-white rounded-xl text-slate-400 hover:text-red-500 transition-all border border-transparent hover:border-slate-100"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {loading && <div className="p-20 text-center animate-pulse text-slate-400 font-black uppercase tracking-widest">Hydrating Student Pipeline...</div>}
                {!loading && filteredStudents.length === 0 && <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest">No matching students found</div>}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-between items-center bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Page {currentPage} of {totalPages}</span>
                    <div className="flex gap-2">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-3 bg-slate-50 border border-slate-100 rounded-xl disabled:opacity-30 hover:bg-slate-100 transition-all"><ChevronLeft size={20} /></button>
                        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-3 bg-slate-50 border border-slate-100 rounded-xl disabled:opacity-30 hover:bg-slate-100 transition-all"><ChevronRight size={20} /></button>
                    </div>
                </div>
            )}
        </div>
    );

    const renderLive = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Broadcast Center</h1>
                    <p className="text-sm text-slate-500">Schedule or start live sessions</p>
                </div>
                <button onClick={() => setIsLiveModalOpen(true)} className="px-6 py-3 bg-red-600 text-white font-black rounded-xl shadow-lg shadow-red-200 flex items-center gap-2">
                    <Plus size={20} /> Host New Class
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {liveClasses.map((item) => (
                    <div key={item.id} className="bg-white border border-red-100 p-8 rounded-[2rem] shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500" />
                        <div className="flex justify-between items-start mb-6">
                            <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-black rounded-full animate-pulse uppercase">Live Now</span>
                            <button onClick={() => handleDeleteLive(item.id)} className="text-slate-200 hover:text-red-500"><Trash2 size={20} /></button>
                        </div>
                        <h4 className="text-xl font-black text-slate-900 mb-2">{item.title}</h4>
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-6">
                            <span className="flex items-center gap-1"><Clock size={14} /> {item.time}</span>
                            <span className="flex items-center gap-1"><Video size={14} /> {item.platform}</span>
                        </div>
                        <button className="w-full py-3 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-800 transition-all">Enter Studio</button>
                    </div>
                ))}
            </div>
            {liveClasses.length === 0 && <div className="p-20 text-center text-slate-400 font-black border border-dashed rounded-[3rem]">No active live sessions. Click 'Host' to start.</div>}
        </div>
    );

    const renderAssessments = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Assessment Engine</h1>
                    <p className="text-sm text-slate-500">Create tests and check student knowledge</p>
                </div>
                <button className="px-6 py-3 bg-emerald-600 text-white font-black rounded-xl flex items-center gap-2">
                    <Plus size={20} /> Create Test
                </button>
            </div>
            <div className="p-20 text-center text-slate-400 font-bold border border-dashed rounded-[3rem]">
                Assessment creation is being synchronized with the question bank.
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return (
                <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, i) => (
                            <div key={i} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}><stat.icon size={24} /></div>
                                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>{stat.change}</div>
                                </div>
                                <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
                                <div className="text-sm font-medium text-slate-500">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            );
            case 'students': return renderStudents();
            case 'upload-videos': case 'upload-notes': return (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-slate-900 capitalize">{activeTab.split('-')[1]} Library</h1>
                        <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg flex items-center gap-2"><Plus size={20} /> Upload New</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {content.map((item) => (
                            <div key={item.id} className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all relative">
                                <button onClick={async () => { if (window.confirm('Delete?')) { await FacultyService.deleteContent(item.id); fetchData(); } }} className="absolute top-6 right-6 text-slate-200 hover:text-red-500"><Trash2 size={16} /></button>
                                <div className="aspect-video bg-slate-900 rounded-2xl mb-4 flex items-center justify-center"><PlayCircle size={40} className="text-white/40" /></div>
                                <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{item.subject}</p>
                            </div>
                        ))}
                    </div>
                    {content.length === 0 && <div className="p-20 text-center text-slate-400 font-black border border-dashed rounded-[3rem]">No content found.</div>}
                </div>
            );
            case 'live': return renderLive();
            case 'assessments': return renderAssessments();
            default: return <div>Select a module from the sidebar.</div>;
        }
    };

    return (
        <div className="pb-10 min-h-screen">
            <header className="mb-10 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Faculty Workspace <span className="text-primary">OS</span></h1>
                    <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest text-primary">{userData?.collegeName} • Command Center</p>
                </div>
            </header>
            {renderContent()}
            <ContentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveContent} type={activeTab === 'upload-videos' ? 'video' : 'note'} />
            <LiveModal isOpen={isLiveModalOpen} onClose={() => setIsLiveModalOpen(false)} onSave={handleSaveLive} />
            <UserModal isOpen={isUserModalOpen} onClose={() => { setIsUserModalOpen(false); setSelectedUser(null); }} onSave={handleSaveStudent} editingUser={selectedUser} role="Student" />
        </div>
    );
};

export default FacultyDashboard;
