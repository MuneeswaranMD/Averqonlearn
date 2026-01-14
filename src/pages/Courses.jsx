import React, { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import CourseCard from '../components/course/CourseCard';
import { CourseService } from '../services/course';
import webDevImg from '../assets/images/web_dev.png'; // Fallback

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await CourseService.getAllCourses();
                // Fallback data if DB is empty
                if (data.length === 0) {
                    setCourses([
                        { id: 1, title: 'Full Stack Web Development', instructor: 'Muneeswaran', rating: 4.8, students: '1.2k', duration: '12 Weeks', level: 'Beginner', image: webDevImg, price: 99, category: 'Web Dev' },
                        { id: 2, title: 'Advanced React Patterns', instructor: 'Muneeswaran', rating: 4.9, students: '800', duration: '4 Weeks', level: 'Advanced', image: webDevImg, price: 49, category: 'Web Dev' },
                        { id: 3, title: 'AWS Cloud Practitioner', instructor: 'Cloud Expert', rating: 4.7, students: '2k', duration: '8 Weeks', level: 'Beginner', image: webDevImg, price: 149, category: 'Cloud' },
                    ]);
                } else {
                    setCourses(data);
                }
            } catch (error) {
                console.error("Failed to fetch courses", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const categories = ['All', 'Web Dev', 'Cloud', 'AI/ML', 'Cyber Security'];

    const filteredCourses = filter === 'All' ? courses : courses.filter(c => c.category === filter);

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Explore Courses</h1>
                        <p className="text-slate-500">Master industry-relevant skills with our premium courses.</p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary transition-colors shadow-sm"
                            />
                        </div>
                        <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-6 mb-4 no-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${filter === cat
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'bg-white border border-slate-200 text-slate-500 hover:text-primary hover:bg-slate-50 shadow-sm'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="text-center text-slate-500 py-20">Loading courses...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCourses.map(course => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Courses;
