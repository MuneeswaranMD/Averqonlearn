import React, { useState, useEffect, useRef } from 'react';
import {
    Building2, Briefcase, Users, PieChart,
    Target, Plus, FileText, Calendar,
    ArrowUpRight, Download, Filter, Search,
    CheckCircle2, XCircle, Clock, ScrollText,
    MoreVertical, ExternalLink, Globe, Award,
    FileCheck, Send, Trash2, Edit3, X, FileUp, FileDown,
    ChevronLeft, ChevronRight, MapPin, Database,
    UserCheck, UserMinus, GraduationCap, Layout
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Pie, PieChart as RePieChart } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { AdminService } from '../services/adminService';
import { PlacementService } from '../services/placementService';

const UserModal = ({ isOpen, onClose, onSave, editingUser, role }) => {
    const [formData, setFormData] = useState({
        displayName: '', email: '', password: 'password123', dept: '', year: '1', cgpa: '8.0'
    });

    useEffect(() => {
        if (editingUser) {
            setFormData({
                displayName: editingUser.displayName || '',
                email: editingUser.email || '',
                password: editingUser.password || 'password123',
                dept: editingUser.dept || '',
                year: editingUser.year || '1',
                cgpa: editingUser.cgpa || '8.0'
            });
        } else {
            setFormData({ displayName: '', email: '', password: 'password123', dept: '', year: '1', cgpa: '8.0' });
        }
    }, [editingUser, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-black text-slate-900 capitalize">{editingUser ? 'Update' : 'Add'} {role}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X size={20} /></button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-8 space-y-4">
                    <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Name</label><input required value={formData.displayName} onChange={e => setFormData({ ...formData, displayName: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold" /></div>
                    <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email</label><input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold" /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Dept</label><input required value={formData.dept} onChange={e => setFormData({ ...formData, dept: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold" placeholder="CSE" /></div>
                        <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">CGPA</label><input required step="0.1" type="number" value={formData.cgpa} onChange={e => setFormData({ ...formData, cgpa: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold" /></div>
                    </div>
                    <div className="pt-4 flex justify-end gap-3"><button type="button" onClick={onClose} className="px-6 py-2.5 bg-slate-50 text-slate-500 font-bold rounded-xl text-sm">Cancel</button><button type="submit" className="px-8 py-2.5 bg-primary text-white font-black rounded-xl text-sm shadow-lg shadow-primary/20">Save Profile</button></div>
                </form>
            </div>
        </div>
    );
};

const DriveModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({ role: '', company: '', salary: '', location: '', criteria: '7.5 CGPA' });
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center text-primary"><h2 className="text-xl font-black text-slate-900">Launch Recruitment Drive</h2><button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X size={20} /></button></div>
                <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-8 space-y-4">
                    <div className="space-y-1"><label className="text-[10px] items-center font-black text-slate-400 uppercase tracking-widest pl-1">Role & Company</label><div className="flex gap-2"><input required placeholder="Role" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold" /><input required placeholder="Company" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold" /></div></div>
                    <div className="grid grid-cols-2 gap-4"><div className="space-y-1"><label className="text-[10px] items-center font-black text-slate-400 uppercase tracking-widest pl-1">Salary</label><input required placeholder="12 LPA" value={formData.salary} onChange={e => setFormData({ ...formData, salary: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold" /></div><div className="space-y-1"><label className="text-[10px] items-center font-black text-slate-400 uppercase tracking-widest pl-1">Criteria</label><input required value={formData.criteria} onChange={e => setFormData({ ...formData, criteria: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold" /></div></div>
                    <div className="pt-4 flex justify-end gap-3"><button type="button" onClick={onClose} className="px-6 py-2.5 bg-slate-50 text-slate-500 font-bold rounded-xl text-sm leading-none">Cancel</button><button type="submit" className="px-8 py-2.5 bg-primary text-white font-black rounded-xl text-sm shadow-lg shadow-primary/20 leading-none">Publish Drive</button></div>
                </form>
            </div>
        </div>
    );
};

const TPODashboard = ({ activeTab }) => {
    const { collegeId, userData } = useAuth();
    const [stats, setStats] = useState([
        { label: 'Active Pipeline', value: '0', icon: Layout, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Shortlisted', value: '0', icon: UserCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Total Placed', value: '0', icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Companies', value: '0', icon: Building2, color: 'text-orange-600', bg: 'bg-orange-50' },
    ]);

    const [drives, setDrives] = useState([]);
    const [partners, setPartners] = useState([]);
    const [students, setStudents] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDept, setFilterDept] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const fetchData = async () => {
        if (!collegeId) return;
        setLoading(true);
        try {
            const [plData, paData, sData, appData] = await Promise.all([
                PlacementService.getDrives(collegeId),
                PlacementService.getPartners(collegeId),
                AdminService.getUsersByRole(collegeId, 'student'),
                PlacementService.getApplications(collegeId)
            ]);
            setDrives(plData);
            setPartners(paData);
            setStudents(sData);
            setApplications(appData);

            setStats(prev => prev.map(s => {
                if (s.label === 'Active Pipeline') return { ...s, value: appData.length.toString() };
                if (s.label === 'Shortlisted') return { ...s, value: appData.filter(a => a.status === 'Shortlisted').length.toString() };
                if (s.label === 'Total Placed') return { ...s, value: appData.filter(a => a.status === 'Placed').length.toString() };
                if (s.label === 'Companies') return { ...s, value: paData.length.toString() };
                return s;
            }));
        } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); setCurrentPage(1); }, [collegeId, activeTab]);

    const handleSaveStudent = async (f) => {
        try {
            selectedUser ? await AdminService.updateUser(selectedUser.id, f) : await AdminService.addUser({ ...f, role: 'student', collegeId, collegeName: userData?.collegeName });
            setIsUserModalOpen(false); setSelectedUser(null); fetchData();
        } catch (err) { console.error(err); }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await PlacementService.updateApplicationStatus(id, status);
            fetchData();
        } catch (err) { console.error(err); }
    };


    const filteredStudents = students.filter(s => {
        const matchesSearch = s.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || s.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = filterDept === 'All' || s.dept === filterDept;
        return matchesSearch && matchesDept;
    });

    const paginatedStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const renderKanban = () => {
        const stages = ['Applied', 'Shortlisted', 'Interviewed', 'Offered', 'Placed'];
        return (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 h-[calc(100vh-250px)] overflow-x-auto pb-4">
                {stages.map(stage => (
                    <div key={stage} className="bg-slate-50/50 rounded-[2rem] p-4 flex flex-col border border-slate-100 min-w-[250px]">
                        <div className="flex justify-between items-center mb-6 px-2">
                            <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest">{stage}</h3>
                            <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-full text-[10px] font-black">{applications.filter(a => a.status === stage).length}</span>
                        </div>
                        <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-1">
                            {applications.filter(a => a.status === stage).map(app => (
                                <div key={app.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white text-[10px] font-black">{app.studentName?.charAt(0)}</div>
                                        <div className="relative group/menu">
                                            <button className="p-1 text-slate-300 hover:text-slate-600"><MoreVertical size={14} /></button>
                                            <div className="absolute top-0 right-0 hidden group-hover/menu:flex flex-col bg-white border border-slate-200 rounded-lg shadow-xl z-10 w-32 py-1">
                                                {stages.filter(s => s !== stage).map(s => (
                                                    <button key={s} onClick={() => handleUpdateStatus(app.id, s)} className="px-3 py-1.5 text-left text-[10px] items-center font-bold text-slate-600 hover:bg-slate-50">Move to {s}</button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-slate-900 text-sm mb-1">{app.studentName}</h4>
                                    <p className="text-[10px] text-slate-400 font-black mb-3">{app.role} @ {app.company}</p>
                                    <div className="pt-3 border-t border-slate-50 flex justify-between items-center">
                                        <span className="text-[9px] font-black text-primary uppercase">ID: {app.id.slice(-4)}</span>
                                        <button className="text-slate-300 hover:text-primary"><ExternalLink size={12} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderOverview = () => (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm group">
                        <div className="flex justify-between items-start mb-4"><div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}><stat.icon size={24} /></div></div>
                        <div className="text-2xl font-black text-slate-900 mb-1">{stat.value}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
                    </div>
                ))}
            </div>
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-10">
                        <div><h3 className="text-2xl font-black text-slate-900">Live Hiring Pipeline</h3><p className="text-slate-500 font-medium">Real-time tracking of candidate movement</p></div>
                    </div>
                    {renderKanban()}
                </div>
            </div>
        </div>
    );

    const renderStudentManagement = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div><h1 className="text-3xl font-black text-slate-900">Candidate Management</h1><p className="text-slate-500">Eligible pipeline: {filteredStudents.length} candidates</p></div>
                <button onClick={() => { setSelectedUser(null); setIsUserModalOpen(true); }} className="px-6 py-3 bg-primary text-white font-black rounded-xl text-xs flex items-center gap-2 shadow-lg"><Plus size={18} /> New Candidate</button>
            </div>
            <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="text" placeholder="Search candidates..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-primary transition-all text-sm font-medium" /></div>
                <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="px-6 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600 font-bold text-sm"><option value="All">All Departments</option><option value="CSE">CSE</option><option value="IT">IT</option></select>
            </div>
            <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-400 tracking-widest border-b border-slate-100"><tr><th className="px-8 py-6">Candidate</th><th className="px-6 py-6">Dept</th><th className="px-6 py-6">CGPA</th><th className="px-8 py-6 text-right">Actions</th></tr></thead>
                    <tbody className="divide-y divide-slate-100">{paginatedStudents.map(s => (
                        <tr key={s.id} className="hover:bg-slate-50/50 group transition-colors"><td className="px-8 py-6"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400">{s.displayName?.charAt(0)}</div><div><p className="font-bold text-slate-900">{s.displayName}</p><p className="text-[10px] text-slate-400 font-bold">{s.email}</p></div></div></td><td className="px-6 py-6 font-black text-slate-500 uppercase text-xs">{s.dept || '—'}</td><td className="px-6 py-6"><span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg font-black text-xs">{s.cgpa || '8.0'}</span></td><td className="px-8 py-6 text-right"><div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all"><button onClick={() => { setSelectedUser(s); setIsUserModalOpen(true); }} className="p-2 text-slate-300 hover:text-primary"><Edit3 size={16} /></button><button onClick={async () => { if (window.confirm('Delete?')) { await AdminService.deleteUser(s.id); fetchData(); } }} className="p-2 text-slate-300 hover:text-red-500"><Trash2 size={16} /></button></div></td></tr>
                    ))}</tbody>
                </table>
            </div>
        </div>
    );

    const renderMain = () => {
        switch (activeTab) {
            case 'dashboard': return renderOverview();
            case 'students': return renderStudentManagement();
            case 'companies': return (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Active Partners</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{partners.map(p => (
                        <div key={p.id} className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-all group relative">
                            <div className="flex justify-between items-start mb-6"><div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-xl">{p.name?.charAt(0)}</div><span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">{p.tier || 'MNC'}</span></div>
                            <h4 className="font-bold text-slate-900 text-lg mb-1">{p.name}</h4><p className="text-xs text-slate-400 font-bold truncate mb-6">{p.website}</p>
                            <div className="pt-6 border-t border-slate-50 flex items-center justify-between"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Industry Partner</span><button onClick={() => PlacementService.deletePartner(p.id).then(fetchData)} className="p-2 text-slate-200 hover:text-red-500 transition-all"><Trash2 size={16} /></button></div>
                        </div>
                    ))}</div>
                </div>
            );
            case 'jobs': return (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="flex justify-between items-center"><h1 className="text-3xl font-black text-slate-900">Open Drives</h1><button onClick={() => setIsDriveModalOpen(true)} className="px-6 py-3 bg-slate-900 text-white font-black rounded-xl text-xs flex items-center gap-2"><Send size={18} /> New Drive</button></div>
                    <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-400 tracking-widest border-b border-slate-100"><tr><th className="px-8 py-6">Role</th><th className="px-6 py-6">Company</th><th className="px-6 py-6">Criteria</th><th className="px-8 py-6 text-right">Action</th></tr></thead>
                            <tbody className="divide-y divide-slate-100">{drives.map(d => (
                                <tr key={d.id} className="hover:bg-slate-50/50 transition-colors"><td className="px-8 py-6 font-bold text-slate-900">{d.role}</td><td className="px-6 py-6 font-black text-slate-500">{d.company}</td><td className="px-6 py-6 text-xs font-black text-indigo-600">{d.criteria}</td><td className="px-8 py-6 text-right"><button onClick={() => PlacementService.deleteDrive(d.id).then(fetchData)} className="p-2 text-slate-200 hover:text-red-500"><Trash2 size={16} /></button></td></tr>
                            ))}</tbody>
                        </table>
                    </div>
                </div>
            );
            default: return renderOverview();
        }
    };

    return (
        <div className="pb-10 min-h-screen">
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div><h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">Placement Command <span className="text-primary">OS</span></h1><p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest text-primary font-black">{userData?.collegeName} • Recruitment HQ</p></div>
                <div className="px-5 py-2.5 bg-white border border-slate-200 rounded-2xl flex items-center gap-3 shadow-sm"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" /><span className="text-xs font-black text-slate-700">Drive Database Connected</span></div>
            </header>
            {renderMain()}
            <UserModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} onSave={handleSaveStudent} editingUser={selectedUser} role="Candidate" />
            <DriveModal isOpen={isDriveModalOpen} onClose={() => setIsDriveModalOpen(false)} onSave={f => PlacementService.addDrive({ ...f, collegeId }).then(fetchData).then(() => setIsDriveModalOpen(false))} />
        </div>
    );
};

export default TPODashboard;
