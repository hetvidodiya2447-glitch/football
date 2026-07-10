import React, { useState } from "react";
import { Leaf, CheckCircle, Clock, Users, Trophy } from "lucide-react";
import StadiumSearch from "./StadiumSearch.jsx";
import StadiumDetail from "./StadiumDetail.jsx";

const ECO_ACTIONS = [
  { id: "transit", label: "🚌 Rode Public Transit", pts: 50, description: "Bus, metro, or shuttle to the stadium" },
  { id: "refill", label: "💧 Refilled Water Bottle", pts: 20, description: "Used a stadium water kiosk" },
  { id: "recycle", label: "♻️ Sorted Waste", pts: 20, description: "Used the correct recycling/compost bin" },
  { id: "bike", label: "🚲 Cycled to Stadium", pts: 60, description: "Arrived by bicycle" },
  { id: "carpooled", label: "🚗 Car-Pooled (3+ people)", pts: 30, description: "Shared a ride with others" },
  { id: "vegmeal", label: "🥗 Chose Plant-Based Meal", pts: 25, description: "Opted for vegan/vegetarian food" },
];

const BADGES = [
  { id: "first_step", label: "First Step 🌱", threshold: 50, desc: "Logged your first eco action", icon: "🌱" },
  { id: "transit_hero", label: "Transit Hero 🚌", threshold: 100, desc: "Rode public transit", icon: "🚌" },
  { id: "hydration_pro", label: "Hydration Pro 💧", threshold: 150, desc: "Refilled water 3+ times", icon: "💧" },
  { id: "zero_waste", label: "Zero Waste ♻️", threshold: 200, desc: "Total eco points reached 200", icon: "♻️" },
  { id: "eco_warrior", label: "Eco Warrior ⚡", threshold: 300, desc: "Total eco points reached 300", icon: "⚡" },
  { id: "green_champion", label: "Green Champion 🏆", threshold: 400, desc: "Maximum green level achieved!", icon: "🏆" },
];

