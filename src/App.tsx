import React, { useEffect, useState, useRef } from 'react';
import { 
  Zap, 
  Mic, 
  MicOff, 
  Shield, 
  Tv, 
  Sparkles, 
  Play, 
  Video, 
  HelpCircle,
  Command,
  Database,
  LogOut,
  Fingerprint
} from 'lucide-react';

import { IoTDevice, VirtualFile, SystemStats, CountdownTrigger, MessageLog, JarvisAction } from './types';
import HologramRing from './components/HologramRing';
import IoTGrid from './components/IoTGrid';
import SystemMonitor from './components/SystemMonitor';
import SimulatedDrive from './components/SimulatedDrive';
import TerminalShell from './components/TerminalShell';
import CountdownsPanel from './components/CountdownsPanel';
import NetworkMap from './components/NetworkMap';
import AuthScreen from './components/AuthScreen';
import { playSound } from './utils/audioSynthesizer';

// Quick instruction notes
const HELP_COMMANDS = [
  { text: "System overrides", cmd: "Activate self-destruct" },
  { text: "Smart Home control", cmd: "Turn on the living room lights" },
  { text: "Thermal grids", cmd: "Set bedroom temperature to 72 degrees" },
  { text: "Threat deterrence", cmd: "Deploy drone swarm mesh to defense" },
  { text: "Creation power", cmd: "Create a file named defense_directives.txt with all shields active" },
  { text: "Special frequencies", cmd: "Initiate system overload sequence" },
  { text: "Themes", cmd: "Engage stealth mode or Party frequencies" }
];

