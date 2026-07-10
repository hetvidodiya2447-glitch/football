import React, { useState } from "react";
import { ShieldAlert, AlertTriangle, UserCheck, CheckCircle2, ChevronRight, Sparkles, Send, Copy } from "lucide-react";
import { simulateIncidentAnalysis } from "../utils/aiSimulator";

const INITIAL_INCIDENTS = [
  {
    id: "INC-001",
    title: "Gate 2 Heavy Congestion",
    type: "Crowd Management",
    severity: "High",
    description: "Gate 2 (Verizon Gate) queue time has peaked at 35 minutes. Ticket scanning scanner unit C is malfunctioning.",
    timestamp: "14:15",
    assignedTo: "Volunteer Group Delta",
    status: "Active"
  },
  {
    id: "INC-002",
    title: "Water Spill near Section 112",
    type: "Logistics & Maintenance",
    severity: "Medium",
    description: "Large soda/water spill reported on concourse near Section 112 exit. Posing slip hazard.",
    timestamp: "14:22",
    assignedTo: "Unassigned",
    status: "Active"
  },
  {
    id: "INC-003",
    title: "Language Support Request at Section 204",
    type: "Fan Experience",
    severity: "Low",
    description: "Group of Japanese-speaking fans looking for accessible shuttle departure locations, unable to communicate with section staff.",
    timestamp: "14:25",
    assignedTo: "Unassigned",
    status: "Active"
  }
];

