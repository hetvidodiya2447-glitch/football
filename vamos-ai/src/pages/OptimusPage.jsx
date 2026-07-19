import React, { useState, useEffect, useRef } from 'react';

const SPECS = [
  { label: 'WALKING SPEED', value: '5.6', unit: 'km/h', icon: 'directions_walk' },
  { label: 'CARRY CAPACITY', value: '20',  unit: 'kg',   icon: 'fitness_center' },
  { label: 'BATTERY LIFE',   value: '8',   unit: 'hrs',  icon: 'battery_charging_full' },
  { label: 'DEGREES OF FREEDOM', value: '28', unit: 'DOF', icon: 'settings_input_component' },
  { label: 'AI COMPUTE', value: '100', unit: 'TOPS',   icon: 'memory' },
  { label: 'SENSORS', value: '40+', unit: 'units',   icon: 'sensors' },
];

const CAPABILITIES = [
  {
    id: 'mobility',
    icon: 'directions_walk',
    title: 'Bipedal Locomotion',
    desc: 'Human-like walking gait with adaptive balance using Tesla-designed actuators and force sensors across every joint.',
    status: 'OPERATIONAL',
    color: '#DFFF00',
    detail: 'Full terrain navigation with sub-millimeter accuracy',
  },
  {
    id: 'manipulation',
    icon: 'pan_tool',
    title: 'Dexterous Hands',
    desc: '11 DOF hands with tactile feedback and force-sensitive grasping, enabling precision tool use and object manipulation.',
    status: 'OPERATIONAL',
    color: '#aac8ff',
    detail: 'Capable of threading a needle or lifting 20kg payload',
  },
  {
    id: 'vision',
    icon: 'visibility',
    title: 'Neural Vision System',
    desc: 'Auto-labeled video training data pipeline from Tesla FSD fleet. Real-time 3D object detection and scene understanding.',
    status: 'TRAINING',
    color: '#DFFF00',
    detail: '360° spatial awareness with sub-20ms latency',
  },
  {
    id: 'ai',
    icon: 'psychology',
    title: 'End-to-End AI',
    desc: 'Runs on Tesla\'s FSD computer chip. Neural net trained via imitation learning and reinforcement learning in simulation.',
    status: 'EVOLVING',
    color: '#ffb4ab',
    detail: 'Self-improving via continuous on-device and cloud training',
  },
];

const LIVE_LOGS = [
  { id: 1, time: '07:42:13', msg: 'Completing factory inspection task — Zone 3 Alpha', type: 'info' },
  { id: 2, time: '07:44:01', msg: 'Neural net re-training batch uploaded: 14,302 new samples', type: 'success' },
  { id: 3, time: '07:45:18', msg: 'Low impedance mode engaged — human proximity detected', type: 'warn' },
  { id: 4, time: '07:46:55', msg: 'Object retrieval task completed: Assembly Part #7721-B', type: 'success' },
  { id: 5, time: '07:48:32', msg: 'Battery at 84% — charging not required', type: 'info' },
];

const TASKS = [
  { name: 'SORT_PARTS',     pct: 100, done: true },
  { name: 'INSPECT_ZONE_A', pct: 100, done: true },
  { name: 'CARRY_LOAD_03',  pct: 78,  done: false },
  { name: 'ASSEMBLE_UNIT',  pct: 45,  done: false },
];

const PulsingOrb = ({ size = 100, color = '#DFFF00', label }) => (
  <div className="flex flex-col items-center gap-3">
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <div className="absolute rounded-full" style={{
        width: size * 1.5, height: size * 1.5,
        background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
        animation: 'orbPulse 3s ease-in-out infinite',
      }} />
      <div className="absolute rounded-full border" style={{
        width: size * 1.2, height: size * 1.2,
        borderColor: `${color}30`,
        animation: 'orbSpin 8s linear infinite',
        borderTopColor: color,
      }} />
      <div className="rounded-full flex items-center justify-center" style={{
        width: size, height: size,
        background: `radial-gradient(circle at 30% 30%, ${color}25, ${color}08)`,
        border: `2px solid ${color}40`,
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: size * 0.35, color }}>smart_toy</span>
      </div>
    </div>
    {label && <span className="text-[9px] font-label-caps tracking-widest" style={{ color }}>{label}</span>}
  </div>
);

