import React, { useState, useEffect } from 'react';
import {
    Briefcase, Building2, MapPin, DollarSign,
    Calendar, Users, ChevronRight, Target,
    Search, Filter, Sparkles, Building
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StudentService } from '../../services/studentService';

const Placements = () => {
    const { collegeId } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlacements = async () => {
            if (!collegeId) return;
            try {
                const data = await StudentService.getPlacements(collegeId);
                setJobs(data);
            } catch (error) {
                console.error("Error fetching placements:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPlacements();
    }, [collegeId]);

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Career Portal</h1>
                <p className="text-slate-500 mt-1">Exclusive job opportunities and placement drives for your college.</p>
            </div>

            {/* Smart Job Matching */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-100/50">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full -mr-40 -mt-40 blur-3xl animate-pulse" />
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full border border-white/10 w-fit mb-6">
                            <Sparkles size={14} className="text-primary" />
                            <span className="text-[10px] items-center font-black uppercase tracking-widest text-primary">AI Career Matching</span>
                        </div>
                        <h2 className="text-4xl font-black mb-4">Recommended for You</h2>
                        <p className="text-slate-400 font-medium leading-relaxed mb-8 max-w-md">
                            Based on your Python and Data Structures performance, we found <span className="text-white font-bold">12 matching job openings</span>.
                        </p>
                        <div className="flex gap-4">
                            <button className="px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all text-sm">
                                View Recommendations
                            </button>
                            <button className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all text-sm">
                                Update Skills
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: 'Active Drives', value: '42', color: 'text-indigo-400' },
                            { label: 'Avg Package', value: '8.4 LPA', color: 'text-emerald-400' },
                            { label: 'Companies', value: '180+', color: 'text-orange-400' },
                            { label: 'Shortlists', value: '04', color: 'text-primary' },
                        ].map((stat, i) => (
                            <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-md">
                                <div className={`text-2xl font-black mb-1 ${stat.color}`}>{stat.value}</div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Opportunities List */}
            <section className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                        <Target className="text-primary" /> Active Openings
                    </h2>
                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input type="text" placeholder="Search roles, companies..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl outline-none focus:border-primary transition-all text-sm" />
                        </div>
                        <button className="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:bg-slate-50 hover:text-primary transition-all shadow-sm"><Filter size={20} /></button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {jobs.length > 0 ? jobs.map(job => (
                        <div key={job.id} className="bg-white border border-slate-200 p-8 rounded-[40px] shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                            {job.isHot && <div className="absolute top-0 right-10 bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-b-xl uppercase tracking-widest shadow-lg shadow-primary/20">Hot Job</div>}
                            <div className="flex items-start justify-between mb-8">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform duration-500">
                                        {job.logo ? <img src={job.logo} alt={job.company} className="w-10 h-10 object-contain" /> : <Building className="text-slate-300" />}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">{job.role}</h3>
                                        <p className="text-slate-500 font-semibold">{job.company}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                                    <MapPin size={16} className="text-primary" /> {job.location}
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                                    <DollarSign size={16} className="text-emerald-500" /> {job.salary}
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                                    <Calendar size={16} className="text-orange-500" /> {job.deadline}
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                                    <Users size={16} className="text-indigo-500" /> {job.applicants || 0} applied
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                                <div className="flex gap-2">
                                    {['Full Time', 'On-Site'].map((tag, i) => (
                                        <span key={i} className="px-3 py-1 bg-slate-100 text-[10px] font-black uppercase text-slate-500 rounded-lg">{tag}</span>
                                    ))}
                                </div>
                                <button className="px-6 py-3 bg-slate-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-primary transition-all flex items-center gap-2 shadow-lg shadow-slate-200">
                                    Apply Now <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    )) : (
                        [1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-slate-50 border border-slate-200 border-dashed p-10 rounded-[40px] flex items-center justify-center opacity-50">
                                <div className="text-center">
                                    <Briefcase className="mx-auto text-slate-300 mb-2" />
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Awaiting Listings</p>
                                </div>
                            </div>
                        ))
                    )}
                    {loading && (
                        <div className="col-span-full py-20 text-center font-bold text-slate-400 animate-pulse">Scanning placement database...</div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Placements;
