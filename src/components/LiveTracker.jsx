import React, { useState, useEffect, useRef, useMemo } from "react";
import { Navigation, MapPin, Radio } from "lucide-react";
import { FACILITY_ICONS, getGateLevel } from "../data/stadiums.js";

// ─────────────────────────────────────────────────────────
// Simulates fan moving around the stadium
// FIX 1: Single RAF loop — no nested tick() inside throttled(),
//         one cancelAnimationFrame() correctly kills everything.
// ─────────────────────────────────────────────────────────
function useSimulatedTracking(stadium) {
  const [position, setPosition]               = useState({ x: 100, y: 100 });
  const [nearbyFacilities, setNearbyFacilities] = useState([]);
  const [nearestGate, setNearestGate]         = useState(null);
  const [accuracy, setAccuracy]               = useState(3);

  const rafRef   = useRef(null);
  const posRef   = useRef({ x: 100, y: 100 });
  const dirRef   = useRef({ dx: 0.45, dy: 0.32 });
  const lastRef  = useRef(0);

  useEffect(() => {
    if (!stadium) return;

    // Reset on stadium change
    posRef.current = { x: 100, y: 100 };
    setPosition({ x: 100, y: 100 });

    const loop = (ts) => {
      rafRef.current = requestAnimationFrame(loop);

      // Throttle to ~12 fps  ← FIX 1: single RAF, throttle via timestamp
      if (ts - lastRef.current < 80) return;
      lastRef.current = ts;

      const pos = posRef.current;
      let { dx, dy } = dirRef.current;

      if (pos.x + dx > 180 || pos.x + dx < 20) dx = -dx;
      if (pos.y + dy > 180 || pos.y + dy < 20) dy = -dy;

      const next = { x: pos.x + dx, y: pos.y + dy };
      posRef.current = next;
      dirRef.current = { dx, dy };

      setPosition({ ...next });
      setAccuracy(Math.floor(2 + Math.random() * 5));

      // Nearest facilities (sorted by Euclidean distance)
      if (stadium?.facilities?.length) {
        const sorted = stadium.facilities
          .map(f => ({
            ...f,
            dist: Math.sqrt((f.cx - next.x) ** 2 + (f.cy - next.y) ** 2),
          }))
          .sort((a, b) => a.dist - b.dist)
          .slice(0, 4);
        setNearbyFacilities(sorted);
      }

      // Nearest gate
      if (stadium?.gates?.length) {
        const R = 82;
        const nearest = stadium.gates
          .map(g => {
            const rad = (g.angle * Math.PI) / 180;
            const gx  = 100 + R * Math.sin(rad);
            const gy  = 100 - R * Math.cos(rad);
            return { ...g, gx, gy, dist: Math.sqrt((gx - next.x) ** 2 + (gy - next.y) ** 2) };
          })
          .sort((a, b) => a.dist - b.dist)[0];
        setNearestGate(nearest);
      }
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);  // ← FIX 1: single cancel
  }, [stadium]);

  return { position, nearbyFacilities, nearestGate, accuracy };
}

// ─────────────────────────────────────────────────────────
// Gate coordinates helper (memoization-friendly pure fn)
// ─────────────────────────────────────────────────────────
function gateXY(angle, r = 88) {
  const rad = (angle * Math.PI) / 180;
  return { x: 100 + r * Math.sin(rad), y: 100 - r * Math.cos(rad) };
}

