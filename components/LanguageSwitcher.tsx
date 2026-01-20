import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';

const LANGUAGES = [
    { code: 'en', label: 'English', flag: '🌐' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: '(تونسي)', flag: '🇹🇳' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

export const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentLanguage = LANGUAGES.find(lang => lang.code === i18n.language) || LANGUAGES[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLanguageChange = (code: string) => {
        i18n.changeLanguage(code);
        setIsOpen(false);
    };

    return (
        <div className="relative z-[100]" ref={dropdownRef}>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-2 py-1 xs:px-3 xs:py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all group pointer-events-auto"
            >
                <span className="text-sm xs:text-base">{currentLanguage.flag}</span>
                <span className="font-orbitron text-[7px] xs:text-[9px] font-bold tracking-widest text-white/70 group-hover:text-white uppercase">
                    {currentLanguage.code === 'ar' ? 'تونسي' : currentLanguage.code}
                </span>
                <ChevronDown className={`w-2.5 h-2.5 xs:w-3 xs:h-3 text-white/40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className={`absolute ${i18n.language === 'ar' ? 'left-0' : 'right-0'} mt-2 w-32 xs:w-40 py-2 bg-[#0d0d15]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden`}
                    >
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                className={`w-full flex items-center justify-between px-4 py-2 hover:bg-white/5 transition-colors group ${i18n.language === lang.code ? 'bg-white/5' : ''
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-sm xs:text-base">{lang.flag}</span>
                                    <span className={`font-rajdhani text-xs xs:text-sm font-bold tracking-wider ${i18n.language === lang.code ? 'text-neonBlue' : 'text-gray-400 group-hover:text-white'
                                        }`}>
                                        {lang.label}
                                    </span>
                                </div>
                                {i18n.language === lang.code && (
                                    <div className="w-1 h-1 rounded-full bg-neonBlue shadow-[0_0_8px_rgba(0,243,255,1)]" />
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
