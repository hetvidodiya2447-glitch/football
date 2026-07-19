import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import StadiumMap from '../components/StadiumMap';
import { createCompanionChat, sendMessageStream, getErrorMessage } from '../services/gemini';

const CompanionHome = () => {
  const [matchTime, setMatchTime] = useState(74 * 60 + 17);
  const [activeTab, setActiveTab] = useState('HUB');
  const [iqInput, setIqInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [aiError, setAiError] = useState('');
  const chatRef = useRef(null);
  const chatSessionRef = useRef(null);

  // Tick match time
  useEffect(() => {
    const timer = setInterval(() => setMatchTime(p => p + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize RAG chat session
  useEffect(() => {
    chatSessionRef.current = createCompanionChat();
  }, []);

  // Auto-scroll chat panel
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chatHistory, isTyping]);

  const handleAskIQ = async (e) => {
    e.preventDefault();
    if (!iqInput.trim()) return;

    const userMsg = iqInput.trim();
    setIqInput('');
    setIsTyping(true);
    setAiError('');

    // Add user message
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);

    // Add placeholder AI message
    const aiId = Date.now();
    setChatHistory(prev => [...prev, { role: 'ai', text: '', id: aiId, streaming: true }]);

    try {
      if (!chatSessionRef.current) {
        chatSessionRef.current = createCompanionChat();
      }

      await sendMessageStream(chatSessionRef.current, userMsg, (partial) => {
        setChatHistory(prev =>
          prev.map(m => m.id === aiId ? { ...m, text: partial } : m)
        );
      });

      // Mark streaming done
      setChatHistory(prev =>
        prev.map(m => m.id === aiId ? { ...m, streaming: false } : m)
      );
    } catch (err) {
      console.error('RAG Chatbot error:', err);
      setAiError(getErrorMessage(err));
      setChatHistory(prev => prev.filter(m => m.id !== aiId));
    } finally {
      setIsTyping(false);
    }
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

    if (activeTab === 'MAP') return <StadiumMap />;

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
                <span className="w-2 h-2 rounded-full bg-cyber-volt animate-pulse"></span>Optimal flow
              </p>
            </div>
            <div className="glass-panel p-6 border-b-2 border-b-[#ffb4ab] relative overflow-hidden">
              <div className="absolute top-2 right-4 tech-id">SEC_SOUTH</div>
              <h3 className="text-label-caps text-on-surface-variant mb-2">SOUTH WING</h3>
              <p className="text-display-xl text-primary font-bold">94<span className="text-headline-sm text-on-surface-variant">%</span></p>
              <p className="text-[#ffb4ab] text-sm mt-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ffb4ab] animate-pulse"></span>Heavy congestion
              </p>
            </div>
          </div>
        </div>
      );
    }

    // HUB
    return (
      <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
        {/* Live Score Hero */}
        <section>
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

        {/* Status Cards + AI Chat */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

          {/* ─── Ask IQ — Gemini AI Chat ─── */}
          <div className="lg:col-span-2 glass-panel p-6 flex flex-col border-cyber-volt/30 min-h-[280px]">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <div className="tech-id">IQ_COGNITIVE_ASSISTANT</div>
                <div className="bg-cyber-volt text-black text-[9px] px-2 py-0.5 font-bold uppercase rounded flex items-center gap-1">
                  <span className="material-symbols-outlined text-[10px]">neurology</span>
                  LOCAL RAG
                </div>
              </div>
              <div className="flex items-center gap-1 text-[9px] font-label-caps px-2 py-1 rounded border border-cyber-volt/40 text-cyber-volt/70">
                <span className="material-symbols-outlined text-[12px]">check_circle</span>
                OFFLINE ACTIVE
              </div>
            </div>
            <h3 className="text-headline-sm font-bold text-primary mb-3">ASK IQ</h3>

            {/* Chat history */}
            {chatHistory.length > 0 && (
              <div ref={chatRef} className="flex-grow overflow-y-auto mb-3 space-y-3 max-h-40 pr-1">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] px-3 py-2 text-sm rounded-lg animate-in fade-in slide-in-from-bottom-1 ${
                      msg.role === 'user'
                        ? 'bg-cyber-volt/20 border border-cyber-volt/30 text-primary'
                        : 'bg-white/5 border border-white/10 text-on-surface-variant'
                    }`}>
                      {msg.role === 'ai' && (
                        <div className="flex items-center gap-1 mb-1">
                          <span className="material-symbols-outlined text-cyber-volt text-[10px]">neurology</span>
                          <span className="text-cyber-volt text-[9px] font-label-caps">IQ</span>
                          {msg.streaming && <span className="material-symbols-outlined text-[10px] text-cyber-volt animate-spin">autorenew</span>}
                        </div>
                      )}
                      <p className="leading-relaxed">{msg.text || (msg.streaming ? '...' : '')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Suggestions when no history */}
            {chatHistory.length === 0 && (
              <div className="flex-grow flex flex-col justify-center gap-2 mb-3">
                {['Where is the nearest exit?', 'Best food near Gate 4?', 'Is Gate 7 safe to use?'].map(q => (
                  <button
                    key={q}
                    onClick={() => { setIqInput(q); }}
                    className="text-left text-[11px] text-on-surface-variant/60 hover:text-cyber-volt border border-white/5 hover:border-cyber-volt/30 px-3 py-1.5 rounded transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {aiError && (
              <div className="mb-2 bg-[#ffb4ab]/10 border border-[#ffb4ab]/30 text-[#ffb4ab] px-3 py-1.5 text-[10px] font-label-caps flex items-center gap-2 rounded">
                <span className="material-symbols-outlined text-sm">error</span>{aiError}
              </div>
            )}

            <form onSubmit={handleAskIQ} className="relative mt-auto">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-cyber-volt/60">psychology</span>
              <input
                className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-12 pr-14 text-body-md focus:border-cyber-volt outline-none transition-all placeholder:text-on-surface-variant/30"
                placeholder="Ask anything about the stadium..."
                type="text"
                value={iqInput}
                onChange={(e) => setIqInput(e.target.value)}
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={isTyping || !iqInput.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cyber-volt hover:scale-110 transition-transform disabled:opacity-30"
              >
                <span className="material-symbols-outlined">{isTyping ? 'autorenew' : 'send'}</span>
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
            <span className="material-symbols-outlined text-sm">admin_panel_settings</span>STAFF
          </Link>
        </div>
        <div className="w-10 h-10 rounded-full border border-cyber-volt/40 overflow-hidden bg-white/10 flex justify-center items-center">
          <span className="material-symbols-outlined text-cyber-volt text-sm">person</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-8 space-y-6 pb-24">
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
