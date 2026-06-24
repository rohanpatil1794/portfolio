"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/content";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={cn(
        "group rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 flex flex-col gap-4",
        "hover:border-[var(--accent)]/40 hover:bg-[var(--card-hover)] transition-all duration-200"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href={`/projects/${project.slug}`}
            className="text-lg font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
          >
            {project.title}
          </Link>
          <p className="mt-1 text-sm text-[var(--muted-foreground)] line-clamp-2">
            {project.description}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {project.github && (
            <Link
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              aria-label="GitHub"
            >
              <GithubIcon size={16} />
            </Link>
          )}
          {project.live && (
            <Link
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              aria-label="Live demo"
            >
              <ExternalLink size={16} />
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-auto">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="rounded-md bg-[var(--muted)] px-2.5 py-0.5 text-xs font-mono text-[var(--muted-foreground)]"
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
