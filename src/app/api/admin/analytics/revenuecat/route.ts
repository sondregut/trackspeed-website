import { NextResponse } from 'next/server'

interface RevenueCatOverview {
  activeSubscribers: number | null
  activeTrials: number | null
  mrr: number | null
  revenue30d: number | null
  dashboardUrl: string
}

export async function GET() {
  // RevenueCat's REST API doesn't expose analytics metrics (subscriber counts, MRR, etc.)
  // Those are only available in the RevenueCat Dashboard or Charts API (enterprise plan)
  // Return a link to the dashboard instead
  return NextResponse.json({
    activeSubscribers: null,
    activeTrials: null,
    mrr: null,
    revenue30d: null,
    dashboardUrl: 'https://app.revenuecat.com',
  } satisfies RevenueCatOverview)
}
