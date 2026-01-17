import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, X, Bot, User, Loader2, Maximize2, Minimize2, Shield, Zap } from 'lucide-react';
import { useLocation } from 'react-router-dom';

import { AIService } from '../../services/aiService';
import { useAuth } from '../../context/AuthContext';

const AITutor = () => {
    const { collegeId, currentUser } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Salutations! I am the Averqon AI Catalyst. Query me for academic synthesis or system navigation.' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);
    const location = useLocation();

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input;
        setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
        setInput('');
        setLoading(true);

        try {
            // Attempt to extract subjectId from URL if on a course page
            const subjectMatch = location.pathname.match(/\/courses\/([a-zA-Z0-9]+)/);
            const subjectId = subjectMatch ? subjectMatch[1] : null;

            // Format history for Gemini
            const chatHistory = messages.map(m => ({
                role: m.type === 'user' ? 'user' : 'model',
                parts: [{ text: m.text }]
            }));

            const response = await AIService.askTutor(collegeId, subjectId, userMessage, chatHistory);

            setMessages(prev => [...prev, {
                type: 'bot',
                text: response.text,
                isSmart: !!response.context
            }]);
        } catch (error) {
            setMessages(prev => [...prev, { type: 'bot', text: "Neural synchronization interrupted. Please re-initiate link." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={`mb-6 bg-white border border-[#f4f7fe] shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden flex flex-col transition-all duration-500 ease-out ${isExpanded ? 'w-[90vw] h-[85vh] md:w-[600px] md:h-[750px]' : 'w-[90vw] h-[65vh] md:w-[420px] md:h-[580px]'
                            }`}
                    >
                        {/* Header */}
                        <div className="bg-[#2b3674] p-6 flex items-center justify-between text-white shrink-0 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-bl-full -mr-16 -mt-16" />
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md shadow-inner border border-white/10">
                                    <Bot size={22} className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-black text-sm tracking-tight flex items-center gap-2">AVERQON AI <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-lg border border-primary/20 uppercase tracking-widest">v1.2</span></h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <p className="text-[9px] text-white/50 font-black uppercase tracking-[0.2em]">Neural Link: Active</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 relative z-10">
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="p-2.5 hover:bg-white/10 rounded-xl transition-all"
                                >
                                    {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2.5 hover:bg-white/10 rounded-xl transition-all"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#f4f7fe]/20 scroll-smooth custom-scrollbar"
                        >
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-4 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                                >
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${msg.type === 'user' ? 'bg-[#2b3674] text-white border-transparent' : 'bg-white text-primary border-[#f4f7fe]'
                                        }`}>
                                        {msg.type === 'user' ? <User size={18} /> : <Zap size={18} />}
                                    </div>
                                    <div className={`max-w-[85%] p-5 rounded-[1.5rem] text-sm font-semibold leading-relaxed shadow-sm ${msg.type === 'user'
                                        ? 'bg-[#2b3674] text-white rounded-tr-none'
                                        : 'bg-white text-[#2b3674] border border-[#f4f7fe] rounded-tl-none'
                                        }`}>
                                        {msg.text.split('\n').map((line, i) => (
                                            <p key={i} className="mb-2 last:mb-0 leading-tight">{line}</p>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                            {loading && (
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-white text-primary border border-[#f4f7fe] flex items-center justify-center shrink-0 shadow-sm">
                                        <Loader2 size={18} className="animate-spin" />
                                    </div>
                                    <div className="bg-white border border-[#f4f7fe] p-5 rounded-[1.5rem] rounded-tl-none shadow-sm flex items-center gap-3">
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        <span className="text-[10px] font-black text-secondary tracking-widest uppercase ml-2">Thinking...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-8 bg-white border-t border-[#f4f7fe] shrink-0">
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Initiate synthesis query..."
                                    className="w-full bg-[#f4f7fe] border border-transparent text-[#2b3674] placeholder:text-secondary text-sm font-bold rounded-2xl py-5 pl-6 pr-14 focus:outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all shadow-inner uppercase tracking-wide"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || loading}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-3.5 bg-[#2b3674] text-white rounded-xl hover:bg-primary disabled:opacity-30 disabled:scale-95 transition-all shadow-xl shadow-[#2b3674]/20"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                            <div className="mt-4 flex items-center justify-center gap-3 opacity-60">
                                <Shield size={12} className="text-secondary" />
                                <p className="text-[9px] font-black text-secondary uppercase tracking-[0.2em]">
                                    Averqon Catalyst Core • Context-Aware Synthesis
                                </p>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 md:w-20 md:h-20 rounded-[2rem] shadow-[0_15px_35px_rgba(15,_23,_42,_0.3)] flex items-center justify-center transition-all duration-500 relative overflow-hidden group border-4 border-white ${isOpen ? 'bg-[#2b3674] rotate-180' : 'bg-gradient-to-br from-[#2b3674] to-primary'
                    }`}
            >
                <div className="absolute inset-0 bg-primary/10 opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative z-10 text-white">
                    {isOpen ? <X size={28} /> : <Bot size={32} className="animate-pulse" />}
                </div>
                {/* Notification dot */}
                {!isOpen && (
                    <div className="absolute top-4 right-4 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
                )}
            </motion.button>
        </div>
    );
};

export default AITutor;
