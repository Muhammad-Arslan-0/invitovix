"use client";

import React from "react";
import { BlessingHeaderConfig } from "@/types/invitation";

interface BlessingHeaderProps {
  blessingHeader?: BlessingHeaderConfig | null;
  primaryColor: string;
  accentColor: string;
  surfaceColor?: string;
  textColor?: string;
  mutedTextColor?: string;
  size?: "hero" | "compact" | "preview";
  className?: string;
}

export function BlessingHeader({
  blessingHeader,
  primaryColor,
  accentColor,
  mutedTextColor = "#7A6B63",
  size = "hero",
  className = "",
}: BlessingHeaderProps) {
  if (!blessingHeader || !blessingHeader.enabled) {
    return null;
  }

  const {
    arabicText,
    translation,
    reference,
    showTranslation = true,
    showOrnament = true,
  } = blessingHeader;

  const isCompact = size === "compact";
  const isPreview = size === "preview";

  return (
    <div
      className={`relative z-20 flex flex-col items-center text-center select-none ${
        isCompact ? "my-1 px-2" : isPreview ? "my-2 px-3" : "mt-2 mb-4 px-4 max-w-xl mx-auto"
      } ${className}`}
    >
      {/* Ornate Islamic Arabesque Emblem / Bismillah Seal */}
      {showOrnament && (
        <div
          className={`flex items-center justify-center text-accent transition-transform duration-500 hover:scale-105 ${
            isCompact ? "mb-1 scale-75" : "mb-2.5"
          }`}
          aria-hidden="true"
        >
          <svg
            className={isCompact ? "w-6 h-6" : "w-8 h-8 sm:w-9 sm:h-9"}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Sacred Geometry Octagram / Rub el Hizb */}
            <rect
              x="20"
              y="20"
              width="60"
              height="60"
              rx="4"
              stroke={accentColor}
              strokeWidth="1.5"
              strokeOpacity="0.4"
            />
            <rect
              x="20"
              y="20"
              width="60"
              height="60"
              rx="4"
              transform="rotate(45 50 50)"
              stroke={accentColor}
              strokeWidth="1.5"
              strokeOpacity="0.5"
            />
            {/* Inner Floral Rosette Center */}
            <circle
              cx="50"
              cy="50"
              r="12"
              fill={accentColor}
              fillOpacity="0.12"
              stroke={accentColor}
              strokeWidth="1.2"
            />
            <path
              d="M50 42 C50 47, 50 47, 50 58 M42 50 C47 50, 47 50, 58 50"
              stroke={accentColor}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="50" cy="50" r="3" fill={accentColor} />
            <circle cx="50" cy="30" r="1.5" fill={accentColor} />
            <circle cx="50" cy="70" r="1.5" fill={accentColor} />
            <circle cx="30" cy="50" r="1.5" fill={accentColor} />
            <circle cx="70" cy="50" r="1.5" fill={accentColor} />
          </svg>
        </div>
      )}

      {/* Arabic Script */}
      {arabicText && (
        <div
          dir="rtl"
          lang="ar"
          className={`font-arabic transition-all duration-300 leading-[1.6] sm:leading-[1.7] tracking-normal font-normal ${
            isCompact
              ? "text-base sm:text-lg"
              : isPreview
                ? "text-lg sm:text-xl"
                : "text-2xl sm:text-3xl md:text-4xl"
          }`}
          style={{
            color: primaryColor,
            textShadow: `0 1px 1px ${accentColor}22`,
          }}
        >
          {arabicText}
        </div>
      )}

      {/* Delicate Symmetrical Divider */}
      <div
        className={`flex items-center justify-center gap-2.5 ${
          isCompact ? "my-1" : "my-2.5"
        } w-full max-w-[220px]`}
        aria-hidden="true"
      >
        <div
          className="h-[1px] flex-1"
          style={{
            background: `linear-gradient(90deg, transparent, ${accentColor}66)`,
          }}
        />
        <span
          className="text-[9px] select-none"
          style={{ color: accentColor }}
        >
          ✦
        </span>
        <div
          className="h-[1px] flex-1"
          style={{
            background: `linear-gradient(270deg, transparent, ${accentColor}66)`,
          }}
        />
      </div>

      {/* English Translation & Reference */}
      {showTranslation && translation && (
        <div className="flex flex-col items-center gap-1 max-w-md px-2">
          <p
            className={`italic font-serif leading-relaxed ${
              isCompact
                ? "text-[10px] sm:text-[11px]"
                : isPreview
                  ? "text-xs"
                  : "text-xs sm:text-sm"
            }`}
            style={{ color: mutedTextColor }}
          >
            &ldquo;{translation}&rdquo;
          </p>
          {reference && (
            <span
              className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-medium opacity-85 mt-0.5"
              style={{ color: accentColor }}
            >
              — {reference}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
