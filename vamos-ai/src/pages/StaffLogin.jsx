import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VALID_CREDENTIALS = [
  { username: 'admin', password: 'admin123', name: 'ADMIN_ROOT', tier: 'TIER 5 — FULL ACCESS' },
  { username: 'operator', password: 'ops2026', name: 'OPERATOR_01', tier: 'TIER 4 ACCESS' },
  { username: 'staff', password: 'staff123', name: 'STAFF_FIELD', tier: 'TIER 2 ACCESS' },
];

const StaffLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const match = VALID_CREDENTIALS.find(
        (c) => c.username === username.toLowerCase() && c.password === password
      );

      if (match) {
        onLogin({ name: match.name, tier: match.tier });
        navigate('/command');
      } else {
        setError('AUTHENTICATION_FAILED: Invalid credentials');
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-[100dvh] bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(223,255,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(223,255,0,1) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}></div>

      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-5 z-[100]" style={{
        background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
        backgroundSize: '100% 4px'
      }}></div>

      <div className="w-full max-w-md z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-cyber-volt/10 border border-cyber-volt/20 px-4 py-1.5 rounded mb-6">
            <span className="w-2 h-2 rounded-full bg-cyber-volt animate-pulse"></span>
            <span className="font-label-caps text-[10px] text-cyber-volt tracking-widest">SECURE_TERMINAL</span>
          </div>
          <h1 className="text-headline-lg font-bold italic uppercase tracking-tighter text-cyber-volt" style={{ textShadow: '0 0 20px rgba(223,255,0,0.3)' }}>
            STADIUMIQ
          </h1>
          <p className="text-label-caps text-on-surface-variant/60 mt-2 tracking-widest">COMMAND CENTER ACCESS</p>
        </div>

        {/* Login Card */}
        <div className="glass-panel p-8 relative">
          <div className="absolute top-3 right-4 tech-id">AUTH_GATEWAY_v3.1</div>

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div className="space-y-2">
              <label className="text-label-caps text-on-surface-variant/80 text-[10px] tracking-widest block">OPERATOR_ID</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-cyber-volt/40 text-lg">badge</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username..."
                  className="w-full bg-black/60 border border-white/10 rounded py-3 pl-11 pr-4 text-sm text-primary font-mono focus:border-cyber-volt focus:outline-none transition-all placeholder:text-white/20"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-label-caps text-on-surface-variant/80 text-[10px] tracking-widest block">ACCESS_KEY</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-cyber-volt/40 text-lg">lock</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password..."
                  className="w-full bg-black/60 border border-white/10 rounded py-3 pl-11 pr-4 text-sm text-primary font-mono focus:border-cyber-volt focus:outline-none transition-all placeholder:text-white/20"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-[#ffb4ab]/10 border border-[#ffb4ab]/30 text-[#ffb4ab] px-4 py-2.5 text-xs font-label-caps flex items-center gap-2 rounded fade-in">
                <span className="material-symbols-outlined text-sm">error</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-cyber-volt text-black font-label-caps py-3 text-sm tracking-widest hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">autorenew</span>
                  AUTHENTICATING...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">login</span>
                  AUTHORIZE_ACCESS
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/5">
            <p className="text-[9px] font-label-caps text-on-surface-variant/40 text-center tracking-widest">
              AUTHORIZED PERSONNEL ONLY • ALL ACCESS IS LOGGED
            </p>
          </div>
        </div>

        {/* Demo credentials hint */}
        <div className="mt-6 glass-panel p-4 border-dashed border-cyber-volt/20">
          <p className="text-[10px] font-label-caps text-cyber-volt/60 mb-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">info</span>
            DEMO CREDENTIALS
          </p>
          <div className="grid grid-cols-3 gap-2 text-[9px] font-mono text-on-surface-variant/60">
            <div><span className="text-cyber-volt/80">admin</span> / admin123</div>
            <div><span className="text-cyber-volt/80">operator</span> / ops2026</div>
            <div><span className="text-cyber-volt/80">staff</span> / staff123</div>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <button onClick={() => navigate('/')} className="text-on-surface-variant/40 text-[10px] font-label-caps hover:text-cyber-volt transition-colors flex items-center gap-1 mx-auto">
            <span className="material-symbols-outlined text-[12px]">arrow_back</span>
            RETURN TO COMPANION
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;
