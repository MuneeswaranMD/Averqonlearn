import React, { useState, useEffect, useRef } from 'react';
import {
    Building2, Briefcase, Users, PieChart,
    Target, Plus, FileText, Calendar,
    ArrowUpRight, Download, Filter, Search,
    CheckCircle2, XCircle, Clock, ScrollText,
    MoreVertical, ExternalLink, Globe, Award,
    FileCheck, Send, Trash2, Edit3, X, FileUp, FileDown,
    ChevronLeft, ChevronRight, MapPin, Database,
    UserCheck, UserMinus, GraduationCap, Layout, ClipboardCheck,
    FileCode
} from 'lucide-react';
import Appearance from './common/Appearance';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Pie, PieChart as RePieChart } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { AdminService } from '../services/adminService';
import { PlacementService } from '../services/placementService';
import ExamLibrary from '../components/dashboard/ExamLibrary';
import TPOCodingAnalytics from './placement/TPOCodingAnalytics';

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
                <div className="p-8 border-b border-[#f4f7fe] flex justify-between items-center bg-[#f4f7fe]/30">
                    <div>
                        <h2 className="text-xl font-black text-[#2b3674]">{editingUser ? 'Sync' : 'Enroll'} {role}</h2>
                        <p className="text-[10px] font-black text-secondary uppercase tracking-widest mt-1">Registry Management</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white rounded-2xl transition-all shadow-sm"><X size={20} className="text-[#2b3674]" /></button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-10 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-secondary uppercase tracking-widest pl-1">Full Identity</label>
                        <input required value={formData.displayName} onChange={e => setFormData({ ...formData, displayName: e.target.value })} className="w-full bg-[#f4f7fe] rounded-2xl px-5 py-4 text-sm font-bold text-[#2b3674] outline-none focus:bg-white focus:border-primary/30 transition-all shadow-sm" placeholder="Search result name" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-secondary uppercase tracking-widest pl-1">Secure Email</label>
                        <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-[#f4f7fe] rounded-2xl px-5 py-4 text-sm font-bold text-[#2b3674] outline-none focus:bg-white focus:border-primary/30 transition-all shadow-sm" placeholder="candidate@domain.com" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-secondary uppercase tracking-widest pl-1">Academic Unit</label>
                            <input required value={formData.dept} onChange={e => setFormData({ ...formData, dept: e.target.value })} className="w-full bg-[#f4f7fe] rounded-2xl px-5 py-4 text-sm font-bold text-[#2b3674] outline-none focus:bg-white focus:border-primary/30 transition-all shadow-sm" placeholder="CSE" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-secondary uppercase tracking-widest pl-1">Merit Index (CGPA)</label>
                            <input required step="0.1" type="number" value={formData.cgpa} onChange={e => setFormData({ ...formData, cgpa: e.target.value })} className="w-full bg-[#f4f7fe] rounded-2xl px-5 py-4 text-sm font-bold text-[#2b3674] outline-none focus:bg-white focus:border-primary/30 transition-all shadow-sm" placeholder="8.5" />
                        </div>
                    </div>
                    <div className="pt-8 border-t border-[#f4f7fe] flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-8 py-4 bg-[#f4f7fe] text-secondary font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-[#ebf0f9] transition-all">Cancel</button>
                        <button type="submit" className="btn-primary !px-10 !py-4 shadow-xl shadow-primary/20">Finalize Profile</button>
                    </div>
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
                <div className="p-8 border-b border-[#f4f7fe] flex justify-between items-center bg-[#f4f7fe]/30">
                    <div>
                        <h2 className="text-xl font-black text-[#2b3674]">Launch Recruitment Path</h2>
                        <p className="text-[10px] font-black text-secondary uppercase tracking-widest mt-1">Operational Cluster Deployment</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white rounded-2xl transition-all shadow-sm text-secondary"><X size={20} /></button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-10 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-secondary uppercase tracking-widest pl-1">Target Role</label>
                            <input required value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full bg-[#f4f7fe] rounded-2xl px-5 py-4 text-sm font-bold text-[#2b3674] outline-none focus:bg-white focus:border-primary/30 transition-all shadow-sm" placeholder="e.g. Architect" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-secondary uppercase tracking-widest pl-1">Host Entity</label>
                            <input required value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className="w-full bg-[#f4f7fe] rounded-2xl px-5 py-4 text-sm font-bold text-[#2b3674] outline-none focus:bg-white focus:border-primary/30 transition-all shadow-sm" placeholder="e.g. Google" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-secondary uppercase tracking-widest pl-1">Remuneration (LPA)</label>
                            <input required value={formData.salary} onChange={e => setFormData({ ...formData, salary: e.target.value })} className="w-full bg-[#f4f7fe] rounded-2xl px-5 py-4 text-sm font-bold text-[#2b3674] outline-none focus:bg-white focus:border-primary/30 transition-all shadow-sm" placeholder="12 LPA" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-secondary uppercase tracking-widest pl-1">Eligibility Filter</label>
                            <input required value={formData.criteria} onChange={e => setFormData({ ...formData, criteria: e.target.value })} className="w-full bg-[#f4f7fe] rounded-2xl px-5 py-4 text-sm font-bold text-[#2b3674] outline-none focus:bg-white focus:border-primary/30 transition-all shadow-sm" placeholder="7.5 CGPA" />
                        </div>
                    </div>
                    <div className="pt-8 border-t border-[#f4f7fe] flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-8 py-4 bg-[#f4f7fe] text-secondary font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-[#ebf0f9] transition-all">Cancel</button>
                        <button type="submit" className="btn-primary !px-10 !py-4 shadow-xl shadow-primary/20">Propagate Drive</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const TPODashboard = ({ activeTab }) => {
    const { collegeId, userData } = useAuth();
    const [stats, setStats] = useState([
        { label: 'Pipeline Load', value: '0', icon: Layout, color: '#0f172a', bg: 'bg-blue-50' },
        { label: 'Validated Pool', value: '0', icon: UserCheck, color: '#7b1fa2', bg: 'bg-purple-50' },
        { label: 'Success Quotient', value: '0', icon: Award, color: '#05cd99', bg: 'bg-green-50' },
        { label: 'Active Partners', value: '0', icon: Building2, color: '#ffb547', bg: 'bg-orange-50' },
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
                if (s.label === 'Pipeline Load') return { ...s, value: appData.length.toString() };
                if (s.label === 'Validated Pool') return { ...s, value: appData.filter(a => a.status === 'Shortlisted').length.toString() };
                if (s.label === 'Success Quotient') return { ...s, value: appData.filter(a => a.status === 'Placed').length.toString() };
                if (s.label === 'Active Partners') return { ...s, value: paData.length.toString() };
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
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 h-[calc(100vh-280px)] overflow-x-auto pb-4 custom-scrollbar">
                {stages.map(stage => (
                    <div key={stage} className="bg-[#f4f7fe]/30 rounded-[2rem] p-5 flex flex-col border border-[#f4f7fe] min-w-[280px]">
                        <div className="flex justify-between items-center mb-8 px-2">
                            <h3 className="font-extrabold text-[#2b3674] text-[10px] uppercase tracking-[0.2em]">{stage}</h3>
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-xl text-[10px] font-black">{applications.filter(a => a.status === stage).length}</span>
                        </div>
                        <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-1">
                            {applications.filter(a => a.status === stage).map(app => (
                                <div key={app.id} className="card-main !p-6 group hover:border-primary/20 transition-all cursor-grab active:cursor-grabbing">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-[#2b3674] flex items-center justify-center text-white text-xs font-black shadow-lg shadow-[#2b3674]/20 transform group-hover:scale-110 transition-transform">{app.studentName?.charAt(0)}</div>
                                        <div className="relative group/menu">
                                            <button className="p-2 text-secondary hover:text-[#2b3674] transition-all hover:bg-[#f4f7fe] rounded-xl"><MoreVertical size={16} /></button>
                                            <div className="absolute top-0 right-10 hidden group-hover/menu:flex flex-col bg-white border border-[#f4f7fe] rounded-2xl shadow-xl z-[70] w-48 py-2 animate-in zoom-in-95 backdrop-blur-md">
                                                <p className="px-4 py-2 text-[9px] font-black uppercase text-secondary tracking-widest border-b border-[#f4f7fe]">Relocate Shard</p>
                                                {stages.filter(s => s !== stage).map(s => (
                                                    <button key={s} onClick={() => handleUpdateStatus(app.id, s)} className="px-5 py-2.5 text-left text-[11px] font-extrabold text-[#2b3674] hover:bg-primary hover:text-white transition-all">To {s}</button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <h4 className="font-extrabold text-[#2b3674] text-sm mb-1 leading-tight">{app.studentName}</h4>
                                    <p className="text-[10px] text-secondary font-black uppercase tracking-tighter mb-4 opacity-70">{app.role} @ {app.company}</p>
                                    <div className="pt-4 border-t border-[#f4f7fe] flex justify-between items-center">
                                        <span className="text-[9px] font-black text-primary uppercase bg-primary/5 px-2 py-0.5 rounded">ID: {app.id.slice(-4)}</span>
                                        <button className="text-secondary hover:text-primary transition-colors"><ExternalLink size={14} /></button>
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
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="card-main !p-8 flex items-center gap-6">
                        <div className={`p-4 rounded-2xl flex items-center justify-center`} style={{ backgroundColor: `${stat.color}15` }}>
                            <stat.icon size={26} style={{ color: stat.color }} />
                        </div>
                        <div>
                            <p className="text-[11px] font-black text-secondary tracking-widest uppercase mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-extrabold text-[#2b3674] tracking-tight">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>
            <div className="card-main !p-12 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                        <div>
                            <h3 className="text-2xl font-extrabold text-[#2b3674] tracking-tight">Hiring Lifecycle Architecture</h3>
                            <p className="text-secondary text-sm font-semibold opacity-70">Interactive management of institutional candidate flow.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">Live Sync Active</span>
                        </div>
                    </div>
                    {renderKanban()}
                </div>
            </div>
        </div>
    );

    const renderStudentManagement = () => (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-[#2b3674] tracking-tight">Candidate Reservoir</h1>
                    <p className="text-secondary text-sm font-semibold">Total verified pipeline: {filteredStudents.length} candidates</p>
                </div>
                <button onClick={() => { setSelectedUser(null); setIsUserModalOpen(true); }} className="btn-primary">
                    <Plus size={18} /> Enroll New Candidate
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 group w-full">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-primary transition-colors" size={20} />
                    <input type="text" placeholder="Global candidate intercept..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-14 pr-4 py-4 bg-white border border-[#f4f7fe] rounded-[1.5rem] outline-none focus:border-primary/50 text-sm font-bold shadow-sm transition-all" />
                </div>
                <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="px-8 py-4 bg-white border border-[#f4f7fe] rounded-[1.5rem] text-[#2b3674] font-black text-xs outline-none focus:border-primary/50 shadow-sm cursor-pointer uppercase tracking-widest">
                    <option value="All">All Shards</option>
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                </select>
            </div>

            <div className="card-main !p-0 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-[#f4f7fe]/50 border-b border-[#f4f7fe]">
                        <tr>
                            <th className="px-10 py-6 text-[11px] font-black text-secondary tracking-widest uppercase">Candidate Identity</th>
                            <th className="px-6 py-6 text-[11px] font-black text-secondary tracking-widest uppercase">Unit</th>
                            <th className="px-6 py-6 text-[11px] font-black text-secondary tracking-widest uppercase text-center">Merit Index</th>
                            <th className="px-10 py-6 text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f4f7fe]">
                        {paginatedStudents.map(s => (
                            <tr key={s.id} className="group hover:bg-[#f4f7fe]/30 transition-all">
                                <td className="px-10 py-6">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-[#f4f7fe] text-primary flex items-center justify-center font-black text-lg shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-500">{s.displayName?.charAt(0)}</div>
                                        <div>
                                            <p className="text-sm font-extrabold text-[#2b3674] mb-0.5">{s.displayName}</p>
                                            <p className="text-[10px] font-black text-secondary uppercase tracking-widest opacity-60">{s.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-6 font-black text-primary uppercase text-[10px] tracking-[0.2em]">{s.dept || 'SYS'}</td>
                                <td className="px-6 py-6 text-center">
                                    <span className="px-4 py-1.5 bg-primary/5 text-primary rounded-xl font-black text-xs shadow-sm">GPA {s.cgpa || '8.0'}</span>
                                </td>
                                <td className="px-10 py-6 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setSelectedUser(s); setIsUserModalOpen(true); }} className="p-2.5 text-secondary hover:text-primary transition-all hover:bg-white rounded-xl shadow-sm"><Edit3 size={18} /></button>
                                        <button onClick={async () => { if (window.confirm('Wipe record?')) { await AdminService.deleteUser(s.id); fetchData(); } }} className="p-2.5 text-secondary hover:text-red-500 transition-all hover:bg-white rounded-xl shadow-sm"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {paginatedStudents.length === 0 && <div className="p-24 text-center text-secondary font-black uppercase tracking-[0.3em] opacity-30">Zero intercept result</div>}
            </div>
            {Math.ceil(filteredStudents.length / itemsPerPage) > 1 && (
                <div className="flex justify-between items-center px-6">
                    <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Shard {currentPage} Core</span>
                    <div className="flex gap-2">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-3 bg-white border border-[#f4f7fe] rounded-xl shadow-sm disabled:opacity-30 hover:bg-primary hover:text-white transition-all"><ChevronLeft size={20} /></button>
                        <button disabled={currentPage === Math.ceil(filteredStudents.length / itemsPerPage)} onClick={() => setCurrentPage(p => p + 1)} className="p-3 bg-white border border-[#f4f7fe] rounded-xl shadow-sm disabled:opacity-30 hover:bg-primary hover:text-white transition-all"><ChevronRight size={20} /></button>
                    </div>
                </div>
            )}
        </div>
    );

    const renderMain = () => {
        switch (activeTab) {
            case 'dashboard': return renderOverview();
            case 'students': return renderStudentManagement();
            case 'companies': return (
                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h1 className="text-2xl font-extrabold text-[#2b3674] tracking-tight">Industry Ecosystem Partners</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {partners.map(p => (
                            <div key={p.id} className="card-main !p-10 group hover:border-primary/20 transition-all relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -mr-16 -mt-16 group-hover:bg-primary/10 transition-all duration-700" />
                                <div className="flex justify-between items-start mb-10 relative z-10">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-[#2b3674] flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-[#2b3674]/20 group-hover:scale-110 transition-transform">{p.name?.charAt(0)}</div>
                                    <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-500/10 shadow-sm">{p.tier || 'GLOBAL MNC'}</span>
                                </div>
                                <h4 className="font-extrabold text-[#2b3674] text-xl mb-1 tracking-tight">{p.name}</h4>
                                <p className="text-[10px] text-secondary font-black uppercase tracking-[0.1em] truncate mb-10 group-hover:text-primary transition-colors">{p.website}</p>
                                <div className="pt-8 border-t border-[#f4f7fe] flex items-center justify-between relative z-10">
                                    <span className="text-[9px] font-black text-secondary uppercase tracking-[0.2em] opacity-60">Verified Cluster Partner</span>
                                    <button onClick={() => PlacementService.deletePartner(p.id).then(fetchData)} className="p-2.5 text-secondary hover:text-red-500 transition-all bg-[#f4f7fe] group-hover:bg-white rounded-xl"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))}
                        {partners.length === 0 && <div className="col-span-full card-main !p-24 text-center border-4 border-dashed border-[#f4f7fe]"><p className="text-secondary font-black uppercase tracking-widest opacity-30">Zero partner mapping</p></div>}
                    </div>
                </div>
            );
            case 'jobs': return (
                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h1 className="text-2xl font-extrabold text-[#2b3674] tracking-tight">Active Recruitment Streams</h1>
                        <button onClick={() => setIsDriveModalOpen(true)} className="btn-primary">
                            <Send size={18} /> Deploy New Drive
                        </button>
                    </div>
                    <div className="card-main !p-0 overflow-hidden shadow-xl shadow-[#f4f7fe]/50 border-[#f4f7fe]">
                        <table className="w-full">
                            <thead className="bg-[#f4f7fe]/50 border-b border-[#f4f7fe]">
                                <tr>
                                    <th className="px-10 py-6 text-[11px] font-black text-secondary tracking-widest uppercase">Target Stream / Role</th>
                                    <th className="px-6 py-6 text-[11px] font-black text-secondary tracking-widest uppercase">Host Entity</th>
                                    <th className="px-6 py-6 text-[11px] font-black text-secondary tracking-widest uppercase text-center">Eligibility Filter</th>
                                    <th className="px-10 py-6 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f4f7fe]">
                                {drives.map(d => (
                                    <tr key={d.id} className="group hover:bg-[#f4f7fe]/30 transition-all font-sans">
                                        <td className="px-10 py-6 font-extrabold text-[#2b3674] text-sm group-hover:text-primary transition-colors">{d.role}</td>
                                        <td className="px-6 py-6 font-black text-secondary uppercase text-[10px] tracking-[0.2em]">{d.company}</td>
                                        <td className="px-6 py-6 text-center">
                                            <span className="px-4 py-1.5 bg-primary/5 text-primary rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm">{d.criteria}</span>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <button onClick={() => PlacementService.deleteDrive(d.id).then(fetchData)} className="p-2.5 text-secondary hover:text-red-500 transition-all bg-[#f4f7fe] group-hover:bg-white rounded-xl shadow-sm"><Trash2 size={18} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {drives.length === 0 && <div className="p-24 text-center text-secondary font-black uppercase tracking-[0.3em] opacity-30">Zero stream activity</div>}
                    </div>
                </div>
            );
            case 'exams': return <ExamLibrary role="placement" />;
            case 'technical-analytics': return <TPOCodingAnalytics />;
            case 'appearance': return <Appearance />;
            default: return renderOverview();
        }
    };

    return (
        <div className="pb-10 min-h-screen font-sans">
            <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                    <div className="p-3 bg-[#2b3674] rounded-2xl shadow-xl shadow-[#2b3674]/20">
                        <Briefcase size={28} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-[#2b3674] tracking-tight flex items-center gap-3">Placement Command <span className="text-primary italic">OS</span></h1>
                        <p className="text-secondary font-extrabold mt-1 uppercase text-[10px] tracking-[0.3em] text-primary">{userData?.collegeName} • Recruitment HQ Cluster</p>
                    </div>
                </div>
                <div className="px-6 py-3 bg-white border border-[#f4f7fe] rounded-[1.5rem] flex items-center gap-4 shadow-sm">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                    <span className="text-[10px] font-black text-[#2b3674] uppercase tracking-widest">Drive Cluster Online</span>
                </div>
            </header>
            {renderMain()}
            <UserModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} onSave={handleSaveStudent} editingUser={selectedUser} role="Candidate" />
            <DriveModal isOpen={isDriveModalOpen} onClose={() => setIsDriveModalOpen(false)} onSave={f => PlacementService.addDrive({ ...f, collegeId }).then(fetchData).then(() => setIsDriveModalOpen(false))} />
        </div>
    );
};

export default TPODashboard;
