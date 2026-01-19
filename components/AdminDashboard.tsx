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
                        className="relative w-full max-w-5xl h-[90vh] md:h-[85vh] bg-[#0d0d15] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 md:p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-blue-600/10 to-transparent">
                            <div className="flex items-center gap-3 md:gap-4">
                                <div className="p-2 md:p-3 rounded-xl bg-blue-500/20 border border-blue-500/30">
                                    <Database className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="font-orbitron text-xs sm:text-sm font-black tracking-[0.15em] text-white uppercase">Fares's Neural Notes</h2>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <p className="font-rajdhani text-[8px] md:text-[9px] text-gray-400 uppercase tracking-widest font-bold">Secure Archive</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 md:gap-4">
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
                        <div className="px-4 md:px-6 py-3 bg-white/[0.02] border-b border-white/5 flex justify-end">
                            <button
                                onClick={toggleSort}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-orbitron text-[8px] md:text-[10px] text-gray-300 tracking-widest uppercase"
                            >
                                <ArrowUpDown className="w-2.5 h-2.5 text-blue-400" />
                                {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-auto p-4 md:p-6">
                            {isLoading && notes.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full gap-4">
                                    <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                    <p className="font-orbitron text-[10px] text-gray-500 uppercase tracking-widest">Accessing stream...</p>
                                </div>
                            ) : notes.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-4">
                                    <MessageSquare className="w-10 h-10 opacity-20" />
                                    <p className="font-orbitron text-[10px] uppercase tracking-widest text-center">Empty Archive</p>
                                </div>
                            ) : (
                                <>
                                    {/* Desktop View Table */}
                                    <div className="hidden md:block w-full align-middle">
                                        <table className="w-full border-separate border-spacing-y-2">
                                            <thead>
                                                <tr className="text-left font-orbitron text-[9px] text-gray-500 tracking-[0.2em] uppercase">
                                                    <th className="px-4 pb-2">Identity</th>
                                                    <th className="px-4 pb-2">Payload</th>
                                                    <th className="px-4 pb-2">Timestamp</th>
                                                    <th className="px-4 pb-2 text-right">Delete</th>
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
                                                        <td className="px-4 py-4 rounded-l-xl border-y border-l border-white/10 group-hover:border-blue-500/30">
                                                            <div className="flex flex-col">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <UserCircle className="w-3.5 h-3.5 text-blue-400/70" />
                                                                    <span className="font-rajdhani text-sm font-bold text-gray-200">
                                                                        {note.sender_name || 'Guest'}
                                                                    </span>
                                                                </div>
                                                                <span className="font-rajdhani text-[11px] text-gray-500 truncate max-w-[150px]">
                                                                    {note.user_email}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 border-y border-white/10 group-hover:border-blue-500/30">
                                                            <p className="font-rajdhani text-sm text-gray-300 leading-relaxed italic line-clamp-2 max-w-md">
                                                                "{note.content}"
                                                            </p>
                                                        </td>
                                                        <td className="px-4 py-4 border-y border-white/10 group-hover:border-blue-500/30">
                                                            <div className="flex flex-col font-rajdhani text-[11px] font-medium text-gray-500 uppercase tracking-tight">
                                                                <div className="flex items-center gap-1.5">
                                                                    <Clock className="w-3 h-3" />
                                                                    {new Date(note.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                                </div>
                                                                <span className="text-[10px] ml-4.5">{new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 rounded-r-xl border-y border-r border-white/10 group-hover:border-blue-500/30 text-right">
                                                            <button
                                                                onClick={() => deleteNote(note.id)}
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
                                        {notes.map((note) => (
                                            <motion.div
                                                key={note.id}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                                            <UserCircle className="w-5 h-5 text-blue-400" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-rajdhani text-sm font-bold text-gray-200">
                                                                {note.sender_name || 'Guest'}
                                                            </span>
                                                            <span className="font-rajdhani text-[10px] text-gray-500">
                                                                {note.user_email}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => deleteNote(note.id)}
                                                        className="p-2 text-gray-600 hover:text-red-500 bg-white/5 rounded-lg"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="bg-white/5 rounded-xl p-3 border border-white/5 font-rajdhani text-sm text-gray-300 italic">
                                                    "{note.content}"
                                                </div>
                                                <div className="flex items-center justify-between font-rajdhani text-[10px] text-gray-500 uppercase tracking-widest pt-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(note.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                                    </div>
                                                    <span className="text-blue-500/40 font-orbitron text-[8px]">Note Encrypted</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Compact Footer */}
                        <div className="p-3 md:p-4 border-t border-white/5 bg-black/40 flex justify-between items-center px-6 md:px-8">
                            <span className="font-orbitron text-[8px] text-gray-600 uppercase tracking-[0.2em]">
                                {notes.length} Fragments Detected
                            </span>
                            <div className="flex items-center gap-1.5 text-blue-500/30">
                                <span className="font-orbitron text-[8px] uppercase tracking-[0.1em]">SECURE ACCESS</span>
                                <ChevronRight className="w-3 h-3" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
