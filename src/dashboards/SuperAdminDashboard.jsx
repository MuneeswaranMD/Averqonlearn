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
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900">{editingCollege ? 'Update Institution' : 'Register Institution'}</h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                            {editingCollege ? `Editing ${editingCollege.name}` : 'Onboard New College Cluster'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={24} className="text-slate-400" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-10 space-y-8">
                    <div className={`grid ${editingCollege ? 'grid-cols-1' : 'grid-cols-2'} gap-8`}>
                        <div className="space-y-6">
                            <h3 className="text-sm font-black text-primary uppercase tracking-tighter flex items-center gap-2">
                                <Building2 size={16} /> College Identity
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">College Name</label>
                                    <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-primary transition-all" placeholder="e.g. Averqon Institute" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Unique Code</label>
                                        <input required type="text" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-primary transition-all" placeholder="AIT" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">College Logo (URL)</label>
                                        <input type="text" value={formData.logo} onChange={e => setFormData({ ...formData, logo: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-primary transition-all" placeholder="https://logo.url/image.png" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {!editingCollege && (
                            <div className="space-y-6 border-l border-slate-100 pl-8">
                                <h3 className="text-sm font-black text-emerald-500 uppercase tracking-tighter flex items-center gap-2">
                                    <Shield size={16} /> Primary Administrator
                                </h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Admin Full Name</label>
                                        <input required type="text" value={formData.adminName} onChange={e => setFormData({ ...formData, adminName: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-emerald-500 transition-all" placeholder="Root Admin" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Institutional Email</label>
                                        <input required type="email" value={formData.adminEmail} onChange={e => setFormData({ ...formData, adminEmail: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-emerald-500 transition-all" placeholder="admin@averqon.in" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Secret Password</label>
                                        <input required type="password" value={formData.adminPassword} onChange={e => setFormData({ ...formData, adminPassword: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-emerald-500 transition-all" placeholder="••••••••" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-8 border-t border-slate-100 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-8 py-4 bg-slate-50 text-slate-500 font-bold rounded-2xl hover:bg-slate-100 transition-all">Cancel</button>
                        <button type="submit" disabled={submitting} className="px-10 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50">
                            {submitting ? (editingCollege ? 'Updating...' : 'Initializing...') : (editingCollege ? 'Save Changes' : 'Finalize Registration')}
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
    const itemsPerPage = 5;

    const [stats, setStats] = useState([
        { label: 'Total Colleges', value: '0', change: '+2', icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Global Users', value: '0', change: '+15%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Active Admins', value: '0', change: '+5', icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Uptime', value: '99.9%', change: 'Steady', icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50' },
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
                if (s.label === 'Total Colleges') return { ...s, value: globalStats.totalColleges.toString() };
                if (s.label === 'Global Users') return { ...s, value: globalStats.totalUsers.toLocaleString() };
                if (s.label === 'Active Admins') return { ...s, value: adminData.length.toString() };
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
        if (window.confirm("Are you sure you want to delete this institution? This action cannot be undone.")) {
            try {
                await SuperAdminService.deleteCollege(id);
                fetchAllData();
            } catch (err) {
                console.error(err);
                alert("Deletion failed");
            }
        }
    };

    const handleBulkDelete = async () => {
        if (window.confirm(`Delete ${selectedIds.length} institutions?`)) {
            try {
                await SuperAdminService.deleteMultipleColleges(selectedIds);
                setSelectedIds([]);
                fetchAllData();
            } catch (err) {
                console.error(err);
            }
        }
    };


    const handleSelectAll = (e) => {
        if (e.target.checked) setSelectedIds(paginatedColleges.map(c => c.id));
        else setSelectedIds([]);
    };

    // Filters
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
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-black px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg">
                                <ArrowUpRight size={12} /> {stat.change}
                            </div>
                        </div>
                        <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-2xl font-black mb-1">Infrastructure Load</h3>
                                <p className="text-slate-400 text-sm font-medium">Global traffic distribution across nodes</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-xl text-xs font-bold text-emerald-400 border border-emerald-500/20">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Nodes Healthy
                                </div>
                            </div>
                        </div>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={[
                                    { t: '00:00', l: 12 }, { t: '04:00', l: 18 }, { t: '08:00', l: 45 },
                                    { t: '12:00', l: 82 }, { t: '16:00', l: 94 }, { t: '20:00', l: 68 },
                                    { t: '23:59', l: 25 }
                                ]}>
                                    <defs>
                                        <linearGradient id="loadGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4F47E6" stopOpacity={0.6} />
                                            <stop offset="95%" stopColor="#4F47E6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Area type="monotone" dataKey="l" stroke="#4F47E6" strokeWidth={4} fill="url(#loadGrad)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <Globe className="absolute -bottom-20 -right-20 text-white/5 w-80 h-80" />
                </div>

                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-2">
                        <AlertCircle size={22} className="text-orange-500" /> Platform Alerts
                    </h3>
                    <div className="space-y-4">
                        {[
                            { t: 'Payment Delay', c: 'SRM Institute', p: 'High', time: '12m ago' },
                            { t: 'API Limit Warning', c: 'Global', p: 'Medium', time: '45m ago' },
                            { t: 'New Admin Verified', c: 'IIT Madras', p: 'Low', time: '2h ago' },
                            { t: 'Weekly Backup', c: 'System', p: 'Low', time: '5h ago' },
                        ].map((a, i) => (
                            <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-primary/20 transition-all cursor-pointer group">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-sm font-bold text-slate-900">{a.t}</h4>
                                    <span className={`text-[10px] font-black uppercase tracking-tighter ${a.p === 'High' ? 'text-red-500' : 'text-slate-400'}`}>{a.p}</span>
                                </div>
                                <p className="text-xs text-slate-500 font-medium">{a.c} • {a.time}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderColleges = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">College Tenancy</h1>
                    <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest text-primary">Total Inventory: {filteredColleges.length}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => { setSelectedCollege(null); setIsModalOpen(true); }}
                        className="px-6 py-2 bg-primary text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-primary/20"
                    >
                        <Plus size={16} /> Register New
                    </button>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, code, or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-primary transition-all text-sm font-medium"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600 font-bold text-sm outline-none cursor-pointer"
                >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                </select>
                {selectedIds.length > 0 && (
                    <button onClick={handleBulkDelete} className="px-6 py-3 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-sm font-black flex items-center gap-2 translate-x-0 animate-in slide-in-from-right-4">
                        <Trash2 size={18} /> Delete Selected ({selectedIds.length})
                    </button>
                )}
            </div>

            <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-slate-50/50 text-[10px] uppercase font-black text-slate-400 tracking-widest border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-6 w-12">
                                    <input type="checkbox" onChange={handleSelectAll} checked={paginatedColleges.length > 0 && paginatedColleges.every(c => selectedIds.includes(c.id))} className="accent-primary" />
                                </th>
                                <th className="px-4 py-6">Institution</th>
                                <th className="px-6 py-6">Code</th>
                                <th className="px-6 py-6">Students</th>
                                <th className="px-6 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {paginatedColleges.map((c) => (
                                <tr key={c.id} className="hover:bg-slate-50/50 group transition-colors">
                                    <td className="px-8 py-6">
                                        <input type="checkbox" checked={selectedIds.includes(c.id)} onChange={() => setSelectedIds(prev => prev.includes(c.id) ? prev.filter(id => id !== c.id) : [...prev, u.id])} className="accent-primary" />
                                    </td>
                                    <td className="px-4 py-6">
                                        <div className="flex items-center gap-4">
                                            {c.logo ? (
                                                <img src={c.logo} alt={c.name} className="w-12 h-12 rounded-2xl object-contain bg-slate-100 border border-slate-200" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-900 border border-slate-200 uppercase">{c.name?.charAt(0)}</div>
                                            )}
                                            <div>
                                                <p className="font-bold text-slate-900">{c.name}</p>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase">{c.location || 'India'}</p>
                                                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${c.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{c.status || 'Active'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6"><span className="font-black text-slate-500 bg-slate-50 px-3 py-1 rounded-lg text-xs">{c.code || '—'}</span></td>
                                    <td className="px-6 py-6 font-bold text-slate-700">{c.studentCount || 0}</td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => SuperAdminService.toggleCollegeStatus(c.id, c.status || 'Active').then(fetchAllData)} className={`p-2.5 rounded-xl transition-all ${c.status === 'Active' ? 'text-slate-400 hover:text-red-500' : 'text-slate-400 hover:text-emerald-500'}`}>
                                                {c.status === 'Active' ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
                                            </button>
                                            <button onClick={() => handleEdit(c)} className="p-2.5 text-slate-400 hover:text-primary"><Edit3 size={18} /></button>
                                            <button onClick={() => handleDelete(c.id)} className="p-2.5 text-slate-400 hover:text-red-500"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {loading && <div className="p-20 text-center animate-pulse text-slate-400 font-black uppercase tracking-widest">Synchronizing Clusters...</div>}
                {!loading && filteredColleges.length === 0 && <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest">No matching institutions found</div>}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-between items-center bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Page {currentPage} of {totalPages}</span>
                    <div className="flex gap-2">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-3 bg-slate-50 border border-slate-100 rounded-xl disabled:opacity-30 hover:bg-slate-100 transition-all"><ChevronLeft size={20} /></button>
                        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-3 bg-slate-50 border border-slate-100 rounded-xl disabled:opacity-30 hover:bg-slate-100 transition-all"><ChevronRight size={20} /></button>
                    </div>
                </div>
            )}
        </div>
    );

    const renderAdmins = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Global Authority Matrix</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {admins.map((admin) => (
                    <div key={admin.id} className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all group relative">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary font-black text-xl">{admin.displayName?.charAt(0)}</div>
                            <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">Active</div>
                        </div>
                        <h4 className="font-bold text-slate-900 text-lg mb-1">{admin.displayName || 'Admin'}</h4>
                        <p className="text-xs font-bold text-slate-400 truncate mb-6">{admin.email}</p>
                        <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest truncate max-w-[150px]">{admin.collegeName || 'AIT'}</span>
                            <button className="p-2 text-slate-300 hover:text-primary"><Settings size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderLogs = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Audit Ecosystem</h1>
                <button className="px-5 py-2.5 bg-slate-900 text-white border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
                    <Download size={16} /> Export Master Logs
                </button>
            </div>
            <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="divide-y divide-slate-50 font-mono text-[13px]">
                    {logs.map((log) => (
                        <div key={log.id} className="p-6 flex gap-6 hover:bg-slate-50/50 transition-colors border-l-4 border-transparent hover:border-primary">
                            <span className="text-slate-400 shrink-0 font-bold">{log.timestamp?.toDate ? log.timestamp.toDate().toLocaleTimeString() : 'Recent'}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase shrink-0 h-fit ${log.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>{log.type || 'INFO'}</span>
                            <span className="text-slate-700 font-bold">{log.message}</span>
                            <span className="ml-auto text-slate-400 font-medium text-[10px] uppercase">{log.userId}</span>
                        </div>
                    ))}
                    {logs.length === 0 && <div className="p-20 text-center text-slate-400 font-black uppercase tracking-widest">Zero latency logs detected</div>}
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
                <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm">
                            <h3 className="text-xl font-black text-slate-900 mb-8">Global Enrollment Growth</h3>
                            <div className="h-64"><ResponsiveContainer width="100%" height="100%"><AreaChart data={analytics?.enrollmentTrend || []}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Area type="monotone" dataKey="students" stroke="#4F47E6" strokeWidth={4} fill="#4F47E6" fillOpacity={0.1} /></AreaChart></ResponsiveContainer></div>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm">
                            <h3 className="text-xl font-black text-slate-900 mb-8">Revenue by Institution</h3>
                            <div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={analytics?.collegePerformance || []}><XAxis dataKey="name" hide /><Tooltip /><Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>
                        </div>
                    </div>
                </div>
            );
            case 'settings': return (
                <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Platform Configuration</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm">
                            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2"><Server size={20} className="text-primary" /> Compute Settings</h3>
                            <div className="space-y-4">
                                <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Primary Endpoint</label><input type="text" readOnly value="api-v1.averqon.in" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-mono text-slate-500" /></div>
                            </div>
                        </div>
                        <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm">
                            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2"><Database size={20} className="text-emerald-500" /> Core Operations</h3>
                            <button onClick={() => fetchAllData()} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-primary transition-all flex items-center justify-center gap-3">
                                <Database size={20} /> Sync Cluster Data
                            </button>
                        </div>
                    </div>
                </div>
            );
            default: return renderOverview();
        }
    };

    return (
        <div className="pb-10 min-h-screen">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <img src="/logo_campus_os.png" alt="Averqon Logo" className="w-10 h-10 object-contain" />
                        Averqon Command <span className="text-primary">OS</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest">Root Authority Dashboard • SaaS Management</p>
                </div>
                <div className="px-5 py-2.5 bg-white border border-slate-200 rounded-2xl flex items-center gap-3 shadow-sm"><div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" /><span className="text-xs font-black text-slate-700">All Clusters Online</span></div>
            </header>
            {renderMain()}
            <RegisterCollegeModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedCollege(null); }} onRegister={fetchAllData} editingCollege={selectedCollege} />
        </div>
    );
};

export default SuperAdminDashboard;
