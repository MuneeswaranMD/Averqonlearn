import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ExamService } from '../services/examService';
import {
    Clock, AlertTriangle, CheckCircle, ArrowRight, Shield,
    ChevronLeft, ChevronRight, Send, Terminal, Code2,
    Monitor, Lock, AlertCircle, PlayCircle, Eye, Sparkles, X
} from 'lucide-react';

const TestSession = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Core State
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [started, setStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [answers, setAnswers] = useState({}); // { [questionId]: { answer, language, timeSpent } }
    const [violationCount, setViolationCount] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [showRules, setShowRules] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showInstructions, setShowInstructions] = useState(true);
    const [executionResult, setExecutionResult] = useState(null);
    const [isRunning, setIsRunning] = useState(false);

    // Initial Load
    useEffect(() => {
        const fetchExam = async () => {
            try {
                const data = await ExamService.getExamById(id);
                setExam(data);
                setTimeLeft(data.duration * 60);
            } catch (err) {
                console.error("Exam load failed", err);
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchExam();
    }, [id, navigate]);

    // Security & Timer Logic
    useEffect(() => {
        if (!started || submitted) return;

        // Forced Fullscreen Checker
        const checkFullscreen = () => {
            const fs = !!document.fullscreenElement;
            setIsFullscreen(fs);
            if (!fs && started && !submitted) {
                handleViolation("Fullscreen Exit");
            } else if (fs && started) {
                ExamService.logActivity(id, 'Fullscreen Entry', 'User entered fullscreen mode');
            }
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                handleViolation("Tab Switching");
            } else {
                ExamService.logActivity(id, 'Focus Regained', 'User returned to the exam tab');
            }
        };

        const handleViolation = async (type) => {
            setViolationCount(prev => prev + 1);
            try {
                const data = await ExamService.logViolation(id, type);
                // Also log as distinct activity if needed, but logViolation now handles it.
                if (data.status === 'Flagged' || (exam?.rules?.autoSubmitOnExit && type === 'Fullscreen Exit')) {
                    await handleSubmit();
                    window.close(); // Force close on critical violation
                }
            } catch (err) { console.error("Violation log failed", err); }
        };

        // Event Listeners
        document.addEventListener('fullscreenchange', checkFullscreen);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Prevent Shortcuts
        const handleKeyDown = (e) => {
            if (exam?.rules?.disableCopyPaste) {
                if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'u')) {
                    e.preventDefault();
                    ExamService.logActivity(id, 'Copy/Paste Attempt', `User attempted shortcut: ${e.key}`);
                    return false;
                }
            }
            if (e.key === 'F12' || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I')) {
                e.preventDefault();
                ExamService.logActivity(id, 'DevTools Attempt', 'User attempted to open developer tools');
                return false;
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        if (exam?.rules?.disableCopyPaste) {
            document.addEventListener('contextmenu', e => {
                e.preventDefault();
                ExamService.logActivity(id, 'Right Click', 'User attempted right-click context menu');
            });
        }

        // Timer
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
            document.removeEventListener('fullscreenchange', checkFullscreen);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('keydown', handleKeyDown);
            clearInterval(timer);
        };
    }, [started, submitted, id, exam]);

    const handleStart = async () => {
        try {
            const elem = document.documentElement;
            if (elem.requestFullscreen) {
                await elem.requestFullscreen();
            }
            setStarted(true);
            setShowInstructions(false);
            ExamService.logActivity(id, 'Exam Started', 'User initiated the exam session');
        } catch (err) {
            alert("Fullscreen permission is mandatory to start the exam.");
        }
    };

    const reEnterFullscreen = async () => {
        try {
            const elem = document.documentElement;
            if (elem.requestFullscreen) await elem.requestFullscreen();
        } catch (err) { }
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const formattedAnswers = Object.entries(answers).map(([qid, val]) => ({
                questionId: qid,
                answer: val.answer,
                language: val.language,
                timeSpent: val.timeSpent || 0
            }));
            await ExamService.submitExam(id, formattedAnswers);
            setSubmitted(true);

            // Exit fullscreen and attempt to close window after short delay
            if (document.fullscreenElement) document.exitFullscreen().catch(() => { });
            setTimeout(() => {
                if (window.opener) window.close();
                else navigate('/dashboard');
            }, 3000);

        } catch (err) {
            console.error("Submit failed", err);
            alert("Final submission failed. Link lost. Your progress is cached and will attempt auto-sync.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateAnswer = (qid, answer, language = null) => {
        setAnswers(prev => ({
            ...prev,
            [qid]: {
                ...prev[qid],
                answer,
                language: language || prev[qid]?.language || 'python'
            }
        }));
    };

    const handleRunCode = async () => {
        if (isRunning) return;
        setIsRunning(true);
        setExecutionResult(null);
        try {
            const currentQ = exam.questions[currentQuestionIdx];
            const userAns = answers[currentQ._id] || { answer: '', language: 'python' };

            const result = await ExamService.executeCode(userAns.answer, userAns.language || 'python');

            ExamService.logActivity(id, 'Code Execution', `Ran code in ${userAns.language || 'python'}. Status: ${result.status}`);

            setExecutionResult({
                status: result.status,
                output: result.output,
                type: result.type
            });
        } catch (err) {
            setExecutionResult({
                status: 'Connection Error',
                output: 'Failed to access the Execution Engine. Ensure Docker is running.\n\n' + err.message,
                type: 'error'
            });
        } finally {
            setIsRunning(false);
        }
    };

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h > 0 ? h + ':' : ''}${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (loading) return (
        <div className="min-h-screen bg-[#f4f7fe] flex flex-col items-center justify-center font-sans">
            <PlayCircle className="animate-spin text-primary mb-6" size={48} />
            <p className="text-sm font-black text-[#2b3674] uppercase tracking-[0.2em]">Synchronizing Exam Kernel...</p>
        </div>
    );

    if (submitted) return (
        <div className="min-h-screen bg-[#f4f7fe] flex items-center justify-center p-4 font-sans leading-relaxed">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="card-main !p-12 max-w-lg w-full text-center">
                <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/10">
                    <CheckCircle size={48} />
                </div>
                <h2 className="text-3xl font-black text-[#2b3674] mb-3 tracking-tight">Protocol Completed</h2>
                <p className="text-secondary font-semibold mb-10">Your assessment data has been encrypted and synced with the institutional ledger. This secure window will close shortly.</p>
                <div className="bg-[#f4f7fe] rounded-[2rem] p-6 mb-10 border border-slate-100 flex items-center justify-between">
                    <div className="text-left">
                        <p className="text-[10px] font-black uppercase tracking-widest text-secondary">Final Status</p>
                        <p className="text-sm font-extrabold text-[#2b3674]">Synced & Pending Evaluation</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-secondary">Violations</p>
                        <p className={`text-sm font-black ${violationCount > 0 ? 'text-red-500' : 'text-emerald-500'}`}>{violationCount}</p>
                    </div>
                </div>
                <button onClick={() => window.opener ? window.close() : navigate('/dashboard')} className="btn-primary !w-full !py-4 shadow-xl shadow-primary/20">Close Secure Session</button>
            </motion.div>
        </div>
    );

    if (showInstructions) {
        return (
            <div className="min-h-screen bg-[#f4f7fe] flex items-center justify-center p-4 font-sans leading-relaxed">
                <div className="max-w-2xl w-full">
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="card-main !p-12 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-bl-full -mr-20 -mt-20" />

                        <div className="flex items-center gap-6 mb-12">
                            <div className="w-16 h-16 bg-primary text-white rounded-[2rem] flex items-center justify-center shadow-lg shadow-primary/20">
                                <Shield size={32} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-[#2b3674] tracking-tight">{exam.title}</h1>
                                <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">{exam.category} Assessment Protocol</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-10">
                            <div className="p-5 bg-[#f4f7fe] rounded-3xl border border-slate-100">
                                <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">Duration</p>
                                <p className="text-lg font-extrabold text-[#2b3674]">{exam.duration} Minutes</p>
                            </div>
                            <div className="p-5 bg-[#f4f7fe] rounded-3xl border border-slate-100">
                                <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">Questions</p>
                                <p className="text-lg font-extrabold text-[#2b3674]">{exam.questions.length} Items</p>
                            </div>
                        </div>

                        <div className="space-y-6 mb-12">
                            {[
                                { icon: Monitor, text: "Fullscreen enforcement is active. Exiting triggers a violation." },
                                { icon: Lock, text: "Tab switching and clipboard actions are strictly monitored." },
                                { icon: AlertTriangle, text: `Max Warnings: ${exam?.rules?.maxWarnings || 3}. Crossing this will auto-flag your result.` },
                                { icon: Clock, text: "Auto-submit protocol will engage at T-00:00." }
                            ].map((rule, idx) => (
                                <div key={idx} className="flex gap-5">
                                    <div className="w-10 h-10 bg-white border border-[#f4f7fe] rounded-2xl flex items-center justify-center shrink-0 shadow-sm text-primary">
                                        <rule.icon size={18} />
                                    </div>
                                    <p className="text-sm font-semibold text-secondary leading-normal pt-2">{rule.text}</p>
                                </div>
                            ))}
                        </div>

                        <button onClick={handleStart} className="btn-primary !w-full !py-5 shadow-2xl flex items-center justify-center gap-3">
                            <Lock size={20} /> Initiate Secure Session
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

    const currentQ = exam.questions[currentQuestionIdx];
    const userAns = answers[currentQ._id] || { answer: '', language: 'python' };

    return (
        <div className="min-h-screen bg-white text-[#2b3674] font-sans flex flex-col">
            {/* Security Overlay for Non-Fullscreen */}
            {!isFullscreen && started && (
                <div className="fixed inset-0 z-[100] bg-[#2b3674]/95 backdrop-blur-xl flex items-center justify-center p-6 text-center">
                    <div className="max-w-md">
                        <AlertCircle size={80} className="text-red-500 mx-auto mb-8 animate-pulse" />
                        <h2 className="text-3xl font-black text-white mb-4 tracking-tight">SECURITY ALERT</h2>
                        <p className="text-white/70 font-bold mb-10 leading-relaxed uppercase tracking-widest text-[10px]">Your session cluster is isolated. Detection: Non-Fullscreen state. To resume, re-initiate link immediately.</p>
                        <button onClick={reEnterFullscreen} className="btn-primary !w-full !py-5 bg-white !text-primary shadow-2xl">Re-establish Security Link</button>
                    </div>
                </div>
            )}

            {/* Pro Header */}
            <header className="h-24 bg-white border-b border-[#f4f7fe] px-10 flex items-center justify-between shrink-0 relative z-50">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#2b3674] text-white rounded-[1.25rem] flex items-center justify-center shadow-xl">
                            <Terminal size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black tracking-tight">{exam.title}</h3>
                            <p className="text-[9px] font-black text-secondary uppercase tracking-[0.2em]">Neural Node: {currentQuestionIdx + 1} / {exam.questions.length}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    {violationCount > 0 && (
                        <div className="flex items-center gap-2 px-6 py-3 bg-red-50 border border-red-100 rounded-2xl text-red-500 animate-pulse">
                            <AlertTriangle size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Security Flags: {violationCount}</span>
                        </div>
                    )}
                    <div className={`flex items-center gap-4 px-8 py-4 rounded-[1.5rem] font-mono text-2xl font-black shadow-inner ${timeLeft < 300 ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-[#f4f7fe] text-[#2b3674]'}`}>
                        <Clock size={24} className={timeLeft < 300 ? 'animate-spin' : ''} /> {formatTime(timeLeft)}
                    </div>
                    <button onClick={handleSubmit} disabled={isSubmitting} className="px-10 py-4 bg-red-500 hover:bg-red-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-red-500/20 transition-all active:scale-95 disabled:opacity-50">
                        Final Commit
                    </button>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden">
                {/* Navigation Sidebar */}
                <aside className="w-80 bg-[#f4f7fe]/30 border-r border-[#f4f7fe] p-10 overflow-y-auto hidden lg:block shrink-0">
                    <p className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] mb-10">Map Overview</p>
                    <div className="grid grid-cols-4 gap-4">
                        {exam.questions.map((q, idx) => (
                            <button
                                key={q._id}
                                onClick={() => setCurrentQuestionIdx(idx)}
                                className={`h-12 rounded-2xl font-black text-sm flex items-center justify-center transition-all ${currentQuestionIdx === idx ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' :
                                    answers[q._id]?.answer ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/10' : 'bg-white border border-[#f4f7fe] text-secondary hover:border-primary/30'
                                    }`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Content Area */}
                <div className="flex-1 flex flex-col p-10 overflow-y-auto bg-white custom-scrollbar">
                    <div className="max-w-5xl w-full mx-auto">
                        <div className="flex items-center justify-between mb-12">
                            <div className="px-5 py-2.5 bg-primary/5 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <Sparkles size={12} /> {currentQ.type} Segment
                            </div>
                            <div className="text-[10px] font-black text-secondary uppercase tracking-widest">Weight: {currentQ.points} Unit</div>
                        </div>

                        <h2 className="text-2xl font-extrabold text-[#2b3674] mb-12 leading-relaxed tracking-tight whitespace-pre-wrap">
                            {currentQ.text}
                        </h2>

                        {currentQ.type === 'MCQ' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {currentQ.options.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => updateAnswer(currentQ._id, opt)}
                                        className={`p-8 rounded-[2rem] border text-left transition-all relative group flex items-center justify-between font-semibold leading-relaxed shadow-sm ${userAns.answer === opt ? 'bg-primary/5 border-primary ring-4 ring-primary/5' : 'bg-white border-[#f4f7fe] hover:border-primary/20 hover:bg-[#f4f7fe]/20'
                                            }`}
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-[10px] shrink-0 border transition-all ${userAns.answer === opt ? 'bg-primary text-white border-transparent' : 'bg-[#f4f7fe] text-secondary border-transparent group-hover:bg-white '
                                                }`}>
                                                {String.fromCharCode(65 + idx)}
                                            </div>
                                            <span className={userAns.answer === opt ? 'text-primary' : 'text-secondary'}>{opt}</span>
                                        </div>
                                        {userAns.answer === opt && <CheckCircle className="text-primary shrink-0" size={20} />}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-[#f4f7fe] rounded-[1.5rem] border border-slate-100">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 bg-white rounded-xl shadow-sm text-primary">
                                            <Code2 size={18} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#2b3674]">Synergy Compiler</span>
                                    </div>
                                    <select
                                        value={userAns.language || 'python'}
                                        onChange={(e) => updateAnswer(currentQ._id, userAns.answer, e.target.value)}
                                        className="bg-white border-none rounded-xl px-5 py-2.5 text-[10px] font-black uppercase tracking-widest shadow-sm outline-none focus:ring-4 focus:ring-primary/5"
                                    >
                                        <option value="python">Python 3.10</option>
                                        <option value="java">Java 17</option>
                                        <option value="cpp">C++ 20</option>
                                        <option value="javascript">Node.js 18</option>
                                    </select>
                                </div>
                                <div className="relative group">
                                    <div className="absolute top-6 left-6 flex flex-col gap-1 z-10 pointer-events-none">
                                        {[...Array(15)].map((_, i) => (
                                            <div key={i} className="text-[10px] font-mono text-secondary/30 text-right w-6">{i + 1}</div>
                                        ))}
                                    </div>
                                    <div className="flex flex-col h-[600px] bg-[#0f172a] rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-slate-800">
                                        <div className="flex-1 relative">
                                            <textarea
                                                value={userAns.answer}
                                                onChange={(e) => updateAnswer(currentQ._id, e.target.value)}
                                                placeholder="# Initiate synthesis algorithm here..."
                                                spellCheck={false}
                                                className="w-full h-full bg-[#0f172a] text-[#e2e8f0] font-mono text-sm p-8 outline-none resize-none focus:bg-[#111c33] transition-colors scroll-smooth custom-scrollbar"
                                            />

                                            <div className="absolute bottom-6 right-6 z-20">
                                                <button
                                                    onClick={handleRunCode}
                                                    disabled={isRunning}
                                                    className="px-6 py-4 bg-primary text-white rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3 text-[11px] font-black uppercase tracking-widest border border-white/10"
                                                >
                                                    <PlayCircle size={18} className={isRunning ? 'animate-spin' : ''} />
                                                    {isRunning ? 'Compiling...' : 'Run Code'}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Integrated Terminal Panel */}
                                        <div className="h-48 bg-[#020617] border-t border-slate-700 p-0 flex flex-col">
                                            <div className="flex items-center justify-between px-6 py-2 bg-slate-900/50 border-b border-white/5">
                                                <div className="flex items-center gap-2">
                                                    <Terminal size={14} className="text-slate-400" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Console Output</span>
                                                </div>
                                                {executionResult && (
                                                    <button onClick={() => setExecutionResult(null)} className="text-slate-500 hover:text-white transition-colors">
                                                        <X size={14} />
                                                    </button>
                                                )}
                                            </div>

                                            <div className="flex-1 p-6 font-mono text-xs overflow-y-auto custom-scrollbar">
                                                {executionResult ? (
                                                    <div className={`animate-in fade-in slide-in-from-bottom-2 duration-300 ${executionResult.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                                                        <div className="mb-3 font-bold flex items-center gap-2 pb-2 border-b border-white/5">
                                                            <div className={`w-2 h-2 rounded-full ${executionResult.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                                            {executionResult.status}
                                                        </div>
                                                        <pre className="whitespace-pre-wrap leading-relaxed opacity-90 font-mono text-slate-300">{executionResult.output}</pre>
                                                    </div>
                                                ) : (
                                                    <div className="h-full flex flex-col items-center justify-center text-slate-600 italic opacity-50">
                                                        <Terminal size={24} className="mb-2 opacity-50" />
                                                        Waiting for execution command...
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Bottom Nav */}
            <footer className="h-24 bg-white border-t border-[#f4f7fe] px-10 flex items-center justify-between shrink-0 relative z-50">
                <button
                    disabled={currentQuestionIdx === 0}
                    onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                    className="flex items-center gap-3 px-8 py-4 bg-white border border-[#f4f7fe] text-secondary rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#f4f7fe]/50 disabled:opacity-30 transition-all active:scale-95"
                >
                    <ChevronLeft size={16} /> Previous Node
                </button>

                <div className="flex gap-4">
                    <div className="px-6 py-4 bg-[#f4f7fe] border border-slate-100 rounded-2xl flex items-center gap-3">
                        <Monitor size={16} className="text-secondary" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#2b3674]">OS Enforcement Active</span>
                    </div>
                </div>

                {currentQuestionIdx === exam.questions.length - 1 ? (
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex items-center gap-3 px-10 py-4 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/20 transition-all active:scale-95"
                    >
                        Initiate Submission Sequence <Send size={16} />
                    </button>
                ) : (
                    <button
                        onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                        className="flex items-center gap-3 px-10 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-95"
                    >
                        Proceed to Next Node <ChevronRight size={16} />
                    </button>
                )}
            </footer>
        </div>
    );
};

export default TestSession;
