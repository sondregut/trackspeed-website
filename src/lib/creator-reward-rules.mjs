export const creatorRewardStatuses = [
  'pending',
  'needs_more_info',
  'approved_50',
  'approved_100',
  'rejected',
  'paid',
]

export const activeClaimStatuses = [
  'pending',
  'needs_more_info',
  'approved_50',
  'approved_100',
  'paid',
]

export const payoutMethods = ['paypal', 'venmo', 'cashapp']
export const socialPlatforms = ['tiktok', 'instagram']

export function normalizeEmail(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : ''
}

export function normalizeCountry(value) {
  const raw = typeof value === 'string' ? value.trim() : ''
  const lower = raw.toLowerCase()

  if (
    lower === 'us' ||
    lower === 'usa' ||
    lower === 'u.s.' ||
    lower === 'u.s.a.' ||
    lower === 'united states' ||
    lower === 'united states of america'
  ) {
    return 'US'
  }

  return raw.toUpperCase()
}

export function isUnitedStates(value) {
  return normalizeCountry(value) === 'US'
}

export function isPayoutMethodAllowed(country, payoutMethod) {
  if (payoutMethod === 'paypal') return true
  if (payoutMethod === 'venmo' || payoutMethod === 'cashapp') {
    return isUnitedStates(country)
  }
  return false
}

export function validateSocialPostUrl(platform, postUrl) {
  if (!socialPlatforms.includes(platform)) {
    return { valid: false, error: 'Choose TikTok or Instagram.' }
  }

  let url
  try {
    url = new URL(postUrl)
  } catch {
    return { valid: false, error: 'Enter a valid post URL.' }
  }

  if (url.protocol !== 'https:') {
    return { valid: false, error: 'Post URL must use https.' }
  }

  const host = url.hostname.replace(/^www\./, '').toLowerCase()
  if (platform === 'tiktok') {
    const isTikTok =
      host === 'tiktok.com' ||
      host.endsWith('.tiktok.com') ||
      host === 'vm.tiktok.com' ||
      host === 'vt.tiktok.com'

    if (!isTikTok) {
      return { valid: false, error: 'Enter a TikTok post URL.' }
    }
  }

  if (platform === 'instagram') {
    const isInstagram = host === 'instagram.com' || host.endsWith('.instagram.com')
    const isReel = url.pathname.includes('/reel/') || url.pathname.includes('/reels/')

    if (!isInstagram || !isReel) {
      return { valid: false, error: 'Enter an Instagram Reel URL.' }
    }
  }

  return { valid: true, normalizedUrl: url.toString() }
}

export function isActiveSubscription(subscription, now = new Date()) {
  if (!subscription) return false

  const status = subscription.status
  const expiresAt = subscription.expires_at ? new Date(subscription.expires_at) : null
  const gracePeriodExpiresAt = subscription.grace_period_expires_at
    ? new Date(subscription.grace_period_expires_at)
    : null

  if (status === 'active') {
    return !expiresAt || expiresAt > now
  }

  if (status === 'cancelled') {
    return !!expiresAt && expiresAt > now
  }

  if (status === 'billing_issue') {
    return (
      (!!gracePeriodExpiresAt && gracePeriodExpiresAt > now) ||
      (!!expiresAt && expiresAt > now)
    )
  }

  return false
}

export function defaultRewardPercentageForStatus(status) {
  if (status === 'approved_50') return 50
  if (status === 'approved_100') return 100
  return null
}

export function calculateRewardAmount(purchasePrice, rewardPercentage) {
  const price = Number(purchasePrice)
  const percentage = Number(rewardPercentage)

  if (!Number.isFinite(price) || price < 0) {
    throw new Error('Invalid purchase price')
  }

  if (percentage !== 50 && percentage !== 100) {
    throw new Error('Invalid reward percentage')
  }

  const priceCents = Math.round(price * 100)
  const rewardCents = Math.round(priceCents * (percentage / 100))
  return rewardCents / 100
}

export function isDuplicateBlockingStatus(status) {
  return activeClaimStatuses.includes(status)
}
