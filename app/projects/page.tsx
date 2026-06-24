import type { Metadata } from "next";
import { getProjects } from "@/lib/content";
import ProjectCard from "@/components/sections/ProjectCard";

export const metadata: Metadata = {
  title: "Projects",
  description: "A collection of projects I've built.",
};

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight mb-2">Projects</h1>
      <p className="text-[var(--muted-foreground)] mb-12">
        Things I&apos;ve built — from ML systems to full-stack apps.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
