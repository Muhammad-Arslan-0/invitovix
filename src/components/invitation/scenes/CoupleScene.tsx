"use client";

import { type RefObject } from "react";
import { motion } from "framer-motion";
import { EventDesignData } from "@/types/invitation";
import {
  getBodyFontFamily,
  getDisplayFontFamily,
  getScriptFontFamily,
} from "@/lib/utils/fonts";
import { getInvitationTypeMeta } from "@/lib/templates/categories";
import { useCardLanguage } from "@/lib/i18n/CardLanguageContext";
import { PortraitFrame } from "../PortraitFrame";
import { OrnamentalDivider } from "../CardOrnamentFrame";

interface CoupleSceneProps {
  id?: string;
  designData: EventDesignData;
  eventType?: string;
  isStudioPreview?: boolean;
  scrollRootRef?: RefObject<HTMLDivElement | null>;
}

export function CoupleScene({
  id = "invite-couple",
  designData,
  eventType = "wedding",
  isStudioPreview = false,
  scrollRootRef,
}: CoupleSceneProps) {
  const { t, isRTL, language } = useCardLanguage();
  const { theme, content, sections } = designData;
  if (!sections.showCouple) return null;

  const { couple } = content;
  const typeMeta = getInvitationTypeMeta(eventType);
  const isSolo =
    couple.layout === "featured-solo" ||
    (!couple.groomName.trim() && typeMeta.isSoloDefault);
  const isSplit = !isSolo && couple.layout === "editorial-split";

  const person1Name =
    couple.brideName ||
    (language !== "en" && typeMeta.domain === "wedding"
      ? t("bride")
      : typeMeta.person1ShortLabel);
  const person2Name =
    couple.groomName ||
    (language !== "en" && typeMeta.domain === "wedding"
      ? t("groom")
      : typeMeta.person2ShortLabel);

  const eyebrow =
    language !== "en"
      ? isSolo
        ? typeMeta.domain === "birthday"
          ? t("theHonoree")
          : t("honoredGuest")
        : t("theCouple")
      : typeMeta.eyebrow;

  const sectionHeading =
    language !== "en"
      ? isSolo
        ? typeMeta.domain === "birthday"
          ? t("celebratingWithYou")
          : t("keynoteAndProgram")
        : t("groomAndBride")
      : typeMeta.sectionHeading;

  const person1Badge =
    language !== "en" && typeMeta.domain === "wedding"
      ? t("theBride")
      : typeMeta.person1BadgeLabel;
  const person2Badge =
    language !== "en" && typeMeta.domain === "wedding"
      ? t("theGroom")
      : typeMeta.person2BadgeLabel;
  const person1ShortRole =
    language !== "en" && typeMeta.domain === "wedding"
      ? t("bride")
      : typeMeta.person1ShortLabel;
  const person2ShortRole =
    language !== "en" && typeMeta.domain === "wedding"
      ? t("groom")
      : typeMeta.person2ShortLabel;

  return (
    <motion.section
      id={id}
      data-testid="couple-scene"
      dir={isRTL ? "rtl" : "ltr"}
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
          {eyebrow}
        </p>
        <h2
          className="mt-1 text-2xl sm:text-3xl font-semibold"
          style={{
            color: theme.palette.primary,
            fontFamily: getDisplayFontFamily(theme.typography.displayFont, language),
          }}
        >
          {sectionHeading}
        </h2>
      </div>

      {isSolo ? (
        <div
          data-testid="solo-spotlight-card"
          className="rounded-3xl border px-6 py-7 shadow-sm backdrop-blur-xs text-center flex flex-col items-center"
          style={{
            backgroundColor: `${theme.palette.surface}EB`,
            borderColor: `${theme.palette.accent}42`,
          }}
        >
          <div className="w-40 sm:w-44">
            <PortraitFrame
              imageUrl={couple.brideImageUrl}
              alt={person1Name}
              roleBadge={person1Badge}
              caption={person1ShortRole}
              shape={couple.frameShape}
              primaryColor={theme.palette.primary}
              accentColor={theme.palette.accent}
              surfaceColor={theme.palette.background}
              textColor={theme.palette.text}
              displayFont={theme.typography.displayFont}
              scriptFont={theme.typography.scriptFont}
              isStudioPreview={isStudioPreview}
              language={language}
            />
          </div>
          {couple.crestText && (
            <span
              aria-hidden="true"
              className="mt-3 inline-flex w-8 h-8 rounded-full border items-center justify-center text-sm shadow-xs"
              style={{
                borderColor: `${theme.palette.accent}66`,
                color: theme.palette.accent,
                backgroundColor: theme.palette.surface,
              }}
            >
              {couple.crestText}
            </span>
          )}
          <h3
            className="mt-2.5 text-2xl font-semibold leading-snug"
            style={{
              color: theme.palette.primary,
              fontFamily: getDisplayFontFamily(theme.typography.displayFont, language),
            }}
          >
            {person1Name}
          </h3>
          {couple.brideRole && (
            <p
              className="mt-1.5 text-xs sm:text-sm leading-relaxed max-w-xs"
              style={{
                color: theme.palette.mutedText,
                fontFamily: getBodyFontFamily(theme.typography.bodyFont, language),
              }}
            >
              {couple.brideRole}
            </p>
          )}
        </div>
      ) : isSplit ? (
        <div className="space-y-4">
          {[
            {
              key: "bride",
              name: person1Name,
              badge: person1Badge,
              shortRole: person1ShortRole,
              role: couple.brideRole || person1ShortRole,
              imageUrl: couple.brideImageUrl,
              tilt: "left" as const,
            },
            {
              key: "groom",
              name: person2Name,
              badge: person2Badge,
              shortRole: person2ShortRole,
              role: couple.groomRole || person2ShortRole,
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
                  roleBadge={partner.badge}
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
                  language={language}
                />
              </div>
              <div className="flex-1 min-w-0">
                <span
                  className="text-[10px] uppercase tracking-[0.22em] font-medium"
                  style={{ color: theme.palette.accent }}
                >
                  {partner.shortRole}
                </span>
                <h3
                  className="mt-1 text-xl font-semibold leading-snug"
                  style={{
                    color: theme.palette.primary,
                    fontFamily: getDisplayFontFamily(
                      theme.typography.displayFont,
                      language
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
                      fontFamily: getBodyFontFamily(theme.typography.bodyFont, language),
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
            {/* Person 1 Column */}
            <div className="text-center flex flex-col items-center">
              <div className="w-full max-w-[144px]">
                <PortraitFrame
                  imageUrl={couple.brideImageUrl}
                  alt={person1Name}
                  roleBadge={person1Badge}
                  caption={person1Name}
                  shape={couple.frameShape}
                  primaryColor={theme.palette.primary}
                  accentColor={theme.palette.accent}
                  surfaceColor={theme.palette.background}
                  textColor={theme.palette.text}
                  displayFont={theme.typography.displayFont}
                  scriptFont={theme.typography.scriptFont}
                  tilt="left"
                  isStudioPreview={isStudioPreview}
                  language={language}
                />
              </div>
              <h3
                className="mt-3 text-base sm:text-lg font-semibold leading-tight"
                style={{
                  color: theme.palette.primary,
                  fontFamily: getDisplayFontFamily(
                    theme.typography.displayFont,
                    language
                  ),
                }}
              >
                {person1Name}
              </h3>
              {couple.brideRole && (
                <p
                  className="mt-1 text-[11px] sm:text-xs leading-snug max-w-[150px]"
                  style={{
                    color: theme.palette.mutedText,
                    fontFamily: getBodyFontFamily(theme.typography.bodyFont, language),
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
                  fontFamily: getScriptFontFamily(theme.typography.scriptFont, language),
                  fontSize: "1.15rem",
                }}
              >
                {couple.crestText || "&"}
              </div>
            </div>

            {/* Person 2 Column */}
            <div className="text-center flex flex-col items-center">
              <div className="w-full max-w-[144px]">
                <PortraitFrame
                  imageUrl={couple.groomImageUrl}
                  alt={person2Name}
                  roleBadge={person2Badge}
                  caption={person2Name}
                  shape={couple.frameShape}
                  primaryColor={theme.palette.primary}
                  accentColor={theme.palette.accent}
                  surfaceColor={theme.palette.background}
                  textColor={theme.palette.text}
                  displayFont={theme.typography.displayFont}
                  scriptFont={theme.typography.scriptFont}
                  tilt="right"
                  isStudioPreview={isStudioPreview}
                  language={language}
                />
              </div>
              <h3
                className="mt-3 text-base sm:text-lg font-semibold leading-tight"
                style={{
                  color: theme.palette.primary,
                  fontFamily: getDisplayFontFamily(
                    theme.typography.displayFont,
                    language
                  ),
                }}
              >
                {person2Name}
              </h3>
              {couple.groomRole && (
                <p
                  className="mt-1 text-[11px] sm:text-xs leading-snug max-w-[150px]"
                  style={{
                    color: theme.palette.mutedText,
                    fontFamily: getBodyFontFamily(theme.typography.bodyFont, language),
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
