import React from "react";
import ReactECharts from "echarts-for-react";

export default function OpsCharts({ stadiumKey, darkMode }) {
  // Theme styling based on dark mode status
  const textColor = darkMode ? "#fafafa" : "#09090b";
  const axisColor = darkMode ? "#1e1e24" : "#e4e4e7";
  const labelColor = darkMode ? "#a1a1aa" : "#71717a";

  const getGateData = () => {
    switch (stadiumKey) {
      case "sofi":
        return [
          { name: "Gate 1", value: 120 },
          { name: "Gate 5 (Busy)", value: 410 },
          { name: "Gate 8", value: 180 },
          { name: "Gate 11", value: 90 }
        ];
      case "azteca":
        return [
          { name: "Acceso A", value: 240 },
          { name: "Acceso B (Busy)", value: 520 },
          { name: "Acceso C", value: 190 },
          { name: "Acceso D", value: 110 }
        ];
      case "metlife":
      default:
        return [
          { name: "MetLife Gate", value: 150 },
          { name: "Verizon (Busy)", value: 390 },
          { name: "Pepsi Gate", value: 80 },
          { name: "HCLTech Gate", value: 210 }
        ];
    }
  };

  const gateData = getGateData();

  // 1. Gate Throughput Options
  const gateThroughputOption = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      backgroundColor: darkMode ? "#0c0c0f" : "#ffffff",
      borderColor: axisColor,
      borderWidth: 1,
      textStyle: { color: textColor }
    },
    grid: {
      left: "4%",
      right: "4%",
      bottom: "6%",
      top: "15%",
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: gateData.map(item => item.name),
      axisLine: { lineStyle: { color: axisColor } },
      axisLabel: { color: labelColor, fontFamily: "DM Sans" }
    },
    yAxis: {
      type: "value",
      name: "Fans / Minute",
      nameTextStyle: { color: labelColor, fontFamily: "DM Sans" },
      axisLine: { lineStyle: { color: axisColor } },
      splitLine: { lineStyle: { color: axisColor } },
      axisLabel: { color: labelColor, fontFamily: "DM Sans" }
    },
    series: [
      {
        data: gateData.map(item => {
          // Highlight heavy congestion gate in rose/red color
          if (item.value > 300) {
            return {
              value: item.value,
              itemStyle: { color: "#ef4444", borderRadius: [4, 4, 0, 0] }
            };
          }
          return {
            value: item.value,
            itemStyle: { color: "#3b82f6", borderRadius: [4, 4, 0, 0] }
          };
        }),
        type: "bar",
        barWidth: "40%"
      }
    ]
  };

  // 2. Crowd Departure Timeline Predictions Options
  const crowdDepartureOption = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      backgroundColor: darkMode ? "#0c0c0f" : "#ffffff",
      borderColor: axisColor,
      borderWidth: 1,
      textStyle: { color: textColor }
    },
    legend: {
      data: ["Stadium Occupancy %", "Transit Demand Index"],
      textStyle: { color: textColor, fontFamily: "DM Sans" },
      top: "0%"
    },
    grid: {
      left: "4%",
      right: "4%",
      bottom: "6%",
      top: "15%",
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: ["T-10m", "T-0m", "T+10m", "T+20m", "T+30m", "T+40m", "T+50m", "T+60m"],
      axisLine: { lineStyle: { color: axisColor } },
      axisLabel: { color: labelColor, fontFamily: "DM Sans" }
    },
    yAxis: {
      type: "value",
      max: 100,
      axisLine: { lineStyle: { color: axisColor } },
      splitLine: { lineStyle: { color: axisColor } },
      axisLabel: { color: labelColor, fontFamily: "DM Sans" }
    },
    series: [
      {
        name: "Stadium Occupancy %",
        data: [100, 95, 80, 60, 42, 25, 10, 2],
        type: "line",
        smooth: true,
        lineStyle: { color: "#10b981", width: 3 },
        itemStyle: { color: "#10b981" }
      },
      {
        name: "Transit Demand Index",
        data: [15, 30, 75, 95, 85, 60, 30, 10],
        type: "line",
        smooth: true,
        lineStyle: { color: "#fbbf24", width: 3 },
        itemStyle: { color: "#fbbf24" }
      }
    ]
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* 1. Gate Throughput Chart */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Live Gate Flow Analytics</span>
          <span className="badge badge-rose" style={{ textTransform: "none", fontSize: "10px" }}>Real-time Feed</span>
        </div>
        <div className="card-body">
          <ReactECharts 
            option={gateThroughputOption} 
            style={{ height: "300px" }}
            opts={{ renderer: "svg" }}
          />
        </div>
      </div>

      {/* 2. Predictive Occupancy & Transit Demand */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Predictive Crowd Departure Timeline</span>
          <span className="badge badge-emerald" style={{ textTransform: "none", fontSize: "10px" }}>AI Forecast</span>
        </div>
        <div className="card-body">
          <ReactECharts 
            option={crowdDepartureOption} 
            style={{ height: "300px" }}
            opts={{ renderer: "svg" }}
          />
        </div>
      </div>
    </div>
  );
}
