import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPost, getPosts } from "@/lib/content";
import { formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.description };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-10"
      >
        <ArrowLeft size={14} /> Back to blog
      </Link>

      <h1 className="text-4xl font-bold tracking-tight mb-3">{post.title}</h1>
      <p className="text-sm text-[var(--muted-foreground)] mb-10">{formatDate(post.date)}</p>

      <article className="prose prose-invert max-w-none prose-headings:font-semibold prose-a:text-[var(--accent)] prose-code:text-[var(--accent)] prose-pre:bg-[var(--muted)]">
        <MDXRemote source={post.content} />
      </article>
    </div>
  );
}
