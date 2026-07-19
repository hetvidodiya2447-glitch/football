import React, { useState, useEffect } from "react";
import { translate, getDir } from "../services/translationEngine";
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import WeatherWidget from '../components/ui/WeatherWidget';
import { 
  Users, 
  ArrowRight, 
  Home, 
  Shirt, 
  Utensils, 
  ShoppingBag, 
  X, 
  QrCode, 
  Timer, 
  BarChart3, 
  Send,
  MessageSquare
} from 'lucide-react';

export default function FanHome({
  language,
  setLanguage,
  darkMode,
  setDarkMode,
  onNavigateToWayfinding,
  onNavigateToOffer,
  onNavigateToArena,
  onNavigateToStitch,
  zones,
  selectedStadium
} = {}) {
  const dir = getDir(language);
  const [homeScore, setHomeScore] = useState(2);
  const [awayScore, setAwayScore] = useState(1);
  const [showOffer, setShowOffer] = useState(null);
  const [iqQuestion, setIqQuestion] = useState("");

  // Score simulator ticker
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.85) {
        if (Math.random() > 0.5) {
          setHomeScore(s => s + 1);
        } else {
          setAwayScore(s => s + 1);
        }
      }
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const getZoneCrowdStatus = (zoneId) => {
    const zone = zones?.[zoneId];
    if (!zone) return { label: 'UNKNOWN', text: 'text-on-surface-variant' };
    const pct = zone.current / zone.capacity;
    if (pct > 0.9) return { label: 'CRITICAL', text: 'text-error', colorClass: 'bg-error' };
    if (pct > 0.75) return { label: 'MODERATE', text: 'text-secondary', colorClass: 'bg-secondary' };
    return { label: 'CLEAR', text: 'text-primary-fixed volt-text-glow', colorClass: 'bg-primary-fixed' };
  };

  const gate4Status = getZoneCrowdStatus('gate_4');
  const concourseBStatus = getZoneCrowdStatus('concourse_b');

  const handleAskIq = (e) => {
    e.preventDefault();
    if (!iqQuestion.trim()) return;
    // Redirect user to the wayfinding page which has the full interactive voice/text AI concierge
    onNavigateToWayfinding();
  };

  return (
    <div dir={dir} className="max-w-[1200px] mx-auto px-4 md:px-gutter mt-8 space-y-8 pb-24 w-full min-h-screen text-on-surface">
      <div className="scanlines"></div>

      {/* Live Score Hero */}
      <section className="relative">
        <div className="glass-panel volt-glow p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden rounded-xl">
          <div className="absolute top-2 right-4 tech-id">LIVE_MATCH_STREAM_V2.4</div>
          
          {/* Team 1 */}
          <div className="flex items-center gap-6 z-10 w-full md:w-auto">
            <div className="flex flex-col md:items-start text-center md:text-left">
              <span className="text-label-caps text-[10px] text-on-surface-variant/60 font-label-caps uppercase">HOME</span>
              <h2 className="text-headline-md md:text-headline-lg font-bold uppercase italic leading-none">
                {selectedStadium && selectedStadium.hometeams ? selectedStadium.hometeams.split(',')[0].trim().toUpperCase() : "TITANS"}
              </h2>
            </div>
            <div className="text-display-xl font-bold text-primary-fixed volt-text-glow ml-auto md:ml-0 font-display-xl">{homeScore}</div>
          </div>

          {/* VS & Clock */}
          <div className="flex flex-col items-center z-10">
            <div className="text-primary-fixed volt-text-glow font-bold animate-pulse mb-1 font-label-caps text-xs">LIVE - 74'</div>
            <div className="w-px h-6 bg-white/20 mb-2"></div>
            <div className="text-headline-sm font-bold text-on-surface-variant/40 font-headline-sm">VS</div>
            <div className="w-px h-6 bg-white/20 mt-2"></div>
          </div>

          {/* Team 2 */}
          <div className="flex items-center gap-6 z-10 w-full md:w-auto md:flex-row-reverse">
            <div className="flex flex-col md:items-end text-center md:text-right">
              <span className="text-label-caps text-[10px] text-on-surface-variant/60 font-label-caps uppercase">AWAY</span>
              <h2 className="text-headline-md md:text-headline-lg font-bold uppercase italic leading-none">
                {selectedStadium && selectedStadium.hometeams && selectedStadium.hometeams.split(',')[1] ? selectedStadium.hometeams.split(',')[1].trim().toUpperCase() : "APEX"}
              </h2>
            </div>
            <div className="text-display-xl font-bold text-white mr-auto md:mr-0 font-display-xl">{awayScore}</div>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
            <div className="h-full bg-primary-fixed volt-glow transition-all duration-500" style={{ width: '74%' }}></div>
          </div>
        </div>
      </section>

      {/* Smart Status Cards & AI */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Gate Status */}
        <div 
          onClick={() => setShowOffer("gate_qr")}
          className="glass-panel p-6 space-y-4 rounded-xl cursor-pointer hover:border-primary-fixed/40 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div className="tech-id">ENTRY_PT_04</div>
            <span className={`w-2 h-2 rounded-full ${gate4Status.colorClass} volt-glow`}></span>
          </div>
          <div>
            <p className="text-[10px] font-label-caps text-on-surface-variant uppercase">GATE 4 STATUS</p>
            <p className={`text-headline-md font-bold uppercase ${gate4Status.text}`}>{translate(gate4Status.label, language)}</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-label-caps text-on-surface-variant">
            <Timer className="h-4 w-4 text-primary-fixed" />
            <span>EST. WAIT: &lt; 2 MIN</span>
          </div>
        </div>

        {/* Concourse Status */}
        <div className="glass-panel p-6 space-y-4 rounded-xl">
          <div className="flex justify-between items-start">
            <div className="tech-id">CONCOURSE_B</div>
            <span className={`w-2 h-2 rounded-full ${concourseBStatus.colorClass} volt-glow`}></span>
          </div>
          <div>
            <p className="text-[10px] font-label-caps text-on-surface-variant uppercase">CONCOURSE B</p>
            <p className={`text-headline-md font-bold uppercase ${concourseBStatus.text}`}>{translate(concourseBStatus.label, language)}</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-label-caps text-on-surface-variant">
            <Users className="h-4 w-4 text-secondary" />
            <span>TRAFFIC INCREASING</span>
          </div>
        </div>

        {/* Ask IQ AI Widget */}
        <form onSubmit={handleAskIq} className="lg:col-span-2 glass-panel p-6 flex flex-col justify-center border-primary-fixed/30 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <div className="tech-id">IQ_COGNITIVE_ASSISTANT</div>
            <div className="bg-primary-fixed text-black text-[9px] px-2 py-0.5 font-bold uppercase rounded font-label-caps">GenAI</div>
          </div>
          <h3 className="text-headline-sm font-bold text-white font-headline-sm uppercase italic">ASK IQ AI</h3>
          <div className="relative mt-2">
            <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-fixed/60 h-4 w-4" />
            <input 
              className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-11 pr-12 text-sm focus:border-primary-fixed outline-none transition-all placeholder:text-on-surface-variant/30 text-white font-body-md" 
              placeholder="Where is the nearest exit path?" 
              type="text"
              value={iqQuestion}
              onChange={(e) => setIqQuestion(e.target.value)}
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-fixed hover:scale-105 transition-transform">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>

      </section>

      {/* Match Performance Analytics */}
      <section className="glass-panel p-6 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <div className="tech-id">PERFORMANCE_ANALYTICS</div>
          <BarChart3 className="h-4 w-4 text-primary-fixed" />
        </div>
        <div className="grid grid-cols-3 gap-8 font-label-caps">
          <div className="text-center">
            <div className="text-headline-md font-bold text-primary-fixed volt-text-glow font-headline-md">58%</div>
            <div className="text-[10px] text-on-surface-variant/60 tracking-wider">POSSESSION</div>
          </div>
          <div className="text-center border-x border-white/10">
            <div className="text-headline-md font-bold text-primary-fixed volt-text-glow font-headline-md">12</div>
            <div className="text-[10px] text-on-surface-variant/60 tracking-wider">SHOTS (ON)</div>
          </div>
          <div className="text-center">
            <div className="text-headline-md font-bold text-primary-fixed volt-text-glow font-headline-md">94%</div>
            <div className="text-[10px] text-on-surface-variant/60 tracking-wider">PASS ACC</div>
          </div>
        </div>
      </section>

      {/* Match Day Offers */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-l-2 border-primary-fixed pl-4">
          <h3 className="text-headline-sm font-bold uppercase tracking-widest font-headline-sm italic text-white">MATCH DAY OFFERS</h3>
          <button className="text-[10px] font-label-caps text-on-surface-variant hover:text-primary-fixed flex items-center gap-2 tracking-wider transition-colors">
            {translate("VIEW ALL", language)} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Offer 1 */}
          <div className="glass-panel rounded-xl overflow-hidden group flex flex-col justify-between min-h-[220px]">
            <div className="h-32 relative overflow-hidden">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Burger Offer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFN3VUV36J_PzfpWrX7DqOfeeASkz8bzI5toe7LzGy6TiKaLFZGF5H625p_owdz5cCmuV504Wzij6oOGm-GmQ3sQCGxzoowY53opRsYc_ePhXLoAYKOVDH4j3gVEhYmSmXOYKPlX6b_zm7MI89-D9YYQOsj-GHUDToRT2ZpTJFTeJWTaXHsTGI-d_6HotGGLgAn94o8RA2KvIz-W4vD8aqqVe4f0-PaCquzd4G1Oh2aPHQDj16B-h7HQ"/>
              <div className="absolute top-3 right-3">
                <Badge variant="success">30% OFF</Badge>
              </div>
            </div>
            <div className="p-4 flex justify-between items-end">
              <div>
                <p className="text-[9px] font-label-caps text-primary-fixed mb-1 font-mono">FUEL_PACK_X</p>
                <h4 className="text-sm font-bold uppercase text-white font-label-caps">{translate("PRE-MATCH COMBO", language)}</h4>
                <p className="text-xs text-on-surface-variant/80 font-body-md mt-0.5">{translate("Valid until kickoff at all vendors.", language)}</p>
              </div>
              <Button 
                onClick={() => setShowOffer("burger")}
                variant="primary" 
                size="sm"
                className="py-1 px-3"
              >
                REDEEM
              </Button>
            </div>
          </div>

          {/* Offer 2 */}
          <div className="glass-panel rounded-xl overflow-hidden group flex flex-col justify-between min-h-[220px]">
            <div className="h-32 relative overflow-hidden">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Jersey Drop" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYMWZUwaGKtSzU4i0EgGeLcoGurk_TTKP3qt9d8nlud0nYk3WgQOctSeR2shOfJr90SEpOJwv15aaRFt-BpaJ5YFJ74VPJ5P_cw3uxz0_owsHOfj8Kb2saWQ2O7XZq2cXtzMyaVkzcjob0t4wP9RRZZNMaHeUu1SYdbv10CtAigfsVwgvapyJy4w7k3VIUn-gTTcZovGTxGQ2TFFpPL2VcPhGHSVYjHKdxnz1h20vw2qHxrOu59zZy9A"/>
              <div className="absolute top-3 right-3">
                 <Badge variant="warning">NEW DROP</Badge>
              </div>
            </div>
            <div className="p-4 flex justify-between items-end">
              <div>
                <p className="text-[9px] font-label-caps text-primary-fixed mb-1 font-mono">LIMITED_DROP_01</p>
                <h4 className="text-sm font-bold uppercase text-white font-label-caps">{translate("SEASON 24 JERSEY", language)}</h4>
                <p className="text-xs text-on-surface-variant/80 font-body-md mt-0.5">{translate("Exclusive drop for IQ members.", language)}</p>
              </div>
              <Button 
                onClick={() => setShowOffer("jersey")}
                variant="secondary" 
                size="sm"
                className="py-1 px-3"
              >
                SHOP
              </Button>
            </div>
          </div>

          {/* Offer 3 */}
          <div className="glass-panel rounded-xl overflow-hidden group flex flex-col justify-between min-h-[220px]">
            <div className="h-32 relative overflow-hidden">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="VIP Access" src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop"/>
              <div className="absolute top-3 right-3">
                 <Badge variant="info">VIP</Badge>
              </div>
            </div>
            <div className="p-4 flex justify-between items-end">
              <div>
                <p className="text-[9px] font-label-caps text-primary-fixed mb-1 font-mono">EXCLUSIVE_ACCESS</p>
                <h4 className="text-sm font-bold uppercase text-white font-label-caps">{translate("PITCH-SIDE LOUNGE", language)}</h4>
                <p className="text-xs text-on-surface-variant/80 font-body-md mt-0.5">{translate("ID: -8066615689536047946", language)}</p>
              </div>
              <Button 
                onClick={onNavigateToOffer}
                variant="outline" 
                size="sm"
                className="py-1 px-3"
              >
                ENTER
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stitch MCP Pages */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-l-2 border-primary-fixed pl-4">
          <h3 className="text-headline-sm font-bold uppercase tracking-widest font-headline-sm italic text-white">GLOBAL SPORTS HUB</h3>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-8 snap-x scrollbar-hide no-scrollbar">
          <Card hoverable onClick={onNavigateToArena} className="min-w-[160px] snap-start flex flex-col items-center justify-center text-center gap-3 cursor-pointer py-6 bg-surface-container-low/60 rounded-xl">
             <Home className="h-6 w-6 text-primary-fixed group-hover:scale-110 transition-transform" />
             <span className="text-[10px] font-label-caps text-white font-bold tracking-wider">ARENA HOME</span>
          </Card>
          <div onClick={() => onNavigateToStitch('/stitch/india-jersey.html')} className="snap-start cursor-pointer">
            <Card hoverable className="min-w-[160px] h-full flex flex-col items-center justify-center text-center gap-3 py-6 bg-surface-container-low/60 rounded-xl">
               <Shirt className="h-6 w-6 text-primary-fixed group-hover:scale-110 transition-transform" />
               <span className="text-[10px] font-label-caps text-white font-bold tracking-wider">INDIA JERSEY</span>
            </Card>
          </div>
          <div onClick={() => onNavigateToStitch('/stitch/stadium-eats.html')} className="snap-start cursor-pointer">
            <Card hoverable className="min-w-[160px] h-full flex flex-col items-center justify-center text-center gap-3 py-6 bg-surface-container-low/60 rounded-xl">
               <Utensils className="h-6 w-6 text-primary-fixed group-hover:scale-110 transition-transform" />
               <span className="text-[10px] font-label-caps text-white font-bold tracking-wider">STADIUM EATS</span>
            </Card>
          </div>
          <div onClick={() => onNavigateToStitch('/stitch/football-jerseys.html')} className="snap-start cursor-pointer">
             <Card hoverable className="min-w-[160px] h-full flex flex-col items-center justify-center text-center gap-3 py-6 bg-surface-container-low/60 rounded-xl">
               <Shirt className="h-6 w-6 text-primary-fixed group-hover:scale-110 transition-transform" />
               <span className="text-[10px] font-label-caps text-white font-bold tracking-wider">FOOTBALL JERSEYS</span>
             </Card>
          </div>
          <div onClick={() => onNavigateToStitch('/stitch/your-bag.html')} className="snap-start cursor-pointer">
             <Card hoverable className="min-w-[160px] h-full flex flex-col items-center justify-center text-center gap-3 py-6 bg-surface-container-low/60 rounded-xl">
               <ShoppingBag className="h-6 w-6 text-primary-fixed group-hover:scale-110 transition-transform" />
               <span className="text-[10px] font-label-caps text-white font-bold tracking-wider">YOUR BAG</span>
             </Card>
          </div>
        </div>
      </section>

      {/* Offer Modal */}
      {showOffer && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <Card className="w-full max-w-sm relative rounded-xl border border-primary-fixed/20 shadow-[0_0_20px_rgba(223,255,0,0.1)] bg-surface-container">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowOffer(null)}
              className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="mb-4">
               <Badge variant="info">
                 {showOffer === "burger" ? "VOUCHER CODE" : (showOffer === "gate_qr" ? "GATE PASS" : "SHOP OFFER")}
               </Badge>
            </div>
            
            <p className="text-sm text-on-surface-variant mb-6 font-body-md">
              {showOffer === "burger"
                ? "Present this QR code at Titan Snacks to redeem your 30% discount."
                : (showOffer === "gate_qr" 
                    ? "Present this QR code scanner at Gate 4 to authorize access." 
                    : "Limited quantity available. Head to Store Section A now to purchase.")}
            </p>
            <div className="flex flex-col items-center justify-center p-6 bg-black/40 rounded-lg border border-outline-variant/30 mb-6 shadow-inner">
              <div className="w-32 h-32 flex items-center justify-center bg-white rounded-lg">
                <QrCode className="text-black h-24 w-24" />
              </div>
              <span className="text-white font-mono font-bold tracking-widest mt-4 text-xs font-label-caps">
                {showOffer === "burger" ? "IQ-742-COMBO" : (showOffer === "gate_qr" ? "IQ-GATE-04" : "IQ-SEASON-24")}
              </span>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