export default function FanPortal({ language }) {
  // Navigation state: null = search, string = stadium ID
  const [selectedStadiumId, setSelectedStadiumId] = useState(null);

  // Sustainability tracker state (persisted across navigation)
  const [totalPoints, setTotalPoints] = useState(50);
  const [loggedActions, setLoggedActions] = useState({ transit: true });
  const [toast, setToast] = useState("");

  const unlockedBadges = BADGES.filter(b => totalPoints >= b.threshold);

  const logAction = (action) => {
    if (loggedActions[action.id]) return; // already logged
    setLoggedActions(prev => ({ ...prev, [action.id]: true }));
    setTotalPoints(prev => {
      const next = prev + action.pts;
      const newBadge = BADGES.find(b => prev < b.threshold && next >= b.threshold);
      if (newBadge) {
        showToast(`🏆 Badge Unlocked: ${newBadge.label}!`);
      } else {
        showToast(`✅ +${action.pts} pts — ${action.label}`);
      }
      return next;
    });
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  // Next badge to unlock
  const nextBadge = BADGES.find(b => totalPoints < b.threshold);
  const progressToNext = nextBadge ? Math.round((totalPoints / nextBadge.threshold) * 100) : 100;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: "fixed", bottom: "28px", right: "28px",
          backgroundColor: "var(--foreground)", color: "var(--background)",
          padding: "14px 22px", borderRadius: "var(--radius-md)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)", zIndex: 9999,
          fontWeight: "600", fontSize: "13px",
          display: "flex", alignItems: "center", gap: "10px",
          animation: "slideUp 0.3s ease"
        }}>
          <CheckCircle size={16} stroke="var(--success)" />
          {toast}
        </div>
      )}

      {/* ── Main view: Search or Detail ── */}
      <div>
        {selectedStadiumId ? (
          <StadiumDetail
            stadiumId={selectedStadiumId}
            onBack={() => setSelectedStadiumId(null)}
            language={language}
          />
        ) : (
          <StadiumSearch onSelectStadium={setSelectedStadiumId} />
        )}
      </div>

      {/* ── Sustainability Tracker (always visible at bottom) ── */}
      <div className="card" style={{ border: "1px solid rgba(16,185,129,0.25)", boxShadow: "0 0 20px rgba(16,185,129,0.07)" }}>
        <div className="card-header" style={{ background: "linear-gradient(90deg,rgba(16,185,129,0.12),transparent)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ padding: "8px", backgroundColor: "var(--success-bg)", borderRadius: "50%" }}>
              <Leaf size={18} stroke="var(--success)" />
            </div>
            <div>
              <span className="card-title">Green Goals — Personal Sustainability Tracker</span>
              <p style={{ fontSize: "11px", color: "var(--muted-foreground)", marginTop: "2px" }}>
                Log eco-friendly actions to earn points, unlock badges & win exclusive FIFA 2026 merchandise
              </p>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "28px", fontWeight: "900", color: "var(--success)", fontFamily: "JetBrains Mono,monospace" }}>{totalPoints}</span>
            <p style={{ fontSize: "10px", color: "var(--muted-foreground)", fontWeight: "600" }}>ECO POINTS</p>
          </div>
        </div>

        <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Progress to next badge */}
          {nextBadge && (
            <div style={{ padding: "14px", backgroundColor: "var(--muted)", borderRadius: "var(--radius-md)", display: "flex", gap: "16px", alignItems: "center" }}>
              <span style={{ fontSize: "28px" }}>{nextBadge.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "700" }}>Next: {nextBadge.label}</span>
                  <span style={{ fontSize: "12px", color: "var(--muted-foreground)", fontFamily: "JetBrains Mono,monospace" }}>
                    {totalPoints} / {nextBadge.threshold} pts
                  </span>
                </div>
                <div className="progress-bar-track" style={{ height: "8px" }}>
                  <div className="progress-bar-fill" style={{ width: `${progressToNext}%`, backgroundColor: "var(--success)", transition: "width 0.6s ease" }} />
                </div>
                <p style={{ fontSize: "10px", color: "var(--muted-foreground)", marginTop: "4px" }}>{nextBadge.desc}</p>
              </div>
            </div>
          )}

          {/* Action Log Buttons */}
          <div>
            <p style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", color: "var(--muted-foreground)", marginBottom: "10px" }}>Log Today's Actions</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "10px" }}>
              {ECO_ACTIONS.map(action => {
                const done = !!loggedActions[action.id];
                return (
                  <button
                    key={action.id}
                    onClick={() => logAction(action)}
                    disabled={done}
                    style={{
                      padding: "12px 16px",
                      border: done ? "1px solid var(--success)" : "1px solid var(--border)",
                      backgroundColor: done ? "var(--success-bg)" : "var(--muted)",
                      borderRadius: "var(--radius-md)",
                      cursor: done ? "default" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      textAlign: "left",
                      transition: "all 0.2s",
                      opacity: done ? 0.8 : 1,
                    }}
                    onMouseEnter={e => { if (!done) e.currentTarget.style.borderColor = "var(--success)"; }}
                    onMouseLeave={e => { if (!done) e.currentTarget.style.borderColor = "var(--border)"; }}
                  >
                    <span style={{ fontSize: "20px", flexShrink: 0 }}>{done ? "✅" : action.label.split(" ")[0]}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "13px", fontWeight: "700", color: done ? "var(--success)" : "var(--foreground)" }}>
                        {action.label.substring(action.label.indexOf(" ") + 1)}
                      </p>
                      <p style={{ fontSize: "10px", color: "var(--muted-foreground)", marginTop: "2px" }}>{action.description}</p>
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: "800", color: done ? "var(--success)" : "var(--muted-foreground)", fontFamily: "JetBrains Mono,monospace", flexShrink: 0 }}>
                      +{action.pts}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Badges Display */}
          <div>
            <p style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", color: "var(--muted-foreground)", marginBottom: "10px" }}>
              Your Badges ({unlockedBadges.length}/{BADGES.length})
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {BADGES.map(badge => {
                const unlocked = totalPoints >= badge.threshold;
                return (
                  <div
                    key={badge.id}
                    title={badge.desc}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "var(--radius-md)",
                      border: unlocked ? "1px solid var(--success)" : "1px solid var(--border)",
                      backgroundColor: unlocked ? "var(--success-bg)" : "var(--muted)",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      opacity: unlocked ? 1 : 0.45,
                      transition: "all 0.3s",
                      cursor: "default",
                    }}
                  >
                    <span style={{ fontSize: "18px" }}>{badge.icon}</span>
                    <div>
                      <p style={{ fontSize: "12px", fontWeight: "700", color: unlocked ? "var(--success)" : "var(--muted-foreground)" }}>{badge.label}</p>
                      <p style={{ fontSize: "9px", color: "var(--muted-foreground)" }}>{badge.threshold} pts</p>
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
