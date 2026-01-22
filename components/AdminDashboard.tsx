import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Database, UserCircle, Clock, Trash2, X, RefreshCw,
    ChevronRight, ArrowUpDown, MessageSquare, AlertTriangle, PlayCircle, PauseCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../services/supabase';

interface Note {
    id: string;
    created_at: string;
    content: string;
    user_email: string;
    sender_name: string;
    ai_comment?: string;
    audio_url?: string | null;
}

interface AdminDashboardProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
    const { t, i18n } = useTranslation();
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
    const audioRef = React.useRef<HTMLAudioElement | null>(null);

    const fetchNotes = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .order('created_at', { ascending: sortOrder === 'asc' });

        if (!error && data) {
            setNotes(data);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (isOpen) {
            fetchNotes();
        }
    }, [isOpen, sortOrder]);

    const toggleSort = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    const deleteNote = async (id: string) => {
        const { error } = await supabase.from('notes').delete().eq('id', id);
        if (!error) {
            setNotes(notes.filter(n => n.id !== id));
        }
    };

    const isRtl = i18n.language === 'ar';

    const toggleAudio = (noteId: string, url: string) => {
        if (!audioRef.current) return;

        if (playingAudioId === noteId) {
            audioRef.current.pause();
            setPlayingAudioId(null);
        } else {
            try {
                // Stop any current playback
                audioRef.current.pause();

                // Set the source and load it
                audioRef.current.src = url;
                audioRef.current.load();

                // Start playback
                const playPromise = audioRef.current.play();

                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        setPlayingAudioId(noteId);
                    }).catch(error => {
                        console.error("Playback failed:", error);
                        setPlayingAudioId(null);
                    });
                }
            } catch (err) {
                console.error("Audio setup error:", err);
                setPlayingAudioId(null);
            }
        }
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            key="admin-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />

                        <motion.div
                            key="admin-modal"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-5xl h-[90vh] md:h-[85vh] bg-[#0d0d15] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                        >
                            {/* Header */}
                            <div className={`p-4 md:p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-blue-600/10 to-transparent ${isRtl ? 'flex-row-reverse' : ''}`}>
                                <div className={`flex items-center gap-3 md:gap-4 ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
                                    <div className="p-2 md:p-3 rounded-xl bg-blue-500/20 border border-blue-500/30">
                                        <Database className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <h2 className="font-orbitron text-xs sm:text-sm font-black tracking-[0.15em] text-white uppercase">{t('admin.title')}</h2>
                                        <div className={`flex items-center gap-1.5 mt-0.5 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                            <p className="font-rajdhani text-[8px] md:text-[9px] text-gray-400 uppercase tracking-widest font-bold">{t('admin.secure_archive')}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={`flex items-center gap-2 md:gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                    <button
                                        onClick={fetchNotes}
                                        className="p-2 hover:bg-white/5 rounded-lg transition-all text-gray-400 border border-transparent hover:border-white/10"
                                    >
                                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-white/5 rounded-lg transition-all text-gray-500 border border-transparent hover:border-white/10"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Table Header Filter / Sort Bar */}
                            <div className={`px-4 md:px-6 py-3 bg-white/[0.02] border-b border-white/5 flex ${isRtl ? 'justify-start' : 'justify-end'}`}>
                                <button
                                    onClick={toggleSort}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-orbitron text-[8px] md:text-[10px] text-gray-300 tracking-widest uppercase ${isRtl ? 'flex-row-reverse' : ''}`}
                                >
                                    <ArrowUpDown className="w-2.5 h-2.5 text-blue-400" />
                                    {sortOrder === 'asc' ? t('admin.oldest_first') : t('admin.newest_first')}
                                </button>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 overflow-auto p-4 md:p-6">
                                {isLoading && notes.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full gap-4">
                                        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                        <p className="font-orbitron text-[10px] text-gray-500 uppercase tracking-widest">{t('admin.accessing_stream')}</p>
                                    </div>
                                ) : notes.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-4">
                                        <MessageSquare className="w-10 h-10 opacity-20" />
                                        <p className="font-orbitron text-[10px] uppercase tracking-widest text-center">{t('admin.empty_archive')}</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Desktop View Table */}
                                        <div className="hidden md:block w-full align-middle">
                                            <table className="w-full border-separate border-spacing-y-2">
                                                <thead>
                                                    <tr className={`text-left font-orbitron text-[9px] text-gray-500 tracking-[0.2em] uppercase ${isRtl ? 'text-right' : ''}`}>
                                                        <th className="px-4 pb-2">{t('admin.identity')}</th>
                                                        <th className="px-4 pb-2">{t('admin.payload')}</th>
                                                        <th className="px-4 pb-2">{t('admin.transmission_response')}</th>
                                                        <th className="px-4 pb-2">{t('admin.audio')}</th>
                                                        <th className="px-4 pb-2">{t('admin.timestamp')}</th>
                                                        <th className={`px-4 pb-2 ${isRtl ? 'text-left' : 'text-right'}`}>{t('admin.delete')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {notes.map((note, index) => (
                                                        <motion.tr
                                                            key={`note-row-${note.id || index}`}
                                                            layout
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="group bg-white/5 hover:bg-white/[0.08] transition-all border border-white/10"
                                                        >
                                                            <td className={`px-4 py-4 border-y border-white/10 group-hover:border-blue-500/30 ${isRtl ? 'rounded-r-xl border-r text-right' : 'rounded-l-xl border-l'}`}>
                                                                <div className="flex flex-col">
                                                                    <div className={`flex items-center gap-2 mb-1 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                                                        <UserCircle className="w-3.5 h-3.5 text-blue-400/70" />
                                                                        <span className="font-rajdhani text-sm font-bold text-gray-200">
                                                                            {note.sender_name || t('admin.guest')}
                                                                        </span>
                                                                    </div>
                                                                    <span className="font-rajdhani text-[11px] text-gray-500 truncate max-w-[150px]">
                                                                        {note.user_email}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className={`px-4 py-4 border-y border-white/10 group-hover:border-blue-500/30 ${isRtl ? 'text-right' : ''}`}>
                                                                <p className="font-rajdhani text-sm text-gray-300 leading-relaxed italic line-clamp-2 max-w-md">
                                                                    "{note.content}"
                                                                </p>
                                                            </td>
                                                            <td className={`px-4 py-4 border-y border-white/10 group-hover:border-blue-500/30 ${isRtl ? 'text-right' : ''}`}>
                                                                {note.ai_comment ? (
                                                                    <p className="font-rajdhani text-sm text-blue-400 leading-relaxed italic line-clamp-2 max-w-md">
                                                                        "{note.ai_comment}"
                                                                    </p>
                                                                ) : (
                                                                    <span className="font-rajdhani text-[10px] text-gray-600 uppercase tracking-widest italic">{t('admin.no_response')}</span>
                                                                )}
                                                            </td>
                                                            <td className={`px-4 py-4 border-y border-white/10 group-hover:border-blue-500/30 ${isRtl ? 'text-right' : ''}`}>
                                                                {note.audio_url ? (
                                                                    <button
                                                                        onClick={() => toggleAudio(note.id, note.audio_url!)}
                                                                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all font-orbitron text-[9px] uppercase tracking-widest"
                                                                    >
                                                                        {playingAudioId === note.id ? <PauseCircle className="w-3.5 h-3.5" /> : <PlayCircle className="w-3.5 h-3.5" />}
                                                                        {playingAudioId === note.id ? 'PAUSE' : t('admin.play_audio')}
                                                                    </button>
                                                                ) : (
                                                                    <span className="font-rajdhani text-[10px] text-gray-600 uppercase tracking-widest italic">-</span>
                                                                )}
                                                            </td>
                                                            <td className={`px-4 py-4 border-y border-white/10 group-hover:border-blue-500/30 ${isRtl ? 'text-right' : ''}`}>
                                                                <div className={`flex flex-col font-rajdhani text-[11px] font-medium text-gray-500 uppercase tracking-tight ${isRtl ? 'items-end' : ''}`}>
                                                                    <div className={`flex items-center gap-1.5 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                                                        <Clock className="w-3 h-3" />
                                                                        {new Date(note.created_at).toLocaleDateString(i18n.language, { month: 'short', day: 'numeric' })}
                                                                    </div>
                                                                    <span className={`text-[10px] ${isRtl ? 'mr-0 ml-4.5' : 'ml-4.5'}`}>{new Date(note.created_at).toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })}</span>
                                                                </div>
                                                            </td>
                                                            <td className={`px-4 py-4 border-y border-white/10 group-hover:border-blue-500/30 ${isRtl ? 'rounded-l-xl border-l text-left' : 'rounded-r-xl border-r text-right'}`}>
                                                                <button
                                                                    onClick={() => setDeleteConfirmId(note.id)}
                                                                    className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </td>
                                                        </motion.tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Mobile View Cards */}
                                        <div className="md:hidden space-y-3 pb-6">
                                            {notes.map((note, index) => (
                                                <motion.div
                                                    key={`mobile-note-${note.id || index}`}
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3"
                                                >
                                                    <div className={`flex items-start justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
                                                        <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
                                                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                                                <UserCircle className="w-5 h-5 text-blue-400" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-rajdhani text-sm font-bold text-gray-200">
                                                                    {note.sender_name || t('admin.guest')}
                                                                </span>
                                                                <span className="font-rajdhani text-[10px] text-gray-500">
                                                                    {note.user_email}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => setDeleteConfirmId(note.id)}
                                                            className="p-2 text-gray-600 hover:text-red-500 bg-white/5 rounded-lg"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <div className={`bg-white/5 rounded-xl p-3 border border-white/5 font-rajdhani text-sm text-gray-300 italic ${isRtl ? 'text-right' : ''}`}>
                                                        "{note.content}"
                                                    </div>
                                                    {note.ai_comment && (
                                                        <div className={`bg-blue-500/5 rounded-xl p-3 border border-blue-500/10 font-rajdhani text-sm text-blue-400 italic ${isRtl ? 'text-right' : ''}`}>
                                                            "{note.ai_comment}"
                                                        </div>
                                                    )}
                                                    {note.audio_url && (
                                                        <button
                                                            onClick={() => toggleAudio(note.id, note.audio_url!)}
                                                            className={`flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 font-orbitron text-[10px] uppercase tracking-widest ${isRtl ? 'flex-row-reverse' : ''}`}
                                                        >
                                                            {playingAudioId === note.id ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                                                            {playingAudioId === note.id ? 'PAUSE' : t('admin.play_audio')}
                                                        </button>
                                                    )}
                                                    <div className="flex items-center justify-between font-rajdhani text-[10px] text-gray-500 uppercase tracking-widest pt-1">
                                                        <div className={`flex items-center gap-1.5 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(note.created_at).toLocaleString(i18n.language, { dateStyle: 'short', timeStyle: 'short' })}
                                                        </div>
                                                        <span className="text-blue-500/40 font-orbitron text-[8px]">{t('admin.note_encrypted')}</span>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Compact Footer */}
                            <div className={`p-3 md:p-4 border-t border-white/5 bg-black/40 flex justify-between items-center px-6 md:px-8 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                <span className="font-orbitron text-[8px] text-gray-600 uppercase tracking-[0.2em]">
                                    {notes.length} {t('admin.fragments_detected')}
                                </span>
                                <div className={`flex items-center gap-1.5 text-blue-500/30 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                    <span className="font-orbitron text-[8px] uppercase tracking-[0.1em]">{t('admin.secure_access')}</span>
                                    <ChevronRight className={`w-3 h-3 ${isRtl ? 'rotate-180' : ''}`} />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Popup */}
            <AnimatePresence>
                {deleteConfirmId && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            key="delete-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setDeleteConfirmId(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            key="delete-modal"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-sm bg-[#0d0d15] border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl rounded-full -mr-16 -mt-16" />

                            <div className="flex flex-col items-center text-center gap-6 relative z-10">
                                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                                    <AlertTriangle className="w-8 h-8 text-red-500" />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="font-orbitron text-sm font-black text-white uppercase tracking-[0.2em]">
                                        {t('admin.purge_fragment')}
                                    </h3>
                                    <p className="font-rajdhani text-sm text-gray-400 leading-relaxed">
                                        {t('admin.purge_description')}
                                    </p>
                                </div>

                                <div className={`flex gap-3 w-full ${isRtl ? 'flex-row-reverse' : ''}`}>
                                    <button
                                        onClick={() => setDeleteConfirmId(null)}
                                        className="flex-1 py-3.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-orbitron text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all active:scale-[0.98]"
                                    >
                                        {t('admin.cancel')}
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (deleteConfirmId) {
                                                deleteNote(deleteConfirmId);
                                                setDeleteConfirmId(null);
                                            }
                                        }}
                                        className="flex-1 py-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 font-orbitron text-[10px] uppercase tracking-[0.2em] font-black hover:bg-red-500 hover:text-white transition-all shadow-[0_0_20px_-5px_rgba(239,68,68,0.4)] active:scale-[0.98]"
                                    >
                                        {t('admin.delete')}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Hidden Audio Player */}
            <audio
                ref={audioRef}
                onEnded={() => setPlayingAudioId(null)}
                className="hidden"
            />
        </>
    );
};
