import React, { useState, useMemo } from "react";
import { Search, MapPin, Users, ChevronRight, Star } from "lucide-react";
import { STADIUMS, getStadiumList } from "../data/stadiums.js";

const COUNTRY_FLAGS = { USA: "🇺🇸", Mexico: "🇲🇽", Canada: "🇨🇦", India: "🇮🇳" };

// Gradient color covers for stadiums without a photo
const GRADIENT_COVERS = [
  "linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)",
  "linear-gradient(135deg,#0d1b2a,#1b4332,#40916c)",
  "linear-gradient(135deg,#2d1b69,#11998e,#38ef7d)",
  "linear-gradient(135deg,#2c3e50,#4ca1af)",
  "linear-gradient(135deg,#373b44,#4286f4)",
  "linear-gradient(135deg,#141e30,#243b55)",
  "linear-gradient(135deg,#1a1a2e,#e94560)",
  "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
  "linear-gradient(135deg,#200122,#6f0000)",
  "linear-gradient(135deg,#0052d4,#65c7f7,#9cecfb)",
];

export default function StadiumSearch({ onSelectStadium }) {
  const [query, setQuery] = useState("");
  const [filterCountry, setFilterCountry] = useState("All");

  const stadiumList = getStadiumList();

  const filtered = useMemo(() => {
    return stadiumList.filter(s => {
      const matchesQuery =
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.city.toLowerCase().includes(query.toLowerCase()) ||
        s.country.toLowerCase().includes(query.toLowerCase());
      const matchesCountry = filterCountry === "All" || s.country === filterCountry;
      return matchesQuery && matchesCountry;
    });
  }, [query, filterCountry, stadiumList]);

  const gradientIdx = (id) => {
    const all = Object.keys(STADIUMS);
    return all.indexOf(id) % GRADIENT_COVERS.length;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Hero Banner */}
      <div style={{
        background: "linear-gradient(135deg,#1a1a3e 0%,#0f3460 50%,#16213e 100%)",
        borderRadius: "var(--radius-xl)",
        padding: "40px 32px",
        position: "relative",
        overflow: "hidden",
        border: "1px solid var(--border)",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 70% 50%, rgba(59,130,246,0.15) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <Star size={20} fill="#fbbf24" stroke="#fbbf24" />
            <span style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "#fbbf24" }}>FIFA World Cup 2026</span>
          </div>
          <h1 style={{ fontSize: "32px", fontWeight: "900", color: "#ffffff", letterSpacing: "-0.03em", marginBottom: "8px" }}>
            All 16 Host Stadiums
          </h1>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.65)", maxWidth: "520px" }}>
            Select any stadium to explore real-time gate wait times, seat availability, facility maps (toilets, food, medical), and live location tracking.
          </p>
        </div>
      </div>

      {/* Search + Filter Bar */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "240px", position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)", pointerEvents: "none" }} />
          <input
            type="text"
            className="input"
            placeholder="Search by stadium name, city or country..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ paddingLeft: "38px" }}
          />
        </div>
        <div className="segmented-control">
          {["All", "USA", "Mexico", "Canada", "India"].map(c => (
            <button
              key={c}
              className={`segmented-btn ${filterCountry === c ? "active" : ""}`}
              onClick={() => setFilterCountry(c)}
            >
              {c === "All" ? "All Countries" : `${COUNTRY_FLAGS[c]} ${c}`}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div style={{ fontSize: "12px", color: "var(--muted-foreground)", fontWeight: "600" }}>
        Showing {filtered.length} of {stadiumList.length} venues
      </div>

      {/* Stadium Grid */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map((s, idx) => {
          const full = STADIUMS[s.id];
          const pct = full.occupancyPct;
          const available = full.available.toLocaleString();
          const busyGates = full.gates.filter(g => g.status === "Heavy").length;

          return (
            <div
              key={s.id}
              className="card"
              style={{ cursor: "pointer", overflow: "hidden" }}
              onClick={() => onSelectStadium(s.id)}
            >
              {/* Stadium Photo or Gradient Cover */}
              <div style={{ height: "180px", position: "relative", overflow: "hidden", flexShrink: 0 }}>
                {full.image ? (
                  <img
                    src={full.image}
                    alt={s.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
                  />
                ) : (
                  <div style={{
                    width: "100%", height: "100%",
                    background: GRADIENT_COVERS[gradientIdx(s.id)],
                    display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "8px"
                  }}>
                    <svg viewBox="0 0 60 60" width="52" height="52" style={{ opacity: 0.4 }}>
                      <circle cx="30" cy="30" r="28" fill="none" stroke="#ffffff" strokeWidth="2.5" />
                      <rect x="16" y="12" width="28" height="36" rx="3" fill="#ffffff" opacity="0.15" stroke="#ffffff" strokeWidth="1.5" />
                      <line x1="16" y1="30" x2="44" y2="30" stroke="#ffffff" strokeWidth="1.5" />
                      <circle cx="30" cy="30" r="8" fill="none" stroke="#ffffff" strokeWidth="1.5" />
                    </svg>
                    <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", fontWeight: "600" }}>{s.name}</span>
                  </div>
                )}
                {/* Overlay badges */}
                <div style={{ position: "absolute", top: "10px", left: "10px", display: "flex", gap: "6px" }}>
                  <span className="badge" style={{ backgroundColor: "rgba(0,0,0,0.65)", color: "#ffffff", backdropFilter: "blur(4px)", fontSize: "10px" }}>
                    {COUNTRY_FLAGS[s.country]} {s.country}
                  </span>
                  {busyGates > 0 && (
                    <span className="badge badge-rose" style={{ backgroundColor: "rgba(239,68,68,0.85)", color: "#ffffff", fontSize: "10px" }}>
                      {busyGates} Gate{busyGates > 1 ? "s" : ""} Busy
                    </span>
                  )}
                </div>
                <div style={{ position: "absolute", bottom: "10px", right: "10px" }}>
                  <span className="badge" style={{ backgroundColor: "rgba(0,0,0,0.7)", color: pct >= 95 ? "#f87171" : pct >= 90 ? "#fbbf24" : "#34d399", backdropFilter: "blur(4px)", fontSize: "10px" }}>
                    {pct}% Full
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: "800", color: "var(--foreground)", letterSpacing: "-0.02em" }}>{s.name}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "3px" }}>
                    <MapPin size={12} stroke="var(--muted-foreground)" />
                    <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>{s.city}</span>
                  </div>
                </div>

                {/* Capacity & Availability */}
                <div style={{ display: "flex", gap: "16px" }}>
                  <div>
                    <span style={{ fontSize: "10px", color: "var(--muted-foreground)", fontWeight: "600", textTransform: "uppercase" }}>Capacity</span>
                    <p style={{ fontSize: "14px", fontWeight: "700", fontFamily: "JetBrains Mono,monospace" }}>{s.capacity.toLocaleString()}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: "10px", color: "var(--success)", fontWeight: "600", textTransform: "uppercase" }}>Available Now</span>
                    <p style={{ fontSize: "14px", fontWeight: "700", color: "var(--success)", fontFamily: "JetBrains Mono,monospace" }}>{available}</p>
                  </div>
                </div>

                {/* Occupancy Bar */}
                <div>
                  <div className="progress-bar-track">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: pct >= 95 ? "var(--error)" : pct >= 88 ? "var(--warning)" : "var(--success)"
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", fontSize: "10px", color: "var(--muted-foreground)" }}>
                    <span>Occupancy: {pct}%</span>
                    <span>{full.occupied.toLocaleString()} fans inside</span>
                  </div>
                </div>

                {/* CTA */}
                <button
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center", gap: "8px" }}
                >
                  <MapPin size={14} /> Explore Stadium <ChevronRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--muted-foreground)" }}>
          <Search size={48} style={{ marginBottom: "12px", opacity: 0.3 }} />
          <h3 style={{ fontSize: "18px", fontWeight: "700" }}>No stadiums found</h3>
          <p style={{ fontSize: "13px", marginTop: "4px" }}>Try a different search term or filter</p>
        </div>
      )}
    </div>
  );
}
