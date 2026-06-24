import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getProject, getProjects } from "@/lib/content";
import { formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: project.title, description: project.description };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-10"
      >
        <ArrowLeft size={14} /> Back to projects
      </Link>

      <h1 className="text-4xl font-bold tracking-tight mb-3">{project.title}</h1>
      <p className="text-[var(--muted-foreground)] mb-6">{project.description}</p>

      <div className="flex flex-wrap items-center gap-4 mb-8">
        {project.github && (
          <Link
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            <GithubIcon size={15} /> GitHub
          </Link>
        )}
        {project.live && (
          <Link
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            <ExternalLink size={15} /> Live Demo
          </Link>
        )}
        <span className="text-sm text-[var(--muted-foreground)]">
          {formatDate(project.date)}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="rounded-md bg-[var(--muted)] px-2.5 py-0.5 text-xs font-mono text-[var(--muted-foreground)]"
          >
            {tech}
          </span>
        ))}
      </div>

      <article className="prose prose-invert max-w-none prose-headings:font-semibold prose-a:text-[var(--accent)] prose-code:text-[var(--accent)] prose-pre:bg-[var(--muted)]">
        <MDXRemote source={project.content} />
      </article>
    </div>
  );
}
