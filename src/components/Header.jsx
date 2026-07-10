import React from "react";
import { Sun, Moon, MapPin, Globe } from "lucide-react";

export default function Header({ 
  currentView, 
  currentStadium, 
  setStadium, 
  language, 
  setLanguage, 
  darkMode, 
  toggleDarkMode 
}) {
  const viewTitle = currentView === "fan" 
    ? "FanAssist 360" 
    : "ArenaIntel Operations Command";
  
  const viewSubtitle = currentView === "fan"
    ? "Multilingual Guest Concierge & Stadium Companion"
    : "Generative AI Real-Time Decision Support & Dispatch";

  return (
    <header className="header-bar">
      <div>
        <h1 style={{ fontSize: "20px", fontWeight: "800", trackingTight: "-0.04em", display: "flex", alignItems: "center", gap: "8px" }}>
          {viewTitle}
          {currentView === "ops" && (
            <span className="badge badge-rose" style={{ fontSize: "10px", padding: "1px 6px" }}>
              HQ Live
            </span>
          )}
        </h1>
        <p style={{ fontSize: "12px", color: "var(--muted-foreground)", fontWeight: "500", marginTop: "2px" }}>
          {viewSubtitle}
        </p>
      </div>

      <div className="flex items-center gap-4 flex-mobile-col" style={{ flexShrink: 0 }}>
        {/* Stadium Selector */}
        <div className="flex items-center gap-2" style={{ backgroundColor: "var(--muted)", padding: "4px 8px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
          <MapPin size={16} stroke="var(--muted-foreground)" />
          <select 
            className="input select-dropdown" 
            style={{ 
              border: "none", 
              background: "transparent", 
              padding: "2px 24px 2px 2px", 
              fontSize: "13px", 
              fontWeight: "600",
              width: "auto",
              boxShadow: "none"
            }}
            value={currentStadium}
            onChange={(e) => setStadium(e.target.value)}
          >
            <option value="metlife">MetLife Stadium (NY/NJ)</option>
            <option value="sofi">SoFi Stadium (Los Angeles)</option>
            <option value="azteca">Estadio Azteca (Mexico City)</option>
          </select>
        </div>

        {/* Language Selector (Active for Chatbot) */}
        {currentView === "fan" && (
          <div className="flex items-center gap-2" style={{ backgroundColor: "var(--muted)", padding: "4px 8px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
            <Globe size={16} stroke="var(--muted-foreground)" />
            <select 
              className="input select-dropdown" 
              style={{ 
                border: "none", 
                background: "transparent", 
                padding: "2px 24px 2px 2px", 
                fontSize: "13px", 
                fontWeight: "600",
                width: "auto",
                boxShadow: "none"
              }}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="english">English (US)</option>
              <option value="spanish">Español (ES)</option>
              <option value="french">Français (FR)</option>
              <option value="arabic">العربية (AR)</option>
            </select>
          </div>
        )}

        {/* Theme Toggle */}
        <button 
          className="btn btn-secondary" 
          style={{ width: "36px", height: "36px", padding: 0, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={toggleDarkMode}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
