import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Sparkles, BrainCircuit, History, Info, ChevronRight, Zap, BookOpen, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StudentService } from '../../services/studentService';
import { AIService } from '../../services/aiService';

const AITutor = () => {
    const { collegeId, user } = useAuth();
    const [messages, setMessages] = useState([
        { role: 'assistant', text: "Hello! I'm your Averqon AI Academic Tutor. Select a subject to start a context-aware session, or just ask me anything!" },
    ]);
    const [input, setInput] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [selectedSub, setSelectedSub] = useState(null);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        const loadSubjects = async () => {
            const list = await StudentService.getEnrolledSubjects(user?.uid);
            setSubjects(list);
        };
        loadSubjects();
    }, [user]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        setLoading(true);

        try {
            const response = await AIService.askTutor(collegeId, selectedSub?.id, userMsg);

            const aiMsg = {
                role: 'assistant',
                text: response.text,
                isSmart: !!response.context,
                action: response.suggestedAction,
                context: response.context
            };

            setMessages(prev => [...prev, aiMsg]);

            if (response.suggestedAction === 'GENERATE_QUIZ') {
                const mcqs = await AIService.generateMCQs(response.context);
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    text: 'I have prepared a quick practice quiz for you based on this topic. Would you like to try it now?',
                    quiz: mcqs
                }]);
            }
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', text: "Connection to AI Cluster interrupted." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row gap-6 h-full">
                {/* Chat Area */}
                <div className="flex-1 bg-white border border-slate-200 rounded-[2.5rem] flex flex-col shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                                <Bot size={28} />
                            </div>
                            <div>
                                <h2 className="font-black text-slate-900 tracking-tight">Academic Genius OS</h2>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Neural Cluster Active</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <select
                                onChange={(e) => setSelectedSub(subjects.find(s => s.id === e.target.value))}
                                className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 outline-none focus:border-primary transition-all"
                            >
                                <option value="">General Knowledge</option>
                                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-bold text-xs shadow-sm ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-white border border-slate-100 text-slate-400'}`}>
                                        {msg.role === 'user' ? 'YOU' : <Bot size={20} />}
                                    </div>
                                    <div className={`p-5 rounded-[1.5rem] text-sm leading-relaxed relative ${msg.role === 'user' ? 'bg-primary text-white shadow-xl shadow-primary/10' : 'bg-white border border-slate-100 text-slate-700 shadow-sm'}`}>
                                        {msg.isSmart && (
                                            <div className="absolute -top-3 left-6 px-3 py-1 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full flex items-center gap-1 shadow-lg">
                                                <Sparkles size={10} /> Context-Aware
                                            </div>
                                        )}
                                        {msg.text}

                                        {msg.quiz && (
                                            <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                                                {msg.quiz.map((q, qIdx) => (
                                                    <div key={qIdx} className="space-y-2">
                                                        <p className="font-bold text-slate-900">{q.question}</p>
                                                        <div className="grid grid-cols-1 gap-2">
                                                            {q.options.map((opt, oIdx) => (
                                                                <button key={oIdx} className="text-left px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:border-primary transition-all">
                                                                    {opt}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                                <button className="w-full py-2 bg-primary text-white font-black rounded-xl text-[10px] uppercase tracking-widest">Submit Answers</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="flex gap-4 items-center bg-white border border-slate-100 p-4 rounded-2xl shadow-sm text-slate-400 text-xs font-bold italic">
                                    <Loader2 className="animate-spin" size={16} /> Thinking via academic context...
                                </div>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>

                    {/* Input */}
                    <div className="p-6 border-t border-slate-100 bg-white">
                        <div className="relative flex items-center gap-4">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder={selectedSub ? `Ask about ${selectedSub.name}...` : "Ask a general academic doubt..."}
                                className="flex-1 bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-primary transition-all pr-16 text-sm font-medium shadow-inner"
                            />
                            <button
                                onClick={handleSend}
                                disabled={loading}
                                className="absolute right-2 p-3 bg-slate-900 text-white rounded-xl shadow-xl hover:bg-primary transition-all active:scale-95 disabled:opacity-50"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="w-full md:w-80 space-y-6 shrink-0">
                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
                        <Zap className="absolute top-4 right-4 text-white/5 group-hover:scale-125 transition-transform duration-500" size={80} />
                        <h3 className="text-xl font-black mb-2 flex items-center gap-2 uppercase tracking-tighter">
                            <Sparkles size={24} className="text-emerald-400" /> Neuron Cluster
                        </h3>
                        <p className="text-indigo-100/70 text-xs font-bold leading-relaxed mb-8 uppercase tracking-widest">
                            Multi-Tenant Identity: <br />{userData?.collegeName || 'Averqon Global'}
                        </p>
                        <div className="space-y-3">
                            <div className="flex justify-between text-[10px] font-black uppercase">
                                <span>Context Sync</span>
                                <span>100%</span>
                            </div>
                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-400 rounded-full w-full shadow-[0_0_10px_#10b981]" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                        <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2 uppercase text-xs tracking-widest border-b border-slate-50 pb-4">
                            <BrainCircuit size={18} className="text-primary" /> Active Subjects
                        </h3>
                        <div className="space-y-3">
                            {subjects.map((sub) => (
                                <button
                                    key={sub.id}
                                    onClick={() => setSelectedSub(sub)}
                                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group ${selectedSub?.id === sub.id ? 'bg-primary/5 border-primary/20' : 'bg-slate-50 border-slate-100 hover:bg-white'}`}
                                >
                                    <div>
                                        <p className={`text-xs font-black ${selectedSub?.id === sub.id ? 'text-primary' : 'text-slate-600'}`}>{sub.name}</p>
                                        <p className="text-[10px] font-bold text-slate-400">{sub.code}</p>
                                    </div>
                                    <ChevronRight size={16} className={`${selectedSub?.id === sub.id ? 'text-primary' : 'text-slate-300'} group-hover:translate-x-1 transition-transform`} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AITutor;
