import React, { useState, useEffect } from "react";
import { queryCopilot, OPERATIONAL_KNOWLEDGE } from "../services/copilotEngine";
import { getAdvisories } from "../services/crowdEngine";
import Map from "../components/ui/Map";
import WeatherWidget from "../components/ui/WeatherWidget";

import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Utensils, 
  Shield, 
  Wifi, 
  Bot, 
  Send, 
  AlertCircle,
  FileSpreadsheet,
  Activity
} from 'lucide-react';

export default function OrganizerDashboard(props) {
  const {
    zones,
    onExecuteAdvisoryAction,
    onSimulateSpill,
    selectedStadium
  } = props || {};

  const [copilotInput, setCopilotInput] = useState("");
  const [copilotMessages, setCopilotMessages] = useState([
    {
      sender: "user",
      text: "How many staff are near North Gate?"
    },
    {
      sender: "ai",
      text: "There are currently **42** active personnel within 100m of the North Gate. This includes 28 Security, 8 Medics, and 6 Crowd Control Officers.",
      citations: ["Record #123", "Log #A-42"]
    }
  ]);
  
  const baseCapacity = selectedStadium ? selectedStadium.capacity : 80000;
  const [liveUsers, setLiveUsers] = useState(new Map());
  const [totalAttendees, setTotalAttendees] = useState(0);
  const [showRagInfo, setShowRagInfo] = useState(false);

  // Subscribe to real-time live GPS users
  useEffect(() => {
    let unsubscribe = null;
    import("../services/locationBroadcast").then(module => {
      unsubscribe = module.subscribeToUsers((usersMap) => {
        setLiveUsers(usersMap);
        setTotalAttendees(usersMap.size);
      });
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Compute "True Data" for zones based on live users.
  const liveZoneNorth = Math.floor(totalAttendees * 0.4);
  const liveZoneEast = totalAttendees - liveZoneNorth;

  const activeAdvisories = getAdvisories(zones);

  const handleSendCopilotMessage = () => {
    if (!copilotInput.trim()) return;

    const query = copilotInput;
    const newMessages = [...copilotMessages, { sender: "user", text: query }];
    setCopilotInput("");

    // Process using simulated RAG Engine
    const result = queryCopilot(query);
    
    newMessages.push({
      sender: "ai",
      text: result.answer,
      citations: result.citations
    });

    setCopilotMessages(newMessages);
  };

  const handleGenerateReport = () => {
    alert(`Post-Event Shift Handover Summary for ${selectedStadium ? selectedStadium.stadium : "Stadium Buddy Arena"} exported! (Generated via Stadium Buddy AI Reporter). Check download folder.`);
  };

  const capacityPct = ((totalAttendees / baseCapacity) * 100).toFixed(0);

  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 md:px-gutter mt-8 space-y-8 pb-24 min-h-screen text-on-surface">
      <div className="scanlines"></div>

      {/* Operations Dashboard Overview Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-outline-variant/20 pb-6 mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary-fixed text-black px-3 py-0.5 font-label-caps text-[10px] flex items-center gap-1.5 volt-glow uppercase font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-black status-dot"></span>
              LIVE_OPS_OVERVIEW
            </div>
            <span className="text-on-surface-variant/60 text-[9px] font-label-caps uppercase tracking-wider">
              {selectedStadium ? selectedStadium.stadium : "STADIUM HUB"}
            </span>
          </div>
          <h2 className="text-display-sm md:text-headline-lg font-display-sm italic uppercase tracking-tighter text-white">
            COMMAND CENTER
          </h2>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <WeatherWidget city={selectedStadium ? selectedStadium.city : 'London'} />
          <Button 
            onClick={handleGenerateReport}
            variant="secondary"
            size="sm"
            className="flex items-center gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            GENERATE REPORT
          </Button>
          <Button 
            onClick={onSimulateSpill}
            variant="danger"
            size="sm"
            className="flex items-center gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            SIMULATE EMERGENCY
          </Button>
        </div>
      </div>

      {/* Bento Grid: Stadium Zones */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Zone A: Major Congestion Container */}
        <Card className="md:col-span-8 p-6 flex flex-col justify-between relative overflow-hidden group rounded-xl bg-surface-container-low/70 border-outline-variant/30">
          <div className="absolute inset-0 bg-gradient-to-br from-error/5 to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div className="tech-id font-mono">ZONE_NORTH_GATE_TELEMETRY</div>
              <AlertTriangle className="text-error animate-pulse h-6 w-6" />
            </div>
            <h3 className="text-headline-md font-headline-md italic uppercase text-white tracking-tight mt-2">HIGH CONGESTION WARNING</h3>
            
            <div className="mt-6 flex flex-col md:flex-row gap-8 items-end justify-between">
              <div>
                <p className="text-[10px] font-label-caps text-on-surface-variant/80 uppercase">CURRENT OCCUPANCY</p>
                <p className="text-display-lg font-bold text-primary-fixed volt-text-glow leading-none mt-1">
                  {((liveZoneNorth / zones.north_gate.capacity) * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-on-surface-variant mt-2 font-mono uppercase tracking-wider font-label-caps">
                  ({liveZoneNorth.toLocaleString()} / {zones.north_gate.capacity.toLocaleString()} SEATS)
                </p>
              </div>
              
              <div className="flex-grow max-w-sm h-24 w-full border-b border-outline-variant/30 border-l pl-2 pb-2">
                {/* Sparkline chart */}
                <div className="flex items-end justify-between h-full w-full gap-1.5">
                  <div className="bg-primary-fixed/40 rounded-t-sm w-full h-[30%]"></div>
                  <div className="bg-primary-fixed/40 rounded-t-sm w-full h-[40%]"></div>
                  <div className="bg-primary-fixed/60 rounded-t-sm w-full h-[55%]"></div>
                  <div className="bg-primary-fixed/60 rounded-t-sm w-full h-[50%]"></div>
                  <div className="bg-error/60 rounded-t-sm w-full h-[70%] volt-glow"></div>
                  <div className="bg-error rounded-t-sm w-full h-[85%] status-dot volt-glow"></div>
                  <div className="bg-error/80 rounded-t-sm w-full h-[98%] volt-glow"></div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Zone B: Secondary status card */}
        <Card className="md:col-span-4 p-6 flex flex-col justify-between rounded-xl bg-surface-container-low/70 border-outline-variant/30">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="tech-id font-mono">SECTOR_EAST_STAND</div>
              <Badge variant="neutral" className="px-2 py-0.5">
                {zones.east_stand.name.toUpperCase()}
              </Badge>
            </div>
            
            <div className="space-y-3 font-label-caps text-xs">
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
                <span className="text-on-surface-variant/80">CAPACITY</span>
                <span className="font-bold text-white font-mono">{zones.east_stand.capacity.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
                <span className="text-on-surface-variant/80">CURRENT</span>
                <span className="font-bold text-white font-mono">{liveZoneEast.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pb-1">
                <span className="text-on-surface-variant/80">TREND</span>
                <span className={`font-bold flex items-center gap-1 ${zones.east_stand.trend > 0 ? 'text-primary-fixed volt-text-glow' : 'text-secondary'}`}>
                  {zones.east_stand.trend > 0 ? <TrendingUp className="h-4 w-4 text-primary-fixed" /> : <TrendingDown className="h-4 w-4 text-secondary" />}
                  {zones.east_stand.trend > 0 ? `+${zones.east_stand.trend.toFixed(0)}% (5M)` : `${zones.east_stand.trend.toFixed(0)}% (5M)`}
                </span>
              </div>
            </div>
          </div>

          <Button 
            onClick={() => onExecuteAdvisoryAction("adv-2")}
            variant="outline"
            className="w-full mt-6"
          >
            MANAGE TURNSTILES
          </Button>
        </Card>
      </div>

      {/* Small metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Metric 1 */}
        <div className="glass-panel p-5 flex items-center gap-6 rounded-xl">
          <div className="w-12 h-12 bg-primary-fixed/10 border border-primary-fixed/20 rounded flex items-center justify-center text-primary-fixed volt-glow">
            <Utensils className="h-6 w-6 text-primary-fixed" />
          </div>
          <div>
            <p className="text-[9px] font-label-caps text-on-surface-variant/60 mb-1">CONCESSIONS STATUS</p>
            <p className="text-sm font-bold uppercase text-primary-fixed volt-text-glow font-label-caps">OPTIMAL (3m Avg)</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel p-5 flex items-center gap-6 rounded-xl border-secondary/20">
          <div className="w-12 h-12 bg-secondary/10 border border-secondary/20 rounded flex items-center justify-center text-secondary">
            <Shield className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <p className="text-[9px] font-label-caps text-on-surface-variant/60 mb-1">STAFF ON DUTY</p>
            <p className="text-sm font-bold uppercase text-secondary font-label-caps">1,420 ACTIVE</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel p-5 flex items-center gap-6 rounded-xl">
          <div className="w-12 h-12 bg-white/5 border border-white/10 rounded flex items-center justify-center text-white">
            <Wifi className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-[9px] font-label-caps text-on-surface-variant/60 mb-1">WIFI MESH INTEGRITY</p>
            <p className="text-sm font-bold uppercase text-white font-label-caps">99.8% ONLINE</p>
          </div>
        </div>

      </div>

      {/* Copilot and Insights Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Decision Support Copilot Chat */}
        <Card className="lg:col-span-8 p-6 flex flex-col h-[70vh] min-h-[400px] lg:h-[550px] relative overflow-hidden rounded-xl bg-surface-container-low/70 border-outline-variant/30">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Bot className="h-24 w-24 text-primary-fixed" />
          </div>
          <div className="flex justify-between items-center mb-4 relative z-10 border-b border-outline-variant/20 pb-3">
            <div className="flex items-center gap-2">
              <Badge variant="info" className="px-2 py-0.5">
                <Bot className="h-3.5 w-3.5 mr-1" />
                COPILOT OS
              </Badge>
            </div>
            
            <Button 
              onClick={() => setShowRagInfo(!showRagInfo)}
              variant="outline"
              size="sm"
            >
              {showRagInfo ? "HIDE CORPUS" : "VIEW RAG CORPUS"}
            </Button>
          </div>

          {/* RAG corpus inspect box */}
          {showRagInfo && (
            <div className="mb-4 p-4 bg-black/40 rounded-lg border border-outline-variant/20 max-h-32 overflow-y-auto text-xs font-mono space-y-2">
              <p className="text-primary-fixed volt-text-glow font-bold text-[9px] font-label-caps">CITED CORPUS DATA SOURCE:</p>
              {OPERATIONAL_KNOWLEDGE.map(k => (
                <div key={k.id} className="border-b border-outline-variant/10 pb-2 last:border-b-0">
                  <span className="text-primary-fixed font-bold">[{k.id}] {k.title}: </span>
                  <span className="text-on-surface-variant/80">{k.content}</span>
                </div>
              ))}
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-grow overflow-y-auto space-y-4 pr-2 mb-4 z-10 text-xs">
            {copilotMessages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`px-4 py-3 max-w-[80%] rounded-lg ${
                  msg.sender === "user" 
                    ? "bg-primary-fixed text-black border border-black font-semibold" 
                    : "bg-surface-container-high text-white border border-outline-variant/20"
                }`}>
                  <p className="font-body-md text-sm">{msg.text}</p>
                  
                  {/* Citations List */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-2.5 flex gap-2 flex-wrap">
                      {msg.citations.map((cite) => (
                         <span 
                         key={cite} 
                         className="font-mono text-[9px] bg-black text-primary-fixed px-2 py-0.5 rounded border border-primary-fixed/20 font-bold"
                         title={OPERATIONAL_KNOWLEDGE.find(k => k.id === cite)?.content || ""}
                       >
                         [{cite}]
                       </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Message Input bar */}
          <div className="flex gap-4 relative z-10 mt-auto">
            <Input 
              type="text" 
              value={copilotInput}
              onChange={(e) => setCopilotInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendCopilotMessage()}
              placeholder="QUERY SYSTEM KNOWLEDGE..."
              className="text-xs font-label-caps uppercase"
            />
            <Button 
              onClick={() => handleSendCopilotMessage()}
              variant="primary"
              className="px-6 flex items-center justify-center py-2"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* AI Insights Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Active Advisories Box */}
          <Card className="p-6 relative overflow-hidden rounded-xl bg-surface-container-low/70 border-outline-variant/30">
            <div className="flex justify-between items-center mb-4 border-b border-outline-variant/20 pb-3">
              <div className="tech-id font-mono">DECISION_LOG</div>
              <Badge variant="info" className="px-2 py-0.5">
                 <AlertCircle className="h-3.5 w-3.5 mr-1" />
                 ADVISORIES
              </Badge>
            </div>
            
            {activeAdvisories.length > 0 ? (
              <div className="space-y-6">
                {activeAdvisories.map((adv) => (
                  <div key={adv.id} className="border-b border-outline-variant/20 pb-4 last:border-b-0 last:pb-0">
                    <Badge variant={adv.severity === "CRITICAL" ? "error" : "warning"} className="mb-2">
                      {adv.severity} ALERT
                    </Badge>
                    <p className="text-xs text-on-surface-variant font-body-md mb-4">{adv.text}</p>
                    <Button 
                      onClick={() => onExecuteAdvisoryAction(adv.id)}
                      variant="primary"
                      className="w-full py-2"
                    >
                      <span className="block">{adv.actionLabel.toUpperCase()}</span>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-body-md text-on-surface-variant/80 italic">All stadium operations running optimal. No alerts active.</p>
            )}
          </Card>

          {/* Live Dispatch GPS Map */}
          <Card className="p-1 flex flex-col h-auto min-h-[280px] overflow-hidden rounded-xl bg-surface-container-low/70 border-outline-variant/30">
            <div className="bg-black/40 px-4 py-2 border-b border-outline-variant/20 flex items-center gap-2">
               <span className="w-1.5 h-1.5 bg-primary-fixed rounded-full animate-pulse volt-glow"></span>
               <span className="text-[10px] font-label-caps text-white font-bold tracking-wider font-label-caps">LIVE GPS MAP</span>
            </div>
            <div className="flex-grow overflow-hidden relative min-h-[220px]">
              <Map selectedStadium={selectedStadium} darkMode={true} />
            </div>
          </Card>

        </div>
      </section>
    </div>
  );
}
