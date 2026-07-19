import { describe, it, expect } from 'vitest';
import { findShortestPath, generateDirections, VENUE_NODES } from '../services/navigationEngine';

describe('Navigation Engine (Dijkstra algorithm)', () => {
  it('should find the shortest path between gate_4 and gate_5', () => {
    const result = findShortestPath('gate_4', 'gate_5');
    expect(result).toBeDefined();
    expect(result.path).toContain('gate_4');
    expect(result.path).toContain('gate_5');
    expect(result.isRerouted).toBe(false);
  });

  it('should bypass congested zones', () => {
    const resultNormal = findShortestPath('gate_4', 'gate_5');
    const resultCongested = findShortestPath('gate_4', 'gate_5', ['titan_snacks']);
    
    expect(resultNormal.path).toContain('titan_snacks');
    expect(resultCongested.path).not.toContain('titan_snacks');
  });

  it('should return null for invalid nodes', () => {
    const result = findShortestPath('invalid_start', 'gate_5');
    expect(result).toBeNull();
  });

  it('should generate human-readable walking directions', () => {
    const path = ['gate_4', 'medical_bay', 'section_102'];
    const steps = generateDirections(path);
    expect(steps.length).toBeGreaterThan(0);
    expect(steps[0]).toContain('Start at');
    expect(steps[steps.length - 1]).toContain('destination');
  });
});
