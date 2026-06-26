declare module '@/lib/creator-reward-rules.mjs' {
  export const creatorRewardStatuses: string[]
  export const activeClaimStatuses: string[]
  export const payoutMethods: string[]
  export const socialPlatforms: string[]

  export function normalizeEmail(value: unknown): string
  export function normalizeCountry(value: unknown): string
  export function isUnitedStates(value: unknown): boolean
  export function isPayoutMethodAllowed(country: unknown, payoutMethod: string): boolean
  export function validateSocialPostUrl(
    platform: string,
    postUrl: string
  ): { valid: true; normalizedUrl: string } | { valid: false; error: string }
  export function isActiveSubscription(
    subscription: {
      status?: string | null
      expires_at?: string | null
      grace_period_expires_at?: string | null
    } | null | undefined,
    now?: Date
  ): boolean
  export function defaultRewardPercentageForStatus(status: string): 50 | 100 | null
  export function calculateRewardAmount(purchasePrice: number | string, rewardPercentage: number): number
  export function isDuplicateBlockingStatus(status: string): boolean
}
