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
import Appearance from './common/Appearance';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { FacultyService } from '../services/facultyService';
import { AdminService } from '../services/adminService';
import { LiveService } from '../services/live';
import { AssessmentService } from '../services/assessment';
import { ExamService } from '../services/examService';
import ExamLibrary from '../components/dashboard/ExamLibrary';

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

const ContentModal = ({ isOpen, onClose, onSave, type, subjects, editingContent }) => {
    const [formData, setFormData] = useState({
        title: '', subjectId: '', url: '',
        unit: 'Unit 1', isVisible: true, allowDownload: true
    });

    useEffect(() => {
        if (editingContent) {
            setFormData({
                title: editingContent.title || '',
                subjectId: editingContent.subjectId || '',
                url: editingContent.url || '',
                unit: editingContent.unit || 'Unit 1',
                isVisible: editingContent.isVisible !== undefined ? editingContent.isVisible : true,
                allowDownload: editingContent.allowDownload !== undefined ? editingContent.allowDownload : true
            });
        } else {
            setFormData({
                title: '', subjectId: '', url: '',
                unit: 'Unit 1', isVisible: true, allowDownload: true
            });
        }
    }, [editingContent, isOpen]);

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-black text-slate-900">{editingContent ? 'Edit' : 'Upload'} {type === 'video' ? 'Lecture' : 'Material'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-8 space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Title</label>
                        <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Subject</label>
                            <select required value={formData.subjectId} onChange={e => setFormData({ ...formData, subjectId: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold">
                                <option value="">Select Subject</option>
                                {subjects.map(s => (
                                    <option key={s._id} value={s._id}>{s.title}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Study Unit</label>
                            <select value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold">
                                <option>Unit 1</option><option>Unit 2</option><option>Unit 3</option><option>Unit 4</option><option>Unit 5</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{type === 'video' ? 'Video/YouTube Link' : 'Media/PDF Link'}</label>
                        <input required value={formData.url} onChange={e => setFormData({ ...formData, url: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold" />
                    </div>
                    <div className="flex justify-between pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="accent-primary w-4 h-4" checked={formData.isVisible} onChange={e => setFormData({ ...formData, isVisible: e.target.checked })} />
                            <span className="text-xs font-bold text-slate-600">Visible to Students</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="accent-primary w-4 h-4" checked={formData.allowDownload} onChange={e => setFormData({ ...formData, allowDownload: e.target.checked })} />
                            <span className="text-xs font-bold text-slate-600">Allow Download</span>
                        </label>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 bg-slate-50 text-slate-500 font-bold rounded-xl text-sm">Cancel</button>
                        <button type="submit" className="px-8 py-2.5 bg-primary text-white font-black rounded-xl text-sm shadow-lg shadow-primary/20 flex items-center gap-2">
                            {editingContent ? <Edit3 size={16} /> : <Upload size={16} />} {editingContent ? 'Update' : 'Publish Now'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const SubjectModal = ({ isOpen, onClose, onSave, batches, editingSubject }) => {
    const [formData, setFormData] = useState({ title: '', description: '', selectedBatches: [] });

    useEffect(() => {
        if (editingSubject) {
            setFormData({
                title: editingSubject.title || '',
                description: editingSubject.description || '',
                dept: editingSubject.dept || '',
                year: editingSubject.year || '',
                selectedBatches: editingSubject.batches ? editingSubject.batches.map(b => typeof b === 'object' ? b._id : b) : []
            });
        } else {
            setFormData({ title: '', description: '', dept: '', year: '', selectedBatches: [] });
        }
    }, [editingSubject, isOpen]);

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-black text-slate-900">{editingSubject ? 'Edit Subject' : 'Create New Subject'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-8 space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Subject Title</label>
                        <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold" placeholder="e.g. Advanced Mathematics" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Target Dept</label>
                            <input value={formData.dept} onChange={e => setFormData({ ...formData, dept: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm font-bold" placeholder="CSE" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Target Year</label>
                            <select value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm font-bold">
                                <option value="">Select Year</option>
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Description</label>
                        <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold" placeholder="Short description..." />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Assign to Batches (Optional)</label>
                        <div className="max-h-32 overflow-y-auto border border-slate-100 rounded-xl p-2 bg-slate-50 space-y-2">
                            {batches.map(batch => (
                                <label key={batch._id} className="flex items-center gap-2 p-2 hover:bg-white rounded-lg cursor-pointer transition-colors">
                                    <input
                                        type="checkbox"
                                        className="accent-primary"
                                        checked={formData.selectedBatches.includes(batch._id)}
                                        onChange={(e) => {
                                            if (e.target.checked) setFormData({ ...formData, selectedBatches: [...formData.selectedBatches, batch._id] });
                                            else setFormData({ ...formData, selectedBatches: formData.selectedBatches.filter(id => id !== batch._id) });
                                        }}
                                    />
                                    <span className="text-xs font-bold text-slate-700">{batch.name}</span>
                                </label>
                            ))}
                            {batches.length === 0 && <div className="text-xs text-slate-400 italic p-2">No specific batches assigned to you.</div>}
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 bg-slate-50 text-slate-500 font-bold rounded-xl text-sm">Cancel</button>
                        <button type="submit" className="px-8 py-2.5 bg-primary text-white font-black rounded-xl text-sm shadow-lg shadow-primary/20">{editingSubject ? 'Update' : 'Create Subject'}</button>
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
        { label: 'Active Students', value: '450', change: '+12%', icon: Users, color: '#0f172a' },
        { label: 'Courses Taught', value: '12', change: '0%', icon: BookOpen, color: '#05cd99' },
        { label: 'Quiz Completion', value: '85%', change: '+5%', icon: ClipboardList, color: '#ffb547' },
        { label: 'Avg. Score', value: '78', change: '+2%', icon: TrendingUp, color: '#ee5d50' },
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
    const [filterSubject, setFilterSubject] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const [myBatches, setMyBatches] = useState([]);
    const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedContent, setSelectedContent] = useState(null);

    const fetchData = async () => {
        if (!currentUser || !collegeId) return;
        setLoading(true);
        try {
            const subjects = await FacultyService.getTaughtSubjects(currentUser.uid);
            setTaughtSubjects(subjects);
            const batches = await FacultyService.getBatches();
            const facultyBatches = batches.filter(b => b.facultyIds.some(f => f._id === currentUser.uid || f === currentUser.uid));
            setMyBatches(facultyBatches);

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

    const handleSaveSubject = async (formData) => {
        try {
            if (selectedSubject) {
                await FacultyService.updateSubject(selectedSubject._id, {
                    ...formData,
                    batches: formData.selectedBatches
                });
            } else {
                await FacultyService.createSubject({
                    ...formData,
                    batches: formData.selectedBatches
                });
            }
            setIsSubjectModalOpen(false);
            setSelectedSubject(null);
            fetchData();
        } catch (err) { console.error(err); }
    };

    const handleSaveContent = async (formData) => {
        try {
            if (selectedContent) {
                await FacultyService.updateContent(selectedContent._id || selectedContent.id, formData);
            } else {
                const type = activeTab === 'upload-videos' ? 'video' : 'note';
                await FacultyService.uploadContent({
                    ...formData,
                    type,
                    facultyId: currentUser.uid,
                    collegeId
                });
            }
            setIsModalOpen(false);
            setSelectedContent(null);
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

    const renderStudents = () => {
        const filteredStudents = students.filter(s => {
            const matchesSearch = s.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.email?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDept = filterDept === 'All' || s.dept === filterDept;
            const matchesYear = filterYear === 'All' || s.year === filterYear;
            return matchesSearch && matchesDept && matchesYear;
        });

        const paginatedStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

        return (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-extrabold text-dark tracking-tight">Student Directory</h2>
                    <button onClick={() => { setSelectedUser(null); setIsUserModalOpen(true); }} className="btn-primary">
                        <Plus size={18} /> New Student
                    </button>
                </div>

                <div className="card-main !p-10">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-[#f4f7fe]">
                                    <th className="pb-4 text-[11px] font-black text-secondary tracking-widest uppercase px-4">Name</th>
                                    <th className="pb-4 text-[11px] font-black text-secondary tracking-widest uppercase px-4">Dept</th>
                                    <th className="pb-4 text-[11px] font-black text-secondary tracking-widest uppercase px-4">Year</th>
                                    <th className="pb-4 text-right px-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f4f7fe]">
                                {paginatedStudents.map((s) => (
                                    <tr key={s.id} className="group hover:bg-[#f4f7fe]/30 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary">
                                                    {s.displayName?.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-[#2b3674]">{s.displayName}</span>
                                                    <span className="text-[10px] font-bold text-secondary">{s.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-sm font-bold text-[#2b3674]">{s.dept || 'Gen'}</td>
                                        <td className="py-4 px-4 text-sm font-bold text-primary">{s.year} Year</td>
                                        <td className="py-4 px-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => { setSelectedUser(s); setIsUserModalOpen(true); }} className="p-2 text-secondary hover:text-primary transition-colors">
                                                    <Edit3 size={18} />
                                                </button>
                                                <button onClick={async () => { if (window.confirm('Delete student?')) { await AdminService.deleteUser(s.id); fetchData(); } }} className="p-2 text-secondary hover:text-red-500 transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderSubjects = () => (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-dark tracking-tight">Assigned Subjects</h2>
                <button onClick={() => { setSelectedSubject(null); setIsSubjectModalOpen(true); }} className="btn-primary">
                    <Plus size={18} /> Create Subject
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {taughtSubjects.map(sub => (
                    <div key={sub._id} className="card-main !p-10 flex flex-col group hover:border-primary/20 transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 bg-[#f4f7fe] text-primary rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                <BookOpen size={28} />
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => { setSelectedSubject(sub); setIsSubjectModalOpen(true); }} className="p-2 text-secondary hover:text-primary transition-colors"><Edit3 size={16} /></button>
                                <button onClick={async () => { if (window.confirm('Delete subject?')) { await FacultyService.deleteSubject(sub._id); fetchData(); } }} className="p-2 text-secondary hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                            </div>
                        </div>
                        <h3 className="text-xl font-extrabold text-[#2b3674] mb-2">{sub.title}</h3>
                        <p className="text-xs font-semibold text-secondary mb-8 line-clamp-2 leading-relaxed">{sub.description || 'Professional course module for advanced learners.'}</p>

                        <div className="mt-auto pt-6 border-t border-[#f4f7fe] flex justify-between items-center">
                            <span className="text-[10px] font-black text-secondary tracking-widest uppercase">{sub.year}nd Year • {sub.dept}</span>
                            <button className="px-4 py-2 bg-primary/10 text-primary font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all">Portal</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {stats.map((stat, i) => (
                                <div key={i} className="card-main !p-8 flex items-center gap-6">
                                    <div className="p-4 bg-[#f4f7fe] text-primary rounded-2xl">
                                        <stat.icon size={26} style={{ color: stat.color }} />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black text-secondary tracking-widest uppercase mb-1">{stat.label}</p>
                                        <h3 className="text-2xl font-extrabold text-[#2b3674] tracking-tight">{stat.value}</h3>
                                        <div className="flex items-center gap-1 mt-1">
                                            <TrendingUp size={12} className="text-green-500" />
                                            <span className="text-[10px] font-bold text-green-500">{stat.change}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 card-main !p-10">
                                <h2 className="text-xl font-extrabold text-dark mb-8">Teaching Efficiency</h2>
                                <div className="h-72 flex items-center justify-center bg-[#f4f7fe]/50 border-2 border-dashed border-[#f4f7fe] rounded-[2rem]">
                                    <div className="flex flex-col items-center gap-2">
                                        <Activity size={40} className="text-primary/20" />
                                        <p className="text-secondary font-bold text-sm italic">Real-time engagement metrics loading...</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-main !p-10">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-extrabold text-dark">Top Achievers</h2>
                                    <button className="text-[10px] font-black text-primary uppercase tracking-widest">Details</button>
                                </div>
                                <div className="space-y-6">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="flex items-center gap-4 group">
                                            <div className="w-11 h-11 rounded-2xl bg-[#f4f7fe] flex items-center justify-center font-extrabold text-primary group-hover:bg-primary group-hover:text-white transition-all">SS</div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-[#2b3674]">Naveen Kumar</p>
                                                <p className="text-[10px] font-black text-secondary uppercase tracking-tighter">CSE • 98% Readiness</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'students': return renderStudents();
            case 'subjects': return renderSubjects();
            case 'upload-videos':
            case 'upload-notes':
                return (
                    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-extrabold text-dark capitalize tracking-tight">{activeTab.split('-')[1]} Library</h2>
                            <button onClick={() => { setSelectedContent(null); setIsModalOpen(true); }} className="btn-primary">
                                <Upload size={18} /> Upload Asset
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {content.filter(item => activeTab.includes(item.type)).map(item => (
                                <div key={item._id} className="card-main !p-0 overflow-hidden flex flex-col group hover:border-primary/20 transition-all">
                                    <div className="aspect-video bg-[#f4f7fe] flex items-center justify-center relative">
                                        {item.type === 'video' ? <PlayCircle size={48} className="text-primary/10 group-hover:text-primary/30 transition-all" /> : <Database size={48} className="text-primary/10 group-hover:text-primary/30 transition-all" />}
                                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { setSelectedContent(item); setIsModalOpen(true); }} className="p-2 bg-white rounded-lg shadow-sm text-secondary hover:text-primary"><Edit3 size={16} /></button>
                                            <button onClick={async () => { if (window.confirm('Delete asset?')) { await FacultyService.deleteContent(item._id); fetchData(); } }} className="p-2 bg-white rounded-lg shadow-sm text-secondary hover:text-red-500"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest rounded">{item.unit}</span>
                                            <span className="text-[9px] font-bold text-secondary uppercase italic">Shared in {item.subjectId?.title || 'General'}</span>
                                        </div>
                                        <h4 className="font-extrabold text-[#2b3674] leading-tight mb-6 line-clamp-1">{item.title}</h4>
                                        <a href={item.url} target="_blank" rel="noreferrer" className="w-full py-3 bg-[#f4f7fe] text-[#2b3674] text-[10px] font-black uppercase tracking-widest rounded-xl text-center block hover:bg-primary hover:text-white transition-all">View Asset</a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'live': return (
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-20 bg-white rounded-[3rem] border border-[#f4f7fe]">
                    <div className="w-24 h-24 bg-[#f4f7fe] text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <Mic size={40} className="animate-pulse" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-dark tracking-tight">Faculty Studio</h2>
                    <p className="text-secondary font-semibold max-w-sm mx-auto mb-10 leading-relaxed text-sm">Launch a high-definition broadcast and interact with your students in real-time. Features include screen-sharing and live moderated chat.</p>
                    <div className="flex justify-center gap-4">
                        <button onClick={() => setIsLiveModalOpen(true)} className="btn-primary !bg-red-500 !shadow-red-500/20 px-10">
                            Launch Studio Now
                        </button>
                    </div>
                </div>
            );
            case 'assessments': return <ExamLibrary role="faculty" />;
            case 'appearance': return <Appearance />;
            default: return <div className="p-20 text-center text-secondary font-bold">Select a module from the menu.</div>;
        }
    };

    return (
        <div className="pb-10 min-h-full">
            {renderContent()}

            <UserModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} onSave={handleSaveStudent} editingUser={selectedUser} role="Student" />
            <ContentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveContent} type={activeTab === 'upload-videos' ? 'video' : 'note'} subjects={taughtSubjects} editingContent={selectedContent} />
            <SubjectModal isOpen={isSubjectModalOpen} onClose={() => setIsSubjectModalOpen(false)} onSave={handleSaveSubject} batches={myBatches} editingSubject={selectedSubject} />
            <LiveModal isOpen={isLiveModalOpen} onClose={() => setIsLiveModalOpen(false)} onSave={handleSaveLive} />
        </div>
    );
};

export default FacultyDashboard;
