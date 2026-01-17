import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Sparkles, BrainCircuit, History, Info, ChevronRight, Zap, BookOpen, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StudentService } from '../../services/studentService';
import { AIService } from '../../services/aiService';

const AITutor = () => {
    const { collegeId, userData, user } = useAuth();
    const [messages, setMessages] = useState([
        { role: 'assistant', text: "Salutations! I'm your Averqon AI Academic Kernel. I've indexed your current learning clusters. Select a subject for context-aware synergy, or query me directly!" },
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
            // Format history for Gemini (user/model roles)
            const chatHistory = messages
                .filter(m => m.role !== 'system')
                .map(m => ({
                    role: m.role === 'user' ? 'user' : 'model',
                    parts: [{ text: m.text }]
                }));

            const response = await AIService.askTutor(collegeId, selectedSub?.id || selectedSub?._id, userMsg, chatHistory);

            const aiMsg = {
                role: 'assistant',
                text: response.text,
                isSmart: !!response.context,
                action: response.suggestedAction,
                context: response.context,
                source: response.source
            };

            setMessages(prev => [...prev, aiMsg]);

            if (response.suggestedAction === 'GENERATE_QUIZ') {
                const mcqs = await AIService.generateMCQs(selectedSub?.id || selectedSub?._id, userMsg);
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    text: 'Neural simulation complete. I have synthesized a practice assessment based on this cluster. Analyze now?',
                    quiz: mcqs
                }]);
            }
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', text: "Kernel synchronization lost. Re-establishing link..." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
            <div className="flex flex-col md:flex-row gap-8 h-full">
                {/* Chat Area */}
                <div className="flex-1 card-main flex flex-col !p-0 overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-[#f4f7fe] flex items-center justify-between bg-white shrink-0 relative z-10">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-[#2b3674] text-white flex items-center justify-center shadow-xl shadow-[#2b3674]/20 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <Bot size={28} className="relative z-10" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-[#2b3674] tracking-tight">Academic Kernel <span className="text-primary italic">OS</span></h2>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <p className="text-[10px] text-secondary font-black uppercase tracking-[0.2em]">Neural Link: Active</p>
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            <select
                                onChange={(e) => setSelectedSub(subjects.find(s => (s.id || s._id) === e.target.value))}
                                className="bg-[#f4f7fe] border border-transparent rounded-[1.25rem] px-6 py-3 text-[10px] font-black uppercase tracking-widest text-[#2b3674] outline-none focus:bg-white focus:border-primary/30 transition-all shadow-sm cursor-pointer"
                            >
                                <option value="">General Intelligence</option>
                                {subjects.map(s => <option key={s.id || s._id} value={s.id || s._id}>{s.name || s.title}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-[#f4f7fe]/20 custom-scrollbar">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] flex gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-10 h-10 rounded-[1.25rem] shrink-0 flex items-center justify-center font-black text-[10px] shadow-sm transform transition-transform hover:scale-110 ${msg.role === 'user' ? 'bg-[#2b3674] text-white' : 'bg-white border border-[#f4f7fe] text-primary'}`}>
                                        {msg.role === 'user' ? 'USER' : <Bot size={20} />}
                                    </div>
                                    <div className={`p-6 rounded-[2rem] text-sm font-semibold leading-relaxed relative ${msg.role === 'user' ? 'bg-[#2b3674] text-white shadow-xl shadow-[#2b3674]/10 rounded-tr-none' : 'bg-white border border-[#f4f7fe] text-[#2b3674] shadow-sm rounded-tl-none'}`}>
                                        {msg.isSmart && (
                                            <div className="absolute -top-4 left-6 px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full flex items-center gap-2 shadow-lg animate-bounce-subtle">
                                                <Sparkles size={11} /> Context-Aware
                                            </div>
                                        )}
                                        {msg.text}

                                        {msg.quiz && (
                                            <div className="mt-6 p-6 bg-[#f4f7fe]/50 rounded-[1.5rem] border border-[#f4f7fe] space-y-6">
                                                {msg.quiz.map((q, qIdx) => (
                                                    <div key={qIdx} className="space-y-3">
                                                        <p className="font-extrabold text-[#2b3674] text-xs uppercase tracking-tight">{q.question}</p>
                                                        <div className="grid grid-cols-1 gap-3">
                                                            {q.options.map((opt, oIdx) => (
                                                                <button key={oIdx} className="text-left px-5 py-3 bg-white border border-transparent rounded-xl text-xs font-bold text-secondary hover:border-primary/30 hover:text-primary transition-all shadow-sm">
                                                                    {opt}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                                <button className="btn-primary !w-full !py-3 !text-[10px] !font-black uppercase tracking-[0.2em] shadow-lg">Finalize Simulation</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="flex gap-5 items-center bg-white border border-[#f4f7fe] p-5 rounded-[1.5rem] shadow-sm text-secondary text-xs font-black uppercase tracking-widest italic animate-pulse">
                                    <Loader2 className="animate-spin text-primary" size={18} /> Synchronizing Neural Nodes...
                                </div>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>

                    {/* Input */}
                    <div className="p-8 bg-white border-t border-[#f4f7fe] relative">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder={selectedSub ? `Query cluster: ${selectedSub.name || selectedSub.title}...` : "Initiate a general academic query..."}
                                className="flex-1 bg-[#f4f7fe] border border-transparent text-[#2b3674] rounded-[1.5rem] px-8 py-5 outline-none focus:bg-white focus:border-primary/20 transition-all pr-20 text-sm font-bold shadow-inner"
                            />
                            <button
                                onClick={handleSend}
                                disabled={loading || !input.trim()}
                                className="absolute right-3 p-4 bg-[#2b3674] text-white rounded-[1.25rem] shadow-xl shadow-[#2b3674]/20 hover:bg-primary transition-all active:scale-95 disabled:opacity-30 disabled:grayscale transition-all"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="w-full md:w-80 space-y-8 shrink-0">
                    <div className="card-main !bg-[#2b3674] !p-10 text-white relative overflow-hidden group border-none">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-bl-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500" />
                        <Zap className="absolute -bottom-8 -left-8 text-white/[0.03] w-48 h-48" size={80} />

                        <h3 className="text-xl font-black mb-1 flex items-center gap-3 tracking-tight">
                            <Sparkles size={24} className="text-primary italic" /> Neuron 01
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 mb-10">Cluster Identity</p>

                        <p className="text-white/80 text-[10px] font-black leading-relaxed mb-10 uppercase tracking-[0.1em]">
                            Source: <br />{userData?.collegeName || 'Averqon Global Kernel'}
                        </p>

                        <div className="space-y-4 pt-6 border-t border-white/10">
                            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-primary">
                                <span>Context Sync</span>
                                <span>100%</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
                                <div className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full w-full shadow-[0_0_15px_rgba(0,100,255,0.5)]" />
                            </div>
                        </div>
                    </div>

                    <div className="card-main !p-10">
                        <h3 className="text-[10px] font-black text-[#2b3674] mb-8 flex items-center gap-3 uppercase tracking-[0.2em]">
                            <BrainCircuit size={18} className="text-primary" /> Active Clusters
                        </h3>
                        <div className="space-y-3">
                            {subjects.map((sub) => (
                                <button
                                    key={sub.id || sub._id}
                                    onClick={() => setSelectedSub(sub)}
                                    className={`w-full text-left p-5 rounded-2xl border transition-all flex items-center justify-between group ${selectedSub?.id === (sub.id || sub._id) ? 'bg-primary/5 border-primary/20' : 'bg-[#f4f7fe]/50 border-transparent hover:bg-white hover:border-[#f4f7fe]'}`}
                                >
                                    <div>
                                        <p className={`text-xs font-black ${selectedSub?.id === (sub.id || sub._id) ? 'text-primary' : 'text-[#2b3674]'}`}>{sub.name || sub.title}</p>
                                        <p className="text-[9px] font-black text-secondary uppercase tracking-widest mt-1">{sub.code || 'SYS-NODE'}</p>
                                    </div>
                                    <ChevronRight size={16} className={`${selectedSub?.id === (sub.id || sub._id) ? 'text-primary' : 'text-secondary'} group-hover:translate-x-1 transition-transform`} />
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
