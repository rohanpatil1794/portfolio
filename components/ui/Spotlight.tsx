"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const SPOTLIGHT_SIZE = 600;

export default function Spotlight() {
  const [enabled, setEnabled] = useState(false);

  const x = useMotionValue(-SPOTLIGHT_SIZE);
  const y = useMotionValue(-SPOTLIGHT_SIZE);

  const springX = useSpring(x, { stiffness: 150, damping: 30 });
  const springY = useSpring(y, { stiffness: 150, damping: 30 });

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!finePointer.matches || reducedMotion.matches) return;

    setEnabled(true);

    const handleMouseMove = (event: MouseEvent) => {
      x.set(event.clientX - SPOTLIGHT_SIZE / 2);
      y.set(event.clientY - SPOTLIGHT_SIZE / 2);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <motion.div
        className="absolute left-0 top-0 h-[600px] w-[600px] rounded-full"
        style={{
          x: springX,
          y: springY,
          background:
            "radial-gradient(circle closest-side, rgba(124, 109, 250, 0.07), transparent)",
        }}
      />
    </div>
  );
}
