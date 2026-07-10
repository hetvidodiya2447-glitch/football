import React from "react";
import { ShieldAlert, Users, Clock, AlertTriangle } from "lucide-react";
import IncidentCommand from "./IncidentCommand";
import OpsCharts from "./OpsCharts";

const STADIUM_LIVE_TELEMETRY = {
  metlife: { attendance: "78,410 / 82,500", gateTime: "18.5 mins", concessionState: "Medium Load" },
  sofi: { attendance: "64,280 / 70,240", gateTime: "14.2 mins", concessionState: "Light Load" },
  azteca: { attendance: "83,150 / 87,523", gateTime: "24.0 mins", concessionState: "High Load" }
};

export default function OpsPortal({ stadiumKey, darkMode }) {
  const telemetry = STADIUM_LIVE_TELEMETRY[stadiumKey] || STADIUM_LIVE_TELEMETRY.metlife;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", height: "100%" }}>
      {/* Telemetry Header KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card kpi-card">
          <span className="kpi-label">Active Attendance</span>
          <div className="kpi-value-container" style={{ marginTop: "4px" }}>
            <span className="kpi-value" style={{ fontSize: "20px" }}>{telemetry.attendance}</span>
            <span className="kpi-trend trend-up" style={{ fontSize: "10px" }}><Users size={10} /> Live</span>
          </div>
        </div>
        <div className="card kpi-card">
          <span className="kpi-label">Avg Gate Wait</span>
          <div className="kpi-value-container" style={{ marginTop: "4px" }}>
            <span className="kpi-value" style={{ fontSize: "20px" }}>{telemetry.gateTime}</span>
            <span className="kpi-trend trend-neutral" style={{ fontSize: "10px" }}><Clock size={10} /> Sensor Data</span>
          </div>
        </div>
        <div className="card kpi-card">
          <span className="kpi-label">Concessions Density</span>
          <div className="kpi-value-container" style={{ marginTop: "4px" }}>
            <span className="kpi-value" style={{ fontSize: "20px" }}>{telemetry.concessionState}</span>
            <span className={`kpi-trend ${telemetry.concessionState.includes("High") ? "trend-down" : "trend-up"}`} style={{ fontSize: "10px" }}>
              Queue Sensor
            </span>
          </div>
        </div>
        <div className="card kpi-card" style={{ borderLeft: "3px solid var(--error)" }}>
          <span className="kpi-label">Active Operations Mode</span>
          <div className="kpi-value-container" style={{ marginTop: "4px" }}>
            <span className="kpi-value" style={{ fontSize: "18px", color: "var(--error)" }}>Command Mode</span>
            <span className="kpi-trend trend-down" style={{ fontSize: "10px" }}><ShieldAlert size={10} /> Active</span>
          </div>
        </div>
      </div>

      {/* Main Console Split */}
      <div className="view-split" style={{ flex: 1, minHeight: 0 }}>
        {/* Left Side: Incident Command System */}
        <div style={{ flex: 2.2, overflow: "hidden" }}>
          <IncidentCommand />
        </div>

        {/* Right Side: Charts Telemetry Gallery */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "24px", overflowY: "auto", paddingRight: "4px" }}>
          <OpsCharts stadiumKey={stadiumKey} darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
}
