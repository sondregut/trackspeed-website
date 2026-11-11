// Sprint calculators shared by the website tools. Each function is a direct port
// of the TrackSpeed iOS app so the website and the app give the same answers:
// - Wind: SprintTimer/Models/WindAdjustmentCalculator.swift
// - Flying sprint: SprintTimer/Models/DistanceConverter.swift (FlyingSprintConverter)

// MARK: Wind adjustment, Moinat, Fabius & Emanuel (2018), European Journal of
// Sport Science 18(9), 1185–1190. ΔP = time_0 − time_w (positive = wind-aided).
//   100m: ΔP = (a + cP·P)·w + b·w²   200m: ΔP = a·w + b·w²

export type WindEvent = '100m' | '200m';

const WIND_COEFFICIENTS: Record<WindEvent, {a: number; b: number; cP: number}> = {
  '100m': {a: -0.0449, b: -0.0042, cP: 0.009_459},
  '200m': {a: 0.09, b: -0.01, cP: 0},
};

/** Beyond ±10 m/s is unrealistic for athletics; the app clamps to this. */
export const MAX_WIND_SPEED = 10;
/** World Athletics legal wind limit for records. */
export const LEGAL_WIND_LIMIT = 2;

const clampWind = (w: number) => Math.min(Math.max(w, -MAX_WIND_SPEED), MAX_WIND_SPEED);

/** ΔP in seconds (positive = the wind-aided time is faster than zero wind). */
export function windEffect(wind: number, event: WindEvent, performanceTime?: number) {
  const w = clampWind(wind);
  const {a, b, cP} = WIND_COEFFICIENTS[event];
  if (event === '100m' && performanceTime !== undefined && performanceTime > 0) {
    return (a + cP * performanceTime) * w + b * w * w;
  }
  return a * w + b * w * w;
}

/** Measured time adjusted to zero wind. */
export function adjustToZeroWind(measuredTime: number, wind: number, event: WindEvent) {
  return measuredTime + windEffect(wind, event, measuredTime);
}

/** Estimated time at another wind, from a zero-wind time. */
export function estimateAtWind(zeroWindTime: number, targetWind: number, event: WindEvent) {
  const w = clampWind(targetWind);
  const {a, b, cP} = WIND_COEFFICIENTS[event];
  if (event === '100m') {
    // Solves time_0 = time_w + (a + cP·time_w)·w + b·w² for time_w, as the app does.
    return (zeroWindTime - a * w - b * w * w) / (1 + cP * w);
  }
  return zeroWindTime - windEffect(w, event);
}

export const isLegalWind = (wind: number) => wind <= LEGAL_WIND_LIMIT;

// MARK: Flying sprint, SpeedEndurance.com (Jimson Lee): T_100 = (10/3)·T_fly30 + 1.00.
// 10m and 20m flys convert to a 30m equivalent at the same top speed.

export type FlyingDistance = 10 | 20 | 30;

export const ACCELERATION_PENALTY = 1.0;
/** Same factor as the app's speed unit setting (UserSettings.swift). */
export const MPH_PER_MPS = 1 / 0.44704;

export function fly30Equivalent(flyTime: number, distance: FlyingDistance) {
  return flyTime * (30 / distance);
}

export function predict100mFromFly(flyTime: number, distance: FlyingDistance = 30) {
  return (10 / 3) * fly30Equivalent(flyTime, distance) + ACCELERATION_PENALTY;
}

export function topSpeed(flyTime: number, distance: FlyingDistance = 30) {
  const ms = distance / flyTime;
  return {ms, kmh: ms * 3.6, mph: ms * MPH_PER_MPS};
}

/** Accepts comma decimals and a typographic minus, like the app's input parser. */
export function parseDecimalInput(input: string): number | null {
  let s = input.trim().replace(/[−–—]/g, '-').replace(/[\s ]/g, '');
  if (!s) return null;
  if (s.startsWith('+')) s = s.slice(1);
  if ((s.match(/[.,]/g) ?? []).length > 1) return null;
  const n = Number(s.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}
