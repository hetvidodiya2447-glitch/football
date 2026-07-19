import React, { useState, useEffect } from "react";
import { findShortestPath, generateDirections, VENUE_NODES } from "../services/navigationEngine";
import { LANGUAGES, translate, getDir } from "../services/translationEngine";
import Map from "../components/ui/Map";
import LocationConsentModal from "../components/ui/LocationConsentModal";
import { hasLocationConsent } from "../services/locationBroadcast";
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { Compass, ArrowLeft, Navigation2, Building2, Map as MapIcon, Minimize2, Maximize2, Timer, AlertCircle } from 'lucide-react';

export default function Wayfinding(props) {
  const {
    currentUser,
    language,
    setLanguage,
    congestedZones = [],
    onSimulateCongestion,
    selectedStadium,
    onNavigateHome
  } = props || {};
  const dir = getDir(language);
  const [startNode, setStartNode] = useState("section_102");
  const [endNode, setEndNode] = useState("gate_4");
  const [mapMode, setMapMode] = useState("indoor"); // "indoor" or "outdoor"
  const [showConsent, setShowConsent] = useState(!hasLocationConsent());
  
  // Calculate current path
  const routingResult = React.useMemo(() => findShortestPath(startNode, endNode, congestedZones), [startNode, endNode, congestedZones]);
  const path = React.useMemo(() => routingResult ? routingResult.path : [], [routingResult]);
  const directions = React.useMemo(() => routingResult ? generateDirections(routingResult.path, congestedZones) : [], [routingResult, congestedZones]);

  return (
    <div dir={dir} className="w-full max-w-[1400px] mx-auto p-4 md:p-8 min-h-screen text-on-surface">
      <div className="scanlines"></div>

      {/* Top Header */}
      <header className="flex justify-between items-center pb-6 border-b border-outline-variant/20 mb-6">
        <div className="flex items-center gap-3">
          <Button onClick={onNavigateHome} variant="outline" size="sm" className="p-2" title="Back to Hub" aria-label="Back to Hub">
            <ArrowLeft className="h-5 w-5 text-on-surface" aria-hidden="true" />
          </Button>
          <div className="w-10 h-10 rounded border border-primary-fixed/30 bg-surface flex items-center justify-center volt-glow" role="img" aria-label="Compass icon">
            <Compass className="h-5 w-5 text-primary-fixed" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-display-sm md:text-headline-md font-bold italic tracking-widest text-primary-fixed volt-text-glow font-display-lg uppercase leading-none">STADIUM BUDDY</h1>
            <p className="text-[9px] text-on-surface-variant font-mono uppercase tracking-widest font-label-caps mt-0.5">
              {selectedStadium ? selectedStadium.stadium : "AI WAYFINDING"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-surface-container border border-outline-variant/30 text-white text-xs rounded px-2.5 py-1.5 focus:outline-none focus:border-primary-fixed font-label-caps uppercase"
            aria-label="Select Interface Language"
          >
            {Object.values(LANGUAGES).map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-surface">
                {lang.code.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Real-time Advisory Banner */}
      <Card className="relative mb-6 overflow-hidden p-3 rounded-xl border border-outline-variant/20 bg-surface-container-low/70">
        {routingResult?.isRerouted && (
          <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-transparent via-secondary/20 to-transparent animate-[pulse_3s_infinite]" />
        )}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${routingResult?.isRerouted ? 'bg-secondary animate-pulse volt-glow' : 'bg-primary-fixed volt-glow'}`} />
            <span className="text-xs font-label-caps uppercase tracking-wider text-white">
              {routingResult?.isRerouted 
                ? translate("Venue sector is congested, rerouting via concourse.", language)
                : translate("Route search active. Adjust destination to bypass obstacles.", language)}
            </span>
          </div>
        </div>
      </Card>

      {/* Indoor/Outdoor Mode Switcher — mobile only */}
      <div className="flex gap-1.5 bg-surface border border-outline-variant/30 p-1.5 rounded-lg mb-4 lg:hidden">
        <Button
          onClick={() => setMapMode("indoor")}
          variant={mapMode === "indoor" ? "primary" : "ghost"}
          size="sm"
          className="flex-1"
        >
          <Building2 className="h-3.5 w-3.5 mr-1" />
          INDOOR MAP
        </Button>
        <Button
          onClick={() => setMapMode("outdoor")}
          variant={mapMode === "outdoor" ? "secondary" : "ghost"}
          size="sm"
          className="flex-1"
        >
          <MapIcon className="h-3.5 w-3.5 mr-1" />
          OUTDOOR GPS
        </Button>
      </div>

      {/* Route selector (mobile) — above map, compact */}
      {mapMode === "indoor" && (
        <div className="lg:hidden bg-surface border border-outline-variant/30 px-4 py-3 rounded-lg text-white mb-4 flex items-center gap-4 flex-wrap font-label-caps text-xs">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed" />
            <span className="text-[10px] text-on-surface-variant">FROM:</span>
            <select
              value={startNode}
              onChange={(e) => setStartNode(e.target.value)}
              className="bg-transparent border-none p-0 focus:ring-0 text-xs font-bold text-primary-fixed cursor-pointer focus:outline-none"
              aria-label="Starting location"
            >
              {Object.keys(VENUE_NODES).map(key => (
                <option key={key} value={key} className="bg-surface">{VENUE_NODES[key].name.toUpperCase()}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            <span className="text-[10px] text-on-surface-variant">TO:</span>
            <select
              value={endNode}
              onChange={(e) => setEndNode(e.target.value)}
              className="bg-transparent border-none p-0 focus:ring-0 text-xs font-bold text-secondary cursor-pointer focus:outline-none"
              aria-label="Destination location"
            >
              {Object.keys(VENUE_NODES).map(key => (
                <option key={key} value={key} className="bg-surface">{VENUE_NODES[key].name.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Main Grid: Map & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Map view */}
        <Card className="lg:col-span-8 p-0 overflow-hidden h-[50vh] md:h-[60vh] min-h-[400px] relative group transition-all duration-500 rounded-xl bg-surface-container-lowest/80 border-outline-variant/30 shadow-[0_0_20px_rgba(223,255,0,0.02)]">
          
          {/* Indoor/Outdoor switcher — desktop only */}
          <div className="hidden lg:flex absolute top-4 left-4 z-30 gap-1.5 bg-surface/90 border border-outline-variant/40 p-1.5 rounded-lg shadow-lg pointer-events-auto">
            <Button
              onClick={() => setMapMode("indoor")}
              variant={mapMode === "indoor" ? "primary" : "ghost"}
              size="sm"
              className="py-1 px-3"
            >
              <Building2 className="h-3.5 w-3.5 mr-1" /> INDOOR MAP
            </Button>
            <Button
              onClick={() => setMapMode("outdoor")}
              variant={mapMode === "outdoor" ? "secondary" : "ghost"}
              size="sm"
              className="py-1 px-3"
            >
              <MapIcon className="h-3.5 w-3.5 mr-1" /> OUTDOOR GPS
            </Button>
          </div>

          {mapMode === "indoor" ? (
            <div className="absolute inset-0 z-0 bg-black">
              <Map 
                currentUser={currentUser}
                isIndoor={true}
                selectedStadium={selectedStadium}
                startNode={startNode}
                endNode={endNode}
                path={path}
                congestedZones={congestedZones}
                onNodeSelect={setEndNode}
                directions={directions}
              />
              
              {/* Route Switcher — desktop only, inside map */}
              <div className="hidden lg:block absolute bottom-4 left-4 z-10 bg-black/85 backdrop-blur-md p-4 rounded-lg border border-primary-fixed/20 max-w-xs shadow-[0_0_15px_rgba(223,255,0,0.15)] text-white font-label-caps text-xs">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed volt-glow" />
                    <span className="text-[10px] text-on-surface-variant/80">FROM:</span>
                    <select 
                      value={startNode} 
                      onChange={(e) => setStartNode(e.target.value)} 
                      className="bg-transparent border-none p-0 focus:ring-0 text-xs font-bold text-primary-fixed volt-text-glow cursor-pointer focus:outline-none"
                    >
                      {Object.keys(VENUE_NODES).map(key => (
                        <option key={key} value={key} className="bg-surface">{VENUE_NODES[key].name.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2 border-t border-white/10 pt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary volt-glow" />
                    <span className="text-[10px] text-on-surface-variant/80">TO:</span>
                    <select 
                      value={endNode} 
                      onChange={(e) => setEndNode(e.target.value)} 
                      className="bg-transparent border-none p-0 focus:ring-0 text-xs font-bold text-secondary cursor-pointer focus:outline-none"
                    >
                      {Object.keys(VENUE_NODES).map(key => (
                        <option key={key} value={key} className="bg-surface">{VENUE_NODES[key].name.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 z-0 bg-black">
              <Map 
                currentUser={currentUser}
                selectedStadium={selectedStadium} 
                darkMode={true} 
                startNode={startNode}
                endNode={endNode}
                path={path}
                congestedZones={congestedZones}
                directions={directions}
              />
            </div>
          )}
        </Card>

        {/* Side Panel: Info & Directions */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Quick Metrics Widget */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-4 rounded-xl">
              <span className="font-mono text-[9px] text-on-surface-variant/70 block mb-1 uppercase tracking-wider font-label-caps">
                {translate("CONGESTION", language)}
              </span>
              <div className="flex items-end gap-1.5">
                <span className={`text-headline-sm font-bold uppercase ${congestedZones.length > 0 ? "text-error" : "text-primary-fixed volt-text-glow"}`}>
                  {congestedZones.length > 0 ? translate("HIGH", language) : "LOW"}
                </span>
              </div>
            </div>
            
            <div className="glass-panel p-4 rounded-xl">
              <span className="font-mono text-[9px] text-on-surface-variant/70 block mb-1 uppercase tracking-wider font-label-caps">
                {translate("ETA TO EXIT", language)}
              </span>
              <div className="flex items-end gap-1.5">
                <span className="text-headline-sm font-bold text-primary-fixed volt-text-glow font-label-caps uppercase">
                  {routingResult ? `${Math.round(routingResult.totalDistance / 20)} MIN` : "0 MIN"}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Steps Panel */}
          <Card className="flex-grow p-5 rounded-xl bg-surface-container-low/70 border-outline-variant/30 flex flex-col justify-between min-h-[250px]">
            <div>
              <div className="flex justify-between items-center mb-4 border-b border-outline-variant/20 pb-3">
                <div className="tech-id font-mono">NAVIGATION_STEPS</div>
                <Badge variant="info" className="px-2 py-0.5">
                   <Navigation2 className="h-3.5 w-3.5 mr-1" />
                   DIRECTIONS
                </Badge>
              </div>

              <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2">
                {directions.length > 0 ? (
                  directions.map((step, idx) => (
                    <div key={idx} className="flex gap-3 text-xs">
                      <span className="text-primary-fixed font-bold font-mono">{idx + 1}.</span>
                      <p className="text-on-surface-variant/90 font-body-md leading-relaxed">{translate(step, language)}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-on-surface-variant/80 italic font-body-md">Adjust route to generate path guidance.</p>
                )}
              </div>
            </div>
          </Card>

        </div>
      </div>
      
      {showConsent && (
        <LocationConsentModal 
          onConsent={() => setShowConsent(false)}
          onDecline={() => setShowConsent(false)} 
        />
      )}
    </div>
  );
}
