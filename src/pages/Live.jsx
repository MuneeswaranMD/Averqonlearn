import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Video, Clock, Users } from 'lucide-react';

import { LiveService } from '../services/live';

const Live = () => {
    const [todayClasses, setTodayClasses] = useState([]);
    const [upcomingClasses, setUpcomingClasses] = useState([]);

    React.useEffect(() => {
        const fetchClasses = async () => {
            try {
                // In a real app we'd split this query or filter on client
                const allLive = await LiveService.getUpcomingClasses();

                // Simple mock logic for "Today" vs "Upcoming" based on DB data
                // For demo, if empty we can use mocks or show empty state
                if (allLive.length === 0) {
                    // Keep existing mocks if DB is empty for demo
                    setTodayClasses([
                        {
                            id: 1,
                            title: 'React Hooks Deep Dive',
                            instructor: 'Muneeswaran',
                            time: '10:00 AM - 12:00 PM',
                            platform: 'Zoom',
                            status: 'Live Now',
                            attendees: 42
                        },
                        {
                            id: 2,
                            title: 'System Design Interview Prep',
                            instructor: 'Alex Chen',
                            time: '2:00 PM - 4:00 PM',
                            platform: 'YouTube Live',
                            status: 'Upcoming',
                            attendees: 120
                        }
                    ]);
                    setUpcomingClasses([
                        {
                            id: 3,
                            date: 'Tomorrow, Oct 15',
                            title: 'Mastering CSS Grid',
                            instructor: 'Sarah Smith',
                            time: '11:00 AM'
                        },
                        {
                            id: 4,
                            date: 'Wed, Oct 16',
                            title: 'Intro to AWS Lambda',
                            instructor: 'Cloud Expert',
                            time: '5:00 PM'
                        }
                    ]);
                } else {
                    setTodayClasses(allLive.filter(c => c.status === 'Live Now' || isToday(c.startTime)));
                    setUpcomingClasses(allLive.filter(c => c.status !== 'Live Now' && !isToday(c.startTime)));
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchClasses();
    }, []);

    const isToday = (dateString) => {
        if (!dateString) return false;
        const date = new Date(dateString);
        const today = new Date();
        return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    }

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 bg-slate-50 text-slate-900">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <span className="inline-block py-1 px-3 rounded-full bg-red-50 border border-red-100 text-red-600 font-semibold text-sm mb-4 animate-pulse">
                        🔴 Live Learning
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Live Classes</h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                        Interactive sessions with industry experts. Ask doubts and code live.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Schedule */}
                    <div className="lg:col-span-2 space-y-8">
                        <h2 className="text-2xl font-bold mb-6">Today's Schedule</h2>
                        {todayClasses.map((item) => (
                            <motion.div
                                key={item.id}
                                whileHover={{ scale: 1.01 }}
                                className={`rounded-2xl border p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-sm ${item.status === 'Live Now'
                                    ? 'bg-white border-red-200'
                                    : 'bg-white border-slate-200'
                                    }`}
                            >
                                {item.status === 'Live Now' && (
                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500" />
                                )}

                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        {item.status === 'Live Now' ? (
                                            <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">LIVE</span>
                                        ) : (
                                            <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full">UPCOMING</span>
                                        )}
                                        <span className="text-sm text-slate-400 flex items-center gap-1">
                                            <Clock size={14} /> {item.time}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{item.title}</h3>
                                    <p className="text-slate-500 mb-4">Instructor: <span className="text-slate-900 font-medium">{item.instructor}</span></p>

                                    <div className="flex items-center gap-4 text-sm text-slate-400">
                                        <div className="flex items-center gap-1.5">
                                            <Video size={16} /> {item.platform}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Users size={16} /> {item.attendees} attending
                                        </div>
                                    </div>
                                </div>

                                <button className={`px-8 py-3 rounded-xl font-bold whitespace-nowrap transition-all shadow-md ${item.status === 'Live Now'
                                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-200'
                                    : 'bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700'
                                    }`}>
                                    {item.status === 'Live Now' ? 'Join Class' : 'Notify Me'}
                                </button>
                            </motion.div>
                        ))}
                    </div>

                    {/* Upcoming Sidebar */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 h-fit shadow-sm">
                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Calendar className="text-primary" /> Upcoming
                        </h3>
                        <div className="space-y-6">
                            {upcomingClasses.map((item) => (
                                <div key={item.id} className="pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                                    <div className="text-sm text-primary font-semibold mb-1">{item.date}</div>
                                    <h4 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h4>
                                    <p className="text-sm text-slate-500 mb-1">{item.instructor}</p>
                                    <div className="text-xs text-slate-400 bg-slate-50 inline-block px-2 py-1 rounded">
                                        {item.time}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-8 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl border border-slate-200 transition-colors">
                            View Calendar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Live;
