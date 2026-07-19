import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const AppShell = ({ children, staff, onLogout }) => {
  const location = useLocation();
  const [matchTime, setMatchTime] = useState(74 * 60 + 17);

  // Tick match time
  useEffect(() => {
    const timer = setInterval(() => setMatchTime(p => p + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const mins = Math.floor(matchTime / 60);
  const activePath = location.pathname;

  return (
    <div className="bg-black text-[#e5e2e1] min-h-screen font-body-md selection:bg-cyber-volt selection:text-black flex flex-col">
      <style>{`
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          font-size: 11px;
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #888;
          border-left: 2px solid transparent;
          transition: all 0.2s ease;
        }
        .sidebar-link:hover {
          color: #DFFF00;
          background: rgba(223, 255, 0, 0.03);
        }
        .sidebar-link.active {
          color: #DFFF00;
          background: rgba(223, 255, 0, 0.06);
          border-left-color: #DFFF00;
        }
      `}</style>

      {/* Top Global Command Bar */}
      <header className="h-16 border-b border-white/5 bg-black/60 backdrop-blur-xl flex justify-between items-center px-6 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-cyber-volt">bolt</span>
            <span className="font-bold tracking-tighter text-sm">VAMOS<span className="text-cyber-volt">AI</span></span>
          </Link>
          <span className="w-px h-6 bg-white/10" />
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-cyber-volt animate-pulse">● LIVE MATCHDAY</span>
            <span className="text-[11px] font-mono font-bold bg-white/5 px-2 py-0.5 rounded text-primary">
              TITANS 2 - 1 APEX ({mins}')
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {staff ? (
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-3 py-1 rounded">
              <span className="material-symbols-outlined text-sm text-cyber-volt">shield</span>
              <div className="text-left">
                <div className="text-[9px] font-bold leading-none">{staff.name}</div>
                <div className="text-[7px] text-on-surface-variant font-mono">{staff.tier}</div>
              </div>
              <button
                onClick={onLogout}
                className="material-symbols-outlined text-[#ffb4ab] hover:bg-white/10 p-1 rounded text-xs transition-colors"
                title="Logout Staff"
              >
                logout
              </button>
            </div>
          ) : (
            <Link to="/command" className="text-[9px] font-label-caps border border-white/15 px-3 py-1 hover:border-cyber-volt hover:text-cyber-volt transition-all">
              STAFF GATEWAY
            </Link>
          )}
          <div className="w-8 h-8 rounded-full border border-cyber-volt/20 bg-white/5 flex items-center justify-center">
            <span className="material-symbols-outlined text-cyber-volt text-sm">person</span>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 border-r border-white/5 bg-black/40">
          <div className="p-4 border-b border-white/5">
            <div className="text-[9px] font-label-caps text-on-surface-variant tracking-widest">Select Workspace</div>
          </div>
          <nav className="flex-grow py-2">
            <Link to="/companion" className={`sidebar-link ${activePath === '/companion' ? 'active' : ''}`}>
              <span className="material-symbols-outlined text-sm">sports_soccer</span>
              Fan Companion
            </Link>
            <Link to="/command" className={`sidebar-link ${activePath === '/command' ? 'active' : ''}`}>
              <span className="material-symbols-outlined text-sm">security</span>
              Ops Command Center
            </Link>
            <Link to="/optimus" className={`sidebar-link ${activePath === '/optimus' ? 'active' : ''}`}>
              <span className="material-symbols-outlined text-sm">smart_toy</span>
              Optimus Telemetry
            </Link>
          </nav>
          <div className="p-4 border-t border-white/5 text-[9px] font-mono text-on-surface-variant/40 text-center">
            STADIUMIQ v3.2.0 • OFFLINE AI
          </div>
        </aside>

        {/* Dynamic Page Container */}
        <main className="flex-grow p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-xl border-t border-white/5 flex justify-around py-2.5 md:hidden">
        {[
          { path: '/companion', icon: 'sports_soccer', label: 'Fan Hub' },
          { path: '/command', icon: 'security', label: 'Ops' },
          { path: '/optimus', icon: 'smart_toy', label: 'Optimus' }
        ].map(n => (
          <Link
            key={n.path}
            to={n.path}
            className={`flex flex-col items-center gap-1 text-[9px] font-label-caps tracking-wider transition-colors ${activePath === n.path ? 'text-cyber-volt font-bold' : 'text-on-surface-variant'}`}
          >
            <span className="material-symbols-outlined text-lg">{n.icon}</span>
            {n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default AppShell;
