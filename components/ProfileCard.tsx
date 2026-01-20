import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2, Cake, Mail, Linkedin, Instagram, Github, ArrowRight, Settings,
  MessageSquare, Bot, LogIn, LogOut, User as UserIcon, X
} from 'lucide-react';
import { SOCIAL_LINKS } from '../constants';
import { ChatInterface } from './ChatInterface';
import { supabase } from '../services/supabase';
import { User } from '@supabase/supabase-js';
import { NotePopup } from './NotePopup';
import { AdminDashboard } from './AdminDashboard';
import { LayoutDashboard, ShieldCheck } from 'lucide-react';

interface ProfileCardProps {
  onEnterUniverse: () => void;
}

const PLACEHOLDERS = [
  "Ask Fares a question...",
  "Posez une question à Fares...",
  "إسأل فارس أيّ سؤال...",
  "Stellen Sie Fares eine Frage..."
];

export const ProfileCard: React.FC<ProfileCardProps> = ({ onEnterUniverse }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [imgError, setImgError] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

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
  }, [currentText, isDeleting, placeholderIndex]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative z-10 w-full max-w-md md:max-w-4xl mx-auto md:mx-0 pointer-events-auto px-1 xs:px-2"
    >
      {/* Main Glass Card */}
      <div className="bg-[#0a0a12]/80 backdrop-blur-xl border border-white/10 rounded-2xl xs:rounded-3xl p-5 xs:p-8 md:p-10 shadow-2xl relative overflow-hidden">
        {/* Background glow for the whole card on desktop */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-neonBlue/5 blur-[120px] pointer-events-none hidden md:block" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-neonPurple/5 blur-[120px] pointer-events-none hidden md:block" />

        {/* Top Header Strip */}
        <div className="flex items-center justify-between gap-1 mb-4 md:mb-8 border-b border-white/5 pb-2 md:pb-4">
          <div className="flex items-center gap-1.5 text-yellow-500/80 shrink-0">
            <Settings className="w-3 h-3 animate-spin-slow hidden xs:block" />
            <div className="flex items-center gap-1">
              <span className="font-orbitron font-bold text-[8px] xs:text-[9px] tracking-tighter xs:tracking-widest uppercase text-yellow-500/80 whitespace-nowrap">Fares Link</span>
              <motion.span
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="font-orbitron font-black text-[6px] tracking-tighter text-yellow-500/40 uppercase hidden sm:block"
              >
                [WIP]
              </motion.span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="text-[10px]"
              >
                🧠
              </motion.span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-hidden">
            {user ? (
              <div className="flex items-center gap-1.5">
                <div className="flex flex-col items-end">
                  <span className="font-rajdhani text-[8px] text-white/60 font-bold uppercase tracking-wider whitespace-nowrap truncate max-w-[60px] xs:max-w-none">
                    {user.user_metadata.full_name || user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 font-orbitron text-[6px] text-red-400/60 hover:text-red-400 transition-colors uppercase tracking-widest"
                  >
                    Logout <LogOut className="w-2 h-2" />
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
                <span className="font-orbitron text-[7px] xs:text-[8px] font-bold tracking-widest text-white/70 group-hover:text-white uppercase truncate max-w-[80px] xs:max-w-none">Login</span>
              </button>
            )}
            <span className="font-orbitron text-[8px] text-white/20 tracking-tighter sm:tracking-[0.2em] shrink-0">v4.8</span>
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
                  <span className="font-orbitron font-bold text-[9px] tracking-[0.15em] text-blue-400 uppercase whitespace-nowrap">My Private Notes</span>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
              </motion.div>
            )}

            {/* Name Title with Glow Effect */}
            <div className="text-center md:text-left mb-8 relative group cursor-default w-full">
              <div className="absolute -inset-4 bg-gradient-to-r from-neonBlue/10 to-neonPurple/10 blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
              <h1 className="relative font-orbitron font-black text-2xl xs:text-3xl md:text-4xl lg:text-5xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-white drop-shadow-[0_0_15px_rgba(0,255,255,0.2)] leading-none whitespace-nowrap">
                Fares KH<span className="cursor-i">I</span>ARY
              </h1>
            </div>

            {/* Badges / Tags */}
            <div className="flex flex-col gap-4 items-center md:items-start mb-8 w-full">
              <div className="inline-flex items-center gap-2 px-4 xs:px-6 py-2 rounded-full border border-neonPurple/30 bg-neonPurple/5 text-neonBlue font-rajdhani font-bold tracking-widest shadow-[0_0_30px_-5px_rgba(188,19,254,0.3)] text-xs xs:text-sm md:text-base transition-all hover:scale-105">
                <Code2 className="w-4 h-4 md:w-5 md:h-5" />
                <span>Full-Stack Web Developer</span>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-2 text-[9px] md:text-[11px] font-rajdhani font-bold tracking-[0.15em] text-gray-400 uppercase">
                {[
                  { icon: "🇹🇳", label: "Tunisia" },
                  { icon: "🇫🇷", label: "France" },
                  { icon: "🇴🇲", label: "Oman" },
                  { icon: <Cake className="w-3 h-3 text-pink-400" />, label: "32" }
                ].map((item, idx) => (
                  <span key={idx} className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 shadow-inner hover:bg-white/10 transition-colors">
                    {item.icon} {item.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Desktop Social Links */}
            <div className="hidden md:flex items-center gap-4 w-full">
              {[
                { Icon: Mail, href: `mailto:${SOCIAL_LINKS.EMAIL}`, color: 'text-neonOrange', borderColor: 'hover:border-neonOrange', label: 'Email' },
                { Icon: Linkedin, href: SOCIAL_LINKS.LINKEDIN, color: 'text-blue-400', borderColor: 'hover:border-blue-400', label: 'LinkedIn' },
                { Icon: Instagram, href: SOCIAL_LINKS.INSTAGRAM, color: 'text-pink-500', borderColor: 'hover:border-pink-500', label: 'Instagram' },
                { Icon: Github, href: SOCIAL_LINKS.GITHUB, color: 'text-white', borderColor: 'hover:border-white', label: 'Github' },
              ].map(({ Icon, href, color, borderColor, label }, idx) => (
                <a
                  key={idx}
                  href={href}
                  target={href.startsWith('mailto') ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  title={label}
                  className={`p-3 md:p-4 rounded-xl bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/10 ${color} ${borderColor} shadow-lg hover:-translate-y-1 group`}
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: AI & Actions */}
          <div className="flex flex-col gap-6 md:gap-10">
            {/* AI Chat Integrated Input */}
            <div className="mb-5 md:mb-0 group">
              <div className="flex flex-col gap-2 md:gap-3 mb-3 md:mb-4 px-1">
                <div className="flex items-center gap-2 md:gap-3 text-neonPurple">
                  <div className="p-0 md:p-1.5 md:rounded-lg md:bg-neonPurple/10 md:border md:border-neonPurple/20">
                    <Bot className="w-3 h-3 md:w-4 md:h-4 animate-pulse" />
                  </div>
                  <span className="font-orbitron text-[9px] md:text-sm font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase">Fares AI Assistant</span>
                </div>
                <p className="font-rajdhani text-[11px] md:text-sm text-gray-400 leading-relaxed font-medium md:max-w-md">
                  Tap the input below to start a conversation. You can ask me anything about my experience, skills, or personal journey.
                </p>
              </div>

              <div
                onClick={() => setIsChatOpen(true)}
                className="relative cursor-text overflow-hidden rounded-2xl md:rounded-[1.5rem] bg-white/5 md:bg-white/[0.03] border border-white/10 p-4 md:p-6 transition-all duration-300 md:duration-500 hover:border-neonPurple/50 hover:bg-white/10 md:hover:bg-white/[0.07] group-hover:shadow-[0_0_20px_rgba(188,19,254,0.1)] md:group-hover:shadow-[0_0_40px_rgba(188,19,254,0.15)] group-active:scale-[0.99]"
              >
                <div className="flex items-center justify-between text-gray-400 md:text-gray-300">
                  <span className="font-rajdhani text-sm md:text-lg tracking-wide whitespace-nowrap overflow-hidden pr-4">
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
            <div className="flex flex-col gap-4 md:gap-6">
              {/* Mobile Social Links - hidden on desktop */}
              <div className="md:hidden flex justify-center items-center gap-3">
                {[
                  { Icon: Mail, href: `mailto:${SOCIAL_LINKS.EMAIL}`, color: 'text-neonOrange', borderColor: 'hover:border-neonOrange' },
                  { Icon: Linkedin, href: SOCIAL_LINKS.LINKEDIN, color: 'text-blue-400', borderColor: 'hover:border-blue-400' },
                  { Icon: Instagram, href: SOCIAL_LINKS.INSTAGRAM, color: 'text-pink-500', borderColor: 'hover:border-pink-500' },
                  { Icon: Github, href: SOCIAL_LINKS.GITHUB, color: 'text-white', borderColor: 'hover:border-white' },
                ].map(({ Icon, href, color, borderColor }, idx) => (
                  <a
                    key={idx}
                    href={href}
                    target={href.startsWith('mailto') ? '_self' : '_blank'}
                    rel="noopener noreferrer"
                    className={`p-3 rounded-xl bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/10 ${color} ${borderColor} shadow-lg group`}
                  >
                    <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  </a>
                ))}
              </div>

              {/* Primary Action Buttons */}
              <div className="flex items-center flex-row gap-2 px-1 md:px-0">
                <motion.button
                  onClick={onEnterUniverse}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 relative group rounded-xl md:rounded-2xl bg-gradient-to-r md:bg-gradient-to-br from-yellow-600/20 md:from-yellow-600/10 via-orange-600/20 md:via-orange-600/15 to-yellow-600/20 md:to-yellow-600/10 border border-white/10 md:border-yellow-500/20 hover:border-yellow-500/30 md:hover:border-yellow-500/40 transition-all duration-500 md:duration-700 overflow-hidden shadow-lg md:shadow-xl h-11 md:h-14"
                >
                  <div className="absolute inset-x-0 bottom-0 h-[2px] bg-yellow-500/50 md:bg-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.5)] md:shadow-[0_0_15px_rgba(234,179,8,0.4)]" />
                  <div className="relative flex items-center justify-center gap-1.5 md:gap-3 px-2 md:px-6">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_8px_rgba(234,179,8,0.8)] md:shadow-[0_0_12px_rgba(234,179,8,1)]" />
                    <span className="font-orbitron font-bold md:font-black text-[8px] xs:text-[9px] md:text-[11px] tracking-widest md:tracking-[0.2em] text-white whitespace-nowrap">MY UNIVERSE</span>
                    <ArrowRight className="w-3 h-3 md:w-5 md:h-5 text-yellow-500 group-hover:translate-x-1 md:group-hover:translate-x-2 transition-transform duration-500" />
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => setIsNoteOpen(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 relative group rounded-xl md:rounded-2xl bg-gradient-to-r md:bg-gradient-to-br from-neonPurple/20 md:from-neonPurple/10 to-blue-600/20 md:via-blue-600/15 md:to-neonPurple/10 border border-white/10 hover:border-white/20 md:hover:border-neonPurple/30 transition-all duration-500 md:duration-700 overflow-hidden shadow-lg md:shadow-xl h-11 md:h-14 animate-flash-border"
                >
                  <div className="absolute inset-x-0 bottom-0 h-[2px] bg-neonPurple/50 md:bg-neonPurple/30" />
                  <div className="relative flex items-center justify-center gap-1.5 md:gap-3 px-2 md:px-6">
                    <ShieldCheck className="w-3 h-3 md:w-5 md:h-5 text-neonPurple group-hover:rotate-12 transition-transform duration-500 shrink-0" />
                    <span className="font-orbitron font-bold md:font-black text-[8px] xs:text-[9px] md:text-[11px] tracking-widest md:tracking-[0.2em] text-white uppercase whitespace-nowrap">SEND NOTE</span>
                  </div>
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center gap-3 md:gap-4 border-t border-white/5 pt-4 md:pt-8 mt-6 md:mt-12">
          <div className="flex flex-wrap items-center justify-center gap-x-4 md:gap-x-6 gap-y-2 md:gap-y-3 text-[9px] md:text-xs font-rajdhani font-bold tracking-[0.15em] md:tracking-[0.2em] text-gray-500 uppercase">
            <div className="flex items-center gap-1.5 md:gap-2">
              Made with <span className="text-red-500/80 animate-pulse text-xs md:text-sm">❤</span> by <span className="text-white">Fares KH<span className="cursor-i">I</span>ARY</span>
            </div>
            <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-white/10" />
            <button onClick={() => setIsPrivacyOpen(true)} className="text-neonBlue/60 hover:text-neonBlue transition-colors tracking-[0.2em] md:tracking-[0.3em]">Privacy Policy</button>
            <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-white/10" />
            <div className="flex items-center gap-1 md:gap-2 text-yellow-500/50">
              ✨ Enhanced with AI
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
              <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-neonBlue" />
                  <h3 className="font-orbitron text-sm font-black text-white uppercase tracking-widest">Privacy Protocol</h3>
                </div>
                <button onClick={() => setIsPrivacyOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto font-rajdhani text-sm text-gray-400 space-y-6 pr-4">
                <section>
                  <h4 className="font-orbitron text-[10px] text-neonBlue uppercase mb-2">1. Data Collection</h4>
                  <p>We only collect the name and message you voluntarily provide in the contact section. If you sign in with Google, we access only your basic profile information (name and email) to offer a personalized interface.</p>
                </section>
                <section>
                  <h4 className="font-orbitron text-[10px] text-neonBlue uppercase mb-2">2. Data Security</h4>
                  <p>Your messages are encrypted and stored securely using Supabase. We do not share your personal information with third parties or use it for advertising.</p>
                </section>
                <section>
                  <h4 className="font-orbitron text-[10px] text-neonBlue uppercase mb-2">3. Transparency</h4>
                  <p>This site is a professional portfolio. All data flows are initiated by the user. Signing in with Google is optional and not required to view the content.</p>
                </section>
                <section>
                  <h4 className="font-orbitron text-[10px] text-neonBlue uppercase mb-2">4. User Rights</h4>
                  <p>You can request the deletion of any messages you have sent by contacting Fares directly via LinkedIn or email.</p>
                </section>
              </div>

              <button
                onClick={() => setIsPrivacyOpen(false)}
                className="w-full mt-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-orbitron text-[10px] tracking-widest uppercase hover:bg-white/10 transition-all"
              >
                Close Protocol
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