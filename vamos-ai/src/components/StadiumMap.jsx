import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue in Leaflet + bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom volt-colored icon
const voltIcon = new L.DivIcon({
  className: '',
  html: `<div style="
    width:28px;height:28px;border-radius:50%;
    background:#DFFF00;border:3px solid #000;
    box-shadow:0 0 12px rgba(223,255,0,0.6);
    display:flex;align-items:center;justify-content:center;
  ">
    <span style="font-size:14px;color:#000;font-weight:bold;">⚡</span>
  </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -16],
});

const alertIcon = new L.DivIcon({
  className: '',
  html: `<div style="
    width:28px;height:28px;border-radius:50%;
    background:#ff6b6b;border:3px solid #000;
    box-shadow:0 0 12px rgba(255,107,107,0.6);
    display:flex;align-items:center;justify-content:center;
  ">
    <span style="font-size:14px;color:#fff;font-weight:bold;">!</span>
  </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -16],
});

const infoIcon = new L.DivIcon({
  className: '',
  html: `<div style="
    width:28px;height:28px;border-radius:50%;
    background:#dcb8ff;border:3px solid #000;
    box-shadow:0 0 12px rgba(220,184,255,0.6);
    display:flex;align-items:center;justify-content:center;
  ">
    <span style="font-size:12px;color:#000;font-weight:bold;">i</span>
  </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -16],
});

// Stadium center — Wembley Stadium for demo
const STADIUM_CENTER = [51.5560, -0.2795];

const MARKERS = [
  { pos: [51.5565, -0.2810], icon: voltIcon, title: 'GATE 1 — NORTH', desc: 'Status: CLEAR • Wait: 1m', type: 'gate' },
  { pos: [51.5555, -0.2780], icon: voltIcon, title: 'GATE 4 — EAST', desc: 'Status: CLEAR • Wait: 2m', type: 'gate' },
  { pos: [51.5550, -0.2815], icon: alertIcon, title: 'GATE 7 — SOUTH', desc: '⚠ CONGESTION ALERT • Wait: 12m', type: 'alert' },
  { pos: [51.5568, -0.2790], icon: infoIcon, title: 'WATER STATION', desc: 'Nearest hydration point • Concourse B', type: 'info' },
  { pos: [51.5558, -0.2825], icon: infoIcon, title: 'FIRST AID', desc: 'Medical tent • 24/7 staffed', type: 'info' },
  { pos: [51.5562, -0.2770], icon: infoIcon, title: 'MERCHANDISE', desc: '20% off Titans jerseys until halftime', type: 'info' },
];

const CROWD_ZONES = [
  { center: [51.5565, -0.2800], radius: 80, color: '#DFFF00', fillOpacity: 0.15, label: 'North Wing — 42%' },
  { center: [51.5550, -0.2800], radius: 80, color: '#ff6b6b', fillOpacity: 0.25, label: 'South Wing — 94%' },
];

const StadiumMap = () => {
  return (
    <div className="space-y-4 fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-headline-md font-bold text-primary">STADIUM MAP</h2>
        <div className="flex gap-4 text-[10px] font-label-caps text-on-surface-variant">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyber-volt inline-block"></span> GATES</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#ff6b6b] inline-block"></span> ALERTS</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-secondary inline-block"></span> SERVICES</span>
        </div>
      </div>

      <div className="glass-panel overflow-hidden relative" style={{ height: '450px' }}>
        <div className="absolute top-3 left-3 z-[1000] bg-black/80 backdrop-blur-md px-3 py-1.5 border border-cyber-volt/30 rounded flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyber-volt animate-pulse"></span>
          <span className="font-label-caps text-[10px] text-cyber-volt">LIVE_STADIUM_VIEW</span>
        </div>
        <MapContainer
          center={STADIUM_CENTER}
          zoom={17}
          scrollWheelZoom={true}
          zoomControl={false}
          style={{ height: '100%', width: '100%', background: '#0a0a0a' }}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />

          {CROWD_ZONES.map((zone, i) => (
            <Circle
              key={i}
              center={zone.center}
              radius={zone.radius}
              pathOptions={{
                color: zone.color,
                fillColor: zone.color,
                fillOpacity: zone.fillOpacity,
                weight: 1,
              }}
            >
              <Popup>
                <div style={{ color: '#000', fontFamily: 'Anybody', fontWeight: 700, fontSize: '12px' }}>
                  {zone.label}
                </div>
              </Popup>
            </Circle>
          ))}

          {MARKERS.map((m, i) => (
            <Marker key={i} position={m.pos} icon={m.icon}>
              <Popup>
                <div style={{ fontFamily: 'Anybody', minWidth: '160px' }}>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#000', marginBottom: '4px' }}>{m.title}</div>
                  <div style={{ fontSize: '11px', color: '#333' }}>{m.desc}</div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Quick access cards below map */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: 'local_drink', label: 'WATER', detail: '2 nearby' },
          { icon: 'restaurant', label: 'FOOD', detail: '5 nearby' },
          { icon: 'wc', label: 'RESTROOMS', detail: '3 nearby' },
          { icon: 'local_hospital', label: 'FIRST AID', detail: '1 nearby' },
        ].map((item, i) => (
          <div key={i} className="glass-panel p-4 flex flex-col items-center text-center cursor-pointer hover:border-cyber-volt/50 transition-colors">
            <span className="material-symbols-outlined text-cyber-volt text-2xl mb-2">{item.icon}</span>
            <span className="text-label-caps text-primary text-[10px]">{item.label}</span>
            <span className="text-[9px] text-on-surface-variant mt-1">{item.detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StadiumMap;
