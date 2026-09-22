import Link from 'next/link';

export default function JumpFooter() {
  return <nav aria-label="TrackJump information" className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 border-t border-[var(--border-light)] px-6 py-8 text-sm text-[var(--text-muted)]">
    <Link href="/jump" className="mr-auto font-semibold text-[var(--text-primary)]">TrackJump · from the TrackSpeed family</Link>
    <Link href="/jump/support">Support</Link><Link href="/jump/privacy">Privacy</Link><Link href="/jump/terms">Terms</Link><Link href="/jump/delete-account">Delete account</Link>
  </nav>;
}
