import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2, Brain, Bot } from 'lucide-react';
import { sendMessageToWebhook } from '../services/webhookService';
import { INITIAL_GREETING } from '../constants';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: number;
  isError?: boolean;
}

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUGGESTIONS: string[] = [];

const TypingMessage: React.FC<{ text: string; onUpdate?: () => void; onComplete?: () => void }> = ({ text, onUpdate, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);
  const onCompleteRef = useRef(onComplete);
  const onUpdateRef = useRef(onUpdate);
  const timerStarted = useRef(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onUpdateRef.current = onUpdate;
  }, [onComplete, onUpdate]);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[index]);
        setIndex(prev => prev + 1);
        if (onUpdateRef.current) onUpdateRef.current();
      }, 15);
      return () => clearTimeout(timeout);
    } else if (onCompleteRef.current && !timerStarted.current) {
      timerStarted.current = true;
      const timeout = setTimeout(() => {
        if (onCompleteRef.current) onCompleteRef.current();
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [index, text.length]);

  return <span>{displayedText}</span>;
};

const DisconnectedMind: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-6 gap-6">
      <div className="relative">
        {/* Background glow */}
        <motion.div
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [0.8, 1.1, 0.8],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-red-500/30 blur-[40px] rounded-full"
        />

        {/* Main Icon Container */}
        <motion.div
          animate={{
            y: [-2, 2, -2],
            rotate: [-1, 1, -1],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 p-6 bg-red-500/10 border border-red-500/20 rounded-3xl backdrop-blur-md"
        >
          <div className="relative">
            <Brain size={48} className="text-red-500/40" />
            <motion.div
              animate={{
                opacity: [0, 1, 0],
                scale: [0.9, 1.1, 0.9],
              }}
              transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Brain size={48} className="text-red-500" />
            </motion.div>
            <div className="absolute -top-2 -right-2">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1],
                }}
                transition={{ duration: 1, repeat: Infinity }}
                className="bg-[#0a0a14] p-1 rounded-full border border-red-500/50"
              >
                <X size={16} className="text-red-500" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Floating particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-red-500 rounded-full"
            animate={{
              y: [-20, -60],
              x: [Math.random() * 40 - 20, Math.random() * 80 - 40],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.4,
            }}
            style={{
              left: '50%',
              top: '50%',
            }}
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
          <span className="font-orbitron text-[9px] font-bold tracking-[0.3em] text-red-500 uppercase">Connection to Fares's Digital Mind Failed</span>
        </div>
        <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
      </div>
    </div>
  );
};

const DigitalBrain: React.FC<{ size?: number; animate?: boolean }> = ({ size = 48, animate = true }) => {
  // ... (rest of the file components)
  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        animate={animate ? {
          scale: [1, 1.1, 1],
          opacity: [0.5, 1, 0.5],
        } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-neonPurple/20 blur-2xl rounded-full"
      />
      <motion.div
        animate={animate ? {
          rotate: [0, 360],
        } : {}}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border border-neonPurple/30 rounded-full border-dashed"
      />
      <Brain
        size={size}
        className={`${animate ? 'text-neonPurple animate-pulse' : 'text-neonPurple/50'}`}
      />
    </div>
  );
};

