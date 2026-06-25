const DEFAULT_FROM_EMAIL = 'TrackSpeed <noreply@hello.mytrackspeed.com>'
const SENDER_DOMAIN = 'hello.mytrackspeed.com'

function getEmailAddress(value: string): string {
  const bracketMatch = value.match(/<([^>]+)>/)
  return (bracketMatch?.[1] ?? value).trim().toLowerCase()
}

function usesSenderSubdomain(value: string): boolean {
  return getEmailAddress(value).endsWith(`@${SENDER_DOMAIN}`)
}

export function getFromEmail(value: string | undefined = process.env.FROM_EMAIL): string {
  const configured = value?.trim()
  if (!configured) return DEFAULT_FROM_EMAIL

  return usesSenderSubdomain(configured) ? configured : DEFAULT_FROM_EMAIL
}

export const FROM_EMAIL = getFromEmail()
