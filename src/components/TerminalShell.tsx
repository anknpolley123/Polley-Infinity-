import React, { useEffect, useRef, useState } from 'react';
import { Terminal, Send, ArrowDownCircle, ShieldAlert } from 'lucide-react';
import { MessageLog } from '../types';
import { playSound } from '../utils/audioSynthesizer';

interface TerminalShellProps {
  logs: MessageLog[];
  onCommandSubmit: (cmd: string) => void;
  isProcessing: boolean;
}

export default function TerminalShell({ logs, onCommandSubmit, isProcessing }: TerminalShellProps) {
  const [input, setInput] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, isProcessing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    playSound('click');
    onCommandSubmit(input);
    setInput('');
  };

  return (
    <div className="bg-slate-950/40 border border-cyan-500/15 rounded-xl p-5 backdrop-blur-tech h-full flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-cyan-500/10 pb-3">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
          <Terminal className="w-4.5 h-4.5 text-cyan-400" />
          Neural Link & Terminal Console
        </h2>
        <span className="font-mono text-[9px] text-cyan-500/50 bg-cyan-950/20 px-2 py-0.5 rounded border border-cyan-500/10">
          LOGS: {logs.length} RECORDED
        </span>
      </div>

      {/* Message viewport */}
      <div className="flex-1 overflow-y-auto px-1.5 py-1 space-y-3.5 max-h-[300px] min-h-[220px]">
        {logs.map((log) => {
          const isUser = log.sender === 'user';
          const isSys = log.sender === 'system';

          if (isSys) {
            return (
              <div key={log.id} className="flex gap-2 p-2.5 bg-yellow-500/5 border border-yellow-500/10 rounded-lg text-yellow-300 font-mono text-[10px] whitespace-pre-wrap breakout-phrase">
                <ShieldAlert className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="leading-relaxed flex-1 break-words">
                  <span className="font-bold text-yellow-400">SYSTEMALERT @ {log.timestamp}:</span>
                  <div className="mt-1 font-mono text-slate-300 selection:bg-yellow-800 leading-normal">{log.text}</div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={log.id}
              className={`flex flex-col gap-1.5 max-w-[85%] ${isUser ? 'ml-auto items-end' : 'mr-auto items-start'}`}
            >
              {/* Header Label */}
              <div className="font-mono text-[8px] text-cyan-400/50 uppercase tracking-widest px-1">
                {isUser ? 'COMRADE_TERMINAL' : 'POLLEY-INFINITY'} • {log.timestamp}
              </div>

              {/* Chat Bubble */}
              <div
                className={`rounded-lg px-3.5 py-2.5 text-xs font-mono border leading-relaxed break-words whitespace-pre-wrap ${
                  isUser
                    ? 'bg-cyan-500/10 border-cyan-500/25 text-cyan-100 selection:bg-cyan-600'
                    : 'bg-black/40 border-cyan-500/5 text-slate-200'
                }`}
              >
                {log.text}

                {/* Simulated triggered operations */}
                {log.actionsTriggered && log.actionsTriggered.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-cyan-500/10 flex flex-col gap-1">
                    <div className="text-[8px] text-cyan-400/40 uppercase font-bold tracking-widest font-mono">
                      EXECUTED OPERATIONS:
                    </div>
                    {log.actionsTriggered.map((act, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 font-mono text-[9px] text-emerald-400">
                        <span className="w-1 h-1 rounded-full bg-emerald-400" />
                        <span>[{act.type.toUpperCase()}]</span>
                        <span className="text-slate-400 font-semibold">{act.target}</span>
                        {act.value && (
                          <span className="text-slate-500">→ {act.value.slice(0, 15)}{act.value.length > 15 ? '...' : ''}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* NLU Parse Metrics HUD readout */}
                {log.nluScore && (
                  <div className="mt-2.5 pt-2.5 border-t border-cyan-500/10 text-[9px] font-mono text-cyan-400/60 leading-normal flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-[8px] font-bold text-cyan-400 uppercase tracking-wider mb-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse inline-block" />
                      NLU PARSE MATRIX [{log.nluScore.mode.toUpperCase()}]
                    </div>
                    <div>
                      INTENT: <span className="text-cyan-300 font-bold">{log.nluScore.intent}</span>
                    </div>
                    <div>
                      ENTITIES: <span className="text-slate-300 font-medium">{log.nluScore.entities || 'none detected'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      CONFIDENCE: 
                      <div className="w-14 h-1.5 bg-slate-800 rounded overflow-hidden inline-block align-middle">
                        <div 
                          className="h-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" 
                          style={{ width: `${Math.round(log.nluScore.confidence * 100)}%` }} 
                        />
                      </div>
                      <span className="text-cyan-300 font-bold">{(log.nluScore.confidence * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Thinking Indicator */}
        {isProcessing && (
          <div className="flex flex-col gap-1 items-start mr-auto max-w-[85%] animate-pulse">
            <div className="font-mono text-[8px] text-amber-500/60 uppercase tracking-widest">
              POLLEY_INFINITY • COGNITIVE INTENT ANALYSIS
            </div>
            <div className="bg-black/30 border border-amber-500/20 text-amber-300 rounded-lg px-3.5 py-2 text-xs font-mono flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              Compiling Comrade's guidelines...
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input controls */}
      <form onSubmit={handleSubmit} className="border-t border-cyan-500/10 pt-3">
        <div className="relative bg-black/40 border border-cyan-500/15 rounded flex items-center px-3 group focus-within:border-cyan-400/35">
          <Terminal className="w-4 h-4 text-cyan-500/40" />
          <input
            type="text"
            disabled={isProcessing}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isProcessing ? "Analyzing Comrade's requirements..." : "Inject voice/text payload..."}
            className="flex-1 bg-transparent border-none text-xs text-slate-100 placeholder-slate-500 py-3 px-2.5 focus:outline-none font-mono"
            id="jarvis_command_input"
          />
          <button
            type="submit"
            disabled={isProcessing || !input.trim()}
            className={`cursor-pointer transition-colors ${
              input.trim() ? 'text-cyan-400 hover:text-cyan-300 glow-cyan' : 'text-slate-600'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
