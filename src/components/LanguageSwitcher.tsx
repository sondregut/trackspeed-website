"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, localeNames, type Locale } from "@/i18n/routing";
import { GlobeIcon } from "@radix-ui/react-icons";

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
      <GlobeIcon className="w-4 h-4 text-muted absolute start-2 pointer-events-none" aria-hidden="true" />
      <select
        value={locale}
        onChange={onChange}
        aria-label={t("language")}
        className="appearance-none bg-transparent text-sm font-medium text-muted ps-7 pe-6 py-1.5 rounded-lg border border-transparent hover:border-[var(--border-light)] cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5C8DB8]"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {localeNames[loc]}
          </option>
        ))}
      </select>
      <svg className="w-3 h-3 text-muted absolute end-1.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}
