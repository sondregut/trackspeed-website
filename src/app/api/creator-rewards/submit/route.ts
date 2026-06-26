import { randomUUID } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { enforceRateLimit } from '@/lib/rate-limit'
import { getSupabaseAdmin } from '@/lib/supabase'
import {
  encryptPayoutHandle,
  hashPayoutHandle,
} from '@/lib/creator-reward-crypto'
import {
  activeClaimStatuses,
  isActiveSubscription,
  isPayoutMethodAllowed,
  normalizeCountry,
  normalizeEmail,
  payoutMethods,
  socialPlatforms,
  validateSocialPostUrl,
} from '@/lib/creator-reward-rules.mjs'

export const runtime = 'nodejs'

const screenshotBucket = 'creator-reward-screenshots'
const maxScreenshotBytes = 5 * 1024 * 1024
const allowedScreenshotTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
const subscriptionSelect = `
  app_user_id,
  status,
  product_id,
  price_cents,
  currency,
  original_purchase_at,
  expires_at,
  grace_period_expires_at,
  store,
  entitlement_id,
  original_transaction_id
`

interface CreatorRewardPayload {
  email: string
  account?: string
  revenuecat_app_user_id?: string
  username?: string
  phone_number?: string
  social_platform: string
  post_url: string
  payout_method: string
  payout_handle_or_email: string
  country: string
  submitted_view_count?: string | null
  screenshot?: File | null
}

interface SubscriptionRecord {
  app_user_id: string
  status: string | null
  product_id: string | null
  price_cents: number | null
  currency: string | null
  original_purchase_at: string | null
  expires_at: string | null
  grace_period_expires_at: string | null
  store: string | null
  entitlement_id: string | null
  original_transaction_id: string | null
}

interface ProfileLookupRecord {
  supabase_user_id: string | null
  full_name: string | null
  email: string | null
}

interface EmailStateLookupRecord {
  user_id: string | null
  email: string | null
}

interface SubscriptionEventRecord {
  app_user_id: string
  event_type: string
  product_id: string | null
  price_cents: number | null
  currency: string | null
  purchased_at: string
  store: string | null
  entitlement_id: string | null
  original_transaction_id: string | null
  transaction_id: string | null
}

function getString(formData: FormData, key: keyof CreatorRewardPayload): string {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

async function readPayload(request: NextRequest): Promise<CreatorRewardPayload> {
  const contentType = request.headers.get('content-type') ?? ''

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData()
    const screenshot = formData.get('screenshot')

    return {
      email: getString(formData, 'email'),
      account: getString(formData, 'account'),
      revenuecat_app_user_id: getString(formData, 'revenuecat_app_user_id'),
      username: getString(formData, 'username'),
      phone_number: getString(formData, 'phone_number'),
      social_platform: getString(formData, 'social_platform'),
      post_url: getString(formData, 'post_url'),
      payout_method: getString(formData, 'payout_method'),
      payout_handle_or_email: getString(formData, 'payout_handle_or_email'),
      country: getString(formData, 'country'),
      submitted_view_count: getString(formData, 'submitted_view_count'),
      screenshot: screenshot instanceof File && screenshot.size > 0 ? screenshot : null,
    }
  }

  const body = await request.json()
  return {
    email: typeof body.email === 'string' ? body.email : '',
    account: typeof body.account === 'string' ? body.account : '',
    revenuecat_app_user_id:
      typeof body.revenuecat_app_user_id === 'string' ? body.revenuecat_app_user_id : '',
    username: typeof body.username === 'string' ? body.username : '',
    phone_number: typeof body.phone_number === 'string' ? body.phone_number : '',
    social_platform: typeof body.social_platform === 'string' ? body.social_platform : '',
    post_url: typeof body.post_url === 'string' ? body.post_url : '',
    payout_method: typeof body.payout_method === 'string' ? body.payout_method : '',
    payout_handle_or_email:
      typeof body.payout_handle_or_email === 'string' ? body.payout_handle_or_email : '',
    country: typeof body.country === 'string' ? body.country : '',
    submitted_view_count:
      typeof body.submitted_view_count === 'string' ||
      typeof body.submitted_view_count === 'number'
        ? String(body.submitted_view_count)
        : null,
    screenshot: null,
  }
}

function generateClaimId(): string {
  return `cr_${randomUUID().replace(/-/g, '').slice(0, 14)}`
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

function parseOptionalViewCount(value?: string | null): number | null {
  if (!value) return null
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error('Submitted view count must be a non-negative whole number.')
  }
  return parsed
}

