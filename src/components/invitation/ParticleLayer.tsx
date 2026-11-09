"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EventDesignData } from "@/types/invitation";

interface ParticleLayerProps {
  kind: EventDesignData["motion"]["particles"];
  accentColor: string;
  primaryColor: string;
}

const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  left: ((i * 37 + 11) % 94) + 3,
  delay: (i % 6) * 0.7,
  duration: 6 + (i % 5) * 1.4,
  size: 4 + (i % 4) * 2,
  drift: ((i % 2 === 0 ? 1 : -1) * (10 + (i % 4) * 6)),
}));

export function ParticleLayer({
  kind,
  accentColor,
  primaryColor,
}: ParticleLayerProps) {
  const reduced = useReducedMotion();
  if (kind === "none" || reduced) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden z-10"
    >
      {PARTICLES.map((p) => {
        const isConfetti = kind === "confetti";
        const isPetals = kind === "petals";
        const isStarlight = kind === "starlight";

        const color =
          isConfetti
            ? p.id % 3 === 0
              ? primaryColor
              : p.id % 3 === 1
                ? accentColor
                : "#F29E74"
            : isStarlight
              ? "#F7E7C4"
              : accentColor;

        return (
          <motion.span
            key={p.id}
            initial={{ y: -24, x: 0, opacity: 0, rotate: 0 }}
            animate={{
              y: ["0%", "105vh"],
              x: [0, p.drift, -p.drift * 0.5, 0],
              opacity: [0, 0.75, 0.75, 0],
              rotate: isConfetti || isPetals ? [0, 180, 360] : 0,
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              left: `${p.left}%`,
              width: isConfetti ? p.size + 2 : isPetals ? p.size + 4 : p.size,
              height: isConfetti ? p.size - 1 : isPetals ? p.size + 1 : p.size,
              backgroundColor: color,
              borderRadius: isConfetti
                ? "2px"
                : isPetals
                  ? "60% 0 60% 0"
                  : "9999px",
              boxShadow: isStarlight ? `0 0 8px ${color}` : undefined,
            }}
            className="absolute -top-4 block opacity-70"
          />
        );
      })}
    </div>
  );
}

