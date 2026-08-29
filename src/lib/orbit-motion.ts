export type OrbitInput = {
  index: number;
  angle: number;
  width: number;
  height: number;
  compact: boolean;
};

export type OrbitTransform = {
  x: number;
  y: number;
  rotation: number;
};

export type OrbitBlurInput = {
  x: number;
  width: number;
  mobile: boolean;
  reducedMotion: boolean;
};

const TAU = Math.PI * 2;
const PILL_COUNT = 8;
const START_ANGLE = -(Math.PI * 3) / 8;
const MAX_SCROLL_VELOCITY = 2400;
const SETTLE_TIME_CONSTANT_SECONDS = 0.1;
const COMPACT_RADIUS_X = 0.324;

export const MAX_ANGULAR_VELOCITY = 5.76;
export const MAX_MOBILE_ORBIT_BLUR_PX = 2.5;

export function getOrbitTransform({ index, angle, width, height, compact }: OrbitInput): OrbitTransform {
  const normalizedIndex = ((index % PILL_COUNT) + PILL_COUNT) % PILL_COUNT;
  const phase = START_ANGLE + angle + (normalizedIndex / PILL_COUNT) * TAU;
  const radiusX = width * (compact ? COMPACT_RADIUS_X : 0.35);
  const radiusY = height * (compact ? 0.36 : 0.324);

  return {
    x: Math.cos(phase) * radiusX,
    y: Math.sin(phase) * radiusY,
    rotation: 0,
  };
}

export function getOrbitDepth(x: number): 1 | 3 {
  return x < 0 ? 1 : 3;
}

export function getOrbitBlur({ x, width, mobile, reducedMotion }: OrbitBlurInput): number {
  if (!mobile || reducedMotion || x >= 0 || width <= 0) return 0;

  const rearDepth = Math.max(0, Math.min(1, -x / (width * COMPACT_RADIUS_X)));
  const easedDepth = rearDepth * rearDepth * (3 - 2 * rearDepth);
  return easedDepth * MAX_MOBILE_ORBIT_BLUR_PX;
}

export function getTargetAngularVelocity(scrollVelocity: number): number {
  const clamped = Math.max(-MAX_SCROLL_VELOCITY, Math.min(MAX_SCROLL_VELOCITY, scrollVelocity));
  return (clamped / MAX_SCROLL_VELOCITY) * MAX_ANGULAR_VELOCITY;
}

export function dampAngularVelocity(current: number, target: number, deltaSeconds: number): number {
  const safeDelta = Math.max(0, deltaSeconds);
  const blend = 1 - Math.exp(-safeDelta / SETTLE_TIME_CONSTANT_SECONDS);
  return current + (target - current) * blend;
}
