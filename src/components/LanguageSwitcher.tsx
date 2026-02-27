"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, localeNames, type Locale } from "@/i18n/routing";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("common.nav");

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const nextLocale = e.target.value as Locale;
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <div className="relative inline-flex items-center">
      <Globe className="w-4 h-4 text-muted absolute left-2 pointer-events-none" />
      <select
        value={locale}
        onChange={onChange}
        aria-label={t("language")}
        className="appearance-none bg-transparent text-sm font-medium text-muted pl-7 pr-6 py-1.5 rounded-lg border border-transparent hover:border-[var(--border-light)] cursor-pointer transition-colors focus:outline-none focus:ring-1 focus:ring-[#5C8DB8]"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {localeNames[loc]}
          </option>
        ))}
      </select>
      <svg className="w-3 h-3 text-muted absolute right-1.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}
