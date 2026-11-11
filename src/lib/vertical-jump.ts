// Vertical jump formulas and norms shared by the calculator and its page.
export type Unit = 'in' | 'cm';
export type Sex = 'm' | 'w';

export const G = 9.81;
export const CM_PER_IN = 2.54;

// General adult vertical jump ratings, lower bounds in inches.
export const VERTICAL_NORMS: {rating: string; m: number; w: number}[] = [
  {rating: 'Excellent', m: 28, w: 24},
  {rating: 'Very good', m: 24, w: 20},
  {rating: 'Above average', m: 20, w: 16},
  {rating: 'Average', m: 16, w: 12},
  {rating: 'Below average', m: 12, w: 8},
  {rating: 'Poor', m: 0, w: 0},
];

export function flightTimeHeightCm(flightMs: number) {
  const t = flightMs / 1000;
  return ((G * t * t) / 8) * 100;
}

export function verticalRating(cm: number, sex: Sex) {
  const inches = cm / CM_PER_IN;
  return VERTICAL_NORMS.find((n) => inches >= n[sex])?.rating ?? 'Poor';
}

export function rsiRating(rsi: number) {
  if (rsi < 1.5) return 'Low';
  if (rsi < 2) return 'Average';
  if (rsi < 2.5) return 'Good';
  if (rsi < 3) return 'Very good';
  return 'Excellent';
}

// Sayers et al. (1999): peak power in watts from jump height (cm) and body mass (kg).
export function sayersPeakPower(cm: number, kg: number) {
  return 60.7 * cm + 45.3 * kg - 2055;
}

