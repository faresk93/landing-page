import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Cookie, X, ArrowRight } from 'lucide-react';

interface CookieConsentProps {
    onViewPolicy: () => void;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({ onViewPolicy }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('fares_cookie_consent');
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 2000); // Delay for better UX
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('fares_cookie_consent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('fares_cookie_consent', 'declined');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed bottom-6 right-6 z-[100] w-[calc(100%-3rem)] sm:w-96 pointer-events-auto"
                >
                    {/* Glassmorphic Container */}
                    <div className="bg-[#0a0a12]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative group">

                        {/* Ambient Background Glow */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-neonPurple/10 blur-[50px] rounded-full group-hover:bg-neonPurple/20 transition-colors" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-neonBlue/10 blur-[50px] rounded-full group-hover:bg-neonBlue/20 transition-colors" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 rounded-xl bg-neonPurple/20 border border-neonPurple/30">
                                    <Cookie className="w-5 h-5 text-neonPurple" />
                                </div>
                                <div>
                                    <h3 className="font-orbitron text-xs font-black text-white uppercase tracking-widest">Neural Cookies</h3>
                                    <p className="font-rajdhani text-[10px] text-neonBlue font-bold uppercase tracking-tighter">Protocol: GDPR Compliant</p>
                                </div>
                            </div>

                            <p className="font-rajdhani text-sm text-gray-400 leading-relaxed mb-4">
                                Fares uses minimal cookies to secure your session and personalize your neural interface. No hidden tracking is deployed.
                            </p>

                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={handleAccept}
                                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-neonPurple to-blue-600 text-white font-orbitron text-[10px] font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group/btn"
                                >
                                    Confirm Handshake
                                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </button>

                                <div className="flex gap-2">
                                    <button
                                        onClick={handleDecline}
                                        className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-500 font-orbitron text-[9px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
                                    >
                                        Decline
                                    </button>
                                    <button
                                        onClick={onViewPolicy}
                                        className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-500 font-orbitron text-[9px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
                                    >
                                        Policy
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Micro Terminal Line */}
                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
