import React from "react";
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { 
  AlertTriangle, 
  Circle, 
  RefreshCw, 
  CheckCircle,
  Clock,
  CloudLightning,
  Sparkles
} from 'lucide-react';

export default function StaffAlerts(props) {
  const {
    alerts,
    onResolveAlert,
    onDispatchAlert,
    selectedStadium
  } = props || {};
  
  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-gutter mt-8 space-y-12 pb-24 text-on-surface">
      <div className="scanlines"></div>

      {/* Top Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-primary-fixed text-black px-3 py-0.5 rounded-sm">
            <span className="font-bold text-[10px] tracking-widest font-label-caps">LIVE FEED</span>
          </div>
          <span className="text-white/40 font-mono text-[10px] font-label-caps">SESSION: ACTIVE_04</span>
        </div>
        <h2 className="text-display-sm md:text-headline-lg font-display-sm italic uppercase tracking-tighter text-white">VOLUNTEER ALERTS</h2>
      </header>

      {/* Quick Stats Segment Bar */}
      <div className="glass-panel p-4 rounded-xl border-white/5 space-y-4 max-w-4xl mx-auto">
        <div>
          <div className="flex justify-between items-center mb-1 text-[10px] font-label-caps font-bold">
            <span className="text-white/60">SYSTEM_HEALTH</span>
            <span className="text-primary-fixed volt-text-glow font-mono">98.4%</span>
          </div>
          <div className="flex gap-[3px] h-2">
            <div className="h-full flex-1 bg-primary-fixed volt-glow rounded-sm"></div>
            <div className="h-full flex-1 bg-primary-fixed volt-glow rounded-sm"></div>
            <div className="h-full flex-1 bg-primary-fixed volt-glow rounded-sm"></div>
            <div className="h-full flex-1 bg-primary-fixed volt-glow rounded-sm"></div>
            <div className="h-full flex-1 bg-primary-fixed volt-glow rounded-sm"></div>
            <div className="h-full flex-1 bg-primary-fixed volt-glow rounded-sm"></div>
            <div className="h-full flex-1 bg-primary-fixed volt-glow rounded-sm"></div>
            <div className="h-full flex-1 bg-primary-fixed volt-glow rounded-sm"></div>
            <div className="h-full flex-1 bg-primary-fixed volt-glow rounded-sm"></div>
            <div className="h-full flex-1 bg-primary-fixed volt-glow rounded-sm"></div>
            <div className="h-full flex-1 bg-primary-fixed volt-glow rounded-sm"></div>
            <div className="h-full flex-1 bg-white/10 rounded-sm"></div>
          </div>
        </div>
      </div>

      {/* Main Alert List */}
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <span className="w-2 h-2 bg-primary-fixed rounded-full animate-pulse volt-glow"></span>
          <h3 className="font-bold text-lg uppercase tracking-tight font-label-caps text-white">Active Alerts ({alerts.length})</h3>
        </div>

        {alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.map((alert) => {
              const isCritical = alert.severity === "CRITICAL";
              return (
                <article 
                  key={alert.id}
                  className={`glass-panel p-6 rounded-lg relative overflow-hidden border-l-4 ${
                    isCritical 
                      ? "border-l-error border-outline-variant/30 shadow-[0_0_15px_rgba(255,180,171,0.05)]" 
                      : "border-l-primary-fixed/60 border-outline-variant/30"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 font-label-caps text-[9px]">
                        <span className={`px-2 py-0.5 rounded-sm font-bold border ${
                          isCritical 
                            ? "text-error border-error/30 bg-error/10" 
                            : "text-primary-fixed border-primary-fixed/30 bg-primary-fixed/10"
                        }`}>
                          {alert.severity}
                        </span>
                        <span className="text-white/40 font-mono">ZONE ID: {alert.zoneId.toUpperCase()}</span>
                      </div>
                      <h4 className="text-xl font-bold text-white leading-tight mb-2 uppercase italic tracking-tight font-headline-sm">
                        {alert.title}
                      </h4>
                      <p className="text-xs text-on-surface-variant font-body-md leading-relaxed">
                        {alert.description}
                      </p>
                    </div>

                    {alert.status === "dispatched" && (
                      <Badge variant="info">
                        <RefreshCw className="h-3 w-3 mr-2 animate-spin text-primary-fixed" />
                        DISPATCHED
                      </Badge>
                    )}
                  </div>

                  {/* AI strategy recommendation block */}
                  {alert.instruction && (
                    <div className="mt-4 p-4 bg-primary-fixed/5 border border-primary-fixed/20 rounded-lg flex items-start gap-3">
                      <Sparkles className="h-4 w-4 text-primary-fixed flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[9px] font-bold text-primary-fixed font-label-caps block mb-0.5">AI_STRATEGY_REC</span>
                        <p className="text-xs text-primary-fixed font-medium italic font-body-md leading-normal">
                          {alert.instruction}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 justify-end mt-6">
                    {alert.status === "active" && (
                      <Button
                        onClick={() => onDispatchAlert(alert.id)}
                        variant="primary"
                        size="sm"
                      >
                        DISPATCH TEAM
                      </Button>
                    )}
                    <Button
                      onClick={() => onResolveAlert(alert.id)}
                      variant="outline"
                      size="sm"
                    >
                      MARK RESOLVED
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 text-center max-w-lg mx-auto flex flex-col items-center justify-center rounded-xl bg-surface-container-low/70 border-dashed border-outline-variant/30">
            <CheckCircle className="text-primary-fixed volt-text-glow h-12 w-12 mb-4 animate-pulse" />
            <h3 className="text-headline-sm font-bold uppercase italic mb-2 text-white font-headline-sm">NO ACTIVE INCIDENTS</h3>
            <p className="text-xs text-on-surface-variant/80 font-body-md">
              All volunteer feeds are clear. General Operations are running smoothly.
            </p>
          </Card>
        )}
      </div>

      {/* Bento Notifications & Weather info */}
      <div className="max-w-4xl mx-auto grid grid-cols-2 gap-4 font-label-caps text-xs">
        <div className="glass-panel p-4 rounded-xl border-white/5 flex flex-col justify-between min-h-[90px]">
          <Clock className="h-4 w-4 text-white/40 mb-2" />
          <div>
            <h5 className="font-bold text-white mb-0.5 uppercase">SHIFT ROTATION</h5>
            <p className="text-[10px] text-white/40 font-mono">12 MIN REMAINING</p>
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl border-white/5 flex flex-col justify-between min-h-[90px]">
          <CloudLightning className="h-4 w-4 text-white/40 mb-2" />
          <div>
            <h5 className="font-bold text-white mb-0.5 uppercase">WEATHER STATUS</h5>
            <p className="text-[10px] text-white/40 font-mono">CLEAR OVERHEAD</p>
          </div>
        </div>
      </div>
    </div>
  );
}
