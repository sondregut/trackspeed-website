import { Link } from "@/i18n/navigation";
import { blogPosts } from "@/lib/blog-posts";

const dateFormatter = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

export function ArticleByline({ slug }: { slug: string }) {
  const post = blogPosts.find((candidate) => candidate.slug === slug);

  if (!post) {
    return null;
  }

  const published = dateFormatter.format(new Date(`${post.date}T00:00:00Z`));
  const modified = dateFormatter.format(new Date(`${post.lastModified}T00:00:00Z`));

  return (
    <p className="mb-6 text-sm font-medium" style={{ color: "var(--text-muted)" }}>
      By{" "}
      <Link href="/about" rel="author" className="underline decoration-current/35 underline-offset-4 hover:decoration-current">
        Sondre Guttormsen
      </Link>
      <span aria-hidden="true"> · </span>
      <time dateTime={post.date}>Published {published}</time>
      {post.lastModified !== post.date && (
        <>
          <span aria-hidden="true"> · </span>
          <time dateTime={post.lastModified}>Updated {modified}</time>
        </>
      )}
    </p>
  );
}
