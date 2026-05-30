import React, { useEffect, useState } from 'react';
import { Mic, Volume2, Cpu, Zap, Shield, Sparkles } from 'lucide-react';
import { playSound } from '../utils/audioSynthesizer';

interface HologramRingProps {
  status: 'listening' | 'thinking' | 'speaking' | 'idle' | 'warning';
  onRingClick?: () => void;
  arcPower?: number;
}

export default function HologramRing({ status, onRingClick, arcPower = 100 }: HologramRingProps) {
  const [pulse, setPulse] = useState(false);
  const [visualBars, setVisualBars] = useState<number[]>(Array(16).fill(15));

  // Handle ambient or speech visualization bars
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'speaking' || status === 'thinking') {
      interval = setInterval(() => {
        setVisualBars(Array.from({ length: 16 }, () => Math.floor(Math.random() * 60) + 10));
      }, 90);
    } else if (status === 'listening') {
      interval = setInterval(() => {
        setVisualBars(Array.from({ length: 16 }, () => Math.floor(Math.random() * 45) + 5));
      }, 120);
    } else {
      // Idle wave
      interval = setInterval(() => {
        setVisualBars(Array.from({ length: 16 }, (_, i) => {
          const sine = Math.sin((Date.now() / 400) + i) * 8 + 12;
          return Math.max(5, sine);
        }));
      }, 150);
    }
    return () => clearInterval(interval);
  }, [status]);

  // Visual pulse trigger on listening
  useEffect(() => {
    if (status === 'listening') {
      const interval = setInterval(() => {
        setPulse(p => !p);
      }, 500);
      return () => clearInterval(interval);
    }
    setPulse(false);
  }, [status]);

  // Color mapper based on state
  const getColorScheme = () => {
    switch (status) {
      case 'listening':
        return {
          core: 'bg-emerald-500/20 text-emerald-400 border-emerald-400/40',
          ring: 'stroke-emerald-400/50',
          accent: 'rgba(16, 185, 129, ',
          text: 'text-emerald-400 glow-cyan',
        };
      case 'thinking':
        return {
          core: 'bg-amber-500/20 text-amber-400 border-amber-400/40',
          ring: 'stroke-amber-400/50',
          accent: 'rgba(245, 158, 11, ',
          text: 'text-amber-400 glow-gold',
        };
      case 'speaking':
        return {
          core: 'bg-cyan-500/25 text-cyan-400 border-cyan-400/50',
          ring: 'stroke-cyan-400/70',
          accent: 'rgba(6, 182, 212, ',
          text: 'text-cyan-400 glow-cyan',
        };
      case 'warning':
        return {
          core: 'bg-red-500/20 text-red-500 border-red-500/40',
          ring: 'stroke-red-500/50',
          accent: 'rgba(239, 68, 68, ',
          text: 'text-red-500 glow-red',
        };
      default:
        return {
          core: 'bg-cyan-900/20 text-cyan-400 border-cyan-500/30',
          ring: 'stroke-cyan-500/40',
          accent: 'rgba(6, 182, 212, ',
          text: 'text-cyan-400 glow-cyan',
        };
    }
  };

  const scheme = getColorScheme();

  const handleInteractiveClick = () => {
    playSound('hologram');
    if (onRingClick) onRingClick();
  };

  return (
    <div className="flex flex-col items-center justify-center relative p-8 select-none min-h-[410px]">
      {/* Background Outer Artistic Rings */}
      <div className="absolute w-[360px] h-[360px] sm:w-[400px] sm:h-[400px] border border-cyan-500/10 rounded-full pointer-events-none" />
      <div className="absolute w-[320px] h-[320px] sm:w-[360px] sm:h-[360px] border border-dashed border-cyan-500/20 rounded-full pointer-events-none spin-hud-slow" />
      <div className="absolute w-[280px] h-[280px] sm:w-[300px] sm:h-[300px] border-[0.5px] border-cyan-400/40 rounded-full shadow-[inset_0_0_50px_rgba(34,211,238,0.05)] pointer-events-none" />

      {/* Simulated HUD holographic projector ring */}
      <div 
        id="jarvis_hologram_core"
        onClick={handleInteractiveClick}
        className={`w-72 h-72 rounded-full cursor-pointer relative flex items-center justify-center transition-all duration-500 z-10 border border-glow-cyan ${
          pulse ? 'scale-105 border-emerald-400/50' : 'scale-100'
        }`}
        style={{
          background: `radial-gradient(circle, ${scheme.accent}0.1) 0%, transparent 70%)`
        }}
      >
        {/* Orbit Ring 1 - Spinning fast */}
        <div className="absolute inset-2 rounded-full border-2 border-dashed border-cyan-500/20 spin-hud-fast opacity-80" />

        {/* Orbit Ring 2 - Reverse slow */}
        <div className="absolute inset-6 rounded-full border border-dotted border-cyan-400/30 spin-hud-slow" />

        {/* Orbit Ring 3 - Solid segments */}
        <svg className="absolute inset-0 w-full h-full spin-hud-mid" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="44"
            className={`${scheme.ring} transition-all duration-500`}
            strokeWidth="0.75"
            strokeDasharray="10 15 30 10 5 18"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="38"
            className={`${scheme.ring} opacity-40`}
            strokeWidth="0.5"
            strokeDasharray="4 8"
            fill="none"
          />
        </svg>

        {/* Inner core matrix */}
        <div className={`w-48 h-48 rounded-full border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-500 relative bg-cyan-500/10 border-cyan-400/60 shadow-[0_0_40px_rgba(34,211,238,0.2)]`}>
          
          <div className="w-40 h-40 rounded-full border border-cyan-400/30 flex flex-col items-center justify-center bg-[#020617] relative overflow-hidden">
            {/* Glowing inner core dot aligned with actual status */}
            <div className={`absolute w-14 h-14 rounded-full blur-[2px] opacity-80 transition-all ${
              status === 'listening' ? 'bg-emerald-400 shadow-[0_0_20px_#10b981]' 
              : status === 'thinking' ? 'bg-amber-400 shadow-[0_0_20px_#f59e0b]'
              : status === 'warning' ? 'bg-red-500 shadow-[0_0_20px_#ef4444]'
              : 'bg-cyan-400 shadow-[0_0_25px_#22d3ee]'
             }`} />

            {/* Core HUD status indicator */}
            <div className="flex flex-col items-center relative z-10 text-center p-2">
              {status === 'listening' ? (
                <Mic className="w-7 h-7 animate-bounce mb-1" />
              ) : status === 'thinking' ? (
                <Cpu className="w-7 h-7 animate-spin mb-1 text-amber-400" />
              ) : status === 'speaking' ? (
                <Volume2 className="w-7 h-7 mb-1 text-cyan-300 scale-110" />
              ) : status === 'warning' ? (
                <Zap className="w-7 h-7 mb-1 animate-ping text-red-500" />
              ) : (
                <Sparkles className="w-7 h-7 mb-1 hover:scale-110 transition-transform" />
              )}

              <div className={`font-display text-[10px] font-bold tracking-widest uppercase ${scheme.text}`}>
                {status === 'listening' ? 'Sir, listening' : status === 'thinking' ? 'Analyzing...' : status === 'speaking' ? 'JARVIS' : status === 'warning' ? 'ALERT' : 'READY'}
              </div>
              
              <div className="font-mono text-[8px] text-cyan-400/60 mt-0.5 uppercase">
                {arcPower}% PWR
              </div>
            </div>
          </div>

          {/* Futuristic corner tick marks */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400/40" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400/40" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400/40" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400/40" />
        </div>
      </div>

      {/* Cybernetic Audio Wave bars underneath the ring */}
      <div id="jarvis_hologram_visualizer" className="flex items-end justify-center gap-[4px] h-10 mt-6 px-10 w-full z-10">
        {visualBars.map((h, i) => {
          let barBg = 'bg-cyan-400/70';
          if (status === 'listening') barBg = 'bg-emerald-400/70';
          if (status === 'thinking') barBg = 'bg-amber-400/70';
          if (status === 'warning') barBg = 'bg-red-500/70';

          return (
            <div
              key={i}
              className={`w-[4px] rounded-full transition-all duration-100 ${barBg}`}
              style={{
                height: `${h}%`,
                boxShadow: status !== 'idle' ? `0 0 10px rgba(0,242,254,0.3)` : 'none'
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
