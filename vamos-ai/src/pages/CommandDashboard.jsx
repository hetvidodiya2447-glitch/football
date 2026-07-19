import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

// ─── Tab icons ───────────────────────────────────────────────────────────────
const TAB_ICONS = {
  LIVE_OPS:  'sensors',
  INCIDENTS: 'warning_amber',
  DISPATCH:  'directions_run',
  REPORTING: 'bar_chart',
};

// ─── Module content renderers ────────────────────────────────────────────────

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
    {/* Live Ops Header */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="bg-cyber-volt text-black px-3 py-1 font-label-caps text-xs flex items-center gap-2 shadow-[0_0_10px_#DFFF00]">
          <span className="w-2 h-2 rounded-full bg-black animate-pulse"></span>
          LIVE_OPS_OVERVIEW
        </div>
        <span className="text-on-surface-variant text-[10px] font-label-caps">KICK-OFF IN 45:00</span>
      </div>
      <div className="flex gap-2">
        <button className="bg-[#2a2a2a] border border-[#454932] px-4 py-1.5 text-label-caps text-white hover:border-cyber-volt transition-all text-[10px]">REFRESH_DATA</button>
        <button className="bg-cyber-volt border border-black px-4 py-1.5 text-label-caps text-black hover:brightness-110 transition-all text-[10px]">GENERATE_REPORT</button>
      </div>
    </div>

    {/* Metrics Row */}
    <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="md:col-span-2 glass-panel p-6 relative overflow-hidden group hover:border-cyber-volt/50 transition-colors">
        <div className="tech-id mb-2">METRIC_ATTENDANCE_01</div>
        <div className="flex justify-between items-end">
          <div>
            <div className="font-label-caps text-label-caps text-on-surface-variant opacity-60">TOTAL ATTENDANCE</div>
            <div className="font-display-xl text-[56px] leading-tight text-cyber-volt mt-1" style={{ textShadow: '0 0 10px rgba(223, 255, 0, 0.5)' }}>54,892</div>
          </div>
          <div className="text-right">
            <div className="text-cyber-volt flex items-center gap-1 font-label-caps text-xs">
              <span className="material-symbols-outlined text-sm">trending_up</span>+2.4%
            </div>
            <div className="font-label-caps text-[10px] text-on-surface-variant">CAPACITY: 91.5%</div>
          </div>
        </div>
        <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-cyber-volt w-[91.5%] shadow-[0_0_10px_#DFFF00]"></div>
        </div>
      </div>

      <div className="glass-panel p-6 relative overflow-hidden hover:border-[#ffb4ab]/50 transition-colors">
        <div className="tech-id mb-2">METRIC_FLOW_02</div>
        <div className="font-label-caps text-label-caps text-on-surface-variant opacity-60">GATE_FLOW_RATE</div>
        <div className="font-display-xl text-[48px] leading-tight text-white mt-1">142<span className="text-2xl opacity-40">/min</span></div>
        <p className="mt-3 text-[10px] font-label-caps text-[#ffb4ab] uppercase flex items-center gap-1">
          <span className="material-symbols-outlined text-[12px]">warning</span>CONGESTION ALERT: GATE 7
        </p>
      </div>

      <div className="glass-panel p-6 relative overflow-hidden hover:border-cyber-volt/50 transition-colors">
        <div className="tech-id mb-2">METRIC_LOGISTICS_03</div>
        <div className="font-label-caps text-label-caps text-on-surface-variant opacity-60">CONCESSION_LOAD</div>
        <div className="font-display-xl text-[48px] leading-tight text-white mt-1">78<span className="text-2xl opacity-40">%</span></div>
        <p className="mt-3 text-[10px] font-label-caps text-cyber-volt uppercase flex items-center gap-1">
          <span className="material-symbols-outlined text-[12px]">schedule</span>AVG WAIT: 4.2 MIN
        </p>
      </div>
    </section>

    {/* Main Heatmap & Zone Status */}
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 glass-panel min-h-[400px] relative overflow-hidden border-[#454932] group">
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 border border-cyber-volt/30 rounded flex items-center gap-3">
            <span className="material-symbols-outlined text-cyber-volt text-sm">videocam</span>
            <span className="font-label-caps text-[10px]">LIVE FEED: SECTOR_A7</span>
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
          </div>
        </div>
        <div className="absolute inset-0 grayscale opacity-20 transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1577223625816-7546f13df25d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        <div className="absolute inset-0 pointer-events-none opacity-60 animate-pulse" style={{ background: 'radial-gradient(circle at 40% 50%, rgba(223, 255, 0, 0.4) 0%, transparent 40%), radial-gradient(circle at 70% 30%, rgba(255, 60, 60, 0.3) 0%, transparent 30%)' }}></div>
        <div className="absolute bottom-4 right-4 z-10 bg-black/80 backdrop-blur-md p-4 border border-white/10 rounded w-48">
          <div className="font-label-caps text-[10px] text-on-surface-variant mb-2">HEATMAP_LEGEND</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-600 rounded-sm"></div><span className="text-[9px] font-label-caps uppercase">Critical (95%+)</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-cyber-volt rounded-sm"></div><span className="text-[9px] font-label-caps uppercase">Optimal (60-80%)</span></div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 space-y-4">
        <h2 className="text-label-caps font-label-caps text-cyber-volt flex items-center gap-2">
          <span className="w-1 h-4 bg-cyber-volt"></span>ZONE_STATUS_MONITOR
        </h2>
        <div className="grid grid-cols-1 gap-3">
          <div className="glass-panel p-4 hover:border-cyber-volt/40 cursor-pointer transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="tech-id">ZONE_NORTH_TIER</span>
              <span className="bg-cyber-volt/20 text-cyber-volt px-2 py-0.5 text-[9px] font-label-caps">OPTIMAL</span>
            </div>
            <div className="flex justify-between items-end">
              <h4 className="text-headline-sm font-bold">SECTION_A</h4>
              <span className="text-headline-md text-cyber-volt" style={{ textShadow: '0 0 10px rgba(223, 255, 0, 0.5)' }}>88%</span>
            </div>
          </div>
          <div className="glass-panel p-4 hover:border-[#ffb4ab]/40 cursor-pointer border-[#ffb4ab]/20 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="tech-id text-[#ffb4ab]/60">ZONE_SOUTH_TERRACE</span>
              <span className="bg-[#ffb4ab]/20 text-[#ffb4ab] px-2 py-0.5 text-[9px] font-label-caps">HIGH_LOAD</span>
            </div>
            <div className="flex justify-between items-end">
              <h4 className="text-headline-sm font-bold text-[#ffb4ab]">SECTION_D</h4>
              <span className="text-headline-md text-[#ffb4ab]">96%</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* AI Copilot Terminal */}
    <section className="glass-panel border-cyber-volt/30 p-1 relative overflow-hidden group">
      <div className="bg-cyber-volt text-black px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-sm">neurology</span>
          <h3 className="font-label-caps text-[11px] font-bold tracking-widest italic">COPILOT_IQ_v4.2 // TERMINAL</h3>
        </div>
        <div className="flex items-center gap-3">
          {isAiTyping && <span className="text-[9px] font-label-caps animate-pulse">GENERATING_RESPONSE...</span>}
          {!isAiTyping && <span className="text-[9px] font-label-caps opacity-60">LOCAL RAG SYSTEM</span>}
          <div className="flex items-center gap-1 text-[8px] font-label-caps px-2 py-0.5 border border-black/40 text-black/60">
            <span className="material-symbols-outlined text-[10px]">check_circle</span>
            OFFLINE
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

// ─── Restricted placeholder ──────────────────────────────────────────────────
const RestrictedModule = ({ tab }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] glass-panel border-dashed border-white/20">
    <span className="material-symbols-outlined text-[64px] text-[#ffb4ab]/40 mb-4 animate-pulse">lock</span>
    <h2 className="text-headline-sm font-bold text-primary mb-2">ACCESS DENIED</h2>
    <p className="text-on-surface-variant text-center max-w-md">
      The <span className="text-cyber-volt font-bold">{tab}</span> module requires higher clearance. Contact your administrator to request access.
    </p>
  </div>
);

// ─── Main Dashboard ──────────────────────────────────────────────────────────
const CommandDashboard = ({ staff, onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('LIVE_OPS');
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

  // Determine allowed tabs for logged-in role
  const tierKey = getTierKey(staff?.tier);
  const allowedTabs = ROLE_ACCESS[tierKey] || ['LIVE_OPS'];

  // Initialize RAG chat session
  useEffect(() => {
    chatSessionRef.current = createCopilotChat();
  }, []);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [messages]);

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
    <div className="bg-black text-[#e5e2e1] min-h-[100dvh] font-body-md selection:bg-cyber-volt selection:text-black">
      {/* CRT scanline */}
      <div className="fixed inset-0 pointer-events-none opacity-5 z-[100]" style={{
        background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
        backgroundSize: '100% 4px, 3px 100%',
      }}></div>

      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-50 bg-black/70 backdrop-blur-xl border-b border-white/10 flex justify-between items-center h-16 px-4 md:px-8">
        <div className="flex items-center gap-4">
          <Link to="/" className="material-symbols-outlined text-cyber-volt cursor-pointer hover:bg-cyber-volt/10 p-2 rounded transition-colors">arrow_back</Link>
          <h1 className="text-headline-md font-bold italic uppercase tracking-tighter text-cyber-volt volt-glow">STADIUMIQ CMD</h1>
        </div>

        <nav className="hidden md:flex items-center gap-1 h-full">
          {['LIVE_OPS', 'INCIDENTS', 'DISPATCH', 'REPORTING'].map(tab => {
            const isAllowed = allowedTabs.includes(tab);
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                title={!isAllowed ? 'Insufficient access level' : ''}
                className={`font-label-caps text-label-caps h-full flex items-center gap-1.5 px-3 transition-colors relative
                  ${activeTab === tab ? 'text-cyber-volt border-b-2 border-cyber-volt' : isAllowed ? 'text-on-surface-variant hover:text-cyber-volt' : 'text-white/20 cursor-not-allowed'}`}
              >
                <span className="material-symbols-outlined text-[14px]">{TAB_ICONS[tab]}</span>
                {tab}
                {!isAllowed && <span className="material-symbols-outlined text-[10px] ml-0.5">lock</span>}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          {/* Role badge */}
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] font-label-caps text-on-surface-variant">{staff?.name || 'OPERATOR'}</span>
            <span className="text-[8px] font-label-caps text-cyber-volt">{staff?.tier || 'ACCESS'}</span>
          </div>
          <button
            onClick={() => { onLogout(); navigate('/'); }}
            className="material-symbols-outlined text-[#ffb4ab] hover:bg-[#ffb4ab]/10 p-2 rounded transition-colors text-sm"
            title="Logout"
          >logout</button>
          <div className="w-10 h-10 rounded-full border border-cyber-volt/30 bg-[#2a2a2a] overflow-hidden flex items-center justify-center">
            <span className="material-symbols-outlined text-cyber-volt text-sm">person</span>
          </div>
        </div>
      </header>

      <main className="pt-20 pb-32 px-4 md:px-8 max-w-[1600px] mx-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default CommandDashboard;