const GlitchText: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="relative inline-block font-orbitron font-bold uppercase tracking-[0.2em] text-xs">
      <span className="relative z-10 text-white">{text}</span>
      <motion.span
        animate={{ x: [-2, 2, -1, 1, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 0.2, repeat: Infinity }}
        className="absolute inset-0 text-neonBlue z-0 opacity-50 translate-x-1"
      >
        {text}
      </motion.span>
      <motion.span
        animate={{ x: [2, -2, 1, -1, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 0.2, repeat: Infinity, delay: 0.1 }}
        className="absolute inset-0 text-neonPurple z-0 opacity-50 -translate-x-1"
      >
        {text}
      </motion.span>
    </div>
  );
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestions, setActiveSuggestions] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const PLACEHOLDERS = [
    "Ask anything about Fares...",
    "Posez une question sur Fares...",
    "إسأل أي سؤال عن فارس...",
    "Fragen Sie etwas über Fares..."
  ];

  useEffect(() => {
    const timeout = setTimeout(() => {
      const fullText = PLACEHOLDERS[placeholderIndex];

      if (!isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length + 1));
        if (currentText === fullText) {
          setTimeout(() => setIsDeleting(true), 2000); // Wait longer before deleting in chat
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

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'init',
        role: 'ai',
        text: INITIAL_GREETING,
        timestamp: Date.now()
      }]);
    }
  }, []);

  // Auto-focus removed to prevent keyboard auto-open on mobile
  useEffect(() => {
    if (!isOpen) {
      setMessages([{
        id: 'init',
        role: 'ai',
        text: INITIAL_GREETING,
        timestamp: Date.now()
      }]);
      setActiveSuggestions([]);
      setShowSuggestions(false);
      setInput('');
      setLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const response = await sendMessageToWebhook(userMsg.text);
    const isError = response.output.includes("neural network lost");

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      text: response.output,
      timestamp: Date.now(),
      isError
    };

    if (response.suggestions && response.suggestions.length > 0) {
      setActiveSuggestions(response.suggestions);
    }

    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
    setShowSuggestions(false); // Hide until current typing finishes
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    // Trigger submission in next tick
    setTimeout(() => {
      const btn = document.querySelector('button[type="submit"]') as HTMLButtonElement;
      btn?.click();
    }, 0);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, showSuggestions]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-[#050510]/95 backdrop-blur-3xl flex flex-col"
        >
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

          <header className="relative z-10 px-6 py-6 border-b border-white/5 flex items-center justify-between max-w-5xl mx-auto w-full">
            <div className="flex items-center gap-4">
              <DigitalBrain size={32} />
              <div>
                <h2 className="font-orbitron font-black text-[10px] md:text-sm tracking-[0.2em] text-white">FARES_AI_MIND_CLONE</h2>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse" />
                  <span className="text-[10px] font-rajdhani font-bold tracking-[0.3em] text-gray-400 uppercase">Neural Connection Stable</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all duration-300 group"
            >
              <X className="w-6 h-6 text-gray-400 group-hover:text-white group-hover:rotate-90 transition-all duration-500" />
            </button>
          </header>

          <main
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-6 py-8 space-y-8 max-w-3xl mx-auto w-full scroll-smooth"
          >
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] rounded-3xl px-6 py-4 ${msg.role === 'user'
                  ? 'bg-neonPurple/20 border border-neonPurple/30 text-white ml-12'
                  : 'bg-white/5 border border-white/10 text-gray-300 mr-12'
                  }`}>
                  {msg.isError ? (
                    <DisconnectedMind />
                  ) : msg.role === 'ai' && msg.id !== 'init' ? (
                    <TypingMessage
                      key={msg.id}
                      text={msg.text}
                      onUpdate={() => {
                        if (scrollRef.current) {
                          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                        }
                      }}
                      onComplete={msg.id === messages[messages.length - 1].id ? () => setShowSuggestions(true) : undefined}
                    />
                  ) : (
                    msg.text
                  )}
                </div>
              </motion.div>
            ))}

            <AnimatePresence>
              {showSuggestions && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="flex flex-wrap gap-2 pt-4 pb-2"
                >
                  {activeSuggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/10 hover:border-neonPurple/50 transition-all duration-300 backdrop-blur-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center gap-6 py-12"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-neonPurple/30 blur-3xl rounded-full animate-pulse" />
                  <DigitalBrain size={80} />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <GlitchText text="Fares is thinking..." />
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [4, 12, 4], opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                        className="w-1 bg-neonBlue rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </main>

          <footer className="px-6 py-8 border-t border-white/5">
            <form
              onSubmit={handleSubmit}
              className="max-w-3xl mx-auto w-full relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-neonBlue/20 via-neonPurple/20 to-neonBlue/20 rounded-[2rem] blur-xl opacity-30 group-focus-within:opacity-100 transition duration-700" />
              <div className="relative flex items-center bg-[#11111d]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl px-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={currentText}
                  className="w-full bg-transparent text-white px-6 py-5 outline-none font-rajdhani text-base md:text-lg placeholder-gray-500"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="p-4 bg-neonPurple/20 hover:bg-neonPurple/30 text-neonPurple rounded-full border border-neonPurple/30 transition-all duration-300 disabled:opacity-20 group/btn m-1"
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Send className="w-6 h-6 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  )}
                </button>
              </div>
            </form>
          </footer>
        </motion.div >
      )}
    </AnimatePresence >
  );
};
