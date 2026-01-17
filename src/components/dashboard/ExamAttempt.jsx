import React, { useState, useEffect, useCallback } from 'react';
import { Clock, CheckCircle2, AlertCircle, ChevronRight, ChevronLeft, Send, PlayCircle, Lock } from 'lucide-react';
import { ExamService } from '../../services/examService';

const ExamAttempt = ({ examId, onComplete }) => {
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [result, setResult] = useState(null);
    const [warnings, setWarnings] = useState(0);
    const [violations, setViolations] = useState([]);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Anti-Cheating & Initialization
    const fetchData = useCallback(async () => {
        try {
            const data = await ExamService.getExamById(examId);
            setExam(data);
            setTimeLeft(data.duration * 60);

            // Initial Fullscreen Request
            try {
                if (document.documentElement.requestFullscreen) {
                    await document.documentElement.requestFullscreen();
                    setIsFullscreen(true);
                }
            } catch (e) {
                console.error("Fullscreen Request Failed", e);
            }

        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, [examId]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // Violation Logger
    const handleViolation = async (type) => {
        if (isSubmitted || !exam) return;

        const newCount = warnings + 1;
        setWarnings(newCount);
        setViolations(prev => [...prev, { type, timestamp: new Date() }]);

        await ExamService.logViolation(examId, type);

        if (newCount >= (exam.rules?.maxWarnings || 3)) {
            alert(`Maximum warnings exceeded (${newCount}). The exam will be auto-submitted.`);
            handleSubmit(true); // Force submit
        }
    };

    // Fullscreen Monitor
    useEffect(() => {
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement && !isSubmitted) {
                setIsFullscreen(false);
                handleViolation('fullscreen_exit');
            } else {
                setIsFullscreen(true);
            }
        };

        const handleVisibilityChange = () => {
            if (document.hidden && !isSubmitted) {
                handleViolation('tab_switch');
            }
        };

        // Prevent Context Menu
        const handleContextMenu = (e) => e.preventDefault();

        // Prevent Copy/Paste (if enabled in rules)
        const handleCopyPaste = (e) => {
            if (exam?.rules?.disableCopyPaste) {
                e.preventDefault();
                // Optional: alert/warn
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('copy', handleCopyPaste);
        document.addEventListener('paste', handleCopyPaste);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('copy', handleCopyPaste);
            document.removeEventListener('paste', handleCopyPaste);
        };
    }, [exam, isSubmitted, warnings]);

    // Enter Fullscreen Helper
    const enterFullscreen = () => {
        document.documentElement.requestFullscreen().catch(e => console.error(e));
    };

    const handleAnswer = (answer) => {
        const newAnswers = [...answers];
        const existingIdx = newAnswers.findIndex(a => a.questionId === exam.questions[currentQuestion]._id);
        if (existingIdx > -1) {
            newAnswers[existingIdx].answer = answer;
        } else {
            newAnswers.push({ questionId: exam.questions[currentQuestion]._id, answer });
        }
        setAnswers(newAnswers);
    };

    const handleSubmit = async (force = false) => {
        if (!force && !window.confirm('Are you sure you want to submit your assessment?')) return;
        try {
            // Include violations in submission
            const res = await ExamService.submitExam(examId, answers, violations);
            setResult(res);
            setIsSubmitted(true);
            if (document.fullscreenElement) document.exitFullscreen();
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        if (!exam || isSubmitted) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [exam, isSubmitted]);

    // ... (formatTime helper remains)

    if (loading) return <div className="p-20 text-center animate-pulse font-black text-slate-400">LOADING ASSESSMENT...</div>;
    if (!exam) return <div className="p-20 text-center">Assessment not found</div>;

    // Fullscreen Overlay
    if (!isFullscreen && !isSubmitted && !loading) {
        return (
            <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 rounded-3xl bg-red-500/20 flex items-center justify-center text-red-500 mb-8 animate-pulse">
                    <AlertCircle size={40} />
                </div>
                <h2 className="text-3xl font-black text-white mb-4">Security Violation Detected</h2>
                <p className="text-slate-400 max-w-md mb-8">
                    You have exited fullscreen mode which is a violation of the exam protocol.
                    Please return to fullscreen to continue.
                </p>
                <button onClick={enterFullscreen} className="px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:scale-105 transition-all">
                    Return to Exam
                </button>
            </div>
        );
    }

    if (isSubmitted && result) {
        // ... (Result View Logic from before - unchanged)
        return (
            <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500 py-10">
                <div className="bg-white border border-slate-200 rounded-[3rem] p-12 text-center shadow-2xl relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-full h-2 ${result.status === 'Pass' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner ${result.status === 'Pass' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {result.status === 'Pass' ? <CheckCircle2 size={48} /> : <AlertCircle size={48} />}
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 mb-2">{result.status === 'Pass' ? 'Placement Ready!' : 'Keep Practicing'}</h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-10">{exam.title} Result</p>

                    {/* Warnings Display */}
                    {violations.length > 0 && (
                        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold flex items-center justify-center gap-2">
                            <AlertCircle size={16} /> {violations.length} Security Violations Recorded
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-6 mb-10">
                        <div className="bg-slate-50 rounded-3xl p-6">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Your Score</p>
                            <p className="text-3xl font-black text-slate-900">{Math.round(result.score)} <span className="text-sm text-slate-400">/ {result.totalScore}</span></p>
                        </div>
                        <div className="bg-slate-50 rounded-3xl p-6">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Percentage</p>
                            <p className="text-3xl font-black text-slate-900">{Math.round((result.score / result.totalScore) * 100)}%</p>
                        </div>
                    </div>

                    <button onClick={() => onComplete()} className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all">Back to Dashboard</button>
                </div>
            </div>
        );
    }

    const q = exam.questions[currentQuestion];
    // Use starterCode if no answer yet
    const currentAnswer = answers.find(a => a.questionId === q._id)?.answer;
    const editorValue = currentAnswer !== undefined ? currentAnswer : (q.starterCode || '');

    return (
        <div className="min-h-screen bg-slate-50 pb-20 select-none"> {/* Disable selection globally */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-5 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-4">
                    {/* ... Header content ... */}
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white"><PlayCircle size={24} /></div>
                    <div>
                        <h1 className="font-black text-slate-900 text-sm">{exam.title}</h1>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">{exam.category} Assessment</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    {/* Warning Indicator */}
                    {warnings > 0 && (
                        <div className="flex items-center gap-2 text-red-500 text-xs font-black bg-red-50 px-3 py-1 rounded-lg animate-pulse">
                            <AlertCircle size={16} /> {warnings} / {exam.rules?.maxWarnings || 3} Warnings
                        </div>
                    )}
                    <div className={`px-6 py-2.5 rounded-full font-black text-lg flex items-center gap-3 transition-colors ${timeLeft < 300 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-900'}`}>
                        <Clock size={20} />
                        {formatTime(timeLeft)}
                    </div>
                    <button onClick={() => handleSubmit()} className="px-8 py-2.5 bg-primary text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Submit Final</button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-8 py-12">
                {/* ... (Navigation buttons unchanged) ... */}
                <div className="flex gap-1.5 mb-10 overflow-x-auto pb-4 scrollbar-hide">
                    {exam.questions.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentQuestion(i)}
                            className={`min-w-[44px] h-11 rounded-xl font-black text-xs transition-all border ${currentQuestion === i ? 'bg-primary text-white border-primary shadow-lg scale-110 z-10' :
                                answers.some(a => a.questionId === exam.questions[i]._id) ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>

                <div className="bg-white border border-slate-200 rounded-[3rem] p-12 shadow-sm animate-in slide-in-from-bottom-10 duration-500">
                    <div className="flex justify-between items-center mb-8">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">Step {currentQuestion + 1} of {exam.questions.length}</span>
                        <div className="flex items-center gap-1"><Lock size={12} className="text-slate-300" /><span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">End-to-End Encrypted Secure Tunnel</span></div>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 mb-10 leading-relaxed whitespace-pre-wrap">{q.text}</h2>

                    {q.type === 'MCQ' ? (
                        <div className="grid grid-cols-1 gap-4">
                            {q.options.map((option, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleAnswer(option)}
                                    className={`w-full p-6 text-left rounded-3xl border-2 transition-all font-bold flex items-center justify-between group ${currentAnswer === option ? 'bg-primary/5 border-primary text-primary shadow-inner shadow-primary/5' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200 hover:bg-slate-50'
                                        }`}
                                >
                                    <span className="flex items-center gap-5">
                                        <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-colors ${currentAnswer === option ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                                            {String.fromCharCode(65 + i)}
                                        </span>
                                        {option}
                                    </span>
                                    {currentAnswer === option && <CheckCircle2 size={24} className="text-primary" />}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2"><Lock size={12} /> Secure Code Sandbox Instance</p>
                            <textarea
                                value={editorValue}
                                onChange={(e) => handleAnswer(e.target.value)}
                                className="w-full h-80 bg-slate-900 text-emerald-400 font-mono p-8 rounded-[2rem] outline-none shadow-2xl focus:ring-4 focus:ring-primary/20 transition-all text-sm"
                                placeholder="// Write your solution here...
function solve() {
  // your code
}"
                            />
                        </div>
                    )}

                    <div className="flex justify-between mt-12 pt-10 border-t border-slate-100">
                        <button
                            disabled={currentQuestion === 0}
                            onClick={() => setCurrentQuestion(p => p - 1)}
                            className="flex items-center gap-3 px-8 py-4 bg-slate-50 text-slate-500 font-black rounded-2xl text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-100 transition-all border border-slate-100"
                        >
                            <ChevronLeft size={18} /> Previous
                        </button>
                        <button
                            onClick={() => currentQuestion < exam.questions.length - 1 ? setCurrentQuestion(p => p + 1) : handleSubmit()}
                            className="flex items-center gap-3 px-10 py-4 bg-slate-900 text-white font-black rounded-2xl text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all"
                        >
                            {currentQuestion < exam.questions.length - 1 ? 'Save & Continue' : 'Submit Assessment'} <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ExamAttempt;
