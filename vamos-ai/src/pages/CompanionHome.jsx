import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StadiumMap from '../components/StadiumMap';

const CompanionHome = () => {
  const [matchTime, setMatchTime] = useState(74 * 60 + 17); // 74 mins 17 secs
  const [activeTab, setActiveTab] = useState('HUB');
  const [iqInput, setIqInput] = useState('');
  const [iqResponse, setIqResponse] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setMatchTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAskIQ = (e) => {
    e.preventDefault();
    if (!iqInput.trim()) return;
    setIsTyping(true);
    setIqResponse('');
    setTimeout(() => {
      setIsTyping(false);
      setIqResponse("The nearest water station is located near Gate 4, just past Concourse B. Current wait time is minimal (approx 1 min).");
      setIqInput('');
    }, 1500);
  };

  const mins = Math.floor(matchTime / 60);

  const renderContent = () => {
    if (activeTab === 'ALERTS') {
      return (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <h2 className="text-headline-md font-bold text-primary mb-6">LIVE ALERTS</h2>
          <div className="glass-panel p-4 border-l-4 border-l-[#ffb4ab]">
            <div className="flex justify-between">
              <span className="text-[#ffb4ab] font-label-caps">HIGH PRIORITY</span>
              <span className="text-on-surface-variant text-xs">2 MINS AGO</span>
            </div>
            <p className="mt-2 text-primary font-bold">Congestion at South Entrance</p>
            <p className="text-on-surface-variant text-sm mt-1">Please use East or West entrances to avoid delays.</p>
          </div>
          <div className="glass-panel p-4 border-l-4 border-l-cyber-volt">
            <div className="flex justify-between">
              <span className="text-cyber-volt font-label-caps">INFO</span>
              <span className="text-on-surface-variant text-xs">15 MINS AGO</span>
            </div>
            <p className="mt-2 text-primary font-bold">Merchandise discount</p>
            <p className="text-on-surface-variant text-sm mt-1">20% off all Titan jerseys in Concourse A until halftime.</p>
          </div>
        </div>
      );
    }
    
    if (activeTab === 'MAP') {
      return <StadiumMap />;
    }

    if (activeTab === 'CROWD') {
      return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <h2 className="text-headline-md font-bold text-primary mb-6">CROWD DENSITY</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-panel p-6 border-b-2 border-b-cyber-volt relative overflow-hidden">
              <div className="absolute top-2 right-4 tech-id">SEC_NORTH</div>
              <h3 className="text-label-caps text-on-surface-variant mb-2">NORTH WING</h3>
              <p className="text-display-xl text-primary font-bold">42<span className="text-headline-sm text-on-surface-variant">%</span></p>
              <p className="text-cyber-volt text-sm mt-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyber-volt animate-pulse"></span>
                Optimal flow
              </p>
            </div>
            <div className="glass-panel p-6 border-b-2 border-b-[#ffb4ab] relative overflow-hidden">
               <div className="absolute top-2 right-4 tech-id">SEC_SOUTH</div>
              <h3 className="text-label-caps text-on-surface-variant mb-2">SOUTH WING</h3>
              <p className="text-display-xl text-primary font-bold">94<span className="text-headline-sm text-on-surface-variant">%</span></p>
              <p className="text-[#ffb4ab] text-sm mt-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ffb4ab] animate-pulse"></span>
                Heavy congestion
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
        {/* Live Score Hero */}
        <section className="relative">
          <div className="glass-panel volt-glow p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute top-2 right-4 tech-id">LIVE_MATCH_STREAM_V2.4</div>
            <div className="flex items-center gap-6 z-10 w-full md:w-auto">
              <div className="flex flex-col md:items-start text-center md:text-left">
                <span className="text-label-caps text-on-surface-variant/60">HOME</span>
                <h2 className="text-headline-lg font-bold uppercase italic leading-none">TITANS</h2>
              </div>
              <div className="text-display-xl font-bold text-cyber-volt ml-auto md:ml-0">2</div>
            </div>
            
            <div className="flex flex-col items-center z-10">
              <div className="text-cyber-volt font-bold animate-pulse mb-1">LIVE - {mins}'</div>
              <div className="w-px h-8 bg-white/20 mb-2"></div>
              <div className="text-headline-sm font-bold text-on-surface-variant/40">VS</div>
              <div className="w-px h-8 bg-white/20 mt-2"></div>
            </div>

            <div className="flex items-center gap-6 z-10 w-full md:w-auto md:flex-row-reverse">
              <div className="flex flex-col md:items-end text-center md:text-right">
                <span className="text-label-caps text-on-surface-variant/60">AWAY</span>
                <h2 className="text-headline-lg font-bold uppercase italic leading-none">APEX</h2>
              </div>
              <div className="text-display-xl font-bold text-primary mr-auto md:mr-0">1</div>
            </div>
            
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
              <div className="h-full bg-cyber-volt volt-glow transition-all duration-1000" style={{ width: `${(matchTime / (90 * 60)) * 100}%` }}></div>
            </div>
          </div>
        </section>

        {/* Smart Status Cards & AI */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Gate Status */}
          <div className="glass-panel p-6 space-y-4 hover:border-cyber-volt/50 transition-colors">
            <div className="flex justify-between items-start">
              <div className="tech-id">ENTRY_PT_04</div>
              <span className="w-2 h-2 rounded-full bg-cyber-volt volt-glow"></span>
            </div>
            <div>
              <p className="text-label-caps text-on-surface-variant">GATE 4 STATUS</p>
              <p className="text-headline-md font-bold text-cyber-volt">CLEAR</p>
            </div>
            <div className="flex items-center gap-2 text-body-md text-on-surface-variant">
              <span className="material-symbols-outlined text-cyber-volt">timer</span>
              <span>WAIT TIME: 2m</span>
            </div>
          </div>

          {/* Concourse Status */}
          <div className="glass-panel p-6 space-y-4 border-secondary/20 hover:border-secondary/50 transition-colors">
            <div className="flex justify-between items-start">
              <div className="tech-id">CONCOURSE_B</div>
              <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_10px_rgba(255,255,255,0.3)]"></span>
            </div>
            <div>
              <p className="text-label-caps text-on-surface-variant">CONCOURSE B</p>
              <p className="text-headline-md font-bold text-secondary">MODERATE</p>
            </div>
            <div className="flex items-center gap-2 text-body-md text-on-surface-variant">
              <span className="material-symbols-outlined text-secondary">groups</span>
              <span>CAPACITY: 64%</span>
            </div>
          </div>

          {/* Ask IQ AI Widget */}
          <div className="lg:col-span-2 glass-panel p-6 flex flex-col justify-center border-cyber-volt/30">
            <div className="flex justify-between items-center mb-2">
              <div className="tech-id">IQ_COGNITIVE_ASSISTANT</div>
              <div className="bg-cyber-volt text-black text-[10px] px-2 py-0.5 font-bold uppercase rounded">GenAI</div>
            </div>
            <h3 className="text-headline-sm font-bold text-primary mb-4">ASK IQ</h3>
            
            {iqResponse && (
              <div className="mb-4 bg-cyber-volt/10 border-l-2 border-cyber-volt p-3 text-sm text-primary animate-in fade-in slide-in-from-left-4">
                {iqResponse}
              </div>
            )}
            {isTyping && (
              <div className="mb-4 text-cyber-volt text-sm flex items-center gap-2">
                <span className="material-symbols-outlined animate-spin text-sm">autorenew</span>
                IQ is thinking...
              </div>
            )}

            <form onSubmit={handleAskIQ} className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-cyber-volt/60">psychology</span>
              <input 
                className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-12 pr-12 text-body-md focus:border-cyber-volt outline-none transition-all placeholder:text-on-surface-variant/30" 
                placeholder="Where is the nearest water station?" 
                type="text"
                value={iqInput}
                onChange={(e) => setIqInput(e.target.value)}
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-cyber-volt hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">send</span>
              </button>
            </form>
          </div>
        </section>
      </div>
    );
  };

  return (
    <>
      <header className="bg-black/80 backdrop-blur-xl border-b border-white/10 flex justify-between items-center w-full px-4 md:px-8 py-4 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-cyber-volt p-2 hover:bg-white/5 rounded transition-colors">menu</button>
          <h1 className="text-headline-md font-bold tracking-tighter text-cyber-volt italic uppercase">STADIUMIQ</h1>
        </div>
        <div className="hidden md:flex gap-8 items-center">
          {['HUB', 'ALERTS', 'MAP', 'CROWD'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-label-caps transition-colors ${activeTab === tab ? 'text-cyber-volt border-b-2 border-cyber-volt pb-1' : 'text-on-surface-variant hover:text-cyber-volt'}`}
            >
              {tab}
            </button>
          ))}
          <Link to="/login" className="text-label-caps text-on-surface-variant hover:text-cyber-volt transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
            STAFF
          </Link>
        </div>
        <div className="w-10 h-10 rounded-full border border-cyber-volt/40 overflow-hidden bg-white/10 flex justify-center items-center">
          <span className="material-symbols-outlined text-cyber-volt text-sm">person</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-8 space-y-6">
        {renderContent()}
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 bg-black/90 backdrop-blur-xl border-t border-white/10 md:hidden">
        {[
          { name: 'HUB', icon: 'home_max' },
          { name: 'MAP', icon: 'explore' },
          { name: 'CROWD', icon: 'groups' },
          { name: 'ALERTS', icon: 'warning' }
        ].map(tab => (
          <button 
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex flex-col items-center justify-center px-4 py-1.5 transition-colors rounded-lg ${activeTab === tab.name ? 'text-cyber-volt bg-cyber-volt/10 border border-cyber-volt/20 shadow-[0_0_15px_rgba(223,255,0,0.1)]' : 'text-on-surface-variant/60 hover:text-cyber-volt'}`}
          >
            <span className="material-symbols-outlined">{tab.icon}</span>
            <span className="text-label-caps mt-1">{tab.name}</span>
          </button>
        ))}
        <Link to="/login" className="flex flex-col items-center justify-center text-on-surface-variant/60 px-4 py-1.5 hover:text-cyber-volt">
          <span className="material-symbols-outlined">admin_panel_settings</span>
          <span className="text-label-caps mt-1">STAFF</span>
        </Link>
      </nav>
    </>
  );
};

export default CompanionHome;
