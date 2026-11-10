"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { Crown, Flower2, MoonStar, Sparkles } from "lucide-react";
import { EventDesignData } from "@/types/invitation";

interface WaxSealProps {
  waxSeal: EventDesignData["envelope"]["waxSeal"];
  onClick?: () => void;
  isCracking?: boolean;
  size?: "sm" | "lg";
}

export function WaxSeal({
  waxSeal,
  onClick,
  isCracking = false,
  size = "lg",
}: WaxSealProps) {
  const uid = useId();
  const gradId = `waxGrad-${size}-${uid}`;
  const dim = size === "lg" ? "w-26 h-26" : "w-15 h-15";
  const innerDim = size === "lg" ? "w-[74px] h-[74px]" : "w-10 h-10";

  const renderEmblem = () => {
    const iconClass =
      size === "lg" ? "w-5 h-5 opacity-95 drop-shadow-xs" : "w-3.5 h-3.5 opacity-95";
    switch (waxSeal.emblem) {
      case "crown":
        return <Crown className={iconClass} />;
      case "floral":
        return <Flower2 className={iconClass} />;
      case "crescent":
        return <MoonStar className={iconClass} />;
      case "star":
        return <Sparkles className={iconClass} />;
      default:
        return null;
    }
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.07, rotate: -2 }}
      whileTap={{ scale: 0.93 }}
      animate={
        isCracking
          ? { scale: [1, 1.22, 0.35], opacity: [1, 1, 0], rotate: [0, -10, 16] }
          : {
              boxShadow: [
                `0 12px 30px rgba(0,0,0,0.38), 0 0 0 0 ${waxSeal.color}66`,
                `0 16px 36px rgba(0,0,0,0.44), 0 0 0 14px ${waxSeal.color}00`,
              ],
            }
      }
      transition={
        isCracking
          ? { duration: 0.55, ease: "easeOut" }
          : { duration: 2.3, repeat: Infinity, ease: "easeOut" }
      }
      className={`relative ${dim} rounded-full flex items-center justify-center cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300`}
      aria-label="Tap wax seal to open invitation"
    >
      {/* Organic stamped scalloped wax outer silhouette */}
      <svg
        viewBox="0 0 120 120"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full drop-shadow-xl"
      >
        <defs>
          <radialGradient id={gradId} cx="32%" cy="26%" r="72%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.42)" />
            <stop offset="45%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.36)" />
          </radialGradient>
        </defs>
        <path
          d="M60 4 C69 4,76 7,83 11 C91 12,99 18,104 26 C111 32,115 41,115 51 C118 59,117 69,113 78 C113 87,107 95,100 101 C93 109,84 114,74 115 C66 118,55 118,46 115 C36 114,27 109,20 101 C13 95,7 87,7 78 C3 69,2 59,5 51 C5 41,9 32,16 26 C21 18,29 12,37 11 C44 7,51 4,60 4 Z"
          fill={waxSeal.color}
        />
        <path
          d="M60 4 C69 4,76 7,83 11 C91 12,99 18,104 26 C111 32,115 41,115 51 C118 59,117 69,113 78 C113 87,107 95,100 101 C93 109,84 114,74 115 C66 118,55 118,46 115 C36 114,27 109,20 101 C13 95,7 87,7 78 C3 69,2 59,5 51 C5 41,9 32,16 26 C21 18,29 12,37 11 C44 7,51 4,60 4 Z"
          fill={`url(#${gradId})`}
        />
      </svg>

      {/* Pressed metallic inner bezel */}
      <span
        className={`relative z-10 ${innerDim} rounded-full border border-white/40 shadow-[inset_0_2px_6px_rgba(0,0,0,0.35),0_1px_2px_rgba(255,255,255,0.35)] flex flex-col items-center justify-center text-amber-50/95`}
        style={{
          background: `radial-gradient(circle at 34% 30%, color-mix(in srgb, ${waxSeal.color} 72%, white), ${waxSeal.color} 68%, color-mix(in srgb, ${waxSeal.color} 62%, black))`,
        }}
      >
        {waxSeal.emblem !== "monogram" && renderEmblem()}
        <span
          className={`font-serif tracking-wider font-semibold leading-none drop-shadow-xs ${
            size === "lg"
              ? waxSeal.emblem === "monogram"
                ? "text-lg"
                : "text-[11px] mt-0.5"
              : "text-[9px]"
          }`}
          style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
        >
          {waxSeal.monogram || "INV"}
        </span>
      </span>
    </motion.button>
  );
}
