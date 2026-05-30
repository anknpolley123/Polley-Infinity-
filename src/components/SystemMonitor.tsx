import React, { useEffect, useState } from 'react';
import { Cpu, Server, ShieldAlert, Zap, Layers, RefreshCw } from 'lucide-react';
import { SystemStats } from '../types';
import { playSound } from '../utils/audioSynthesizer';

interface SystemMonitorProps {
  stats: SystemStats;
  onTriggerDiagnostics: () => void;
  isRunningDiagnostics: boolean;
}

export default function SystemMonitor({ stats, onTriggerDiagnostics, isRunningDiagnostics }: SystemMonitorProps) {
  const [procList, setProcList] = useState<{ pid: number; name: string; cpu: number; mem: number }[]>([
    { pid: 1403, name: "core_intelligence.bin", cpu: 12.4, mem: 420 },
    { pid: 1840, name: "speech_synthesizer.bin", cpu: 0, mem: 120 },
    { pid: 9021, name: "satellite_telepresence.bin", cpu: 2.1, mem: 840 },
    { pid: 3102, name: "arc_reactor_shunt.bin", cpu: 8.5, mem: 90 },
    { pid: 5410, name: "gravity_stabilizer.bin", cpu: 1.5, mem: 210 }
  ]);

  // Fluctuating process values for live cyber look
  useEffect(() => {
    const timer = setInterval(() => {
      setProcList(prev => prev.map(proc => {
        if (proc.name.includes("intelligence")) {
          return { ...proc, cpu: parseFloat((Math.random() * 20 + 10).toFixed(1)) };
        }
        if (proc.name.includes("speech") && stats.uptimeSeconds % 5 < 2) {
          return { ...proc, cpu: parseFloat((Math.random() * 15 + 5).toFixed(1)) };
        }
        return { ...proc, cpu: parseFloat((Math.random() * 5).toFixed(1)) };
      }));
    }, 2000);
    return () => clearInterval(timer);
  }, [stats.uptimeSeconds]);

  const handleManualDiag = () => {
    playSound('success');
    onTriggerDiagnostics();
  };

  // Helper values
  const rad = 30;
  const strokeCircumference = 2 * Math.PI * rad;

  const renderRadialMeter = (percentage: number, label: string, colorClass: string, subText: string, icon: React.ReactNode) => {
    const strokeDashoffset = strokeCircumference - (percentage / 100) * strokeCircumference;
    return (
      <div className="flex flex-col items-center justify-center p-3.5 bg-black/30 border border-cyan-500/5 rounded-lg text-center relative overflow-hidden group">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg className="w-16 h-16 transform -rotate-90">
            {/* Background ring */}
            <circle cx="32" cy="32" r={rad} fill="transparent" stroke="rgba(0, 242, 254, 0.05)" strokeWidth="4" />
            {/* Foreground progress */}
            <circle
              cx="32"
              cy="32"
              r={rad}
              fill="transparent"
              stroke="currentColor"
              strokeWidth="4"
              className={`${colorClass} transition-all duration-1000 ease-out`}
              strokeDasharray={strokeCircumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-slate-300">
            {icon}
          </div>
        </div>
        
        <div className="mt-2 text-xs font-semibold font-display tracking-wide text-slate-200">
          {label}
        </div>
        <div className="font-mono text-xs font-bold text-cyan-300 mt-0.5">
          {percentage}%
        </div>
        <div className="font-mono text-[8px] text-slate-400 mt-0.5 uppercase">
          {subText}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-950/40 border border-cyan-500/15 rounded-xl p-5 backdrop-blur-tech flex flex-col h-full gap-5">
      <div className="flex items-center justify-between border-b border-cyan-500/10 pb-3">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
          <Layers className="w-4.5 h-4.5 text-cyan-400" />
          Live Diagnostics & Systems
        </h2>
        
        <button
          onClick={handleManualDiag}
          disabled={isRunningDiagnostics}
          className={`flex items-center gap-1.5 font-mono text-[9px] font-bold px-2 py-1 border border-cyan-500/25 rounded bg-cyan-950/15 text-cyan-300 hover:bg-cyan-500/10 transition-all ${
            isRunningDiagnostics ? 'opacity-40 cursor-not-allowed animate-pulse' : ''
          }`}
        >
          <RefreshCw className={`w-3 h-3 ${isRunningDiagnostics ? 'animate-spin' : ''}`} />
          {isRunningDiagnostics ? 'DIAGNOSTICS_ACTIVE' : 'RUN_DIAGNOSTICS'}
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {renderRadialMeter(
          stats.cpuUsage,
          "Intelligence Peak",
          "text-cyan-400 glow-cyan",
          `${stats.cpuTemp}°C CORE TEMP`,
          <Cpu className="w-5 h-5 text-cyan-400" />
        )}
        {renderRadialMeter(
          Math.round((stats.memoryUsage / stats.memoryTotal) * 100),
          "Synapse Buffer",
          "text-purple-400",
          `${stats.memoryUsage}GB / ${stats.memoryTotal}GB`,
          <Server className="w-5 h-5 text-purple-400" />
        )}
        {renderRadialMeter(
          stats.arcPower,
          "ARC Reactor",
          stats.arcPower < 20 ? "text-rose-500 animate-ping" : "text-sky-400",
          stats.arcPower < 20 ? "CRITICAL DRAW" : "GRID GENERATION",
          <Zap className="w-5 h-5 text-sky-400" />
        )}
        {renderRadialMeter(
          stats.shieldCharge,
          "Force Shield",
          stats.shieldCharge < 30 ? "text-amber-500" : "text-emerald-400",
          stats.shieldCharge === 100 ? "DEFLECTION MAX" : "CHARGING FLUX",
          <ShieldAlert className="w-5 h-5 text-emerald-400" />
        )}
      </div>

      {/* Process list */}
      <div className="flex-1 flex flex-col min-h-[140px] bg-black/40 border border-cyan-500/5 rounded-lg p-3">
        <div className="font-mono text-[9px] font-bold text-cyan-400/60 uppercase mb-2 flex justify-between">
          <span>TASK MANAGER (CPU_PRIORITY)</span>
          <span>UPTIME: {stats.uptimeSeconds}S</span>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          {procList.map((proc) => {
            const cpuWidth = `${Math.min(100, Math.max(2, proc.cpu * 3))}%`;
            return (
              <div key={proc.pid} className="flex flex-col gap-1 hover:bg-cyan-950/10 p-1.5 rounded transition-colors group">
                <div className="flex items-center justify-between font-mono text-[9px] text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span className="text-cyan-500/40">PID_{proc.pid}</span>
                    <span className="font-semibold text-slate-200 group-hover:text-cyan-200">{proc.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400/70">{proc.cpu}% CPU</span>
                    <span className="text-slate-500">{proc.mem}MB</span>
                  </div>
                </div>
                {/* Horizontal nano progress bar */}
                <div className="w-full bg-slate-900/55 h-1 rounded overflow-hidden">
                  <div 
                    className="bg-cyan-500/40 h-full transition-all duration-500" 
                    style={{ width: cpuWidth }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
