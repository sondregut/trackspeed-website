import test from "node:test"
import assert from "node:assert/strict"
import {
  checkoutEmailRedirectUrl,
  normalizeCheckoutEmail,
  normalizeCheckoutMode,
  normalizeCheckoutPassword,
} from "../src/lib/checkout-security.ts"

test("checkout email normalization rejects malformed and oversized addresses", () => {
  assert.equal(normalizeCheckoutEmail(" Athlete@Example.COM "), "athlete@example.com")
  assert.equal(normalizeCheckoutEmail("missing-at.example.com"), null)
  assert.equal(normalizeCheckoutEmail(`${"a".repeat(250)}@example.com`), null)
})

test("checkout passwords have bounded server-side length", () => {
  assert.equal(normalizeCheckoutPassword("1234567"), null)
  assert.equal(normalizeCheckoutPassword("correct horse battery staple"), "correct horse battery staple")
  assert.equal(normalizeCheckoutPassword("x".repeat(129)), null)
})

test("unknown checkout modes fail closed to sign-up", () => {
  assert.equal(normalizeCheckoutMode("sign-in"), "sign-in")
  assert.equal(normalizeCheckoutMode("admin"), "sign-up")
})

test("email confirmation returns only to the configured TrackSpeed site", () => {
  const prior = process.env.NEXT_PUBLIC_SITE_URL
  process.env.NEXT_PUBLIC_SITE_URL = "https://preview.mytrackspeed.com/base"
  assert.equal(checkoutEmailRedirectUrl(), "https://preview.mytrackspeed.com/subscribe?verified=1")
  if (prior === undefined) delete process.env.NEXT_PUBLIC_SITE_URL
  else process.env.NEXT_PUBLIC_SITE_URL = prior
})
