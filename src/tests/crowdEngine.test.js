import { describe, it, expect } from 'vitest';
import { getAdvisories, updateOccupancy } from '../services/crowdEngine';

describe('Crowd Engine Telemetry', () => {
  const mockZones = {
    north_gate: {
      id: "north_gate",
      name: "Zone North Gate",
      capacity: 10000,
      current: 9500, // 95% capacity
      trend: 2.0,
      severity: "NORMAL",
      icon: "gate"
    },
    east_stand: {
      id: "east_stand",
      name: "Zone C - East Stand",
      capacity: 10000,
      current: 5000,
      trend: 12.0, // trend >= 10%
      severity: "NORMAL",
      icon: "grid_view"
    }
  };

  it('should generate advisory notices for high capacity zones', () => {
    const advisories = getAdvisories(mockZones);
    expect(advisories).toBeDefined();
    
    // north_gate is > 90%, should trigger warning
    const northGateAdv = advisories.find(a => a.zoneId === 'north_gate');
    expect(northGateAdv).toBeDefined();
    expect(northGateAdv.severity).toBe('CRITICAL');
  });

  it('should generate rush advisory warnings for rapidly growing zones', () => {
    const advisories = getAdvisories(mockZones);
    // east_stand trend is 12.0 (> 10%), should trigger rush warning
    const eastStandAdv = advisories.find(a => a.zoneId === 'east_stand');
    expect(eastStandAdv).toBeDefined();
    expect(eastStandAdv.severity).toBe('MODERATE');
  });

  it('should update occupancies and recompute severity states over time', () => {
    const updated = updateOccupancy(mockZones, 300);
    expect(updated.north_gate.current).toBeDefined();
    expect(updated.north_gate.severity).toBeDefined();
  });
});
