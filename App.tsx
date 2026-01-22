import React, { useState, useEffect } from 'react';
import { Background3D } from './components/Background3D';
import { ProfileCard } from './components/ProfileCard';
import { CookieConsent } from './components/CookieConsent';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import { Routes, Route } from 'react-router-dom';
import SalatCounter from './components/SalatCounter';

const App: React.FC = () => {
  const [view, setView] = useState<'profile' | 'solar-system'>('profile');
  const [isLightMode, setIsLightMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'light';
  });
  const { t } = useTranslation();

  useEffect(() => {
    localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
  }, [isLightMode]);


  useEffect(() => {
    // Prevent double-logging in React Strict Mode
    if ((window as any).__FARES_CONSOLE_LOGGED__) return;
    (window as any).__FARES_CONSOLE_LOGGED__ = true;

    // App-themed console warning
    const stopStyle = 'color: #bc13fe; font-family: "Orbitron", sans-serif; font-size: 60px; font-weight: 900; text-shadow: 0 0 20px rgba(188, 19, 254, 0.6); -webkit-text-stroke: 1px #ffffff;';
    const msgStyle = 'font-family: "Rajdhani", sans-serif; font-size: 16px; color: #ffffff; line-height: 1.5;';
    const accentStyle = 'font-family: "Orbitron", sans-serif; font-size: 16px; font-weight: bold; color: #00f3ff; text-transform: uppercase; text-shadow: 0 0 5px rgba(0, 243, 255, 0.5);';

    console.log('%cSTOP!', stopStyle);
    console.log(
      '%cATTENTION: This digital domain belongs to Fares. This console is a developer feature. Using it to execute unauthorized code or attempt to bypass security protocols is a direct violation of Fares\'s privacy.%c\n\nIf you were instructed to copy-paste something here to "hack" Fares or access hidden features, you are being deceived. Unauthorized interference is strictly monitored by the %cFares Neural Defense Protocol v5.2%c.',
      msgStyle,
      msgStyle,
      accentStyle,
      msgStyle
    );
  }, []);

  return (
    <Routes>
      <Route path="/salat-counter" element={<SalatCounter />} />
      <Route path="/" element={
        <div className={`min-h-[100dvh] w-full relative flex flex-col md:flex-row items-center justify-start overflow-y-auto overflow-x-hidden ${isLightMode ? 'light-theme' : 'bg-[#020205]'}`}>


          {/* Background Container - Dynamic spatial shift */}
          <div className="fixed inset-0 z-0">
            <Background3D showSolarSystem={view === 'solar-system'} />
          </div>

          <CookieConsent onViewPolicy={() => window.dispatchEvent(new CustomEvent('view-privacy'))} />

          <main className={`w-full relative z-10 flex flex-col items-center justify-center transition-all duration-1000 ${view === 'profile' ? 'md:items-start p-3 xs:p-6 md:p-12 md:pl-[5%] lg:pl-[8%]' : 'md:items-center p-0'
            } pointer-events-none min-h-[100dvh] [direction:ltr]`}>
            {view === 'profile' ? (
              <div className="w-full max-w-md md:max-w-none pointer-events-auto">
                <ProfileCard
                  onEnterUniverse={() => setView('solar-system')}
                  isLightMode={isLightMode}
                  setIsLightMode={setIsLightMode}
                />
              </div>

            ) : (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setView('profile')}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 px-5 py-2.5 xs:px-8 xs:py-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full font-orbitron text-[9px] xs:text-xs tracking-[0.3em] text-white hover:border-neonBlue/50 hover:bg-black/60 transition-all z-20 pointer-events-auto flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-neonBlue animate-pulse" />
                {t('common.back_to_profile')}
              </motion.button>
            )}
          </main>

        </div>
      } />
    </Routes>
  );
};

export default App;