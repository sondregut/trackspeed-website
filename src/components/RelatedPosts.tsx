import {Link} from "@/i18n/navigation";
import { blogPosts } from "@/lib/blog-posts";

interface RelatedPostsProps {
  currentSlug: string;
  t: (key: string) => string;
  tHas: (key: string) => boolean;
  locale: string;
}

export default function RelatedPosts({ currentSlug, t, tHas, locale }: RelatedPostsProps) {
  const currentPost = blogPosts.find((p) => p.slug === currentSlug);
  if (!currentPost?.relatedSlugs?.length) return null;

  const relatedPosts = currentPost.relatedSlugs
    .map((slug) => blogPosts.find((p) => p.slug === slug))
    .filter(Boolean);

  if (relatedPosts.length === 0) return null;

  return (
    <section className="mt-16 pt-10" style={{ borderTop: "1px solid var(--border-light)" }}>
      <h2
        className="text-xl font-bold mb-6"
        style={{ color: "var(--text-primary)" }}
      >
        {t("relatedPosts")}
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {relatedPosts.map((post) => (
          <Link
            key={post!.slug}
            href={`/blog/${post!.slug}`}
            className="card-feature rounded-xl p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(92, 141, 184, 0.1)",
                  color: "#5C8DB8",
                }}
              >
                {post!.category}
              </span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {post!.readTime}
              </span>
            </div>
            <h3
              className="text-base font-semibold mb-1"
              style={{ color: "var(--text-primary)" }}
            >
              {tHas(`posts.${post!.slug}.title`) ? t(`posts.${post!.slug}.title`) : post!.title}
            </h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {tHas(`posts.${post!.slug}.excerpt`) ? t(`posts.${post!.slug}.excerpt`) : post!.excerpt}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
