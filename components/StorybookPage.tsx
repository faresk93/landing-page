import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const StorybookPage: React.FC = () => {
  return (
    <div className="min-h-[100dvh] w-full bg-[#020205] flex flex-col items-center justify-center p-8">
      <Link
        to="/"
        className="absolute top-8 left-8 inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="font-orbitron text-[10px] tracking-widest uppercase font-bold">Back</span>
      </Link>
      <p className="font-orbitron text-white/30 text-xs tracking-widest uppercase">Storybook coming soon</p>
    </div>
  );
};

export default StorybookPage;
