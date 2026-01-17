import React, { useState, useEffect } from 'react';
import {
    Users, Users2, BookOpen, Video,
    ClipboardList, Briefcase, Settings,
    DollarSign, Activity, Upload, Plus,
    ArrowUpRight, ArrowDownRight, MoreVertical,
    FileText, Building2, Package, Search, Filter,
    Mail, Calendar, ScrollText, CheckCircle2,
    BarChart3, X, Trash2, Edit3, Database,
    ChevronLeft, ChevronRight, Target, Palette
} from 'lucide-react';
import { themes } from '../context/ThemeContext';
import Appearance from './common/Appearance';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { AdminService } from '../services/adminService';
import { BatchService } from '../services/batchService';

const UserModal = ({ isOpen, onClose, onSave, editingUser, role }) => {
    const [formData, setFormData] = useState({
        displayName: '', email: '', password: 'password123', dept: '', year: '1', rollNo: ''
    });

    useEffect(() => {
        if (editingUser) {
            setFormData({
                displayName: editingUser.displayName || '',
                email: editingUser.email || '',
                password: editingUser.password || 'password123',
                dept: editingUser.dept || '',
                year: editingUser.year || '1',
                rollNo: editingUser.rollNo || ''
            });
        } else {
            setFormData({ displayName: '', email: '', password: 'password123', dept: '', year: '1', rollNo: '' });
        }
    }, [editingUser, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-black text-slate-900">{editingUser ? 'Update' : 'Register'} {role}</h2>
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
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Roll / ID</label>
                            <input required value={formData.rollNo} onChange={e => setFormData({ ...formData, rollNo: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold" placeholder="ID Number" />
                        </div>
                    </div>
                    {role === 'student' && (
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Academic Year</label>
                            <select value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold">
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
                            </select>
                        </div>
                    )}
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 bg-slate-50 text-slate-500 font-bold rounded-xl text-sm">Cancel</button>
                        <button type="submit" className="px-8 py-2.5 bg-primary text-white font-black rounded-xl text-sm shadow-lg shadow-primary/20">Finalize {role}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const BatchModal = ({ isOpen, onClose, onSave, editingBatch, facultyList, deptList }) => {
    const [formData, setFormData] = useState({
        name: '', department: '', year: '', section: '', facultyIds: [], populate: true
    });

    useEffect(() => {
        if (editingBatch) {
            setFormData({
                name: editingBatch.name || '',
                department: editingBatch.department || '',
                year: editingBatch.year || '',
                section: editingBatch.section || '',
                facultyIds: editingBatch.facultyIds?.map(f => f._id || f) || [],
                populate: false
            });
        } else {
            setFormData({ name: '', department: '', year: '', section: '', facultyIds: [], populate: true });
        }
    }, [editingBatch, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-black text-slate-900">{editingBatch ? 'Update' : 'Create'} Student Batch</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-8 space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Batch Name</label>
                        <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold" placeholder="e.g. CSE - 2024 - A" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Department</label>
                            <select required value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold">
                                <option value="">Select Dept</option>
                                {deptList.map(d => <option key={d._id} value={d.name}>{d.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Year</label>
                            <select value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold">
                                <option value="">Select Year</option>
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Assign Mentors</label>
                        <div className="max-h-32 overflow-y-auto border border-slate-100 rounded-xl bg-slate-50 p-2 space-y-1 custom-scrollbar">
                            {facultyList.map(f => (
                                <label key={f._id} className="flex items-center gap-2 p-1.5 hover:bg-white rounded-lg transition-colors cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.facultyIds.includes(f._id)}
                                        onChange={(e) => {
                                            const id = f._id;
                                            setFormData(prev => ({
                                                ...prev,
                                                facultyIds: e.target.checked
                                                    ? [...prev.facultyIds, id]
                                                    : prev.facultyIds.filter(fid => fid !== id)
                                            }));
                                        }}
                                        className="accent-primary"
                                    />
                                    <span className="text-xs font-bold text-slate-700">{f.displayName}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {!editingBatch && (
                        <div className="flex items-center gap-2 pt-2">
                            <input type="checkbox" id="populate" checked={formData.populate} onChange={e => setFormData({ ...formData, populate: e.target.checked })} className="accent-primary w-4 h-4" />
                            <label htmlFor="populate" className="text-xs font-bold text-slate-500 cursor-pointer">Auto-associate students matching criteria</label>
                        </div>
                    )}

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 bg-slate-50 text-slate-500 font-bold rounded-xl text-sm">Cancel</button>
                        <button type="submit" className="px-8 py-2.5 bg-primary text-white font-black rounded-xl text-sm shadow-lg shadow-primary/20">{editingBatch ? 'Update' : 'Propagate'} Batch</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AdminDashboard = ({ activeTab }) => {
    const { collegeId, userData } = useAuth();
    const [stats, setStats] = useState([
        { label: 'College Students', value: '0', icon: Users, color: '#0f172a', bg: 'bg-blue-50' },
        { label: 'Faculty Members', value: '0', icon: Users2, color: '#05cd99', bg: 'bg-green-50' },
        { label: 'Student Batches', value: '0', icon: Target, color: '#ee5d50', bg: 'bg-red-50' },
        { label: 'Active Depts', value: '0', icon: Building2, color: '#7b1fa2', bg: 'bg-purple-50' },
    ]);

    const [userList, setUserList] = useState([]);
    const [depts, setDepts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDept, setFilterDept] = useState('All');
    const [filterYear, setFilterYear] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [commonPass, setCommonPass] = useState('');
    const [commonFacultyPass, setCommonFacultyPass] = useState('');
    const [commonPlacementPass, setCommonPlacementPass] = useState('');
    const itemsPerPage = 8;

    const [batches, setBatches] = useState([]);
    const [facultyList, setFacultyList] = useState([]);
    const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
    const [editingBatch, setEditingBatch] = useState(null);

    const [collegeSettings, setCollegeSettings] = useState(null);
    const [selectedCollegeTheme, setSelectedCollegeTheme] = useState('indigo');

    const refreshData = async () => {
        if (!collegeId) return;
        setLoading(true);
        try {
            if (activeTab === 'dashboard') {
                const [d, students, faculty, batchList] = await Promise.all([
                    AdminService.getDepartments(collegeId),
                    AdminService.getUsersByRole(collegeId, 'student'),
                    AdminService.getUsersByRole(collegeId, 'faculty'),
                    BatchService.getAll()
                ]);
                setDepts(d);
                setStats([
                    { label: 'College Students', value: students.length.toString(), icon: Users, color: '#0f172a', bg: 'bg-blue-50' },
                    { label: 'Faculty Members', value: faculty.length.toString(), icon: Users2, color: '#05cd99', bg: 'bg-green-50' },
                    { label: 'Student Batches', value: batchList.length.toString(), icon: Target, color: '#ee5d50', bg: 'bg-red-50' },
                    { label: 'Active Depts', value: d.length.toString(), icon: Building2, color: '#7b1fa2', bg: 'bg-purple-50' },
                ]);
            } else if (['students', 'faculty', 'placements'].includes(activeTab)) {
                const roleMap = { students: 'student', faculty: 'faculty', placements: 'placement' };
                const list = await AdminService.getUsersByRole(collegeId, roleMap[activeTab]);
                setUserList(list);
            } else if (activeTab === 'batches') {
                const [b, f, d] = await Promise.all([
                    BatchService.getAll(),
                    AdminService.getUsersByRole(collegeId, 'faculty'),
                    AdminService.getDepartments(collegeId)
                ]);
                setBatches(b);
                setFacultyList(f);
                setDepts(d);
            } else if (activeTab === 'settings') {
                const settings = await AdminService.getSettings();
                setCollegeSettings(settings);
                setSelectedCollegeTheme(settings.defaultThemeId || 'indigo');
            }
        } catch (error) {
            console.error("Admin Refresh Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshData();
        setSelectedIds([]);
        setCurrentPage(1);
    }, [collegeId, activeTab]);

    const handleUserSave = async (formData) => {
        try {
            const roleMap = { students: 'student', faculty: 'faculty', placements: 'placement' };
            const currentRole = roleMap[activeTab];

            if (selectedUser) {
                await AdminService.updateUser(selectedUser.id, formData);
            } else {
                await AdminService.addUser({
                    ...formData,
                    role: currentRole,
                    collegeId,
                    collegeName: userData?.collegeName
                });
            }
            setIsUserModalOpen(false);
            setSelectedUser(null);
            refreshData();
        } catch (err) { console.error(err); }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm("Delete record?")) {
            await AdminService.deleteUser(id);
            refreshData();
        }
    };

    const handleBulkDelete = async () => {
        if (window.confirm(`Delete ${selectedIds.length} records?`)) {
            await AdminService.deleteMultipleUsers(selectedIds);
            setSelectedIds([]);
            refreshData();
        }
    };

    const handleBatchSave = async (formData) => {
        try {
            if (editingBatch) {
                await BatchService.update(editingBatch._id, formData);
            } else {
                const newBatch = await BatchService.create(formData);
                if (formData.populate) {
                    await BatchService.populate(newBatch._id, {
                        department: formData.department,
                        year: formData.year
                    });
                }
            }
            setIsBatchModalOpen(false);
            setEditingBatch(null);
            refreshData();
        } catch (err) { console.error(err); }
    };

    const handleDeleteBatch = async (id) => {
        if (window.confirm("Discard batch?")) {
            await BatchService.delete(id);
            refreshData();
        }
    };

    const filteredUsers = userList.filter(u => {
        const matchesSearch = u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.rollNo?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = filterDept === 'All' || u.dept === filterDept;
        const matchesYear = activeTab !== 'students' || filterYear === 'All' || u.year === filterYear;
        return matchesSearch && matchesDept && matchesYear;
    });

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const renderOverview = () => (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="card-main !p-8 flex items-center gap-6">
                        <div className={`p-4 ${stat.bg} rounded-2xl`}>
                            <stat.icon size={26} style={{ color: stat.color }} />
                        </div>
                        <div>
                            <p className="text-[11px] font-black text-secondary tracking-widest uppercase mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-extrabold text-[#2b3674] tracking-tight">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 card-main !p-10">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-extrabold text-dark tracking-tight">Departmental Infrastructure</h2>
                        <button onClick={async () => {
                            try {
                                setLoading(true);
                                const res = await AdminService.syncDepartments();
                                alert(res.message);
                                refreshData();
                            } catch (err) { alert('Sync failed'); }
                            finally { setLoading(false); }
                        }} className="px-4 py-2 bg-primary/10 text-primary font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all">
                            <Database size={14} className="inline mr-2" /> Sync Data
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-[#f4f7fe]">
                                    <th className="pb-4 text-[11px] font-black text-secondary tracking-widest uppercase px-4">Department</th>
                                    <th className="pb-4 text-[11px] font-black text-secondary tracking-widest uppercase px-4 text-center">Faculty</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f4f7fe]">
                                {depts.map((d, i) => (
                                    <tr key={i} className="group hover:bg-[#f4f7fe]/30 transition-colors">
                                        <td className="py-6 px-4 font-bold text-[#2b3674]">{d.name}</td>
                                        <td className="py-6 px-4 text-center">
                                            <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-lg text-xs font-bold">{d.facultyCount || 0} Members</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card-main !p-10">
                    <h2 className="text-xl font-extrabold text-dark mb-8 tracking-tight">System Status</h2>
                    <div className="space-y-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex gap-4 group">
                                <div className="w-1.5 h-12 bg-primary/20 rounded-full shrink-0 group-hover:bg-primary transition-colors" />
                                <div>
                                    <p className="text-sm font-bold text-[#2b3674]">Database Health Optimized</p>
                                    <p className="text-[10px] font-black text-secondary uppercase tracking-widest">Active Monitoring • Verified</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-10 py-4 bg-[#f4f7fe] text-[#2b3674] text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-primary hover:text-white transition-all">Command Console</button>
                </div>
            </div>
        </div>
    );

    const renderUserList = (type) => (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-dark tracking-tight capitalize">{type} Registry</h1>
                    <p className="text-secondary text-sm font-semibold">Managing institutional {type} directory.</p>
                </div>
                <div className="flex gap-3">
                    {type === 'students' && (
                        <label className="px-6 py-2 bg-white border border-[#f4f7fe] text-secondary font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-primary hover:text-white transition-all cursor-pointer flex items-center gap-2 shadow-sm">
                            <Upload size={16} /> Bulk Import
                            <input type="file" accept=".xlsx, .xls" className="hidden" onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                try {
                                    const XLSX = await import("xlsx");
                                    const reader = new FileReader();
                                    reader.onload = async (evt) => {
                                        const bstr = evt.target.result;
                                        const wb = XLSX.read(bstr, { type: 'binary' });
                                        const ws = wb.Sheets[wb.SheetNames[0]];
                                        const data = XLSX.utils.sheet_to_json(ws);
                                        if (window.confirm(`Import ${data.length} records?`)) {
                                            setLoading(true);
                                            for (const row of data) {
                                                await AdminService.addUser({
                                                    displayName: row.Name || 'Unknown',
                                                    email: row.Email || '',
                                                    rollNo: row.RollNo || '',
                                                    dept: row.Dept || '',
                                                    year: (row.Year || '1').toString(),
                                                    role: 'student',
                                                    collegeId,
                                                    collegeName: userData?.collegeName,
                                                    password: (row.RollNo || 'password123').toString()
                                                });
                                            }
                                            refreshData();
                                        }
                                    };
                                    reader.readAsBinaryString(file);
                                } catch (err) { alert("Import error"); }
                            }} />
                        </label>
                    )}
                    <button onClick={() => { setSelectedUser(null); setIsUserModalOpen(true); }} className="btn-primary">
                        <Plus size={18} /> Add {type.slice(0, -1)}
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-primary transition-colors" size={18} />
                    <input type="text" placeholder={`Search records...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-14 pr-4 py-4 bg-white border border-[#f4f7fe] rounded-[1.5rem] outline-none focus:border-primary/50 text-sm font-bold shadow-sm transition-all" />
                </div>
                <div className="flex gap-2">
                    <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="px-6 py-4 bg-white border border-[#f4f7fe] rounded-[1.5rem] text-[#2b3674] font-bold text-sm outline-none focus:border-primary/50 shadow-sm">
                        <option value="All">All Depts</option>
                        <option value="CSE">CSE</option><option value="IT">IT</option><option value="ECE">ECE</option><option value="EEE">EEE</option><option value="MECH">MECH</option>
                    </select>
                    {type === 'students' && (
                        <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="px-6 py-4 bg-white border border-[#f4f7fe] rounded-[1.5rem] text-[#2b3674] font-bold text-sm outline-none focus:border-primary/50 shadow-sm">
                            <option value="All">All Years</option>
                            <option value="1">1st Year</option><option value="2">2nd Year</option><option value="3">3rd Year</option><option value="4">4th Year</option>
                        </select>
                    )}
                </div>
                {selectedIds.length > 0 && <button onClick={handleBulkDelete} className="px-8 py-4 bg-red-500 text-white rounded-[1.5rem] text-xs font-black uppercase tracking-widest flex items-center gap-2 animate-in slide-in-from-right-4 shadow-lg shadow-red-500/20"><Trash2 size={16} /> Wipe Records ({selectedIds.length})</button>}
            </div>

            <div className="card-main !p-10">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left border-b border-[#f4f7fe]">
                                <th className="pb-4 w-12 px-4"><input type="checkbox" onChange={(e) => setSelectedIds(e.target.checked ? paginatedUsers.map(u => u.id) : [])} checked={paginatedUsers.length > 0 && paginatedUsers.every(u => selectedIds.includes(u.id))} className="accent-primary" /></th>
                                <th className="pb-4 text-[11px] font-black text-secondary tracking-widest uppercase px-4">Member Info</th>
                                <th className="pb-4 text-[11px] font-black text-secondary tracking-widest uppercase px-4">Identifier</th>
                                <th className="pb-4 text-[11px] font-black text-secondary tracking-widest uppercase px-4">Dept</th>
                                {type === 'students' && <th className="pb-4 text-[11px] font-black text-secondary tracking-widest uppercase px-4 text-center">Cohort</th>}
                                <th className="pb-4 text-right px-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f4f7fe]">
                            {paginatedUsers.map((u) => (
                                <tr key={u.id} className="group hover:bg-[#f4f7fe]/30 transition-colors">
                                    <td className="py-5 px-4"><input type="checkbox" checked={selectedIds.includes(u.id)} onChange={() => setSelectedIds(prev => prev.includes(u.id) ? prev.filter(i => i !== u.id) : [...prev, u.id])} className="accent-primary" /></td>
                                    <td className="py-5 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary">{u.displayName?.charAt(0)}</div>
                                            <div><p className="text-sm font-bold text-[#2b3674]">{u.displayName}</p><p className="text-[10px] font-bold text-secondary">{u.email}</p></div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-4 font-bold text-[#2b3674] text-xs">{u.rollNo || 'N/A'}</td>
                                    <td className="py-5 px-4 text-xs font-black text-secondary uppercase italic tracking-tighter">{u.dept || '—'}</td>
                                    {type === 'students' && <td className="py-5 px-4 text-center"><span className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-black uppercase rounded-lg">Level {u.year}</span></td>}
                                    <td className="py-5 px-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { setSelectedUser(u); setIsUserModalOpen(true); }} className="p-2 text-secondary hover:text-primary transition-colors"><Edit3 size={18} /></button>
                                            <button onClick={() => handleDeleteUser(u.id)} className="p-2 text-secondary hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {totalPages > 1 && (
                <div className="flex justify-between items-center px-6">
                    <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Page {currentPage} of {totalPages}</span>
                    <div className="flex gap-2">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(c => c - 1)} className="p-3 bg-white border border-[#f4f7fe] rounded-xl shadow-sm disabled:opacity-30 hover:bg-primary hover:text-white transition-all"><ChevronLeft size={20} /></button>
                        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(c => c + 1)} className="p-3 bg-white border border-[#f4f7fe] rounded-xl shadow-sm disabled:opacity-30 hover:bg-primary hover:text-white transition-all"><ChevronRight size={20} /></button>
                    </div>
                </div>
            )}
        </div>
    );

    const renderSettings = () => (
        <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-2xl font-extrabold text-dark mb-8 tracking-tight">Institution Guard</h1>
            <div className="card-main !p-10 space-y-12">
                <div>
                    <h3 className="text-lg font-extrabold text-[#2b3674] mb-2 flex items-center gap-2"><Palette size={20} className="text-primary" /> Institutional Branding</h3>
                    <p className="text-xs font-semibold text-secondary mb-10">Set the default palette for your institution. Students can personalize their own views unless locked by the platform.</p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
                        {themes.map(t => (
                            <button
                                key={t.id}
                                onClick={() => setSelectedCollegeTheme(t.id)}
                                className={`p-4 rounded-2xl border transition-all flex flex-col gap-3 group ${selectedCollegeTheme === t.id ? 'border-primary bg-primary/5 shadow-lg' : 'border-slate-100 hover:border-primary/30'}`}
                            >
                                <div className={`h-8 w-full rounded-lg bg-gradient-to-r ${t.gradient}`} />
                                <div className="flex justify-between items-center">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${selectedCollegeTheme === t.id ? 'text-primary' : 'text-slate-500'}`}>{t.name}</span>
                                    {selectedCollegeTheme === t.id && <CheckCircle2 size={12} className="text-primary" />}
                                </div>
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={async () => {
                            setLoading(true);
                            try {
                                await AdminService.updateSettings({ defaultThemeId: selectedCollegeTheme });
                                alert('Branding updated.');
                                refreshData();
                            } catch (err) { alert('Failed to update branding'); }
                            finally { setLoading(false); }
                        }}
                        disabled={collegeSettings?.defaultThemeId === selectedCollegeTheme}
                        className="btn-primary !w-full disabled:opacity-30"
                    >
                        Apply Institutional Branding
                    </button>
                </div>

                <div className="pt-12 border-t border-slate-100">
                    <h3 className="text-lg font-extrabold text-[#2b3674] mb-2 flex items-center gap-2"><Settings size={20} className="text-primary" /> Token Synchronization</h3>
                    <p className="text-xs font-semibold text-secondary mb-10">Configure master access tokens for institutional recovery protocols.</p>
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        if (!commonPass && !commonFacultyPass && !commonPlacementPass) return;
                        setLoading(true);
                        try {
                            await AdminService.updateSettings({ ...(commonPass && { commonPassword: commonPass }), ...(commonFacultyPass && { commonFacultyPassword: commonFacultyPass }), ...(commonPlacementPass && { commonPlacementPassword: commonPlacementPass }) });
                            alert('Tokens updated.'); setCommonPass(''); setCommonFacultyPass(''); setCommonPlacementPass('');
                            refreshData();
                        } catch (err) { alert('Sync failed'); }
                        finally { setLoading(false); }
                    }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2"><label className="text-[10px] font-black text-secondary uppercase tracking-widest">Student Entry Key</label><input type="text" value={commonPass} onChange={(e) => setCommonPass(e.target.value)} className="w-full bg-[#f4f7fe] rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:bg-white focus:border-primary/30 transition-all" /></div>
                        <div className="space-y-2"><label className="text-[10px] font-black text-secondary uppercase tracking-widest">Faculty Entry Key</label><input type="text" value={commonFacultyPass} onChange={(e) => setCommonFacultyPass(e.target.value)} className="w-full bg-[#f4f7fe] rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:bg-white focus:border-primary/30 transition-all" /></div>
                        <div className="md:col-span-2 pt-6"><button type="submit" disabled={!commonPass && !commonFacultyPass && !commonPlacementPass} className="btn-primary !w-full !py-4 shadow-xl">Commit Master Changes</button></div>
                    </form>
                </div>
            </div>
        </div>
    );

    const renderBatches = () => (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <div><h1 className="text-2xl font-extrabold text-dark tracking-tight">Academic Cohorts</h1><p className="text-secondary text-sm font-semibold">Organizing learners into managed pods.</p></div>
                <button onClick={() => { setEditingBatch(null); setIsBatchModalOpen(true); }} className="btn-primary"><Plus size={18} /> New Cohort</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {batches.map(batch => (
                    <div key={batch._id} className="card-main !p-10 group hover:border-primary/20 transition-all">
                        <div className="flex justify-between items-start mb-10">
                            <div className="w-14 h-14 bg-[#f4f7fe] text-primary rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm"><Users2 size={28} /></div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { setEditingBatch(batch); setIsBatchModalOpen(true); }} className="p-2 text-secondary hover:text-primary transition-colors"><Edit3 size={16} /></button>
                                <button onClick={() => handleDeleteBatch(batch._id)} className="p-2 text-secondary hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                            </div>
                        </div>
                        <h3 className="text-xl font-extrabold text-[#2b3674] mb-2">{batch.name}</h3>
                        <p className="text-[10px] font-black text-secondary tracking-widest uppercase mb-10">{batch.department} • Year {batch.year}</p>
                        <div className="pt-6 border-t border-[#f4f7fe] flex justify-between items-center">
                            <span className="text-xs font-bold text-secondary">{batch.studentIds?.length || 0} Learners</span>
                            <span className="text-[10px] font-black text-primary uppercase bg-primary/10 px-3 py-1 rounded-lg">{batch.facultyIds?.length || 0} Mentors</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="pb-10 min-h-screen">
            <header className="mb-10 flex justify-between items-center"><div><h1 className="text-3xl font-black text-[#2b3674] tracking-tight">System Console</h1><p className="text-secondary font-extrabold mt-1 uppercase text-[10px] tracking-widest text-primary">{userData?.collegeName} • Root Access</p></div></header>
            {activeTab === 'dashboard' ? renderOverview() : (
                activeTab === 'settings' ? renderSettings() : (
                    activeTab === 'appearance' ? <Appearance /> : (
                        activeTab === 'batches' ? renderBatches() : renderUserList(activeTab)
                    )
                )
            )}
            <UserModal isOpen={isUserModalOpen} onClose={() => { setIsUserModalOpen(false); setSelectedUser(null); }} onSave={handleUserSave} editingUser={selectedUser} role={activeTab?.slice(0, -1)} />
            <BatchModal isOpen={isBatchModalOpen} onClose={() => { setIsBatchModalOpen(false); setEditingBatch(null); }} onSave={handleBatchSave} editingBatch={editingBatch} facultyList={facultyList} deptList={depts} />
        </div>
    );
};

export default AdminDashboard;
