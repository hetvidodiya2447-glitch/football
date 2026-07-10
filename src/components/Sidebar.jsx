import React from "react";
import { Compass, ShieldAlert, Leaf, Activity, Languages, Info } from "lucide-react";

export default function Sidebar({ currentView, setView, currentStadium }) {
  const stadiumName = currentStadium === "metlife" 
    ? "MetLife Stadium" 
    : currentStadium === "sofi" 
      ? "SoFi Stadium" 
      : "Estadio Azteca";

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <svg 
          viewBox="0 0 24 24" 
          width="32" 
          height="32" 
          stroke="var(--primary)" 
          strokeWidth="2.5" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: "700", trackingTight: "-0.03em" }}>
            FIFA 2026
          </h2>
          <span style={{ fontSize: "11px", color: "var(--muted-foreground)", fontWeight: "600", textTransform: "uppercase" }}>
            Arena Hub
          </span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div style={{ padding: "0 16px 8px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "var(--muted-foreground)" }}>
          Role Views
        </div>
        <div 
          className={`sidebar-item ${currentView === "fan" ? "active" : ""}`}
          onClick={() => setView("fan")}
        >
          <Compass size={18} />
          <span>Fan Hub (360)</span>
        </div>
        <div 
          className={`sidebar-item ${currentView === "ops" ? "active" : ""}`}
          onClick={() => setView("ops")}
        >
          <ShieldAlert size={18} />
          <span>Operations Center</span>
        </div>

        <div style={{ height: "1px", backgroundColor: "var(--border)", margin: "16px 0" }}></div>

        <div style={{ padding: "0 16px 8px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "var(--muted-foreground)" }}>
          Active Venue
        </div>
        <div style={{ padding: "8px 16px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)" }}>
            {stadiumName}
          </span>
          <span style={{ fontSize: "11px", color: "var(--success)", display: "flex", alignItems: "center", gap: "4px", fontWeight: "500" }}>
            <span style={{ width: "6px", height: "6px", backgroundColor: "var(--success)", borderRadius: "50%" }}></span>
            Live Operations Active
          </span>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div style={{ display: "flex", gap: "8px", alignItems: "center", padding: "10px", borderRadius: "var(--radius-md)", backgroundColor: "var(--muted)" }}>
          <Activity size={16} stroke="var(--primary)" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--foreground)" }}>
              AI Engine Status
            </span>
            <span style={{ fontSize: "10px", color: "var(--muted-foreground)" }}>
              Gemini-Flash 3.5 Online
            </span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "var(--muted-foreground)", padding: "0 4px" }}>
          <span>V1.0.4-live</span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Languages size={12} />
            <span>Multi</span>
          </span>
        </div>
      </div>
    </div>
  );
}
