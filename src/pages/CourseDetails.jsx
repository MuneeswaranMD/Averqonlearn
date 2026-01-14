import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Users, Clock, Share2, Heart, Award, CheckCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import webDevImg from '../assets/images/web_dev.png';

import { CourseService } from '../services/course';

const CourseDetails = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('overview');
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchCourse = async () => {
            try {
                // In real app, we would fetch modules separately or with the course
                const data = await CourseService.getCourseById(id);
                // Fallback / Mock data if not found in DB for demo purposes
                if (data) {
                    setCourse({ ...data, image: data.image || webDevImg });
                } else {
                    setCourse({
                        id,
                        title: 'Full Stack Web Development Bootcamp',
                        instructor: 'Muneeswaran',
                        description: 'Become a full-stack web developer with just one course. HTML, CSS, Javascript, Node, React, MongoDB and more!',
                        rating: 4.8,
                        students: '12,500',
                        lastUpdated: 'Jan 2026',
                        language: 'English',
                        price: 99,
                        image: webDevImg,
                        modules: [
                            { title: 'Introduction to Web Development', duration: '1h 20m', lessons: 5 },
                            { title: 'HTML5 & CSS3 Masterclass', duration: '5h 30m', lessons: 12 },
                            { title: 'Javascript Basics to Advanced', duration: '10h 15m', lessons: 24 },
                            { title: 'React JS - The Complete Guide', duration: '15h 00m', lessons: 30 },
                        ]
                    });
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    if (loading) return <div className="text-slate-500 text-center pt-32">Loading...</div>;
    if (!course) return <div className="text-slate-500 text-center pt-32">Course not found</div>;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Header */}
            <div className="bg-white border-b border-slate-200 pt-32 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-primary font-semibold text-sm mb-4">
                            <span>Development</span>
                            <span>•</span>
                            <span>Web Development</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                            {course.title}
                        </h1>
                        <p className="text-xl text-slate-500 mb-8 leading-relaxed">
                            {course.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 mb-8">
                            <span className="bg-yellow-50 text-yellow-600 px-2 py-1 rounded border border-yellow-200 font-bold text-xs uppercase">Bestseller</span>
                            <div className="flex items-center gap-1">
                                <span className="text-yellow-600 font-bold">{course.rating}</span>
                                <div className="flex text-yellow-500 text-xs">★★★★★</div>
                            </div>
                            <span>{course.students} students enrolled</span>
                            <span>Last updated {course.lastUpdated}</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden">
                                    <div className="w-full h-full bg-primary flex items-center justify-center text-white font-bold">M</div>
                                </div>
                                <div>
                                    <p className="text-slate-700 text-sm font-medium">Created by <span className="text-primary cursor-pointer hover:underline">{course.instructor}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Purchase Card */}
                    <div className="hidden lg:block w-[360px] relative">
                        <div className="absolute top-0 right-0 w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl p-1 z-10">
                            <div className="relative aspect-video rounded-xl overflow-hidden mb-4 group cursor-pointer">
                                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                                    <PlayCircle size={64} className="text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="text-3xl font-bold text-slate-900 mb-4">${course.price}</div>
                                <button className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl mb-3 shadow-lg shadow-primary/20 transition-all">
                                    Add to Cart
                                </button>
                                <button className="w-full py-3 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-900 font-bold rounded-xl transition-all">
                                    Buy Now
                                </button>
                                <p className="text-center text-xs text-slate-500 mt-4">30-Day Money-Back Guarantee</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Course Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        {/* Navigation */}
                        <div className="flex border-b border-slate-200 mb-8 overflow-x-auto no-scrollbar">
                            {['Overview', 'Curriculum', 'Instructor', 'Reviews'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab.toLowerCase())}
                                    className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.toLowerCase()
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-slate-500 hover:text-slate-900'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-8">
                            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                                <h3 className="text-2xl font-bold text-slate-900 mb-6">What you'll learn</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        'Build powerful web applications',
                                        'Master React and Node.js',
                                        'Deploy to production using AWS',
                                        'Design responsive layouts'
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <CheckCircle size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                                            <span className="text-slate-600">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-6">Course Content</h3>
                                <div className="space-y-4">
                                    {course.modules.map((mod, i) => (
                                        <div key={i} className="group bg-white border border-slate-200 hover:border-primary/20 rounded-xl overflow-hidden transition-all shadow-sm">
                                            <div className="p-4 flex items-center justify-between cursor-pointer bg-slate-50/50">
                                                <div className="flex items-center gap-3">
                                                    <div className="text-slate-400 font-mono text-sm">Module {i + 1}</div>
                                                    <h4 className="text-slate-900 font-semibold">{mod.title}</h4>
                                                </div>
                                                <div className="text-sm text-slate-500">{mod.lessons} lessons • {mod.duration}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;