const OptimusPage = () => {
  const [selectedCap, setSelectedCap] = useState('mobility');
  const [activeLog, setActiveLog] = useState(LIVE_LOGS);
  const [chatInput, setChatInput] = useState('');
  const [chatMsgs, setChatMsgs] = useState([
    { from: 'optimus', text: 'Greetings. I am Optimus — Tesla\'s humanoid robot. Ask me anything about my capabilities, hardware specs, or active tasks.' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chatMsgs]);

  // Telemetry stream logs simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = {
        id: Date.now(),
        time: new Date().toTimeString().slice(0, 8),
        msg: [
          'Tactile pressure calibration complete — 8N applied',
          'CPU Core load: 62% average across all units',
          'FSD vision module running at 30fps baseline',
          'Uploading sensory maps to cloud for synchronization',
        ][Math.floor(Math.random() * 4)],
        type: ['info', 'success', 'warn'][Math.floor(Math.random() * 3)],
      };
      setActiveLog(prev => [newLog, ...prev.slice(0, 5)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMsgs(prev => [...prev, { from: 'user', text: userMsg }]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      const lower = userMsg.toLowerCase();
      let reply = 'Sensory nets operational. Ask me about speed, battery, dexterous hands, or safety watchdogs.';
      
      if (lower.includes('speed') || lower.includes('walk')) {
        reply = 'My bipedal walking speed tops at 5.6 km/h using high-torque custom electric actuators.';
      } else if (lower.includes('battery') || lower.includes('charge')) {
        reply = 'My onboard 2.3 kWh battery pack delivers up to 8 hours of continuous operation.';
      } else if (lower.includes('hand') || lower.includes('finger') || lower.includes('grip')) {
        reply = 'My hands features 11 degrees of freedom with tactile feedback sensors for delicate manipulation.';
      } else if (lower.includes('ai') || lower.includes('vision') || lower.includes('brain')) {
        reply = 'I run Tesla\'s FSD-derived neural networks locally on an onboard FSD compute chip (100+ TOPS).';
      }

      setChatMsgs(prev => [...prev, { from: 'optimus', text: reply }]);
      setIsTyping(false);
    }, 1000);
  };

  const cap = CAPABILITIES.find(c => c.id === selectedCap);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <style>{`
        @keyframes orbPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes orbSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Header */}
      <div className="border-b border-white/5 pb-4">
        <h2 className="text-xl font-bold uppercase tracking-tight text-primary">OPTIMUS ROBOT TELEMETRY</h2>
        <p className="text-[10px] text-on-surface-variant">Real-time status updates and manual command prompt for Tesla Optimus (Unit 001).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Specs & Capabilities */}
        <div className="lg:col-span-8 space-y-6">
          {/* Specs grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {SPECS.map((spec, i) => (
              <div key={i} className="glass-panel p-4 flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-cyber-volt text-lg mb-2">{spec.icon}</span>
                <div className="text-xl font-bold text-cyber-volt">{spec.value}</div>
                <div className="text-[9px] font-label-caps text-on-surface-variant mt-1">{spec.label} ({spec.unit})</div>
              </div>
            ))}
          </div>

          {/* Capabilities grid */}
          <div className="space-y-4">
            <h3 className="text-xs font-label-caps text-on-surface-variant">SYSTEM CAPABILITIES</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CAPABILITIES.map(c => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCap(c.id)}
                  className={`glass-panel p-4 cursor-pointer transition-all border ${
                    selectedCap === c.id ? 'border-cyber-volt/60 bg-white/5' : 'border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="material-symbols-outlined text-lg" style={{ color: c.color }}>{c.icon}</span>
                    <span className="text-[8px] font-label-caps px-2 py-0.5 rounded" style={{ background: `${c.color}20`, color: c.color }}>{c.status}</span>
                  </div>
                  <h4 className="text-xs font-bold text-primary">{c.title}</h4>
                  <p className="text-[10px] text-on-surface-variant/80 mt-1 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Interactive Orb & Chat */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 flex flex-col items-center justify-center">
            <PulsingOrb size={100} color="#DFFF00" label="Optimus Unit 001" />
          </div>

          {/* Chatbot Interface */}
          <div className="glass-panel p-4 flex flex-col min-h-[300px]">
            <div className="text-[9px] font-label-caps text-cyber-volt/70 mb-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">smart_toy</span>
              OPTIMUS NEURAL LINK
            </div>

            <div ref={chatRef} className="flex-grow max-h-48 overflow-y-auto space-y-3 pr-1 text-[11px] mb-3">
              {chatMsgs.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-3 py-2 rounded-lg leading-relaxed ${
                    msg.from === 'user'
                      ? 'bg-cyber-volt/20 text-primary border border-cyber-volt/30'
                      : 'bg-white/5 text-on-surface-variant border border-white/5'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="text-on-surface-variant/40 animate-pulse">Optimus typing...</div>
              )}
            </div>

            <form onSubmit={handleChat} className="relative mt-auto">
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Ask about specs, battery, speed..."
                disabled={isTyping}
                className="w-full bg-black/60 border border-white/10 rounded py-2 pl-3 pr-12 text-xs focus:border-cyber-volt outline-none text-primary"
              />
              <button
                type="submit"
                disabled={isTyping || !chatInput.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-cyber-volt hover:scale-105 transition-transform"
              >
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Live Logs & Task Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Logs */}
        <div className="glass-panel p-4">
          <div className="text-[10px] font-label-caps text-on-surface-variant mb-3">Live Log Stream</div>
          <div className="space-y-1.5 max-h-40 overflow-y-auto font-mono text-[10px]">
            {activeLog.map(log => (
              <div key={log.id} className="text-on-surface-variant/70">
                <span className="text-[#888] mr-2">[{log.time}]</span>
                {log.msg}
              </div>
            ))}
          </div>
        </div>

        {/* Tasks progress */}
        <div className="glass-panel p-4 space-y-3">
          <div className="text-[10px] font-label-caps text-on-surface-variant">Active Task Queue</div>
          <div className="space-y-2">
            {TASKS.map((t, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono">
                  <span>{t.name}</span>
                  <span>{t.pct}%</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-cyber-volt rounded-full" style={{ width: `${t.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimusPage;
