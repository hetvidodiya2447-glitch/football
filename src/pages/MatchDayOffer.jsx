import React, { useState, useEffect } from "react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { ArrowLeft, Ticket, QrCode, TicketCheck } from 'lucide-react';

export default function MatchDayOffer({ onBack }) {
  const offerId = "-8066615689536047946";
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  
  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center w-full text-on-surface">
      <div className="scanlines"></div>
      
      {/* Header */}
      <div className="w-full bg-black/85 backdrop-blur-xl border-b border-outline-variant/20 p-4 flex items-center justify-between sticky top-0 z-50">
        <Button 
          onClick={onBack} 
          variant="ghost"
          size="sm"
          className="p-2"
        >
          <ArrowLeft className="h-5 w-5 text-on-surface hover:text-primary-fixed transition-colors" />
        </Button>
        <span className="text-[10px] font-label-caps font-bold uppercase text-primary-fixed volt-text-glow tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-4 bg-primary-fixed rounded-sm volt-glow"></span>
          EXCLUSIVE OFFER
        </span>
        <div className="w-8"></div> {/* Spacer for centering */}
      </div>

      {/* Main Content */}
      <div className="w-full max-w-4xl p-4 md:p-8 space-y-6 animate-fade-in pb-24 z-10">
        
        {/* Hero Image Section */}
        <Card className="relative w-full h-64 md:h-80 p-0 overflow-hidden group rounded-xl bg-surface-container border border-outline-variant/30">
          <img 
            src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop" 
            alt="Exclusive Match Day Event" 
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
          
          <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 z-10 flex flex-col">
            <Badge variant="info" className="mb-2 backdrop-blur-sm">
              VIP UPGRADE
            </Badge>
            <h1 className="text-display-sm md:text-headline-lg font-bold text-white uppercase italic font-display-lg leading-none tracking-tight">
              PITCH-SIDE LOUNGE
            </h1>
          </div>
        </Card>

        {/* Offer Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Card className="col-span-2 p-6 space-y-4 bg-surface-container-low/75 border border-outline-variant/30 rounded-xl">
            <h2 className="text-sm font-bold uppercase text-primary-fixed volt-text-glow font-label-caps tracking-wide">Offer Details</h2>
            <p className="text-xs text-on-surface-variant font-body-md leading-relaxed">
              Elevate your match day experience. Gain access to the exclusive pitch-side lounge for the second half of the game. Enjoy complimentary drinks, premium seating, and unparalleled views of the action.
            </p>
            <div className="flex items-center gap-2 text-on-surface-variant/80 font-mono text-[10px] uppercase font-label-caps pt-2 border-t border-outline-variant/10">
              <Ticket className="h-3.5 w-3.5 text-primary-fixed" />
              Offer ID: {offerId}
            </div>
          </Card>

          <Card className="col-span-1 p-6 flex flex-col justify-center items-center text-center space-y-4 relative overflow-hidden bg-surface-container-low/75 border border-outline-variant/30 rounded-xl">
            <div className="absolute top-0 right-0 w-16 h-16 bg-error/10 rounded-full blur-2xl animate-pulse"></div>
            <h3 className="text-[9px] font-label-caps font-bold text-on-surface-variant/80 tracking-wider">EXPIRES IN</h3>
            <div className="text-2xl font-bold font-mono text-error font-display-lg">
              {formatTime(timeLeft)}
            </div>
            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
              <div 
                className="h-full bg-error transition-all duration-1000 ease-linear shadow-[0_0_8px_rgba(255,84,73,0.8)]"
                style={{ width: `${(timeLeft / 3600) * 100}%` }}
              ></div>
            </div>
          </Card>

        </div>

        {/* Redemption Code Section */}
        <Card className="p-8 flex flex-col items-center justify-center text-center mt-6 relative overflow-hidden group bg-surface-container-low/75 border border-outline-variant/30 rounded-xl">
          <div className="absolute -top-10 -right-10 text-primary-fixed/5 rotate-12 pointer-events-none transition-transform group-hover:scale-105">
            <TicketCheck className="h-48 w-48 text-primary-fixed" />
          </div>
          
          <h2 className="text-sm font-bold uppercase text-primary-fixed volt-text-glow mb-6 font-label-caps tracking-wider">
            SCAN TO REDEEM
          </h2>
          
          <div className="bg-white p-4 rounded border border-outline-variant/30 shadow-inner hover:scale-102 transition-transform duration-300">
            <div className="w-48 h-48 flex items-center justify-center bg-gray-50 rounded">
              <QrCode className="text-black h-36 w-36" />
            </div>
          </div>
          
          <p className="mt-8 text-white font-mono uppercase tracking-widest text-[10px] font-label-caps bg-black/40 px-4 py-2 rounded border border-outline-variant/20">
            Present this code at Entrance Gate A
          </p>
        </Card>

      </div>
    </div>
  );
}
