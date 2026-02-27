import NextLink from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import AppleIcon from "@/components/icons/AppleIcon";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("common");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-bg-mint">
      <Separator />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-5 gap-8">
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
              <span className="text-lg font-bold text-foreground">TrackSpeed</span>
            </Link>
            <p className="text-sm max-w-xs text-muted">
              {t("footer.tagline")}
            </p>

            {/* App Store download */}
            <a
              href="https://apps.apple.com/app/trackspeed"
              className="inline-flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-lg mt-4 hover:bg-[#1a1a1a] transition-colors"
            >
              <AppleIcon className="w-5 h-5" />
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] opacity-80">{t("nav.downloadOnThe")}</span>
                <span className="text-sm font-semibold -mt-0.5">{t("nav.appStore")}</span>
              </div>
            </a>

            <div className="flex items-center gap-4 mt-4">
              <a
                href="https://x.com/trackspeedapp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted transition-opacity hover:opacity-70"
                aria-label="X (Twitter)"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/mytrackspeed"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted transition-opacity hover:opacity-70"
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
                className="text-muted transition-opacity hover:opacity-70"
                aria-label="TikTok"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.7a8.16 8.16 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.13z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">{t("footer.product")}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#features" className="text-muted transition-colors hover:opacity-70">
                  {t("nav.features")}
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-muted transition-colors hover:opacity-70">
                  {t("nav.howItWorks")}
                </Link>
              </li>
              <li>
                <Link href="/technology" className="text-muted transition-colors hover:opacity-70">
                  {t("nav.technology")}
                </Link>
              </li>
              <li>
                <a
                  href="https://apps.apple.com/app/trackspeed"
                  className="text-muted transition-colors hover:opacity-70"
                >
                  {t("footer.download")}
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">{t("footer.resources")}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/support" className="text-muted transition-colors hover:opacity-70">
                  {t("nav.support")}
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="text-muted transition-colors hover:opacity-70">
                  {t("footer.feedback")}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted transition-colors hover:opacity-70">
                  {t("nav.blog")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted transition-colors hover:opacity-70">
                  {t("nav.about")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">{t("footer.legal")}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-muted transition-colors hover:opacity-70">
                  {t("footer.termsAndConditions")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted transition-colors hover:opacity-70">
                  {t("footer.privacyPolicy")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-border">
          <p className="text-sm text-muted">
            {t("footer.copyright", { year })}
          </p>
          <div className="flex items-center gap-6">
            <p className="text-sm text-text-secondary">
              {t("footer.madeForAthletes")}
            </p>
            <NextLink
              href="/influencer/apply"
              className="text-xs text-muted transition-opacity hover:opacity-70"
            >
              {t("footer.affiliates")}
            </NextLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
