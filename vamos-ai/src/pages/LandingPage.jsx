import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// ─── Particle Canvas Background ───────────────────────────────────────────────
const ParticleCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 1.8 + 0.4,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(223,255,0,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(223,255,0,${p.alpha})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};

// ─── Typewriter hook ──────────────────────────────────────────────────────────
const useTypewriter = (text, speed = 60, startDelay = 0) => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0;
    setDisplayed('');
    setDone(false);
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(interval); setDone(true); }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);
  return { displayed, done };
};

// ─── Feature Cards Data ────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: 'stadium',
    title: 'Fan Companion',
    subtitle: 'StadiumIQ Fan Hub',
    desc: 'Real-time crowd density, gate status, food queues, and stadium navigation — powered by local intelligence.',
    color: '#DFFF00',
    route: '/companion',
    tag: 'LIVE',
  },
  {
    icon: 'sensors',
    title: 'Command Center',
    subtitle: 'Ops Command Dashboard',
    desc: 'Full-spectrum stadium operations: incident management, unit dispatch, analytics and reporting — for staff.',
    color: '#aac8ff',
    route: '/login',
    tag: 'STAFF',
  },
  {
    icon: 'explore',
    title: 'Global Map',
    subtitle: 'World Stadium Finder',
    desc: 'GPS-tracked interactive map of every football & cricket stadium worldwide with satellite imagery.',
    color: '#DFFF00',
    route: '/companion',
    tag: 'GPS',
  },
  {
    icon: 'smart_toy',
    title: 'Optimus',
    subtitle: 'Tesla Humanoid Interface',
    desc: 'Explore Tesla\'s next-generation humanoid robot: capabilities, live telemetry, and AI interface.',
    color: '#ffb4ab',
    route: '/optimus',
    tag: 'AI',
  },
];

const STATS = [
  { val: '54,892', label: 'Fans Served Live' },
  { val: '20+', label: 'World Stadiums Mapped' },
  { val: '3', label: 'Active Incidents Tracked' },
  { val: '100%', label: 'Offline AI — No API Key' },
];

