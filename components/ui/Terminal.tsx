"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type LineKind = "input" | "output" | "error";

interface Line {
  id: number;
  text: string;
  kind: LineKind;
}

const PROJECT_SLUGS = [
  "personal-ai-assistant",
  "sales-ai-agent",
  "medical-chatbot",
];

const VALID_ROUTES = new Set<string>([
  "/",
  "/projects",
  "/resume",
  "/blog",
  ...PROJECT_SLUGS.map((slug) => `/projects/${slug}`),
]);

const HELP_LINES = [
  "Available commands:",
  "  help           list commands",
  "  whoami         who is this?",
  "  projects       list project routes",
  "  open <path>    navigate to a route",
  "  socials        links & contact",
  "  clear          clear the screen",
  "  exit           close the terminal",
];

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

function normalizePath(raw: string): string {
  let path = raw.toLowerCase();
  if (!path.startsWith("/")) path = `/${path}`;
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  return path;
}

export default function Terminal() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<Line[]>([
    {
      id: 0,
      text: "Welcome to the portfolio shell. Type 'help' to get started.",
      kind: "output",
    },
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const nextId = useRef(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const pushLines = (items: Array<{ text: string; kind: LineKind }>) => {
    const stamped = items.map((item) => ({ ...item, id: nextId.current++ }));
    setLines((prev) => [...prev, ...stamped]);
  };

  // Global shortcut: Ctrl+` toggles, Escape closes.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.ctrlKey &&
        !event.altKey &&
        !event.metaKey &&
        event.code === "Backquote"
      ) {
        if (isEditableTarget(event.target)) return;
        event.preventDefault();
        setOpen((prev) => !prev);
      } else if (event.key === "Escape" && open) {
        // The command palette (capture-phase listener) claims Escape first.
        if (event.defaultPrevented) return;
        event.preventDefault();
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Focus the prompt when the terminal opens.
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  // Keep the output pinned to the bottom.
  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, open]);

  const runCommand = (raw: string) => {
    const trimmed = raw.trim();
    pushLines([{ text: `❯ ${trimmed}`, kind: "input" }]);
    if (!trimmed) return;

    setHistory((prev) =>
      prev[prev.length - 1] === trimmed ? prev : [...prev, trimmed]
    );
    setHistoryIndex(-1);

    const [cmd, ...args] = trimmed.split(/\s+/);
    const name = cmd.toLowerCase();

    switch (name) {
      case "help":
        pushLines(HELP_LINES.map((text) => ({ text, kind: "output" })));
        break;

      case "whoami":
        pushLines([
          {
            text: "Rohan Patil — software engineer & ML enthusiast building intelligent systems and polished products.",
            kind: "output",
          },
        ]);
        break;

      case "projects":
        pushLines(
          PROJECT_SLUGS.map((slug) => ({
            text: `/projects/${slug}`,
            kind: "output" as const,
          }))
        );
        break;

      case "open": {
        if (args.length === 0) {
          pushLines([{ text: "usage: open <path>", kind: "error" }]);
          break;
        }
        const path = normalizePath(args[0]);
        if (VALID_ROUTES.has(path)) {
          pushLines([{ text: `opening ${path} ...`, kind: "output" }]);
          router.push(path);
        } else {
          pushLines([{ text: `open: no such route: ${path}`, kind: "error" }]);
        }
        break;
      }

      case "socials":
        pushLines([
          { text: "github    https://github.com/rohanpatil1794", kind: "output" },
          { text: "linkedin  https://linkedin.com/in/rohanpatil1794", kind: "output" },
          { text: "email     rohanpatil1794@gmail.com", kind: "output" },
        ]);
        break;

      case "clear":
        setLines([]);
        break;

      case "exit":
        setOpen(false);
        break;

      default:
        pushLines([
          {
            text: `command not found: ${name} — try 'help'`,
            kind: "error",
          },
        ]);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runCommand(input);
    setInput("");
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (history.length === 0) return;
      const next =
        historyIndex === -1
          ? history.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setInput(history[next]);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex === -1) return;
      const next = historyIndex + 1;
      if (next >= history.length) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        setHistoryIndex(next);
        setInput(history[next]);
      }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
          transition={{ duration: 0.2, ease: "easeOut" as const }}
          role="dialog"
          aria-label="Portfolio terminal"
          className="fixed bottom-6 right-6 z-[95] flex h-[300px] w-[420px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[#0c0c11] font-mono text-sm shadow-2xl md:bottom-20"
        >
          <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#a85751]" aria-hidden="true" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#a8944f]" aria-hidden="true" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#578a5c]" aria-hidden="true" />
            <span className="ml-2 text-xs text-[var(--muted-foreground)]">
              rohan@portfolio:~
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close terminal"
              className="ml-auto rounded p-1 text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
            >
              <X size={14} />
            </button>
          </div>

          <div
            ref={outputRef}
            onClick={() => inputRef.current?.focus()}
            className="flex-1 space-y-1 overflow-y-auto px-4 py-3"
          >
            {lines.map((line) => (
              <p
                key={line.id}
                className={cn(
                  "whitespace-pre-wrap break-words leading-relaxed",
                  line.kind === "input" && "text-[var(--foreground)]",
                  line.kind === "output" && "text-[var(--muted-foreground)]",
                  line.kind === "error" && "text-[#d98a8a]"
                )}
              >
                {line.text}
              </p>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-[var(--border)] px-4 py-2.5"
          >
            <span className="text-[var(--accent)]" aria-hidden="true">
              {"❯"}
            </span>
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleInputKeyDown}
              autoFocus
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              aria-label="Terminal command input"
              className="flex-1 bg-transparent text-[var(--foreground)] caret-[var(--accent)] outline-none placeholder:text-[var(--muted-foreground)]/40"
              placeholder="type a command"
            />
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
