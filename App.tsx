import React, { useState } from 'react';
import { Background3D } from './components/Background3D';
import { ProfileCard } from './components/ProfileCard';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

const App: React.FC = () => {
  const [view, setView] = useState<'profile' | 'solar-system'>('profile');

  return (
    <div className="min-h-[100dvh] w-full relative flex items-center justify-center py-6 md:py-0 overflow-y-auto">
      <Background3D showSolarSystem={view === 'solar-system'} />

      <main className="w-full relative z-10 flex items-center justify-center p-4 pointer-events-none">
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