function normalizeOptionalText(value: string | undefined, maxLength: number): string | null {
  const normalized = (value ?? '').trim()
  if (!normalized) return null
  if (normalized.length > maxLength) {
    throw new Error(`Keep this field under ${maxLength} characters.`)
  }
  return normalized
}

function priceFromCents(cents: number): number {
  return Math.round(cents) / 100
}

async function findAuthUserId(appUserId: string): Promise<string | null> {
  if (!isUuid(appUserId)) return null

  const { data, error } = await getSupabaseAdmin().auth.admin.getUserById(appUserId)
  if (error || !data.user) return null
  return data.user.id
}

async function uploadScreenshot(claimId: string, screenshot: File | null): Promise<string | null> {
  if (!screenshot) return null

  if (!allowedScreenshotTypes.has(screenshot.type)) {
    throw new Error('Screenshot must be a JPEG, PNG, or WebP image.')
  }

  if (screenshot.size > maxScreenshotBytes) {
    throw new Error('Screenshot must be 5 MB or smaller.')
  }

  const extension = screenshot.type === 'image/png'
    ? 'png'
    : screenshot.type === 'image/webp'
      ? 'webp'
      : 'jpg'
  const path = `${claimId}/${randomUUID()}.${extension}`
  const { error } = await getSupabaseAdmin()
    .storage
    .from(screenshotBucket)
    .upload(path, screenshot, {
      contentType: screenshot.type,
      upsert: false,
    })

  if (error) {
    console.error('Failed to upload creator reward screenshot:', error)
    throw new Error('Could not upload screenshot. Try again without the file.')
  }

  return path
}

async function findSubscriptionByAppUserId(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  appUserId: string
): Promise<SubscriptionRecord | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select(subscriptionSelect)
    .eq('app_user_id', appUserId)
    .maybeSingle<SubscriptionRecord>()

  if (error) {
    console.error('Creator reward subscription lookup failed:', error)
    throw new Error('Could not verify purchase.')
  }

  return data
}

async function findProfileAppUserIdsByEmail(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  email: string
): Promise<string[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('supabase_user_id, full_name, email')
    .ilike('email', email)
    .limit(10)

  if (error) {
    console.error('Creator reward profile email lookup failed:', error)
    throw new Error('Could not match that email to a Track Speed account.')
  }

  const profiles = (data ?? []) as ProfileLookupRecord[]
  const appUserIds = new Set(
    profiles
      .map((profile) => profile.supabase_user_id)
      .filter((id): id is string => !!id)
  )

  const { data: emailStates, error: emailStateError } = await supabase
    .from('user_email_state')
    .select('user_id, email')
    .ilike('email', email)
    .limit(10)

  if (emailStateError) {
    console.error('Creator reward email state lookup failed:', emailStateError)
    throw new Error('Could not match that email to a Track Speed account.')
  }

  for (const row of (emailStates ?? []) as EmailStateLookupRecord[]) {
    if (row.user_id) appUserIds.add(row.user_id)
  }

  return [...appUserIds]
}

async function findSubscriptionByEmail(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  email: string
): Promise<SubscriptionRecord | null> {
  const appUserIds = await findProfileAppUserIdsByEmail(supabase, email)
  if (appUserIds.length === 0) return null

  const { data, error } = await supabase
    .from('subscriptions')
    .select(subscriptionSelect)
    .in('app_user_id', appUserIds)

  if (error) {
    console.error('Creator reward email subscription lookup failed:', error)
    throw new Error('Could not verify purchase.')
  }

  const subscriptions = ((data ?? []) as SubscriptionRecord[]).sort((a, b) => {
    const aTime = a.original_purchase_at ? new Date(a.original_purchase_at).getTime() : 0
    const bTime = b.original_purchase_at ? new Date(b.original_purchase_at).getTime() : 0
    return bTime - aTime
  })

  return (
    subscriptions.find((subscription) => subscription.store === 'APP_STORE' && isActiveSubscription(subscription)) ??
    subscriptions.find((subscription) => isActiveSubscription(subscription)) ??
    subscriptions[0] ??
    null
  )
}

