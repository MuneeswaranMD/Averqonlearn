import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Globe, Camera, Shield, Bell, Lock, Key, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DashboardProfile = () => {
    const { currentUser, userData, studentData, isStudent } = useAuth();

    const [formData, setFormData] = useState({
        name: isStudent ? studentData?.name : (userData?.displayName || currentUser?.displayName || ''),
        email: currentUser?.email || '',
        phone: '+91 9876543210',
        location: 'Tamil Nadu, India',
        department: isStudent ? studentData?.department : 'Learning Department',
        rollNo: isStudent ? studentData?.rollNo : 'ADMIN-001',
    });

    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-10">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
                <p className="text-slate-500 mt-1">Manage your personal information, security, and notification preferences.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Profile Sidebar */}
                <div className="w-full lg:w-80 shrink-0 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm relative overflow-hidden">
                        <div className="relative inline-block mb-6">
                            <div className="w-28 h-28 rounded-3xl bg-primary flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-primary/20">
                                {formData.name.substring(0, 1)}
                            </div>
                            <button className="absolute -bottom-2 -right-2 p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 shadow-lg hover:text-primary transition-colors">
                                <Camera size={16} />
                            </button>
                        </div>
                        <h2 className="text-xl font-black text-slate-900 mb-1">{formData.name}</h2>
                        <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">{isStudent ? 'Student' : 'Administrator'}</p>
                        <div className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] items-center font-black text-slate-400 uppercase tracking-widest border border-slate-100">
                            {formData.rollNo}
                        </div>
                    </div>

                    <nav className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm flex flex-col gap-1">
                        {[
                            { id: 'personal', label: 'Personal Info', icon: User, active: true },
                            { id: 'security', label: 'Security & Password', icon: Shield, active: false },
                            { id: 'notifications', label: 'Notifications', icon: Bell, active: false },
                            { id: 'sessions', label: 'Device Sessions', icon: Key, active: false },
                        ].map(item => (
                            <button key={item.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${item.active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-slate-50'}`}>
                                <item.icon size={18} /> {item.label}
                            </button>
                        ))}
                    </nav>

                    <div className="bg-red-50 border border-red-100 rounded-3xl p-6 text-center">
                        <p className="text-xs font-bold text-red-600 mb-4">DANGER ZONE</p>
                        <button className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-red-200 text-red-600 rounded-xl text-xs font-black hover:bg-red-600 hover:text-white transition-all uppercase tracking-widest">
                            <Trash2 size={16} /> Delete Account
                        </button>
                    </div>
                </div>

                {/* Form Area */}
                <div className="flex-1 bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm">
                    <div className="mb-10 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-slate-900">Personal Details</h3>
                        <button className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all text-sm">
                            Save Changes
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <User size={12} /> Full Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-slate-900 font-bold outline-none focus:border-primary transition-all text-sm shadow-inner"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] items-center font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Mail size={12} /> Email Address
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                disabled
                                className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-5 py-3 text-slate-400 font-bold outline-none cursor-not-allowed text-sm"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] items-center font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Phone size={12} /> Mobile Number
                            </label>
                            <input
                                type="text"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-slate-900 font-bold outline-none focus:border-primary transition-all text-sm shadow-inner"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] items-center font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <MapPin size={12} /> Location
                            </label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-slate-900 font-bold outline-none focus:border-primary transition-all text-sm shadow-inner"
                            />
                        </div>
                    </div>

                    <div className="mt-12 pt-10 border-t border-slate-50 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] items-center font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Globe size={12} /> Department
                            </label>
                            <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-slate-600 font-black text-xs uppercase tracking-wider">
                                {formData.department}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] items-center font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Lock size={12} /> Social Profile
                            </label>
                            <div className="flex bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden focus-within:border-primary transition-all shadow-inner">
                                <span className="bg-slate-100 px-4 py-3 text-slate-400 text-xs font-bold border-r border-slate-200">linkedin.com/in/</span>
                                <input
                                    type="text"
                                    placeholder="username"
                                    className="flex-1 bg-transparent px-2 py-3 text-slate-900 font-bold outline-none text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardProfile;
