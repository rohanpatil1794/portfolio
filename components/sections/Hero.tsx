"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24 md:py-36">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <motion.p
          variants={item}
          className="text-sm font-mono text-[var(--accent)] tracking-widest uppercase"
        >
          Hi, I&apos;m
        </motion.p>

        <motion.h1
          variants={item}
          className="text-5xl md:text-7xl font-bold tracking-tight leading-none"
        >
          Rohan Patil
        </motion.h1>

        <motion.p
          variants={item}
          className="text-xl md:text-2xl text-[var(--muted-foreground)] max-w-2xl"
        >
          Software Engineer &amp; ML enthusiast building intelligent systems
          and polished products.
        </motion.p>

        <motion.div variants={item} className="flex flex-wrap items-center gap-4 pt-2">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            View Projects <ArrowRight size={16} />
          </Link>
          <Link
            href="/resume"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Resume
          </Link>
        </motion.div>

        <motion.div variants={item} className="flex items-center gap-5 pt-2">
          <Link
            href="https://github.com/rohanpatil1794"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            <GithubIcon size={20} />
          </Link>
          <Link
            href="https://linkedin.com/in/rohanpatil1794"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            <LinkedinIcon size={20} />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
