import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  LogIn, 
  UserPlus, 
  KeyRound, 
  Mail, 
  Fingerprint, 
  Globe, 
  Sparkles, 
  User, 
  Lock, 
  Check, 
  RefreshCw,
  Info
} from 'lucide-react';
import { playSound } from '../utils/audioSynthesizer';

interface UserProfile {
  email: string;
  name: string;
  provider: 'email' | 'google' | 'proton';
  token?: string;
}

interface AuthScreenProps {
  onAuthSuccess: (user: UserProfile) => void;
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Simulated Overlay Modals
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [googleStep, setGoogleStep] = useState<'select' | 'handshake' | 'complete'>('select');
  const [selectedGoogleEmail, setSelectedGoogleEmail] = useState('ankonpolley@gmail.com');
  
  const [protonModalOpen, setProtonModalOpen] = useState(false);
  const [protonStep, setProtonStep] = useState<'credentials' | 'srp' | 'complete'>('credentials');
  const [protonUsername, setProtonUsername] = useState('');
  const [protonPassword, setProtonPassword] = useState('');
  const [protonLog, setProtonLog] = useState<string[]>([]);

  // Sound cues on mount
  useEffect(() => {
    playSound('chime');
  }, []);

  // Form submit handlers
  const handleLocalAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all core access parameters.');
      playSound('warning');
      return;
    }

    if (isRegistering && !name) {
      setError('A subjective user moniker (Name) is required.');
      playSound('warning');
      return;
    }

    setLoading(true);
    playSound('click');

    setTimeout(() => {
      setLoading(false);
      // Read users from localStorage
      const savedUsersStr = localStorage.getItem('polley_infinity_users') || '[]';
      const savedUsers = JSON.parse(savedUsersStr) as UserProfile[];

      if (isRegistering) {
        // Prevent duplicate registration
        if (savedUsers.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
          setError('This identity matrix already exists in local database.');
          playSound('warning');
          return;
        }

        const newUser: UserProfile = {
          email: email.trim(),
          name: name.trim(),
          provider: 'email',
          token: `tok_${Math.random().toString(36).substr(2, 9)}`
        };

        savedUsers.push(newUser);
        localStorage.setItem('polley_infinity_users', JSON.stringify(savedUsers));
        localStorage.setItem('polley_infinity_session', JSON.stringify(newUser));
        
        playSound('success');
        onAuthSuccess(newUser);
      } else {
        // Authenticate locally
        const existing = savedUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
        if (!existing) {
          setError('No recorded matrix found for this email block.');
          playSound('warning');
          return;
        }

        localStorage.setItem('polley_infinity_session', JSON.stringify(existing));
        playSound('success');
        onAuthSuccess(existing);
      }
    }, 1200);
  };

  // Google authentication simulation logic
  const handleGoogleClick = () => {
    playSound('click');
    setGoogleStep('select');
    setGoogleModalOpen(true);
  };

  const triggerGoogleHandshake = (emailChoice: string) => {
    setGoogleStep('handshake');
    playSound('chime');
    
    setTimeout(() => {
      const gUser: UserProfile = {
        email: emailChoice,
        name: emailChoice === 'ankonpolley@gmail.com' ? 'Ankon Polley' : emailChoice.split('@')[0],
        provider: 'google',
        token: `g_tok_${Math.random().toString(36).substr(2, 9)}`
      };

      // Persist user locally
      const savedUsersStr = localStorage.getItem('polley_infinity_users') || '[]';
      const savedUsers = JSON.parse(savedUsersStr);
      if (!savedUsers.some((u: any) => u.email.toLowerCase() === gUser.email.toLowerCase())) {
        savedUsers.push(gUser);
        localStorage.setItem('polley_infinity_users', JSON.stringify(savedUsers));
      }

      localStorage.setItem('polley_infinity_session', JSON.stringify(gUser));
      setGoogleStep('complete');
      playSound('success');

      setTimeout(() => {
        setGoogleModalOpen(false);
        onAuthSuccess(gUser);
      }, 1000);
    }, 1800);
  };

  // Proton authentication simulation logic
  const handleProtonClick = () => {
    playSound('click');
    setProtonStep('credentials');
    setProtonUsername('');
    setProtonPassword('');
    setProtonLog([]);
    setProtonModalOpen(true);
  };

  const triggerProtonSRP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!protonUsername) return;
    playSound('click');
    setProtonStep('srp');
    
    const logs = [
      "Connecting to Proton Cryptographic Key Server...",
      "Requesting SRP user parameters...",
      "Generating ephemeral keys: Client a and Server B...",
      "Performing zero-knowledge cryptographic multiplier check...",
      "Decrypting user secret credentials block...",
      "HMAC Verification: Successful.",
      "Access token signed with active Proton-RSA passphrase!"
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        setProtonLog(prev => [...prev, `[PROTO] ${logs[currentLogIndex]}`]);
        playSound('click');
        currentLogIndex++;
      } else {
        clearInterval(interval);
        
        const fullUsername = protonUsername.includes('@') ? protonUsername : `${protonUsername}@proton.me`;
        const pUser: UserProfile = {
          email: fullUsername,
          name: protonUsername.split('@')[0].toUpperCase(),
          provider: 'proton',
          token: `p_tok_${Math.random().toString(36).substr(2, 9)}`
        };

        // Persist user locally
        const savedUsersStr = localStorage.getItem('polley_infinity_users') || '[]';
        const savedUsers = JSON.parse(savedUsersStr);
        if (!savedUsers.some((u: any) => u.email.toLowerCase() === pUser.email.toLowerCase())) {
          savedUsers.push(pUser);
          localStorage.setItem('polley_infinity_users', JSON.stringify(savedUsers));
        }

        localStorage.setItem('polley_infinity_session', JSON.stringify(pUser));
        setProtonStep('complete');
        playSound('success');

        setTimeout(() => {
          setProtonModalOpen(false);
          onAuthSuccess(pUser);
        }, 1200);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-[#94a3b8] flex flex-col items-center justify-center relative p-5 select-none overflow-hidden jarvis-scanlines tech-grid">
      {/* Background Artistic Orbs */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,#0f172a,transparent)] pointer-events-none z-0" />
      <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-cyan-950/15 blur-[160px] rounded-full pointer-events-none z-0 animate-pulse" />
      <div className="absolute bottom-[20%] right-[20%] w-[450px] h-[450px] bg-indigo-950/20 blur-[150px] rounded-full pointer-events-none z-0" />

      {/* Outer Hologram rings for background atmosphere */}
      <div className="absolute w-[600px] h-[600px] border border-cyan-500/5 rounded-full pointer-events-none z-0 spin-hud-slow" />
      <div className="absolute w-[450px] h-[450px] border border-dashed border-cyan-500/10 rounded-full pointer-events-none z-0" />
      
      {/* Main Connection Terminal Panel */}
      <div id="polley_auth_panel" className="relative z-10 w-full max-w-md bg-[#020617]/80 border border-cyan-500/25 p-8 rounded-2xl backdrop-blur-md shadow-[0_0_50px_rgba(34,211,238,0.1)] transition-all duration-300">
        
        {/* Core cybernetic arc icon */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative w-16 h-16 rounded-full border border-cyan-400 flex items-center justify-center bg-cyan-500/10 mb-4 shadow-[0_0_20px_rgba(34,211,238,0.25)]">
            <Fingerprint className="w-8 h-8 text-cyan-400 animate-pulse" />
            <div className="absolute inset-0 border border-dashed border-cyan-400/30 rounded-full animate-spin duration-3000" />
          </div>
          <h1 className="text-sm font-mono tracking-[0.4em] uppercase text-cyan-400">INTERFACE MATRIX</h1>
          <h2 className="text-2xl font-light text-slate-100 mt-1 tracking-tight">Connect Polley-Infinity</h2>
          <p className="text-[10px] font-mono text-cyan-500/50 uppercase tracking-wider mt-1.5 leading-relaxed max-w-xs">
            Zero-knowledge encrypted operating gateway node
          </p>
        </div>

        {/* Action Selection Tabs */}
        <div className="grid grid-cols-2 bg-slate-900/40 border border-slate-800 p-0.5 rounded-lg mb-6 text-xs font-mono">
          <button 
            type="button"
            onClick={() => { playSound('click'); setIsRegistering(false); setError(''); }}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-md transition-colors ${!isRegistering ? 'bg-cyan-500/20 text-cyan-300 font-semibold border-b-2 border-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <LogIn className="w-3.5 h-3.5" />
            INITIALIZE CONTEXT
          </button>
          <button 
            type="button"
            onClick={() => { playSound('click'); setIsRegistering(true); setError(''); }}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-md transition-colors ${isRegistering ? 'bg-cyan-500/20 text-cyan-300 font-semibold border-b-2 border-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            REGISTER IDENTITY
          </button>
        </div>

        {/* Error HUD indicator */}
        {error && (
          <div className="mb-4 bg-red-950/20 border border-red-500/30 text-red-400 rounded-lg p-3 text-xs font-mono flex items-start gap-2.5 animate-shake">
            <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 animate-pulse shrink-0" />
            <div className="leading-relaxed">
              <span className="font-bold uppercase block text-[10px] tracking-wide mb-0.5">GRID ALIGNMENT FAILURE</span>
              {error}
            </div>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleLocalAuth} className="space-y-4">
          {isRegistering && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">SUBJECT MONIKER (Full Name)</label>
              <div className="relative bg-black/40 border border-slate-800 rounded-lg focus-within:border-cyan-500/55 transition-colors">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <User className="w-4 h-4" />
                </span>
                <input 
                  type="text"
                  placeholder="e.g. Tony Stark"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent border-none text-slate-200 placeholder-slate-700 py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:ring-0 font-mono"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">IDENTITY ADDRESS (Email Address)</label>
            <div className="relative bg-black/40 border border-slate-800 rounded-lg focus-within:border-cyan-500/55 transition-colors">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                <Mail className="w-4 h-4" />
              </span>
              <input 
                type="email"
                placeholder="ankonpolley@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-none text-slate-200 placeholder-slate-700 py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:ring-0 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">PASS KEY (Secure Password)</label>
            <div className="relative bg-black/40 border border-slate-800 rounded-lg focus-within:border-cyan-500/55 transition-colors">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                <Lock className="w-4 h-4" />
              </span>
              <input 
                type="password"
                placeholder="••••••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-none text-slate-200 placeholder-slate-700 py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:ring-0 font-mono"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 py-3 rounded-lg text-xs font-mono font-bold uppercase transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group tracking-wider hover:border-cyan-400"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                INITIATING SYNAPSE INTERACTION...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                {isRegistering ? 'CONSTRUCT SECURE PROFILE' : 'AUTHENTICATE SECURE CHANNELS'}
              </>
            )}
          </button>
        </form>

        {/* Divider separator lines */}
        <div className="relative my-7 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800/80" />
          </div>
          <span className="relative px-3 bg-[#020617] text-[10px] font-mono text-slate-600 uppercase tracking-widest">
            OR INITIALIZE FEDERATION
          </span>
        </div>

        {/* Federated Logins: Google and Proton */}
        <div className="grid grid-cols-2 gap-3.5">
          <button 
            type="button"
            onClick={handleGoogleClick}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-[#4285F4]/30 bg-[#4285F4]/5 hover:bg-[#4285F4]/10 transition-colors group relative overflow-hidden cursor-pointer"
          >
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#4285F4]/20 group-hover:bg-[#4285F4]/40" />
            <Globe className="w-5 h-5 text-[#4285F4] mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-mono uppercase font-bold tracking-wide text-slate-200">Google Account</span>
            <span className="text-[8px] font-mono text-[#4285F4]/70 mt-0.5">MAPPED FEDERATION</span>
          </button>

          <button 
            type="button"
            onClick={handleProtonClick}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-[#6D4AFF]/30 bg-[#6D4AFF]/5 hover:bg-[#6D4AFF]/10 transition-colors group relative overflow-hidden cursor-pointer"
          >
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#6D4AFF]/20 group-hover:bg-[#6D4AFF]/40" />
            <KeyRound className="w-5 h-5 text-[#7FFF7F] mb-1.5 group-hover:scale-110 transition-transform" style={{ color: '#ae91ff' }} />
            <span className="text-[10px] font-mono uppercase font-bold tracking-wide text-slate-200">Proton Secure</span>
            <span className="text-[8px] font-mono text-[#6D4AFF]/70 mt-0.5" style={{ color: '#bca6ff' }}>Z-K CRYPTOGRAPHIC</span>
          </button>
        </div>

        {/* Informative Security Disclaimer */}
        <div className="mt-6 flex items-start gap-2 text-[9px] font-mono text-slate-500 leading-normal text-center justify-center border-t border-slate-900/60 pt-4">
          <Info className="w-3.5 h-3.5 text-cyan-500/40 shrink-0 mt-0.5" />
          <span>Polley-Infinity ensures that your authentication hash parameters and cryptographic keys remain fully isolated and zero-knowledge.</span>
        </div>
      </div>

      {/* =======================================================
          SIMULATED GOOGLE OAUTH FLOW MODAL OVERLAY
          ======================================================= */}
      {googleModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#080d19] border border-[#4285F4]/40 p-6 rounded-xl shadow-[0_0_30px_rgba(66,133,244,0.15)] text-center font-mono">
            
            {googleStep === 'select' && (
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#4285F4]/10 border border-[#4285F4] flex items-center justify-center mx-auto mb-2 animate-bounce">
                  <Globe className="w-6 h-6 text-[#4285F4]" />
                </div>
                <h3 className="text-sm font-semibold uppercase text-slate-200 tracking-wider">Google Federated Account Sandbox</h3>
                <p className="text-[10px] text-slate-400 tracking-tight leading-relaxed">
                  Select a registered secure Google profile to link with the Polley-Infinity operating nodes:
                </p>
                
                <div className="space-y-2.5">
                  <button 
                    type="button"
                    onClick={() => triggerGoogleHandshake('ankonpolley@gmail.com')}
                    className="w-full flex items-center justify-between text-left p-3 rounded-lg border border-slate-800 hover:border-[#4285F4]/40 bg-black/30 hover:bg-[#4285F4]/5 transition-all text-xs"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-200">Ankon Polley</span>
                      <span className="text-[10px] text-[#4285F4]">ankonpolley@gmail.com</span>
                    </div>
                    <span className="text-[8px] bg-[#4285F4]/20 text-[#4285F4] border border-[#4285F4]/30 px-1.5 py-0.5 rounded font-bold uppercase">PRIMARY</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => triggerGoogleHandshake('infinity.stark@gmail.com')}
                    className="w-full flex items-center justify-between text-left p-3 rounded-lg border border-slate-800 hover:border-[#4285F4]/40 bg-black/30 hover:bg-[#4285F4]/5 transition-all text-xs"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-200">Stark Intelligence</span>
                      <span className="text-[10px] text-slate-500">infinity.stark@gmail.com</span>
                    </div>
                    <span className="text-[8px] text-slate-600 border border-slate-800 px-1.5 py-0.5 rounded font-bold uppercase">SECURE</span>
                  </button>
                </div>

                <div className="pt-2">
                  <button 
                    type="button"
                    onClick={() => { playSound('click'); setGoogleModalOpen(false); }}
                    className="text-slate-500 hover:text-slate-300 text-[10px] uppercase underline tracking-wider"
                  >
                    Abort Google Authorization
                  </button>
                </div>
              </div>
            )}

            {googleStep === 'handshake' && (
              <div className="space-y-4 py-8">
                <RefreshCw className="w-10 h-10 animate-spin text-[#4285F4] mx-auto mb-2" />
                <h3 className="text-sm font-semibold uppercase text-slate-200 tracking-wider">Securing Handshake Token</h3>
                <div className="text-[10px] text-slate-400 space-y-1 text-center bg-black/30 p-3 rounded border border-slate-800">
                  <p className="text-[#4285F4]">HANDSHAKING WITH COGNITIVE NODE...</p>
                  <p className="text-slate-500 text-[9px] font-mono italic">Authenticating via secure Google SSL gateway</p>
                  <p className="text-[9px] text-[#7FFF7F]/80">Profile confirmed: {selectedGoogleEmail}</p>
                </div>
              </div>
            )}

            {googleStep === 'complete' && (
              <div className="space-y-4 py-8">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-400 flex items-center justify-center mx-auto mb-2 animate-pulse">
                  <Check className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-sm font-semibold uppercase text-emerald-400 tracking-wider">Access Granted</h3>
                <p className="text-[10px] text-slate-400">
                  Identity linked successfully. Welcome back to Polley-Infinity, Comrade.
                </p>
              </div>
            )}

          </div>
        </div>
      )}


      {/* =======================================================
          SIMULATED PROTON SECURE SRP DIALOG OVERLAY
          ======================================================= */}
      {protonModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#090615] border border-[#6D4AFF]/40 p-6 rounded-xl shadow-[0_0_30px_rgba(109,74,255,0.15)] font-mono">
            
            <div className="flex items-center justify-between border-b border-[#6D4AFF]/20 pb-3 mb-4">
              <span className="text-[10px] font-bold text-[#bca6ff] uppercase tracking-wider block">Proton Zero-Knowledge SRP Authorization</span>
              <button 
                type="button" 
                onClick={() => { playSound('click'); setProtonModalOpen(false); }}
                className="text-slate-500 hover:text-[#ae91ff] text-xs font-bold leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            {protonStep === 'credentials' && (
              <form onSubmit={triggerProtonSRP} className="space-y-4">
                <p className="text-[10px] text-slate-400 leading-normal">
                  Authenticating via cryptographic Secure Remote Password protocol (SRP). Proton never transmits your cleartext passphrase:
                </p>

                <div className="space-y-1.5">
                  <label className="text-[9px] text-[#ae91ff] uppercase tracking-wider block font-bold">Proton ID (Username / Email)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="ankon.infinity or user@proton.me"
                    value={protonUsername}
                    onChange={(e) => setProtonUsername(e.target.value)}
                    className="w-full bg-black/50 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-700 p-2.5 text-xs focus:ring-1 focus:ring-[#6D4AFF]/50 focus:outline-none focus:border-[#6D4AFF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] text-[#ae91ff] uppercase tracking-wider block font-bold">Proton Passphrase</label>
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••••••••••"
                    value={protonPassword}
                    onChange={(e) => setProtonPassword(e.target.value)}
                    className="w-full bg-black/50 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-700 p-2.5 text-xs focus:ring-1 focus:ring-[#6D4AFF]/50 focus:outline-none focus:border-[#6D4AFF]"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#6D4AFF]/20 hover:bg-[#6D4AFF]/35 border border-[#6D4AFF]/50 text-[#cebfff] py-2.5 rounded-lg text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#ae91ff]" />
                  Compute Multiplier B & Verify SRP Key
                </button>
              </form>
            )}

            {protonStep === 'srp' && (
              <div className="space-y-4 py-3">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <RefreshCw className="w-5 h-5 animate-spin text-[#6D4AFF]" />
                  <span className="text-xs uppercase tracking-widest text-[#cebfff] font-bold">Processing SRP Verification...</span>
                </div>
                
                <div className="bg-black/50 border border-slate-800/80 p-3.5 rounded-lg text-[9px] text-slate-400 font-mono space-y-1 min-h-[140px] max-h-[160px] overflow-y-auto">
                  {protonLog.map((logLine, idx) => (
                    <div key={idx} className="transition-all duration-100 animate-fadeIn">
                      <span className="text-[#6D4AFF]">≫</span> {logLine}
                    </div>
                  ))}
                  <div className="w-1.5 h-3 bg-cyan-400/80 animate-ping inline-block mt-1" />
                </div>
                
                <p className="text-[8px] italic text-slate-500 text-center uppercase">Zero-knowledge secure remote mathematical verification active</p>
              </div>
            )}

            {protonStep === 'complete' && (
              <div className="space-y-4 py-6 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-400 flex items-center justify-center mx-auto mb-1 animate-pulse">
                  <Check className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-sm font-semibold uppercase text-emerald-400 tracking-wider">Matrix Integration Verified</h3>
                <p className="text-[10px] text-slate-400">
                  Zero-Knowledge SRP signature successful. Welcome to the infinite deck, Comrade.
                </p>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
