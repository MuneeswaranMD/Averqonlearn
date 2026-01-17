import React, { useState, useEffect } from 'react';
import { Play, Calendar, Clock, User, ExternalLink, Search, Filter, PlayCircle, Layers, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StudentService } from '../../services/studentService';

const VideoClasses = () => {
    const { collegeId, userData } = useAuth();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchVideos = async () => {
            if (!collegeId) return;
            try {
                // Students see only content assigned to their subjects/batches
                const data = await StudentService.getContent({ type: 'video' });
                setVideos(data);
            } catch (error) { console.error(error); } finally { setLoading(false); }
        };
        fetchVideos();
    }, [collegeId]);

    const [selectedVideo, setSelectedVideo] = useState(null);

    const getYouTubeThumbnail = (url) => {
        if (!url) return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800";
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11)
            ? `https://img.youtube.com/vi/${match[2]}/maxresdefault.jpg`
            : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800";
    };

    const getYouTubeEmbedUrl = (url) => {
        if (!url) return '';
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
    };

    const VideoPlayer = ({ video, onClose }) => (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden relative border border-white/10 shadow-2xl">
                <button onClick={onClose} className="absolute top-6 right-6 z-20 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-md"><X size={24} /></button>
                <iframe src={getYouTubeEmbedUrl(video.url)} className="w-full h-full" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
            </div>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {selectedVideo && <VideoPlayer video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Stream <span className="text-primary italic">OS</span></h1>
                    <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Recorded Academic Content
                    </p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Find a lecture..."
                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:border-primary transition-all text-sm font-bold shadow-sm"
                        />
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filtered.map(v => (
                    <div key={v._id || v.id} className="group relative bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
                        <div className="aspect-video relative bg-slate-900 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 cursor-pointer" onClick={() => setSelectedVideo(v)}>
                                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white scale-75 group-hover:scale-100 transition-transform duration-500">
                                    <Play fill="currentColor" size={24} />
                                </div>
                            </div>
                            <img src={getYouTubeThumbnail(v.url)} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" />
                            <div className="absolute top-4 left-4 flex gap-2">
                                <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black text-white uppercase tracking-widest">Recorded</span>
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-primary/5 text-primary rounded-lg"><Layers size={14} /></div>
                                <span className="text-[10px] items-center font-black uppercase text-slate-400 tracking-widest">{v.subjectId?.title || 'Core'} • {v.unit || 'Unit 1'}</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-primary transition-colors">{v.title}</h3>
                            <p className="text-sm text-slate-500 line-clamp-2 mb-8 font-medium italic">"{v.description || 'Deep dive lecture into advanced concepts.'}"</p>

                            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-black text-[10px]">OS</div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-900">Academic Cloud</span>
                                        <span className="text-[9px] font-bold text-emerald-500 uppercase">Ready for QA</span>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedVideo(v)} className="p-3 bg-slate-900 text-white rounded-2xl group-hover:bg-primary transition-all shadow-lg shadow-slate-900/10">
                                    <PlayCircle size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {loading && [1, 2, 3].map(i => (
                    <div key={i} className="h-[450px] bg-slate-50 rounded-[2.5rem] animate-pulse border border-slate-100" />
                ))}

                {!loading && filtered.length === 0 && (
                    <div className="col-span-full py-32 flex flex-col items-center justify-center bg-white border border-slate-200 border-dashed rounded-[3rem]">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6"><Play size={40} /></div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">No Broadcasts Found</h3>
                        <p className="text-slate-500 font-medium">Your institution hasn't uploaded any stream content for this section yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoClasses;
