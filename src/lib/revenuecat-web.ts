import "server-only"

export type ProCheckoutPlan = "annual" | "weekly"

const PLAN_ENV: Record<
  ProCheckoutPlan,
  { link: string; packageId: string }
> = {
  annual: {
    link: "REVENUECAT_WEB_PURCHASE_LINK_ANNUAL",
    packageId: "REVENUECAT_WEB_PACKAGE_ID_ANNUAL",
  },
  weekly: {
    link: "REVENUECAT_WEB_PURCHASE_LINK_WEEKLY",
    packageId: "REVENUECAT_WEB_PACKAGE_ID_WEEKLY",
  },
}

function isPlaceholderValue(value: string): boolean {
  return value.includes("your-") || value.includes("...")
}

export function normalizeProCheckoutPlan(value: unknown): ProCheckoutPlan {
  return value === "weekly" ? "weekly" : "annual"
}

export function getRevenueCatWebCheckoutConfigIssues(plan: ProCheckoutPlan): string[] {
  const env = PLAN_ENV[plan]
  const issues: string[] = []
  const purchaseLink = process.env[env.link]?.trim()
  const packageId = process.env[env.packageId]?.trim()

  if (!purchaseLink || isPlaceholderValue(purchaseLink)) {
    issues.push(env.link)
  } else {
    try {
      new URL(purchaseLink.replaceAll("{app_user_id}", "app_user_id"))
    } catch {
      issues.push(env.link)
    }
  }

  if (!packageId || isPlaceholderValue(packageId)) {
    issues.push(env.packageId)
  }

  return issues
}

function appendAppUserId(baseUrl: string, appUserId: string): string {
  const encodedAppUserId = encodeURIComponent(appUserId)

  if (baseUrl.includes("{app_user_id}")) {
    return baseUrl.replaceAll("{app_user_id}", encodedAppUserId)
  }

  const url = new URL(baseUrl)
  url.pathname = `${url.pathname.replace(/\/+$/, "")}/${encodedAppUserId}`
  return url.toString()
}

export function buildRevenueCatWebPurchaseUrl({
  plan,
  appUserId,
  email,
}: {
  plan: ProCheckoutPlan
  appUserId: string
  email: string
}): string {
  const issues = getRevenueCatWebCheckoutConfigIssues(plan)
  if (issues.length > 0) {
    throw new Error(`RevenueCat web checkout is not configured: ${issues.join(", ")}`)
  }

  const env = PLAN_ENV[plan]
  const purchaseLink = process.env[env.link]!.trim()

  const url = new URL(appendAppUserId(purchaseLink, appUserId))
  const packageId = process.env[env.packageId]!.trim()

  url.searchParams.set("email", email)
  url.searchParams.set("skip_purchase_success", "true")
  url.searchParams.set("hide_back_button", "true")

  if (packageId) {
    url.searchParams.set("package_id", packageId)
  }

  return url.toString()
}
