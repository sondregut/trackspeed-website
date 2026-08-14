import assert from "node:assert/strict";
import test from "node:test";

import {
  parsePromoCodeCreateInput,
  promoCodeRedemptionReadiness,
} from "../src/lib/promo-code-contract.ts";

const now = new Date("2026-07-28T12:00:00.000Z");

test("normalizes a new free code into an immediately redeemable row", () => {
  const parsed = parsePromoCodeCreateInput(
    {
      code: "  curtis2  ",
      type: "free",
      duration_days: 365,
      max_uses: 1,
      expires_at: null,
      note: "  Individual access  ",
    },
    now
  );

  assert.deepEqual(parsed, {
    ok: true,
    value: {
      code: "CURTIS2",
      type: "free",
      duration_days: 365,
      max_uses: 1,
      expires_at: null,
      note: "Individual access",
      is_active: true,
      current_uses: 0,
    },
  });

  if (!parsed.ok) assert.fail(parsed.error);
  assert.deepEqual(promoCodeRedemptionReadiness(parsed.value, now), {
    ready: true,
    grants_pro_immediately: true,
    message: "Ready to redeem. Pro activates immediately for 365 days.",
  });
});

test("supports free Pro forever when duration is blank", () => {
  const parsed = parsePromoCodeCreateInput(
    {
      code: "FOREVER26",
      type: "free",
      duration_days: null,
      max_uses: null,
      expires_at: null,
      note: null,
    },
    now
  );

  assert.equal(parsed.ok, true);
  if (!parsed.ok) assert.fail(parsed.error);
  assert.equal(
    promoCodeRedemptionReadiness(parsed.value, now).message,
    "Ready to redeem. Pro activates immediately forever."
  );
});

test("rejects configurations that would be unusable when created", () => {
  const cases = [
    {
      input: {
        code: "BAD-CODE",
        type: "free",
        duration_days: 30,
        max_uses: 1,
        expires_at: null,
      },
      error: "Code must be alphanumeric",
    },
    {
      input: {
        code: "ZERO",
        type: "free",
        duration_days: 0,
        max_uses: 1,
        expires_at: null,
      },
      error: "duration_days must be a positive integer or null",
    },
    {
      input: {
        code: "PAST",
        type: "free",
        duration_days: 30,
        max_uses: 1,
        expires_at: "2026-07-27",
      },
      error: "expires_at must be in the future",
    },
  ];

  for (const testCase of cases) {
    const parsed = parsePromoCodeCreateInput(testCase.input, now);
    assert.deepEqual(parsed, { ok: false, error: testCase.error });
  }
});

test("reports exhausted or inactive rows as not redeemable", () => {
  assert.equal(
    promoCodeRedemptionReadiness(
      {
        type: "free",
        duration_days: 30,
        max_uses: 1,
        current_uses: 1,
        expires_at: null,
        is_active: true,
      },
      now
    ).ready,
    false
  );

  assert.equal(
    promoCodeRedemptionReadiness(
      {
        type: "free",
        duration_days: 30,
        max_uses: 1,
        current_uses: 0,
        expires_at: null,
        is_active: false,
      },
      now
    ).ready,
    false
  );
});

test("keeps trial codes distinct from instant Pro grants", () => {
  const readiness = promoCodeRedemptionReadiness(
    {
      type: "trial",
      duration_days: null,
      max_uses: 10,
      current_uses: 0,
      expires_at: null,
      is_active: true,
    },
    now
  );

  assert.equal(readiness.ready, true);
  assert.equal(readiness.grants_pro_immediately, false);
  assert.match(readiness.message, /App Store offer/);
});

test("accepts a one-use discount paywall code without granting Pro", () => {
  const parsed = parsePromoCodeCreateInput(
    {
      code: "FIRST33",
      type: "discount",
      duration_days: null,
      max_uses: 1,
      expires_at: "2026-10-31T23:59:59.000Z",
      note: "Early customer",
    },
    now
  );

  assert.equal(parsed.ok, true);
  if (!parsed.ok) assert.fail(parsed.error);
  const readiness = promoCodeRedemptionReadiness(parsed.value, now);
  assert.equal(readiness.ready, true);
  assert.equal(readiness.grants_pro_immediately, false);
  assert.match(readiness.message, /lower-priced App Store paywall/);
});

test("rejects duration on offer-only code types", () => {
  for (const type of ["trial", "discount"]) {
    const parsed = parsePromoCodeCreateInput(
      {
        code: `BAD${type}`,
        type,
        duration_days: 14,
        max_uses: 1,
        expires_at: null,
      },
      now
    );
    assert.deepEqual(parsed, {
      ok: false,
      error: "duration_days only applies to free Pro codes",
    });
  }
});
