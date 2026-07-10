import React, { useState } from "react";
import { ArrowLeft, MapPin, Users, Calendar, Wind, Layers, Bus, Radio, MessageSquare, Info, Zap } from "lucide-react";
import { STADIUMS, FACILITY_ICONS, getGateLevel } from "../data/stadiums.js";
import LiveTracker from "./LiveTracker.jsx";
import AIConcierge from "./AIConcierge.jsx";

const TABS = [
  { id: "overview", label: "Overview", icon: Info },
  { id: "tracker", label: "Live Tracker", icon: Radio },
  { id: "facilities", label: "Facilities", icon: MapPin },
  { id: "concierge", label: "AI Concierge", icon: MessageSquare },
];

export default function StadiumDetail({ stadiumId, onBack, language }) {
  const [activeTab, setActiveTab] = useState("overview");
  const stadium = STADIUMS[stadiumId];
  if (!stadium) return null;

  const pct = stadium.occupancyPct;
  const availablePct = Math.round((stadium.available / stadium.capacity) * 100);
  const busyGates = stadium.gates.filter(g => g.status === "Heavy");
  const clearGates = stadium.gates.filter(g => g.status === "Normal");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0", maxWidth: "1200px", margin: "0 auto" }}>
      {/* ── Back Button ── */}
      <button
        className="btn btn-ghost"
        style={{ alignSelf: "flex-start", marginBottom: "16px", gap: "6px", padding: "8px 12px" }}
        onClick={onBack}
      >
        <ArrowLeft size={16} /> Back to All Stadiums
      </button>

      {/* ── Stadium Hero with Real Photo ── */}
      <div style={{ borderRadius: "var(--radius-xl)", overflow: "hidden", border: "1px solid var(--border)", position: "relative", height: "320px", marginBottom: "24px" }}>
        {stadium.image ? (
          <img src={stadium.image} alt={stadium.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            background: "linear-gradient(135deg,#1a1a3e 0%,#0f3460 50%,#16213e 100%)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <div style={{ textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
              <svg viewBox="0 0 80 80" width="80" height="80" style={{ marginBottom: "12px" }}>
                <circle cx="40" cy="40" r="38" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                <rect x="20" y="15" width="40" height="50" rx="4" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                <rect x="28" y="28" width="24" height="29" rx="3" fill="#10b981" opacity="0.7" />
                <line x1="28" y1="42" x2="52" y2="42" stroke="#ffffff" strokeWidth="1" />
                <circle cx="40" cy="42" r="7" fill="none" stroke="#ffffff" strokeWidth="1" />
              </svg>
              <p style={{ fontSize: "20px", fontWeight: "700" }}>{stadium.name}</p>
              <p style={{ fontSize: "13px", marginTop: "4px" }}>{stadium.city}, {stadium.country}</p>
            </div>
          </div>
        )}
        {/* Dark gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)" }} />

        {/* Bottom Info Overlay */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 28px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <p style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.6)", marginBottom: "4px" }}>
                FIFA World Cup 2026
              </p>
              <h1 style={{ fontSize: "28px", fontWeight: "900", color: "#ffffff", letterSpacing: "-0.03em" }}>{stadium.name}</h1>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                <MapPin size={13} stroke="rgba(255,255,255,0.7)" />
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>{stadium.city}, {stadium.country}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              {busyGates.length > 0 && (
                <div style={{ backgroundColor: "rgba(239,68,68,0.85)", padding: "8px 14px", borderRadius: "var(--radius-md)", backdropFilter: "blur(4px)" }}>
                  <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.8)", fontWeight: "700" }}>BUSY GATES</p>
                  <p style={{ fontSize: "18px", fontWeight: "900", color: "#ffffff" }}>{busyGates.length}</p>
                </div>
              )}
              <div style={{ backgroundColor: "rgba(0,0,0,0.6)", padding: "8px 14px", borderRadius: "var(--radius-md)", backdropFilter: "blur(4px)" }}>
                <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.6)", fontWeight: "700" }}>NEXT MATCH</p>
                <p style={{ fontSize: "12px", fontWeight: "700", color: "#ffffff", marginTop: "2px" }}>{stadium.nextMatch}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Stats Row ── */}
      <div className="grid grid-cols-4 gap-4" style={{ marginBottom: "24px" }}>
        <div className="card kpi-card">
          <span className="kpi-label">Total Capacity</span>
          <span className="kpi-value" style={{ fontSize: "24px", display: "block", marginTop: "4px" }}>
            {stadium.capacity.toLocaleString()}
          </span>
        </div>
        <div className="card kpi-card">
          <span className="kpi-label">Available Seats</span>
          <span className="kpi-value" style={{ fontSize: "24px", color: "var(--success)", display: "block", marginTop: "4px" }}>
            {stadium.available.toLocaleString()}
          </span>
        </div>
        <div className="card kpi-card">
          <span className="kpi-label">Current Occupancy</span>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
            <span className="kpi-value" style={{ fontSize: "24px", color: pct >= 95 ? "var(--error)" : "var(--warning)" }}>
              {pct}%
            </span>
            <div style={{ flex: 1 }}>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${pct}%`, backgroundColor: pct >= 95 ? "var(--error)" : "var(--warning)" }} />
              </div>
            </div>
          </div>
        </div>
        <div className="card kpi-card">
          <span className="kpi-label">Best Gate Entry</span>
          <span className="kpi-value" style={{ fontSize: "18px", color: "var(--success)", display: "block", marginTop: "4px" }}>
            {clearGates[0]?.name || stadium.gates[0]?.name}
          </span>
          <span style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>{clearGates[0]?.wait || stadium.gates[0]?.wait} min wait</span>
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", marginBottom: "24px", gap: "0" }}>
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "12px 20px",
                fontSize: "13px",
                fontWeight: "600",
                background: "transparent",
                border: "none",
                borderBottom: activeTab === tab.id ? "2px solid var(--primary)" : "2px solid transparent",
                color: activeTab === tab.id ? "var(--primary)" : "var(--muted-foreground)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "color 0.2s, border-color 0.2s",
              }}
            >
              <Icon size={14} /> {tab.label}
              {tab.id === "tracker" && (
                <span style={{ padding: "1px 6px", backgroundColor: "var(--success-bg)", color: "var(--success)", borderRadius: "9999px", fontSize: "9px", fontWeight: "700" }}>LIVE</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ── */}

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Venue Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card card-body" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
                <Info size={15} stroke="var(--primary)" /> Venue Information
              </h3>
              {[
                { label: "Roof Type", value: stadium.roofType, icon: Wind },
                { label: "Playing Surface", value: stadium.surface, icon: Layers },
                { label: "Year Built", value: stadium.yearBuilt, icon: Calendar },
                { label: "Transit Options", value: stadium.transit, icon: Bus },
              ].map(row => (
                <div key={row.label} style={{ display: "flex", gap: "12px", padding: "10px", backgroundColor: "var(--muted)", borderRadius: "var(--radius-md)" }}>
                  <row.icon size={14} stroke="var(--muted-foreground)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <span style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", color: "var(--muted-foreground)" }}>{row.label}</span>
                    <p style={{ fontSize: "13px", fontWeight: "600", marginTop: "2px" }}>{row.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Seating Sections */}
            <div className="card card-body" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
                <Users size={15} stroke="var(--primary)" /> Seating Breakdown
              </h3>
              {Object.entries(stadium.sections).map(([zone, range]) => (
                <div key={zone} style={{ padding: "12px", backgroundColor: "var(--muted)", borderRadius: "var(--radius-md)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: "13px", fontWeight: "700", textTransform: "capitalize" }}>{zone} Bowl</span>
                    <p style={{ fontSize: "11px", color: "var(--muted-foreground)", marginTop: "2px" }}>Sections {range}</p>
                  </div>
                  <span className={`badge ${zone === "suites" ? "badge-amber" : zone === "upper" ? "badge-blue" : "badge-emerald"}`}>
                    {zone === "suites" ? "Premium" : zone === "upper" ? "Upper" : "Lower"}
                  </span>
                </div>
              ))}

              {/* Shuttle info */}
              <div style={{ padding: "12px", backgroundColor: "var(--info-bg)", borderRadius: "var(--radius-md)", border: "1px solid rgba(59,130,246,0.15)", marginTop: "4px" }}>
                <p style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "var(--info)", marginBottom: "4px" }}>
                  🚌 Shuttle & Transit
                </p>
                <p style={{ fontSize: "12px" }}>{stadium.shuttle}</p>
              </div>
            </div>
          </div>

          {/* Gates Summary Table */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Gate Status Dashboard</span>
              <span className="badge badge-rose">{busyGates.length} Busy</span>
            </div>
            <div className="table-container" style={{ border: "none", borderRadius: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Gate</th>
                    <th>Wait Time</th>
                    <th>Crowd Level</th>
                    <th>Status</th>
                    <th>AI Recommendation</th>
                  </tr>
                </thead>
                <tbody>
                  {stadium.gates.map(gate => {
                    const level = getGateLevel(gate.crowd);
                    const col = level === "high" ? "var(--error)" : level === "medium" ? "var(--warning)" : "var(--success)";
                    return (
                      <tr key={gate.id}>
                        <td style={{ fontWeight: "700" }}>{gate.name}</td>
                        <td style={{ fontFamily: "JetBrains Mono,monospace", fontWeight: "700" }}>{gate.wait} min</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div className="progress-bar-track" style={{ width: "80px" }}>
                              <div className="progress-bar-fill" style={{ width: `${gate.crowd}%`, backgroundColor: col }} />
                            </div>
                            <span style={{ fontSize: "11px", fontWeight: "700", color: col }}>{gate.crowd}%</span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${level === "high" ? "badge-rose" : level === "medium" ? "badge-amber" : "badge-emerald"}`}>
                            {gate.status}
                          </span>
                        </td>
                        <td style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
                          {level === "high" ? "⚠️ Avoid — use alternate gate" : level === "medium" ? "🟡 Acceptable — minor delay" : "✅ Use this gate"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* LIVE TRACKER TAB */}
      {activeTab === "tracker" && <LiveTracker stadium={stadium} />}

      {/* FACILITIES TAB */}
      {activeTab === "facilities" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Facility type groupings */}
          {Object.entries(FACILITY_ICONS).map(([type, meta]) => {
            const items = stadium.facilities.filter(f => f.type === type);
            if (!items.length) return null;
            return (
              <div key={type} className="card">
                <div className="card-header">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "20px" }}>{meta.emoji}</span>
                    <span className="card-title">{meta.label}</span>
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--muted-foreground)" }}>{items.length} location{items.length > 1 ? "s" : ""}</span>
                </div>
                <div className="card-body" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: "12px" }}>
                  {items.map((fac, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "14px",
                        borderRadius: "var(--radius-md)",
                        border: `1px solid ${meta.color}44`,
                        backgroundColor: `${meta.color}11`,
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                      }}
                    >
                      <p style={{ fontWeight: "700", fontSize: "13px" }}>{fac.label}</p>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <span className="badge badge-zinc">{fac.section}</span>
                        <span className="badge badge-blue">{fac.level} Level</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI CONCIERGE TAB */}
      {activeTab === "concierge" && (
        <div style={{ maxWidth: "680px" }}>
          <AIConcierge stadiumKey={stadiumId} language={language} />
        </div>
      )}
    </div>
  );
}
