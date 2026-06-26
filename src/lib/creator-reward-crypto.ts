import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  timingSafeEqual,
} from 'node:crypto'

const encryptedPrefix = 'enc:v1:'

function normalizedPayoutValue(value: string): string {
  return value.trim().toLowerCase()
}

function encryptionKey(): Buffer | null {
  const secret = process.env.CREATOR_REWARD_ENCRYPTION_KEY
  if (!secret) return null

  const trimmed = secret.trim()
  if (!trimmed) return null

  if (/^[a-f0-9]{64}$/i.test(trimmed)) {
    return Buffer.from(trimmed, 'hex')
  }

  try {
    const decoded = Buffer.from(trimmed, 'base64')
    if (decoded.length === 32) return decoded
  } catch {
    // Fall through to passphrase hashing.
  }

  return createHash('sha256').update(trimmed).digest()
}

export function isCreatorRewardEncryptionConfigured(): boolean {
  return encryptionKey() !== null
}

export function hashPayoutHandle(payoutMethod: string, payoutHandleOrEmail: string): string {
  return createHash('sha256')
    .update(`${payoutMethod.trim().toLowerCase()}:${normalizedPayoutValue(payoutHandleOrEmail)}`)
    .digest('hex')
}

export function encryptPayoutHandle(value: string): string {
  const key = encryptionKey()
  if (!key) {
    throw new Error('CREATOR_REWARD_ENCRYPTION_KEY must be set before storing payout handles')
  }

  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const ciphertext = Buffer.concat([
    cipher.update(value, 'utf8'),
    cipher.final(),
  ])
  const tag = cipher.getAuthTag()

  return `${encryptedPrefix}${Buffer.concat([iv, tag, ciphertext]).toString('base64url')}`
}

export function decryptPayoutHandle(value: string): string {
  if (!value.startsWith(encryptedPrefix)) return value

  const key = encryptionKey()
  if (!key) return '[encrypted payout handle]'

  try {
    const payload = Buffer.from(value.slice(encryptedPrefix.length), 'base64url')
    const iv = payload.subarray(0, 12)
    const tag = payload.subarray(12, 28)
    const ciphertext = payload.subarray(28)
    const decipher = createDecipheriv('aes-256-gcm', key, iv)
    decipher.setAuthTag(tag)
    return Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]).toString('utf8')
  } catch {
    return '[invalid encrypted payout handle]'
  }
}

export function constantTimeClaimIdMatch(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a)
  const bBuffer = Buffer.from(b)

  if (aBuffer.length !== bBuffer.length) return false
  return timingSafeEqual(aBuffer, bBuffer)
}