export default function IncidentCommand() {
  const [incidents, setIncidents] = useState(INITIAL_INCIDENTS);
  const [selectedId, setSelectedId] = useState("INC-001");
  const [aiReport, setAiReport] = useState(null);
  const [analyzingId, setAnalyzingId] = useState(null);
  const [dispatchCopyStatus, setDispatchCopyStatus] = useState(false);

  const selectedIncident = incidents.find(inc => inc.id === selectedId);

  const handleSelectIncident = (id) => {
    setSelectedId(id);
    setAiReport(null); // Clear previous report to force fresh AI click
    setDispatchCopyStatus(false);
  };

  const handleGenerateAI = async (id) => {
    setAnalyzingId(id);
    setAiReport(null);
    const report = await simulateIncidentAnalysis(id);
    setAiReport(report);
    setAnalyzingId(null);
  };

  const handleAssignCrew = (id, crew) => {
    setIncidents(prev => 
      prev.map(inc => inc.id === id ? { ...inc, assignedTo: crew } : inc)
    );
  };

  const handleResolve = (id) => {
    setIncidents(prev => 
      prev.map(inc => inc.id === id ? { ...inc, status: "Resolved" } : inc)
    );
    // Find next active incident if available
    const active = incidents.find(inc => inc.id !== id && inc.status === "Active");
    if (active) {
      setSelectedId(active.id);
      setAiReport(null);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setDispatchCopyStatus(true);
    setTimeout(() => setDispatchCopyStatus(false), 2000);
  };

  return (
    <div className="view-split" style={{ height: "100%" }}>
      {/* List Panel (2/3 width) */}
      <div className="view-split-main" style={{ flex: 1.2 }}>
        <div className="card" style={{ height: "100%" }}>
          <div className="card-header">
            <span className="card-title">Active Arena Incidents Queue</span>
            <div className="flex items-center gap-2">
              <span className="badge badge-rose">
                {incidents.filter(i => i.status === "Active" && i.severity === "High").length} Critical
              </span>
              <span className="badge badge-amber">
                {incidents.filter(i => i.status === "Active" && i.severity === "Medium").length} Warning
              </span>
            </div>
          </div>

          <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "12px", overflowY: "auto" }}>
            {incidents.filter(i => i.status === "Active").length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--muted-foreground)" }}>
                <CheckCircle2 size={48} stroke="var(--success)" style={{ marginBottom: "12px" }} />
                <h3>All Clear! No Active Incidents</h3>
                <p style={{ fontSize: "12px", marginTop: "4px" }}>Stadium operations are running smoothly.</p>
              </div>
            ) : (
              incidents.filter(i => i.status === "Active").map((inc) => (
                <div 
                  key={inc.id}
                  className={`incident-item ${selectedId === inc.id ? "selected" : ""}`}
                  onClick={() => handleSelectIncident(inc.id)}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                    <div style={{ marginTop: "3px" }}>
                      {inc.severity === "High" ? (
                        <div className="incident-pulse" style={{ backgroundColor: "var(--error)" }}></div>
                      ) : inc.severity === "Medium" ? (
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--warning)", display: "inline-block" }}></span>
                      ) : (
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--info)", display: "inline-block" }}></span>
                      )}
                    </div>
                    <div>
                      <h4 style={{ fontSize: "14px", fontWeight: "700" }}>{inc.title}</h4>
                      <p style={{ fontSize: "12px", color: "var(--muted-foreground)", marginTop: "2px" }}>
                        {inc.type} • Sect: {inc.id === "INC-001" ? "Gate G2" : inc.id === "INC-002" ? "112 Exit" : "204 Concourse"}
                      </p>
                      <span className="font-mono" style={{ fontSize: "10px", color: "var(--muted-foreground)" }}>
                        {inc.timestamp} • Assigned: {inc.assignedTo}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={16} stroke="var(--muted-foreground)" />
                </div>
              ))
            )}

            {/* Resolved Section Accordion */}
            {incidents.filter(i => i.status === "Resolved").length > 0 && (
              <div style={{ marginTop: "24px" }}>
                <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "var(--muted-foreground)", display: "block", marginBottom: "8px" }}>
                  Resolved Incidents ({incidents.filter(i => i.status === "Resolved").length})
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", opacity: 0.6 }}>
                  {incidents.filter(i => i.status === "Resolved").map(inc => (
                    <div 
                      key={inc.id} 
                      style={{ 
                        padding: "10px 16px", 
                        border: "1px solid var(--border)", 
                        borderRadius: "var(--radius-md)", 
                        backgroundColor: "var(--muted)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <span style={{ textDecoration: "line-through", fontWeight: "600", fontSize: "13px" }}>{inc.title}</span>
                      <span className="badge badge-zinc">Resolved</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Side Detail Panel (1/3 width) */}
      <div className="view-split-side" style={{ flex: 1, paddingLeft: 0, borderLeft: "none" }}>
        {selectedIncident && selectedIncident.status === "Active" ? (
          <div className="card" style={{ height: "100%" }}>
            <div className="card-header">
              <span className="card-title">Incident Details</span>
              <span className={`badge ${selectedIncident.severity === "High" ? "badge-rose" : selectedIncident.severity === "Medium" ? "badge-amber" : "badge-blue"}`}>
                {selectedIncident.severity}
              </span>
            </div>

            <div className="card-body" style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Description Block */}
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: "700" }}>{selectedIncident.title}</h3>
                <p style={{ fontSize: "13px", color: "var(--muted-foreground)", marginTop: "4px" }}>
                  {selectedIncident.description}
                </p>
                <div style={{ marginTop: "12px", padding: "10px", backgroundColor: "var(--muted)", borderRadius: "var(--radius-md)", fontSize: "12px", display: "flex", gap: "12px" }}>
                  <div>
                    <span style={{ color: "var(--muted-foreground)", display: "block" }}>Location</span>
                    <strong style={{ color: "var(--foreground)" }}>{selectedIncident.id === "INC-001" ? "Verizon Gate 2" : selectedIncident.id === "INC-002" ? "Concourse 112" : "Section 204"}</strong>
                  </div>
                  <div style={{ width: "1px", backgroundColor: "var(--border)" }}></div>
                  <div>
                    <span style={{ color: "var(--muted-foreground)", display: "block" }}>Timestamp</span>
                    <strong style={{ color: "var(--foreground)" }}>{selectedIncident.timestamp}</strong>
                  </div>
                </div>
              </div>

              {/* Coordinator Operations Controls */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "var(--muted-foreground)" }}>Assign Staff Group</span>
                <select 
                  className="input select-dropdown"
                  value={selectedIncident.assignedTo}
                  onChange={(e) => handleAssignCrew(selectedIncident.id, e.target.value)}
                >
                  <option value="Unassigned">⚠️ Select Crew...</option>
                  <option value="Volunteer Group Delta">Volunteer Group Delta</option>
                  <option value="Sanitation Crew Bravo">Sanitation Crew Bravo</option>
                  <option value="Multilingual Team (Japanese)">Multilingual Team (Japanese)</option>
                  <option value="Medical Team Charlie">Medical Team Charlie</option>
                </select>
              </div>

              {/* GenAI Resolver Trigger */}
              <div>
                {!aiReport && !analyzingId ? (
                  <button 
                    className="btn btn-primary" 
                    style={{ width: "100%", padding: "10px", gap: "8px" }}
                    onClick={() => handleGenerateAI(selectedIncident.id)}
                  >
                    <Sparkles size={16} />
                    Generate AI Action Plan
                  </button>
                ) : analyzingId === selectedIncident.id ? (
                  <div className="flex items-center justify-center gap-2" style={{ padding: "12px", border: "1px dashed var(--primary)", borderRadius: "var(--radius-md)", color: "var(--primary)" }}>
                    <div className="typing-dots" style={{ backgroundColor: "transparent", padding: 0 }}>
                      <div className="typing-dot" style={{ backgroundColor: "var(--primary)" }}></div>
                      <div className="typing-dot" style={{ backgroundColor: "var(--primary)" }}></div>
                      <div className="typing-dot" style={{ backgroundColor: "var(--primary)" }}></div>
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: "600" }}>Co-Pilot analyzing telemetry...</span>
                  </div>
                ) : null}

                {/* GenAI Report Output */}
                {aiReport && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "12px", animation: "fadeIn 0.3s ease" }}>
                    {/* 1. Mitigation Plan */}
                    <div style={{ padding: "14px", backgroundColor: "var(--success-bg)", borderRadius: "var(--radius-md)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                      <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "var(--success)", display: "flex", alignItems: "center", gap: "6px" }}>
                        <Sparkles size={12} /> Live Mitigation Protocol
                      </span>
                      <ul style={{ marginTop: "8px", paddingLeft: "16px", fontSize: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
                        {aiReport.mitigation.map((step, idx) => {
                          const boldRegex = /\*\*(.*?)\*\*/g;
                          const line = step.replace(boldRegex, "<strong>$1</strong>");
                          return <li key={idx} dangerouslySetInnerHTML={{ __html: line }} />;
                        })}
                      </ul>
                    </div>

                    {/* 2. Copy-paste dispatch text */}
                    <div style={{ padding: "14px", backgroundColor: "var(--muted)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "var(--muted-foreground)" }}>
                          Crew Radio Script
                        </span>
                        <button 
                          className="btn btn-ghost" 
                          style={{ padding: "4px 8px", fontSize: "11px", gap: "4px" }}
                          onClick={() => copyToClipboard(aiReport.dispatch)}
                        >
                          <Copy size={12} />
                          {dispatchCopyStatus ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <p className="font-mono" style={{ fontSize: "11px", lineHeight: "1.4", wordBreak: "break-all", whiteSpace: "pre-line", padding: "8px", backgroundColor: "var(--card)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
                        {aiReport.dispatch}
                      </p>
                    </div>

                    {/* 3. Translations */}
                    <div style={{ padding: "14px", backgroundColor: "var(--info-bg)", borderRadius: "var(--radius-md)", border: "1px solid rgba(59, 130, 246, 0.2)", fontSize: "12px" }}>
                      <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "var(--info)", display: "block", marginBottom: "6px" }}>
                        Multilingual Translation Scripts
                      </span>
                      {Object.keys(aiReport.translation).map((langKey) => (
                        <div key={langKey} style={{ marginTop: "6px" }}>
                          <span style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", color: "var(--muted-foreground)" }}>{langKey}:</span>
                          <p style={{ fontStyle: "italic", marginTop: "2px" }}>{aiReport.translation[langKey]}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div style={{ marginTop: "auto", borderTop: "1px solid var(--border)", paddingTop: "16px", display: "flex", gap: "8px" }}>
                <button 
                  className="btn btn-secondary" 
                  style={{ flex: 1 }}
                  onClick={() => setSelectedId(null)}
                >
                  Close
                </button>
                <button 
                  className="btn btn-destructive" 
                  style={{ flex: 2, gap: "6px" }}
                  onClick={() => handleResolve(selectedIncident.id)}
                  disabled={selectedIncident.assignedTo === "Unassigned"}
                  title={selectedIncident.assignedTo === "Unassigned" ? "Assign a staff crew first" : "Resolve Incident"}
                >
                  <CheckCircle2 size={16} />
                  Mark Resolved
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="card" style={{ height: "100%", justifyContent: "center", alignItems: "center", padding: "40px 20px", color: "var(--muted-foreground)", textAlign: "center" }}>
            <ShieldAlert size={48} stroke="var(--muted-foreground)" style={{ marginBottom: "12px" }} />
            <h3>No Incident Selected</h3>
            <p style={{ fontSize: "12px", marginTop: "4px" }}>Click on an active incident card in the queue to view details, assign crews, and execute AI dispatch assistance.</p>
          </div>
        )}
      </div>
    </div>
  );
}
