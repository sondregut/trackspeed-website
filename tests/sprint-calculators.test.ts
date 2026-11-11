// The website calculators must give the same answers as the TrackSpeed app.
// Expected values are copied from the app's own unit tests
// (SprintTimerTests/CleanupRegressionTests.swift) and its formula documentation.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {adjustToZeroWind, estimateAtWind, predict100mFromFly, topSpeed, parseDecimalInput} from '../src/lib/sprint-calculators.ts';

const close = (a: number, b: number, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} != ${b}`);

test('wind adjustment matches the app (published Moinat et al. model)', () => {
  close(adjustToZeroWind(12.0, 2.0, '100m'), 12.120416);
  close(adjustToZeroWind(20.0, 2.0, '200m'), 20.14);
});

test('estimate at wind inverts the zero-wind correction, as in the app', () => {
  for (const [t0, w, e] of [[10, 2, '100m'], [12, -2, '100m'], [20, 2, '200m']] as const) {
    close(adjustToZeroWind(estimateAtWind(t0, w, e), w, e), t0);
  }
});

test('flying 30m: top speed and predicted 100m match the app', () => {
  close(predict100mFromFly(3.0, 30), 11.0);
  close(predict100mFromFly(1.0, 10), 11.0); // 1.00 s fly 10 = 10 m/s = 3.00 s fly 30
  const v = topSpeed(3.0, 30);
  close(v.ms, 10);
  close(v.kmh, 36);
  close(v.mph, 22.369362920544023);
});

test('input parsing accepts comma decimals and minus signs like the app', () => {
  assert.equal(parseDecimalInput('10,25'), 10.25);
  assert.equal(parseDecimalInput('+1,2'), 1.2);
  assert.equal(parseDecimalInput('−1,2'), -1.2);
  assert.equal(parseDecimalInput('10,2,5'), null);
});
