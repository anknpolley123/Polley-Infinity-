import React from 'react';
import { ToggleLeft, ToggleRight, Lightbulb, Thermometer, Shield, Cpu, Lock, Wind, Plane } from 'lucide-react';
import { IoTDevice } from '../types';
import { playSound } from '../utils/audioSynthesizer';

interface IoTGridProps {
  devices: IoTDevice[];
  onUpdateDevice: (id: string, updates: Partial<IoTDevice>) => void;
}

export default function IoTGrid({ devices, onUpdateDevice }: IoTGridProps) {
  const getIcon = (type: IoTDevice['type']) => {
    switch (type) {
      case 'light':
        return <Lightbulb className="w-5 h-5 text-amber-300" />;
      case 'thermostat':
        return <Thermometer className="w-5 h-5 text-emerald-300" />;
      case 'lock':
        return <Lock className="w-5 h-5 text-rose-300" />;
      case 'shield':
        return <Shield className="w-5 h-5 text-cyan-300 animate-pulse" />;
      case 'swarm':
        return <Cpu className="w-5 h-5 text-indigo-300" />;
      case 'power':
        return <ZapIcon className="w-5 h-5 text-sky-400" />;
      default:
        return <Plane className="w-5 h-5 text-slate-300" />;
    }
  };

  const handleToggle = (device: IoTDevice) => {
    const isCurrentlyActive = (['on', 'unlocked', 'active', 'custom'] as string[]).includes(device.status);
    let nextStatus: IoTDevice['status'] = isCurrentlyActive 
      ? (device.type === 'lock' ? 'locked' : 'off') 
      : (device.type === 'lock' ? 'unlocked' : 'on');
    
    // Play sounds corresponding to triggers
    if ((['on', 'unlocked', 'active'] as string[]).includes(nextStatus)) {
      playSound('success');
    } else {
      playSound('click');
    }

    onUpdateDevice(device.id, { status: nextStatus });
  };

  const handleSliderChange = (device: IoTDevice, value: string) => {
    onUpdateDevice(device.id, { value });
  };

  return (
    <div className="bg-slate-950/40 border border-cyan-500/15 rounded-xl p-5 backdrop-blur-tech">
      <div className="flex items-center justify-between mb-4 border-b border-cyan-500/10 pb-3">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          Simulated IoT & Grid Orchestration
        </h2>
        <span className="font-mono text-[10px] text-cyan-500/60 font-semibold uppercase">
          Nodes: {devices.length} Active
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {devices.map((dev) => {
          const isActive = (['on', 'unlocked', 'active', 'custom'] as string[]).includes(dev.status);
          
          return (
            <div
              key={dev.id}
              className={`border rounded-lg p-3 transition-all duration-300 ${
                isActive 
                  ? 'bg-cyan-500/5 border-cyan-500/30 shadow-sm' 
                  : 'bg-black/20 border-cyan-500/5 hover:border-cyan-500/15'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-md ${isActive ? 'bg-cyan-950/40 border border-cyan-500/30' : 'bg-slate-900/30 border border-slate-800'}`}>
                    {getIcon(dev.type)}
                  </div>
                  <div>
                    <div className="font-display text-xs font-semibold text-slate-100">{dev.name}</div>
                    <div className="font-mono text-[9px] text-cyan-400/50 uppercase">{dev.category}</div>
                  </div>
                </div>

                <button 
                  onClick={() => handleToggle(dev)}
                  className="text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  {isActive ? (
                    <ToggleRight className="w-8 h-8 text-cyan-400 glow-cyan" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-cyan-500/35" />
                  )}
                </button>
              </div>

              {/* Slider for value settings */}
              {['thermostat', 'light', 'power', 'shield', 'swarm', 'thruster'].includes(dev.type) && (
                <div className="mt-3 pt-2.5 border-t border-cyan-500/5">
                  <div className="flex justify-between items-center mb-1 font-mono text-[9px] text-slate-400">
                    <span>SET POINT:</span>
                    <span className="text-cyan-300 font-bold">
                      {dev.type === 'thermostat' ? `${dev.value}°F` : dev.type === 'light' || dev.type === 'power' || dev.type === 'shield' || dev.type === 'thruster' ? `${dev.value}%` : dev.value.toUpperCase()}
                    </span>
                  </div>
                  
                  {dev.type === 'swarm' ? (
                    <div className="flex gap-1.5 mt-1.5">
                      {['standby', 'patrolling', 'defense'].map((mode) => (
                        <button
                          key={mode}
                          onClick={() => {
                            playSound('click');
                            onUpdateDevice(dev.id, { value: mode, status: mode === 'standby' ? 'standby' : 'active' });
                          }}
                          className={`flex-1 font-mono text-[8px] py-1 px-1 rounded border capitalize transition-all ${
                            dev.value === mode 
                              ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300 font-bold' 
                              : 'bg-black/30 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="range"
                      min={dev.type === 'thermostat' ? '60' : '0'}
                      max={dev.type === 'thermostat' ? '85' : '100'}
                      value={isNaN(Number(dev.value)) ? 50 : Number(dev.value)}
                      disabled={!isActive}
                      onChange={(e) => handleSliderChange(dev, e.target.value)}
                      className={`w-full accent-cyan-400 h-1 rounded-lg cursor-pointer bg-slate-900 ${
                        !isActive ? 'opacity-30 cursor-not-allowed' : ''
                      }`}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ZapIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
