import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, Clock, Building, Search, Upload } from 'lucide-react';

import { PlacementService } from '../services/placement';
import { useAuth } from '../context/AuthContext';

const Placement = () => {
    const { currentUser } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchJobs = async () => {
            try {
                const data = await PlacementService.getAllJobs();
                if (data.length === 0) {
                    setJobs([
                        {
                            id: 1,
                            role: 'React Frontend Developer',
                            company: 'TechCorp Solutions',
                            location: 'Bangalore, India',
                            type: 'Full-time',
                            salary: '₹6L - ₹12L',
                            posted: '2 days ago',
                            skills: ['React', 'Redux', 'Tailwind']
                        },
                        {
                            id: 2,
                            role: 'Node.js Backend Intern',
                            company: 'Innovate Startup',
                            location: 'Remote',
                            type: 'Internship',
                            salary: '₹15k - ₹25k / mo',
                            posted: '5 hours ago',
                            skills: ['Node.js', 'Express', 'MongoDB']
                        },
                        {
                            id: 3,
                            role: 'Full Stack Developer',
                            company: 'Global Systems',
                            location: 'Chennai, India',
                            type: 'Full-time',
                            salary: '₹8L - ₹15L',
                            posted: '1 week ago',
                            skills: ['MERN', 'AWS', 'Docker']
                        }
                    ]);
                } else {
                    setJobs(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const handleApply = async (job) => {
        if (!currentUser) {
            alert("Please login to apply");
            return;
        }
        // In a real app show a modal or navigate to form
        try {
            await PlacementService.applyForJob({
                jobId: job.id,
                userId: currentUser.uid,
                jobRole: job.role,
                company: job.company
            });
            alert("Application Submitted successfully!");
        } catch (e) {
            alert("Failed to apply");
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 bg-slate-50">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="inline-block py-1 px-3 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 font-semibold text-sm mb-4">
                        💼 Career Opportunities
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Placement Hub</h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                        Exclusive job openings for Averqon Learn students. Get hired by top companies.
                    </p>
                </div>

                {/* Search & Upload */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-12 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by role, company, or skill..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                        <button className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-primary/20 whitespace-nowrap">
                            Find Jobs
                        </button>
                    </div>
                </div>

                {/* Job List */}
                <div className="space-y-6">
                    {jobs.map((job) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white border border-slate-200 hover:border-primary/30 rounded-2xl p-6 md:p-8 transition-all hover:bg-slate-50 group shadow-sm"
                        >
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                                        {job.role}
                                    </h3>
                                    <div className="flex items-center gap-2 text-slate-500 mb-4 font-medium">
                                        <Building size={16} />
                                        <span>{job.company}</span>
                                        <span className="mx-2 text-slate-200">•</span>
                                        <MapPin size={16} />
                                        <span>{job.location}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {job.skills.map((skill, i) => (
                                            <span key={i} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-600">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-6 text-sm text-slate-400">
                                        <div className="flex items-center gap-1.5">
                                            <DollarSign size={16} className="text-emerald-500" />
                                            <span className="text-slate-600">{job.salary}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Briefcase size={16} className="text-blue-500" />
                                            <span className="text-slate-600">{job.type}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={16} />
                                            <span>{job.posted}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row md:flex-col gap-3 min-w-[140px]">
                                    <button
                                        onClick={() => handleApply(job)}
                                        className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-primary/20"
                                    >
                                        Apply Now
                                    </button>
                                    <button className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-3 px-6 rounded-xl transition-all">
                                        Details
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Placement;
