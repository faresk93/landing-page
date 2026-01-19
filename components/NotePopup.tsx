import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, ShieldCheck, Sparkles } from 'lucide-react';
import { supabase } from '../services/supabase';

interface NotePopupProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string | undefined;
    userEmail: string | undefined;
    userName: string | undefined;
}

export const NotePopup: React.FC<NotePopupProps> = ({ isOpen, onClose, userId, userEmail, userName }) => {
    const [note, setNote] = useState('');
    const [name, setName] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const isValid = note.trim().length >= 3 && (userId ? true : name.trim().length > 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;

        setIsSending(true);
        const { error } = await supabase.from('notes').insert([
            {
                user_id: userId || null,
                content: note.trim(),
                user_email: userEmail || 'Guest',
                sender_name: userName || name.trim()
            },
        ]);

        setIsSending(false);
        if (!error) {
            setIsSent(true);
            setNote('');
            setName('');
            setTimeout(() => {
                setIsSent(false);
                onClose();
            }, 2000);
        } else {
            console.error('Error sending note:', error.message);
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
                        className="relative w-full max-w-lg bg-[#0d0d15] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-neonPurple/10 to-transparent">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-neonPurple/20 border border-neonPurple/30">
                                    <ShieldCheck className="w-5 h-5 text-neonPurple" />
                                </div>
                                <div>
                                    <h3 className="font-orbitron text-sm font-bold tracking-widest text-white uppercase">Direct Link to Fares</h3>
                                    <p className="font-rajdhani text-[10px] text-gray-400 uppercase tracking-wider">Secure Neural Transmission</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {isSent ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center py-10 gap-4"
                                >
                                    <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                                        <Sparkles className="w-8 h-8 text-green-400" />
                                    </div>
                                    <p className="font-orbitron text-sm font-bold text-green-400 tracking-widest uppercase text-center">
                                        Note Transmitted Successfully
                                    </p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {!userId && (
                                        <div className="space-y-2">
                                            <label className="font-orbitron text-[10px] text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                                                Name (Necessary)
                                            </label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Enter your name"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 font-rajdhani text-white placeholder:text-gray-600 focus:outline-none focus:border-neonPurple/50 transition-all text-sm"
                                                disabled={isSending}
                                            />
                                        </div>
                                    )}
                                    <div className="relative group">
                                        <label className="font-orbitron text-[10px] text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1 mb-2">
                                            Your Message <span className="text-red-500/50 text-[8px]">* Min 3 chars</span>
                                        </label>
                                        <textarea
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                            placeholder="Type your message for Fares here..."
                                            className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-4 font-rajdhani text-white placeholder:text-gray-600 focus:outline-none focus:border-neonPurple/50 transition-all resize-none"
                                            disabled={isSending}
                                        />
                                        <div className="absolute bottom-4 right-4 text-[10px] font-orbitron text-gray-600 uppercase tracking-widest">
                                            {note.length} chars
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSending || !isValid}
                                        className="w-full py-4 rounded-xl bg-gradient-to-r from-neonPurple/80 to-blue-600/80 text-white font-orbitron text-xs font-black tracking-[0.3em] uppercase hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 disabled:hover:scale-100 flex items-center justify-center gap-3 group"
                                    >
                                        {isSending ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                Transmit to Fares
                                                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            </>
                                        )}
                                    </button>

                                    <p className="text-center font-rajdhani text-[10px] text-gray-500 uppercase tracking-widest">
                                        Only Fares can decrypt and read this message.
                                    </p>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
