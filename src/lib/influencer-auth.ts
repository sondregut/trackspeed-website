import "server-only"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"
import { requireServerEnv } from "@/lib/server-secrets"

export function getInfluencerJwtSecret(): Uint8Array {
  return new TextEncoder().encode(requireServerEnv("INFLUENCER_JWT_SECRET"))
}

// Shared server helper; route modules only export HTTP handlers and route config.
export async function verifyInfluencerToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("influencer_token")?.value
    if (!token) return null
    const { payload } = await jwtVerify(token, getInfluencerJwtSecret())
    return payload.influencerId as string
  } catch {
    return null
  }
}
