import React, { createContext, useContext, useState, useEffect } from 'react';

const GeminiKeyContext = createContext(null);

export const GeminiKeyProvider = ({ children }) => {
  const [apiKey, setApiKey] = useState(() => {
    // Try env var first, then sessionStorage
    return import.meta.env.VITE_GEMINI_API_KEY || sessionStorage.getItem('gemini_api_key') || '';
  });

  const saveKey = (key) => {
    sessionStorage.setItem('gemini_api_key', key);
    setApiKey(key);
  };

  const clearKey = () => {
    sessionStorage.removeItem('gemini_api_key');
    setApiKey('');
  };

  return (
    <GeminiKeyContext.Provider value={{ apiKey, saveKey, clearKey }}>
      {children}
    </GeminiKeyContext.Provider>
  );
};

export const useGeminiKey = () => useContext(GeminiKeyContext);
