export type CheckoutMode = "sign-up" | "sign-in"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function normalizeCheckoutEmail(value: unknown): string | null {
  if (typeof value !== "string") return null
  const email = value.trim().toLowerCase()
  return email.length <= 254 && EMAIL_REGEX.test(email) ? email : null
}

export function normalizeCheckoutPassword(value: unknown): string | null {
  if (typeof value !== "string") return null
  return value.length >= 8 && value.length <= 128 ? value : null
}

export function normalizeCheckoutMode(value: unknown): CheckoutMode {
  return value === "sign-in" ? "sign-in" : "sign-up"
}

export function checkoutEmailRedirectUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  const siteUrl = configuredUrl || "https://mytrackspeed.com"
  return new URL("/subscribe?verified=1", siteUrl).toString()
}
