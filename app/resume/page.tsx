import type { Metadata } from "next";
import { experience, education, skills } from "@/data/resume";

export const metadata: Metadata = {
  title: "Resume",
  description: "Experience, skills, and education.",
};

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 space-y-16">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Resume</h1>
        <p className="text-[var(--muted-foreground)]">
          My experience, skills, and background.
        </p>
      </div>

      {/* Experience */}
      <section>
        <h2 className="text-xl font-semibold mb-6 text-[var(--foreground)]">Experience</h2>
        <div className="space-y-8">
          {experience.map((job, i) => (
            <div key={i} className="relative pl-6 border-l border-[var(--border)]">
              <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-[var(--accent)]" />
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                <h3 className="font-semibold">{job.title}</h3>
                <span className="text-sm text-[var(--muted-foreground)] font-mono">{job.period}</span>
              </div>
              <p className="text-[var(--accent)] text-sm mb-2">{job.company}</p>
              <p className="text-sm text-[var(--muted-foreground)]">{job.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {job.stack.map((t) => (
                  <span key={t} className="text-xs font-mono bg-[var(--muted)] text-[var(--muted-foreground)] px-2 py-0.5 rounded">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section>
        <h2 className="text-xl font-semibold mb-6">Education</h2>
        <div className="space-y-8">
          {education.map((edu, i) => (
            <div key={i} className="relative pl-6 border-l border-[var(--border)]">
              <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-[var(--border)]" />
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                <h3 className="font-semibold">{edu.degree}</h3>
                <span className="text-sm text-[var(--muted-foreground)] font-mono">{edu.period}</span>
              </div>
              <p className="text-[var(--accent)] text-sm mb-2">{edu.institution}</p>
              <p className="text-sm text-[var(--muted-foreground)]">{edu.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section>
        <h2 className="text-xl font-semibold mb-6">Skills</h2>
        <div className="space-y-5">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category}>
              <p className="text-sm text-[var(--muted-foreground)] mb-2">{category}</p>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-[var(--muted)] px-3 py-1 text-sm font-mono text-[var(--foreground)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
