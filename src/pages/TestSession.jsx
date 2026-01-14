import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertTriangle, CheckCircle, ArrowRight, Shield } from 'lucide-react';

const TestSession = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Test State
    const [started, setStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(1800); // 30 mins
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [violationCount, setViolationCount] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    // Mock Questions (In real app, fetch from AssessmentService)
    const questions = [
        {
            id: 1,
            text: "What is the correct way to handle side effects in React?",
            options: ["useSideEffect()", "useEffect()", "useAction()", "useService()"],
            answer: 1
        },
        {
            id: 2,
            text: "Which hook is used for state management in functional components?",
            options: ["useState()", "useReducer()", "useContext()", "All of the above"],
            answer: 3
        },
        {
            id: 3,
            text: "What is the purpose of the 'key' prop in React lists?",
            options: ["To uniquely identify elements", "To style items", "To speed up rendering", "Both A and C"],
            answer: 3
        }
    ];

    // RESTRICTION LOGIC
    useEffect(() => {
        if (!started || submitted) return;

        // 1. Prevent Tab Switching / Visibility Change
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setViolationCount(prev => prev + 1);
                alert("🚨 WARNING: You left the test tab. This violation is being recorded! (Violation #" + (violationCount + 1) + ")");
            }
        };

        // 2. Prevent Right Click
        const handleContextMenu = (e) => e.preventDefault();

        // 3. Prevent Copy/Paste
        const handleKeydown = (e) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v')) {
                e.preventDefault();
                alert("Right-click and clipboard actions are disabled during the test.");
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeydown);

        // 4. Timer
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeydown);
            clearInterval(timer);
        };
    }, [started, submitted, violationCount]);

    const handleStart = () => {
        // Request Fullscreen
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(() => { });
        }
        setStarted(true);
    };

    const handleSubmit = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => { });
        }
        setSubmitted(true);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white border border-slate-200 p-10 rounded-3xl max-w-md text-center shadow-xl"
                >
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Test Submitted!</h2>
                    <p className="text-slate-500 mb-8">Your results will be reviewed by the faculty shortly.</p>
                    <div className="bg-slate-50 rounded-xl p-4 mb-8 text-sm text-slate-500 border border-slate-100">
                        Violations Recorded: <span className={violationCount > 0 ? 'text-red-500 font-bold' : 'text-emerald-500 font-bold'}>{violationCount}</span>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
                    >
                        Back to Dashboard
                    </button>
                </motion.div>
            </div>
        );
    }

    if (!started) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
                <div className="max-w-xl w-full">
                    <div className="bg-white border border-slate-200 p-8 md:p-12 rounded-3xl shadow-xl">
                        <div className="flex items-center gap-4 mb-8 text-primary">
                            <Shield size={32} />
                            <h1 className="text-3xl font-bold text-slate-900">Instruction & Policy</h1>
                        </div>

                        <div className="space-y-6 mb-10">
                            <div className="flex gap-4">
                                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs mt-1">1</div>
                                <p className="text-slate-600">The test will open in <b>Full Screen Mode</b>. Do not attempt to exit.</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs mt-1">2</div>
                                <p className="text-slate-600">Switching tabs or minimizing the browser will be recorded as a <b>Violation</b>.</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs mt-1">3</div>
                                <p className="text-slate-600">Copying, pasting, or right-clicking is strictly prohibited during the session.</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs mt-1">4</div>
                                <p className="text-slate-600">The session will auto-submit once the timer reaches zero.</p>
                            </div>
                        </div>

                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-10 flex gap-4 text-amber-700 text-sm">
                            <AlertTriangle className="shrink-0" size={20} />
                            <p>Make sure you have a stable internet connection before starting.</p>
                        </div>

                        <button
                            onClick={handleStart}
                            className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                        >
                            Start Assessment <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            {/* Exam Header */}
            <header className="fixed top-0 w-full bg-white border-b border-slate-200 p-4 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <div className="text-xl font-bold text-primary">Averqon Assessment</div>
                        <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
                        <div className="hidden md:block text-slate-500 text-sm">Question {currentQuestion + 1} of {questions.length}</div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xl ${timeLeft < 300 ? 'bg-red-50 text-red-600 animate-pulse border border-red-100' : 'bg-primary/5 text-primary border border-primary/10'}`}>
                            <Clock size={20} /> {formatTime(timeLeft)}
                        </div>
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all shadow-md shadow-red-200"
                        >
                            Finish
                        </button>
                    </div>
                </div>
            </header>

            <main className="pt-32 pb-20 px-4">
                <div className="max-w-3xl mx-auto">
                    {/* Violation Alert */}
                    {violationCount > 0 && (
                        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 animate-bounce shadow-sm">
                            <AlertTriangle size={20} />
                            <span className="font-bold">Violations Recorded: {violationCount}</span>
                        </div>
                    )}

                    <motion.div
                        key={currentQuestion}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="bg-white border border-slate-200 rounded-2xl p-8 md:p-12 shadow-xl"
                    >
                        <h2 className="text-2xl font-bold text-slate-900 mb-10 leading-relaxed">
                            {questions[currentQuestion].text}
                        </h2>

                        <div className="space-y-4">
                            {questions[currentQuestion].options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setAnswers({ ...answers, [currentQuestion]: idx })}
                                    className={`w-full p-5 rounded-xl border text-left transition-all flex items-center justify-between group shadow-sm ${answers[currentQuestion] === idx
                                        ? 'bg-primary/5 border-primary text-primary'
                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                                        }`}
                                >
                                    <span className="font-medium">{option}</span>
                                    {answers[currentQuestion] === idx && <CheckCircle size={20} className="text-primary" />}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Navigation */}
                    <div className="flex justify-between items-center mt-10">
                        <button
                            disabled={currentQuestion === 0}
                            onClick={() => setCurrentQuestion(prev => prev - 1)}
                            className="px-8 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            Previous
                        </button>

                        {currentQuestion === questions.length - 1 ? (
                            <button
                                onClick={handleSubmit}
                                className="px-12 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all"
                            >
                                Submit Test
                            </button>
                        ) : (
                            <button
                                onClick={() => setCurrentQuestion(prev => prev + 1)}
                                className="px-12 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all"
                            >
                                Next
                            </button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TestSession;
