"use client";

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
  const dim = size === "lg" ? "w-24 h-24" : "w-14 h-14";
  const innerDim = size === "lg" ? "w-[74px] h-[74px]" : "w-10 h-10";

  const renderEmblem = () => {
    const iconClass =
      size === "lg" ? "w-5 h-5 opacity-90" : "w-3.5 h-3.5 opacity-90";
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
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      animate={
        isCracking
          ? { scale: [1, 1.18, 0.4], opacity: [1, 1, 0], rotate: [0, -8, 14] }
          : {
              boxShadow: [
                `0 10px 28px rgba(0,0,0,0.35), 0 0 0 0 ${waxSeal.color}66`,
                `0 12px 32px rgba(0,0,0,0.4), 0 0 0 12px ${waxSeal.color}00`,
              ],
            }
      }
      transition={
        isCracking
          ? { duration: 0.55, ease: "easeOut" }
          : { duration: 2.2, repeat: Infinity, ease: "easeOut" }
      }
      style={{
        background: `radial-gradient(circle at 32% 28%, color-mix(in srgb, ${waxSeal.color} 78%, white), ${waxSeal.color} 68%, color-mix(in srgb, ${waxSeal.color} 70%, black))`,
      }}
      className={`relative ${dim} rounded-full flex items-center justify-center cursor-pointer select-none shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300`}
      aria-label="Tap wax seal to open invitation"
    >
      {/* Organic wax edge highlight */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full border-2 border-white/20"
      />
      {/* Embossed inner ring */}
      <span
        className={`${innerDim} rounded-full border border-white/35 shadow-inner flex flex-col items-center justify-center text-amber-50/95`}
      >
        {waxSeal.emblem !== "monogram" && renderEmblem()}
        <span
          className={`font-serif tracking-wider font-semibold leading-none ${
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

