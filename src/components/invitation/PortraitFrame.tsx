"use client";

import { Sparkles } from "lucide-react";
import { CoupleFrameShape, HeroFrameStyle } from "@/types/invitation";
import { getDisplayFontFamily, getScriptFontFamily } from "@/lib/utils/fonts";

export type AnyPortraitShape = CoupleFrameShape | HeroFrameStyle;

interface PortraitFrameProps {
  imageUrl: string | null;
  alt: string;
  monogram?: string;
  roleBadge?: string;
  caption?: string;
  shape: AnyPortraitShape;
  primaryColor: string;
  accentColor: string;
  surfaceColor: string;
  textColor: string;
  displayFont: "cinzel" | "cormorant" | "playfair" | "syne";
  scriptFont: "great-vibes" | "cormorant";
  tilt?: "left" | "right" | "none";
  size?: "hero" | "couple";
  isStudioPreview?: boolean;
}

function getInitials(value: string): string {
  const words = value.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "A";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0] ?? ""}${words[1][0] ?? ""}`.toUpperCase();
}

export function PortraitFrame({
  imageUrl,
  alt,
  monogram,
  roleBadge,
  caption,
  shape,
  primaryColor,
  accentColor,
  surfaceColor,
  textColor,
  displayFont,
  scriptFont,
  tilt = "none",
  size = "couple",
  isStudioPreview = false,
}: PortraitFrameProps) {
  const initials = monogram || getInitials(alt);
  const aspectClass =
    size === "hero" ? "w-full max-w-[300px] aspect-[4/5]" : "w-full aspect-[4/5]";

  if (shape === "polaroid") {
    const tiltClass =
      tilt === "left"
        ? "-rotate-2 hover:rotate-0"
        : tilt === "right"
          ? "rotate-2 hover:rotate-0"
          : "";

    return (
      <div
        className={`relative mx-auto transition-transform duration-300 ${tiltClass} ${
          size === "hero" ? "w-full max-w-[300px]" : "w-full"
        } rounded-xl border p-2.5 pb-6 shadow-[0_18px_38px_-14px_rgba(24,18,14,0.34)]`}
        style={{
          backgroundColor: "#FCF9F4",
          borderColor: `${accentColor}55`,
        }}
      >
        <div
          className="relative w-full aspect-[4/5] overflow-hidden rounded-md border"
          style={{
            borderColor: `${accentColor}30`,
            backgroundColor: surfaceColor,
          }}
        >
          {imageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={imageUrl}
              alt={alt}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center p-4 text-center"
              style={{
                background: `radial-gradient(circle at 30% 25%, ${accentColor}26, transparent 60%), linear-gradient(155deg, ${surfaceColor}, ${primaryColor}14)`,
              }}
            >
              <span
                className="text-3xl font-semibold tracking-wider"
                style={{
                  color: primaryColor,
                  fontFamily: getDisplayFontFamily(displayFont),
                }}
              >
                {initials}
              </span>
              {roleBadge && (
                <span
                  className="mt-1.5 text-[10px] uppercase tracking-[0.2em]"
                  style={{ color: accentColor }}
                >
                  {roleBadge}
                </span>
              )}
              {isStudioPreview && (
                <span className="mt-3 rounded-full border border-dashed px-2.5 py-0.5 text-[9px] uppercase tracking-wider opacity-70" style={{ borderColor: accentColor, color: textColor }}>
                  Upload Photo
                </span>
              )}
            </div>
          )}
        </div>
        {caption && (
          <p
            className="mt-2.5 text-center leading-none truncate px-1"
            style={{
              color: "#2C221E",
              fontFamily: getScriptFontFamily(scriptFont),
              fontSize: scriptFont === "great-vibes" ? "1.25rem" : "0.95rem",
            }}
          >
            {caption}
          </p>
        )}
      </div>
    );
  }

  const radiusClass =
    shape === "arch"
      ? "rounded-t-[999px] rounded-b-[20px]"
      : shape === "oval" || shape === "scallop"
        ? "rounded-[999px]"
        : "rounded-[24px]";

  return (
    <div
      className={`relative mx-auto ${aspectClass} ${radiusClass} overflow-hidden border shadow-[0_18px_40px_-16px_rgba(0,0,0,0.35)]`}
      style={{
        backgroundColor: surfaceColor,
        borderColor: `${accentColor}75`,
      }}
    >
      {imageUrl ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={imageUrl}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]"
        />
      ) : (
        <div
          className="w-full h-full flex flex-col items-center justify-center p-4 text-center relative"
          style={{
            background: `radial-gradient(circle at 50% 30%, ${accentColor}26, transparent 62%), linear-gradient(180deg, ${surfaceColor} 0%, ${primaryColor}18 100%)`,
          }}
        >
          <div
            className="w-11 h-11 rounded-full border flex items-center justify-center mb-2 shadow-xs"
            style={{
              borderColor: `${accentColor}70`,
              backgroundColor: `${accentColor}16`,
              color: accentColor,
            }}
          >
            <Sparkles className="w-4 h-4" />
          </div>
          <span
            className="text-2xl sm:text-3xl font-semibold tracking-wider"
            style={{
              color: primaryColor,
              fontFamily: getDisplayFontFamily(displayFont),
            }}
          >
            {initials}
          </span>
          {roleBadge && (
            <span
              className="mt-1 text-[9px] sm:text-[10px] uppercase tracking-[0.22em]"
              style={{ color: accentColor }}
            >
              {roleBadge}
            </span>
          )}
          {isStudioPreview && (
            <span
              className="mt-2.5 rounded-full border border-dashed px-2.5 py-0.5 text-[9px] uppercase tracking-wider opacity-75"
              style={{ borderColor: accentColor, color: textColor }}
            >
              Add Photo
            </span>
          )}
        </div>
      )}

      {/* Decorative inset frame matching arch / oval / rounded shape */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-2 ${radiusClass} border`}
        style={{
          borderColor: `${accentColor}60`,
          borderStyle: shape === "scallop" ? "dotted" : "solid",
          borderWidth: shape === "scallop" ? "2px" : "1px",
        }}
      />
    </div>
  );
}

