"use client";

import { cn } from "@/lib/utils";

function MarqueeRow({
  items,
  reverse = false,
}: {
  items: string[];
  reverse?: boolean;
}) {
  return (
    <div className="marquee-row">
      <div
        className={cn("animate-marquee", reverse && "animate-marquee-reverse")}
      >
        {/* Sequence rendered twice so translateX(-50%) loops seamlessly. */}
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center gap-3 pr-3">
            {items.map((item) => (
              <span
                key={`${copy}-${item}`}
                className="whitespace-nowrap rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-1.5 text-sm font-mono text-[var(--muted-foreground)]"
              >
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TechMarquee({ items }: { items: string[] }) {
  const reversed = [...items].reverse();

  return (
    <div aria-hidden="true" className="marquee-container space-y-4 py-8">
      <MarqueeRow items={items} />
      <MarqueeRow items={reversed} reverse />
    </div>
  );
}
