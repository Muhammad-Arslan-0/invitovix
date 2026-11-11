"use client";

import { type RefObject } from "react";
import { motion } from "framer-motion";
import { EventDesignData } from "@/types/invitation";
import {
  getBodyFontFamily,
  getDisplayFontFamily,
  getScriptFontFamily,
} from "@/lib/utils/fonts";
import { PortraitFrame } from "../PortraitFrame";
import { OrnamentalDivider } from "../CardOrnamentFrame";

interface CoupleSceneProps {
  id?: string;
  designData: EventDesignData;
  isStudioPreview?: boolean;
  scrollRootRef?: RefObject<HTMLDivElement | null>;
}

export function CoupleScene({
  id = "invite-couple",
  designData,
  isStudioPreview = false,
  scrollRootRef,
}: CoupleSceneProps) {
  const { theme, content, sections } = designData;
  if (!sections.showCouple) return null;

  const { couple } = content;
  const isSplit = couple.layout === "editorial-split";

  return (
    <motion.section
      id={id}
      data-testid="couple-scene"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{
        once: true,
        amount: 0.05,
        ...(scrollRootRef ? { root: scrollRootRef } : {}),
      }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="scroll-mt-14 px-6 sm:px-7 py-7 max-w-lg mx-auto"
    >
      <OrnamentalDivider
        motif={theme.cardArt.motif}
        accentColor={theme.palette.accent}
        primaryColor={theme.palette.primary}
      />

      <div className="text-center mt-4 mb-6">
        <p
          className="text-[10px] sm:text-[11px] uppercase tracking-[0.26em]"
          style={{ color: theme.palette.accent }}
        >
          With Blessings &amp; Love
        </p>
        <h2
          className="mt-1 text-2xl sm:text-3xl font-semibold"
          style={{
            color: theme.palette.primary,
            fontFamily: getDisplayFontFamily(theme.typography.displayFont),
          }}
        >
          Bride &amp; Groom
        </h2>
      </div>

      {isSplit ? (
        <div className="space-y-4">
          {[
            {
              key: "bride",
              name: couple.brideName || "The Bride",
              role: couple.brideRole || "The Bride",
              imageUrl: couple.brideImageUrl,
              tilt: "left" as const,
            },
            {
              key: "groom",
              name: couple.groomName || "The Groom",
              role: couple.groomRole || "The Groom",
              imageUrl: couple.groomImageUrl,
              tilt: "right" as const,
            },
          ].map((partner, idx) => (
            <div
              key={partner.key}
              className={`rounded-3xl border p-4 shadow-sm backdrop-blur-xs flex items-center gap-4 ${
                idx === 1 ? "flex-row-reverse text-right" : "text-left"
              }`}
              style={{
                backgroundColor: `${theme.palette.surface}EB`,
                borderColor: `${theme.palette.accent}42`,
              }}
            >
              <div className="w-28 sm:w-32 shrink-0">
                <PortraitFrame
                  imageUrl={partner.imageUrl}
                  alt={partner.name}
                  roleBadge={partner.key === "bride" ? "Bride" : "Groom"}
                  caption={partner.name}
                  shape={couple.frameShape}
                  primaryColor={theme.palette.primary}
                  accentColor={theme.palette.accent}
                  surfaceColor={theme.palette.background}
                  textColor={theme.palette.text}
                  displayFont={theme.typography.displayFont}
                  scriptFont={theme.typography.scriptFont}
                  tilt={partner.tilt}
                  isStudioPreview={isStudioPreview}
                />
              </div>
              <div className="flex-1 min-w-0">
                <span
                  className="text-[10px] uppercase tracking-[0.22em] font-medium"
                  style={{ color: theme.palette.accent }}
                >
                  {partner.key === "bride" ? "The Bride" : "The Groom"}
                </span>
                <h3
                  className="mt-1 text-xl font-semibold leading-snug"
                  style={{
                    color: theme.palette.primary,
                    fontFamily: getDisplayFontFamily(
                      theme.typography.displayFont
                    ),
                  }}
                >
                  {partner.name}
                </h3>
                {partner.role && (
                  <p
                    className="mt-1.5 text-xs sm:text-sm leading-relaxed"
                    style={{
                      color: theme.palette.mutedText,
                      fontFamily: getBodyFontFamily(theme.typography.bodyFont),
                    }}
                  >
                    {partner.role}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="relative rounded-3xl border px-4 py-6 sm:px-6 shadow-sm backdrop-blur-xs"
          style={{
            backgroundColor: `${theme.palette.surface}EB`,
            borderColor: `${theme.palette.accent}42`,
          }}
        >
          <div className="grid grid-cols-2 gap-4 sm:gap-6 items-start relative">
            {/* Bride Column */}
            <div className="text-center flex flex-col items-center">
              <div className="w-full max-w-[144px]">
                <PortraitFrame
                  imageUrl={couple.brideImageUrl}
                  alt={couple.brideName || "The Bride"}
                  roleBadge="Bride"
                  caption={couple.brideName || "The Bride"}
                  shape={couple.frameShape}
                  primaryColor={theme.palette.primary}
                  accentColor={theme.palette.accent}
                  surfaceColor={theme.palette.background}
                  textColor={theme.palette.text}
                  displayFont={theme.typography.displayFont}
                  scriptFont={theme.typography.scriptFont}
                  tilt="left"
                  isStudioPreview={isStudioPreview}
                />
              </div>
              <h3
                className="mt-3 text-base sm:text-lg font-semibold leading-tight"
                style={{
                  color: theme.palette.primary,
                  fontFamily: getDisplayFontFamily(
                    theme.typography.displayFont
                  ),
                }}
              >
                {couple.brideName || "The Bride"}
              </h3>
              {couple.brideRole && (
                <p
                  className="mt-1 text-[11px] sm:text-xs leading-snug max-w-[150px]"
                  style={{
                    color: theme.palette.mutedText,
                    fontFamily: getBodyFontFamily(theme.typography.bodyFont),
                  }}
                >
                  {couple.brideRole}
                </p>
              )}
            </div>

            {/* Center Monogram Seal Crest */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[34%] -translate-x-1/2 -translate-y-1/2 z-20"
            >
              <div
                className="w-9 h-9 rounded-full border shadow-md flex items-center justify-center"
                style={{
                  backgroundColor: theme.palette.surface,
                  borderColor: `${theme.palette.accent}88`,
                  color: theme.palette.accent,
                  fontFamily: getScriptFontFamily(theme.typography.scriptFont),
                  fontSize: "1.15rem",
                }}
              >
                {couple.crestText || "&"}
              </div>
            </div>

            {/* Groom Column */}
            <div className="text-center flex flex-col items-center">
              <div className="w-full max-w-[144px]">
                <PortraitFrame
                  imageUrl={couple.groomImageUrl}
                  alt={couple.groomName || "The Groom"}
                  roleBadge="Groom"
                  caption={couple.groomName || "The Groom"}
                  shape={couple.frameShape}
                  primaryColor={theme.palette.primary}
                  accentColor={theme.palette.accent}
                  surfaceColor={theme.palette.background}
                  textColor={theme.palette.text}
                  displayFont={theme.typography.displayFont}
                  scriptFont={theme.typography.scriptFont}
                  tilt="right"
                  isStudioPreview={isStudioPreview}
                />
              </div>
              <h3
                className="mt-3 text-base sm:text-lg font-semibold leading-tight"
                style={{
                  color: theme.palette.primary,
                  fontFamily: getDisplayFontFamily(
                    theme.typography.displayFont
                  ),
                }}
              >
                {couple.groomName || "The Groom"}
              </h3>
              {couple.groomRole && (
                <p
                  className="mt-1 text-[11px] sm:text-xs leading-snug max-w-[150px]"
                  style={{
                    color: theme.palette.mutedText,
                    fontFamily: getBodyFontFamily(theme.typography.bodyFont),
                  }}
                >
                  {couple.groomRole}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.section>
  );
}
