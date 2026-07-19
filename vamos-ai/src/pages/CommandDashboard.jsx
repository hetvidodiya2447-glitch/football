import React, { useState, useEffect, useRef } from 'react';
import { createCopilotChat, sendMessageStream, getErrorMessage } from '../services/gemini';

// ─── Role → allowed tabs ────────────────────────────────────────────────────
const ROLE_ACCESS = {
  'TIER 5 — FULL ACCESS': ['LIVE_OPS', 'INCIDENTS', 'DISPATCH', 'REPORTING'],  // admin
  'TIER 4 ACCESS':        ['LIVE_OPS', 'INCIDENTS', 'DISPATCH', 'REPORTING'],  // operator
  'TIER 2 ACCESS':        ['LIVE_OPS', 'INCIDENTS'],                           // staff
};

const getTierKey = (tier) => {
  if (!tier) return 'TIER 2 ACCESS';
  if (tier.includes('5')) return 'TIER 5 — FULL ACCESS';
  if (tier.includes('4')) return 'TIER 4 ACCESS';
  return 'TIER 2 ACCESS';
};

// ─── Demo Credentials List ──────────────────────────────────────────────────
const VALID_CREDENTIALS = [
  { username: 'admin', password: 'admin123', name: 'ADMIN_ROOT', tier: 'TIER 5 — FULL ACCESS' },
  { username: 'operator', password: 'ops2026', name: 'OPERATOR_01', tier: 'TIER 4 ACCESS' },
  { username: 'staff', password: 'staff123', name: 'STAFF_FIELD', tier: 'TIER 2 ACCESS' },
];

const TAB_ICONS = {
  LIVE_OPS:  'sensors',
  INCIDENTS: 'warning_amber',
  DISPATCH:  'directions_run',
  REPORTING: 'bar_chart',
};

// ─── Module Content Subcomponents ──────────────────────────────────────────