export async function POST(request: NextRequest) {
  let payload: CreatorRewardPayload

  try {
    payload = await readPayload(request)
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const email = normalizeEmail(payload.email)
  const providedAppUserId = (payload.account ?? payload.revenuecat_app_user_id ?? '').trim()
  const socialPlatform = payload.social_platform.trim().toLowerCase()
  const payoutMethod = payload.payout_method.trim().toLowerCase()
  const payoutHandle = payload.payout_handle_or_email.trim()
  const country = normalizeCountry(payload.country)
  let username: string | null
  let phoneNumber: string | null

  try {
    username = normalizeOptionalText(payload.username, 120)
    phoneNumber = normalizeOptionalText(payload.phone_number, 40)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Invalid contact details.' },
      { status: 400 }
    )
  }

  const rateLimitResponse = await enforceRateLimit(request, {
    scope: 'creator-reward-submit',
    limit: 4,
    windowSeconds: 60 * 60,
    identifier: email || providedAppUserId || phoneNumber || 'anonymous',
  })
  if (rateLimitResponse) return rateLimitResponse

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 })
  }

  if (providedAppUserId.length > 200) {
    return NextResponse.json({ error: 'Could not verify this Track Speed account. Open the reward page from the app and try again.' }, { status: 400 })
  }

  if (!socialPlatforms.includes(socialPlatform)) {
    return NextResponse.json({ error: 'Choose TikTok or Instagram.' }, { status: 400 })
  }

  const postUrlValidation = validateSocialPostUrl(socialPlatform, payload.post_url.trim())
  if (!postUrlValidation.valid) {
    return NextResponse.json({ error: postUrlValidation.error }, { status: 400 })
  }

  if (!payoutMethods.includes(payoutMethod)) {
    return NextResponse.json({ error: 'Choose PayPal, Venmo, or Cash App.' }, { status: 400 })
  }

  if (!country) {
    return NextResponse.json({ error: 'Enter your country.' }, { status: 400 })
  }

  if (!isPayoutMethodAllowed(country, payoutMethod)) {
    return NextResponse.json(
      { error: 'Venmo and Cash App rewards are only available for US users. Choose PayPal instead.' },
      { status: 400 }
    )
  }

  if (!payoutHandle || payoutHandle.length > 320) {
    return NextResponse.json({ error: 'Enter your payout handle or email.' }, { status: 400 })
  }

  let submittedViewCount: number | null
  try {
    submittedViewCount = parseOptionalViewCount(payload.submitted_view_count)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Invalid view count.' },
      { status: 400 }
    )
  }

  const supabase = getSupabaseAdmin()
  let subscription: SubscriptionRecord | null

  try {
    subscription = providedAppUserId
      ? await findSubscriptionByAppUserId(supabase, providedAppUserId)
      : await findSubscriptionByEmail(supabase, email)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not verify purchase.' },
      { status: 500 }
    )
  }

  if (!subscription) {
    return NextResponse.json(
      { error: 'No Track Speed purchase record was found for that email yet. Use the email on your Track Speed account, or open this page from the app after purchase.' },
      { status: 404 }
    )
  }

  const appUserId = subscription.app_user_id

  if (subscription.store && subscription.store !== 'APP_STORE') {
    return NextResponse.json(
      { error: 'Creator rewards are currently only available for iOS App Store purchases.' },
      { status: 422 }
    )
  }

  if (!isActiveSubscription(subscription)) {
    return NextResponse.json(
      { error: 'Your subscription must be active or still in its paid access period.' },
      { status: 422 }
    )
  }

  const { data: latestPaidEvent, error: eventError } = await supabase
    .from('subscription_events')
    .select(`
      app_user_id,
      event_type,
      product_id,
      price_cents,
      currency,
      purchased_at,
      store,
      entitlement_id,
      original_transaction_id,
      transaction_id
    `)
    .eq('app_user_id', appUserId)
    .in('event_type', ['INITIAL_PURCHASE', 'TRIAL_CONVERTED', 'RENEWAL'])
    .gt('price_cents', 0)
    .order('purchased_at', { ascending: false })
    .limit(1)
    .maybeSingle<SubscriptionEventRecord>()

  if (eventError) {
    console.error('Creator reward subscription event lookup failed:', eventError)
    return NextResponse.json({ error: 'Could not verify purchase amount.' }, { status: 500 })
  }

  const priceCents = latestPaidEvent?.price_cents ?? subscription.price_cents
  if (!priceCents || priceCents <= 0) {
    return NextResponse.json(
      { error: 'No paid purchase amount was found for this subscription.' },
      { status: 422 }
    )
  }

  const originalTransactionId =
    latestPaidEvent?.original_transaction_id ?? subscription.original_transaction_id
  const productId = latestPaidEvent?.product_id ?? subscription.product_id
  const entitlementId =
    latestPaidEvent?.entitlement_id ??
    subscription.entitlement_id ??
    process.env.REVENUECAT_ENTITLEMENT_ID ??
    'Track Speed Pro'
  const purchaseCurrency = latestPaidEvent?.currency ?? subscription.currency ?? 'USD'

  if (!productId) {
    return NextResponse.json(
      { error: 'No product ID was found for this purchase.' },
      { status: 422 }
    )
  }

  const { data: existingAppUserClaim, error: existingAppUserError } = await supabase
    .from('creator_reward_submissions')
    .select('claim_id, status')
    .eq('revenuecat_app_user_id', appUserId)
    .in('status', activeClaimStatuses)
    .limit(1)
    .maybeSingle()

  if (existingAppUserError) {
    console.error('Creator reward duplicate app user lookup failed:', existingAppUserError)
    return NextResponse.json({ error: 'Could not check existing claims.' }, { status: 500 })
  }

  if (existingAppUserClaim) {
    return NextResponse.json(
      {
        error: 'A creator reward claim already exists for this Track Speed account.',
        claim_id: existingAppUserClaim.claim_id,
        status: existingAppUserClaim.status,
      },
      { status: 409 }
    )
  }

  if (originalTransactionId) {
    const { data: existingTransactionClaim, error: existingTransactionError } = await supabase
      .from('creator_reward_submissions')
      .select('claim_id, status')
      .eq('revenuecat_original_transaction_id', originalTransactionId)
      .in('status', activeClaimStatuses)
      .limit(1)
      .maybeSingle()

    if (existingTransactionError) {
      console.error('Creator reward duplicate transaction lookup failed:', existingTransactionError)
      return NextResponse.json({ error: 'Could not check existing claims.' }, { status: 500 })
    }

    if (existingTransactionClaim) {
      return NextResponse.json(
        {
          error: 'A creator reward claim already exists for this App Store transaction.',
          claim_id: existingTransactionClaim.claim_id,
          status: existingTransactionClaim.status,
        },
        { status: 409 }
      )
    }
  }

  const payoutHandleHash = hashPayoutHandle(payoutMethod, payoutHandle)
  const { data: existingPayoutClaim, error: existingPayoutError } = await supabase
    .from('creator_reward_submissions')
    .select('claim_id, status')
    .eq('payout_handle_hash', payoutHandleHash)
    .in('status', activeClaimStatuses)
    .limit(1)
    .maybeSingle()

  if (existingPayoutError) {
    console.error('Creator reward duplicate payout lookup failed:', existingPayoutError)
    return NextResponse.json({ error: 'Could not check payout details.' }, { status: 500 })
  }

  if (existingPayoutClaim) {
    return NextResponse.json(
      {
        error: 'That payout handle is already tied to an active creator reward claim.',
        claim_id: existingPayoutClaim.claim_id,
        status: existingPayoutClaim.status,
      },
      { status: 409 }
    )
  }

  const claimId = generateClaimId()
  let screenshotUrl: string | null = null
  try {
    screenshotUrl = await uploadScreenshot(claimId, payload.screenshot ?? null)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not upload screenshot.' },
      { status: 400 }
    )
  }

  const userId = await findAuthUserId(appUserId)
  const { data: createdClaim, error: insertError } = await supabase
    .from('creator_reward_submissions')
    .insert({
      user_id: userId,
      email,
      username,
      phone_number: phoneNumber,
      revenuecat_app_user_id: appUserId,
      revenuecat_product_id: productId,
      revenuecat_original_transaction_id: originalTransactionId,
      purchase_price: priceFromCents(priceCents),
      purchase_currency: purchaseCurrency,
      entitlement_id: entitlementId,
      social_platform: socialPlatform,
      post_url: postUrlValidation.normalizedUrl,
      submitted_view_count: submittedViewCount,
      screenshot_url: screenshotUrl,
      country,
      payout_method: payoutMethod,
      payout_handle_or_email: encryptPayoutHandle(payoutHandle),
      payout_handle_hash: payoutHandleHash,
      claim_id: claimId,
      status: 'pending',
    })
    .select('claim_id, status')
    .single()

  if (insertError) {
    console.error('Creator reward insert failed:', insertError)
    return NextResponse.json({ error: 'Could not create claim.' }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    claim_id: createdClaim.claim_id,
    status: createdClaim.status,
  })
}
