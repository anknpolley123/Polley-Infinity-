import React from 'react';
import { AlertOctagon, XCircle, ShieldAlert } from 'lucide-react';
import { CountdownTrigger } from '../types';
import { playSound } from '../utils/audioSynthesizer';

interface CountdownsPanelProps {
  countdown: CountdownTrigger | null;
  onCancel: () => void;
}

export default function CountdownsPanel({ countdown, onCancel }: CountdownsPanelProps) {
  if (!countdown || !countdown.active) return null;

  const handleCancelClick = () => {
    playSound('success');
    onCancel();
  };

  const isSelfDestruct = countdown.type === 'self-destruct';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      {/* Animated Red Border Glow */}
      <div className={`max-w-md w-full border rounded-2xl p-8 text-center relative overflow-hidden jarvis-scanlines ${
        isSelfDestruct 
          ? 'border-red-500/40 bg-red-950/20 box-shadow-[0_0_50px_rgba(239,68,68,0.3)]' 
          : 'border-amber-500/40 bg-amber-950/20 box-shadow-[0_0_50px_rgba(245,158,11,0.3)]'
      }`}>
        
        {/* Top visual warning bars */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse" />

        <div className="flex flex-col items-center gap-4">
          <div className="p-3 bg-red-500/15 rounded-full border border-red-500/30 animate-bounce">
            <AlertOctagon className="w-10 h-10 text-red-500 animate-pulse glow-red" />
          </div>

          <div className="space-y-1">
            <h3 className="font-display text-lg font-bold tracking-wider text-red-400 uppercase">
              HIGH-PRIORITY PROTOCOL ENGAGED
            </h3>
            <p className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">
              {countdown.title}
            </p>
          </div>

          {/* Giant ticking clock */}
          <div className="font-display font-extrabold text-7xl select-none text-red-500 glow-red my-4 animate-scale tracking-tighter">
            {countdown.current.toString().padStart(2, '0')}
            <span className="text-3xl font-light text-red-700/60 ml-1">S</span>
          </div>

          <div className="font-mono text-[9px] text-slate-400 bg-black/60 border border-slate-800 px-4 py-2 rounded max-w-sm leading-relaxed">
            CRITICAL WARNING: COMRADE, COGNITIVE PATHWAYS ARE RE-ROUTING POWER GRIDS TO AUXILIARY SHUNTS. INITIATION COMPLETES IN SHORT STATED TIME WINDOW.
          </div>

          <button
            onClick={handleCancelClick}
            className="mt-4 flex items-center justify-center gap-2 w-full font-mono text-[10px] font-bold bg-red-600/20 border border-red-500 text-red-300 hover:bg-red-600/40 transition-all py-3 rounded-lg"
          >
            <XCircle className="w-4 h-4" />
            COMRADE, OVERRIDE PROTOCOL IMMEDIATELY
          </button>
        </div>
      </div>
    </div>
  );
}
