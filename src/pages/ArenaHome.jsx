import React from "react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { ArrowLeft, PlayCircle, Star, Utensils, Shirt, Megaphone, ArrowRight } from "lucide-react";

export default function ArenaHome({
  currentUser,
  language,
  setLanguage,
  selectedStadium,
  onNavigateHome
}) {
  const dir = "ltr";
  
  const categories = [
    { title: "Team Store", icon: Shirt, description: "Official jerseys and merch", color: "primary-fixed" },
    { title: "Stadium Eats", icon: Utensils, description: "Order food to your seat", color: "secondary" },
    { title: "VIP Access", icon: Star, description: "Exclusive lounges and perks", color: "primary-fixed" },
    { title: "Match Highlights", icon: PlayCircle, description: "Replays and analysis", color: "error" }
  ];

  return (
    <div dir={dir} className="max-w-[1200px] mx-auto p-4 md:p-8 space-y-8 pb-24 w-full min-h-screen text-on-surface">
      <div className="scanlines"></div>

      <header className="flex items-center justify-between mb-8 border-b border-outline-variant/20 pb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onNavigateHome} className="p-2" title="Back to Hub">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-display-sm font-bold italic tracking-widest text-primary-fixed volt-text-glow font-display-lg uppercase leading-none">ARENA HUB</h1>
            <p className="text-[10px] text-on-surface-variant font-label-caps uppercase tracking-widest font-mono mt-0.5">
              {selectedStadium ? selectedStadium.stadium : "Global Sports Hub"}
            </p>
          </div>
        </div>
      </header>

      {/* Featured Banner */}
      <Card className="relative h-64 md:h-80 overflow-hidden group cursor-pointer p-0 border border-outline-variant/30 rounded-xl">
        <img src="https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=2000&auto=format&fit=crop" alt="Stadium Atmosphere" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-6 md:p-10 z-10">
          <div className="mb-3 w-fit">
            <Badge variant="error">LIVE EVENT</Badge>
          </div>
          <h2 className="text-headline-lg font-bold text-white mb-2 uppercase italic font-display-lg leading-none tracking-tight">Championship Finals</h2>
          <p className="text-sm font-body-md text-white/80 max-w-xl">Experience the ultimate matchday with exclusive offers, real-time stats, and priority access to stadium amenities.</p>
        </div>
      </Card>

      {/* Categories Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-l-2 border-primary-fixed pl-4">
          <h3 className="text-headline-sm font-bold uppercase tracking-widest font-headline-sm italic text-white">
            EXPLORE SERVICES
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Card hoverable key={idx} className="group cursor-pointer flex flex-col items-start gap-4 p-6 bg-surface-container-low/60 rounded-xl border border-outline-variant/30">
                 <div className="w-12 h-12 rounded bg-black/40 border border-outline-variant/20 flex items-center justify-center">
                   <Icon className="h-5 w-5 text-primary-fixed" />
                 </div>
                 <div>
                   <h4 className="text-sm font-bold uppercase mb-1 text-white font-label-caps tracking-wide">{cat.title}</h4>
                   <p className="text-xs text-on-surface-variant font-body-md leading-relaxed">{cat.description}</p>
                 </div>
                 <div className="mt-auto pt-4 flex items-center gap-2 text-primary-fixed text-[10px] font-label-caps opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                   ENTER <ArrowRight className="h-3 w-3 text-primary-fixed" />
                 </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Latest Announcements */}
      <Card className="relative overflow-hidden rounded-xl bg-surface-container-low/60 border border-outline-variant/30 p-6">
        <h3 className="text-headline-sm font-bold uppercase tracking-widest text-white mb-6 flex items-center gap-2 font-headline-sm italic">
          <Megaphone className="h-5 w-5 text-primary-fixed" />
          ANNOUNCEMENTS
        </h3>
        
        <div className="space-y-4">
          {[
            { time: "10 MIN AGO", title: "New Merchandise Drop", text: "The limited edition Season 24 jerseys are now available at the East Stand store." },
            { time: "1 HR AGO", title: "Weather Update", text: "Clear skies expected for the remainder of the match. Enjoy the game!" },
            { time: "2 HRS AGO", title: "Gate Information", text: "Gate 4 is currently experiencing heavy traffic. Please consider using Gate 5 for faster entry." }
          ].map((announcement, idx) => (
            <div key={idx} className="flex gap-4 p-4 rounded-lg bg-black/40 border border-outline-variant/20 hover:bg-black/60 transition-colors">
              <div className="w-20 flex-shrink-0 text-[9px] font-label-caps font-bold tracking-wider text-primary-fixed mt-0.5">
                {announcement.time}
              </div>
              <div>
                <h5 className="font-bold text-white mb-1 font-label-caps text-xs">{announcement.title.toUpperCase()}</h5>
                <p className="text-xs font-body-md text-on-surface-variant/90 leading-relaxed">{announcement.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
