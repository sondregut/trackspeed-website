import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog-posts";
import { locales } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mytrackspeed.com";

  function localeAlternates(path: string) {
    const languages: Record<string, string> = {};
    for (const locale of locales) {
      languages[locale] = locale === "en" ? `${baseUrl}${path}` : `${baseUrl}/${locale}${path}`;
    }
    return { languages };
  }

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: "2026-02-17",
      changeFrequency: "weekly",
      priority: 1,
      alternates: localeAlternates(""),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: "2026-02-17",
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: localeAlternates("/about"),
    },
    {
      url: `${baseUrl}/support`,
      lastModified: "2026-02-14",
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: localeAlternates("/support"),
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: "2026-02-01",
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: localeAlternates("/privacy"),
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: "2026-02-01",
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: localeAlternates("/terms"),
    },
    {
      url: `${baseUrl}/technology`,
      lastModified: "2026-02-17",
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: localeAlternates("/technology"),
    },
    {
      url: `${baseUrl}/feedback`,
      lastModified: "2026-02-14",
      changeFrequency: "weekly",
      priority: 0.6,
      alternates: localeAlternates("/feedback"),
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: "2026-02-17",
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: localeAlternates("/blog"),
    },
  ];

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
    alternates: localeAlternates(`/blog/${post.slug}`),
  }));

  // Generate locale-specific URLs for all pages
  const localePages: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    if (locale === "en") continue; // English uses unprefixed URLs already in staticPages
    const prefix = `${baseUrl}/${locale}`;
    for (const page of staticPages) {
      const path = page.url!.replace(baseUrl, "");
      localePages.push({
        url: `${prefix}${path}`,
        lastModified: page.lastModified,
        changeFrequency: page.changeFrequency,
        priority: Math.round((page.priority ?? 0.5) * 0.9 * 100) / 100,
        alternates: localeAlternates(path),
      });
    }
    for (const entry of blogEntries) {
      const path = entry.url!.replace(baseUrl, "");
      localePages.push({
        url: `${prefix}${path}`,
        lastModified: entry.lastModified,
        changeFrequency: entry.changeFrequency,
        priority: Math.round((entry.priority ?? 0.5) * 0.9 * 100) / 100,
        alternates: localeAlternates(path),
      });
    }
  }

  return [...staticPages, ...blogEntries, ...localePages];
}
