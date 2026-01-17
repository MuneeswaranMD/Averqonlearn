import React, { useState, useEffect } from 'react';
import {
    Building2, Users, PieChart, Shield,
    Settings, Activity, Globe, Zap,
    Plus, Download, Search, MoreVertical,
    ArrowUpRight, AlertCircle, ScrollText,
    ExternalLink, Trash2, Edit3, CheckCircle2,
    XCircle, Filter, Server, Database, X,
    ChevronLeft, ChevronRight
} from 'lucide-react';
import Appearance from './common/Appearance';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar, Cell, Pie,
    PieChart as RePieChart
} from 'recharts';
import { SuperAdminService } from '../services/superAdminService';

const RegisterCollegeModal = ({ isOpen, onClose, onRegister, editingCollege }) => {
    const [formData, setFormData] = useState({
        name: '', code: '', location: '', logo: '',
        adminName: '', adminEmail: '',
        adminPassword: '',
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (editingCollege) {
            setFormData({
                name: editingCollege.name || '',
                code: editingCollege.code || '',
                location: editingCollege.location || '',
                logo: editingCollege.logo || '',
                adminName: '',
                adminEmail: '',
                adminPassword: '',
            });
        } else {
            setFormData({
                name: '', code: '', location: '', logo: '',
                adminName: '', adminEmail: '',
                adminPassword: '',
            });
        }
    }, [editingCollege, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingCollege) {
                await SuperAdminService.updateCollege(editingCollege.id, {
                    name: formData.name,
                    code: formData.code,
                    location: formData.location,
                    logo: formData.logo
                });
            } else {
                await SuperAdminService.registerCollegeWithAdmin(
                    { name: formData.name, code: formData.code, location: formData.location, logo: formData.logo },
                    { name: formData.adminName, email: formData.adminEmail, password: formData.adminPassword }
                );
            }
            onRegister();
            onClose();
        } catch (err) {
            console.error(err);
            alert(editingCollege ? "Update failed" : "Registration failed");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                    <div>
                        <h2 className="text-2xl font-black text-[#2b3674]">{editingCollege ? 'Update Tenant' : 'Onboard New Tenant'}</h2>
                        <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mt-1">
                            Cluster Provisioning Console
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={24} className="text-secondary" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-10 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                <Building2 size={16} /> Identity Core
                            </h3>
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-secondary uppercase tracking-widest pl-1">Institution Name</label>
                                    <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-[#f4f7fe] rounded-2xl px-5 py-4 text-sm font-bold text-[#2b3674] outline-none focus:bg-white focus:border-primary/30 transition-all shadow-sm" placeholder="Averqon University" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-secondary uppercase tracking-widest pl-1">Route Code</label>
                                        <input required type="text" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} className="w-full bg-[#f4f7fe] rounded-2xl px-5 py-4 text-sm font-bold text-[#2b3674] outline-none focus:bg-white focus:border-primary/30 transition-all shadow-sm" placeholder="AU24" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-secondary uppercase tracking-widest pl-1">Branding URI</label>
                                        <input type="text" value={formData.logo} onChange={e => setFormData({ ...formData, logo: e.target.value })} className="w-full bg-[#f4f7fe] rounded-2xl px-5 py-4 text-sm font-bold text-[#2b3674] outline-none focus:bg-white focus:border-primary/30 transition-all shadow-sm" placeholder="URL to Logo" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {!editingCollege && (
                            <div className="space-y-6 border-l border-[#f4f7fe] pl-10">
                                <h3 className="text-xs font-black text-[#05cd99] uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Shield size={16} /> Root Authority
                                </h3>
                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-secondary uppercase tracking-widest pl-1">Admin Identity</label>
                                        <input required type="text" value={formData.adminName} onChange={e => setFormData({ ...formData, adminName: e.target.value })} className="w-full bg-[#f4f7fe] rounded-2xl px-5 py-4 text-sm font-bold text-[#2b3674] outline-none focus:bg-white focus:border-[#05cd99]/30 transition-all shadow-sm" placeholder="Super Admin" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-secondary uppercase tracking-widest pl-1">Secure Email</label>
                                        <input required type="email" value={formData.adminEmail} onChange={e => setFormData({ ...formData, adminEmail: e.target.value })} className="w-full bg-[#f4f7fe] rounded-2xl px-5 py-4 text-sm font-bold text-[#2b3674] outline-none focus:bg-white focus:border-[#05cd99]/30 transition-all shadow-sm" placeholder="admin@domain.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-secondary uppercase tracking-widest pl-1">Access Token</label>
                                        <input required type="password" value={formData.adminPassword} onChange={e => setFormData({ ...formData, adminPassword: e.target.value })} className="w-full bg-[#f4f7fe] rounded-2xl px-5 py-4 text-sm font-bold text-[#2b3674] outline-none focus:bg-white focus:border-[#05cd99]/30 transition-all shadow-sm" placeholder="••••••••" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-8 border-t border-[#f4f7fe] flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-8 py-4 bg-[#f4f7fe] text-secondary font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-[#ebf0f9] transition-all">Cancel</button>
                        <button type="submit" disabled={submitting} className="btn-primary !px-12 !py-4 shadow-xl shadow-primary/20">
                            {submitting ? 'Initializing...' : (editingCollege ? 'Update Cluster' : 'Deploy Cluster')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const SuperAdminDashboard = ({ activeTab }) => {
    const [colleges, setColleges] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [logs, setLogs] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCollege, setSelectedCollege] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const [stats, setStats] = useState([
        { label: 'Global Tenants', value: '0', icon: Building2, color: '#0f172a', bg: 'bg-blue-50' },
        { label: 'Total Managed Users', value: '0', icon: Users, color: '#05cd99', bg: 'bg-green-50' },
        { label: 'System Uptime', value: '99.9%', icon: Zap, color: '#ffb547', bg: 'bg-orange-50' },
        { label: 'Audit Logs', value: 'Active', icon: ScrollText, color: '#ee5d50', bg: 'bg-red-50' },
    ]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [collegeData, adminData, globalStats] = await Promise.all([
                SuperAdminService.getColleges(),
                SuperAdminService.getCollegeAdmins(),
                SuperAdminService.getGlobalStats()
            ]);

            setColleges(collegeData);
            setAdmins(adminData);

            setStats(prev => prev.map(s => {
                if (s.label === 'Global Tenants') return { ...s, value: globalStats.totalColleges.toString() };
                if (s.label === 'Total Managed Users') return { ...s, value: globalStats.totalUsers.toLocaleString() };
                return s;
            }));

            if (activeTab === 'logs') {
                const logData = await SuperAdminService.getSystemLogs();
                setLogs(logData);
            }

            if (activeTab === 'analytics') {
                const analyticData = await SuperAdminService.getGlobalAnalytics();
                setAnalytics(analyticData);
            }
        } catch (error) {
            console.error("SuperAdmin Data Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
        setSelectedIds([]);
        setCurrentPage(1);
    }, [activeTab]);

    const handleEdit = (college) => {
        setSelectedCollege(college);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Nuclear Option: Terminate this cluster? All data will be purged.")) {
            try {
                await SuperAdminService.deleteCollege(id);
                fetchAllData();
            } catch (err) { alert("Termination failed"); }
        }
    };

    const handleBulkDelete = async () => {
        if (window.confirm(`Mass Termination: Purge ${selectedIds.length} clusters?`)) {
            try {
                await SuperAdminService.deleteMultipleColleges(selectedIds);
                setSelectedIds([]);
                fetchAllData();
            } catch (err) { console.error(err); }
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) setSelectedIds(paginatedColleges.map(c => c.id));
        else setSelectedIds([]);
    };

    const filteredColleges = colleges.filter(c => {
        const matchesSearch = c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.location?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredColleges.length / itemsPerPage);
    const paginatedColleges = filteredColleges.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                <div className="lg:col-span-2 card-main !bg-[#2b3674] !p-12 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h3 className="text-2xl font-extrabold tracking-tight mb-2">Cluster Infrastructure Load</h3>
                                <p className="text-white/60 text-sm font-semibold">Global traffic distribution across managed nodes</p>
                            </div>
                            <div className="px-5 py-2.5 bg-emerald-500/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/20 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Nodes Healthy
                            </div>
                        </div>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={[
                                    { t: '00:00', l: 12 }, { t: '04:00', l: 18 }, { t: '08:00', l: 45 },
                                    { t: '12:00', l: 82 }, { t: '16:00', l: 94 }, { t: '20:00', l: 68 },
                                    { t: '23:59', l: 25 }
                                ]}>
                                    <defs>
                                        <linearGradient id="loadGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0f172a" stopOpacity={0.6} />
                                            <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Area type="monotone" dataKey="l" stroke="#0f172a" strokeWidth={5} fill="url(#loadGrad)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <Globe className="absolute -bottom-20 -right-20 text-white/[0.03] w-96 h-96" />
                </div>

                <div className="card-main !p-10 flex flex-col">
                    <h3 className="text-xl font-extrabold text-[#2b3674] mb-10 flex items-center gap-3">
                        <AlertCircle size={24} className="text-orange-500" /> Platform Intercepts
                    </h3>
                    <div className="space-y-6 flex-1">
                        {[
                            { t: 'Threshold Reached', c: 'Institutional Node A', p: 'Critical', time: '5m' },
                            { t: 'Sync Anomaly', c: 'Central Registry', p: 'Medium', time: '12m' },
                            { t: 'New Provisioning', c: 'Cluster SRM-24', p: 'Info', time: '1h' },
                            { t: 'Audit Complete', c: 'Root System', p: 'Info', time: '3h' },
                        ].map((a, i) => (
                            <div key={i} className="group p-5 bg-[#f4f7fe]/50 rounded-2xl border border-transparent hover:border-primary/20 hover:bg-white transition-all cursor-pointer">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-sm font-extrabold text-[#2b3674]">{a.t}</h4>
                                    <span className={`text-[9px] font-black uppercase tracking-widest ${a.p === 'Critical' ? 'text-red-500' : 'text-secondary'}`}>{a.p}</span>
                                </div>
                                <p className="text-[10px] font-bold text-secondary uppercase tracking-tighter">{a.c} • {a.time} ago</p>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-10 py-4 bg-[#f4f7fe] text-[#2b3674] text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-primary hover:text-white transition-all">Intercept Logs</button>
                </div>
            </div>
        </div>
    );

    const renderColleges = () => (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-dark tracking-tight">Cluster Topology</h1>
                    <p className="text-secondary text-sm font-semibold">Managing institutional multi-tenancy directory.</p>
                </div>
                <button onClick={() => { setSelectedCollege(null); setIsModalOpen(true); }} className="btn-primary">
                    <Plus size={18} /> Provision New Cluster
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-primary transition-colors" size={18} />
                    <input type="text" placeholder="Global search in clusters..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-14 pr-4 py-4 bg-white border border-[#f4f7fe] rounded-[1.5rem] outline-none focus:border-primary/50 text-sm font-bold shadow-sm transition-all" />
                </div>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-6 py-4 bg-white border border-[#f4f7fe] rounded-[1.5rem] text-[#2b3674] font-bold text-sm outline-none focus:border-primary/50 shadow-sm cursor-pointer">
                    <option value="All">All Status</option>
                    <option value="Active">Operational</option>
                    <option value="Pending">Provisioning</option>
                </select>
                {selectedIds.length > 0 && <button onClick={handleBulkDelete} className="px-8 py-4 bg-red-500 text-white rounded-[1.5rem] text-xs font-black uppercase tracking-widest flex items-center gap-2 animate-in slide-in-from-right-4 shadow-lg shadow-red-500/20"><Trash2 size={16} /> Deprovision ({selectedIds.length})</button>}
            </div>

            <div className="card-main !p-10">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left border-b border-[#f4f7fe]">
                                <th className="pb-4 w-12 px-4"><input type="checkbox" onChange={handleSelectAll} checked={paginatedColleges.length > 0 && paginatedColleges.every(c => selectedIds.includes(c.id))} className="accent-primary" /></th>
                                <th className="pb-4 text-[11px] font-black text-secondary tracking-widest uppercase px-4">Institution Core</th>
                                <th className="pb-4 text-[11px] font-black text-secondary tracking-widest uppercase px-4">Node Code</th>
                                <th className="pb-4 text-[11px] font-black text-secondary tracking-widest uppercase px-4 text-center">Load (Users)</th>
                                <th className="pb-4 text-right px-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f4f7fe]">
                            {paginatedColleges.map((c) => (
                                <tr key={c.id} className="group hover:bg-[#f4f7fe]/30 transition-colors">
                                    <td className="py-5 px-4"><input type="checkbox" checked={selectedIds.includes(c.id)} onChange={() => setSelectedIds(prev => prev.includes(c.id) ? prev.filter(id => id !== c.id) : [...prev, c.id])} className="accent-primary" /></td>
                                    <td className="py-5 px-4">
                                        <div className="flex items-center gap-5">
                                            {c.logo ? (
                                                <img src={c.logo} alt={c.name} className="w-12 h-12 rounded-2xl object-contain bg-[#f4f7fe] border border-[#f4f7fe] p-1.5" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary text-lg">{c.name?.charAt(0)}</div>
                                            )}
                                            <div>
                                                <p className="text-sm font-extrabold text-[#2b3674] mb-0.5">{c.name}</p>
                                                <div className="flex items-center gap-3">
                                                    <p className="text-[9px] font-black text-secondary uppercase tracking-[0.1em]">{c.location || 'Cluster Node'}</p>
                                                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${c.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{c.status || 'Active'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-4 font-black text-secondary text-xs tracking-[0.1em]">{c.code || 'SYS-NODE'}</td>
                                    <td className="py-5 px-4 text-center font-extrabold text-[#2b3674]">{c.studentCount?.toLocaleString() || 0}</td>
                                    <td className="py-5 px-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => SuperAdminService.toggleCollegeStatus(c.id, c.status || 'Active').then(fetchAllData)} className={`p-2 rounded-xl transition-all ${c.status === 'Active' ? 'text-secondary hover:text-red-500' : 'text-secondary hover:text-green-500'}`}>
                                                {c.status === 'Active' ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
                                            </button>
                                            <button onClick={() => handleEdit(c)} className="p-2 text-secondary hover:text-primary transition-colors"><Edit3 size={18} /></button>
                                            <button onClick={() => handleDelete(c.id)} className="p-2 text-secondary hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
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
                    <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Shard {currentPage} of {totalPages}</span>
                    <div className="flex gap-2">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-3 bg-white border border-[#f4f7fe] rounded-xl shadow-sm disabled:opacity-30 hover:bg-primary hover:text-white transition-all"><ChevronLeft size={20} /></button>
                        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-3 bg-white border border-[#f4f7fe] rounded-xl shadow-sm disabled:opacity-30 hover:bg-primary hover:text-white transition-all"><ChevronRight size={20} /></button>
                    </div>
                </div>
            )}
        </div>
    );

    const renderAdmins = () => (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-2xl font-extrabold text-dark tracking-tight">Access Control Matrix</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {admins.map((admin) => (
                    <div key={admin.id} className="card-main !p-10 group hover:border-primary/20 transition-all">
                        <div className="flex justify-between items-start mb-10">
                            <div className="w-14 h-14 bg-[#f4f7fe] text-primary rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm font-black text-xl">{admin.displayName?.charAt(0)}</div>
                            <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[9px] font-black uppercase tracking-widest">Root Auth</div>
                        </div>
                        <h4 className="font-extrabold text-[#2b3674] text-lg mb-1">{admin.displayName || 'Root Admin'}</h4>
                        <p className="text-xs font-bold text-secondary mb-10">{admin.email}</p>
                        <div className="pt-8 border-t border-[#f4f7fe] flex items-center justify-between">
                            <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">{admin.collegeName || 'Institutional Shard'}</span>
                            <button className="p-2 text-secondary hover:text-primary transition-colors"><Settings size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderLogs = () => (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-extrabold text-dark tracking-tight">Audit Ecosystem</h1>
                <button className="px-6 py-2.5 bg-[#2b3674] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-125 transition-all flex items-center gap-2 shadow-lg shadow-[#2b3674]/20">
                    <Download size={16} /> Dump Audit Stream
                </button>
            </div>
            <div className="card-main !p-0 overflow-hidden">
                <div className="divide-y divide-[#f4f7fe] font-mono text-[13px]">
                    {logs.map((log) => (
                        <div key={log.id} className="p-6 flex gap-8 hover:bg-[#f4f7fe]/50 transition-colors border-l-4 border-transparent hover:border-primary">
                            <span className="text-secondary shrink-0 font-bold w-24">{log.timestamp?.toDate ? log.timestamp.toDate().toLocaleTimeString() : '--:--:--'}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase shrink-0 h-fit ${log.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>{log.type || 'INFO'}</span>
                            <span className="text-[#2b3674] font-bold flex-1">{log.message}</span>
                            <span className="text-secondary font-black text-[9px] uppercase tracking-tighter opacity-50">{log.userId?.slice(0, 10)}...</span>
                        </div>
                    ))}
                    {logs.length === 0 && <div className="p-20 text-center text-secondary font-black uppercase tracking-widest">Audit stream silent.</div>}
                </div>
            </div>
        </div>
    );

    const renderMain = () => {
        switch (activeTab) {
            case 'dashboard': return renderOverview();
            case 'colleges': return renderColleges();
            case 'admins': return renderAdmins();
            case 'logs': return renderLogs();
            case 'analytics': return (
                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h1 className="text-2xl font-extrabold text-dark tracking-tight">Global Meta-Analytics</h1>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="card-main !p-12">
                            <h3 className="text-lg font-extrabold text-[#2b3674] mb-10 uppercase tracking-widest">Shard Growth Dynamics</h3>
                            <div className="h-72"><ResponsiveContainer width="100%" height="100%"><AreaChart data={analytics?.enrollmentTrend || []}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f7fe" /><XAxis dataKey="name" stroke="#a3aed0" fontSize={11} /><YAxis stroke="#a3aed0" fontSize={11} /><Tooltip /><Area type="monotone" dataKey="students" stroke="#0f172a" strokeWidth={5} fill="#0f172a" fillOpacity={0.05} /></AreaChart></ResponsiveContainer></div>
                        </div>
                        <div className="card-main !p-12">
                            <h3 className="text-lg font-extrabold text-[#2b3674] mb-10 uppercase tracking-widest">Revenue Sharding</h3>
                            <div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={analytics?.collegePerformance || []}><XAxis dataKey="name" hide /><Tooltip /><Bar dataKey="revenue" fill="#05cd99" radius={[10, 10, 0, 0]} /></BarChart></ResponsiveContainer></div>
                        </div>
                    </div>
                </div>
            );
            case 'settings': return (
                <div className="max-w-4xl flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h1 className="text-2xl font-extrabold text-dark tracking-tight">Kernel Configuration</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="card-main !p-10">
                            <h3 className="text-sm font-black text-[#2b3674] mb-8 flex items-center gap-2 uppercase tracking-widest"><Server size={20} className="text-primary" /> Core Sharding</h3>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-secondary uppercase tracking-widest pl-1">Primary Shard URI</label>
                                    <input type="text" readOnly value="kernel-v1.averqon.os" className="w-full bg-[#f4f7fe] rounded-2xl px-5 py-4 text-xs font-bold text-secondary" />
                                </div>
                            </div>
                        </div>
                        <div className="card-main !p-10 flex flex-col">
                            <h3 className="text-sm font-black text-[#2b3674] mb-8 flex items-center gap-2 uppercase tracking-widest"><Database size={20} className="text-[#05cd99]" /> Meta-Data Sync</h3>
                            <p className="text-xs font-semibold text-secondary mb-10">Force a global synchronization across all institutional clusters.</p>
                            <button onClick={() => fetchAllData()} className="w-full mt-auto py-5 bg-[#2b3674] text-white font-black text-[10px] uppercase tracking-widest rounded-[1.5rem] hover:brightness-125 transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#2b3674]/20">
                                <Database size={20} /> Force Global Sync
                            </button>
                        </div>
                    </div>
                </div>
            );
            case 'appearance': return <Appearance />;
            default: return renderOverview();
        }
    };

    return (
        <div className="pb-10 min-h-screen">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                <div>
                    <h1 className="text-3xl font-black text-[#2b3674] tracking-tight flex items-center gap-4">
                        <div className="p-2 bg-primary rounded-2xl shadow-lg shadow-primary/20">
                            <Shield size={28} className="text-white" />
                        </div>
                        Averqon Command <span className="text-primary italic">OS</span>
                    </h1>
                    <p className="text-secondary font-extrabold mt-2 uppercase text-[10px] tracking-[0.3em]">Root Kernel Control • SaaS Multi-Tenancy</p>
                </div>
                <div className="px-6 py-3 bg-white border border-[#f4f7fe] rounded-2xl flex items-center gap-4 shadow-sm">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-[#2b3674] uppercase tracking-widest">All Shards Operational</span>
                </div>
            </header>
            {renderMain()}
            <RegisterCollegeModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedCollege(null); }} onRegister={fetchAllData} editingCollege={selectedCollege} />
        </div>
    );
};

export default SuperAdminDashboard;
