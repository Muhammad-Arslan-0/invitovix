"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Sparkles } from "lucide-react";
import { EventDesignData } from "@/types/invitation";
import {
  getBodyFontFamily,
  getDisplayFontFamily,
  getScriptFontFamily,
} from "@/lib/utils/fonts";
import { WaxSeal } from "./WaxSeal";
import { LottieAccent } from "./LottieAccent";

interface EnvelopeStageProps {
  designData: EventDesignData;
  eventDate: string;
  stage: "sealed" | "opening";
  startMuted: boolean;
  onToggleStartMuted: () => void;
  onUnseal: () => void;
}

export function EnvelopeStage({
  designData,
  eventDate,
  stage,
  startMuted,
  onToggleStartMuted,
  onUnseal,
}: EnvelopeStageProps) {
  const { theme, envelope, content, motion: motionCfg, audio } = designData;
  const isOpening = stage === "opening";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formattedDate = (() => {
    const d = new Date(eventDate);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      ...(mounted ? {} : { timeZone: "UTC" }),
    });
  })();

  return (
    <div
      className="relative min-h-[680px] h-full w-full flex flex-col items-center justify-center px-5 py-10 overflow-hidden"
      style={{
        backgroundColor: theme.palette.background,
        color: theme.palette.text,
      }}
    >
      {/* Ambient radial spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 42%, ${theme.palette.accent}24 0%, transparent 65%)`,
        }}
      />

      {/* Audio preference pill at top */}
      {audio.enabled && (
        <div className="relative z-20 mb-6">
          <button
            type="button"
            onClick={onToggleStartMuted}
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium backdrop-blur-md border transition hover:opacity-90 cursor-pointer"
            style={{
              backgroundColor: `${theme.palette.surface}CC`,
              borderColor: `${theme.palette.accent}44`,
              color: theme.palette.mutedText,
            }}
          >
            {startMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Opens silently</span>
              </>
            ) : (
              <>
                <Volume2
                  className="w-3.5 h-3.5"
                  style={{ color: theme.palette.accent }}
                />
                <span>With music · {audio.trackTitle}</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Envelope Container */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-20 w-full max-w-[360px]"
      >
        {/* Lottie burst played upon unseal */}
        {isOpening && motionCfg.lottieAccent !== "none" && (
          <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center">
            <LottieAccent
              kind={motionCfg.lottieAccent}
              className="w-64 h-64"
            />
          </div>
        )}

        {/* Inner rising invitation card preview */}
        <motion.div
          initial={{ y: 24, opacity: 0.9 }}
          animate={
            isOpening ? { y: -92, opacity: 1, scale: 1.02 } : { y: 12, opacity: 0.95 }
          }
          transition={{ duration: 1.0, delay: isOpening ? 0.25 : 0, ease: [0.22, 1, 0.36, 1] }}
          style={{
            backgroundColor: theme.palette.surface,
            borderColor: `${theme.palette.accent}55`,
          }}
          className="mx-4 rounded-t-2xl border p-6 text-center shadow-lg"
        >
          <p
            className="text-[11px] uppercase tracking-[0.22em]"
            style={{
              color: theme.palette.mutedText,
              fontFamily: getBodyFontFamily(theme.typography.bodyFont),
            }}
          >
            {content.hostLine}
          </p>
          <h2
            className="mt-2 text-2xl font-semibold tracking-wide"
            style={{
              color: theme.palette.primary,
              fontFamily: getDisplayFontFamily(theme.typography.displayFont),
            }}
          >
            {content.headline}
          </h2>
          {formattedDate && (
            <p
              className="mt-1 text-sm"
              style={{
                color: theme.palette.accent,
                fontFamily: getScriptFontFamily(theme.typography.scriptFont),
              }}
            >
              {formattedDate}
            </p>
          )}
        </motion.div>

        {/* Main Envelope Pocket */}
        <div
          onClick={!isOpening ? onUnseal : undefined}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !isOpening) {
              e.preventDefault();
              onUnseal();
            }
          }}
          style={{
            backgroundColor: envelope.envelopeColor,
            borderColor: `${envelope.linerColor}66`,
          }}
          className={`relative -mt-8 rounded-2xl border shadow-2xl overflow-hidden cursor-pointer select-none ${
            envelope.style === "arch-pocket"
              ? "rounded-t-[90px]"
              : envelope.style === "art-deco"
                ? "rounded-md"
                : "rounded-2xl"
          }`}
        >
          {/* Decorative foil inner frame */}
          <div
            className="pointer-events-none absolute inset-3 rounded-xl border opacity-55"
            style={{ borderColor: envelope.linerColor }}
          />

          {/* Top flap fold illusion */}
          <motion.div
            animate={
              isOpening
                ? { rotateX: 165, opacity: 0.25 }
                : { rotateX: 0, opacity: 1 }
            }
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            style={{
              transformOrigin: "top center",
              background: `linear-gradient(160deg, color-mix(in srgb, ${envelope.envelopeColor} 88%, white) 0%, ${envelope.envelopeColor} 100%)`,
              borderBottom: `1.5px solid ${envelope.linerColor}88`,
            }}
            className="relative z-10 h-32 w-full flex items-end justify-center pb-5 shadow-md"
          >
            <div
              className="text-[11px] uppercase tracking-[0.26em] opacity-80"
              style={{
                color: envelope.linerColor,
                fontFamily: getDisplayFontFamily(theme.typography.displayFont),
              }}
            >
              Invitation
            </div>
          </motion.div>

          {/* Wax Seal Centerpiece */}
          <div className="relative z-20 -mt-12 flex flex-col items-center justify-center pb-10 pt-2 px-6 text-center">
            {envelope.waxSeal.enabled ? (
              <WaxSeal
                waxSeal={envelope.waxSeal}
                onClick={onUnseal}
                isCracking={isOpening}
              />
            ) : (
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onUnseal}
                style={{
                  backgroundColor: envelope.linerColor,
                  color: envelope.envelopeColor,
                }}
                className="px-6 py-3 rounded-full text-xs uppercase tracking-[0.2em] font-semibold shadow-xl cursor-pointer"
              >
                Open Invitation
              </motion.button>
            )}

            <div className="mt-6 flex items-center justify-center gap-1.5 text-xs tracking-wide opacity-90">
              <Sparkles
                className="w-3.5 h-3.5 shrink-0"
                style={{ color: envelope.linerColor }}
              />
              <span
                style={{
                  color: "#FAF6EE",
                  fontFamily: getBodyFontFamily(theme.typography.bodyFont),
                }}
              >
                {isOpening ? "Unsealing..." : envelope.promptText}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <p
        className="relative z-20 mt-8 text-[11px] tracking-[0.22em] uppercase opacity-60"
        style={{ color: theme.palette.mutedText }}
      >
        Crafted with Invitovix
      </p>
    </div>
  );
}

