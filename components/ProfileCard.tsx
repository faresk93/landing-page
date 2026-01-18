import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Cake, Mail, Linkedin, Instagram, Github, ArrowRight, Settings, MessageSquare, Bot } from 'lucide-react';
import { SOCIAL_LINKS } from '../constants';
import { ChatInterface } from './ChatInterface';

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
      className="relative z-10 w-full max-w-md mx-auto pointer-events-auto"
    >
      {/* Main Glass Card */}
      <div className="bg-[#0a0a12]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative">

        {/* Top Header Strip */}
        <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
          <div className="flex items-center gap-2 text-yellow-500/80">
            <Settings className="w-4 h-4 animate-spin-slow" />
            <span className="font-orbitron font-bold text-xs tracking-widest uppercase text-yellow-500/80">Neural Link Active</span>
          </div>
          <span className="font-orbitron text-[10px] text-white/40 tracking-[0.2em]">V3.3</span>
        </div>

        {/* Name Title with Glow Effect */}
        <div className="text-center mb-8 relative group cursor-default">
          <div className="absolute -inset-2 bg-gradient-to-r from-neonBlue/20 to-neonPurple/20 blur-xl opacity-50 group-hover:opacity-80 transition duration-700"></div>
          <h1 className="relative font-orbitron font-black text-4xl md:text-5xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-white drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]">
            Fares KHIARY
          </h1>
        </div>

        {/* Badges / Tags */}
        <div className="flex flex-col gap-4 items-center mb-8">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-neonPurple/30 bg-neonPurple/5 text-neonBlue font-rajdhani font-semibold tracking-wide shadow-[0_0_20px_-5px_rgba(188,19,254,0.2)]">
            <Code2 className="w-4 h-4" />
            <span>Full-Stack Web Developer</span>
          </div>

          <div className="flex flex-wrap justify-center gap-3 text-[10px] font-rajdhani font-bold tracking-widest text-gray-400 uppercase">
            <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5 shadow-inner">
              <span className="text-sm">🇹🇳</span> Tunisia
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5 shadow-inner">
              <span className="text-sm">🇫🇷</span> France
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5 shadow-inner">
              <span className="text-sm">🇴🇲</span> Oman
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5 shadow-inner">
              <Cake className="w-3 h-3 text-pink-400" /> 32
            </span>
          </div>
        </div>

        {/* AI Chat Integrated Input */}
        <div className="mb-6 group">
          <div className="flex flex-col gap-2 mb-3 px-1">
            <div className="flex items-center gap-2 text-neonPurple">
              <Bot className="w-3 h-3 animate-pulse" />
              <span className="font-orbitron text-[9px] font-bold tracking-[0.2em] uppercase">Fares AI Assistant</span>
            </div>
            <p className="font-rajdhani text-[11px] text-gray-400 leading-relaxed font-medium">
              Tap the input below to start a conversation. You can ask me anything about my experience, skills, or personal journey.
            </p>
          </div>

          <div
            onClick={() => setIsChatOpen(true)}
            className="relative cursor-text overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-4 transition-all duration-300 hover:border-neonPurple/50 hover:bg-white/10 group-hover:shadow-[0_0_20px_rgba(188,19,254,0.1)]"
          >
            <div className="flex items-center justify-between text-gray-400">
              <span className="font-rajdhani text-sm md:text-base tracking-wide whitespace-nowrap overflow-hidden">
                {currentText}
                <span className="inline-block w-[2px] h-4 bg-neonPurple ml-1 animate-pulse" />
              </span>
              <MessageSquare className="w-5 h-5 text-neonPurple/50 group-hover:text-neonPurple group-hover:scale-110 transition-all" />
            </div>

            {/* Glossy scanner line */}
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 w-32 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none"
            />
          </div>
        </div>

        {/* Action Row */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-wrap justify-center items-center gap-3">
            {[
              { Icon: Mail, href: `mailto:${SOCIAL_LINKS.EMAIL}`, color: 'hover:text-neonOrange' },
              { Icon: Linkedin, href: SOCIAL_LINKS.LINKEDIN, color: 'hover:text-blue-400' },
              { Icon: Instagram, href: SOCIAL_LINKS.INSTAGRAM, color: 'hover:text-pink-500' },
              { Icon: Github, href: SOCIAL_LINKS.GITHUB, color: 'hover:text-white' },
            ].map(({ Icon, href, color }, idx) => (
              <a
                key={idx}
                href={href}
                target={href.startsWith('mailto') ? '_self' : '_blank'}
                rel="noopener noreferrer"
                className={`p-3.5 rounded-xl bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/10 ${color} shadow-lg`}
              >
                <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
              </a>
            ))}

            {/* Inline Enter Universe Button */}
            <motion.button
              onClick={onEnterUniverse}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group px-6 rounded-xl bg-gradient-to-r from-orange-600/20 to-purple-600/20 border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 via-red-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-2.5 py-3">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
                <span className="font-orbitron font-bold text-[10px] tracking-[0.2em] text-white">MY UNIVERSE</span>
                <ArrowRight className="w-3 h-3 text-white/70 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </motion.button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-[10px] font-rajdhani font-bold tracking-[0.2em] text-gray-500 border-t border-white/5 pt-6">
          <div className="flex items-center gap-1.5 uppercase text-center w-full md:w-auto justify-center">
            Made with <span className="text-red-500/80 animate-pulse text-xs">❤</span> by <span className="text-white">Fares KHIARY</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/10 hidden md:block" />
          <div className="flex items-center gap-1 uppercase text-yellow-500/50">
            ✨ Enhanced with AI
          </div>
        </div>

      </div>

      {/* Stunning Fullscreen Popup Chat */}
      <ChatInterface isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </motion.div>
  );
};