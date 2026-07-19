import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom Icons
const userIcon = new L.DivIcon({
  className: '',
  html: `<div style="position:relative;width:20px;height:20px;">
    <div style="
      position:absolute;width:100%;height:100%;
      background:#4285F4;border:2.5px solid #fff;
      border-radius:50%;box-shadow:0 0 10px rgba(0,0,0,0.4);
      z-index:2;
    "></div>
    <div style="
      position:absolute;width:250%;height:250%;
      left:-75%;top:-75%;background:rgba(66,133,244,0.3);
      border-radius:50%;z-index:1;
      animation: pulse-ring 2s infinite ease-in-out;
    "></div>
  </div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const footballIcon = new L.DivIcon({
  className: '',
  html: `<div style="
    width:32px;height:32px;border-radius:50%;
    background:#2e7d32;border:2px solid #fff;
    box-shadow:0 0 8px rgba(0,0,0,0.5);
    display:flex;align-items:center;justify-content:center;
  ">
    <span style="font-size:16px;">⚽</span>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -18],
});

const cricketIcon = new L.DivIcon({
  className: '',
  html: `<div style="
    width:32px;height:32px;border-radius:50%;
    background:#e65100;border:2px solid #fff;
    box-shadow:0 0 8px rgba(0,0,0,0.5);
    display:flex;align-items:center;justify-content:center;
  ">
    <span style="font-size:16px;">🏏</span>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -18],
});

// Stadium Dataset
const STADIUMS = [
  // Football
  { id: 'wembley', name: 'Wembley Stadium', city: 'London', country: 'United Kingdom', sport: 'Football', capacity: '90,000', pos: [51.5560, -0.2795], icon: footballIcon },
  { id: 'campnou', name: 'Spotify Camp Nou', city: 'Barcelona', country: 'Spain', sport: 'Football', capacity: '99,354', pos: [41.3809, 2.1228], icon: footballIcon },
  { id: 'bernabeu', name: 'Santiago Bernabéu', city: 'Madrid', country: 'Spain', sport: 'Football', capacity: '81,044', pos: [40.4530, -3.6883], icon: footballIcon },
  { id: 'maracana', name: 'Maracanã', city: 'Rio de Janeiro', country: 'Brazil', sport: 'Football', capacity: '78,838', pos: [-22.9121, -43.2302], icon: footballIcon },
  { id: 'allianz', name: 'Allianz Arena', city: 'Munich', country: 'Germany', sport: 'Football', capacity: '75,000', pos: [48.2188, 11.6247], icon: footballIcon },
  { id: 'oldtrafford', name: 'Old Trafford', city: 'Manchester', country: 'United Kingdom', sport: 'Football', capacity: '74,310', pos: [53.4631, -2.2913], icon: footballIcon },
  { id: 'sansiro', name: 'San Siro', city: 'Milan', country: 'Italy', sport: 'Football', capacity: '80,018', pos: [45.4781, 9.1240], icon: footballIcon },
  { id: 'signaliduna', name: 'Signal Iduna Park', city: 'Dortmund', country: 'Germany', sport: 'Football', capacity: '81,365', pos: [51.4926, 7.4519], icon: footballIcon },
  { id: 'bombonera', name: 'La Bombonera', city: 'Buenos Aires', country: 'Argentina', sport: 'Football', capacity: '54,000', pos: [-34.6356, -58.3648], icon: footballIcon },
  { id: 'azadi', name: 'Azadi Stadium', city: 'Tehran', country: 'Iran', sport: 'Football', capacity: '78,116', pos: [35.7262, 51.2753], icon: footballIcon },

  // Cricket
  { id: 'modi', name: 'Narendra Modi Stadium', city: 'Ahmedabad', country: 'India', sport: 'Cricket', capacity: '132,000', pos: [23.0919, 72.5975], icon: cricketIcon },
  { id: 'mcg', name: 'Melbourne Cricket Ground', city: 'Melbourne', country: 'Australia', sport: 'Cricket', capacity: '100,024', pos: [-37.8200, 144.9834], icon: cricketIcon },
  { id: 'lords', name: "Lord's Cricket Ground", city: 'London', country: 'United Kingdom', sport: 'Cricket', capacity: '31,100', pos: [51.5299, -0.1722], icon: cricketIcon },
  { id: 'eden', name: 'Eden Gardens', city: 'Kolkata', country: 'India', sport: 'Cricket', capacity: '68,000', pos: [22.5646, 88.3433], icon: cricketIcon },
  { id: 'scg', name: 'Sydney Cricket Ground', city: 'Sydney', country: 'Australia', sport: 'Cricket', capacity: '48,000', pos: [-33.8914, 151.2248], icon: cricketIcon },
  { id: 'kensington', name: 'Kensington Oval', city: 'Bridgetown', country: 'Barbados', sport: 'Cricket', capacity: '28,000', pos: [13.1062, -59.6206], icon: cricketIcon },
  { id: 'wanderers', name: 'The Wanderers Stadium', city: 'Johannesburg', country: 'South Africa', sport: 'Cricket', capacity: '34,000', pos: [-26.1332, 28.0510], icon: cricketIcon },
  { id: 'galle', name: 'Galle International Stadium', city: 'Galle', country: 'Sri Lanka', sport: 'Cricket', capacity: '35,000', pos: [6.0336, 80.2163], icon: cricketIcon },
  { id: 'gaddafi', name: 'Gaddafi Stadium', city: 'Lahore', country: 'Pakistan', sport: 'Cricket', capacity: '27,000', pos: [31.5135, 74.3331], icon: cricketIcon },
  { id: 'basin', name: 'Basin Reserve', city: 'Wellington', country: 'New Zealand', sport: 'Cricket', capacity: '11,600', pos: [-41.3015, 174.7801], icon: cricketIcon },
];

// Helper to calculate distance in km using Haversine formula
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Map controller to handle programmatically panning/zooming
const MapViewUpdater = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
};

const StadiumMap = () => {
  const [selectedStadium, setSelectedStadium] = useState(STADIUMS[0]);
  const [sportFilter, setSportFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState(STADIUMS[0].pos);
  const [mapZoom, setMapZoom] = useState(13);
  const [mapStyle, setMapStyle] = useState('dark'); // 'dark' or 'satellite'

  // User GPS Tracking State
  const [userPos, setUserPos] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [isMockingGps, setIsMockingGps] = useState(false);
  const [mockLocation, setMockLocation] = useState({ name: 'London Office', pos: [51.5074, -0.1278] });

  // CSS for pulsing dot
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes pulse-ring {
        0% { transform: scale(0.3); opacity: 1; }
        100% { transform: scale(1.2); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Watch user geolocation
  useEffect(() => {
    let watchId = null;
    if (isTracking && !isMockingGps) {
      if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserPos([latitude, longitude]);
            setGpsError('');
          },
          (error) => {
            console.error('GPS error:', error);
            setGpsError('GPS Access Denied or Unavailable. Using Simulation.');
            setIsMockingGps(true);
            setUserPos(mockLocation.pos);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        setGpsError('Geolocation not supported by browser.');
        setIsMockingGps(true);
        setUserPos(mockLocation.pos);
      }
    } else if (isMockingGps) {
      setUserPos(mockLocation.pos);
    } else {
      setUserPos(null);
    }

    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    };
  }, [isTracking, isMockingGps, mockLocation]);

  // Handle mock location choice
  const handleMockChange = (city) => {
    let pos = [51.5074, -0.1278]; // London
    let name = 'London Base';

    if (city === 'ahmedabad') {
      pos = [23.0225, 72.5714];
      name = 'Ahmedabad Station';
    } else if (city === 'sydney') {
      pos = [-33.8688, 151.2093];
      name = 'Sydney CBD';
    } else if (city === 'riodejaneiro') {
      pos = [-22.9068, -43.1729];
      name = 'Rio Beach Front';
    }

    const newLoc = { name, pos };
    setMockLocation(newLoc);
    if (isMockingGps || isTracking) {
      setUserPos(pos);
      setMapCenter(pos);
      setMapZoom(12);
    }
  };

  const toggleGpsTracking = () => {
    if (isTracking) {
      setIsTracking(false);
      setIsMockingGps(false);
      setUserPos(null);
    } else {
      setIsTracking(true);
      setGpsError('');
    }
  };

  const handleSelectStadium = (stadium) => {
    setSelectedStadium(stadium);
    setMapCenter(stadium.pos);
    setMapZoom(15);
  };

  const filteredStadiums = STADIUMS.filter(s => {
    const matchesSport = sportFilter === 'All' || s.sport === sportFilter;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSport && matchesSearch;
  });

  // Calculate route distance if user position is available
  const distanceFromUser = userPos ? getDistance(userPos[0], userPos[1], selectedStadium.pos[0], selectedStadium.pos[1]) : null;

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-headline-md font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-cyber-volt">explore_stadium</span>
            GLOBAL STADIUM FINDER & GPS TRACKER
          </h2>
          <p className="text-xs text-on-surface-variant">Real-time GPS mapping & routing for world-class football & cricket arenas</p>
        </div>

        {/* GPS Control Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={toggleGpsTracking}
            className={`px-4 py-2 text-[10px] font-label-caps tracking-wider flex items-center gap-2 transition-all border ${
              isTracking
                ? 'bg-cyber-volt/20 border-cyber-volt text-cyber-volt shadow-[0_0_10px_rgba(223,255,0,0.2)]'
                : 'bg-white/5 border-white/10 text-on-surface-variant hover:border-cyber-volt/40'
            }`}
          >
            <span className={`material-symbols-outlined text-sm ${isTracking ? 'animate-pulse' : ''}`}>
              {isTracking ? 'gps_fixed' : 'gps_not_fixed'}
            </span>
            {isTracking ? 'GPS TRACKING ACTIVE' : 'ENABLE LIVE GPS'}
          </button>

          {isTracking && (
            <button
              onClick={() => setIsMockingGps(prev => !prev)}
              className={`px-3 py-2 text-[10px] font-label-caps border transition-colors ${
                isMockingGps ? 'bg-[#aac8ff]/20 border-[#aac8ff] text-[#aac8ff]' : 'bg-white/5 border-white/10 text-white/40'
              }`}
            >
              SIMULATE ROUTE
            </button>
          )}
        </div>
      </div>

      {/* GPS Mock Location Selector & Alert */}
      {isTracking && (
        <div className="glass-panel p-4 border-dashed border-cyber-volt/30 flex flex-col md:flex-row gap-4 items-center justify-between animate-in slide-in-from-top-3 duration-300">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-cyber-volt animate-spin text-lg">sync_saved_locally</span>
            <div className="text-[11px] font-mono">
              {isMockingGps ? (
                <span className="text-[#aac8ff]">SIMULATION ACTIVE: Sourcing location from <strong>{mockLocation.name}</strong></span>
              ) : (
                <span className="text-cyber-volt">GPS BROADCAST: WatchPosition updating live user coordinates.</span>
              )}
              {gpsError && <div className="text-[#ffb4ab] text-[10px] mt-0.5">{gpsError}</div>}
            </div>
          </div>

          {isTracking && (
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-label-caps text-on-surface-variant">CHANGE MOCK POINT:</span>
              <div className="flex gap-1.5">
                {[
                  { id: 'london', name: 'London' },
                  { id: 'ahmedabad', name: 'Ahmedabad' },
                  { id: 'sydney', name: 'Sydney' },
                  { id: 'riodejaneiro', name: 'Rio' }
                ].map(loc => (
                  <button
                    key={loc.id}
                    onClick={() => handleMockChange(loc.id)}
                    className="bg-white/5 hover:bg-cyber-volt hover:text-black border border-white/10 px-2 py-0.5 text-[9px] font-mono transition-all"
                  >
                    {loc.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Search & Filter List Panel */}
        <div className="lg:col-span-4 flex flex-col space-y-4 max-h-[520px] overflow-hidden">
          <div className="glass-panel p-4 space-y-3">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
              <input
                type="text"
                placeholder="Search stadium, city, country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded py-2 pl-9 pr-4 text-xs focus:border-cyber-volt focus:outline-none transition-all placeholder:text-white/20"
              />
            </div>

            {/* Sport Filter Tabs */}
            <div className="flex gap-2">
              {['All', 'Football', 'Cricket'].map(sport => (
                <button
                  key={sport}
                  onClick={() => setSportFilter(sport)}
                  className={`flex-1 py-1.5 text-[10px] font-label-caps border transition-all ${
                    sportFilter === sport
                      ? 'bg-cyber-volt text-black border-cyber-volt font-bold'
                      : 'bg-white/5 border-white/15 text-on-surface-variant hover:text-white'
                  }`}
                >
                  {sport}
                </button>
              ))}
            </div>
          </div>

          {/* Stadium List Scroll Area */}
          <div className="glass-panel p-2 flex-grow overflow-y-auto space-y-1.5 max-h-[380px] lg:max-h-[390px] scrollbar-thin">
            {filteredStadiums.map(s => {
              const active = selectedStadium.id === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => handleSelectStadium(s)}
                  className={`p-3 rounded cursor-pointer transition-all flex items-center justify-between border ${
                    active
                      ? 'bg-cyber-volt/10 border-cyber-volt/60'
                      : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10'
                  }`}
                >
                  <div>
                    <div className="text-[11px] font-bold text-primary flex items-center gap-1.5">
                      <span>{s.sport === 'Football' ? '⚽' : '🏏'}</span>
                      {s.name}
                    </div>
                    <div className="text-[9px] text-on-surface-variant mt-0.5">{s.city}, {s.country}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-mono bg-white/5 px-2 py-0.5 rounded text-on-surface-variant">Cap: {s.capacity}</span>
                  </div>
                </div>
              );
            })}
            {filteredStadiums.length === 0 && (
              <div className="text-center py-8 text-xs text-on-surface-variant">No stadiums found.</div>
            )}
          </div>
        </div>

        {/* Right Map Panel */}
        <div className="lg:col-span-8 space-y-4">
          <div className="glass-panel overflow-hidden relative" style={{ height: '420px' }}>
            {/* Live routing stat overlays on the map */}
            {distanceFromUser !== null && (
              <div className="absolute bottom-3 left-3 z-[1000] bg-black/90 backdrop-blur-md p-4 border border-cyber-volt/30 rounded max-w-sm space-y-2 animate-in fade-in duration-300 shadow-xl">
                <div className="text-[10px] font-label-caps text-cyber-volt">REAL-TIME ROUTING & GPS STATUS</div>
                <h4 className="text-sm font-bold text-primary">{selectedStadium.name}</h4>
                <div className="grid grid-cols-2 gap-4 font-mono text-[11px]">
                  <div>
                    <div className="text-on-surface-variant text-[9px] font-label-caps">GPS DISTANCE</div>
                    <div className="text-cyber-volt font-bold text-lg">{distanceFromUser.toFixed(1)} km</div>
                  </div>
                  <div>
                    <div className="text-on-surface-variant text-[9px] font-label-caps">EST. ROUTE TIME</div>
                    <div className="text-white text-lg">
                      {distanceFromUser > 800
                        ? `${Math.round(distanceFromUser / 800)} hrs (Flight)`
                        : `${Math.round(distanceFromUser / 60 * 60)} mins (Drive)`}
                    </div>
                  </div>
                </div>
                <div className="text-[9px] text-on-surface-variant border-t border-white/10 pt-2 flex justify-between">
                  <span>START: {isMockingGps ? mockLocation.name : 'Your Coordinates'}</span>
                  <span>DEST: {selectedStadium.city}</span>
                </div>
              </div>
            )}

            {/* Selected Stadium Header overlay */}
            <div className="absolute top-3 right-3 z-[1000] bg-black/85 backdrop-blur-md px-3 py-2 border border-white/10 rounded text-right">
              <div className="text-[12px] font-bold text-cyber-volt">{selectedStadium.name}</div>
              <div className="text-[9px] text-on-surface-variant">{selectedStadium.city}, {selectedStadium.country} • {selectedStadium.sport}</div>
            </div>

            {/* Map Style Toggle Overlay */}
            <div className="absolute top-3 left-3 z-[1000] flex gap-1 bg-black/80 backdrop-blur-md p-1 border border-white/10 rounded shadow-lg">
              <button
                onClick={() => setMapStyle('dark')}
                className={`px-2 py-1 text-[9px] font-label-caps rounded transition-all ${mapStyle === 'dark' ? 'bg-cyber-volt text-black font-bold' : 'text-on-surface-variant hover:text-white'}`}
              >
                DARK
              </button>
              <button
                onClick={() => setMapStyle('satellite')}
                className={`px-2 py-1 text-[9px] font-label-caps rounded transition-all ${mapStyle === 'satellite' ? 'bg-cyber-volt text-black font-bold' : 'text-on-surface-variant hover:text-white'}`}
              >
                SATELLITE
              </button>
            </div>

            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              scrollWheelZoom={true}
              zoomControl={true}
              style={{ height: '100%', width: '100%', background: '#0a0a0a' }}
              attributionControl={false}
            >
              {mapStyle === 'satellite' ? (
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                />
              ) : (
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                />
              )}

              <MapViewUpdater center={mapCenter} zoom={mapZoom} />

              {/* User GPS Pin */}
              {userPos && (
                <Marker position={userPos} icon={userIcon}>
                  <Popup>
                    <div className="text-xs font-mono" style={{ color: '#000' }}>
                      <strong>YOUR POSITION</strong>
                      <br />
                      Lat: {userPos[0].toFixed(4)}
                      <br />
                      Lng: {userPos[1].toFixed(4)}
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Stadium Pin */}
              <Marker position={selectedStadium.pos} icon={selectedStadium.icon}>
                <Popup>
                  <div style={{ fontFamily: 'Anybody', minWidth: '180px', color: '#000' }}>
                    <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '2px' }}>{selectedStadium.name}</div>
                    <div style={{ fontSize: '10px', color: '#666', marginBottom: '6px' }}>{selectedStadium.city}, {selectedStadium.country}</div>
                    <div style={{ fontSize: '11px', fontWeight: 600 }}>Sport: {selectedStadium.sport}</div>
                    <div style={{ fontSize: '11px' }}>Capacity: {selectedStadium.capacity}</div>
                  </div>
                </Popup>
              </Marker>

              {/* Route Polyline connecting User/Mock position to Selected Stadium */}
              {userPos && (
                <Polyline
                  positions={[userPos, selectedStadium.pos]}
                  pathOptions={{
                    color: '#DFFF00',
                    weight: 3,
                    opacity: 0.6,
                    dashArray: '8, 8',
                    lineCap: 'round',
                  }}
                />
              )}
            </MapContainer>
          </div>

          {/* Real-time Telemetry Stats Panel */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'SELECTED SPORT', val: selectedStadium.sport.toUpperCase(), desc: 'Match Type Configured', color: 'text-cyber-volt' },
              { label: 'STADIUM CAPACITY', val: selectedStadium.capacity, desc: 'Maximum Attendance Cap', color: 'text-white' },
              { label: 'COORDINATES', val: `${selectedStadium.pos[0].toFixed(3)}, ${selectedStadium.pos[1].toFixed(3)}`, desc: 'GPS Telemetry Pin', color: 'text-[#aac8ff]' },
              { label: 'TRACKING METHOD', val: isTracking ? (isMockingGps ? 'SIMULATOR' : 'LIVE GPS') : 'OFFLINE', valClass: isTracking ? 'text-cyber-volt' : 'text-on-surface-variant', desc: 'Active Localization Engine' }
            ].map((stat, i) => (
              <div key={i} className="glass-panel p-4">
                <div className="text-[9px] font-label-caps text-on-surface-variant mb-1">{stat.label}</div>
                <div className={`text-sm font-bold font-mono tracking-wide ${stat.color || stat.valClass}`}>{stat.val}</div>
                <div className="text-[8px] text-on-surface-variant/60 mt-1">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StadiumMap;
