import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, ShieldCheck, Sparkles, AlertCircle, CheckCircle, Loader2, Mic, Square, Play, Trash2 } from 'lucide-react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
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
    const { t, i18n } = useTranslation();
    const [note, setNote] = useState('');
    const [name, setName] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [rateLimited, setRateLimited] = useState(false);
    const [webhookResponse, setWebhookResponse] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isVocal, setIsVocal] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const previewAudioRef = useRef<HTMLAudioElement | null>(null);
    const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const isValid = (note.trim().length >= 3 || audioBlob !== null) && (userId ? true : (isAnonymous || name.trim().length > 0));

    const startRecording = async () => {
        try {
            // Check for supported mime types in order of preference
            // Specifically prioritize Safari/iOS compatible formats first if possible
            const mimeTypes = [
                'audio/mp4',
                'audio/aac',
                'audio/webm;codecs=opus',
                'audio/webm',
                'audio/ogg;codecs=opus'
            ];

            const mimeType = mimeTypes.find(type => MediaRecorder.isTypeSupported(type)) || 'audio/webm';
            if (import.meta.env.DEV) console.log('Selected MIME type:', mimeType);

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType,
                audioBitsPerSecond: 128000
            });
            mediaRecorderRef.current = mediaRecorder;
            const chunks: Blob[] = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: mimeType });
                if (import.meta.env.DEV) console.log('Recording stopped. Blob size:', blob.size, 'type:', blob.type);

                if (blob.size === 0) {
                    console.error('Recording resulted in an empty blob.');
                    return;
                }

                setAudioBlob(blob);
                const url = URL.createObjectURL(blob);
                setAudioPreviewUrl(url);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start(100); // Collect data in 100ms chunks for better reliability
            setIsRecording(true);
            setRecordingTime(0);
            if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
            recordingIntervalRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } catch (err) {
            console.error('Error accessing microphone:', err);
            setErrorMsg(t('notes.error_recording'));
            setTimeout(() => setErrorMsg(''), 5000);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (recordingIntervalRef.current) {
                clearInterval(recordingIntervalRef.current);
            }
        }
    };

    const handleDeleteAudio = () => {
        if (previewAudioRef.current) {
            previewAudioRef.current.pause();
            previewAudioRef.current.src = "";
        }
        setIsPreviewPlaying(false);
        setAudioBlob(null);
        if (audioPreviewUrl) {
            URL.revokeObjectURL(audioPreviewUrl);
            setAudioPreviewUrl(null);
        }
        setRecordingTime(0);
    };

    const togglePreviewPlayback = () => {
        if (!previewAudioRef.current) return;

        if (isPreviewPlaying) {
            previewAudioRef.current.pause();
            setIsPreviewPlaying(false);
        } else {
            previewAudioRef.current.play();
            setIsPreviewPlaying(true);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Sync audio preview source when URL changes
    React.useEffect(() => {
        if (previewAudioRef.current && audioPreviewUrl) {
            previewAudioRef.current.src = audioPreviewUrl;
            previewAudioRef.current.load();
        }
    }, [audioPreviewUrl]);


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

        let audioUrl = '';

        // Step 0: Upload audio if exists
        if (audioBlob) {
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webm`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('vocal-notes')
                .upload(fileName, audioBlob);

            if (uploadError) {
                console.error('Error uploading audio:', uploadError);
                setIsSending(false);
                setErrorMsg(t('notes.error_archive'));
                return;
            }

            const { data: publicUrlData } = supabase.storage
                .from('vocal-notes')
                .getPublicUrl(fileName);

            audioUrl = publicUrlData.publicUrl;
        }

        let responseMsg = '';
        let webhookSuccess = true;

        // Step 1: Call n8n webhook IN ADVANCE to get the response/comment
        if (NOTES_WEBHOOK_URL) {
            try {
                if (import.meta.env.DEV) console.log('Attempting POST webhook call to:', NOTES_WEBHOOK_URL);

                const formData = new FormData();
                formData.append('note', sanitizedNote);
                formData.append('sender', sanitizedName);
                formData.append('email', finalEmail);
                formData.append('isAnonymous', String(isAnonymous));
                formData.append('type', audioBlob ? 'vocal' : 'text');
                formData.append('timestamp', new Date().toISOString());

                if (audioBlob) {
                    formData.append('audioFile', audioBlob, `vocal-note-${Date.now()}.webm`);
                }
                if (audioUrl) {
                    formData.append('audioUrl', audioUrl);
                }

                const response = await fetch(NOTES_WEBHOOK_URL, {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    try {
                        const data = await response.json();
                        // Support various response formats from n8n/other webhooks
                        responseMsg = data.message || data.output || data.comment || data.response || '';
                    } catch (e) {
                        // Fallback if not JSON
                        const text = await response.text();
                        responseMsg = text || '';
                    }
                } else {
                    console.error('Webhook response not OK:', response.status);
                    webhookSuccess = false;
                }
            } catch (webhookErr) {
                console.error('Webhook error:', webhookErr);
                webhookSuccess = false;
            }
        }
        else {
            console.warn('NOTES_WEBHOOK_URL is missing or empty. Proceeding without webhook.');
        }

        if (!webhookSuccess) {
            setIsSending(false);
            setErrorMsg(t('notes.error_disrupted'));
            setTimeout(() => setErrorMsg(''), 5000);
            return;
        }

        // Step 2: Save to Supabase (now including the comment received from the webhook)
        const { error } = await supabase.from('notes').insert([
            {
                user_id: userId || null,
                content: sanitizedNote,
                user_email: finalEmail,
                sender_name: sanitizedName,
                ai_comment: responseMsg,
                audio_url: audioUrl || null
            },
        ]);

        if (!error) {
            console.log('Supabase insert successful');
            setIsSending(false);
            setIsSent(true);
            setWebhookResponse(responseMsg);
            setNote('');
            setName('');
            setIsAnonymous(false);
            handleDeleteAudio();
            setIsVocal(false);

            // Wait longer if there's a webhook response to allow reading it
            const displayDuration = responseMsg ? 6000 : 3000;

            setTimeout(() => {
                setIsSent(false);
                setWebhookResponse('');
                onClose();
            }, displayDuration);
        } else {
            setIsSending(false);
            setErrorMsg(t('notes.error_archive'));
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
                        <div className={`p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-neonPurple/10 to-transparent ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}>
                            <div className={`flex items-center gap-3 ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}>
                                <div className="p-2 rounded-xl bg-neonPurple/20 border border-neonPurple/30">
                                    <ShieldCheck className="w-5 h-5 text-neonPurple" />
                                </div>
                                <div className={i18n.language === 'ar' ? 'text-right' : ''}>
                                    <h3 className="font-orbitron text-sm font-bold tracking-widest text-white uppercase">{t('notes.title')}</h3>
                                    <p className="font-rajdhani text-[10px] text-gray-400 uppercase tracking-wider">{t('notes.subtitle')}</p>
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
                                    key="sending-state"
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
                                            {t('notes.initializing')}
                                        </p>
                                        <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-neonPurple/50 to-transparent" />
                                    </div>
                                </motion.div>
                            ) : isSent ? (
                                <motion.div
                                    key="success-sent"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center py-10 gap-6"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                        className="relative"
                                    >
                                        {/* Wave animations */}
                                        {[...Array(3)].map((_, i) => (
                                            <motion.div
                                                key={`success-wave-${i}`}
                                                initial={{ scale: 1, opacity: 0.5 }}
                                                animate={{ scale: 2, opacity: 0 }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    delay: i * 0.6,
                                                    ease: "easeOut"
                                                }}
                                                className="absolute inset-0 rounded-full bg-neonPurple/20 border border-neonPurple/50"
                                            />
                                        ))}

                                        <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-neonPurple/20 to-neonBlue/20 border-2 border-neonPurple/30 flex items-center justify-center shadow-[0_0_40px_-5px_rgba(188,19,254,0.5)] z-10">
                                            <motion.div
                                                animate={{
                                                    scale: [1, 1.1, 1],
                                                    rotate: [0, 5, -5, 0]
                                                }}
                                                transition={{ duration: 4, repeat: Infinity }}
                                            >
                                                <Mic className="w-12 h-12 text-neonPurple" />
                                            </motion.div>

                                            <motion.div
                                                className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-[#0d0d15]"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.3 }}
                                            >
                                                <CheckCircle className="w-4 h-4 text-white" />
                                            </motion.div>
                                        </div>
                                    </motion.div>

                                    <div className="text-center space-y-2 z-20">
                                        <p className="font-orbitron text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-neonPurple to-neonBlue tracking-[0.3em] uppercase">
                                            {t('notes.transmitted')}
                                        </p>
                                        <p className="font-rajdhani text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                                            {t('notes.confirmed')}
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
                                <motion.div key="main-form-wrapper" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-4">
                                            {/* Top Row: Anonymous & Vocal Note Toggles */}
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                {!userId && (
                                                    <div className={`flex-1 flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl hover:border-neonPurple/30 transition-all cursor-pointer group/anon ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`} onClick={() => setIsAnonymous(!isAnonymous)}>
                                                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isAnonymous ? 'bg-neonPurple border-neonPurple' : 'border-white/20'}`}>
                                                            {isAnonymous && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                                                        </div>
                                                        <span className="font-orbitron text-[10px] text-gray-400 uppercase tracking-widest group-hover/anon:text-neonPurple transition-colors">
                                                            {t('notes.send_anonymously')}
                                                        </span>
                                                    </div>
                                                )}

                                                <div className={`flex-1 flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl hover:border-neonPurple/30 transition-all cursor-pointer group/vocal ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`} onClick={() => setIsVocal(!isVocal)}>
                                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isVocal ? 'bg-neonPurple border-neonPurple' : 'border-white/20'}`}>
                                                        {isVocal && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                                                    </div>
                                                    <div className={`flex items-center gap-2 ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}>
                                                        <Mic className={`w-4 h-4 ${isVocal ? 'text-neonPurple' : 'text-gray-400'}`} />
                                                        <span className="font-orbitron text-[10px] text-gray-400 uppercase tracking-widest group-hover/vocal:text-neonPurple transition-colors">
                                                            {t('notes.vocal_note')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {!userId && (
                                                <AnimatePresence>
                                                    {!isAnonymous && (
                                                        <motion.div
                                                            key="name-input-field"
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="space-y-2 overflow-hidden"
                                                        >
                                                            <label className={`font-orbitron text-[10px] text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1 ${i18n.language === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
                                                                {t('notes.name_label')}
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="sender_name"
                                                                autoComplete="name"
                                                                value={name}
                                                                onChange={(e) => setName(e.target.value)}
                                                                placeholder={t('notes.name_placeholder')}
                                                                className={`w-full bg-white/5 border border-white/10 rounded-xl p-3 font-rajdhani text-white placeholder:text-gray-600 focus:outline-none focus:border-neonPurple/50 transition-all text-sm ${i18n.language === 'ar' ? 'text-right' : ''}`}
                                                                disabled={isSending}
                                                            />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            )}
                                        </div>
                                        <div className="relative group">
                                            <label className={`font-orbitron text-[10px] text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1 mb-2 ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}>
                                                {t('notes.message_label')} <span className="text-red-500/50 text-[8px]">* {!isVocal && t('notes.min_chars')}</span>
                                            </label>

                                            <AnimatePresence mode="wait">
                                                {isVocal ? (
                                                    <motion.div
                                                        key="vocal-recording"
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                        className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-4 relative overflow-hidden"
                                                    >
                                                        {/* Recording Background Animation */}
                                                        {isRecording && (
                                                            <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-20 pointer-events-none">
                                                                {[...Array(20)].map((_, i) => (
                                                                    <motion.div
                                                                        key={`wave-dot-${i}`}
                                                                        animate={{ height: [10, 40, 10] }}
                                                                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.05 }}
                                                                        className="w-1 bg-neonPurple rounded-full"
                                                                    />
                                                                ))}
                                                            </div>
                                                        )}

                                                        {audioBlob ? (
                                                            <div className="flex flex-col items-center gap-4 w-full px-6">
                                                                <div className="flex items-center gap-4 w-full justify-center">
                                                                    <motion.button
                                                                        type="button"
                                                                        whileHover={{ scale: 1.1 }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                        onClick={togglePreviewPlayback}
                                                                        className="w-12 h-12 rounded-full bg-neonPurple/20 border-2 border-neonPurple/50 flex items-center justify-center hover:bg-neonPurple/30 transition-all group/play shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                                                                    >
                                                                        {isPreviewPlaying ? (
                                                                            <Square className="w-5 h-5 text-neonPurple" />
                                                                        ) : (
                                                                            <Play className="w-5 h-5 text-neonPurple ml-1" />
                                                                        )}
                                                                    </motion.button>
                                                                    <motion.button
                                                                        type="button"
                                                                        whileHover={{ scale: 1.1 }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                        onClick={handleDeleteAudio}
                                                                        className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors border border-red-500/20"
                                                                    >
                                                                        <Trash2 className="w-5 h-5" />
                                                                    </motion.button>
                                                                    <audio
                                                                        ref={previewAudioRef}
                                                                        onEnded={() => setIsPreviewPlaying(false)}
                                                                        onTimeUpdate={(e) => {
                                                                            const audio = e.currentTarget;
                                                                            // Use recordingTime as fallback if duration is NaN (common in WebM blobs)
                                                                            const durationFallback = (audio.duration && !isNaN(audio.duration)) ? audio.duration : (recordingTime > 0 ? recordingTime : 0);

                                                                            // If currentTime exceeds expected length, force stop
                                                                            if (durationFallback > 0 && audio.currentTime >= durationFallback && isPreviewPlaying) {
                                                                                setIsPreviewPlaying(false);
                                                                                audio.pause();
                                                                                audio.currentTime = 0;
                                                                            }
                                                                        }}
                                                                        onPlay={() => console.log('Audio started playing')}
                                                                        onError={(e) => console.error('Audio preview playback error:', e)}
                                                                        className="hidden"
                                                                    />
                                                                </div>
                                                                <div className="text-center">
                                                                    <p className="font-orbitron text-[10px] text-gray-400 uppercase tracking-widest">
                                                                        {isPreviewPlaying ? t('notes.playing') || 'Playing Preview' : t('notes.play_preview')}
                                                                    </p>
                                                                    <p className="font-rajdhani text-[12px] text-neonPurple font-bold mt-1">
                                                                        {formatTime(recordingTime)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-center gap-4 z-10">
                                                                <div className="flex items-center gap-6 relative">
                                                                    {/* Purple Fog / Glow Effect */}
                                                                    <AnimatePresence>
                                                                        {isRecording && (
                                                                            <motion.div
                                                                                key="purple-fog"
                                                                                initial={{ opacity: 0, scale: 0.8 }}
                                                                                animate={{ opacity: 1, scale: 1.5 }}
                                                                                exit={{ opacity: 0, scale: 0.8 }}
                                                                                className="absolute inset-0 bg-neonPurple/30 blur-3xl rounded-full -z-10"
                                                                            />
                                                                        )}
                                                                    </AnimatePresence>

                                                                    <motion.button
                                                                        type="button"
                                                                        onMouseDown={startRecording}
                                                                        onMouseUp={stopRecording}
                                                                        onMouseLeave={isRecording ? stopRecording : undefined}
                                                                        onTouchStart={(e) => { e.preventDefault(); startRecording(); }}
                                                                        onTouchEnd={(e) => { e.preventDefault(); stopRecording(); }}
                                                                        whileTap={{ scale: 0.85, boxShadow: "0 0 30px rgba(168, 85, 247, 0.4)" }}
                                                                        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${isRecording
                                                                            ? 'bg-red-500/20 border-4 border-red-500/50 scale-110 shadow-[0_0_50px_rgba(239,68,68,0.3)]'
                                                                            : 'bg-neonPurple/20 border-4 border-neonPurple/50 hover:bg-neonPurple/30'
                                                                            }`}
                                                                    >
                                                                        {isRecording ? (
                                                                            <Square className="w-8 h-8 text-red-500 animate-pulse" />
                                                                        ) : (
                                                                            <Mic className="w-8 h-8 text-neonPurple" />
                                                                        )}
                                                                    </motion.button>
                                                                </div>
                                                                <div className="text-center">
                                                                    <p className={`font-orbitron text-sm font-bold tracking-widest ${isRecording ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                                                                        {isRecording ? t('notes.recording') : t('notes.hold_to_record') || 'Hold to record'}
                                                                    </p>
                                                                    <p className="font-rajdhani text-[10px] text-gray-500 uppercase tracking-[0.2em] mt-1 space-y-1">
                                                                        {isRecording ? (
                                                                            <span key="timer">{formatTime(recordingTime)}</span>
                                                                        ) : (
                                                                            <span key="prompt" className="opacity-60 italic">{t('notes.release_to_stop') || 'Release to stop'}</span>
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        key="text-note"
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                    >
                                                        <textarea
                                                            name="note_content"
                                                            autoComplete="off"
                                                            value={note}
                                                            onChange={(e) => setNote(e.target.value)}
                                                            placeholder={t('notes.message_placeholder')}
                                                            className={`w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-4 font-rajdhani text-white placeholder:text-gray-600 focus:outline-none focus:border-neonPurple/50 transition-all resize-none ${i18n.language === 'ar' ? 'text-right' : ''}`}
                                                            disabled={isSending}
                                                        />
                                                        <div className={`absolute bottom-4 ${i18n.language === 'ar' ? 'left-4' : 'right-4'} text-[10px] font-orbitron text-gray-600 uppercase tracking-widest`}>
                                                            {note.length} {t('notes.chars')}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {rateLimited && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl ${i18n.language === 'ar' ? 'flex-row-reverse text-right' : ''}`}
                                            >
                                                <AlertCircle className="w-4 h-4 text-red-400" />
                                                <p className="font-rajdhani text-[10px] text-red-400 uppercase tracking-widest">
                                                    {t('notes.rate_limited')}
                                                </p>
                                            </motion.div>
                                        )}

                                        {errorMsg && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className={`flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl ${i18n.language === 'ar' ? 'flex-row-reverse text-right' : ''}`}
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
                                                <div className={`flex items-center gap-3 ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}>
                                                    {t('notes.transmit_button')}
                                                    <Send className={`w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform ${i18n.language === 'ar' ? 'rotate-180 group-hover:-translate-x-1 group-hover:translate-y-1' : ''}`} />
                                                </div>
                                            )}
                                        </button>

                                        <p className="text-center font-rajdhani text-[10px] text-gray-500 uppercase tracking-widest">
                                            {t('notes.privacy_note')}
                                        </p>
                                    </form>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
