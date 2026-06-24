import type { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description: "Writing on software, ML, and building things.",
};

export default function BlogPage() {
  const posts = getPosts();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight mb-2">Blog</h1>
      <p className="text-[var(--muted-foreground)] mb-12">
        Writing on software, ML, and building things.
      </p>

      {posts.length === 0 ? (
        <p className="text-[var(--muted-foreground)]">No posts yet — check back soon.</p>
      ) : (
        <div className="divide-y divide-[var(--border)]">
          {posts.map((post) => (
            <article key={post.slug} className="py-8 group">
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-xl font-semibold group-hover:text-[var(--accent)] transition-colors mb-1">
                  {post.title}
                </h2>
              </Link>
              <p className="text-sm text-[var(--muted-foreground)] mb-2">
                {formatDate(post.date)}
              </p>
              <p className="text-[var(--muted-foreground)]">{post.description}</p>
              {post.tags && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-xs font-mono bg-[var(--muted)] text-[var(--muted-foreground)] px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
