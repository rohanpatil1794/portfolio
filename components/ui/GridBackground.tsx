"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const GRID_LINE = "rgba(240,240,245,0.035)";

const orbOneClass = cn(
  "absolute top-[15%] left-[8%] h-[360px] w-[360px] rounded-full blur-3xl"
);
const orbOneStyle = {
  background: "var(--accent)",
  opacity: 0.08,
} as const;

const orbTwoClass = cn(
  "absolute top-[45%] right-[-4%] h-[320px] w-[320px] rounded-full blur-3xl"
);
const orbTwoStyle = {
  background: "#4a5fd0",
  opacity: 0.06,
} as const;

const orbOneAnimate = {
  x: [0, 48, -32, 0],
  y: [0, -36, 28, 0],
};
const orbOneTransition = {
  duration: 22,
  repeat: Infinity,
  repeatType: "mirror" as const,
  ease: "easeInOut" as const,
};

const orbTwoAnimate = {
  x: [0, -56, 24, 0],
  y: [0, 32, -40, 0],
};
const orbTwoTransition = {
  duration: 26,
  repeat: Infinity,
  repeatType: "mirror" as const,
  ease: "easeInOut" as const,
};

export default function GridBackground() {
  const reducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Layer 1: faint grid, masked so it fades before the section edges */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, ${GRID_LINE} 1px, transparent 1px), linear-gradient(to bottom, ${GRID_LINE} 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 75% 65% at 50% 40%, black 35%, transparent 95%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 65% at 50% 40%, black 35%, transparent 95%)",
        }}
      />

      {/* Layer 2: radial accent glow near top-center */}
      <div
        className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "var(--accent)", opacity: 0.12 }}
      />

      {/* Layer 3: slow-drifting orbs (static when prefers-reduced-motion) */}
      {reducedMotion ? (
        <>
          <div className={orbOneClass} style={orbOneStyle} />
          <div className={orbTwoClass} style={orbTwoStyle} />
        </>
      ) : (
        <>
          <motion.div
            className={orbOneClass}
            style={orbOneStyle}
            animate={orbOneAnimate}
            transition={orbOneTransition}
          />
          <motion.div
            className={orbTwoClass}
            style={orbTwoStyle}
            animate={orbTwoAnimate}
            transition={orbTwoTransition}
          />
        </>
      )}

      {/* Layer 4: vignette fading everything toward the edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 35%, transparent 50%, var(--background) 100%)",
        }}
      />
    </div>
  );
}
