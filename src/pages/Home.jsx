import React from 'react';
import { Play, ArrowRight, CheckCircle, Video, Code, Shield, Cpu, Cloud } from 'lucide-react';
import { motion } from 'framer-motion';
import CourseCard from '../components/course/CourseCard';
import webDevImg from '../assets/images/web_dev.png';

import { CourseService } from '../services/course';
import { LiveService } from '../services/live';

const Home = () => {
    const [courses, setCourses] = React.useState([]);
    const [liveClass, setLiveClass] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchContent = async () => {
            try {
                // In a real scenario, you'd fetch "Featured" specifically or sort by popularity
                // Since DB might be empty, we'll gracefully handle it or show fallback in UI if needed
                const [coursesData, liveClasses] = await Promise.all([
                    CourseService.getAllCourses(),
                    LiveService.getTodayClasses()
                ]);

                setCourses(coursesData.slice(0, 3));
                if (liveClasses.length > 0) {
                    setLiveClass(liveClasses[0]);
                }
            } catch (err) {
                console.error("Home Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchContent();
    }, []);

    const features = [
        "Industry projects",
        "Live mentoring",
        "Placement support",
        "Certificates"
    ];

    const categories = [
        { name: 'Web Development', icon: Code, color: 'text-blue-500' },
        { name: 'AWS & Cloud', icon: Cloud, color: 'text-orange-500' },
        { name: 'AI & ML', icon: Cpu, color: 'text-purple-500' },
        { name: 'Cyber Security', icon: Shield, color: 'text-green-500' },
    ];

    // Fallback data for visual testing if DB is empty
    const fallbackCourses = [
        {
            id: 1,
            title: 'Full Stack Web Development Bootcamp',
            instructor: 'John Doe',
            rating: 4.8,
            students: '2.5k',
            duration: '12 Weeks',
            level: 'Beginner to Advanced',
            image: webDevImg,
            price: 99
        },
        {
            id: 2,
            title: 'AWS Certified Solutions Architect',
            instructor: 'Sarah Smith',
            rating: 4.9,
            students: '1.8k',
            duration: '8 Weeks',
            level: 'Intermediate',
            image: webDevImg,
            price: 129
        },
        {
            id: 3,
            title: 'Mastering Artificial Intelligence',
            instructor: 'Dr. Alan Grant',
            rating: 4.7,
            students: '3.2k',
            duration: '16 Weeks',
            level: 'Advanced',
            image: webDevImg,
            price: 149
        }
    ];

    const displayCourses = courses.length > 0 ? courses : fallbackCourses;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold text-sm mb-6">
                            🚀 Launch your tech career today
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight mb-8 leading-tight">
                            Learn from <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Industry Experts</span>.<br />
                            Get Hired <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">Faster</span>.
                        </h1>
                        <p className="max-w-2xl mx-auto text-xl text-text-secondary mb-10 leading-relaxed">
                            Master the skills that top companies are looking for. Join our immersive learning platform with live classes, projects, and guaranteed placement support.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                                Browse Courses
                                <ArrowRight size={20} />
                            </button>
                            <button className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-sm">
                                <Play size={20} className="fill-slate-700" />
                                Join Live Class
                            </button>
                        </div>

                        <div className="mt-16 flex flex-wrap justify-center gap-8 text-slate-500">
                            {features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-100 shadow-sm">
                                    <CheckCircle size={18} className="text-emerald-500" />
                                    <span className="font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Live Now Section */}
            <section className="py-20 bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                            <h2 className="text-3xl font-bold text-slate-900">Live Now</h2>
                        </div>
                        <button className="text-primary font-semibold hover:text-primary/80 transition-colors">View All</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {liveClass ? (
                            <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                <div className="aspect-video w-full bg-slate-900 relative flex items-center justify-center">
                                    {liveClass.youtubeVideoId ? (
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={`https://www.youtube.com/embed/${liveClass.youtubeVideoId}`}
                                            title="Live Class"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    ) : (
                                        <p className="text-slate-500">Live Video Placeholder</p>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{liveClass.title}</h3>
                                    <p className="text-slate-500">Join instructor <strong>{liveClass.instructor || 'Instructor'}</strong> live.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="col-span-3 text-center text-text-secondary py-8">
                                No live classes right now. Check back later!
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Featured Courses */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">Featured Courses</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">Explore our top-rated courses designed to get you job-ready.</p>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {categories.map((cat) => (
                            <button key={cat.name} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 hover:border-primary/50 hover:bg-slate-50 transition-all group shadow-sm">
                                <cat.icon size={20} className={cat.color} />
                                <span className="text-slate-700 font-medium group-hover:text-primary transition-colors">{cat.name}</span>
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {displayCourses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <button className="px-8 py-3 rounded-full border border-slate-200 text-slate-700 font-semibold hover:bg-white hover:shadow-sm transition-all">
                            View All Courses
                        </button>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-slate-900 mb-6">Why Choose Averqon Learn?</h2>
                            <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                                We don't just teach technology; we transform careers. Our curriculum is crafted by industry experts and updated in real-time.
                            </p>

                            <div className="space-y-6">
                                {[
                                    { title: 'Project-Based Learning', desc: 'Build 10+ real-world usage projects.' },
                                    { title: '24/7 Doubt Support', desc: 'Get unstuck instantly with our mentors.' },
                                    { title: 'Career Guidance', desc: 'Mock interviews, resume review, and referrals.' }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                                            <CheckCircle size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-slate-900 mb-1">{item.title}</h4>
                                            <p className="text-slate-500">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full" />
                            <div className="relative bg-white border border-slate-200 rounded-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500 shadow-xl">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-full bg-slate-100 animate-pulse" />
                                    <div>
                                        <div className="h-4 w-32 bg-slate-100 rounded mb-2 animate-pulse" />
                                        <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-4 w-full bg-slate-50 rounded animate-pulse" />
                                    <div className="h-4 w-5/6 bg-slate-50 rounded animate-pulse" />
                                    <div className="h-4 w-4/6 bg-slate-50 rounded animate-pulse" />
                                </div>
                                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
                                    <div className="h-10 w-32 bg-primary/10 rounded animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
