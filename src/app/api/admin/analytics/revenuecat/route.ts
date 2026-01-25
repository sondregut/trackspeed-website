import { NextResponse } from 'next/server'

interface RevenueCatOverview {
  activeSubscribers: number
  activeTrials: number
  mrr: number
  revenue30d: number
  error?: string
}

export async function GET() {
  const apiKey = process.env.REVENUECAT_API_KEY

  if (!apiKey) {
    return NextResponse.json({
      activeSubscribers: 0,
      activeTrials: 0,
      mrr: 0,
      revenue30d: 0,
      error: 'RevenueCat API key not configured',
    } satisfies RevenueCatOverview)
  }

  try {
    // RevenueCat API v1 - Overview endpoint
    // https://www.revenuecat.com/docs/api-v1
    const response = await fetch(
      'https://api.revenuecat.com/v1/developers/me/overview',
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        // Cache for 5 minutes
        next: { revalidate: 300 },
      }
    )

    if (!response.ok) {
      // Try alternative endpoint - projects overview
      const projectsResponse = await fetch(
        'https://api.revenuecat.com/v1/projects',
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!projectsResponse.ok) {
        throw new Error(`RevenueCat API error: ${response.status}`)
      }

      // If we can at least connect, return placeholder data
      // RevenueCat's REST API has limited metrics access
      return NextResponse.json({
        activeSubscribers: 0,
        activeTrials: 0,
        mrr: 0,
        revenue30d: 0,
        error: 'Limited API access - check RevenueCat dashboard for full metrics',
      } satisfies RevenueCatOverview)
    }

    const data = await response.json()

    return NextResponse.json({
      activeSubscribers: data.active_subscribers || 0,
      activeTrials: data.active_trials || 0,
      mrr: data.mrr || 0,
      revenue30d: data.revenue?.last_30_days || 0,
    } satisfies RevenueCatOverview)
  } catch (error) {
    console.error('RevenueCat API error:', error)
    return NextResponse.json({
      activeSubscribers: 0,
      activeTrials: 0,
      mrr: 0,
      revenue30d: 0,
      error: error instanceof Error ? error.message : 'Failed to fetch RevenueCat data',
    } satisfies RevenueCatOverview)
  }
}
