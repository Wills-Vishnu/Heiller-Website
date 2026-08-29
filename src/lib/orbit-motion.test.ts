import { describe, expect, it } from 'vitest';
import {
  dampAngularVelocity,
  getOrbitBlur,
  getOrbitDepth,
  getOrbitTransform,
  getTargetAngularVelocity,
  MAX_ANGULAR_VELOCITY,
  MAX_MOBILE_ORBIT_BLUR_PX,
} from './orbit-motion';

const DESKTOP_RADIUS_X = 0.35;
const DESKTOP_RADIUS_Y = 0.324;
const COMPACT_RADIUS_X = 0.324;
const COMPACT_RADIUS_Y = 0.36;

describe('getOrbitTransform', () => {
  const field = { width: 1200, height: 760, compact: false, angle: 0 };

  it('places all eight pills at exact 45-degree intervals', () => {
    const positions = Array.from({ length: 8 }, (_, index) =>
      getOrbitTransform({ ...field, index }),
    );
    const normalizedAngles = positions.map(({ x, y }) =>
      Math.atan2(y / (field.height * DESKTOP_RADIUS_Y), x / (field.width * DESKTOP_RADIUS_X)),
    );
    for (let index = 0; index < normalizedAngles.length; index += 1) {
      const next = normalizedAngles[(index + 1) % normalizedAngles.length];
      const delta = (next - normalizedAngles[index] + Math.PI * 2) % (Math.PI * 2);
      expect(delta).toBeCloseTo(Math.PI / 4, 8);
    }
  });

  it('keeps every pill on one shared ellipse without tilt', () => {
    for (let index = 0; index < 8; index += 1) {
      const { x, y, rotation } = getOrbitTransform({ ...field, index });
      const ellipse =
        (x * x) / ((field.width * DESKTOP_RADIUS_X) ** 2) +
        (y * y) / ((field.height * DESKTOP_RADIUS_Y) ** 2);
      expect(ellipse).toBeCloseTo(1, 8);
      expect(rotation).toBe(0);
    }
  });

  it('uses the approved desktop and compact ellipse radii', () => {
    const desktop = getOrbitTransform({ width: 1200, height: 760, compact: false, angle: 0, index: 2 });
    const compact = getOrbitTransform({ width: 390, height: 560, compact: true, angle: 0, index: 2 });

    expect(Math.abs(desktop.x)).toBeCloseTo(1200 * DESKTOP_RADIUS_X * Math.cos(Math.PI / 8), 8);
    expect(Math.abs(desktop.y)).toBeCloseTo(760 * DESKTOP_RADIUS_Y * Math.sin(Math.PI / 8), 8);
    expect(Math.abs(compact.x)).toBeCloseTo(390 * COMPACT_RADIUS_X * Math.cos(Math.PI / 8), 8);
    expect(Math.abs(compact.y)).toBeCloseTo(560 * COMPACT_RADIUS_Y * Math.sin(Math.PI / 8), 8);
  });
});

describe('orbit depth', () => {
  it('places left-side pills behind and right-side pills in front', () => {
    expect(getOrbitDepth(-0.001)).toBe(1);
    expect(getOrbitDepth(0)).toBe(3);
    expect(getOrbitDepth(0.001)).toBe(3);
  });
});

describe('mobile orbit blur', () => {
  const width = 390;
  const farLeft = -(width * COMPACT_RADIUS_X);

  it('keeps front-plane and plane-crossing pills sharp', () => {
    expect(getOrbitBlur({ x: 0, width, mobile: true, reducedMotion: false })).toBe(0);
    expect(getOrbitBlur({ x: 25, width, mobile: true, reducedMotion: false })).toBe(0);
  });

  it('increases smoothly and monotonically toward the rear-most point', () => {
    const shallow = getOrbitBlur({ x: farLeft * 0.25, width, mobile: true, reducedMotion: false });
    const middle = getOrbitBlur({ x: farLeft * 0.5, width, mobile: true, reducedMotion: false });
    const deep = getOrbitBlur({ x: farLeft, width, mobile: true, reducedMotion: false });

    expect(shallow).toBeGreaterThan(0);
    expect(middle).toBeGreaterThan(shallow);
    expect(deep).toBe(MAX_MOBILE_ORBIT_BLUR_PX);
    expect(getOrbitBlur({ x: -0.001, width, mobile: true, reducedMotion: false })).toBeLessThan(0.001);
  });

  it('keeps desktop and reduced-motion pills sharp', () => {
    expect(getOrbitBlur({ x: farLeft, width, mobile: false, reducedMotion: false })).toBe(0);
    expect(getOrbitBlur({ x: farLeft, width, mobile: true, reducedMotion: true })).toBe(0);
  });
});

describe('scroll-driven angular velocity', () => {
  it('caps the orbit at the doubled maximum angular velocity', () => {
    expect(MAX_ANGULAR_VELOCITY).toBe(5.76);
    expect(getTargetAngularVelocity(100_000)).toBe(5.76);
    expect(getTargetAngularVelocity(-100_000)).toBe(-5.76);
  });

  it('maps half-range scroll velocity to half the maximum speed', () => {
    expect(getTargetAngularVelocity(1_200)).toBeCloseTo(2.88);
    expect(getTargetAngularVelocity(-1_200)).toBeCloseTo(-2.88);
  });

  it('maps downward and upward scroll to opposite orbit directions', () => {
    expect(getTargetAngularVelocity(900)).toBeGreaterThan(0);
    expect(getTargetAngularVelocity(-900)).toBeLessThan(0);
  });

  it('caps extreme scroll input', () => {
    expect(getTargetAngularVelocity(100_000)).toBe(MAX_ANGULAR_VELOCITY);
    expect(getTargetAngularVelocity(-100_000)).toBe(-MAX_ANGULAR_VELOCITY);
  });

  it('eases angular velocity close to rest in 300ms', () => {
    let velocity = MAX_ANGULAR_VELOCITY;
    for (let frame = 0; frame < 18; frame += 1) {
      velocity = dampAngularVelocity(velocity, 0, 1 / 60);
    }
    expect(Math.abs(velocity)).toBeLessThan(MAX_ANGULAR_VELOCITY * 0.06);
  });
});
