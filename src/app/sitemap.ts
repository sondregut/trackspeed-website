import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog-posts";
import { locales } from "@/i18n/routing";

const baseUrl = "https://mytrackspeed.com";

type SitemapPage = {
  path: string;
  lastModified: string;
};

function localizedUrl(path: string, locale: string) {
  return locale === "en"
    ? `${baseUrl}${path}`
    : `${baseUrl}/${locale}${path}`;
}

function localeAlternates(path: string) {
  const languages = Object.fromEntries(
    locales.map((locale) => [locale, localizedUrl(path, locale)]),
  );

  return {
    languages: {
      ...languages,
      "x-default": `${baseUrl}${path}`,
    },
  };
}

// Only pages whose visible body is genuinely localized receive locale URLs and
// hreflang alternates. English-only pages use one canonical URL below.
const localizedPages: SitemapPage[] = [
  {
    path: "",
    lastModified: "2026-09-06",
  },
  {
    path: "/about",
    lastModified: "2026-09-04",
  },
  {
    path: "/support",
    lastModified: "2026-07-16",
  },
  {
    path: "/blog",
    lastModified: "2026-08-09",
  },
];

const localizedEntries: MetadataRoute.Sitemap = localizedPages.flatMap((page) =>
  locales.map((locale) => ({
    url: localizedUrl(page.path, locale),
    lastModified: page.lastModified,
    alternates: localeAlternates(page.path),
  })),
);

const englishOnlyPages: SitemapPage[] = [
  { path: "/features", lastModified: "2026-09-06" },
  {
    path: "/technology",
    lastModified: "2026-08-09",
  },
  {
    path: "/pro",
    lastModified: "2026-07-16",
  },
  {
    path: "/influencer/apply",
    lastModified: "2026-07-16",
  },
  {
    path: "/feedback",
    lastModified: "2026-02-14",
  },
  {
    path: "/privacy",
    lastModified: "2026-06-25",
  },
  {
    path: "/terms",
    lastModified: "2026-06-25",
  },
  {
    path: "/delete-account",
    lastModified: "2026-02-28",
  },
];

const englishOnlyEntries: MetadataRoute.Sitemap = englishOnlyPages.map((page) => ({
  url: `${baseUrl}${page.path}`,
  lastModified: page.lastModified,
}));

const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
  url: `${baseUrl}/blog/${post.slug}`,
  lastModified: post.lastModified,
}));

export default function sitemap(): MetadataRoute.Sitemap {
  return [...localizedEntries, ...englishOnlyEntries, ...blogEntries];
}
