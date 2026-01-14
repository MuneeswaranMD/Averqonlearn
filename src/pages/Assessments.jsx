import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Award, Clock, CheckCircle, AlertCircle } from 'lucide-react';

import { AssessmentService } from '../services/assessment';

const Assessments = () => {
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchAssessments = async () => {
            try {
                const data = await AssessmentService.getAllAssessments();
                if (data.length === 0) {
                    setAssessments([
                        {
                            id: 1,
                            title: 'React Fundamentals Quiz',
                            course: 'Full Stack Web Development',
                            questions: 20,
                            duration: '30 mins',
                            status: 'Pending',
                            difficulty: 'Easy'
                        },
                        {
                            id: 2,
                            title: 'Javascript Core Concepts',
                            course: 'Frontend Mastery',
                            questions: 15,
                            duration: '25 mins',
                            status: 'Completed',
                            score: '85%',
                            difficulty: 'Medium'
                        },
                        {
                            id: 3,
                            title: 'Node.js Backend Basics',
                            course: 'Full Stack Web Development',
                            questions: 10,
                            duration: '15 mins',
                            status: 'Locked',
                            difficulty: 'Hard'
                        }
                    ]);
                } else {
                    setAssessments(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAssessments();
    }, []);

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <span className="inline-block py-1 px-3 rounded-full bg-purple-50 border border-purple-100 text-purple-600 font-semibold text-sm mb-4">
                        🧪 Skill Check
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Assessments</h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                        Test your knowledge and earn certificates.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {assessments.map((item) => (
                        <motion.div
                            key={item.id}
                            whileHover={{ y: -5 }}
                            className="bg-white border border-slate-200 rounded-2xl p-8 relative overflow-hidden group shadow-sm"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl ${item.status === 'Completed' ? 'bg-emerald-500' :
                                    item.status === 'Locked' ? 'bg-slate-300' : 'bg-primary'
                                    }`}>
                                    {item.status === 'Completed' ? <CheckCircle /> : <Award />}
                                </div>
                                <span className={`px-2 py-1 rounded-md text-xs font-bold ${item.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600' :
                                    item.difficulty === 'Medium' ? 'bg-yellow-50 text-yellow-600' :
                                        'bg-red-50 text-red-600'
                                    }`}>
                                    {item.difficulty}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                            <p className="text-slate-500 text-sm mb-6">{item.course}</p>

                            <div className="flex items-center gap-4 text-sm text-slate-400 mb-8 border-t border-slate-100 pt-4">
                                <div className="flex items-center gap-1.5">
                                    <Clock size={16} /> {item.duration}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <AlertCircle size={16} /> {item.questions} Qs
                                </div>
                            </div>

                            {item.status === 'Completed' ? (
                                <button className="w-full py-3 bg-emerald-50 text-emerald-600 font-bold rounded-xl border border-emerald-100 cursor-default">
                                    Score: {item.score}
                                </button>
                            ) : item.status === 'Locked' ? (
                                <button className="w-full py-3 bg-slate-50 text-slate-400 font-bold rounded-xl border border-slate-200 cursor-not-allowed">
                                    Locked
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate(`/test/${item.id}`)}
                                    className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all"
                                >
                                    Start Quiz
                                </button>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Assessments;
