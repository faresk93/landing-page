import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Database, UserCircle, Clock, Trash2, X, RefreshCw,
    ChevronRight, ArrowUpDown, MessageSquare
} from 'lucide-react';
import { supabase } from '../services/supabase';

interface Note {
    id: string;
    created_at: string;
    content: string;
    user_email: string;
    sender_name: string;
}

interface AdminDashboardProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-6xl h-[85vh] bg-[#0d0d15] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-blue-600/10 to-transparent">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                    <Database className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="font-orbitron text-lg font-black tracking-[0.2em] text-white uppercase">Fares's Neural Notes</h2>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <p className="font-rajdhani text-[10px] text-gray-400 uppercase tracking-widest font-bold">Encrypted Archive Access</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={fetchNotes}
                                    className="p-2.5 hover:bg-white/5 rounded-xl transition-all text-gray-400 border border-transparent hover:border-white/10"
                                >
                                    <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-2.5 hover:bg-white/5 rounded-xl transition-all text-gray-500 border border-transparent hover:border-white/10"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Table Header Filter / Sort Bar */}
                        <div className="px-6 py-4 bg-white/[0.02] border-b border-white/5 flex justify-end">
                            <button
                                onClick={toggleSort}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-orbitron text-[10px] text-gray-300 tracking-widest uppercase"
                            >
                                <ArrowUpDown className="w-3 h-3 text-blue-400" />
                                Sort By Date: {sortOrder === 'asc' ? 'Oldest' : 'Newest'}
                            </button>
                        </div>

                        {/* Content - Data Table */}
                        <div className="flex-1 overflow-auto p-6">
                            {isLoading && notes.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full gap-4">
                                    <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                    <p className="font-orbitron text-xs text-gray-500 uppercase tracking-widest">Deciphering database stream...</p>
                                </div>
                            ) : notes.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-4">
                                    <MessageSquare className="w-12 h-12 opacity-20" />
                                    <p className="font-orbitron text-xs uppercase tracking-widest text-center">No neural transmissions captured yet.</p>
                                </div>
                            ) : (
                                <div className="w-full inline-block align-middle">
                                    <table className="w-full border-separate border-spacing-y-3">
                                        <thead>
                                            <tr className="text-left font-orbitron text-[10px] text-gray-500 tracking-[0.2em] uppercase">
                                                <th className="px-6 pb-2">Sender Name</th>
                                                <th className="px-6 pb-2">Email</th>
                                                <th className="px-6 pb-2">Message Payload</th>
                                                <th className="px-6 pb-2">Time Captured</th>
                                                <th className="px-6 pb-2 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {notes.map((note) => (
                                                <motion.tr
                                                    key={note.id}
                                                    layout
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="group bg-white/5 hover:bg-white/[0.08] transition-all border border-white/10"
                                                >
                                                    <td className="px-6 py-5 rounded-l-2xl border-y border-l border-white/10 group-hover:border-blue-500/30">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                                                <UserCircle className="w-4 h-4 text-blue-400" />
                                                            </div>
                                                            <span className="font-rajdhani text-sm font-bold text-gray-200 whitespace-nowrap">
                                                                {note.sender_name || 'Guest'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 border-y border-white/10 group-hover:border-blue-500/30">
                                                        <span className="font-rajdhani text-sm text-gray-400">
                                                            {note.user_email}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 border-y border-white/10 group-hover:border-blue-500/30 min-w-[300px]">
                                                        <p className="font-rajdhani text-sm text-gray-300 leading-relaxed italic">
                                                            "{note.content}"
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-5 border-y border-white/10 group-hover:border-blue-500/30 whitespace-nowrap">
                                                        <div className="flex items-center gap-2 font-rajdhani text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(note.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 rounded-r-2xl border-y border-r border-white/10 group-hover:border-blue-500/30 text-right">
                                                        <button
                                                            onClick={() => deleteNote(note.id)}
                                                            className="p-2.5 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
                                                            title="Delete Note"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-5 border-t border-white/5 bg-black/40 flex justify-between items-center px-8">
                            <span className="font-orbitron text-[9px] text-gray-600 uppercase tracking-[0.3em]">
                                Live Stream: {notes.length} Fragments Detected
                            </span>
                            <div className="flex items-center gap-2 text-blue-500/50">
                                <span className="font-orbitron text-[9px] uppercase tracking-[0.2em]">Neural Encryption Level 4 ACTIVE</span>
                                <ChevronRight className="w-3 h-3" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
