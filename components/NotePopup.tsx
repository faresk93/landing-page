import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, ShieldCheck, Sparkles, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '../services/supabase';
import { sanitizeInput, checkRateLimit } from '../utils/security';
import { NOTES_WEBHOOK_URL } from '../constants';

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
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [rateLimited, setRateLimited] = useState(false);
    const [webhookResponse, setWebhookResponse] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const isValid = note.trim().length >= 3 && (userId ? true : (isAnonymous || name.trim().length > 0));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;

        // Check rate limit: Max 5 notes per 10 minutes
        if (!checkRateLimit('notes_submission', 5, 10 * 60 * 1000)) {
            setRateLimited(true);
            setIsSending(false);
            setTimeout(() => setRateLimited(false), 5000);
            return;
        }

        setIsSending(true);

        // Sanitize inputs
        const sanitizedNote = sanitizeInput(note);
        const sanitizedName = userId ? userName : (isAnonymous ? 'anonymous' : sanitizeInput(name));
        const finalEmail = userEmail || (isAnonymous ? 'anonymous@hidden.com' : 'Guest');

        const { error } = await supabase.from('notes').insert([
            {
                user_id: userId || null,
                content: sanitizedNote,
                user_email: finalEmail,
                sender_name: sanitizedName
            },
        ]);

        if (!error) {
            console.log('Supabase insert successful');
            let responseMsg = '';
            let webhookSuccess = true;

            console.log('NOTES_WEBHOOK_URL value:', NOTES_WEBHOOK_URL);

            // Second step: Call n8n webhook in succession
            if (NOTES_WEBHOOK_URL) {
                try {
                    const url = new URL(NOTES_WEBHOOK_URL);
                    url.searchParams.append('note', sanitizedNote);
                    url.searchParams.append('sender', sanitizedName);
                    url.searchParams.append('email', finalEmail);
                    url.searchParams.append('isAnonymous', String(isAnonymous));

                    if (import.meta.env.DEV) console.log('Attempting webhook call to:', url.toString());
                    const response = await fetch(url.toString());
                    if (response.ok) {
                        try {
                            const data = await response.json();
                            responseMsg = data.message || data.output || data.comment || '';
                        } catch (e) {
                            console.warn('Could not parse webhook JSON response');
                        }
                    } else {
                        console.error('Webhook response not OK:', response.status, response.statusText);
                        webhookSuccess = false;
                    }
                } catch (webhookErr) {
                    console.error('Webhook error:', webhookErr);
                    webhookSuccess = false;
                }
            } else {
                console.warn('NOTES_WEBHOOK_URL is missing or empty. Skipping webhook call.');
            }

            if (webhookSuccess) {
                setIsSending(false);
                setIsSent(true);
                setWebhookResponse(responseMsg);
                setNote('');
                setName('');
                setIsAnonymous(false);

                // Wait longer if there's a webhook response to allow reading it
                const displayDuration = responseMsg ? 6000 : 3000;

                setTimeout(() => {
                    setIsSent(false);
                    setWebhookResponse('');
                    onClose();
                }, displayDuration);
            } else {
                setIsSending(false);
                setErrorMsg("Neural link disrupted. Your note couldn't be transmitted to Fares's digital mind right now.");
                setTimeout(() => setErrorMsg(''), 5000);
            }
        } else {
            setIsSending(false);
            setErrorMsg("Archive connection failed. Your note couldn't be stored in Fares's database.");
            console.error('Error sending note:', error.message);
            setTimeout(() => setErrorMsg(''), 5000);
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
                            {isSending ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center py-20 gap-6"
                                >
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-neonPurple/20 blur-2xl rounded-full animate-pulse" />
                                        <Loader2 className="w-12 h-12 text-neonPurple animate-spin relative z-10" />
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <p className="font-orbitron text-[10px] font-bold text-white tracking-[0.3em] uppercase animate-pulse">
                                            Initializing Neural Transfer
                                        </p>
                                        <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-neonPurple/50 to-transparent" />
                                    </div>
                                </motion.div>
                            ) : isSent ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center py-10 gap-6"
                                >
                                    <motion.div
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                        className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500/30 flex items-center justify-center shadow-[0_0_30px_-5px_rgba(34,197,94,0.4)]"
                                    >
                                        <CheckCircle className="w-10 h-10 text-green-400" />
                                    </motion.div>

                                    <div className="text-center space-y-2">
                                        <p className="font-orbitron text-sm font-black text-green-400 tracking-[0.2em] uppercase">
                                            Note Transmitted to Fares
                                        </p>
                                        <p className="font-rajdhani text-[10px] text-gray-500 uppercase tracking-widest">
                                            Handshake Confirmed • Data Encrypted
                                        </p>
                                    </div>

                                    {webhookResponse && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                            className="w-full mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group"
                                        >
                                            <div className="absolute top-0 left-0 w-1 h-full bg-green-500/50" />
                                            <p className="font-rajdhani text-sm text-gray-300 leading-relaxed italic text-center">
                                                "{webhookResponse}"
                                            </p>
                                            <div className="mt-2 flex justify-center">
                                                <Sparkles className="w-3 h-3 text-green-500/40" />
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {!userId && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl hover:border-neonPurple/30 transition-all cursor-pointer group/anon" onClick={() => setIsAnonymous(!isAnonymous)}>
                                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isAnonymous ? 'bg-neonPurple border-neonPurple' : 'border-white/20'}`}>
                                                    {isAnonymous && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                                                </div>
                                                <span className="font-orbitron text-[10px] text-gray-400 uppercase tracking-widest group-hover/anon:text-neonPurple transition-colors">
                                                    Send Anonymously
                                                </span>
                                            </div>

                                            <AnimatePresence>
                                                {!isAnonymous && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="space-y-2 overflow-hidden"
                                                    >
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
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
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

                                    {rateLimited && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
                                        >
                                            <AlertCircle className="w-4 h-4 text-red-400" />
                                            <p className="font-rajdhani text-[10px] text-red-400 uppercase tracking-widest">
                                                Slow down! Too many neural transmissions for Fares. Please wait a moment.
                                            </p>
                                        </motion.div>
                                    )}

                                    {errorMsg && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl"
                                        >
                                            <div className="p-1.5 rounded-lg bg-red-500/20">
                                                <AlertCircle className="w-4 h-4 text-red-500" />
                                            </div>
                                            <p className="font-rajdhani text-sm text-red-400 leading-tight">
                                                {errorMsg}
                                            </p>
                                        </motion.div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSending || !isValid || rateLimited}
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
