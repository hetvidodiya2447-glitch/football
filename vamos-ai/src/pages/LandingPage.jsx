import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#e5e2e1',
      fontFamily: "'Inter', system-ui, sans-serif",
      display: 'flex',
      flexDirection: 'column',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        .nav-link { color: #888; font-size: 13px; transition: color 0.2s; }
        .nav-link:hover { color: #fff; }
        .cta-primary {
          background: #DFFF00; color: #000; font-weight: 600;
          padding: 12px 28px; font-size: 13px; letter-spacing: 0.05em;
          transition: opacity 0.2s; display: inline-block;
        }
        .cta-primary:hover { opacity: 0.88; }
        .cta-secondary {
          border: 1px solid #333; color: #888; font-size: 13px;
          padding: 12px 28px; letter-spacing: 0.05em;
          transition: border-color 0.2s, color 0.2s; display: inline-block;
        }
        .cta-secondary:hover { border-color: #666; color: #e5e2e1; }
        .card {
          border: 1px solid #1a1a1a;
          padding: 24px;
          transition: border-color 0.2s;
        }
        .card:hover { border-color: #333; }
        .stat-val { font-size: 32px; font-weight: 700; color: #DFFF00; }
        .divider { border: none; border-top: 1px solid #1a1a1a; }
      `}</style>

      {/* NAV */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 40px', borderBottom: '1px solid #1a1a1a',
      }}>
        <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em' }}>
          STADIUM<span style={{ color: '#DFFF00' }}>IQ</span>
        </div>
        <div style={{ display: 'flex', gap: 32 }}>
          <Link to="/companion" className="nav-link">Fan Hub</Link>
          <Link to="/command" className="nav-link">Staff</Link>
          <Link to="/optimus" className="nav-link">Optimus</Link>
        </div>
        <Link to="/companion" className="cta-primary">Enter App</Link>
      </nav>

      {/* HERO */}
      <main style={{ flex: 1, maxWidth: 900, margin: '0 auto', padding: '80px 40px 60px', width: '100%' }}>
        <div style={{ marginBottom: 16 }}>
          <span style={{
            fontSize: 11, letterSpacing: '0.12em', color: '#DFFF00',
            textTransform: 'uppercase', fontWeight: 500,
          }}>
            Stadium Intelligence Platform
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(42px, 6vw, 72px)',
          fontWeight: 700,
          lineHeight: 1.08,
          letterSpacing: '-0.03em',
          marginBottom: 24,
          color: '#fff',
        }}>
          Real-time intelligence<br />
          <span style={{ color: '#DFFF00' }}>for modern stadiums.</span>
        </h1>

        <p style={{
          fontSize: 16, color: '#888', lineHeight: 1.7,
          maxWidth: 500, marginBottom: 40,
        }}>
          Serving fans, operations staff, and AI systems —
          all from one unified platform. No API key required.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/companion" className="cta-primary">Fan Hub →</Link>
          <Link to="/command" className="cta-secondary">Staff Login</Link>
        </div>

        {/* STATS */}
        <hr className="divider" style={{ margin: '60px 0 40px' }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 32 }}>
          {[
            { val: '54,892', label: 'Fans tracked live' },
            { val: '20+', label: 'Stadiums mapped' },
            { val: '100%', label: 'Offline AI engine' },
            { val: '28 DOF', label: 'Optimus robot' },
          ].map((s, i) => (
            <div key={i}>
              <div className="stat-val">{s.val}</div>
              <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* MODULES */}
        <hr className="divider" style={{ margin: '60px 0 40px' }} />

        <div style={{ marginBottom: 24 }}>
          <span style={{ fontSize: 11, color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Platform Modules</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {[
            {
              label: 'Fan Companion',
              desc: 'Gates, crowds, food & alerts for matchday fans.',
              tag: 'Live',
              to: '/companion',
            },
            {
              label: 'Command Center',
              desc: 'Incidents, dispatch & reporting for staff.',
              tag: 'Staff',
              to: '/command',
            },
            {
              label: 'Global Map',
              desc: 'GPS-tracked world stadium finder with satellite view.',
              tag: 'GPS',
              to: '/companion',
            },
            {
              label: 'Optimus',
              desc: 'Tesla humanoid robot — capabilities & live interface.',
              tag: 'AI',
              to: '/optimus',
            },
          ].map((m, i) => (
            <Link to={m.to} key={i} className="card" style={{ display: 'block' }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', marginBottom: 12,
              }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#e5e2e1' }}>{m.label}</span>
                <span style={{
                  fontSize: 9, color: '#DFFF00', border: '1px solid #DFFF0040',
                  padding: '2px 6px', letterSpacing: '0.08em',
                }}>{m.tag}</span>
              </div>
              <p style={{ fontSize: 12, color: '#555', lineHeight: 1.6 }}>{m.desc}</p>
            </Link>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid #1a1a1a', padding: '20px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 12,
      }}>
        <span style={{ fontSize: 12, color: '#444' }}>StadiumIQ · Vamos AI Platform</span>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link to="/companion" style={{ fontSize: 12, color: '#444' }}>Fan Hub</Link>
          <Link to="/command" style={{ fontSize: 12, color: '#444' }}>Ops Center</Link>
          <Link to="/optimus" style={{ fontSize: 12, color: '#444' }}>Optimus</Link>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
