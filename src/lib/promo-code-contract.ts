export type PromoCodeType = "free" | "trial" | "discount";

export interface PromoCodeCreateRecord {
  code: string;
  type: PromoCodeType;
  duration_days: number | null;
  max_uses: number | null;
  expires_at: string | null;
  note: string | null;
  is_active: true;
  current_uses: 0;
}

export type PromoCodeCreateParseResult =
  | { ok: true; value: PromoCodeCreateRecord }
  | { ok: false; error: string };

interface PersistedPromoCode {
  type: string;
  duration_days: number | null;
  max_uses: number | null;
  current_uses: number;
  expires_at: string | null;
  is_active: boolean;
}

export interface PromoCodeRedemptionReadiness {
  ready: boolean;
  grants_pro_immediately: boolean;
  message: string;
}

const allowedCodeTypes = new Set<PromoCodeType>(["free", "trial", "discount"]);

function positiveIntegerOrNull(
  value: unknown,
  fieldName: string
): number | null | string {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
    return `${fieldName} must be a positive integer or null`;
  }
  return value;
}

function futureIsoDateOrNull(
  value: unknown,
  now: Date
): string | null | { error: string } {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string") {
    return { error: "expires_at must be an ISO date string or null" };
  }

  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) {
    return { error: "expires_at must be a valid date" };
  }
  if (timestamp <= now.getTime()) {
    return { error: "expires_at must be in the future" };
  }

  return value;
}

export function parsePromoCodeCreateInput(
  input: unknown,
  now: Date = new Date()
): PromoCodeCreateParseResult {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return { ok: false, error: "Invalid request" };
  }

  const body = input as Record<string, unknown>;
  if (typeof body.code !== "string" || typeof body.type !== "string") {
    return { ok: false, error: "Missing required fields" };
  }

  const normalizedCode = body.code.toUpperCase().trim();
  if (!normalizedCode) {
    return { ok: false, error: "Missing required fields" };
  }
  if (!/^[A-Z0-9]+$/.test(normalizedCode)) {
    return { ok: false, error: "Code must be alphanumeric" };
  }
  if (normalizedCode.length > 64) {
    return { ok: false, error: "Code must be 64 characters or fewer" };
  }
  if (!allowedCodeTypes.has(body.type as PromoCodeType)) {
    return { ok: false, error: "Invalid code type" };
  }

  const durationDays = positiveIntegerOrNull(
    body.duration_days,
    "duration_days"
  );
  if (typeof durationDays === "string") {
    return { ok: false, error: durationDays };
  }
  if (body.type !== "free" && durationDays !== null) {
    return {
      ok: false,
      error: "duration_days only applies to free Pro codes",
    };
  }

  const maxUses = positiveIntegerOrNull(body.max_uses, "max_uses");
  if (typeof maxUses === "string") {
    return { ok: false, error: maxUses };
  }

  const expiresAt = futureIsoDateOrNull(body.expires_at, now);
  if (expiresAt !== null && typeof expiresAt === "object") {
    return { ok: false, error: expiresAt.error };
  }

  return {
    ok: true,
    value: {
      code: normalizedCode,
      type: body.type as PromoCodeType,
      duration_days: durationDays,
      max_uses: maxUses,
      expires_at: expiresAt,
      note:
        typeof body.note === "string" && body.note.trim()
          ? body.note.trim()
          : null,
      is_active: true,
      current_uses: 0,
    },
  };
}

export function promoCodeRedemptionReadiness(
  code: PersistedPromoCode,
  now: Date = new Date()
): PromoCodeRedemptionReadiness {
  const grantsProImmediately = code.type === "free";

  if (
    code.type !== "free" &&
    code.type !== "trial" &&
    code.type !== "discount"
  ) {
    return {
      ready: false,
      grants_pro_immediately: false,
      message: "The saved code type is not supported by the app.",
    };
  }
  if (!code.is_active) {
    return {
      ready: false,
      grants_pro_immediately: grantsProImmediately,
      message: "The saved code is inactive.",
    };
  }
  if (
    code.expires_at !== null &&
    Date.parse(code.expires_at) <= now.getTime()
  ) {
    return {
      ready: false,
      grants_pro_immediately: grantsProImmediately,
      message: "The saved code has already expired.",
    };
  }
  if (
    code.max_uses !== null &&
    code.current_uses >= code.max_uses
  ) {
    return {
      ready: false,
      grants_pro_immediately: grantsProImmediately,
      message: "The saved code has no redemptions remaining.",
    };
  }

  if (grantsProImmediately) {
    const duration =
      code.duration_days === null
        ? "forever"
        : `for ${code.duration_days} days`;
    return {
      ready: true,
      grants_pro_immediately: true,
      message: `Ready to redeem. Pro activates immediately ${duration}.`,
    };
  }

  if (code.type === "discount") {
    return {
      ready: true,
      grants_pro_immediately: false,
      message:
        "Ready to redeem once a compatible iOS build and the discount-code migration are live. The code unlocks the lower-priced App Store paywall.",
    };
  }

  return {
    ready: true,
    grants_pro_immediately: false,
    message:
      "Ready to redeem as a trial code. The App Store offer completes access.",
  };
}
