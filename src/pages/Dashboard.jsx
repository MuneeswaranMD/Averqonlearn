import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Award, BarChart2, Clock, PlayCircle } from 'lucide-react';
import webDevImg from '../assets/images/web_dev.png';

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { currentUser, userData, loading, studentData, isStudent } = useAuth();
    const navigate = useNavigate();

    // Protect route
    React.useEffect(() => {
        if (!loading && !currentUser) {
            navigate('/login');
        }
    }, [currentUser, loading, navigate]);

    if (loading) return <div className="min-h-screen pt-32 text-center text-slate-900">Loading...</div>;
    if (!currentUser) return null;

    // Use Student Data if logged in as student
    const user = isStudent ? {
        name: studentData?.name || 'Student',
        rollNo: studentData?.rollNo,
        department: studentData?.department,
        year: studentData?.year,
        progress: studentData?.progress || 0,
        completedCourses: studentData?.completedCourses?.length || 0,
        certificates: studentData?.certificates || 0,
        learningStreak: 1
    } : {
        name: userData?.displayName || currentUser?.displayName || 'User',
        progress: 68,
        completedCourses: 1,
        certificates: 1,
        learningStreak: 5
    };

    const enrolledCourses = isStudent ? (studentData?.enrolledCourses || []) : (userData?.enrolledCourses || [
        {
            id: 1,
            title: 'Full Stack Web Development Bootcamp',
            progress: 45,
            nextLesson: 'React State Management',
            image: webDevImg
        }
    ]);

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                        Welcome back, {user.name} 👋
                    </h1>
                    {isStudent ? (
                        <p className="text-primary font-medium flex gap-4">
                            <span>{user.rollNo}</span>
                            <span className="text-slate-200">|</span>
                            <span>{user.department}</span>
                            <span className="text-slate-200">|</span>
                            <span>{user.year}</span>
                        </p>
                    ) : (
                        <p className="text-slate-500">Ready to continue your learning journey?</p>
                    )}
                </div>

                {/* Student Quick Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {[
                        { label: 'Courses', icon: BookOpen, path: '/courses', color: 'bg-blue-50 text-blue-600 border-blue-100' },
                        { label: 'Live Classes', icon: PlayCircle, path: '/live', color: 'bg-red-50 text-red-600 border-red-100' },
                        { label: 'Placement Hub', icon: BarChart2, path: '/placement', color: 'bg-green-50 text-green-600 border-green-100' },
                        { label: 'Assessments', icon: Award, path: '/assessments', color: 'bg-purple-50 text-purple-600 border-purple-100' },
                    ].map((link, i) => (
                        <button
                            key={i}
                            onClick={() => navigate(link.path)}
                            className={`flex flex-col items-center justify-center p-6 border rounded-2xl transition-all hover:shadow-md active:scale-95 ${link.color}`}
                        >
                            <link.icon size={32} className="mb-3" />
                            <span className="font-bold text-sm tracking-wide">{link.label}</span>
                        </button>
                    ))}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900">{enrolledCourses.length}</div>
                            <div className="text-sm text-slate-500">Courses in Progress</div>
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                            <Award size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900">{user.certificates}</div>
                            <div className="text-sm text-slate-500">Certificates Earned</div>
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                            <Clock size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900">{user.learningStreak}</div>
                            <div className="text-sm text-slate-500">Day Streak</div>
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                            <BarChart2 size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900">{user.progress}%</div>
                            <div className="text-sm text-slate-500">Avg. Completion</div>
                        </div>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-6">Continue Learning</h2>

                <div className="space-y-6">
                    {enrolledCourses.map(course => (
                        <div key={course.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all group">
                            <div className="flex flex-col md:flex-row gap-6 items-center">
                                <div className="w-full md:w-64 h-36 rounded-xl overflow-hidden shrink-0 relative">
                                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <PlayCircle size={48} className="text-white" />
                                    </div>
                                </div>

                                <div className="flex-1 w-full">
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{course.title}</h3>
                                    <p className="text-slate-500 text-sm mb-4">Next Up: <span className="text-slate-900 font-medium">{course.nextLesson}</span></p>

                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary rounded-full"
                                                style={{ width: `${course.progress}%` }}
                                            />
                                        </div>
                                        <div className="text-sm font-bold text-white w-10 text-right">{course.progress}%</div>
                                    </div>
                                </div>

                                <button className="w-full md:w-auto px-8 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/25 whitespace-nowrap">
                                    Resume
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
