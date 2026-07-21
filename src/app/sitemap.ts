import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog-posts";
import { locales } from "@/i18n/routing";

const baseUrl = "https://mytrackspeed.com";

type SitemapPage = {
  path: string;
  lastModified: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
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
    lastModified: "2026-07-16",
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    path: "/about",
    lastModified: "2026-07-16",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: "/technology",
    lastModified: "2026-07-16",
    changeFrequency: "monthly",
    priority: 0.85,
  },
  {
    path: "/support",
    lastModified: "2026-07-16",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: "/blog",
    lastModified: "2026-07-16",
    changeFrequency: "weekly",
    priority: 0.8,
  },
];

const localizedEntries: MetadataRoute.Sitemap = localizedPages.flatMap((page) =>
  locales.map((locale) => ({
    url: localizedUrl(page.path, locale),
    lastModified: page.lastModified,
    changeFrequency: page.changeFrequency,
    priority:
      locale === "en"
        ? page.priority
        : Math.round(page.priority * 0.9 * 100) / 100,
    alternates: localeAlternates(page.path),
  })),
);

const englishOnlyPages: SitemapPage[] = [
  {
    path: "/pro",
    lastModified: "2026-07-16",
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    path: "/influencer/apply",
    lastModified: "2026-07-16",
    changeFrequency: "monthly",
    priority: 0.55,
  },
  {
    path: "/feedback",
    lastModified: "2026-02-14",
    changeFrequency: "weekly",
    priority: 0.5,
  },
  {
    path: "/privacy",
    lastModified: "2026-06-25",
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    path: "/terms",
    lastModified: "2026-06-25",
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    path: "/delete-account",
    lastModified: "2026-02-28",
    changeFrequency: "yearly",
    priority: 0.2,
  },
];

const englishOnlyEntries: MetadataRoute.Sitemap = englishOnlyPages.map((page) => ({
  url: `${baseUrl}${page.path}`,
  lastModified: page.lastModified,
  changeFrequency: page.changeFrequency,
  priority: page.priority,
}));

const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
  url: `${baseUrl}/blog/${post.slug}`,
  lastModified: post.lastModified,
  changeFrequency: "monthly",
  priority: 0.65,
}));

export default function sitemap(): MetadataRoute.Sitemap {
  return [...localizedEntries, ...englishOnlyEntries, ...blogEntries];
}