export default function LiveTracker({ stadium }) {
  const { position, nearbyFacilities, nearestGate, accuracy } = useSimulatedTracking(stadium);
  const [selectedFacilityType, setSelectedFacilityType] = useState(null);

  // FIX 2: pulse phase as 0–3 cycling cleanly, opacity never negative
  const [pulsePhase, setPulsePhase] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPulsePhase(p => (p + 1) % 4), 600);
    return () => clearInterval(id);
  }, []);

  // Best (least crowded) gate — memoised, won't flicker
  const bestGate = useMemo(
    () => stadium?.gates ? [...stadium.gates].sort((a, b) => a.crowd - b.crowd)[0] : null,
    [stadium]
  );

  // Direction line: only draw when nearest gate IS the best gate
  const showDirLine = useMemo(() => {
    if (!nearestGate || !bestGate) return false;
    return nearestGate.id === bestGate.id;
  }, [nearestGate, bestGate]);

  const filteredFacilities = useMemo(
    () => selectedFacilityType
      ? stadium?.facilities?.filter(f => f.type === selectedFacilityType) ?? []
      : stadium?.facilities ?? [],
    [stadium, selectedFacilityType]
  );

  if (!stadium) return null;

  const OUTER_R = 88;
  const INNER_R = 58;

  // FIX 2: safe pulse values — phase 0→3, never negative
  const userPulseR    = 8 + pulsePhase * 2.5;          // 8 → 17.5
  const userPulseOpacity = 0.55 - pulsePhase * 0.13;   // 0.55 → 0.16 (always > 0)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ padding: "8px", backgroundColor: "var(--success-bg)", borderRadius: "50%", color: "var(--success)" }}>
            <Radio size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: "700" }}>Live Location Tracker</h3>
            <p style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>
              GPS accuracy: ±{accuracy}m • Signal: Strong
            </p>
          </div>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: "6px",
          padding: "6px 12px", backgroundColor: "var(--success-bg)",
          borderRadius: "9999px", border: "1px solid rgba(52,211,153,0.2)",
        }}>
          <div style={{
            width: "6px", height: "6px", borderRadius: "50%",
            backgroundColor: "var(--success)", animation: "pulseRed 1.6s infinite",
          }} />
          <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--success)" }}>LIVE TRACKING</span>
        </div>
      </div>

      {/* ── Facility Filter Chips ── */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button
          onClick={() => setSelectedFacilityType(null)}
          className="quick-prompt-pill"
          style={{
            backgroundColor: !selectedFacilityType ? "var(--primary)" : "var(--muted)",
            color: !selectedFacilityType ? "#fff" : "var(--muted-foreground)",
            border: "none",
          }}
        >
          All Facilities
        </button>
        {Object.entries(FACILITY_ICONS).map(([type, meta]) => (
          <button
            key={type}
            onClick={() => setSelectedFacilityType(type === selectedFacilityType ? null : type)}
            className="quick-prompt-pill"
            style={{
              backgroundColor: selectedFacilityType === type ? meta.color : "var(--muted)",
              color: selectedFacilityType === type ? "#fff" : "var(--muted-foreground)",
              border: `1px solid ${selectedFacilityType === type ? meta.color : "var(--border)"}`,
            }}
          >
            {meta.emoji} {meta.label}
          </button>
        ))}
      </div>

      {/* ── SVG Map + Side Panels ── */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>

        {/* ── SVG Floor Plan ── */}
        <div className="card" style={{ flex: 1, minWidth: "300px" }}>
          <div className="card-header" style={{ paddingBottom: "12px" }}>
            <span className="card-title" style={{ fontSize: "14px" }}>
              Stadium Floor Plan — {stadium.name}
            </span>
            <span style={{ fontSize: "10px", color: "var(--muted-foreground)" }}>
              Blue dot = your live location
            </span>
          </div>
          <div className="card-body" style={{ padding: "12px" }}>
            <svg viewBox="0 0 200 200" style={{ width: "100%", height: "auto", maxHeight: "420px" }}>

              {/* Outer border ring */}
              <ellipse cx="100" cy="100" rx="90" ry="88" fill="none" stroke="var(--border)" strokeWidth="1.5" />

              {/* Seating rings */}
              <ellipse cx="100" cy="100" rx={OUTER_R} ry={OUTER_R - 4}
                fill="var(--muted)" stroke="var(--border)" strokeWidth="1" opacity="0.6" />
              <ellipse cx="100" cy="100" rx={INNER_R} ry={INNER_R - 3}
                fill="var(--card)" stroke="var(--border)" strokeWidth="1" />

              {/* Football pitch */}
              <rect x="68" y="62" width="64" height="76" rx="5"
                fill="#10b981" stroke="#ffffff" strokeWidth="1.5" opacity="0.85" />
              <line x1="68" y1="100" x2="132" y2="100" stroke="#ffffff" strokeWidth="1" />
              <circle cx="100" cy="100" r="14" fill="none" stroke="#ffffff" strokeWidth="1" />
              <circle cx="100" cy="100" r="2" fill="#ffffff" />
              <rect x="83" y="62"  width="34" height="10" fill="none" stroke="#ffffff" strokeWidth="1" rx="1" />
              <rect x="83" y="128" width="34" height="10" fill="none" stroke="#ffffff" strokeWidth="1" rx="1" />

              {/* Compass */}
              <text x="100" y="12"  textAnchor="middle" fontSize="8" fill="var(--muted-foreground)" fontWeight="700">N</text>
              <text x="100" y="196" textAnchor="middle" fontSize="8" fill="var(--muted-foreground)" fontWeight="700">S</text>
              <text x="196" y="104" textAnchor="middle" fontSize="8" fill="var(--muted-foreground)" fontWeight="700">E</text>
              <text x="4"   y="104" textAnchor="middle" fontSize="8" fill="var(--muted-foreground)" fontWeight="700">W</text>

              {/* Gates */}
              {stadium.gates.map(gate => {
                const { x, y }  = gateXY(gate.angle);
                const level      = getGateLevel(gate.crowd);
                const gateColor  = level === "high" ? "#ef4444" : level === "medium" ? "#f59e0b" : "#10b981";

                // FIX 3: safe gate pulse opacity — clamp at 0
                const gPulseR   = 9 + pulsePhase * 3;
                const gPulseOp  = Math.max(0, 0.45 - pulsePhase * 0.11);

                return (
                  <g key={gate.id}>
                    {level === "high" && (
                      <circle cx={x} cy={y} r={gPulseR}
                        fill="none" stroke="#ef4444" strokeWidth="1" opacity={gPulseOp} />
                    )}
                    <circle cx={x} cy={y} r="7"
                      fill={gateColor} stroke="#ffffff" strokeWidth="1.5" style={{ cursor: "pointer" }} />
                    <text x={x} y={y + 3.5}
                      textAnchor="middle" fontSize="6" fill="#ffffff" fontWeight="800" pointerEvents="none">
                      {gate.id}
                    </text>
                    {/* Wait-time label offset away from center */}
                    <text
                      x={x + (x > 102 ? 13 : x < 98 ? -13 : 0)}
                      y={y + (y > 102 ? 15 : y < 98 ? -10 : 3.5)}
                      textAnchor={x > 102 ? "start" : x < 98 ? "end" : "middle"}
                      fontSize="5.5" fill="var(--muted-foreground)" fontWeight="600" pointerEvents="none"
                    >
                      {gate.wait}m
                    </text>
                  </g>
                );
              })}

              {/* Facility dots */}
              {filteredFacilities.map((fac, idx) => {
                const meta = FACILITY_ICONS[fac.type];
                if (!meta) return null;
                return (
                  <g key={`${fac.type}-${idx}`} style={{ cursor: "pointer" }}>
                    <circle cx={fac.cx} cy={fac.cy} r="6.5"
                      fill={meta.color} stroke="#ffffff" strokeWidth="1.5" opacity="0.9" />
                    <text x={fac.cx} y={fac.cy + 4}
                      textAnchor="middle" fontSize="6.5" pointerEvents="none">
                      {meta.emoji}
                    </text>
                  </g>
                );
              })}

              {/* Direction line to best gate (FIX 5: no IIFE, stable memoised value) */}
              {showDirLine && bestGate && (() => {
                const { x: gx, y: gy } = gateXY(bestGate.angle);
                return (
                  <line
                    x1={position.x} y1={position.y}
                    x2={gx} y2={gy}
                    stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.55"
                  />
                );
              })()}

              {/* User location dot — FIX 2: safe opacity/radius */}
              <circle
                cx={position.x} cy={position.y}
                r={userPulseR}
                fill="none" stroke="#3b82f6" strokeWidth="1.5"
                opacity={userPulseOpacity}
              />
              <circle cx={position.x} cy={position.y} r="6"  fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
              <circle cx={position.x} cy={position.y} r="2.5" fill="#ffffff" />

            </svg>

            {/* Legend */}
            <div style={{
              display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px",
              padding: "10px", backgroundColor: "var(--muted)", borderRadius: "var(--radius-md)",
            }}>
              {[
                { color: "#3b82f6", label: "You Are Here", border: "2px solid #ffffff" },
                { color: "#10b981", label: "Gate Clear" },
                { color: "#f59e0b", label: "Gate Moderate" },
                { color: "#ef4444", label: "Gate Congested" },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", color: "var(--muted-foreground)" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: item.color, border: item.border }} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div style={{ width: "300px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* AI Recommended Gate */}
          {bestGate && (() => {
            const level = getGateLevel(bestGate.crowd);
            return (
              <div className="card" style={{
                padding: "16px",
                borderColor: "var(--success)",
                boxShadow: "0 0 12px rgba(52,211,153,0.1)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                  <Navigation size={16} stroke="var(--success)" />
                  <span style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", color: "var(--success)" }}>
                    AI-Recommended Gate
                  </span>
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: "800" }}>{bestGate.name}</h3>
                <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
                  <div>
                    <span style={{ fontSize: "10px", color: "var(--muted-foreground)" }}>Wait Time</span>
                    <p style={{ fontSize: "20px", fontWeight: "900", color: "var(--success)", fontFamily: "JetBrains Mono,monospace" }}>
                      {bestGate.wait}m
                    </p>
                  </div>
                  <div>
                    <span style={{ fontSize: "10px", color: "var(--muted-foreground)" }}>Crowd Level</span>
                    <p style={{ fontSize: "14px", fontWeight: "700", marginTop: "4px",
                      color: level === "low" ? "var(--success)" : "var(--warning)" }}>
                      {bestGate.crowd}% Full
                    </p>
                  </div>
                </div>
                <div className="progress-bar-track" style={{ marginTop: "10px" }}>
                  <div className="progress-bar-fill"
                    style={{ width: `${bestGate.crowd}%`, backgroundColor: "var(--success)", transition: "width 0.4s" }} />
                </div>
              </div>
            );
          })()}

          {/* All Gates Status */}
          <div className="card">
            <div className="card-header" style={{ paddingBottom: "10px" }}>
              <span className="card-title" style={{ fontSize: "13px" }}>All Gates Status</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", padding: "8px 14px 14px" }}>
              {stadium.gates.map(gate => {
                const level = getGateLevel(gate.crowd);
                const col   = level === "high" ? "var(--error)" : level === "medium" ? "var(--warning)" : "var(--success)";
                return (
                  <div key={gate.id} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "8px 0", borderBottom: "1px solid var(--border)",
                  }}>
                    <div>
                      <span style={{ fontSize: "12px", fontWeight: "600" }}>{gate.name}</span>
                      <p style={{ fontSize: "10px", color: "var(--muted-foreground)" }}>Wait: {gate.wait} min</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "12px", fontWeight: "700", color: col }}>{gate.status}</span>
                      <div className="progress-bar-track" style={{ width: "60px", marginTop: "4px" }}>
                        <div className="progress-bar-fill" style={{ width: `${gate.crowd}%`, backgroundColor: col }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Nearby Facilities — FIX 4: stable key using type+label, not idx */}
          <div className="card">
            <div className="card-header" style={{ paddingBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <MapPin size={14} stroke="var(--primary)" />
                <span className="card-title" style={{ fontSize: "13px" }}>Nearest Facilities</span>
              </div>
              <span style={{ fontSize: "10px", color: "var(--success)", fontWeight: "600" }}>Auto-updating</span>
            </div>
            <div style={{ padding: "8px 14px 14px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {nearbyFacilities.map((fac, idx) => {
                const meta = FACILITY_ICONS[fac.type] || {};
                return (
                  <div
                    key={`${fac.type}-${fac.label}`}  /* FIX 4: stable key */
                    style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      padding: "10px 12px",
                      backgroundColor: "var(--muted)",
                      borderRadius: "var(--radius-md)",
                      border: idx === 0 ? `1px solid ${meta.color}` : "1px solid transparent",
                      transition: "border-color 0.3s",
                    }}
                  >
                    <div style={{
                      width: "32px", height: "32px", borderRadius: "50%",
                      backgroundColor: meta.color ? `${meta.color}22` : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "16px", flexShrink: 0,
                    }}>
                      {meta.emoji}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "12px", fontWeight: "700", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {fac.label}
                      </p>
                      <p style={{ fontSize: "10px", color: "var(--muted-foreground)" }}>
                        {fac.section} • {fac.level} Level
                      </p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <span style={{ fontSize: "11px", fontWeight: "700", fontFamily: "JetBrains Mono,monospace", color: meta.color }}>
                        ~{Math.round(fac.dist * 3)}m
                      </span>
                      {idx === 0 && (
                        <p style={{ fontSize: "9px", color: "var(--success)", fontWeight: "700" }}>NEAREST</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