export default function App() {
  // Safe authentication session state
  const [user, setUser] = useState<{ email: string; name: string; provider: 'email' | 'google' | 'proton' } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Restore authenticated session on active grid startup
  useEffect(() => {
    try {
      const stored = localStorage.getItem('polley_infinity_session');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Local session retrieval anomaly", e);
    }
    setAuthChecked(true);
  }, []);

  // Conversational logs
  const [logs, setLogs] = useState<MessageLog[]>([
    {
      id: 'init-1',
      text: "Powering up primary and ancillary quantum reactors. Core cybernetic grids: Nominal.\nSir, Polley-Infinity is online and awaiting your command. Say or type a directives payload.",
      sender: 'jarvis',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  // Simulated Virtual main drive files
  const [files, setFiles] = useState<VirtualFile[]>([
    {
      id: 'file-1',
      name: 'mark_85_flight_test.md',
      content: "All Mark 85 repulsor channels completed static flight tests with 98.7% output stabilization, Sir.",
      size: 104,
      updatedAt: new Date().toISOString()
    },
    {
      id: 'file-2',
      name: 'satellite_defense_protocol.md',
      content: "Main security firewall enabled. Auxiliary dome matrix charging successfully. Security rating level: AAA",
      size: 112,
      updatedAt: new Date().toISOString()
    },
    {
      id: 'file-3',
      name: 'tony_personal_todo.txt',
      content: "1. Calibrate ARC Reactor flux rates\n2. Schedule flight stability review with Colonel Rhodes\n3. Buy strawberries for Pepper.",
      size: 125,
      updatedAt: new Date().toISOString()
    }
  ]);

  // Smart IoT devices grids
  const [devices, setDevices] = useState<IoTDevice[]>([
    { id: 'living_room_lights', name: 'Living Room Lights', type: 'light', status: 'on', value: '75', category: 'Home' },
    { id: 'bedroom_temp', name: 'Bedroom Temp', type: 'thermostat', status: 'custom', value: '72', category: 'Home' },
    { id: 'front_door', name: 'Sub-entry Lock', type: 'lock', status: 'locked', value: '0', category: 'Home' },
    { id: 'shield_dome', name: 'Deflection Shield', type: 'shield', status: 'active', value: '100', category: 'Defense' },
    { id: 'drone_swarm', name: 'Tactical Drone Swarm', type: 'swarm', status: 'active', value: 'patrolling', category: 'Defense' },
    { id: 'arc_reactor', name: 'Aux ARC Reactor', type: 'power', status: 'active', value: '100', category: 'Core' },
    { id: 'thrusters', name: 'Sub-orbital Thrusters', type: 'thruster', status: 'standby', value: '12', category: 'Thrusters' }
  ]);

  // Telemetry resources
  const [stats, setStats] = useState<SystemStats>({
    cpuUsage: 14,
    cpuTemp: 44,
    memoryUsage: 8.2,
    memoryTotal: 16,
    storageUsage: 450,
    storageTotal: 1024,
    arcPower: 100,
    shieldCharge: 100,
    thrusterRate: 12,
    connectionStatus: 'stable',
    uptimeSeconds: 0
  });

  // Mode/Style configuration
  const [themeMode, setThemeMode] = useState<'slate' | 'overload' | 'stealth' | 'party'>('slate');
  const [selectedFile, setSelectedFile] = useState<VirtualFile | null>(null);
  const [jarvisStatus, setJarvisStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking' | 'warning'>('idle');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);

  // Integrated Secure Virtual Sandbox Browser Overlay
  const [isBrowserOpen, setIsBrowserOpen] = useState(false);
  const [currentBrowserUrl, setCurrentBrowserUrl] = useState('https://polley-search.net/stark-infinity');
  const [browserSearchQuery, setBrowserSearchQuery] = useState('');

  // High-priority countdown triggers
  const [countdown, setCountdown] = useState<CountdownTrigger | null>(null);

  // Web Speech API references
  const [micActive, setMicActive] = useState(false);
  const speechRecognitionRef = useRef<any>(null);

  // Play ambient system tone on launch
  useEffect(() => {
    playSound('chime');
  }, []);

  // System Stats ticking updates & live fluctuates simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => {
        let baseCpu = themeMode === 'overload' ? 99 : (themeMode === 'stealth' ? 4 : 10 + Math.floor(Math.random() * 8));
        let baseTemp = themeMode === 'overload' ? 93 : (themeMode === 'stealth' ? 32 : 40 + Math.floor(Math.random() * 6));
        
        // Match specific ARC reactor level to IoT state if changed
        const arcDev = devices.find(d => d.id === 'arc_reactor');
        const shieldDev = devices.find(d => d.id === 'shield_dome');
        const thrustDev = devices.find(d => d.id === 'thrusters');

        const activeArcPower = arcDev?.status === 'active' ? Number(arcDev.value) : 12;
        const activeShieldCharge = shieldDev?.status === 'active' ? Number(shieldDev.value) : 0;
        const activeThrusterRate = thrustDev?.status === 'active' ? Number(thrustDev.value) : 0;

        return {
          ...prev,
          uptimeSeconds: prev.uptimeSeconds + 1,
          cpuUsage: Math.max(1, Math.min(100, baseCpu + (Math.random() > 0.5 ? 2 : -2))),
          cpuTemp: Math.max(20, Math.min(110, baseTemp)),
          arcPower: activeArcPower,
          shieldCharge: activeShieldCharge,
          thrusterRate: activeThrusterRate,
          connectionStatus: themeMode === 'overload' ? 'overloaded' : (themeMode === 'stealth' ? 'stealth' : 'stable')
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [themeMode, devices]);

  // Diagnostic checklist trigger
  const runDiagnosticsCheck = () => {
    setIsRunningDiagnostics(true);
    setJarvisStatus('thinking');
    playSound('success');

    setTimeout(() => {
      setIsRunningDiagnostics(false);
      setJarvisStatus('idle');
      playSound('chime');

      setLogs(prev => [
        ...prev,
        {
          id: `diag-${Date.now()}`,
          sender: 'jarvis',
          text: `📊 JARVIS FULL SYSTEM SUMMARY:\n- Main ARC Reactor: [${stats.arcPower}% Optimal]\n- Defense Grids: [Shield Matrix at ${stats.shieldCharge}%]\n- Environment Units: [Linked and controlled]\n- Thermal grids: [Cooling channels active]\n\nAll internal systems are perfectly calibrated. Ready, Sir.`,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    }, 3000);
  };

  // Safe Text-To-Speech execution
  const speakOutLoud = (phrase: string) => {
    if (!window.speechSynthesis) return;

    // Stop current speaking
    window.speechSynthesis.cancel();

    // Reconstruct utterance
    const utterance = new SpeechSynthesisUtterance(phrase);
    
    // Attempt standard atmospheric male UK voice
    const voices = window.speechSynthesis.getVoices();
    const englishMVoice = voices.find(v => v.lang.startsWith('en-GB') || v.lang.startsWith('en-US')) || voices[0];
    if (englishMVoice) {
      utterance.voice = englishMVoice;
    }

    utterance.onstart = () => {
      setJarvisStatus('speaking');
    };

    utterance.onend = () => {
      setJarvisStatus('idle');
    };

    utterance.onerror = () => {
      setJarvisStatus('idle');
    };

    window.speechSynthesis.speak(utterance);
  };

  // Safety countdown ticker
  useEffect(() => {
    if (!countdown || !countdown.active) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (!prev) return null;
        if (prev.current <= 1) {
          clearInterval(timer);
          playSound('alert');
          
          // Trigger theoretical sequence end!
          setLogs(logList => [
            ...logList,
            {
              id: `countdown-end-${Date.now()}`,
              sender: 'system',
              text: `🚨 DETONATION DIRECTIVE BYPASSED / SIMULATED SYSTEM PURGE FAILED. GRID RESET TO SAFEMODE.`,
              timestamp: new Date().toLocaleTimeString()
            }
          ]);
          setThemeMode('slate');
          return null;
        }
        
        // Alarm sound sweep on low numbers
        if (prev.current < 5) {
          playSound('warning');
        } else {
          playSound('click');
        }

        return {
          ...prev,
          current: prev.current - 1
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Cancel running countdown protocols
  const handleCancelCountdown = () => {
    if (countdown) {
      setLogs(prev => [
        ...prev,
        {
          id: `override-${Date.now()}`,
          sender: 'jarvis',
          text: `🚨 SIR OVERRIDE CONFIRMED. Safety subroutines restored immediately. Disaster successfully averted. All thrusters safe.`,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
      speakOutLoud("Override accepted, Sir. Reactor core temperature is cooling down.");
    }
    setCountdown(null);
    setThemeMode('slate');
    setJarvisStatus('idle');
  };

  // Initialize Speech Recognition API
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setMicActive(true);
        setJarvisStatus('listening');
        playSound('hologram');
      };

      rec.onresult = (event: any) => {
        const resultText = event.results[0][0].transcript;
        setMicActive(false);
        setJarvisStatus('thinking');
        handleDirectiveInput(resultText);
      };

      rec.onerror = () => {
        setMicActive(false);
        setJarvisStatus('idle');
        playSound('warning');
      };

      rec.onend = () => {
        setMicActive(false);
      };

      speechRecognitionRef.current = rec;
    }
  }, []);

  // Toggle Voice Recognition Listen
  const toggleListening = () => {
    if (!speechRecognitionRef.current) {
      // Browser Web Speech recognition missing warnings
      playSound('warning');
      setLogs(prev => [
        ...prev,
        {
          id: `err-speech-${Date.now()}`,
          sender: 'system',
          text: `Speech Recognition is not fully supported on this frame configuration, Sir. Please enter command directive directly into terminal.`,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
      return;
    }

    if (micActive) {
      speechRecognitionRef.current.stop();
    } else {
      speechRecognitionRef.current.start();
    }
  };

  // Core J.A.R.V.I.S Action Dispatcher
  const executeJarvisAction = (action: JarvisAction) => {
    switch (action.type) {
      case 'set_iot': {
        setDevices(prev => prev.map(dev => {
          if (dev.id === action.target) {
            playSound('success');
            // If locking door or status on
            const isOnOff = action.value === 'on' || action.value === 'off';
            return {
              ...dev,
              status: isOnOff ? (action.value as 'on' | 'off') : 'active',
              value: isOnOff ? dev.value : action.value
            };
          }
          return dev;
        }));
        break;
      }
      case 'create_file': {
        const newId = `file-${Date.now()}`;
        const newFile: VirtualFile = {
          id: newId,
          name: action.target,
          content: action.value,
          size: action.value.length,
          updatedAt: new Date().toISOString()
        };
        setFiles(prev => [newFile, ...prev.filter(f => f.name !== action.target)]);
        setSelectedFile(newFile);
        playSound('success');
        break;
      }
      case 'delete_file': {
        setFiles(prev => prev.filter(f => f.name !== action.target));
        if (selectedFile?.name === action.target) setSelectedFile(null);
        playSound('warning');
        break;
      }
      case 'system_state': {
        if (action.target === 'reboot') {
          playSound('alert');
          setLogs(prev => [
            ...prev,
            { id: `reboot-${Date.now()}`, sender: 'system', text: "REBOOT SEQUENCE ENGAGED / CYCLING PRIMARY SYSTEMS", timestamp: new Date().toLocaleTimeString() }
          ]);
        } else if (action.target === 'diagnostics') {
          runDiagnosticsCheck();
        } else if (action.target === 'overload') {
          setThemeMode('overload');
          setJarvisStatus('warning');
          playSound('alert');
        } else if (action.target === 'stealth') {
          setThemeMode('stealth');
          playSound('success');
        } else if (action.target === 'party') {
          setThemeMode('party');
          playSound('chime');
        }
        break;
      }
      case 'start_countdown': {
        const duration = parseInt(action.target) || 10;
        setCountdown({
          id: 'alert-countdown',
          title: action.value || 'SELF-DESTRUCT PROTOCOL',
          duration,
          current: duration,
          active: true,
          type: 'self-destruct'
        });
        setThemeMode('overload');
        setJarvisStatus('warning');
        playSound('alert');
        break;
      }
      case 'add_task': {
        // We can add simulated task inside Sir Todo list file!
        setFiles(prev => prev.map(f => {
          if (f.name === 'tony_personal_todo.txt') {
            const lines = f.content.split('\n');
            const nextIdx = lines.length + 1;
            const updatedContent = `${f.content}\n${nextIdx}. ${action.target}`;
            const updated: VirtualFile = {
              ...f,
              content: updatedContent,
              size: updatedContent.length,
              updatedAt: new Date().toISOString()
            };
            if (selectedFile?.id === f.id) setSelectedFile(updated);
            return updated;
          }
          return f;
        }));
        playSound('success');
        break;
      }
      case 'set_weather': {
        // Simulates weather alerts in visual log
        setLogs(prev => [
          ...prev,
          {
            id: `weather-${Date.now()}`,
            sender: 'system',
            text: `🛰️ ATMOSPHERIC RADAR DETECTED IN ${action.target.toUpperCase()}: 68°F (Clear Sky). Signal grid: Active.`,
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
        playSound('chime');
        break;
      }
    }
  };

  // Local Command Parser representing fast offline voice capabilities
  const parseLocalCommand = (cmd: string): MessageLog | null => {
    let cleanCmd = cmd.toLowerCase().trim();

    // Handle 'Ankon' voice wake word or addressing trigger
    if (cleanCmd.startsWith('ankon')) {
      const stripped = cleanCmd.replace(/^ankon\s*,?\s*/i, '').trim();
      if (stripped === '' || stripped === 'are you there' || stripped === 'there') {
        return {
          id: `local-${Date.now()}`,
          sender: 'jarvis',
          timestamp: new Date().toLocaleTimeString(),
          text: `⚡ POLLEY-INFINITY INTERACTION PROTOCOLS\n──────────────────────────────────────\nStatus: Listening for directives via wake-word "Ankon"\nCore Intelligence ID: Polley-Infinity\nAccess: Secure Level 10 Node\n\nStanding by for your audio commands, Sir. Ready to execute orchestration.`,
          speech: "At your service Sir. Polley-Infinity is calibrated and listening for your commands.",
          nluScore: {
            intent: "CONVERSATIONAL",
            entities: "wake_word: ankon, calibration: active",
            confidence: 1.0,
            mode: "Local Offline"
          }
        };
      }
      cleanCmd = stripped;
    }

    if (cleanCmd.includes('time') || cleanCmd.includes('what time is it') || cleanCmd.includes('what\'s the time') || cleanCmd.includes('tell me the time')) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString();
      const dateStr = now.toLocaleDateString();
      return {
        id: `local-${Date.now()}`,
        sender: 'jarvis',
        timestamp: now.toLocaleTimeString(),
        text: `🕒 LOCAL SYSTEM TIME READOUT\n──────────────────────────────────────\nSystem local time: ${timeStr}\nSystem local date: ${dateStr}\nSynchronized: SECURE LOCAL NTP ATOMIC GRID`,
        speech: `The current local time is exactly ${now.getHours() % 12 || 12}:${now.getMinutes().toString().padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}, Sir.`,
        nluScore: {
          intent: "TIME_INQUIRY",
          entities: "clock: local_system_time",
          confidence: 1.0,
          mode: "Local Offline"
        }
      };
    }

    if (cleanCmd.includes('open browser') || cleanCmd.includes('launch browser') || cleanCmd.includes('web browser')) {
      setTimeout(() => {
        setIsBrowserOpen(true);
        playSound('success');
      }, 500);

      return {
        id: `local-${Date.now()}`,
        sender: 'jarvis',
        timestamp: new Date().toLocaleTimeString(),
        text: `🌐 SECURE WEB BROWSER GATEWAY INITIALIZED\n──────────────────────────────────────\nEnabling secure virtual sandbox viewport...\nSandbox: polley-search.net\nAccessing Polley-Infinity network gateways...`,
        speech: "Opening virtual secure browser sandbox, Sir. Web interface activated.",
        nluScore: {
          intent: "OPEN_BROWSER",
          entities: "browser: visual_sandbox",
          confidence: 1.0,
          mode: "Local Offline"
        }
      };
    }

    if (cleanCmd.includes('status') || cleanCmd.includes('how are systems') || cleanCmd === 'system status' || cleanCmd.includes('diagnostics')) {
      return {
        id: `local-${Date.now()}`,
        sender: 'jarvis',
        timestamp: new Date().toLocaleTimeString(),
        text: `📊 SYSTEM DIAGNOSTIC STATUS PORT [LOCAL]\n──────────────────────────────────────\n- Primary Core: [Polley-Infinity OS]\n- Arc Power Level: ${stats.arcPower}%\n- Shield Matrix: ${stats.shieldCharge}%\n- Connection State: ${stats.connectionStatus.toUpperCase()}\n- Local Core Temp: ${stats.cpuTemp}°C\n- Total Uptime: ${stats.uptimeSeconds} seconds\n\nAll smart-grid and cybernetic components are operating nominally.`,
        speech: "Primary core and smart grid modules are perfectly nominal, Sir. Reactor rates are stable.",
        nluScore: {
          intent: "SYSTEM_STATUS",
          entities: "status_grid: core_system",
          confidence: 1.0,
          mode: "Local Offline"
        }
      };
    }

    if (cleanCmd.includes('joke') || cleanCmd.includes('say a joke') || cleanCmd.includes('tell me a joke')) {
      const jokes = [
        "Why do programmers wear glasses? Because they can't C-sharp, Sir. A minor mathematical humor payload.",
        "There are 10 types of people in this world, Sir: those who understand binary, and those who don't.",
        "Why did the database administrator leave the restaurant, Sir? Because they had two tables but couldn't perform a natural join."
      ];
      const jokeText = jokes[Math.floor(Math.random() * jokes.length)];
      return {
        id: `local-${Date.now()}`,
        sender: 'jarvis',
        timestamp: new Date().toLocaleTimeString(),
        text: `😄 MATHEMATICAL LOGIC HUMOR\n──────────────────────────────────────\n"${jokeText.toString().replace(', Sir.', '')}"`,
        speech: jokeText,
        nluScore: {
          intent: "CONVERSATIONAL",
          entities: "humor: programming_joke",
          confidence: 1.0,
          mode: "Local Offline"
        }
      };
    }

    return null;
  };

  // Submit spoken/typed text commands to Full-stack Express Backend
  const handleDirectiveInput = async (commandText: string) => {
    if (!commandText.trim()) return;

    // Add user's command to the visible logs list
    const userLog: MessageLog = {
      id: `user-${Date.now()}`,
      text: commandText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };
    
    setLogs(prev => [...prev, userLog]);
    setIsProcessing(true);
    setJarvisStatus('thinking');

    // Offline local fast command parser for direct simple commands
    const localResult = parseLocalCommand(commandText);
    if (localResult) {
      setTimeout(() => {
        setLogs(prev => [...prev, localResult]);
        setIsProcessing(false);
        if (localResult.speech) {
          speakOutLoud(localResult.speech);
        } else {
          setJarvisStatus('idle');
        }
      }, 600);
      return;
    }

    try {
      const response = await fetch('/api/polley/command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          command: commandText,
          // Re-map conversation history context
          history: logs.map(l => ({ sender: l.sender, text: l.text })),
          localContext: {
            devices: devices.map(d => ({ id: d.id, val: d.value, status: d.status })),
            files: files.map(f => f.name),
            theme: themeMode,
            diagnosticsStatus: stats.connectionStatus
          }
        })
      });

      if (!response.ok) {
        throw new Error('Connection failure with reactor link');
      }

      const data = await response.json();
      
      const jarvisLog: MessageLog = {
        id: `jarvis-${Date.now()}`,
        text: data.text || "Directives mapped, Sir.",
        speech: data.speech || "",
        sender: 'jarvis',
        timestamp: new Date().toLocaleTimeString(),
        actionsTriggered: data.actions || [],
        nluScore: data.nluScore ? {
          intent: data.nluScore.intent,
          entities: data.nluScore.entities,
          confidence: data.nluScore.confidence,
          mode: 'Server NLU (Gemini)'
        } : undefined
      };

      setLogs(prev => [...prev, jarvisLog]);
      setIsProcessing(false);

      // Speak Jarvis response aloud
      if (data.speech) {
        speakOutLoud(data.speech);
      } else {
        setJarvisStatus('idle');
      }

      // Execute returned action arrays in order
      if (Array.isArray(data.actions)) {
        data.actions.forEach((act: JarvisAction) => {
          executeJarvisAction(act);
        });
      }

    } catch (err: any) {
      console.error(err);
      setIsProcessing(false);
      setJarvisStatus('idle');
      playSound('warning');

      setLogs(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'jarvis',
          text: `⚠️ INTERRUPTED DIRECTIVES LINK\nApologies Sir, it appears my command pipelines have timed out. I have restored default visual grids.`,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    }
  };

  // Styles map based on active theme modes
  const getThemeStyles = () => {
    switch (themeMode) {
      case 'overload':
        return {
          wrapper: 'from-[#1a0505] via-[#0f0404] to-[#040000]',
          gridBorder: 'border-red-500/30',
          radialGrid: 'linear-gradient(rgba(239, 68, 68, 0.05) 50%, rgba(0, 0, 0, 0.25) 50%)',
          textAccent: 'text-red-400',
          titleBar: 'border-red-500/30 bg-red-950/20'
        };
      case 'stealth':
        return {
          wrapper: 'from-gray-950 via-[#020508] to-black',
          gridBorder: 'border-slate-800',
          radialGrid: 'none',
          textAccent: 'text-slate-500',
          titleBar: 'border-slate-800 bg-slate-900/40'
        };
      case 'party':
        return {
          wrapper: 'from-[#0a0518] via-[#050c18] to-black',
          gridBorder: 'border-purple-500/30',
          radialGrid: 'linear-gradient(rgba(147, 51, 234, 0.04) 50%, rgba(0, 0, 0, 0.2) 50%)',
          textAccent: 'text-purple-400',
          titleBar: 'border-purple-500/20 bg-purple-950/15'
        };
      default:
        return {
          wrapper: 'from-[#020914] via-[#040e1e] to-black',
          gridBorder: 'border-cyan-500/15',
          radialGrid: 'linear-gradient(rgba(0, 242, 254, 0.04) 50%, rgba(0, 0, 0, 0.25) 50%)',
          textAccent: 'text-cyan-400',
          titleBar: 'border-cyan-500/15 bg-cyan-950/10'
        };
    }
  };

  const themeStyle = getThemeStyles();

  if (authChecked && !user) {
    return <AuthScreen onAuthSuccess={(u) => setUser(u)} />;
  }

  return (
    <div className="min-h-screen bg-[#020617] text-[#94a3b8] flex flex-col jarvis-scanlines tech-grid transition-all duration-1000 select-none relative overflow-x-hidden">
      
      {/* Background Decorative Elements - Artistic Flair */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#0f172a,transparent)] pointer-events-none z-0" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/10 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Top Header Bar */}
      <header className="relative z-10 border-b border-cyan-500/20 pb-4 pt-6 mb-4 max-w-7xl mx-auto w-full px-5">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex items-start gap-3">
            <div className="relative flex items-center justify-center mt-1">
              <Zap id="stark_arc_indicator" className={`w-5 h-5 animate-pulse text-cyan-400 transition-colors duration-1000 ${
                themeMode === 'overload' ? 'text-red-500 animate-spin' : themeMode === 'party' ? 'text-purple-400' : 'text-cyan-400'
              }`} />
              <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur animate-ping h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xs font-mono tracking-[0.3em] uppercase text-cyan-400">System.Identity.Polley_Infinity</h1>
              <p className="text-2xl font-light text-slate-100 tracking-tight">Autonomous Operating System</p>
              <div className="flex items-center gap-2 mt-1 px-2 py-0.5 bg-cyan-500/5 border border-cyan-500/10 rounded w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">Developer:</span>
                <span className="text-[9px] font-mono text-cyan-300 font-bold uppercase tracking-widest">Ankon Polley</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-6 text-right font-mono text-[10px] items-center w-full sm:w-auto justify-between sm:justify-end">
            <div className="border-r border-cyan-500/20 pr-6 text-left sm:text-right">
              <p className="text-[10px] font-mono uppercase opacity-50">Connection</p>
              <p className="text-cyan-400 font-mono font-bold">STABLE // SECURE</p>
            </div>
            <div className="border-r border-cyan-500/20 pr-6 text-left sm:text-right hidden sm:block">
              <p className="text-[10px] font-mono uppercase opacity-50">Uptime</p>
              <p className="text-slate-100 font-mono">142:12:04:{stats.uptimeSeconds.toString().padStart(2, '0')}</p>
            </div>
            {user && (
              <div className="border-r border-cyan-500/20 pr-6 text-left sm:text-right hidden md:block">
                <p className="text-[10px] font-mono uppercase opacity-50">Operator Identity</p>
                <div className="flex items-center gap-1.5 justify-end">
                  <span className={`w-1.5 h-1.5 rounded-full ${user.provider === 'google' ? 'bg-blue-400 animate-pulse' : user.provider === 'proton' ? 'bg-[#bca6ff] animate-pulse' : 'bg-emerald-400'}`} />
                  <p className="text-slate-100 font-mono font-bold uppercase">{user.name}</p>
                </div>
              </div>
            )}
            {user && (
              <button 
                id="polley_logout_btn"
                onClick={() => {
                  playSound('warning');
                  localStorage.removeItem('polley_infinity_session');
                  setUser(null);
                }}
                className="flex items-center gap-1.5 bg-red-950/30 hover:bg-red-900/40 text-red-400 border border-red-500/40 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer hover:border-red-500/70 shadow-[0_0_15px_rgba(239,68,68,0.15)] hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-fadeIn"
                title="Log Out Active Core Identity"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                LOG OUT
              </button>
            )}
            {/* Quick manual theme buttons */}
            <div className="flex bg-slate-900/40 border border-slate-800 p-0.5 rounded gap-1">
              {(['slate', 'stealth', 'overload', 'party'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => {
                    playSound('click');
                    setThemeMode(t);
                    if (t === 'overload') setJarvisStatus('warning');
                    else if (jarvisStatus === 'warning') setJarvisStatus('idle');
                  }}
                  className={`px-1.5 py-0.5 text-[8px] uppercase tracking-wider rounded transition-colors ${
                    themeMode === t 
                      ? 'bg-cyan-500/20 text-cyan-200 font-bold border border-cyan-400/20' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-5 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Visual HUD and Control Terminal - 7 columns */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Main Visualizer & Core Circle Widget */}
          <section className={`bg-slate-950/40 border ${themeStyle.gridBorder} rounded-2xl backdrop-blur-tech transition-colors duration-500 relative`}>
            {/* Ambient indicator decorations */}
            <div className="absolute top-4 left-4 font-mono text-[9px] text-cyan-400/40 uppercase tracking-widest">
              SYSTEM RE-ENTRY MODULE [MARK_85]
            </div>

            <div className="absolute top-4 right-4 flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${micActive ? 'bg-emerald-400 animate-ping' : 'bg-cyan-500/30'}`} />
              <span className="font-mono text-[8px] text-cyan-400/50 uppercase tracking-wider">
                {micActive ? 'VOICE LINK ACTIVE' : 'STANDBY'}
              </span>
            </div>

            {/* Dynamic Interactive Hologram */}
            <HologramRing 
              status={jarvisStatus} 
              onRingClick={toggleListening}
              arcPower={stats.arcPower}
            />

            {/* Microphone Activator Toggle bar */}
            <div className="border-t border-cyan-500/10 px-6 py-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-display text-xs font-semibold text-slate-200">
                  {micActive ? 'TRANSLATING SIR\'S VOCALS' : 'VOCAL LINK CHANNELS'}
                </div>
                <div className="font-mono text-[9px] text-cyan-500/40 uppercase">
                  {micActive ? 'Hold space to cycle or double-tap matrix' : 'Press mic icon or hold screen ring'}
                </div>
              </div>

              <div className="flex gap-2.5">
                <button
                  onClick={toggleListening}
                  className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all ${
                    micActive 
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                      : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20'
                  }`}
                  title={micActive ? 'Silence Link' : 'Open Vocal Link'}
                >
                  {micActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </section>

          {/* Secure Sandbox Web Browser Component */}
          {isBrowserOpen && (
            <section className="bg-slate-950/70 border border-cyan-500/25 rounded-2xl p-4.5 backdrop-blur-md relative shadow-[0_0_25px_rgba(34,211,238,0.15)] transition-all duration-300">
              <div className="flex items-center justify-between border-b border-cyan-500/10 pb-3 mb-3.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer" onClick={() => { playSound('click'); setIsBrowserOpen(false); }} title="Close webview" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="text-slate-400 font-mono text-[9px] uppercase font-bold ml-2 tracking-wider">Polley-Infinity Visual Web Sandbox v1.2</span>
                </div>
                <button 
                  onClick={() => { playSound('click'); setIsBrowserOpen(false); }}
                  className="text-slate-500 hover:text-slate-300 font-mono text-[9px] uppercase border border-slate-800 rounded px-2 py-0.5"
                >
                  Close
                </button>
              </div>

              {/* Browser URL Input Bar */}
              <div className="flex items-center gap-2 bg-black/55 border border-cyan-500/20 rounded-lg px-3 py-2 mb-4 text-xs font-mono">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  🔒 Secure
                </span>
                <span className="text-slate-600">|</span>
                <input 
                  type="text" 
                  value={currentBrowserUrl} 
                  onChange={(e) => setCurrentBrowserUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      playSound('success');
                      setBrowserSearchQuery(currentBrowserUrl);
                    }
                  }}
                  className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-600 focus:outline-none"
                />
                <button 
                  onClick={() => {
                    playSound('success');
                    setBrowserSearchQuery(currentBrowserUrl);
                  }}
                  className="text-cyan-400 border border-cyan-400/20 hover:bg-cyan-500/10 px-3 py-0.5 rounded text-[10px]"
                >
                  Go
                </button>
              </div>

              {/* Simulated Visual Sandbox content view area */}
              <div className="h-56 bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl font-mono text-[11px] overflow-y-auto leading-relaxed text-slate-300 scrollbar-thin">
                <div className="text-[10px] text-cyan-400/40 mb-2 uppercase border-b border-slate-800 pb-1.5 flex justify-between items-center">
                  <span>DOM Matrix Render</span>
                  <span>Status: Transmitting</span>
                </div>
                
                {browserSearchQuery ? (
                  <div className="space-y-3.5">
                    <p className="text-cyan-400 font-bold">🔍 Live Sandbox Search Results for: "{browserSearchQuery}"</p>
                    <div className="bg-black/25 p-2 rounded border border-slate-800/50 space-y-1">
                      <p className="text-slate-400 font-semibold">[1] Polley-Infinity Smart OS Release Notes</p>
                      <p className="text-slate-500 text-[10px]">Polley-Infinity includes full dual-layered offline parser hooks and AI deep-search integrations...</p>
                    </div>
                    <div className="bg-black/25 p-2 rounded border border-slate-800/50 space-y-1">
                      <p className="text-slate-400 font-semibold">[2] Malibu Base Advanced Defense Grids</p>
                      <p className="text-slate-500 text-[10px]">Configured thermal controllers, auxiliary shields, sub-orbital thrusters details...</p>
                    </div>
                    <p className="text-slate-500 text-[9px] italic">Showing offline sandbox simulated web elements inside safe iframe boundary.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center py-4 space-y-2">
                      <p className="text-cyan-400 text-xs font-bold uppercase tracking-wider">Welcome to Polley-Infinity Web Portal</p>
                      <p className="text-slate-400 max-w-sm mx-auto text-[10px]">You have bypassed iframe security boundaries via our secure express gateway. Type a URL or keyword in the navigation bar above and click Go.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                      <div 
                        className="bg-black/20 hover:bg-black/40 border border-slate-800 hover:border-cyan-500/20 p-2 rounded cursor-pointer transition-colors"
                        onClick={() => {
                          playSound('click');
                          setCurrentBrowserUrl('https://stark-archives.org/mark-85');
                          setBrowserSearchQuery('https://stark-archives.org/mark-85');
                        }}
                      >
                        🌐 stark-archives.org/mark-85
                      </div>
                      <div 
                        className="bg-black/20 hover:bg-black/40 border border-slate-800 hover:border-cyan-500/20 p-2 rounded cursor-pointer transition-colors"
                        onClick={() => {
                          playSound('click');
                          setCurrentBrowserUrl('https://wikipedia.org/wiki/Infinity_Formula');
                          setBrowserSearchQuery('https://wikipedia.org/wiki/Infinity_Formula');
                        }}
                      >
                        📚 wikipedia.org/wiki/Infinity
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Scrolling Terminal Chat logs */}
          <section>
            <TerminalShell 
              logs={logs} 
              onCommandSubmit={handleDirectiveInput} 
              isProcessing={isProcessing}
            />
          </section>

          {/* Quick directives help cheatsheet */}
          <section className="bg-slate-950/20 border border-slate-900 rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-slate-400 mb-2">
              <HelpCircle className="w-4 h-4 text-cyan-500/60" />
              <span className="font-mono text-[10px] uppercase font-bold tracking-wider">Sir's Suggested Directives Help Cheat-Sheet</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono text-slate-500">
              {HELP_COMMANDS.map((hel, idx) => (
                <div 
                  key={idx}
                  onClick={() => {
                    playSound('click');
                    // Inject command directly into target console
                    const inputElement = document.getElementById('jarvis_command_input') as HTMLInputElement;
                    if (inputElement) {
                      inputElement.value = hel.cmd;
                      inputElement.focus();
                    }
                  }}
                  className="bg-black/25 border border-slate-900 rounded p-2 hover:border-cyan-500/10 cursor-pointer hover:bg-cyan-950/5 group text-left transition-colors"
                >
                  <span className="text-slate-400 block group-hover:text-cyan-300 transition-colors uppercase">{hel.text}:</span>
                  <span className="text-cyan-400/50 block font-light mt-0.5">"{hel.cmd}"</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: IoT Grids, Live Metrics and drive mainframes - 5 columns */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Diagnostic Stats monitors */}
          <section>
            <SystemMonitor 
              stats={stats} 
              onTriggerDiagnostics={runDiagnosticsCheck}
              isRunningDiagnostics={isRunningDiagnostics}
            />
          </section>

          {/* Network Connections */}
          <section>
            <NetworkMap />
          </section>

          {/* IoT Smart controllers states */}
          <section>
            <IoTGrid 
              devices={devices} 
              onUpdateDevice={(id, updates) => {
                setDevices(prev => prev.map(dev => {
                  if (dev.id === id) {
                    return { ...dev, ...updates };
                  }
                  return dev;
                }));
              }}
            />
          </section>

          {/* Simulated File explorer workspace drive */}
          <section>
            <SimulatedDrive 
              files={files}
              onSelectFile={setSelectedFile}
              onDeleteFile={(id) => {
                setFiles(prev => prev.filter(f => f.id !== id));
              }}
              onCreateFile={(name, content) => {
                const newFile: VirtualFile = {
                  id: `f-${Date.now()}`,
                  name,
                  content,
                  size: content.length,
                  updatedAt: new Date().toISOString()
                };
                setFiles(prev => [newFile, ...prev]);
                setSelectedFile(newFile);
              }}
              selectedFile={selectedFile}
            />
          </section>
        </div>
      </main>

      {/* Bottom Status Bar with Developer Credentials */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-5 mt-10 border-t border-cyan-500/10 pt-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[10px] font-mono text-slate-500">
          
          {/* Developer identity details */}
          <div className="space-y-1 text-center md:text-left">
            <p className="text-cyan-400 font-bold uppercase tracking-wider text-[9px]">DEVELOPER CREDENTIALS</p>
            <p className="text-slate-200 font-semibold text-xs tracking-tight">ANKON POLLEY</p>
            <p className="text-slate-500 uppercase tracking-widest text-[8px]">Primary Cybernetic Architect & System Author</p>
          </div>

          {/* Secure Interactive Mail connections */}
          <div className="space-y-1 text-center bg-cyan-950/5 border border-cyan-500/5 rounded-lg py-2 px-3">
            <p className="text-slate-400 font-bold uppercase tracking-wider text-[8px] mb-1">SECURE CONTACT PROTOCOLS</p>
            <div className="flex flex-col gap-0.5 items-center">
              <span className="text-slate-300">
                Google: <a href="mailto:ankonpolley@gmail.com" className="text-cyan-400 hover:text-cyan-300 transition-colors font-bold hover:underline">ankonpolley@gmail.com</a>
              </span>
              <span className="text-slate-300">
                Proton: <a href="mailto:ankonpolley@proton.me" className="text-[#cebfff] hover:text-[#dfd6ff] transition-colors font-bold hover:underline">ankonpolley@proton.me</a>
              </span>
            </div>
          </div>

          {/* Telemetry and copyright */}
          <div className="space-y-1 text-center md:text-right flex flex-col md:items-end justify-center">
            <div className="flex gap-4 justify-center md:justify-end">
              <span>ENCRYPTION: AES-512</span>
              <span>PROTOCOL: MARK-VIII</span>
              <span>LOC: MALIBU</span>
            </div>
            <div className="flex gap-4 justify-center md:justify-end text-slate-400 font-bold mt-1">
              <span className="text-cyan-400 font-mono">V-OS 12.4.0</span>
              <span>© {new Date().getFullYear()} POLLEY-INFINITY GRID</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Dangerous/Priority full-screen alarm trigger countdown widgets */}
      <CountdownsPanel countdown={countdown} onCancel={handleCancelCountdown} />
    </div>
  );
}
