import assert from 'node:assert/strict'
import test from 'node:test'
import {
  calculateRewardAmount,
  isActiveSubscription,
  isPayoutMethodAllowed,
  validateSocialPostUrl,
} from '../src/lib/creator-reward-rules.mjs'

test('PayPal is allowed globally and Venmo/Cash App are US-only', () => {
  assert.equal(isPayoutMethodAllowed('Norway', 'paypal'), true)
  assert.equal(isPayoutMethodAllowed('US', 'venmo'), true)
  assert.equal(isPayoutMethodAllowed('United States', 'cashapp'), true)
  assert.equal(isPayoutMethodAllowed('Canada', 'venmo'), false)
  assert.equal(isPayoutMethodAllowed('NO', 'cashapp'), false)
})

test('social URL validation accepts TikTok posts and Instagram Reels only', () => {
  assert.equal(validateSocialPostUrl('tiktok', 'https://www.tiktok.com/@trackspeed/video/123').valid, true)
  assert.equal(validateSocialPostUrl('instagram', 'https://www.instagram.com/reel/abc123/').valid, true)
  assert.equal(validateSocialPostUrl('instagram', 'https://www.instagram.com/p/abc123/').valid, false)
  assert.equal(validateSocialPostUrl('tiktok', 'http://www.tiktok.com/@trackspeed/video/123').valid, false)
})

test('subscription eligibility honors active, cancelled-paid, and grace-period states', () => {
  const now = new Date('2026-05-26T12:00:00Z')

  assert.equal(isActiveSubscription({ status: 'active', expires_at: null }, now), true)
  assert.equal(isActiveSubscription({ status: 'cancelled', expires_at: '2026-05-27T12:00:00Z' }, now), true)
  assert.equal(isActiveSubscription({ status: 'cancelled', expires_at: '2026-05-25T12:00:00Z' }, now), false)
  assert.equal(
    isActiveSubscription({
      status: 'billing_issue',
      expires_at: '2026-05-25T12:00:00Z',
      grace_period_expires_at: '2026-05-27T12:00:00Z',
    }, now),
    true
  )
})

test('reward amount is based on gross purchase price', () => {
  assert.equal(calculateRewardAmount(79.99, 50), 40)
  assert.equal(calculateRewardAmount(79.99, 100), 79.99)
  assert.throws(() => calculateRewardAmount(79.99, 75), /Invalid reward percentage/)
})