const IncidentsModule = () => (
  <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-[#ffb4ab] text-black px-3 py-1 font-label-caps text-xs flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-black animate-pulse"></span>
          INCIDENTS_TRACKER
        </div>
        <span className="text-on-surface-variant text-[10px] font-label-caps">3 ACTIVE INCIDENTS</span>
      </div>
      <button className="bg-cyber-volt border border-black px-4 py-1.5 text-label-caps text-black hover:brightness-110 transition-all text-[10px]">
        LOG_NEW_INCIDENT
      </button>
    </div>

    <div className="space-y-4">
      {[
        { id: 'INC-001', priority: 'CRITICAL', title: 'Medical Emergency — Section B12', time: '3 min ago', assignee: 'UNIT_MEDIC_03', status: 'ACTIVE', color: '#ffb4ab' },
        { id: 'INC-002', priority: 'HIGH',     title: 'Gate 7 Congestion Alert',          time: '8 min ago', assignee: 'UNIT_ALPHA_9',  status: 'IN PROGRESS', color: '#DFFF00' },
        { id: 'INC-003', priority: 'MEDIUM',   title: 'Unauthorized access — Tunnel C',   time: '14 min ago', assignee: 'UNIT_SEC_01',  status: 'MONITORING', color: '#aac8ff' },
      ].map(inc => (
        <div key={inc.id} className="glass-panel p-5 hover:border-white/30 transition-colors cursor-pointer" style={{ borderLeftColor: inc.color, borderLeftWidth: 3 }}>
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <span className="tech-id">{inc.id}</span>
              <span className="px-2 py-0.5 text-[9px] font-label-caps rounded" style={{ background: `${inc.color}20`, color: inc.color }}>{inc.priority}</span>
            </div>
            <span className="text-on-surface-variant text-[10px]">{inc.time}</span>
          </div>
          <h3 className="text-primary font-bold mb-2">{inc.title}</h3>
          <div className="flex justify-between items-center">
            <span className="text-on-surface-variant text-xs font-mono">ASSIGNED: {inc.assignee}</span>
            <span className="text-[9px] font-label-caps px-2 py-0.5 border border-white/10" style={{ color: inc.color }}>{inc.status}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const DispatchModule = () => (
  <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-[#aac8ff] text-black px-3 py-1 font-label-caps text-xs flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-black animate-pulse"></span>
          DISPATCH_CONTROL
        </div>
        <span className="text-on-surface-variant text-[10px] font-label-caps">12 UNITS AVAILABLE</span>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {[
        { label: 'UNITS DEPLOYED', value: '8',  color: '#DFFF00' },
        { label: 'UNITS AVAILABLE', value: '12', color: '#aac8ff' },
        { label: 'UNITS ON BREAK', value: '3',  color: '#ffb4ab' },
      ].map(s => (
        <div key={s.label} className="glass-panel p-5">
          <div className="text-on-surface-variant font-label-caps text-[10px] mb-1">{s.label}</div>
          <div className="text-[48px] font-bold leading-none" style={{ color: s.color, textShadow: `0 0 10px ${s.color}50` }}>{s.value}</div>
        </div>
      ))}
    </div>

    <div className="glass-panel p-5">
      <h3 className="text-cyber-volt font-label-caps text-sm mb-4 flex items-center gap-2">
        <span className="w-1 h-4 bg-cyber-volt"></span>ACTIVE UNIT ROSTER
      </h3>
      <div className="space-y-3">
        {[
          { unit: 'ALPHA-9',  role: 'Crowd Control', zone: 'Sector D',     status: 'DEPLOYED',   color: '#DFFF00' },
          { unit: 'MEDIC-03', role: 'Medical',        zone: 'Section B12',  status: 'ON SCENE',   color: '#ffb4ab' },
          { unit: 'SEC-01',   role: 'Security',       zone: 'Tunnel C',     status: 'MONITORING', color: '#aac8ff' },
          { unit: 'OPS-07',   role: 'Operations',     zone: 'Gate 4',       status: 'STANDBY',    color: '#aac8ff' },
          { unit: 'BETA-2',   role: 'Crowd Control',  zone: 'North Stand',  status: 'AVAILABLE',  color: '#DFFF00' },
        ].map(u => (
          <div key={u.unit} className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 transition-colors rounded cursor-pointer">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-sm" style={{ color: u.color }}>person_pin_circle</span>
              <div>
                <div className="font-label-caps text-xs text-primary">{u.unit} — {u.role}</div>
                <div className="text-[10px] text-on-surface-variant font-mono">Zone: {u.zone}</div>
              </div>
            </div>
            <span className="text-[9px] font-label-caps px-2 py-0.5" style={{ background: `${u.color}15`, color: u.color }}>{u.status}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ReportingModule = () => (
  <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-[#DFFF00] text-black px-3 py-1 font-label-caps text-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-[12px]">analytics</span>
          REPORTING_CENTER
        </div>
      </div>
      <button className="bg-[#2a2a2a] border border-[#454932] px-4 py-1.5 text-label-caps text-white hover:border-cyber-volt transition-all text-[10px]">EXPORT_PDF</button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: 'TOTAL ATTENDANCE', value: '54,892', sub: '↑ 2.4% vs last match', color: '#DFFF00' },
        { label: 'INCIDENTS LOGGED',  value: '7',       sub: '3 resolved, 4 active',  color: '#ffb4ab' },
        { label: 'AVG GATE WAIT',     value: '4.2m',    sub: 'Down from 6.1m',        color: '#aac8ff' },
        { label: 'CONCESSION REVENUE', value: '₹8.4L',  sub: 'Target: ₹10L',         color: '#DFFF00' },
      ].map(m => (
        <div key={m.label} className="glass-panel p-5">
          <div className="text-[10px] font-label-caps text-on-surface-variant mb-1">{m.label}</div>
          <div className="text-[40px] font-bold leading-none" style={{ color: m.color }}>{m.value}</div>
          <div className="text-[10px] text-on-surface-variant mt-2 font-mono">{m.sub}</div>
        </div>
      ))}
    </div>

    <div className="glass-panel p-6">
      <h3 className="text-cyber-volt font-label-caps text-sm mb-4 flex items-center gap-2">
        <span className="w-1 h-4 bg-cyber-volt"></span>ZONE OCCUPANCY REPORT
      </h3>
      <div className="space-y-4">
        {[
          { zone: 'NORTH STAND', pct: 88, color: '#DFFF00' },
          { zone: 'SOUTH TERRACE', pct: 96, color: '#ffb4ab' },
          { zone: 'EAST WING', pct: 72, color: '#DFFF00' },
          { zone: 'WEST WING', pct: 55, color: '#aac8ff' },
          { zone: 'VIP BOXES', pct: 100, color: '#ffb4ab' },
        ].map(z => (
          <div key={z.zone}>
            <div className="flex justify-between text-[10px] font-label-caps mb-1">
              <span className="text-on-surface-variant">{z.zone}</span>
              <span style={{ color: z.color }}>{z.pct}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${z.pct}%`, background: z.color, boxShadow: `0 0 8px ${z.color}60` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const LiveOpsModule = ({ messages, input, setInput, handleCommand, handleRecommendationAction, isAiTyping, aiError }) => (
  <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
    {/* Metrics Row */}
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="glass-panel p-5 relative overflow-hidden">
        <div className="tech-id mb-2">METRIC_ATTENDANCE_01</div>
        <div className="font-label-caps text-[9px] text-on-surface-variant opacity-60">TOTAL ATTENDANCE</div>
        <div className="font-display-xl text-[36px] font-bold leading-tight text-cyber-volt mt-1">54,892</div>
        <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-cyber-volt w-[91.5%]"></div>
        </div>
      </div>

      <div className="glass-panel p-5 relative overflow-hidden">
        <div className="tech-id mb-2">METRIC_FLOW_02</div>
        <div className="font-label-caps text-[9px] text-on-surface-variant opacity-60">GATE_FLOW_RATE</div>
        <div className="font-display-xl text-[36px] font-bold leading-tight text-white mt-1">142<span className="text-sm opacity-40">/min</span></div>
      </div>

      <div className="glass-panel p-5 relative overflow-hidden">
        <div className="tech-id mb-2">METRIC_LOGISTICS_03</div>
        <div className="font-label-caps text-[9px] text-on-surface-variant opacity-60">CONCESSION_LOAD</div>
        <div className="font-display-xl text-[36px] font-bold leading-tight text-white mt-1">78<span className="text-sm opacity-40">%</span></div>
      </div>
    </section>

    {/* AI Copilot Terminal */}
    <section className="glass-panel border-cyber-volt/30 p-1 relative overflow-hidden group">
      <div className="bg-cyber-volt text-black px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-sm">neurology</span>
          <h3 className="font-label-caps text-[11px] font-bold tracking-widest italic">COPILOT_IQ // COGNITIVE TERMINAL</h3>
        </div>
        <div className="flex items-center gap-2">
          {isAiTyping && <span className="text-[9px] font-label-caps animate-pulse">THINKING...</span>}
          <div className="flex items-center gap-1 text-[8px] font-label-caps px-2 py-0.5 border border-black/40 text-black/60">
            <span className="material-symbols-outlined text-[10px]">check_circle</span>
            LOCAL RAG
          </div>
        </div>
      </div>
      <div className="p-6 h-80 flex flex-col font-mono text-sm overflow-hidden bg-black/40">
        <div className="flex-grow space-y-4 overflow-y-auto mb-4 pr-2">
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2">
              <span className={`shrink-0 font-bold ${msg.sender === 'User' ? 'text-[#aac8ff]' : 'text-cyber-volt'}`}>&gt;</span>
              <div className="space-y-2 w-full">
                {!msg.isRecommendation ? (
                  <div>
                    {msg.sender === 'User' && <div className="text-[9px] font-label-caps text-[#aac8ff]/60 mb-1">{msg.senderLabel || 'YOU'}</div>}
                    {msg.sender === 'AI' && <div className="text-[9px] font-label-caps text-cyber-volt/60 mb-1 flex items-center gap-1">COPILOT_IQ {msg.streaming && <span className="material-symbols-outlined text-[10px] animate-spin">autorenew</span>}</div>}
                    <p className={`leading-relaxed ${
                      msg.sender === 'System' ? 'text-on-surface-variant opacity-70' :
                      msg.sender === 'User' ? 'text-[#aac8ff]' : 'text-cyber-volt'
                    }`}>{msg.text || (msg.streaming ? '▋' : '')}</p>
                  </div>
                ) : (
                  <div className="bg-cyber-volt/5 border-l-2 border-cyber-volt p-3 mt-2 flex flex-col gap-2">
                    <div className="text-[9px] font-label-caps text-cyber-volt/60 mb-1">COPILOT_IQ // RECOMMENDATION</div>
                    <p className="text-white text-xs">{msg.text}</p>
                    {!msg.actionTaken ? (
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => handleRecommendationAction(msg.id, 'APPROVE')} className="bg-cyber-volt text-black font-label-caps px-4 py-1 text-[10px] hover:brightness-110 transition-all">APPROVE</button>
                        <button onClick={() => handleRecommendationAction(msg.id, 'MODIFY')} className="bg-[#2a2a2a] border border-white/20 text-white font-label-caps px-4 py-1 text-[10px] hover:border-white transition-all">MODIFY</button>
                        <button onClick={() => handleRecommendationAction(msg.id, 'REJECT')} className="bg-[#ffb4ab]/10 border border-[#ffb4ab]/30 text-[#ffb4ab] font-label-caps px-4 py-1 text-[10px] hover:bg-[#ffb4ab]/20 transition-all">REJECT</button>
                      </div>
                    ) : (
                      <div className="mt-2 text-[10px] font-label-caps text-cyber-volt flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">check_circle</span>ACTION: {msg.actionTaken}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {aiError && (
          <div className="mb-2 bg-[#ffb4ab]/10 border border-[#ffb4ab]/30 text-[#ffb4ab] px-3 py-1.5 text-[10px] font-label-caps flex items-center gap-2 rounded">
            <span className="material-symbols-outlined text-sm">error</span>{aiError}
          </div>
        )}
        <form onSubmit={handleCommand} className="relative mt-auto">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <span className="text-cyber-volt font-bold">&gt;</span>
          </div>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isAiTyping}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-32 py-3 text-sm focus:border-cyber-volt focus:outline-none text-cyber-volt font-mono placeholder:text-white/20 transition-all disabled:opacity-50"
            placeholder="Ask CopilotIQ anything..."
            type="text"
          />
          <button type="submit" disabled={isAiTyping || !input.trim()} className="absolute right-2 top-2 bottom-2 bg-cyber-volt text-black px-6 font-label-caps text-[10px] hover:brightness-110 transition-all disabled:opacity-40">EXEC_CMD</button>
        </form>
      </div>
    </section>
  </div>
);

// ─── Restricted Placeholder ──────────────────────────────────────────────────
const RestrictedModule = ({ tab }) => (
  <div className="flex flex-col items-center justify-center min-h-[40vh] glass-panel border-dashed border-white/20 py-12">
    <span className="material-symbols-outlined text-[48px] text-[#ffb4ab]/40 mb-4 animate-pulse">lock</span>
    <h2 className="text-sm font-bold text-primary mb-2">ACCESS RESTRICTED</h2>
    <p className="text-on-surface-variant text-[11px] text-center max-w-xs">
      The <span className="text-cyber-volt font-bold">{tab}</span> module requires higher credentials. Use the Clearance Swapper at the top to adjust your role.
    </p>
  </div>
);

// ─── Main Dashboard Component ───────────────────────────────────────────────
const CommandDashboard = ({ staff, onLogin, onLogout }) => {
  const [activeTab, setActiveTab] = useState('LIVE_OPS');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [messages, setMessages] = useState([
    { id: 1, sender: 'System', text: 'Analyzing crowd flow patterns in North-East quadrant...' },
    { id: 2, sender: 'System', text: 'Detecting surge at Section D-14. Bottle-neck predicted in T-minus 4 minutes. Average wait time trending toward +6m.' },
    { id: 3, sender: 'AI', text: 'RECOMMENDATION: Suggest opening Gate 8 and re-routing auxiliary staff to Sector C. Dispatch unit Alpha-9 for crowd redistribution.', isRecommendation: true, actionTaken: null },
  ]);
  const [input, setInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [aiError, setAiError] = useState('');
  const terminalRef = useRef(null);
  const chatSessionRef = useRef(null);

  // Initialize RAG chat session
  useEffect(() => {
    chatSessionRef.current = createCopilotChat();
  }, []);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [messages]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    setIsAuthenticating(true);

    setTimeout(() => {
      const match = VALID_CREDENTIALS.find(
        (c) => c.username === username.toLowerCase() && c.password === password
      );

      if (match) {
        onLogin({ name: match.name, tier: match.tier });
      } else {
        setLoginError('AUTHENTICATION_FAILED: Invalid Credentials');
      }
      setIsAuthenticating(false);
    }, 1000);
  };

  const handleClearanceChange = (e) => {
    const tier = e.target.value;
    const match = VALID_CREDENTIALS.find(c => c.tier === tier);
    if (match) {
      onLogin({ name: match.name, tier: match.tier });
    }
  };

  const handleCommand = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const senderLabel = staff?.name || 'OPERATOR';
    setMessages(prev => [...prev, { id: Date.now(), sender: 'User', senderLabel, text: userText }]);
    setInput('');
    setIsAiTyping(true);
    setAiError('');

    const aiId = Date.now() + 1;
    setMessages(prev => [...prev, { id: aiId, sender: 'AI', text: '', streaming: true }]);

    try {
      if (!chatSessionRef.current) chatSessionRef.current = createCopilotChat();
      await sendMessageStream(chatSessionRef.current, userText, (partial) => {
        setMessages(prev => prev.map(m => m.id === aiId ? { ...m, text: partial } : m));
      });
      setMessages(prev => prev.map(m => m.id === aiId ? { ...m, streaming: false } : m));
    } catch (err) {
      console.error('RAG Copilot error:', err);
      setAiError(getErrorMessage(err));
      setMessages(prev => prev.filter(m => m.id !== aiId));
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleRecommendationAction = (id, action) => {
    setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, actionTaken: action } : msg));
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now(), sender: 'System', text: `Action [${action}] executed for recommendation. Updating live ops status...` }]);
    }, 600);
  };

  // If NOT logged in, show inline terminal login panel
  if (!staff) {
    return (
      <div className="max-w-md mx-auto py-12 animate-in fade-in duration-300">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-cyber-volt/10 border border-cyber-volt/20 px-4 py-1.5 rounded mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-volt animate-pulse"></span>
            <span className="font-label-caps text-[9px] text-cyber-volt tracking-widest">SECURE_GATEWAY</span>
          </div>
          <h2 className="text-2xl font-bold uppercase italic tracking-tighter text-cyber-volt">
            COMMAND GATEWAY
          </h2>
          <p className="text-[10px] text-on-surface-variant/60 tracking-wider mt-1">AUTHORIZATION REQUIRED</p>
        </div>

        <div className="glass-panel p-6">
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-label-caps text-on-surface-variant tracking-wider block">Operator ID</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin, operator, or staff..."
                className="w-full bg-black/60 border border-white/10 rounded p-2.5 text-xs text-primary font-mono focus:border-cyber-volt focus:outline-none transition-all placeholder:text-white/10"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-label-caps text-on-surface-variant tracking-wider block">Access Key</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password..."
                className="w-full bg-black/60 border border-white/10 rounded p-2.5 text-xs text-primary font-mono focus:border-cyber-volt focus:outline-none transition-all placeholder:text-white/10"
                required
              />
            </div>

            {loginError && (
              <div className="bg-[#ffb4ab]/10 border border-[#ffb4ab]/30 text-[#ffb4ab] p-2 text-[10px] font-label-caps flex items-center gap-2 rounded">
                <span className="material-symbols-outlined text-xs">error</span>
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full bg-cyber-volt text-black font-label-caps py-2.5 text-xs tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 rounded"
            >
              {isAuthenticating ? 'AUTHENTICATING...' : 'AUTHORIZE ACCESS'}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-4 border-t border-white/5 space-y-2">
            <div className="text-[9px] font-label-caps text-cyber-volt/60">Demo Credentials:</div>
            <div className="grid grid-cols-3 gap-1 text-[8px] font-mono text-on-surface-variant">
              <div>admin / admin123</div>
              <div>operator / ops2026</div>
              <div>staff / staff123</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tierKey = getTierKey(staff.tier);
  const allowedTabs = ROLE_ACCESS[tierKey] || ['LIVE_OPS'];

  const renderContent = () => {
    const isAllowed = allowedTabs.includes(activeTab);
    if (!isAllowed) return <RestrictedModule tab={activeTab} />;

    switch (activeTab) {
      case 'LIVE_OPS':
        return <LiveOpsModule messages={messages} input={input} setInput={setInput} handleCommand={handleCommand} handleRecommendationAction={handleRecommendationAction} isAiTyping={isAiTyping} aiError={aiError} />;
      case 'INCIDENTS':
        return <IncidentsModule />;
      case 'DISPATCH':
        return <DispatchModule />;
      case 'REPORTING':
        return <ReportingModule />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-tight text-primary">OPS COMMAND DASHBOARD</h2>
          <p className="text-[10px] text-on-surface-variant">Real-time incident response, telemetry, and dispatcher coordination.</p>
        </div>

        {/* Inline Clearance Swapper */}
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-label-caps text-on-surface-variant">System Clearance:</span>
          <select
            value={staff.tier}
            onChange={handleClearanceChange}
            className="bg-black/60 border border-white/10 rounded px-3 py-1.5 text-[10px] font-mono text-cyber-volt outline-none focus:border-cyber-volt"
          >
            <option value="TIER 5 — FULL ACCESS">Tier 5 — Root Admin</option>
            <option value="TIER 4 ACCESS">Tier 4 — Operator</option>
            <option value="TIER 2 ACCESS">Tier 2 — Field Staff</option>
          </select>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex border-b border-white/5 overflow-x-auto gap-2">
        {['LIVE_OPS', 'INCIDENTS', 'DISPATCH', 'REPORTING'].map(tab => {
          const isAllowed = allowedTabs.includes(tab);
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-label-caps text-[10px] flex items-center gap-1.5 px-4 py-2 border-b-2 transition-all relative ${
                activeTab === tab
                  ? 'text-cyber-volt border-cyber-volt bg-white/5'
                  : 'text-on-surface-variant border-transparent hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{TAB_ICONS[tab]}</span>
              {tab.replace('_', ' ')}
              {!isAllowed && <span className="material-symbols-outlined text-[10px] text-[#ffb4ab]">lock</span>}
            </button>
          );
        })}
      </div>

      {/* Dynamic Tab Workspace */}
      <div className="min-h-[400px]">
        {renderContent()}
      </div>
    </div>
  );
};

export default CommandDashboard;