// ─── Landing Page ─────────────────────────────────────────────────────────────
const LandingPage = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(0); // 0=boot, 1=intro, 2=main
  const [bootLines, setBootLines] = useState([]);
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const BOOT_SEQUENCE = [
    '> VAMOS_AI SYSTEM BOOT v3.1.0',
    '> Loading core modules...',
    '> StadiumIQ Companion: READY',
    '> Command Center: ONLINE',
    '> RAG Engine: ACTIVE',
    '> GPS Telemetry: STREAMING',
    '> Optimus Interface: LINKED',
    '> All systems NOMINAL.',
    '> Welcome.',
  ];

  // Boot animation sequence
  useEffect(() => {
    let lineIdx = 0;
    const addLine = () => {
      if (lineIdx < BOOT_SEQUENCE.length) {
        setBootLines(prev => [...prev, BOOT_SEQUENCE[lineIdx]]);
        lineIdx++;
        setTimeout(addLine, lineIdx === BOOT_SEQUENCE.length ? 800 : 200 + Math.random() * 150);
      } else {
        setTimeout(() => setPhase(1), 400);
        setTimeout(() => setPhase(2), 1200);
      }
    };
    const init = setTimeout(addLine, 400);
    return () => clearTimeout(init);
  }, []);

  const { displayed: tagline } = useTypewriter(
    'Intelligence that moves with your crowd.',
    55,
    phase >= 2 ? 200 : 999999
  );

  return (
    <div className="bg-black text-[#e5e2e1] min-h-screen overflow-x-hidden selection:bg-cyber-volt selection:text-black">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

        * { box-sizing: border-box; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(223,255,0,0.2); }
          50% { box-shadow: 0 0 50px rgba(223,255,0,0.5); }
        }
        @keyframes horizScan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.02); }
        }
        .fade-up { animation: fadeUp 0.7s ease forwards; }
        .fade-in { animation: fadeIn 0.5s ease forwards; }
        .glow-pulse { animation: glowPulse 3s ease infinite; }
        .orb-float { animation: orbFloat 6s ease-in-out infinite; }
        .grad-text {
          background: linear-gradient(135deg, #DFFF00 0%, #ffffff 40%, #aac8ff 100%);
          background-size: 200% 200%;
          animation: gradientShift 5s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .feature-card {
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .feature-card:hover {
          transform: translateY(-6px);
        }
        .scan-line {
          position: fixed; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(223,255,0,0.4), transparent);
          animation: horizScan 5s linear infinite;
          pointer-events: none; z-index: 9999;
        }
        .grid-dots {
          background-image: radial-gradient(rgba(223,255,0,0.06) 1px, transparent 1px);
          background-size: 32px 32px;
        }
        .crt-overlay {
          background:
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px);
          pointer-events: none;
        }
      `}</style>

      {/* Particle Network */}
      <ParticleCanvas />

      {/* Horizontal scan line FX */}
      <div className="scan-line" />

      {/* CRT Overlay */}
      <div className="fixed inset-0 crt-overlay z-[1] pointer-events-none opacity-30" />

      {/* ── BOOT SCREEN ── */}
      {phase < 2 && (
        <div className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-700 ${phase === 1 ? 'opacity-0' : 'opacity-100'}`}>
          <div className="font-mono text-xs text-cyber-volt max-w-md w-full px-8 space-y-1">
            {bootLines.map((line, i) => (
              <div
                key={i}
                className="fade-in"
                style={{
                  animationDelay: `${i * 0.05}s`,
                  color: line.includes('READY') || line.includes('ONLINE') || line.includes('ACTIVE') || line.includes('NOMINAL') || line.includes('Welcome')
                    ? '#DFFF00' : '#DFFF0080',
                }}
              >
                {line}
              </div>
            ))}
            <span className="inline-block w-2 h-4 bg-cyber-volt animate-pulse ml-0.5" />
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT (shows after boot) ── */}
      {phase >= 2 && (
        <>
          {/* ── NAV ── */}
          <nav className="fixed top-0 left-0 right-0 z-40 flex justify-between items-center px-6 md:px-12 py-4 bg-black/60 backdrop-blur-xl border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded bg-cyber-volt flex items-center justify-center">
                <span className="material-symbols-outlined text-black text-base">bolt</span>
              </div>
              <span className="font-bold tracking-tighter text-lg text-white">VAMOS<span className="text-cyber-volt">AI</span></span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {[
                { label: 'Fan Hub', href: '/companion' },
                { label: 'Ops Center', href: '/login' },
                { label: 'Optimus', href: '/optimus' },
              ].map(l => (
                <Link key={l.label} to={l.href} className="text-[11px] font-label-caps text-on-surface-variant hover:text-cyber-volt transition-colors tracking-wider">
                  {l.label.toUpperCase()}
                </Link>
              ))}
            </div>
            <Link
              to="/companion"
              className="text-[11px] font-label-caps bg-cyber-volt text-black px-5 py-2 hover:brightness-110 transition-all font-bold tracking-wider"
            >
              LAUNCH APP →
            </Link>
          </nav>

          {/* ── HERO ── */}
          <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 grid-dots">
            {/* Glow orb behind */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="orb-float"
                style={{
                  width: '600px', height: '600px',
                  background: 'radial-gradient(circle, rgba(223,255,0,0.07) 0%, rgba(223,255,0,0.02) 50%, transparent 70%)',
                  borderRadius: '50%',
                }}
              />
            </div>

            {/* Badge */}
            <div
              className="fade-up inline-flex items-center gap-2 border border-cyber-volt/30 bg-cyber-volt/5 backdrop-blur px-5 py-2 rounded-full text-[10px] font-label-caps text-cyber-volt tracking-widest mb-10"
              style={{ animationDelay: '0s' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-volt animate-pulse" />
              REAL-TIME STADIUM INTELLIGENCE PLATFORM
            </div>

            {/* Headline */}
            <h1
              className="fade-up grad-text font-black leading-none mb-6"
              style={{
                fontSize: 'clamp(52px, 9vw, 130px)',
                letterSpacing: '-0.03em',
                animationDelay: '0.1s',
              }}
            >
              STADIUM<br />IQ
            </h1>

            {/* Typewriter tagline */}
            <div
              className="fade-up text-lg md:text-2xl text-on-surface-variant font-light mb-4 h-8 tracking-wide"
              style={{ animationDelay: '0.2s' }}
            >
              {tagline}
              <span className="inline-block w-0.5 h-5 bg-cyber-volt animate-pulse align-middle ml-0.5" />
            </div>

            <p
              className="fade-up text-sm text-on-surface-variant/60 max-w-xl mb-12 leading-relaxed"
              style={{ animationDelay: '0.3s' }}
            >
              An intelligent platform built for modern sports venues — serving fans, operations staff,
              and AI-powered robotic systems all from a unified experience.
            </p>

            {/* CTA Buttons */}
            <div className="fade-up flex flex-col sm:flex-row gap-4 mb-20" style={{ animationDelay: '0.4s' }}>
              <Link
                to="/companion"
                className="glow-pulse bg-cyber-volt text-black font-bold px-10 py-4 text-sm tracking-widest font-label-caps hover:brightness-110 transition-all flex items-center gap-3"
              >
                <span className="material-symbols-outlined text-base">stadium</span>
                ENTER FAN HUB
              </Link>
              <Link
                to="/login"
                className="border border-white/20 text-white font-label-caps px-10 py-4 text-sm tracking-widest hover:border-cyber-volt/50 hover:bg-white/5 transition-all flex items-center gap-3"
              >
                <span className="material-symbols-outlined text-base">manage_accounts</span>
                STAFF LOGIN
              </Link>
            </div>

            {/* Scroll indicator */}
            <div className="fade-up absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[9px] font-label-caps text-on-surface-variant/40" style={{ animationDelay: '1s' }}>
              SCROLL TO EXPLORE
              <div className="w-px h-10 bg-gradient-to-b from-cyber-volt/40 to-transparent" />
            </div>
          </section>

          {/* ── LIVE STATS TICKER ── */}
          <section className="relative z-10 border-y border-white/10 bg-black/80 backdrop-blur py-10">
            <div className="max-w-6xl mx-auto px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {STATS.map((s, i) => (
                  <div
                    key={i}
                    className="fade-up text-center"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className="text-4xl md:text-5xl font-black text-cyber-volt mb-1"
                      style={{ textShadow: '0 0 20px rgba(223,255,0,0.3)' }}>
                      {s.val}
                    </div>
                    <div className="text-[10px] font-label-caps text-on-surface-variant tracking-widest">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── FEATURE CARDS ── */}
          <section className="relative z-10 py-28 px-6 md:px-12 max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="text-[10px] font-label-caps text-cyber-volt tracking-widest mb-3">PLATFORM MODULES</div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">What's Inside</h2>
              <p className="text-on-surface-variant/60 max-w-xl mx-auto text-sm">Four interconnected modules — fan experience, ops management, global mapping, and robotics AI.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {FEATURES.map((f, i) => (
                <Link
                  key={i}
                  to={f.route}
                  className="feature-card glass-panel p-8 group relative overflow-hidden block"
                  onMouseEnter={() => setHoveredFeature(i)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  style={{
                    borderColor: hoveredFeature === i ? `${f.color}40` : 'transparent',
                  }}
                >
                  {/* BG glow on hover */}
                  <div
                    className="absolute inset-0 transition-opacity duration-300 pointer-events-none rounded"
                    style={{
                      background: `radial-gradient(circle at top left, ${f.color}08, transparent 60%)`,
                      opacity: hoveredFeature === i ? 1 : 0,
                    }}
                  />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div
                        className="w-12 h-12 flex items-center justify-center rounded border"
                        style={{
                          background: `${f.color}15`,
                          borderColor: `${f.color}30`,
                        }}
                      >
                        <span className="material-symbols-outlined text-2xl" style={{ color: f.color }}>{f.icon}</span>
                      </div>
                      <span
                        className="text-[9px] font-label-caps px-3 py-1 rounded-full"
                        style={{ background: `${f.color}15`, color: f.color }}
                      >
                        {f.tag}
                      </span>
                    </div>

                    <div className="text-[10px] font-label-caps mb-1" style={{ color: f.color }}>{f.subtitle}</div>
                    <h3 className="text-2xl font-black text-white mb-3 group-hover:text-cyber-volt transition-colors">{f.title}</h3>
                    <p className="text-sm text-on-surface-variant/70 leading-relaxed mb-6">{f.desc}</p>

                    <div className="flex items-center gap-2 text-[11px] font-label-caps" style={{ color: f.color }}>
                      ENTER MODULE
                      <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">arrow_forward</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── TECH STRIP ── */}
          <section className="relative z-10 border-t border-white/5 bg-black/60 py-16 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <div className="text-[10px] font-label-caps text-on-surface-variant/40 tracking-widest">POWERED BY</div>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-10">
                {[
                  { name: 'React', icon: 'code' },
                  { name: 'Leaflet Maps', icon: 'map' },
                  { name: 'Local RAG AI', icon: 'psychology' },
                  { name: 'GPS Geolocation', icon: 'gps_fixed' },
                  { name: 'Esri Satellite', icon: 'satellite' },
                  { name: 'Vite', icon: 'bolt' },
                ].map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-on-surface-variant/40 hover:text-on-surface-variant/70 transition-colors">
                    <span className="material-symbols-outlined text-sm">{t.icon}</span>
                    <span className="text-[11px] font-label-caps tracking-wider">{t.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── FULL WIDTH CTA ── */}
          <section className="relative z-10 py-28 px-6 text-center overflow-hidden">
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, rgba(223,255,0,0.06) 0%, transparent 70%)' }}
            />
            <div className="relative max-w-3xl mx-auto space-y-6">
              <div className="text-[10px] font-label-caps text-cyber-volt tracking-widest">READY TO EXPERIENCE</div>
              <h2
                className="font-black leading-none"
                style={{
                  fontSize: 'clamp(40px, 7vw, 96px)',
                  letterSpacing: '-0.03em',
                  background: 'linear-gradient(135deg, #ffffff 0%, #DFFF00 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                The Future<br />of Stadiums
              </h2>
              <p className="text-on-surface-variant/60 max-w-md mx-auto text-sm">
                Step into the stadium of tomorrow — where AI, real-time data, and robotics converge to create the ultimate experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link
                  to="/companion"
                  className="bg-cyber-volt text-black font-black px-12 py-4 text-sm tracking-widest font-label-caps hover:brightness-110 transition-all glow-pulse"
                >
                  ENTER STADIUMIQ →
                </Link>
                <Link
                  to="/optimus"
                  className="border border-white/20 text-white font-label-caps px-12 py-4 text-sm tracking-widest hover:border-cyber-volt/50 transition-all"
                >
                  MEET OPTIMUS
                </Link>
              </div>
            </div>
          </section>

          {/* ── FOOTER ── */}
          <footer className="relative z-10 border-t border-white/5 py-8 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-label-caps text-on-surface-variant/30">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-cyber-volt flex items-center justify-center">
                <span className="material-symbols-outlined text-black text-xs">bolt</span>
              </div>
              VAMOS AI · STADIUMIQ PLATFORM
            </div>
            <div className="flex gap-6">
              <Link to="/companion" className="hover:text-cyber-volt transition-colors">FAN HUB</Link>
              <Link to="/login" className="hover:text-cyber-volt transition-colors">OPS CENTER</Link>
              <Link to="/optimus" className="hover:text-cyber-volt transition-colors">OPTIMUS</Link>
            </div>
            <div>BUILT WITH REACT + LEAFLET + LOCAL AI</div>
          </footer>
        </>
      )}
    </div>
  );
};

export default LandingPage;
