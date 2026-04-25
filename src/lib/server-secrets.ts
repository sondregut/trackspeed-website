import { timingSafeEqual } from "node:crypto";

export function requireServerEnv(name: string): string {
  const value = process.env[name];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

export function timingSafeEqualString(actual: string, expected: string): boolean {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  const length = Math.max(actualBuffer.length, expectedBuffer.length, 1);
  const paddedActual = Buffer.alloc(length);
  const paddedExpected = Buffer.alloc(length);

  actualBuffer.copy(paddedActual);
  expectedBuffer.copy(paddedExpected);

  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(paddedActual, paddedExpected)
  );
}
