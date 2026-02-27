import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from "@/i18n/navigation";
import { blogPosts } from "@/lib/blog-posts";
import AppleIcon from "@/components/icons/AppleIcon";

export default async function BlogPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'blog'});

  return (
    <div className="bg-hero min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            {t('title')}
          </h1>
          <p className="text-lg" style={{ color: "var(--text-muted)" }}>
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="card-feature rounded-xl p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{
                      background: "rgba(92, 141, 184, 0.1)",
                      color: "#5C8DB8",
                    }}
                  >
                    {post.category}
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {post.readTime}
                  </span>
                </div>
                <h2
                  className="text-lg font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {t.has(`posts.${post.slug}.title`) ? t(`posts.${post.slug}.title`) : post.title}
                </h2>
                <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>
                  {t.has(`posts.${post.slug}.excerpt`) ? t(`posts.${post.slug}.excerpt`) : post.excerpt}
                </p>
                <time
                  className="text-xs"
                  style={{ color: "var(--text-muted)" }}
                  dateTime={post.date}
                >
                  {new Date(post.date).toLocaleDateString(locale, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card-feature rounded-xl p-8 md:p-12">
            <h2
              className="text-2xl font-bold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              {t('cta.title')}
            </h2>
            <p className="text-body mb-6">
              {t('cta.description')}
            </p>
            <a
              href="https://apps.apple.com/app/trackspeed/id6757509163"
              className="btn-primary inline-flex items-center gap-3"
            >
              <AppleIcon className="w-5 h-5" />
              {t('cta.download')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
