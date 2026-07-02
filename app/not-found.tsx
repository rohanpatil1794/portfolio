"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="grid min-h-[70vh] place-items-center px-6">
      <div className="flex flex-col items-center gap-6 text-center">
        <motion.h1
          animate={
            reduceMotion
              ? undefined
              : { opacity: [1, 1, 0.86, 1, 1, 0.93, 1] }
          }
          transition={{
            duration: 6,
            times: [0, 0.42, 0.45, 0.48, 0.86, 0.89, 0.92],
            repeat: Infinity,
            ease: "linear" as const,
          }}
          className="text-8xl md:text-9xl font-bold tracking-tight text-[var(--foreground)]"
          style={{
            textShadow:
              "0 0 32px rgba(124, 109, 250, 0.25), 1px 0 0 rgba(124, 109, 250, 0.12)",
          }}
        >
          404
        </motion.h1>

        <p className="font-mono text-sm text-[var(--muted-foreground)]">
          This page drifted into the void.
        </p>

        <Link
          href="/"
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 font-mono text-sm text-[var(--muted-foreground)] transition-colors hover:border-[var(--accent)] hover:text-[var(--foreground)]"
        >
          <span className="text-[var(--accent)]" aria-hidden="true">
            {"❯ "}
          </span>
          cd ~
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Go home
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            View projects <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
