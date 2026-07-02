"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  Check,
  Code2,
  Copy,
  FileText,
  FolderOpen,
  Home,
  Mail,
  Search,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const EMAIL = "rohanpatil1794@gmail.com";
const GITHUB_URL = "https://github.com/rohanpatil1794";
const LINKEDIN_URL = "https://linkedin.com/in/rohanpatil1794";
const REPO_URL = "https://github.com/rohanpatil1794/portfolio";

interface CommandItem {
  id: string;
  label: string;
  keywords?: string;
  icon: ReactNode;
  perform: () => void;
  closesPalette: boolean;
}

interface CommandGroup {
  heading: string;
  items: CommandItem[];
}

const kbdClass =
  "rounded border border-[var(--border)] bg-[var(--muted)] px-1.5 py-0.5 font-mono text-[10px] leading-none text-[var(--muted-foreground)]";

export default function CommandPalette() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const copyEmail = useCallback(() => {
    navigator.clipboard
      .writeText(EMAIL)
      .then(() => {
        setCopied(true);
        if (copyTimer.current) clearTimeout(copyTimer.current);
        copyTimer.current = setTimeout(() => setCopied(false), 1600);
      })
      .catch(() => {
        /* clipboard unavailable — silently ignore */
      });
  }, []);

  const groups = useMemo<CommandGroup[]>(
    () => [
      {
        heading: "Navigation",
        items: [
          {
            id: "nav-home",
            label: "Home",
            icon: <Home size={16} />,
            perform: () => router.push("/"),
            closesPalette: true,
          },
          {
            id: "nav-projects",
            label: "Projects",
            icon: <FolderOpen size={16} />,
            perform: () => router.push("/projects"),
            closesPalette: true,
          },
          {
            id: "nav-resume",
            label: "Resume",
            icon: <FileText size={16} />,
            perform: () => router.push("/resume"),
            closesPalette: true,
          },
          {
            id: "nav-blog",
            label: "Blog",
            icon: <BookOpen size={16} />,
            perform: () => router.push("/blog"),
            closesPalette: true,
          },
        ],
      },
      {
        heading: "Socials",
        items: [
          {
            id: "social-github",
            label: "GitHub",
            icon: <GithubIcon size={16} />,
            perform: () => window.open(GITHUB_URL, "_blank", "noopener,noreferrer"),
            closesPalette: true,
          },
          {
            id: "social-linkedin",
            label: "LinkedIn",
            icon: <LinkedinIcon size={16} />,
            perform: () => window.open(LINKEDIN_URL, "_blank", "noopener,noreferrer"),
            closesPalette: true,
          },
          {
            id: "social-email",
            label: "Email",
            keywords: "mail contact",
            icon: <Mail size={16} />,
            perform: () => {
              window.location.href = `mailto:${EMAIL}`;
            },
            closesPalette: true,
          },
        ],
      },
      {
        heading: "Actions",
        items: [
          {
            id: "action-copy-email",
            label: copied ? "Copied" : "Copy email address",
            keywords: "copy email address clipboard",
            icon: copied ? (
              <Check size={16} className="text-[var(--accent)]" />
            ) : (
              <Copy size={16} />
            ),
            perform: copyEmail,
            closesPalette: false,
          },
          {
            id: "action-view-source",
            label: "View site source",
            keywords: "github repository code",
            icon: <Code2 size={16} />,
            perform: () => window.open(REPO_URL, "_blank", "noopener,noreferrer"),
            closesPalette: true,
          },
        ],
      },
    ],
    [router, copied, copyEmail]
  );

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          `${item.label} ${item.keywords ?? ""}`.toLowerCase().includes(q)
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [groups, query]);

  const flatItems = useMemo(
    () => filteredGroups.flatMap((group) => group.items),
    [filteredGroups]
  );

  const runItem = useCallback((item: CommandItem) => {
    item.perform();
    if (item.closesPalette) setOpen(false);
  }, []);

  // Global shortcut: Ctrl/Cmd+K toggles, Escape closes. Registered in the
  // capture phase so the palette wins over other global listeners (Terminal).
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        !event.shiftKey &&
        !event.altKey &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        if (!open) lastFocused.current = document.activeElement as HTMLElement | null;
        setOpen(!open);
      } else if (event.key === "Escape" && open) {
        event.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [open]);

  // Lock body scroll while the palette is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Selection follows the query; clamp if the list shrinks.
  useEffect(() => {
    setSelected(0);
  }, [query]);

  useEffect(() => {
    if (selected !== 0 && selected >= flatItems.length) setSelected(0);
  }, [flatItems.length, selected]);

  // Keep the selected row visible while navigating with arrows.
  useEffect(() => {
    if (!open) return;
    const node = listRef.current?.querySelector<HTMLElement>('[data-selected="true"]');
    node?.scrollIntoView({ block: "nearest" });
  }, [open, selected, query]);

  // Clear the pending "Copied" timer on unmount.
  useEffect(() => {
    return () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  // Keep Tab focus cycling inside the dialog while it is open.
  const handleDialogKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const focusables =
      event.currentTarget.querySelectorAll<HTMLElement>("input, button");
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const handleInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (flatItems.length > 0) {
        setSelected((prev) => (prev + 1) % flatItems.length);
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (flatItems.length > 0) {
        setSelected((prev) => (prev - 1 + flatItems.length) % flatItems.length);
      }
    } else if (event.key === "Enter") {
      event.preventDefault();
      const item = flatItems[selected];
      if (item) runItem(item);
    }
  };

  let rowIndex = -1;

  return (
    <>
      <AnimatePresence
        onExitComplete={() => {
          setQuery("");
          setSelected(0);
          lastFocused.current?.focus?.();
          lastFocused.current = null;
        }}
      >
        {open && (
          <div
            key="command-palette"
            className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[15vh]"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" as const }}
              className="absolute inset-0 bg-[var(--background)]/70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.96, y: -12 }
              }
              animate={
                prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }
              }
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.96, y: -12 }
              }
              transition={{ duration: 0.18, ease: "easeOut" as const }}
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              onKeyDown={handleDialogKeyDown}
              className="relative w-full max-w-lg overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl shadow-black/50"
            >
              <div className="flex items-center gap-3 border-b border-[var(--border)] px-4">
                <Search
                  size={16}
                  className="shrink-0 text-[var(--muted-foreground)]"
                  aria-hidden="true"
                />
                <input
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Type a command or search…"
                  aria-label="Search commands"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls="command-palette-list"
                  aria-activedescendant={
                    flatItems[selected] ? `cmd-${flatItems[selected].id}` : undefined
                  }
                  autoComplete="off"
                  spellCheck={false}
                  className="w-full bg-transparent py-3.5 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
                />
                <kbd className={cn(kbdClass, "hidden shrink-0 sm:block")}>Esc</kbd>
              </div>

              <div
                ref={listRef}
                id="command-palette-list"
                role="listbox"
                aria-label="Commands"
                className="max-h-[min(24rem,55vh)] overflow-y-auto p-2"
              >
                {flatItems.length === 0 ? (
                  <p className="px-3 py-10 text-center text-sm text-[var(--muted-foreground)]">
                    No matching commands.
                  </p>
                ) : (
                  filteredGroups.map((group) => (
                    <div key={group.heading}>
                      <p className="px-3 pb-1.5 pt-3 font-mono text-[10px] uppercase tracking-widest text-[var(--muted-foreground)]">
                        {group.heading}
                      </p>
                      {group.items.map((item) => {
                        rowIndex += 1;
                        const itemIndex = rowIndex;
                        const isSelected = itemIndex === selected;
                        return (
                          <button
                            key={item.id}
                            id={`cmd-${item.id}`}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            data-selected={isSelected}
                            onClick={() => runItem(item)}
                            onMouseEnter={() => setSelected(itemIndex)}
                            className={cn(
                              "relative flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors",
                              isSelected
                                ? "bg-[var(--card-hover)] text-[var(--foreground)]"
                                : "text-[var(--muted-foreground)]"
                            )}
                          >
                            {isSelected && (
                              <span
                                className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-[var(--accent)]"
                                aria-hidden="true"
                              />
                            )}
                            <span
                              className={cn(
                                "flex shrink-0 items-center justify-center",
                                isSelected
                                  ? "text-[var(--accent)]"
                                  : "text-[var(--muted-foreground)]"
                              )}
                              aria-hidden="true"
                            >
                              {item.icon}
                            </span>
                            <span className="flex-1 truncate">{item.label}</span>
                            {isSelected && (
                              <kbd className={cn(kbdClass, "shrink-0")}>Enter</kbd>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {!open && (
        <button
          type="button"
          onClick={() => {
            lastFocused.current = document.activeElement as HTMLElement | null;
            setOpen(true);
          }}
          aria-label="Open command palette (Ctrl+K)"
          className="fixed bottom-6 right-6 z-40 hidden items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--card)]/80 px-3 py-2 backdrop-blur-md transition-colors hover:border-[var(--accent)]/60 hover:bg-[var(--card-hover)] md:inline-flex"
        >
          <kbd className={kbdClass}>Ctrl</kbd>
          <kbd className={kbdClass}>K</kbd>
        </button>
      )}
    </>
  );
}
