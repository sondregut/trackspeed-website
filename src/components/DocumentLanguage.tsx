"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { locales } from "@/i18n/routing";

/** Root layouts persist during navigation; keep assistive technology and CSS in sync. */
export default function DocumentLanguage() {
  const pathname = usePathname();
  const prefix = pathname.split("/")[1];
  const locale = locales.find((candidate) => candidate === prefix) ?? "en";

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  return null;
}
