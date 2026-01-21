import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Code2, Cake, Mail, Linkedin, Instagram, Github, ArrowRight, Settings,
  MessageSquare, Bot, LogIn, LogOut, User as UserIcon, X, Sun, Moon, Construction
} from 'lucide-react';


import { SOCIAL_LINKS } from '../constants';
import { ChatInterface } from './ChatInterface';
import { supabase } from '../services/supabase';
import { User } from '@supabase/supabase-js';
import { NotePopup } from './NotePopup';
import { AdminDashboard } from './AdminDashboard';
import { LanguageSwitcher } from './LanguageSwitcher';
import { LayoutDashboard, ShieldCheck } from 'lucide-react';
import { fetchInstagramFollowers } from '../utils/instagram';

interface ProfileCardProps {
  onEnterUniverse: () => void;
  isLightMode: boolean;
  setIsLightMode: (val: boolean) => void;
}


export const ProfileCard: React.FC<ProfileCardProps> = ({ onEnterUniverse, isLightMode, setIsLightMode }) => {

  const { t, i18n } = useTranslation();

  const PLACEHOLDERS = [
    t('chat.placeholder_en'),
    t('chat.placeholder_fr'),
    t('chat.placeholder_ar'),
    t('chat.placeholder_de')
  ];

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [imgError, setImgError] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [instagramFollowers, setInstagramFollowers] = useState<number | null>(null);


  const isAdmin = user?.email === 'khiary.fares@gmail.com';


  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setImgError(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleViewPrivacy = () => setIsPrivacyOpen(true);
    window.addEventListener('view-privacy', handleViewPrivacy);

    // Fetch Instagram followers via Supabase
    const fetchFollowers = async () => {
      // Use cached value if available and fresh (e.g. 1 hour)
      const cached = localStorage.getItem('instagram_followers');
      const cachedTime = localStorage.getItem('instagram_followers_time');
      const now = Date.now();

      if (cached && cachedTime && now - parseInt(cachedTime) < 3600000) {
        setInstagramFollowers(parseInt(cached));
      } else {
        fetchInstagramFollowers().then(count => {
          if (count !== null) {
            setInstagramFollowers(count);
            localStorage.setItem('instagram_followers', count.toString());
            localStorage.setItem('instagram_followers_time', now.toString());
          }
        });
      }
    };

    fetchFollowers();

    return () => window.removeEventListener('view-privacy', handleViewPrivacy);
  }, []);

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) console.error('Error logging in:', error.message);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error.message);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      const fullText = PLACEHOLDERS[placeholderIndex];

      if (!isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length + 1));
        if (currentText === fullText) {
          setTimeout(() => setIsDeleting(true), 1000);
        }
      } else {
        setCurrentText(fullText.substring(0, currentText.length - 1));
        if (currentText === "") {
          setIsDeleting(false);
          setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
        }
      }
    }, isDeleting ? 30 : 50);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, placeholderIndex, t]); // Added t to dependencies

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`relative z-10 w-full max-w-md md:max-w-5xl mx-auto md:mx-0 pointer-events-auto px-1 xs:px-2`}

      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
    >


      {/* Main Glass Card */}
      <div className="my-glass-card bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--card-border)] rounded-2xl xs:rounded-3xl p-5 xs:p-8 md:p-10 shadow-2xl relative overflow-hidden transition-colors duration-500">

        {/* Background glow for the whole card on desktop */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-neonBlue/5 blur-[120px] pointer-events-none hidden md:block" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-neonPurple/5 blur-[120px] pointer-events-none hidden md:block" />

        {/* Top Header Strip */}
        <div className={`flex items-center justify-between gap-1 mb-4 md:mb-8 border-b border-[var(--header-border)] pb-2 md:pb-4 ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}>

          <div className="flex items-center gap-1.5 text-yellow-500/80 shrink-0">
            <Settings className="w-3 h-3 animate-spin-slow hidden xs:block" />
            <div className="flex items-center gap-1">
              <span className="font-orbitron font-bold text-[8px] xs:text-[9px] tracking-tighter xs:tracking-widest uppercase text-yellow-500/80 whitespace-nowrap">{t('common.fares_link')}</span>
              {/* Enhanced WIP Note */}
              <div className="flex items-center gap-1 md:gap-1.5 px-1.5 py-0.5 rounded-full bg-yellow-500/5 border border-yellow-500/10">
                <motion.div
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  <Construction className="w-2 h-2 md:w-2.5 md:h-2.5 text-yellow-500/80" />
                </motion.div>
                <span className="font-orbitron font-black text-[6px] tracking-tighter text-yellow-500/60 uppercase">
                  {t('common.wip')}
                </span>
              </div>

              <div className="w-[1px] h-3 bg-white/10 mx-1 hidden xs:block" />
              <motion.button

                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsLightMode(!isLightMode)}
                className="text-[10px] cursor-pointer p-1 rounded-md hover:bg-white/5 transition-colors"
                title={isLightMode ? "Switch to Dark Mode" : "Switch to Light Mode"}
              >
                {isLightMode ? "🌙" : "☀️"}
              </motion.button>
            </div>
          </div>

          <div className={`flex items-center gap-1.5 ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}>
            <LanguageSwitcher />
            {user ? (
              <div className={`flex items-center gap-1.5 ${i18n.language === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
                <div className="flex flex-col items-end">
                  <span className="font-rajdhani text-[8px] text-white/60 font-bold uppercase tracking-wider whitespace-nowrap truncate max-w-[60px] xs:max-w-none">
                    {user.user_metadata.full_name || user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 font-orbitron text-[6px] text-red-400/60 hover:text-red-400 transition-colors uppercase tracking-widest"
                  >
                    {t('common.logout')} <LogOut className="w-2 h-2" />
                  </button>
                </div>
                {user.user_metadata.avatar_url && !imgError ? (
                  <img src={user.user_metadata.avatar_url} alt="User Profile Avatar" width="24" height="24" referrerPolicy="no-referrer" className="w-6 h-6 rounded-full border border-white/20" onError={() => setImgError(true)} />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                    <UserIcon className="w-3 h-3 text-white/40" />
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleGoogleLogin}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all group whitespace-nowrap scale-90 xs:scale-100"
              >
                <LogIn className="w-2.5 h-2.5 text-neonBlue group-hover:scale-110 transition-transform" />
                <span className="font-orbitron text-[7px] xs:text-[8px] font-bold tracking-widest text-white/70 group-hover:text-white uppercase truncate max-w-[80px] xs:max-w-none">{t('common.login')}</span>
              </button>
            )}
            <span className="font-orbitron text-[8px] text-white/20 tracking-tighter sm:tracking-[0.2em] shrink-0">{t('common.v_protocol')}</span>
          </div>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-[1.1fr_1fr] md:gap-6 lg:gap-10 md:items-center">
          {/* Left Column: Identity & Socials */}
          <div className="flex flex-col items-center md:items-start">
            {/* Admin Access Notification */}
            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 w-full max-w-xs p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between group cursor-pointer hover:bg-blue-500/20 transition-all"
                onClick={() => setIsAdminOpen(true)}
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-500/20 border border-blue-500/30">
                    <LayoutDashboard className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="font-orbitron font-bold text-[9px] tracking-[0.15em] text-blue-400 uppercase whitespace-nowrap">{t('common.my_private_notes')}</span>
                </div>
                <ArrowRight className={`w-4 h-4 text-blue-400 group-hover:translate-x-0.5 transition-transform ${i18n.language === 'ar' ? 'rotate-180 group-hover:-translate-x-0.5' : ''}`} />
              </motion.div>
            )}

            {/* Name Title with Glow Effect */}
            <div className={`mb-5 relative group cursor-default w-full text-center ${i18n.language === 'ar' ? 'md:text-right' : 'md:text-left'}`}>
              <div className="absolute -inset-4 bg-gradient-to-r from-neonBlue/10 to-neonPurple/10 blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
              <h1 className="my-name relative font-orbitron font-black text-2xl xs:text-3xl md:text-4xl lg:text-5xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-white drop-shadow-[0_0_15px_rgba(0,255,255,0.2)] leading-none whitespace-nowrap inline-block">
                {i18n.language === 'ar' ? (
                  <span className="font-cairo">فـ<span className="cursor-i">ا</span>رس الخياري</span>
                ) : (
                  <>Fares KH<span className="cursor-i">I</span>ARY</>
                )}
              </h1>
            </div>

            {/* Badges / Tags */}
            <div className="flex flex-col gap-4 items-center md:items-start mb-8 w-full">
              <div className="inline-flex items-center gap-2 px-4 xs:px-6 py-2 rounded-full border border-neonPurple/30 bg-neonPurple/5 text-neonBlue font-rajdhani font-bold tracking-widest shadow-[0_0_30px_-5px_rgba(188,19,254,0.3)] text-xs xs:text-sm md:text-base transition-all hover:scale-105">
                <Code2 className="w-4 h-4 md:w-5 md:h-5" />
                <span>{t('common.full_stack_developer')}</span>
              </div>

              <div className="flex justify-center md:justify-start gap-2 text-[9px] md:text-[11px] font-rajdhani font-bold tracking-[0.15em] text-gray-400 uppercase">
                {[
                  { country: "tn", label: t('common.tunisia') },
                  { country: "fr", label: t('common.france') },
                  { country: "om", label: t('common.oman') },
                  { icon: <Cake className="w-3 h-3 text-pink-400" />, label: "32" }
                ].map((item, idx) => (
                  <span key={idx} className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 shadow-inner hover:bg-white/10 transition-colors">
                    {item.country ? (
                      <img
                        src={`https://flagcdn.com/w40/${item.country}.png`}
                        width="16"
                        alt={item.label}
                        className="rounded-[2px] shadow-sm"
                      />
                    ) : item.icon} {item.label}
                  </span>
                ))}

              </div>
            </div>

            {/* Desktop Social Links */}
            <div className="hidden md:flex items-center gap-4 w-full">
              {[
                { Icon: Mail, href: `mailto:${SOCIAL_LINKS.EMAIL}`, color: 'text-neonOrange', borderColor: 'hover:border-neonOrange', label: t('common.email') },
                { Icon: Linkedin, href: SOCIAL_LINKS.LINKEDIN, color: 'text-blue-400', borderColor: 'hover:border-blue-400', label: 'LinkedIn' },
                { Icon: Instagram, href: SOCIAL_LINKS.INSTAGRAM, color: 'text-pink-500', borderColor: 'hover:border-pink-500', label: 'Instagram', isInstagram: true },
                { Icon: Github, href: SOCIAL_LINKS.GITHUB, color: 'text-white', borderColor: 'hover:border-white', label: 'Github' },
              ].map(({ Icon, href, color, borderColor, label, isInstagram }, idx) => (
                <a
                  key={idx}
                  href={href}
                  target={href.startsWith('mailto') ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  title={label}
                  className={`relative flex items-center justify-center p-3 md:p-4 rounded-xl bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/10 ${color} ${borderColor} shadow-lg hover:-translate-y-1 group min-w-[44px] md:min-w-[56px] h-[44px] md:h-[56px]`}
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:scale-110" />
                  {isInstagram && instagramFollowers !== null && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute bottom-1 left-0 right-0 font-orbitron font-black text-[7px] md:text-[8px] text-pink-500/70 glitch-text tracking-tighter text-center leading-none"
                    >
                      {instagramFollowers.toLocaleString()}
                    </motion.span>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: AI & Actions */}
          <div className="flex flex-col gap-2 md:gap-10">
            {/* AI Chat Integrated Input */}
            <div className="mb-5 md:mb-0 group">
              <div className={`flex flex-col gap-2 md:gap-3 mb-3 md:mb-4 px-1 ${i18n.language === 'ar' ? 'md:items-end text-right' : ''}`}>
                <div className={`flex items-center gap-2 md:gap-3 text-neonPurple ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <div className="p-0 md:p-1.5 md:rounded-lg md:bg-neonPurple/10 md:border md:border-neonPurple/20">
                    <Bot className="w-3 h-3 md:w-4 md:h-4 animate-pulse" />
                  </div>
                  <span className="font-orbitron text-[9px] md:text-sm font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase">{t('chat.assistant_title')}</span>
                </div>
                <p className="ai-description font-rajdhani text-[11px] md:text-sm text-gray-400 leading-relaxed font-medium md:max-w-[450px] whitespace-pre-wrap break-words">
                  {t('chat.assistant_description')}
                </p>

              </div>

              <div
                onClick={() => setIsChatOpen(true)}
                className="relative cursor-text overflow-hidden rounded-2xl md:rounded-[1.5rem] bg-white/5 md:bg-white/[0.03] border border-white/10 p-4 md:p-6 transition-all duration-300 md:duration-500 hover:border-neonPurple/50 hover:bg-white/10 md:hover:bg-white/[0.07] group-hover:shadow-[0_0_20px_rgba(188,19,254,0.1)] md:group-hover:shadow-[0_0_40px_rgba(188,19,254,0.15)] group-active:scale-[0.99]"
              >
                <div className={`flex items-center justify-between text-gray-400 md:text-gray-300 ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <span className={`font-rajdhani text-sm md:text-lg tracking-wide whitespace-nowrap overflow-hidden pr-4 ${i18n.language === 'ar' ? 'pr-0 pl-4' : ''}`}>
                    {currentText}
                    <span className="inline-block w-[2px] h-4 md:h-5 bg-neonPurple ml-1 animate-pulse" />
                  </span>
                  <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-neonPurple/50 group-hover:text-neonPurple group-hover:scale-110 transition-all duration-500" />
                </div>

                {/* Glossy scanner line */}
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 w-32 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none"
                />
              </div>
            </div>

            {/* Actions Section */}
            <div className="flex flex-col gap-6 md:gap-6">
              {/* Mobile Social Links - hidden on desktop */}
              <div className="md:hidden flex justify-center items-center gap-3">
                {[
                  { Icon: Mail, href: `mailto:${SOCIAL_LINKS.EMAIL}`, color: 'text-neonOrange', borderColor: 'hover:border-neonOrange' },
                  { Icon: Linkedin, href: SOCIAL_LINKS.LINKEDIN, color: 'text-blue-400', borderColor: 'hover:border-blue-400' },
                  { Icon: Instagram, href: SOCIAL_LINKS.INSTAGRAM, color: 'text-pink-500', borderColor: 'hover:border-pink-500', isInstagram: true },
                  { Icon: Github, href: SOCIAL_LINKS.GITHUB, color: 'text-white', borderColor: 'hover:border-white' },
                ].map(({ Icon, href, color, borderColor, isInstagram }, idx) => (
                  <a
                    key={idx}
                    href={href}
                    target={href.startsWith('mailto') ? '_self' : '_blank'}
                    rel="noopener noreferrer"
                    className={`relative flex items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/10 ${color} ${borderColor} shadow-lg group min-w-[44px] h-[44px]`}
                  >
                    <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                    {isInstagram && instagramFollowers !== null && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute bottom-1 left-0 right-0 font-orbitron font-black text-[7px] text-pink-500/70 glitch-text tracking-tighter text-center leading-none"
                      >
                        {instagramFollowers.toLocaleString()}
                      </motion.span>
                    )}
                  </a>
                ))}
              </div>

              {/* Primary Action Buttons */}
              <div className={`flex items-center flex-row gap-2 px-1 md:px-0 ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <motion.button
                  onClick={onEnterUniverse}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 relative group rounded-xl md:rounded-2xl bg-gradient-to-r md:bg-gradient-to-br from-yellow-600/20 md:from-yellow-600/10 via-orange-600/20 md:via-orange-600/15 to-yellow-600/20 md:to-yellow-600/10 border border-white/10 md:border-yellow-500/20 hover:border-yellow-500/30 md:hover:border-yellow-500/40 transition-all duration-500 md:duration-700 overflow-hidden shadow-lg md:shadow-xl h-11 md:h-14"
                >
                  <div className="absolute inset-x-0 bottom-0 h-[2px] bg-yellow-500/50 md:bg-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.5)] md:shadow-[0_0_15px_rgba(234,179,8,0.4)]" />
                  <div className={`relative flex items-center justify-center gap-1.5 md:gap-3 px-2 md:px-6 ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_8px_rgba(234,179,8,0.8)] md:shadow-[0_0_12px_rgba(234,179,8,1)]" />
                    <span className="font-orbitron font-bold md:font-black text-[8px] xs:text-[9px] md:text-[11px] tracking-widest md:tracking-[0.2em] text-white whitespace-nowrap">{t('actions.my_universe')}</span>
                    <ArrowRight className={`w-3 h-3 md:w-5 md:h-5 text-yellow-500 group-hover:translate-x-1 md:group-hover:translate-x-2 transition-transform duration-500 ${i18n.language === 'ar' ? 'rotate-180 group-hover:-translate-x-1 md:group-hover:-translate-x-2' : ''}`} />
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => setIsNoteOpen(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 relative group rounded-xl md:rounded-2xl bg-gradient-to-r md:bg-gradient-to-br from-neonPurple/20 md:from-neonPurple/10 to-blue-600/20 md:via-blue-600/15 md:to-neonPurple/10 border border-white/10 hover:border-white/20 md:hover:border-neonPurple/30 transition-all duration-500 md:duration-700 overflow-hidden shadow-lg md:shadow-xl h-11 md:h-14 animate-flash-border"
                >
                  <div className="absolute inset-x-0 bottom-0 h-[2px] bg-neonPurple/50 md:bg-neonPurple/30" />
                  <div className={`relative flex items-center justify-center gap-1.5 md:gap-3 px-2 md:px-6 ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <ShieldCheck className="w-3 h-3 md:w-5 md:h-5 text-neonPurple group-hover:rotate-12 transition-transform duration-500 shrink-0" />
                    <span className="font-orbitron font-bold md:font-black text-[8px] xs:text-[9px] md:text-[11px] tracking-widest md:tracking-[0.2em] text-white uppercase whitespace-nowrap">{t('actions.send_note')}</span>
                  </div>
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 md:gap-4 border-t border-white/5 pt-4 md:pt-8 mt-6 md:mt-12">
          <div className={`flex flex-wrap items-center justify-center gap-x-4 md:gap-x-6 gap-y-2 md:gap-y-3 text-[9px] md:text-xs font-rajdhani font-bold tracking-[0.15em] md:tracking-[0.2em] text-gray-500 uppercase ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-1.5 md:gap-2 ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}>
              {i18n.language === 'ar' ? (
                <>
                  <span className="text-white">
                    <span className="font-cairo">فـ<span className="cursor-i">ا</span>رس الخياري</span>
                  </span>
                  <span>{t('common.by')}</span>
                  <span className="text-red-500/80 animate-pulse text-xs md:text-sm">❤</span>
                  <span>{t('common.made_with')}</span>
                </>
              ) : (
                <>
                  {t('common.made_with')} <span className="text-red-500/80 animate-pulse text-xs md:text-sm">❤</span> {t('common.by')} <span className="text-white">Fares KH<span className="cursor-i">I</span>ARY</span>
                </>
              )}
            </div>

            <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-white/10" />
            <button onClick={() => setIsPrivacyOpen(true)} className="text-neonBlue/60 hover:text-neonBlue transition-colors tracking-[0.2em] md:tracking-[0.3em]">{t('common.privacy_policy')}</button>
            <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-white/10" />
            <div className={`flex items-center gap-1 md:gap-2 text-yellow-500/50 ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}>
              ✨ {t('common.enhanced_with_ai')}
            </div>
          </div>
        </div>

      </div>

      {/* Privacy Policy Modal */}
      <AnimatePresence>
        {isPrivacyOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPrivacyOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#0d0d15] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
            >
              <div className={`flex items-center justify-between mb-6 border-b border-white/5 pb-4 ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-2 ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <ShieldCheck className="w-5 h-5 text-neonBlue" />
                  <h3 className="font-orbitron text-sm font-black text-white uppercase tracking-widest">{t('privacy.title')}</h3>
                </div>
                <button onClick={() => setIsPrivacyOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className={`flex-1 overflow-y-auto font-rajdhani text-sm text-gray-400 space-y-6 pr-4 ${i18n.language === 'ar' ? 'text-right' : ''}`}>
                <section>
                  <h4 className="font-orbitron text-[10px] text-neonBlue uppercase mb-2">{t('privacy.section1_title')}</h4>
                  <p>{t('privacy.section1_content')}</p>
                </section>
                <section>
                  <h4 className="font-orbitron text-[10px] text-neonBlue uppercase mb-2">{t('privacy.section2_title')}</h4>
                  <p>{t('privacy.section2_content')}</p>
                </section>
                <section>
                  <h4 className="font-orbitron text-[10px] text-neonBlue uppercase mb-2">{t('privacy.section3_title')}</h4>
                  <p>{t('privacy.section3_content')}</p>
                </section>
                <section>
                  <h4 className="font-orbitron text-[10px] text-neonBlue uppercase mb-2">{t('privacy.section4_title')}</h4>
                  <p>{t('privacy.section4_content')}</p>
                </section>
              </div>

              <button
                onClick={() => setIsPrivacyOpen(false)}
                className="w-full mt-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-orbitron text-[10px] tracking-widest uppercase hover:bg-white/10 transition-all"
              >
                {t('common.close_protocol')}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Stunning Fullscreen Popup Chat */}
      <ChatInterface isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Private Note Popup */}
      <NotePopup
        isOpen={isNoteOpen}
        onClose={() => setIsNoteOpen(false)}
        userId={user?.id}
        userEmail={user?.email}
        userName={user?.user_metadata.full_name}
      />

      {/* Admin Dashboard */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </motion.div >
  );
};