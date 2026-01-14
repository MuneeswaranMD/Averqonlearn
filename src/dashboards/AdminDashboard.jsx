import React, { useState, useEffect } from 'react';
import {
    Users, Users2, BookOpen, Video,
    ClipboardList, Briefcase, Settings,
    DollarSign, Activity, Upload, Plus,
    ArrowUpRight, ArrowDownRight, MoreVertical,
    FileText, Building2, Package, Search, Filter,
    Mail, Calendar, ScrollText, CheckCircle2,
    BarChart3, X, Trash2, Edit3, Database,
    ChevronLeft, ChevronRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { AdminService } from '../services/adminService';

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
                    <h2 className="text-xl font-black text-slate-900 text-primary capitalize">{editingUser ? 'Update' : 'Register'} {role}</h2>
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
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Roll Number</label>
                            <input required value={formData.rollNo} onChange={e => setFormData({ ...formData, rollNo: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold" placeholder="e.g. 21CS001" />
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

const AdminDashboard = ({ activeTab }) => {
    const { collegeId, userData } = useAuth();
    const [stats, setStats] = useState([
        { label: 'College Revenue', value: '$0', change: '+0%', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Active Students', value: '0', change: '+0%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Faculty Active', value: '0', icon: Users2, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Placements', value: '382', icon: Briefcase, color: 'text-orange-600', bg: 'bg-orange-50' },
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
    const itemsPerPage = 5;

    const refreshData = async () => {
        if (!collegeId) return;
        setLoading(true);
        try {
            if (activeTab === 'dashboard') {
                const [d, students, faculty, placements] = await Promise.all([
                    AdminService.getDepartments(collegeId),
                    AdminService.getUsersByRole(collegeId, 'student'),
                    AdminService.getUsersByRole(collegeId, 'faculty'),
                    AdminService.getUsersByRole(collegeId, 'placement')
                ]);
                setDepts(d);
                setStats([
                    { label: 'College Students', value: students.length.toString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Faculty Members', value: faculty.length.toString(), icon: Users2, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Placement Drives', value: placements.length.toString(), icon: Briefcase, color: 'text-orange-600', bg: 'bg-orange-50' },
                    { label: 'Active Depts', value: d.length.toString(), icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                ]);
            } else if (['students', 'faculty', 'placements'].includes(activeTab)) {
                const roleMap = { students: 'student', faculty: 'faculty', placements: 'placement' };
                const list = await AdminService.getUsersByRole(collegeId, roleMap[activeTab]);
                setUserList(list);
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
        if (window.confirm("Delete this user?")) {
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
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-primary/5 border border-primary/20 p-6 rounded-[2rem] flex items-center justify-between">
                <div><h3 className="text-lg font-black text-primary">Institution Management</h3><p className="text-xs font-bold text-slate-500">Manage departments and faculty data</p></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4"><div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}><stat.icon size={24} /></div></div>
                        <div className="text-2xl font-black text-slate-900 mb-1">{stat.value}</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                    </div>
                ))}
            </div>
            <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center"><h3 className="text-xl font-black text-slate-900">Departments</h3></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[600px]">
                        <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-400 tracking-widest"><tr><th className="px-8 py-6">Department Name</th><th className="px-6 py-6">Head of Dept</th><th className="px-6 py-6">Staff Count</th></tr></thead>
                        <tbody className="divide-y divide-slate-100">{depts.map((d, i) => (<tr key={i} className="hover:bg-slate-50/50 transition-colors"><td className="px-8 py-6 font-bold text-slate-900">{d.name}</td><td className="px-6 py-6 font-medium text-slate-600">{d.head || 'N/A'}</td><td className="px-6 py-6 text-sm font-bold text-slate-500">{d.facultyCount || 0} Staff</td></tr>))}</tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderUserList = (type) => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div><h1 className="text-3xl font-black text-slate-900 tracking-tight capitalize">Institutional {type}</h1><p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest text-primary font-black">Record Count: {filteredUsers.length}</p></div>
                <div className="flex flex-wrap gap-2">
                    {type === 'students' && (
                        <label className="px-4 py-2 bg-green-50 text-green-600 border border-green-100 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 cursor-pointer hover:bg-green-100 transition-all">
                            <Upload size={16} /> Import Excel
                            <input
                                type="file"
                                accept=".xlsx, .xls"
                                className="hidden"
                                onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;

                                    try {
                                        const XLSX = await import("xlsx");
                                        const reader = new FileReader();
                                        reader.onload = async (evt) => {
                                            const bstr = evt.target.result;
                                            const wb = XLSX.read(bstr, { type: 'binary' });
                                            const wsname = wb.SheetNames[0];
                                            const ws = wb.Sheets[wsname];
                                            const data = XLSX.utils.sheet_to_json(ws);

                                            if (window.confirm(`Found ${data.length} students. Import them now?`)) {
                                                setLoading(true);
                                                for (const row of data) {
                                                    await AdminService.addUser({
                                                        displayName: row.Name || row.DisplayName || 'Unknown',
                                                        email: row.Email || '',
                                                        rollNo: row.RollNo || row.rollNo || '',
                                                        dept: row.Department || row.Dept || row.dept || '',
                                                        year: (row.Year || row.year || '1').toString(),
                                                        role: 'student',
                                                        collegeId,
                                                        collegeName: userData?.collegeName,
                                                        password: (row.RollNo || row.rollNo || 'password123').toString()
                                                    });
                                                }
                                                alert("Import Complete!");
                                                refreshData();
                                            }
                                        };
                                        reader.readAsBinaryString(file);
                                    } catch (err) {
                                        console.error("Import Error:", err);
                                        alert("Failed to import excel.");
                                    }
                                }}
                            />
                        </label>
                    )}
                    <button onClick={() => { setSelectedUser(null); setIsUserModalOpen(true); }} className="px-6 py-2 bg-primary text-white font-bold rounded-xl text-xs flex items-center gap-2"><Plus size={16} /> Add {type.slice(0, -1)}</button>
                </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="text" placeholder={`Search ${type}...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-primary transition-all text-sm font-medium" /></div>
                <div className="flex gap-2">
                    <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600 font-bold text-sm">
                        <option value="All">All Departments</option>
                        <option value="CSE">CSE</option><option value="IT">IT</option><option value="ECE">ECE</option><option value="EEE">EEE</option><option value="MECH">MECH</option>
                    </select>
                    {type === 'students' && (
                        <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600 font-bold text-sm">
                            <option value="All">All Years</option>
                            <option value="1">1st Year</option><option value="2">2nd Year</option><option value="3">3rd Year</option><option value="4">4th Year</option>
                        </select>
                    )}
                </div>
                {selectedIds.length > 0 && <button onClick={handleBulkDelete} className="px-6 py-3 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-sm font-black flex items-center gap-2 animate-in slide-in-from-right-4"><Trash2 size={18} /> Delete Selected ({selectedIds.length})</button>}
            </div>
            <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-400 tracking-widest">
                            <tr>
                                <th className="px-8 py-6 w-12 text-center align-middle">
                                    <input type="checkbox" onChange={(e) => setSelectedIds(e.target.checked ? paginatedUsers.map(u => u.id) : [])} checked={paginatedUsers.length > 0 && paginatedUsers.every(u => selectedIds.includes(u.id))} className="accent-primary" />
                                </th>
                                <th className="px-4 py-6">Identity & Email</th>
                                <th className="px-4 py-6">Roll Number</th>
                                <th className="px-6 py-6 text-center">Department</th>
                                {type === 'students' && <th className="px-6 py-6 text-center">Year</th>}
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {paginatedUsers.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-50/50 group transition-colors">
                                    <td className="px-8 py-6 text-center align-middle">
                                        <input type="checkbox" checked={selectedIds.includes(u.id)} onChange={() => setSelectedIds(prev => prev.includes(u.id) ? prev.filter(i => i !== u.id) : [...prev, u.id])} className="accent-primary" />
                                    </td>
                                    <td className="px-4 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400">
                                                {u.displayName?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">{u.displayName}</p>
                                                <p className="text-[10px] text-slate-500 font-bold">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-6">
                                        <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">{u.rollNo || '—'}</span>
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                        <span className="text-xs font-bold text-slate-500 uppercase">{u.dept || '—'}</span>
                                    </td>
                                    {type === 'students' && (
                                        <td className="px-6 py-6 text-center">
                                            <span className="text-[10px] font-black text-primary uppercase border border-primary/20 bg-primary/5 px-2 py-1 rounded-full">Year {u.year}</span>
                                        </td>
                                    )}
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { setSelectedUser(u); setIsUserModalOpen(true); }} className="p-2.5 text-slate-400 hover:text-primary border border-slate-100 lg:border-transparent rounded-xl hover:bg-white transition-all"><Edit3 size={18} /></button>
                                            <button onClick={() => handleDeleteUser(u.id)} className="p-2.5 text-slate-400 hover:text-red-500 border border-slate-100 lg:border-transparent rounded-xl hover:bg-white transition-all"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {totalPages > 1 && (<div className="flex justify-between items-center bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Page {currentPage} of {totalPages}</span><div className="flex gap-2"><button disabled={currentPage === 1} onClick={() => setCurrentPage(c => c - 1)} className="p-3 bg-slate-50 border border-slate-100 rounded-xl disabled:opacity-30 hover:bg-slate-100 transition-all"><ChevronLeft size={20} /></button><button disabled={currentPage === totalPages} onClick={() => setCurrentPage(c => c + 1)} className="p-3 bg-slate-50 border border-slate-100 rounded-xl disabled:opacity-30 hover:bg-slate-100 transition-all"><ChevronRight size={20} /></button></div></div>)}
        </div>
    );

    return (
        <div className="pb-10 min-h-screen">
            <header className="mb-10 flex justify-between items-center"><div><h1 className="text-3xl font-black text-slate-900 tracking-tight">College Command <span className="text-primary">OS</span></h1><p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest text-primary font-black">{userData?.collegeName} • Root Authority</p></div></header>
            {activeTab === 'dashboard' ? renderOverview() : renderUserList(activeTab)}
            <UserModal isOpen={isUserModalOpen} onClose={() => { setIsUserModalOpen(false); setSelectedUser(null); }} onSave={handleUserSave} editingUser={selectedUser} role={activeTab?.slice(0, -1)} />
        </div>
    );
};

export default AdminDashboard;
