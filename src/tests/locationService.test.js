import { describe, it, expect } from 'vitest';
import { KalmanFilter, haversine, GPS_STATUS } from '../services/locationService';

describe('Location Service Helpers', () => {
  it('should verify GPS status codes are defined', () => {
    expect(GPS_STATUS.ACTIVE).toBe('active');
    expect(GPS_STATUS.PERMISSION_DENIED).toBe('permission_denied');
  });

  it('should verify Kalman filter smooths coordinate inputs', () => {
    const filter = new KalmanFilter({ R: 1, Q: 3 });
    const first = filter.filter(10);
    expect(first).toBe(10);

    const second = filter.filter(12);
    // Kalman should output a filtered estimate between 10 and 12
    expect(second).toBeGreaterThan(10);
    expect(second).toBeLessThan(12);

    filter.reset();
    expect(filter.x).toBeNull();
  });

  it('should calculate Haversine distance accurately', () => {
    // Distance between two points in London (approx 50.2 meters)
    const lat1 = 51.5007;
    const lon1 = -0.1246;
    const lat2 = 51.5011;
    const lon2 = -0.1249;
    
    const dist = haversine(lon1, lat1, lon2, lat2);
    expect(dist).toBeGreaterThan(40);
    expect(dist).toBeLessThan(60);
  });
});
