import React, { useState } from 'react';
import { useGeminiKey } from '../context/GeminiKeyContext';

const ApiKeyModal = ({ onClose }) => {
  const { saveKey } = useGeminiKey();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) {
      setError('API key cannot be empty');
      return;
    }
    saveKey(trimmed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md px-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md glass-panel p-8 relative border border-cyber-volt/30">
        {/* Scanline */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] rounded-lg" style={{
          backgroundImage: 'linear-gradient(rgba(223,255,0,1) 1px, transparent 1px)',
          backgroundSize: '100% 4px',
        }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-cyber-volt/10 border border-cyber-volt/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-cyber-volt text-lg">neurology</span>
            </div>
            <div>
              <h2 className="text-headline-sm font-bold text-primary">Connect Gemini AI</h2>
              <p className="text-[10px] font-label-caps text-on-surface-variant/60">REAL_AI_INTEGRATION_REQUIRED</p>
            </div>
          </div>

          <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
            Enter your <span className="text-cyber-volt font-semibold">Google Gemini API key</span> to activate live AI responses in Ask IQ and the CopilotIQ terminal.
            Get a free key at{' '}
            <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="text-cyber-volt underline underline-offset-2">
              aistudio.google.com
            </a>
          </p>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-cyber-volt/50 text-lg">key</span>
              <input
                type="password"
                value={input}
                onChange={(e) => { setInput(e.target.value); setError(''); }}
                placeholder="AIza..."
                className="w-full bg-black/60 border border-white/10 rounded py-3 pl-11 pr-4 text-sm text-primary font-mono focus:border-cyber-volt focus:outline-none transition-all placeholder:text-white/20"
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-[#ffb4ab]/10 border border-[#ffb4ab]/30 text-[#ffb4ab] px-3 py-2 text-xs font-label-caps flex items-center gap-2 rounded">
                <span className="material-symbols-outlined text-sm">error</span>{error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-cyber-volt text-black font-label-caps py-3 text-sm tracking-widest hover:brightness-110 transition-all rounded flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">check_circle</span>
                ACTIVATE
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 bg-white/5 border border-white/10 text-on-surface-variant font-label-caps text-sm hover:bg-white/10 transition-all rounded"
              >
                SKIP
              </button>
            </div>
          </form>

          <p className="text-[9px] font-label-caps text-on-surface-variant/30 mt-4 text-center">
            KEY STORED IN SESSION ONLY • NEVER SENT TO ANY SERVER
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
