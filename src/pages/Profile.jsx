import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Globe, Github, Linkedin, Save, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserService } from '../services/user';

const Profile = () => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        phone: '',
        location: '',
        bio: '',
        linkedin: '',
        github: '',
        skills: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (currentUser) {
                try {
                    const profile = await UserService.getUserProfile(currentUser.uid);
                    if (profile) {
                        setFormData({
                            displayName: profile.displayName || currentUser.displayName || '',
                            email: currentUser.email || '',
                            phone: profile.phone || '',
                            location: profile.location || '',
                            bio: profile.bio || '',
                            linkedin: profile.linkedin || '',
                            github: profile.github || '',
                            skills: profile.skills || ''
                        });
                    } else {
                        // Init with auth data
                        setFormData(prev => ({
                            ...prev,
                            displayName: currentUser.displayName || '',
                            email: currentUser.email || ''
                        }));
                    }
                } catch (error) {
                    console.error("Error fetching profile:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchProfile();
    }, [currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await UserService.updateUserProfile(currentUser.uid, formData);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="min-h-screen pt-32 text-center text-slate-500">Loading profile...</div>;
    if (!currentUser) return <div className="min-h-screen pt-32 text-center text-slate-500">Please log in to view your profile.</div>;

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 bg-slate-50">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Your Profile</h1>
                    <p className="text-slate-500">Manage your personal information and public profile.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Sidebar / Avatar Card */}
                    <div className="md:col-span-1">
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm sticky top-24">
                            <div className="w-24 h-24 mx-auto bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
                                {formData.displayName.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 mb-1">{formData.displayName || 'User'}</h2>
                            <p className="text-slate-500 text-sm mb-4">{currentUser.email}</p>

                            <div className="w-full h-px bg-slate-100 my-4" />

                            {/* Stats or simple info could go here */}
                            <div className="text-left space-y-3">
                                <div className="flex items-center gap-3 text-slate-500 text-sm">
                                    <MapPin size={16} />
                                    <span>{formData.location || 'Location not set'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500 text-sm">
                                    <Globe size={16} />
                                    <a href={formData.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">LinkedIn Profile</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Form */}
                    <div className="md:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm"
                        >
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="text"
                                                name="displayName"
                                                value={formData.displayName}
                                                onChange={handleChange}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-900 focus:outline-none focus:border-primary transition-colors placeholder:text-slate-400"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                disabled
                                                className="w-full bg-slate-100 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-400 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-900 focus:outline-none focus:border-primary transition-colors placeholder:text-slate-400"
                                                placeholder="+1 234 567 890"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="text"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleChange}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-900 focus:outline-none focus:border-primary transition-colors placeholder:text-slate-400"
                                                placeholder="New York, USA"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Bio</label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:border-primary transition-colors resize-none placeholder:text-slate-400"
                                        placeholder="Tell us a bit about yourself..."
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">LinkedIn URL</label>
                                        <div className="relative">
                                            <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="url"
                                                name="linkedin"
                                                value={formData.linkedin}
                                                onChange={handleChange}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-900 focus:outline-none focus:border-primary transition-colors placeholder:text-slate-400"
                                                placeholder="https://linkedin.com/in/username"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">GitHub URL</label>
                                        <div className="relative">
                                            <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="url"
                                                name="github"
                                                value={formData.github}
                                                onChange={handleChange}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-900 focus:outline-none focus:border-primary transition-colors placeholder:text-slate-400"
                                                placeholder="https://github.com/username"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full md:w-auto px-8 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {saving ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
