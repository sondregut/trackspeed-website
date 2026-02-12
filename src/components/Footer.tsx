import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-mint)' }}>
      <Separator />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image
                src="/icon.png"
                alt="TrackSpeed"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>TrackSpeed</span>
            </Link>
            <p className="text-sm max-w-xs" style={{ color: 'var(--text-muted)' }}>
              Professional sprint timing using your iPhone. No extra hardware needed.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <a
                href="https://x.com/trackspeedapp"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-70"
                style={{ color: 'var(--text-muted)' }}
                aria-label="X (Twitter)"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/trackspeedapp"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-70"
                style={{ color: 'var(--text-muted)' }}
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://tiktok.com/@trackspeedapp"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-70"
                style={{ color: 'var(--text-muted)' }}
                aria-label="TikTok"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.7a8.16 8.16 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.13z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#features" className="transition-colors hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
                  Features
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="transition-colors hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
                  How It Works
                </Link>
              </li>
              <li>
                <a
                  href="https://apps.apple.com/app/trackspeed"
                  className="transition-colors hover:opacity-70"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Download
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/support" className="transition-colors hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
                  Support
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="transition-colors hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
                  Feedback
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition-colors hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="transition-colors hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderTop: '1px solid var(--border-light)' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            &copy; {new Date().getFullYear()} TrackSpeed. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Made for athletes, by athletes.
            </p>
            <Link
              href="/influencer/apply"
              className="text-xs transition-opacity hover:opacity-70"
              style={{ color: 'var(--text-muted)' }}
            >
              Affiliates
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
