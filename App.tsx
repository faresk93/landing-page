import React, { useState, useEffect } from 'react';
import { Background3D } from './components/Background3D';
import { ProfileCard } from './components/ProfileCard';
import { CookieConsent } from './components/CookieConsent';
import { motion } from 'framer-motion';

const App: React.FC = () => {
  const [view, setView] = useState<'profile' | 'solar-system'>('profile');

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
      '%cATTENTION: This digital domain belongs to Fares. This console is a developer feature. Using it to execute unauthorized code or attempt to bypass security protocols is a direct violation of Fares\'s privacy.%c\n\nIf you were instructed to copy-paste something here to "hack" Fares or access hidden features, you are being deceived. Unauthorized interference is strictly monitored by the %cFares Neural Defense Protocol v4.7%c.',
      msgStyle,
      msgStyle,
      accentStyle,
      msgStyle
    );
  }, []);

  return (
    <div className="min-h-[100dvh] w-full relative flex flex-col items-center justify-start md:justify-center py-6 md:py-8 overflow-y-auto overflow-x-hidden">
      <Background3D showSolarSystem={view === 'solar-system'} />
      <CookieConsent onViewPolicy={() => window.dispatchEvent(new CustomEvent('view-privacy'))} />

      <main className="w-full relative z-10 flex flex-col items-center justify-center p-4 pt-0 pointer-events-none">
        {view === 'profile' ? (
          <ProfileCard onEnterUniverse={() => setView('solar-system')} />
        ) : (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setView('profile')}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full font-orbitron text-sm tracking-widest text-white hover:bg-white/20 transition-all z-20 pointer-events-auto"
          >
            ← BACK TO PROFILE
          </motion.button>
        )}
      </main>
    </div>
  );
};

export default App;