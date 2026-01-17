import React, { useState, useEffect } from 'react';
import {
    User, Mail, Phone, MapPin, Globe, Camera, Shield, Bell, Lock, Key, Trash2,
    GraduationCap, BookOpen, Cpu, Briefcase, FileText, Award, Rocket, CheckCircle2,
    ChevronRight, Github, Linkedin, ExternalLink, Plus, X, BarChart, HardHat, Code, Database, Cloud
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { UserService } from '../../services/user';

const DashboardProfile = () => {
    const { currentUser, userData, studentData, isStudent } = useAuth();
    const [activeTab, setActiveTab] = useState('basic');
    const [saving, setSaving] = useState(false);

    // Initial profile structure based on requirements
    const [formData, setFormData] = useState({
        // 1. Basic Info
        basic: {
            fullName: (isStudent ? studentData?.name : (userData?.displayName || currentUser?.displayName)) || '',
            rollNo: (isStudent ? studentData?.rollNo : 'N/A') || 'N/A',
            collegeName: (isStudent ? studentData?.collegeName : 'Averqon University') || 'Averqon University',
            department: (isStudent ? studentData?.department : 'Computer Science') || 'Computer Science',
            yearSection: (isStudent ? studentData?.yearSection : 'N/A') || 'N/A',
            email: currentUser?.email || '',
            mobile: '+91 ',
            photoUrl: '',
        },
        // 2. Academic Details
        academic: {
            currentSemester: '6',
            cgpa: '',
            backlogs: 'No',
            areasOfInterest: [], // Core, Software, Data, Cloud
        },
        // 3. Skills
        skills: {
            languages: [],
            webTech: [],
            databases: [],
            tools: []
        },
        // 4. Experience
        experience: {
            projects: [],
            internships: []
        },
        // 5. Portfolio
        portfolio: {
            resumeUrl: '',
            website: '',
            github: '',
            linkedin: ''
        },
        // 6. Placement Prefs
        placement: {
            preferredRole: '',
            preferredLocation: '',
            willingnessForInternship: 'Yes',
            higherStudiesInterest: 'No'
        },
        // 7. Extra
        achievements: {
            certifications: [],
            awards: []
        }
    });

    // Handle Input Changes
    const handleBasicChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            basic: { ...prev.basic, [name]: value }
        }));
    };

    const handleAcademicChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            academic: { ...prev.academic, [name]: value }
        }));
    };

    // Calculate Completion
    const calculateCompletion = () => {
        let totalFields = 20;
        let filledFields = 0;

        if (formData.academic.cgpa) filledFields++;
        if (formData.portfolio.resumeUrl) filledFields++;
        if (formData.portfolio.linkedin) filledFields++;
        if (formData.skills.languages.length > 0) filledFields++;
        if (formData.experience.projects.length > 0) filledFields++;
        // Summary calculation...
        const percentage = Math.round((filledFields / 10) * 100);
        return Math.min(percentage, 100);
    };

    const completion = calculateCompletion();

    const saveProfile = async () => {
        setSaving(true);
        try {
            await UserService.updateUserProfile(currentUser.uid, formData);
            // Success notification logic
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: 'basic', label: 'Identity & Academics', icon: User },
        { id: 'skills', label: 'Skills & Tech', icon: Code },
        { id: 'experience', label: 'Projects & Experience', icon: Briefcase },
        { id: 'documents', label: 'Resumes & Prefs', icon: FileText },
        { id: 'awards', label: 'Achievements', icon: Award },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header with Completion */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-text-primary tracking-tight">Student Profile</h1>
                    <p className="text-text-secondary mt-1 font-medium">Build your professional presence for placement readiness.</p>
                </div>

                <div className="w-full md:w-64 bg-card p-4 rounded-2xl border border-border shadow-sm flex items-center gap-4">
                    <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-border" />
                            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-primary" strokeDasharray={125.6} strokeDashoffset={125.6 - (125.6 * completion) / 100} />
                        </svg>
                        <span className="absolute text-[10px] font-black text-primary">{completion}%</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Profile Status</p>
                        <p className="text-xs font-bold text-text-primary">
                            {completion < 40 ? '🔴 Incomplete' : completion < 75 ? '🟡 Average' : '✅ Placement Ready'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Lateral Nav */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="bg-card border border-border rounded-[2rem] p-4 shadow-sm flex flex-col gap-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all relative group ${activeTab === tab.id
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'text-text-secondary hover:bg-background'
                                    }`}
                            >
                                <tab.icon size={18} className={activeTab === tab.id ? 'text-white' : 'text-text-secondary group-hover:text-primary'} />
                                <span>{tab.label}</span>
                                {activeTab === tab.id && <ChevronRight size={14} className="ml-auto" />}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={saveProfile}
                        disabled={saving}
                        className="w-full py-4 bg-primary text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Rocket size={16} />}
                        Sync Profile
                    </button>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-9">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-sm min-h-[500px]"
                        >
                            {activeTab === 'basic' && (
                                <div className="space-y-10">
                                    <div className="flex items-center gap-6 pb-8 border-b border-border">
                                        <div className="relative group">
                                            <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary text-3xl font-black border-2 border-dashed border-primary/30">
                                                {(formData.basic.fullName || "U").charAt(0)}
                                            </div>
                                            <button className="absolute -bottom-2 -right-2 p-2 bg-card border border-border rounded-xl shadow-lg text-primary hover:bg-primary hover:text-white transition-all">
                                                <Camera size={14} />
                                            </button>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-text-primary">{formData.basic.fullName}</h3>
                                            <p className="text-text-secondary font-bold text-sm">{formData.basic.rollNo} • {formData.basic.department}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <SectionInput label="Full Name" name="fullName" value={formData.basic.fullName} onChange={handleBasicChange} icon={User} />
                                        <SectionInput label="Email Address" value={formData.basic.email} icon={Mail} disabled />
                                        <SectionInput label="Mobile Number" name="mobile" value={formData.basic.mobile} onChange={handleBasicChange} icon={Phone} />
                                        <SectionInput label="Roll Number" value={formData.basic.rollNo} icon={Key} disabled />
                                        <SectionInput label="College Name" value={formData.basic.collegeName} icon={GraduationCap} disabled />
                                        <SectionInput label="Department" value={formData.basic.department} icon={BookOpen} disabled />
                                        <SectionInput label="Year & Section" value={formData.basic.yearSection} icon={BarChart} disabled />
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest flex items-center gap-2 px-1">
                                                <BarChart size={12} className="text-primary" /> Current CGPA
                                            </label>
                                            <input
                                                type="number" step="0.01" max="10"
                                                className="input-primary"
                                                placeholder="0.00"
                                                value={formData.academic.cgpa}
                                                onChange={(e) => handleAcademicChange('cgpa', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest px-1">Areas of Interest</label>
                                        <div className="flex flex-wrap gap-3">
                                            {['Core Engineering', 'Software Dev', 'Data Science', 'Cloud & DevOps'].map(interest => (
                                                <button
                                                    key={interest}
                                                    onClick={() => {
                                                        const current = formData.academic.areasOfInterest;
                                                        const next = current.includes(interest) ? current.filter(i => i !== interest) : [...current, interest];
                                                        handleAcademicChange('areasOfInterest', next);
                                                    }}
                                                    className={`px-6 py-3 rounded-2xl text-xs font-bold border transition-all ${formData.academic.areasOfInterest.includes(interest)
                                                        ? 'bg-primary/10 border-primary text-primary'
                                                        : 'bg-background border-border text-text-secondary hover:border-primary/50'
                                                        }`}
                                                >
                                                    {interest}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'skills' && (
                                <div className="space-y-12">
                                    <SkillCategory
                                        label="Programming Languages"
                                        sub="Java, Python, C++, etc."
                                        icon={Code}
                                        items={formData.skills.languages}
                                        onAdd={(val) => setFormData(p => ({ ...p, skills: { ...p.skills, languages: [...p.skills.languages, val] } }))}
                                        onRemove={(idx) => setFormData(p => ({ ...p, skills: { ...p.skills, languages: p.skills.languages.filter((_, i) => i !== idx) } }))}
                                    />
                                    <SkillCategory
                                        label="Web Technologies"
                                        sub="React, HTML, CSS, Tailwind"
                                        icon={Globe}
                                        items={formData.skills.webTech}
                                        onAdd={(val) => setFormData(p => ({ ...p, skills: { ...p.skills, webTech: [...p.skills.webTech, val] } }))}
                                        onRemove={(idx) => setFormData(p => ({ ...p, skills: { ...p.skills, webTech: p.skills.webTech.filter((_, i) => i !== idx) } }))}
                                    />
                                    <SkillCategory
                                        label="Databases"
                                        sub="MySQL, MongoDB, PostgreSQL"
                                        icon={Database}
                                        items={formData.skills.databases}
                                        onAdd={(val) => setFormData(p => ({ ...p, skills: { ...p.skills, databases: [...p.skills.databases, val] } }))}
                                        onRemove={(idx) => setFormData(p => ({ ...p, skills: { ...p.skills, databases: p.skills.databases.filter((_, i) => i !== idx) } }))}
                                    />
                                    <SkillCategory
                                        label="Tools & Cloud"
                                        sub="Git, AWS, Docker, Linux"
                                        icon={Cloud}
                                        items={formData.skills.tools}
                                        onAdd={(val) => setFormData(p => ({ ...p, skills: { ...p.skills, tools: [...p.skills.tools, val] } }))}
                                        onRemove={(idx) => setFormData(p => ({ ...p, skills: { ...p.skills, tools: p.skills.tools.filter((_, i) => i !== idx) } }))}
                                    />
                                </div>
                            )}

                            {activeTab === 'experience' && (
                                <div className="space-y-12">
                                    <div className="flex justify-between items-center px-1">
                                        <h3 className="text-xl font-black text-text-primary">Projects & Internships</h3>
                                        <button className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest">
                                            <Plus size={16} /> Add New
                                        </button>
                                    </div>

                                    {formData.experience.projects.length === 0 && (
                                        <div className="p-12 border-2 border-dashed border-border rounded-[2rem] text-center space-y-4">
                                            <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto text-text-secondary">
                                                <HardHat size={30} />
                                            </div>
                                            <p className="text-text-secondary font-bold">No projects added yet.</p>
                                            <button className="px-8 py-3 bg-primary/10 text-primary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/20">
                                                Add Project
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'documents' && (
                                <div className="space-y-12">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest px-1">Resume (PDF)</label>
                                            <div className="p-8 bg-background border-2 border-dashed border-border rounded-3xl text-center group hover:border-primary/50 transition-colors cursor-pointer">
                                                <FileText size={40} className="mx-auto text-text-secondary mb-4 group-hover:text-primary transition-colors" />
                                                <p className="text-xs font-bold text-text-secondary">Upload your latest resume</p>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <SectionInput label="Portfolio Website" value={formData.portfolio.website} onChange={(e) => setFormData({ ...formData, portfolio: { ...formData.portfolio, website: e.target.value } })} icon={Globe} placeholder="https://yourportfolio.me" />
                                            <SectionInput label="GitHub Profile" value={formData.portfolio.github} onChange={(e) => setFormData({ ...formData, portfolio: { ...formData.portfolio, github: e.target.value } })} icon={Github} placeholder="github.com/username" />
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-border">
                                        <h4 className="text-sm font-black text-text-primary uppercase tracking-wider mb-6">Placement Preferences</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <SectionInput label="Preferred Job Role" value={formData.placement.preferredRole} onChange={(e) => setFormData({ ...formData, placement: { ...formData.placement, preferredRole: e.target.value } })} icon={Briefcase} placeholder="e.g. SDE, Data Analyst" />
                                            <SectionInput label="Preferred Location" value={formData.placement.preferredLocation} onChange={(e) => setFormData({ ...formData, placement: { ...formData.placement, preferredLocation: e.target.value } })} icon={MapPin} placeholder="e.g. Bangalore, Remote" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'awards' && (
                                <div className="space-y-8">
                                    <div className="bg-primary/5 border border-primary/10 p-8 rounded-[2rem] flex items-center gap-6">
                                        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/20">
                                            <Award size={32} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-text-primary">Showcase your Strengths</h4>
                                            <p className="text-sm text-text-secondary font-medium">Add certifications, hackathon wins, and awards to boost your profile readiness score.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <button className="w-full flex items-center justify-between p-6 bg-card border border-border rounded-2xl hover:border-primary/50 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center text-text-secondary group-hover:text-primary transition-colors">
                                                    <Award size={20} />
                                                </div>
                                                <span className="font-bold text-text-primary">Add Certification</span>
                                            </div>
                                            <Plus size={20} className="text-text-secondary" />
                                        </button>
                                        <button className="w-full flex items-center justify-between p-6 bg-card border border-border rounded-2xl hover:border-primary/50 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center text-text-secondary group-hover:text-primary transition-colors">
                                                    <Cpu size={20} />
                                                </div>
                                                <span className="font-bold text-text-primary">Add Hackathon / Competition</span>
                                            </div>
                                            <Plus size={20} className="text-text-secondary" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

// Helper Components
const SectionInput = ({ label, icon: Icon, value, onChange, disabled, name, placeholder }) => (
    <div className="space-y-3">
        <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest flex items-center gap-2 px-1">
            <Icon size={12} className="text-primary" /> {label}
        </label>
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={`w-full bg-background border border-border rounded-2xl px-5 py-3.5 text-text-primary font-bold outline-none focus:border-primary/50 transition-all text-sm shadow-inner ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-50/50' : 'hover:border-border/80'}`}
        />
    </div>
);

const SkillCategory = ({ label, sub, icon: Icon, items, onAdd, onRemove }) => {
    const [input, setInput] = useState('');
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                    <Icon size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-black text-text-primary uppercase tracking-wider">{label}</h4>
                    <p className="text-[10px] font-bold text-text-secondary">{sub}</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {items.map((item, i) => (
                    <span key={i} className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-xl text-xs font-bold text-text-primary animate-in zoom-in-95 duration-200">
                        {item}
                        <button onClick={() => onRemove(i)} className="text-text-secondary hover:text-red-500"><X size={12} /></button>
                    </span>
                ))}
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (onAdd(input), setInput(''))}
                        placeholder="Add skill..."
                        className="bg-transparent border-b border-border outline-none text-xs font-bold py-1 px-2 focus:border-primary"
                    />
                    <button onClick={() => { if (input) { onAdd(input); setInput(''); } }} className="text-primary hover:scale-110 transition-transform"><Plus size={16} /></button>
                </div>
            </div>
        </div>
    );
};

export default DashboardProfile;
