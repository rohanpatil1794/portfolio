"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, ArrowUpRight, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { cn, formatDate } from "@/lib/utils";

export type FeaturedProject = {
  slug: string;
  title: string;
  description: string;
  stack: string[];
  github?: string;
  live?: string;
  featured?: boolean;
  date: string;
};

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

function CardAction({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  // Sits above the card's stretched link (z-10) so it stays a real anchor
  // with native middle-click / copy-link behavior.
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="relative z-10 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
    >
      {children}
    </a>
  );
}

export default function FeaturedProjects({
  projects,
}: {
  projects: FeaturedProject[];
}) {
  const reduceMotion = useReducedMotion();

  const item: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <div className="mb-12 flex items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-mono text-[var(--accent)] tracking-widest uppercase">
            Selected work
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Featured Projects
          </h2>
        </div>
        <Link
          href="/projects"
          className="group inline-flex shrink-0 items-center gap-1.5 pb-1 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:text-[var(--accent)]"
        >
          View all
          <ArrowRight
            size={16}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((project, index) => (
          <motion.div
            key={project.slug}
            variants={item}
            className={cn("h-full", index === 0 && "lg:col-span-2")}
          >
            <div
              className={cn(
                "group relative flex h-full flex-col gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6",
                "transition-all duration-200 hover:-translate-y-1 hover:border-[var(--accent)]/40 hover:bg-[var(--card-hover)]"
              )}
            >
              {/* Stretched link: makes the whole card clickable without nesting
                  the action anchors inside it. */}
              <Link
                href={`/projects/${project.slug}`}
                aria-label={`View ${project.title}`}
                className="absolute inset-0 rounded-xl"
              />
              <div className="flex items-start justify-between gap-4">
                <span className="text-xs font-mono text-[var(--muted-foreground)]">
                  {formatDate(project.date)}
                </span>
                <div className="flex shrink-0 items-center gap-3">
                  {project.github && (
                    <CardAction
                      href={project.github}
                      label={`View ${project.title} on GitHub`}
                    >
                      <GithubIcon size={16} />
                    </CardAction>
                  )}
                  {project.live && (
                    <CardAction
                      href={project.live}
                      label={`Open live demo of ${project.title}`}
                    >
                      <ExternalLink size={16} />
                    </CardAction>
                  )}
                </div>
              </div>

              <div>
                <h3 className="inline-flex items-center gap-1.5 text-lg font-semibold text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                  {project.title}
                  <ArrowUpRight
                    size={16}
                    className="-translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                  />
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)] line-clamp-3">
                  {project.description}
                </p>
              </div>

              <div className="mt-auto flex flex-wrap gap-2 pt-2">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md bg-[var(--muted)] px-2.5 py-0.5 text-xs font-mono text-[var(--muted-foreground)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
