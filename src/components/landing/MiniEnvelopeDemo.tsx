"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Sparkles, Volume2 } from "lucide-react";
import {
  resolveCardBackdropUrl,
  WEDDING_STARTER_TEMPLATES,
} from "@/lib/templates/presets";
import { hexToRgba } from "@/lib/utils/colors";
import {
  getDisplayFontFamily,
  getScriptFontFamily,
} from "@/lib/utils/fonts";
import { WaxSeal } from "@/components/invitation/WaxSeal";

const SHORT_LABEL_BY_PRESET: Record<string, string> = {
  "noor-emerald": "Nikah",
  "blush-peony": "Peony",
  "marigold-mehndi": "Mehndi",
  "shahi-baraat": "Baraat",
  "ivory-engagement": "Engagement",
  "champagne-silk": "Silk",
  "moonlit-valima": "Valima",
  "rajputana-heritage": "Rajputana",
  "dawat-e-ishq": "Qawwali",
  "tuscan-terracotta": "Tuscan",
  "kanjeevaram-temple": "Muhurtham",
  "quiet-luxury-minimalist": "Minimalist",
  "chateau-rococo-blue": "Rococo",
  "boho-sunset-sangeet": "Sangeet",
  "anand-karaj-sage": "Anand Karaj",
};

interface MiniEnvelopeDemoProps {
  selectedIdx?: number;
  onSelectIdx?: (idx: number) => void;
}

export function MiniEnvelopeDemo({
  selectedIdx: controlledIdx,
  onSelectIdx,
}: MiniEnvelopeDemoProps) {
  const [internalIdx, setInternalIdx] = useState(0);
  const [unsealed, setUnsealed] = useState(false);

  const activeIdx = controlledIdx ?? internalIdx;
  const setActiveIdx = (idx: number) => {
    setUnsealed(false);
    setInternalIdx(idx);
    onSelectIdx?.(idx);
  };

  const templateRecord =
    WEDDING_STARTER_TEMPLATES[activeIdx] ?? WEDDING_STARTER_TEMPLATES[0];
  const cfg = templateRecord.default_config;
  const { palette, typography, cardArt } = cfg.theme;
  const backdropUrl = resolveCardBackdropUrl(cardArt);

  return (
    <div className="relative mx-auto w-full max-w-[390px]">
      {/* Wedding Theme Swatch Switcher */}
      <div className="mx-auto mb-4 flex max-w-[380px] max-h-32 overflow-y-auto flex-wrap items-center justify-center gap-1 rounded-2xl border border-stone-200/80 bg-white/85 backdrop-blur-md p-1.5 shadow-xs no-scrollbar">
        {WEDDING_STARTER_TEMPLATES.map((tpl, idx) => {
          const active = idx === activeIdx;
          const shortName =
            SHORT_LABEL_BY_PRESET[tpl.default_config.theme.presetId] ??
            tpl.category;
          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`relative rounded-xl px-2 py-1 text-[10px] font-medium capitalize transition cursor-pointer ${
                active ? "text-white" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="hero-theme-pill"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
                  className="absolute inset-0 rounded-xl bg-stone-900 shadow-xs"
                />
              )}
              <span className="relative z-10 flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full inline-block shrink-0"
                  style={{
                    backgroundColor: tpl.default_config.envelope.waxSeal.color,
                  }}
                />
                <span>{shortName}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Ambient radial glow matching active theme */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 -z-10 rounded-full blur-2xl opacity-45 transition-colors duration-500"
        style={{
          background: `radial-gradient(circle, ${palette.accent}55 0%, transparent 70%)`,
        }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={templateRecord.id}
          initial={{ opacity: 0.5, scale: 0.97, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: unsealed ? -10 : 0 }}
          exit={{ opacity: 0.4, scale: 0.97 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{
            backgroundColor: cfg.envelope.envelopeColor,
            borderColor: `${cfg.envelope.linerColor}66`,
          }}
          className="rounded-3xl border p-6 text-center shadow-[0_28px_65px_-16px_rgba(24,20,15,0.45)] relative overflow-hidden"
        >
          <div
            className="absolute inset-3 rounded-2xl border opacity-45 pointer-events-none"
            style={{ borderColor: cfg.envelope.linerColor }}
          />

          {/* Inner Card Slip */}
          <motion.div
            animate={unsealed ? { y: -8, scale: 1.02 } : { y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              backgroundColor: palette.surface,
              color: palette.text,
              borderColor: `${palette.accent}44`,
            }}
            className="relative z-10 rounded-2xl border px-5 py-6 shadow-inner overflow-hidden"
          >
            {backdropUrl && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={backdropUrl}
                  alt=""
                  className="pointer-events-none absolute inset-0 w-full h-full object-cover opacity-35"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: `radial-gradient(circle at 50% 45%, ${hexToRgba(palette.surface, 0.72)}, ${hexToRgba(palette.surface, 0.35)})`,
                  }}
                />
              </>
            )}
            <p
              className="relative z-10 text-[10px] uppercase tracking-[0.22em]"
              style={{ color: palette.mutedText }}
            >
              {cfg.content.hostLine}
            </p>
            <h3
              className="relative z-10 mt-2 text-2xl font-semibold leading-tight"
              style={{
                color: palette.primary,
                fontFamily: getDisplayFontFamily(typography.displayFont),
              }}
            >
              {cfg.content.headline}
            </h3>
            <p
              className="relative z-10 mt-1 text-base"
              style={{
                color: palette.accent,
                fontFamily: getScriptFontFamily(typography.scriptFont),
              }}
            >
              {cfg.audio.trackTitle}
            </p>

            {unsealed && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 mt-4 pt-3 border-t space-y-2.5"
                style={{ borderColor: `${palette.accent}33` }}
              >
                <p
                  className="text-xs line-clamp-2"
                  style={{ color: palette.mutedText }}
                >
                  {cfg.content.subtitle}
                </p>
                <Link
                  href={`/e/demo?template=${encodeURIComponent(cfg.theme.presetId)}`}
                  style={{
                    backgroundColor: cfg.envelope.envelopeColor,
                    color: "#FAF6EE",
                    borderColor: `${cfg.envelope.linerColor}55`,
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-[11px] font-medium shadow-xs hover:opacity-90 transition"
                >
                  <span>Open Full Experience</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </motion.div>
            )}
          </motion.div>

          {/* Embossed Scalloped Wax Seal */}
          <div className="relative z-20 -mt-7 flex flex-col items-center">
            <WaxSeal
              waxSeal={cfg.envelope.waxSeal}
              onClick={() => setUnsealed((prev) => !prev)}
              size="sm"
            />
            <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-amber-50/90">
              {unsealed ? (
                <>
                  <Volume2 className="w-3 h-3 text-amber-300" />
                  <span>Tap seal to reseal or explore /e/demo</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Tap wax seal to preview reveal</span>
                </>
              )}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
