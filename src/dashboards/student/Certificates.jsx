import React, { useState, useEffect } from 'react';
import {
    Award, Download, Share2, ExternalLink,
    CheckCircle2, Plus, Search, Filter,
    Trophy, GraduationCap, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
// Since I haven't added getCertificates to StudentService yet, I'll add it now or mock it here with dynamic intent.
// Actually I'll just use a generic fetch if I update the service.

const Certificates = () => {
    const { currentUser } = useAuth();
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCerts = async () => {
            // Mocking fetching logic for now until StudentService is expanded
            setLoading(true);
            setTimeout(() => {
                setCertificates([]); // Assume empty for now
                setLoading(false);
            }, 800);
        };
        fetchCerts();
    }, [currentUser]);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Achievements</h1>
                    <p className="text-slate-500 mt-1">Manage and share your verified academic and skill certifications.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                        <Share2 size={18} /> Social Share
                    </button>
                    <button className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2">
                        <Download size={18} /> Bulk Download
                    </button>
                </div>
            </div>

            {/* Achievement Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Earned', value: certificates.length.toString(), icon: Trophy, color: 'text-orange-600', bg: 'bg-orange-50' },
                    { label: 'Verified Skills', value: '12', icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Course Badges', value: '08', icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm hover:shadow-md transition-all flex items-center gap-6">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                            <stat.icon size={32} />
                        </div>
                        <div>
                            <div className="text-3xl font-black text-slate-900">{stat.value}</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Certificate Grid */}
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h2 className="text-2xl font-black text-slate-900">Verified Certificates</h2>
                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input type="text" placeholder="Search certificates..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl outline-none focus:border-primary transition-all text-sm" />
                        </div>
                        <button className="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-primary transition-all shadow-sm"><Filter size={20} /></button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {certificates.length > 0 ? certificates.map(cert => (
                        <div key={cert.id} className="bg-white border-2 border-slate-100 rounded-[40px] p-8 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">
                                <Award size={120} className="text-primary rotate-12" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
                                        <Award size={24} />
                                    </div>
                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] items-center font-black rounded-lg uppercase tracking-widest flex gap-1">
                                        <CheckCircle2 size={12} /> Verified
                                    </span>
                                </div>

                                <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight group-hover:text-primary transition-colors">{cert.title}</h3>
                                <p className="text-sm font-bold text-slate-500 mb-8">{cert.issuer || 'Averqon Academy'}</p>

                                <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Issued: {cert.date}
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-2.5 bg-slate-50 text-slate-500 rounded-xl hover:bg-primary hover:text-white transition-all">
                                            <Download size={18} />
                                        </button>
                                        <button className="p-2.5 bg-slate-50 text-slate-500 rounded-xl hover:bg-primary hover:text-white transition-all">
                                            <ExternalLink size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        [1, 2, 3].map(i => (
                            <div key={i} className="bg-slate-50 border-2 border-slate-100 border-dashed rounded-[40px] p-12 text-center flex flex-col items-center justify-center group opacity-50">
                                <Award size={48} className="text-slate-200 mb-4 group-hover:scale-110 transition-transform" />
                                <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Certificate Spot</p>
                            </div>
                        ))
                    )}
                    {loading && (
                        <div className="col-span-full py-20 text-center font-bold text-slate-400 animate-pulse">Syncing with credential wallet...</div>
                    )}
                </div>
            </div>

            {/* Verification Banner */}
            <div className="bg-slate-900 rounded-[40px] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-slate-200">
                <div className="flex items-center gap-8">
                    <div className="w-20 h-20 rounded-3xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20 shrink-0">
                        <GraduationCap size={40} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black mb-2">Verify Your Skills</h3>
                        <p className="text-slate-400 font-medium max-w-md">Connect your LinkedIn profile to automatically verify and import your external certificates.</p>
                    </div>
                </div>
                <button className="px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all text-sm flex items-center gap-2 shrink-0">
                    Connect Profile <Plus size={18} />
                </button>
            </div>
        </div>
    );
};

export default Certificates;
