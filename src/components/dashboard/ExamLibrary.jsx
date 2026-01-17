import React, { useState, useEffect } from 'react';
import {
    Plus, Play, FileText, Clock, Calendar, Trash2,
    Send, X, Search, Terminal, Code2, Monitor, AlertTriangle
} from 'lucide-react';
import { ExamService } from '../../services/examService';
import ExamAnalytics from './ExamAnalytics';

const ExamLibrary = ({ role }) => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [selectedExamId, setSelectedExamId] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        category: 'Aptitude',
        duration: 60,
        scheduledDate: '',
        passingCriteria: 40,
        negativeMarking: 0,
        rules: {
            fullscreenRequired: true,
            maxWarnings: 3,
            autoSubmitOnExit: false,
            disableCopyPaste: true
        },
        questions: [{
            type: 'MCQ',
            text: '',
            options: ['', '', '', ''],
            correctAnswer: '',
            points: 1,
            testCases: [{ input: '', output: '', isHidden: true }],
            timeLimit: 2
        }]
    });

    const fetchData = async () => {
        try {
            const data = await ExamService.getExams();
            setExams(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleAddQuestion = () => {
        setFormData({
            ...formData,
            questions: [...formData.questions, {
                type: 'MCQ',
                text: '',
                options: ['', '', '', ''],
                correctAnswer: '',
                points: 1,
                testCases: [{ input: '', output: '', isHidden: true }],
                timeLimit: 2
            }]
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await ExamService.createExam(formData);
            setIsModalOpen(false);
            fetchData();
            setFormData({
                title: '', category: 'Aptitude', duration: 60, scheduledDate: '', passingCriteria: 40,
                negativeMarking: 0,
                rules: { fullscreenRequired: true, maxWarnings: 3, autoSubmitOnExit: false, disableCopyPaste: true },
                questions: [{ type: 'MCQ', text: '', options: ['', '', '', ''], correctAnswer: '', points: 1, testCases: [{ input: '', output: '', isHidden: true }], timeLimit: 2 }]
            });
        } catch (err) { console.error(err); }
    };

    const filteredExams = exams.filter(e => {
        const matchesSearch = e.title?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCat = filterCategory === 'All' || e.category === filterCategory;
        return matchesSearch && matchesCat;
    });

    if (selectedExamId) {
        return <ExamAnalytics examId={selectedExamId} onBack={() => setSelectedExamId(null)} />;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Exam Engine</h1>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest text-primary flex items-center gap-2">
                        <Calendar size={12} /> Schedule & Manage Placement Assessments
                    </p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-primary text-white font-black rounded-xl shadow-lg flex items-center gap-2">
                    <Plus size={20} /> Create New Exam
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <div className="md:col-span-2 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" placeholder="Search exams..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                </div>
                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold appearance-none cursor-pointer">
                    <option value="All">All Categories</option>
                    <option value="Aptitude">Aptitude</option>
                    <option value="Coding">Coding</option>
                    <option value="Technical">Technical</option>
                    <option value="Company-Mock">Company Mock</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExams.map(exam => (
                    <div key={exam._id} className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black ${exam.category === 'Coding' ? 'bg-indigo-50 text-indigo-600' :
                                exam.category === 'Aptitude' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                }`}>
                                {exam.category === 'Coding' ? <Play size={24} /> : <FileText size={24} />}
                            </div>
                            <span className="px-3 py-1 bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest rounded-lg">{exam.status}</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">{exam.title}</h3>
                        <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-4">{exam.category}</p>

                        <div className="space-y-3 mt-auto">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><Clock size={14} /> {exam.duration} Minutes</div>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><Calendar size={14} /> {new Date(exam.scheduledDate).toLocaleDateString()}</div>
                            <div className="pt-4 flex gap-2">
                                <button
                                    onClick={() => setSelectedExamId(exam._id)}
                                    className="flex-1 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all"
                                >
                                    View Results
                                </button>
                                <button className="p-3 bg-slate-100 text-slate-400 hover:text-red-500 rounded-xl transition-all"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Exam Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-5xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white shrink-0 shadow-sm">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">Configure Placement Lab</h2>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">AI-Assisted Evaluation & Security Lockdown</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-50 rounded-full transition-all text-slate-300 hover:text-red-500"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-10">
                            {/* General Config */}
                            <section className="space-y-6">
                                <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Core Parameters</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Protocol Title</label>
                                        <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-primary outline-none transition-all" placeholder="e.g. Google-Level Coding Round 1" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Category</label>
                                        <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none cursor-pointer">
                                            <option value="Aptitude">Aptitude</option>
                                            <option value="Coding">Coding</option>
                                            <option value="Technical">Technical</option>
                                            <option value="Company-Mock">Company Mock</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Time Window</label>
                                        <input required type="datetime-local" value={formData.scheduledDate} onChange={e => setFormData({ ...formData, scheduledDate: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-primary outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Duration (Mins)</label>
                                        <input required type="number" value={formData.duration} onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-primary outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Negative Marking / Wrong Ans</label>
                                        <input step="0.25" type="number" value={formData.negativeMarking} onChange={e => setFormData({ ...formData, negativeMarking: parseFloat(e.target.value) })} className="w-full bg-slate-50 border border-red-100 text-red-500 rounded-2xl px-5 py-4 text-sm font-bold focus:border-primary outline-none transition-all" />
                                    </div>
                                </div>
                            </section>

                            {/* Security Rules */}
                            <section className="space-y-6">
                                <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Security Control Cluster</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[
                                        { label: 'Fullscreen Required', key: 'fullscreenRequired' },
                                        { label: 'Lock Copy/Paste', key: 'disableCopyPaste' },
                                        { label: 'Auto-Submit on Exit', key: 'autoSubmitOnExit' }
                                    ].map(rule => (
                                        <label key={rule.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-primary/5 transition-all">
                                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{rule.label}</span>
                                            <input type="checkbox" checked={formData.rules[rule.key]} onChange={e => setFormData({ ...formData, rules: { ...formData.rules, [rule.key]: e.target.checked } })} className="accent-primary w-4 h-4" />
                                        </label>
                                    ))}
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Max Warnings</span>
                                        <input type="number" value={formData.rules.maxWarnings} onChange={e => setFormData({ ...formData, rules: { ...formData.rules, maxWarnings: parseInt(e.target.value) } })} className="w-12 bg-transparent text-right font-black text-primary outline-none" />
                                    </div>
                                </div>
                            </section>

                            {/* Question Bank */}
                            <section className="space-y-8">
                                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                                    <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Logic Assets ({formData.questions.length})</h3>
                                    <button type="button" onClick={handleAddQuestion} className="px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-100 transition-all">
                                        <Plus size={14} /> Add Logic Unit
                                    </button>
                                </div>

                                <div className="space-y-12">
                                    {formData.questions.map((q, idx) => (
                                        <div key={idx} className="relative group/q animate-in slide-in-from-right-4 duration-300">
                                            <div className="absolute -left-10 top-0 flex flex-col gap-4">
                                                <span className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center text-[10px] font-black shadow-lg">0{idx + 1}</span>
                                                <button type="button" onClick={() => setFormData({ ...formData, questions: formData.questions.filter((_, i) => i !== idx) })} className="w-8 h-8 bg-white border border-slate-100 text-red-500 rounded-xl hover:bg-red-50 flex items-center justify-center transition-all opacity-0 group-hover/q:opacity-100"><Trash2 size={14} /></button>
                                            </div>

                                            <div className="bg-white border border-slate-100 shadow-xl shadow-slate-200/20 rounded-[2.5rem] p-10 space-y-8">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex gap-4">
                                                        {['MCQ', 'Coding'].map(type => (
                                                            <button
                                                                type="button"
                                                                key={type}
                                                                onClick={() => {
                                                                    const newQs = [...formData.questions];
                                                                    newQs[idx].type = type;
                                                                    setFormData({ ...formData, questions: newQs });
                                                                }}
                                                                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${q.type === type ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                                            >
                                                                {type}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Weighting:</label>
                                                        <input type="number" value={q.points} onChange={e => {
                                                            const newQs = [...formData.questions];
                                                            newQs[idx].points = parseInt(e.target.value);
                                                            setFormData({ ...formData, questions: newQs });
                                                        }} className="w-10 bg-slate-50 rounded-lg py-1 text-center font-black text-slate-900 text-sm" />
                                                    </div>
                                                </div>

                                                <textarea required placeholder="Articulate the challenge scope..." value={q.text} onChange={e => {
                                                    const newQs = [...formData.questions];
                                                    newQs[idx].text = e.target.value;
                                                    setFormData({ ...formData, questions: newQs });
                                                }} className="w-full bg-slate-50 border-none rounded-[1.5rem] p-6 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 min-h-[120px] resize-none" />

                                                {q.type === 'MCQ' ? (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {q.options.map((opt, oIdx) => (
                                                            <div key={oIdx} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${q.correctAnswer === opt && opt !== '' ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-100'}`}>
                                                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center font-black text-[10px] text-slate-400">{String.fromCharCode(65 + oIdx)}</div>
                                                                <input required placeholder={`Option Vector ${oIdx + 1}`} value={opt} onChange={e => {
                                                                    const newQs = [...formData.questions];
                                                                    newQs[idx].options[oIdx] = e.target.value;
                                                                    setFormData({ ...formData, questions: newQs });
                                                                }} className="flex-1 bg-transparent border-none text-xs font-bold outline-none" />
                                                                <input type="radio" name={`correct_${idx}`} checked={q.correctAnswer === opt && opt !== ''} onChange={() => {
                                                                    const newQs = [...formData.questions];
                                                                    newQs[idx].correctAnswer = opt;
                                                                    setFormData({ ...formData, questions: newQs });
                                                                }} className="accent-emerald-500 w-4 h-4" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="space-y-6">
                                                        <div className="flex justify-between items-center">
                                                            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Test Case Validation Suite</h4>
                                                            <button type="button" onClick={() => {
                                                                const newQs = [...formData.questions];
                                                                newQs[idx].testCases.push({ input: '', output: '', isHidden: true });
                                                                setFormData({ ...formData, questions: newQs });
                                                            }} className="text-[10px] font-extrabold text-indigo-500 hover:underline">+ Add Case</button>
                                                        </div>
                                                        <div className="grid grid-cols-1 gap-4">
                                                            {q.testCases.map((tc, tcIdx) => (
                                                                <div key={tcIdx} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end bg-slate-50 p-6 rounded-3xl relative">
                                                                    <div className="space-y-2">
                                                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Input Stream</label>
                                                                        <input value={tc.input} onChange={e => {
                                                                            const newQs = [...formData.questions];
                                                                            newQs[idx].testCases[tcIdx].input = e.target.value;
                                                                            setFormData({ ...formData, questions: newQs });
                                                                        }} className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2 text-[10px] font-mono font-bold" />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Expected Output</label>
                                                                        <input value={tc.output} onChange={e => {
                                                                            const newQs = [...formData.questions];
                                                                            newQs[idx].testCases[tcIdx].output = e.target.value;
                                                                            setFormData({ ...formData, questions: newQs });
                                                                        }} className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2 text-[10px] font-mono font-bold" />
                                                                    </div>
                                                                    <div className="flex items-center justify-between pb-1">
                                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                                            <input type="checkbox" checked={tc.isHidden} onChange={e => {
                                                                                const newQs = [...formData.questions];
                                                                                newQs[idx].testCases[tcIdx].isHidden = e.target.checked;
                                                                                setFormData({ ...formData, questions: newQs });
                                                                            }} className="accent-indigo-500" />
                                                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Hidden Target</span>
                                                                        </label>
                                                                        <button type="button" onClick={() => {
                                                                            const newQs = [...formData.questions];
                                                                            newQs[idx].testCases = newQs[idx].testCases.filter((_, i) => i !== tcIdx);
                                                                            setFormData({ ...formData, questions: newQs });
                                                                        }} className="text-red-400 hover:text-red-500"><X size={14} /></button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <div className="pt-10 flex justify-end gap-6 shrink-0 bg-white sticky bottom-0 border-t border-slate-50 mt-10 pb-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-10 py-4 bg-slate-50 text-slate-500 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all">Abort Design</button>
                                <button type="submit" className="px-16 py-4 bg-primary text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 flex items-center gap-3 transition-all hover:scale-105 active:scale-95">
                                    <Send size={18} /> Initiate Deployment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamLibrary;
