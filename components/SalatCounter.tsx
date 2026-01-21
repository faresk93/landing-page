import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calculator, Sparkles, Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DayPicker } from 'react-day-picker';
import { format, subYears, startOfDay } from 'date-fns';
import 'react-day-picker/dist/style.css';

const SalatCounter: React.FC = () => {
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [textInput, setTextInput] = useState<string>('');
    const [totalPrayers, setTotalPrayers] = useState<number | null>(null);
    const [totalPrayersWorth, setTotalPrayersWorth] = useState<number | null>(null);
    const [totalRakaat, setTotalRakaat] = useState<number | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [showPicker, setShowPicker] = useState(false);

    // Sync input text when date is selected from picker or shortcuts
    useEffect(() => {
        if (startDate) {
            setTextInput(format(startDate, 'yyyy-MM-dd'));
        }
    }, [startDate]);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setTextInput(val);

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (dateRegex.test(val)) {
            const [y, m, d] = val.split('-').map(Number);
            const parsed = new Date(y, m - 1, d);
            if (!isNaN(parsed.getTime())) {
                setStartDate(parsed);
            }
        }
    };

    const calculatePrayers = () => {
        if (!startDate) return;

        setIsCalculating(true);

        const now = new Date();
        const diffInTime = now.getTime() - startDate.getTime();
        const diffInDays = Math.max(0, diffInTime / (1000 * 3600 * 24));

        const prayers = Math.floor(diffInDays * 5);
        const prayersWorth = prayers * 50;
        const rakaat = Math.floor(diffInDays * 17);

        setTimeout(() => {
            setTotalPrayers(prayers);
            setTotalPrayersWorth(prayersWorth)
            setTotalRakaat(rakaat);
            setIsCalculating(false);
        }, 800);
    };

    return (
        <div className="min-h-[100dvh] w-full flex items-center justify-center bg-[#020205] text-white p-4 font-rajdhani relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neonBlue/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neonPurple/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 w-full max-w-xl">
                {/* Back Button */}
                <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-orbitron text-[10px] tracking-widest uppercase font-bold">Back to Universe</span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 md:p-12 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-2xl"
                >
                    {/* Header */}
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", damping: 12 }}
                            className="w-16 h-16 bg-gradient-to-br from-neonBlue to-neonPurple rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-neonBlue/20"
                        >
                            <Sparkles className="w-8 h-8 text-white" />
                        </motion.div>
                        <h1 className="font-orbitron text-2xl md:text-3xl font-black tracking-widest uppercase mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-neonBlue to-white">
                            Salah Counter 🤲
                        </h1>
                        <p className="text-white/40 font-medium tracking-wider uppercase text-[10px] md:text-xs">
                            Faith Analytics v1.0 [WIP]
                        </p>
                    </div>

                    {/* Input Section */}
                    <div className="space-y-6">
                        <div className="relative group">
                            <label className="block font-orbitron text-[10px] text-neonBlue uppercase tracking-[0.2em] mb-3 ml-1">
                                Starting Date
                            </label>
                            <div
                                className="relative group/input"
                            >
                                <button
                                    type="button"
                                    onClick={() => setShowPicker(true)}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white/40 hover:text-neonBlue hover:bg-white/5 rounded-xl transition-all duration-300 z-20"
                                    title="Open Calendar"
                                >
                                    <Calendar className="w-5 h-5" />
                                </button>

                                <input
                                    type="text"
                                    placeholder="YYYY-MM-DD"
                                    value={textInput}
                                    onChange={handleTextChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-lg font-bold font-orbitron tracking-widest transition-all focus:outline-none focus:border-neonBlue/50 focus:bg-white/[0.08] hover:bg-white/[0.06] text-white/80 h-16"
                                />

                                <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-inset ring-white/5 group-focus-within:ring-neonBlue/30 transition-all duration-300" />
                            </div>

                            {/* Date Shortcuts */}
                            <div className="flex flex-wrap gap-2 mt-4">
                                {[
                                    { label: 'Today', getValue: () => startOfDay(new Date()) },
                                    { label: '1 Year Ago', getValue: () => startOfDay(subYears(new Date(), 1)) },
                                    { label: '5 Years Ago', getValue: () => startOfDay(subYears(new Date(), 5)) },
                                    { label: '10 Years Ago', getValue: () => startOfDay(subYears(new Date(), 10)) }
                                ].map((shortcut) => (
                                    <button
                                        key={shortcut.label}
                                        onClick={() => setStartDate(shortcut.getValue())}
                                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 text-[9px] font-orbitron tracking-wider uppercase text-white/40 hover:text-white/80 transition-all active:scale-95"
                                    >
                                        {shortcut.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={calculatePrayers}
                            disabled={!startDate || isCalculating}
                            className="w-full relative group h-16 rounded-2xl bg-gradient-to-r from-neonBlue/20 to-neonPurple/20 border border-white/10 hover:border-white/20 transition-all overflow-hidden flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-neonBlue/50" />
                            <Calculator className={`w-5 h-5 transition-transform ${isCalculating ? 'animate-spin' : 'group-hover:rotate-12'}`} />
                            <span className="font-orbitron font-black text-sm tracking-[0.2em] uppercase">
                                {isCalculating ? 'Processing...' : 'Calculate Journey'}
                            </span>
                        </motion.button>
                    </div>

                    {/* Results Section */}
                    <AnimatePresence mode="wait">
                        {totalPrayers !== null && totalPrayersWorth !== null && totalRakaat !== null && !isCalculating && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                animate={{ opacity: 1, height: "auto", scale: 1 }}
                                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                className="mt-12 pt-10 border-t border-white/5"
                            >
                                <div className="text-center space-y-8">
                                    <div>
                                        <p className="font-orbitron text-[10px] text-white/40 uppercase tracking-[0.3em] mb-4">
                                            Total Prayers Accomplished
                                        </p>
                                        <div className="relative inline-block">
                                            <motion.h2
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-5xl md:text-7xl font-black font-orbitron bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60"
                                            >
                                                <Counter value={totalPrayers} />
                                            </motion.h2>
                                            <div className="absolute -inset-4 bg-neonBlue/20 blur-2xl -z-10 rounded-full" />
                                        </div>
                                        <div className="text-2xl md:text-3xl font-bold font-orbitron text-white/50">
                                            <span className="text-white/40 text-xs">Prayers Worth</span>  <Counter value={totalPrayersWorth} />
                                        </div>
                                    </div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <p className="font-orbitron text-[9px] text-neonPurple uppercase tracking-[0.2em] mb-2">
                                            Rakaat equivalent (17 daily)
                                        </p>
                                        <div className="text-2xl md:text-3xl font-bold font-orbitron text-white/50">
                                            <Counter value={totalRakaat} />
                                        </div>
                                    </motion.div>

                                    <p className="text-neonBlue/60 font-medium tracking-widest text-xs uppercase pt-4">
                                        Mā Shā' Allāh • Keep Going
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Custom Date Picker Modal */}
                <AnimatePresence>
                    {showPicker && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowPicker(false)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="relative bg-[#0d0d15] border border-white/10 rounded-[2rem] p-6 shadow-2xl overflow-hidden faith-datepicker"
                            >
                                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-neonBlue" />
                                        <h3 className="font-orbitron text-xs font-black text-white uppercase tracking-widest">Select Journey Start</h3>
                                    </div>
                                    <button onClick={() => setShowPicker(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>

                                <DayPicker
                                    mode="single"
                                    selected={startDate}
                                    onSelect={(date) => {
                                        setStartDate(date);
                                        if (date) setShowPicker(false);
                                    }}
                                    startMonth={new Date(1950, 0)}
                                    endMonth={new Date()}
                                    captionLayout="dropdown"
                                    className="rdp-root"
                                    components={{
                                        Chevron: (props) => {
                                            if (props.orientation === 'left') return <ChevronLeft className="w-4 h-4" />;
                                            return <ChevronRight className="w-4 h-4" />;
                                        }
                                    }}
                                />

                                <style>{`
                                    .rdp-root {
                                        --rdp-cell-size: 40px;
                                        --rdp-accent-color: #00f3ff;
                                        --rdp-background-color: #bc13fe20;
                                        --rdp-accent-color-foreground: white;
                                        --rdp-outline: 2px solid var(--rdp-accent-color);
                                        --rdp-outline-selected: 2px solid var(--rdp-accent-color);
                                        margin: 0;
                                        color: white;
                                        font-family: 'Rajdhani', sans-serif;
                                    }
                                    .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover {
                                        background-color: var(--rdp-accent-color);
                                        font-weight: bold;
                                    }
                                    .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
                                        background-color: rgba(255, 255, 255, 0.05);
                                    }
                                    .rdp-caption_label {
                                        font-family: 'Orbitron', sans-serif;
                                        text-transform: uppercase;
                                        font-size: 0.75rem;
                                        letter-spacing: 0.1em;
                                        font-weight: bold;
                                    }
                                    .rdp-head_cell {
                                        text-transform: uppercase;
                                        font-size: 0.7rem;
                                        font-weight: 900;
                                        color: #bc13fe;
                                        font-family: 'Orbitron', sans-serif;
                                    }
                                    .rdp-dropdown {
                                        background: #1a1a2e;
                                        border: 1px solid rgba(255, 255, 255, 0.1);
                                        color: white;
                                        padding: 2px 4px;
                                        border-radius: 4px;
                                        font-family: 'Rajdhani', sans-serif;
                                        margin: 0 2px;
                                    }
                                `}</style>

                                <button
                                    onClick={() => setShowPicker(false)}
                                    className="w-full mt-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-orbitron text-[10px] tracking-widest uppercase hover:bg-white/10 transition-all"
                                >
                                    Confirm Date
                                </button>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Footer Info */}
                <p className="text-center text-white/20 font-medium tracking-tighter text-[10px] uppercase mt-8">
                    Faith Analytics Protocol • v1.1
                </p>
            </div>
        </div>
    );
};

// Simple Counter Animation Component
const Counter = ({ value }: { value: number }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = value;
        const duration = 1500;
        const increment = end / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setDisplayValue(end);
                clearInterval(timer);
            } else {
                setDisplayValue(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [value]);

    return <span>{displayValue.toLocaleString()}</span>;
};

export default SalatCounter;
