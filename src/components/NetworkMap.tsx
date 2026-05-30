import React, { useState } from 'react';
import { Activity, Radio, Lock, Unlock, RefreshCw } from 'lucide-react';
import { playSound } from '../utils/audioSynthesizer';

interface NetworkNode {
  id: string;
  name: string;
  type: string;
  latency: number;
  status: 'online' | 'connected' | 'encrypted' | 'standby';
}

export default function NetworkMap() {
  const [nodes, setNodes] = useState<NetworkNode[]>([
    { id: 'sat', name: 'orbital_satellite_link.bin', type: 'SATELLITE', latency: 45, status: 'encrypted' },
    { id: 'mainframe', name: 'stark_mainframe.host', type: 'SERVER', latency: 2, status: 'online' },
    { id: 'mobile', name: 'sir_mobile_hud.dev', type: 'MOBILE', latency: 12, status: 'connected' },
    { id: 'house', name: 'smart_residence.iot', type: 'LOCAL', latency: 8, status: 'online' },
    { id: 'drones', name: 'drone_swarm_mesh.net', type: 'GRID', latency: 32, status: 'encrypted' },
    { id: 'arc', name: 'arc_reactor_shunt.core', type: 'POWER', latency: 1, status: 'online' }
  ]);
  const [isPinging, setIsPinging] = useState(false);

  const triggerPingTest = () => {
    playSound('click');
    setIsPinging(true);
    setTimeout(() => {
      playSound('success');
      setNodes(prev => prev.map(n => ({
        ...n,
        latency: Math.max(1, Math.floor(n.latency + (Math.random() * 12 - 6)))
      })));
      setIsPinging(false);
    }, 1500);
  };

  return (
    <div className="bg-slate-950/40 border border-cyan-500/15 rounded-xl p-5 backdrop-blur-tech">
      <div className="flex items-center justify-between border-b border-cyan-500/10 pb-3 mb-4">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
          <Radio className="w-4.5 h-4.5 text-cyan-400 animate-pulse" />
          Quantum Network Uplink Map
        </h2>
        
        <button
          onClick={triggerPingTest}
          disabled={isPinging}
          className={`flex items-center gap-1.5 font-mono text-[9px] font-bold px-2 py-1 border border-cyan-500/25 rounded bg-cyan-950/15 text-cyan-300 hover:bg-cyan-500/10 transition-all ${
            isPinging ? 'opacity-40 animate-pulse' : ''
          }`}
        >
          <RefreshCw className={`w-3 h-3 ${isPinging ? 'animate-spin' : ''}`} />
          {isPinging ? 'TESTING_PINGS...' : 'PING_TOPOLOGY'}
        </button>
      </div>

      <div className="space-y-2.5">
        {nodes.map(node => (
          <div
            key={node.id}
            className="bg-black/35 border border-cyan-500/5 hover:border-cyan-500/15 p-2.5 rounded-lg flex items-center justify-between group transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative">
                <div className={`w-2.5 h-2.5 rounded-full ${isPinging ? 'bg-amber-400 animate-ping' : 'bg-cyan-400 glow-cyan'}`} />
                <div className="absolute inset-0 rounded-full border border-cyan-400 animate-ping opacity-25" />
              </div>
              
              <div className="truncate">
                <span className="font-mono text-xs text-slate-200 block truncate group-hover:text-cyan-300 transition-colors">
                  {node.name}
                </span>
                <span className="font-mono text-[8px] text-slate-500 uppercase tracking-widest block mt-0.5">
                  TYPE: {node.type}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 font-mono">
              <div className="text-right">
                <span className="text-[9px] text-slate-400 block">LATENCY:</span>
                <span className="text-xs text-cyan-300 font-bold">{node.latency} ms</span>
              </div>
              
              <div className="text-slate-500" title={node.status === 'encrypted' ? 'Encrypted Link' : 'Open Socket'}>
                {node.status === 'encrypted' ? (
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Unlock className="w-3.5 h-3.5 text-slate-600" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
