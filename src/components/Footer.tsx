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
