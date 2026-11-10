"use client";

import { memo, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";
import { EventDesignData } from "@/types/invitation";

interface ParticleLayerProps {
  kind: EventDesignData["motion"]["particles"];
  accentColor: string;
  primaryColor: string;
}

const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: ((i * 37 + 11) % 94) + 3,
  delay: (i % 6) * 0.75,
  duration: 6.5 + (i % 5) * 1.4,
  size: 4 + (i % 4) * 2,
  drift: (i % 2 === 0 ? 1 : -1) * (10 + (i % 4) * 5),
}));

export const ParticleLayer = memo(function ParticleLayer({
  kind,
  accentColor,
  primaryColor,
}: ParticleLayerProps) {
  const reduced = useReducedMotion();
  if (kind === "none" || reduced) return null;

  const isConfetti = kind === "confetti";
  const isPetals = kind === "petals";
  const isStarlight = kind === "starlight";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden z-10"
    >
      {PARTICLES.map((p) => {
        const color = isConfetti
          ? p.id % 3 === 0
            ? primaryColor
            : p.id % 3 === 1
              ? accentColor
              : "#F29E74"
          : isStarlight
            ? "#F7E7C4"
            : accentColor;

        const style = {
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
          "--particle-drift": `${p.drift}px`,
          "--particle-duration": `${p.duration}s`,
          "--particle-delay": `${p.delay}s`,
          "--particle-rotate": isConfetti || isPetals ? "360deg" : "0deg",
        } as CSSProperties;

        return (
          <span
            key={p.id}
            style={style}
            className="invitovix-particle absolute -top-4 block"
          />
        );
      })}
    </div>
  );
});

