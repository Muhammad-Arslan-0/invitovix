"use client";

import { memo } from "react";
import { CardArtMotif, EventDesignData } from "@/types/invitation";

interface CardOrnamentFrameProps {
  theme: EventDesignData["theme"];
  bounded?: boolean;
}

function CornerFiligree({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 36 36" className="w-7 h-7" fill="none">
      <path
        d="M3 22V6C3 4.34315 4.34315 3 6 3H22"
        stroke={color}
        strokeWidth="1.25"
        strokeOpacity="0.8"
      />
      <path
        d="M8 17V9.5C8 8.67157 8.67157 8 9.5 8H17"
        stroke={color}
        strokeWidth="0.9"
        strokeOpacity="0.55"
      />
      <circle cx="9.5" cy="9.5" r="2" fill={color} fillOpacity="0.65" />
      <path
        d="M15 3C15 5.5 13 7.5 10.5 7.5"
        stroke={color}
        strokeWidth="0.9"
        strokeOpacity="0.55"
      />
      <path
        d="M3 15C5.5 15 7.5 13 7.5 10.5"
        stroke={color}
        strokeWidth="0.9"
        strokeOpacity="0.55"
      />
    </svg>
  );
}

function FloralSprigCorner({
  primary,
  accent,
  secondary,
}: {
  primary: string;
  accent: string;
  secondary: string;
}) {
  return (
    <svg viewBox="0 0 180 180" className="w-36 h-36 sm:w-44 sm:h-44" fill="none">
      {/* Flowing botanical stems */}
      <path
        d="M6 12C44 18 76 34 114 66"
        stroke={primary}
        strokeWidth="1.2"
        strokeOpacity="0.5"
        strokeLinecap="round"
      />
      <path
        d="M12 6C22 46 36 84 62 126"
        stroke={secondary}
        strokeWidth="1.1"
        strokeOpacity="0.42"
        strokeLinecap="round"
      />
      {/* Leaves */}
      <path
        d="M52 24C64 14 78 16 86 24C74 30 62 31 52 24Z"
        fill={primary}
        fillOpacity="0.18"
        stroke={primary}
        strokeWidth="0.9"
        strokeOpacity="0.45"
      />
      <path
        d="M24 54C16 68 18 82 28 90C34 77 33 64 24 54Z"
        fill={secondary}
        fillOpacity="0.18"
        stroke={secondary}
        strokeWidth="0.9"
        strokeOpacity="0.42"
      />
      <path
        d="M84 44C97 38 110 42 117 52C104 56 92 54 84 44Z"
        fill={primary}
        fillOpacity="0.15"
        stroke={primary}
        strokeWidth="0.85"
        strokeOpacity="0.4"
      />
      {/* Hero layered peony bloom */}
      <g transform="translate(26, 26)">
        <circle cx="0" cy="0" r="18" fill={accent} fillOpacity="0.16" />
        <path
          d="M0 -17C7 -17 13 -10 10 -2C17 1 17 10 9 12C11 19 2 22 -4 16C-12 20 -18 12 -13 5C-20 0 -17 -10 -9 -11C-10 -16 -5 -17 0 -17Z"
          fill={accent}
          fillOpacity="0.22"
          stroke={accent}
          strokeWidth="1.15"
          strokeOpacity="0.72"
        />
        <circle
          cx="0"
          cy="0"
          r="7.5"
          fill={primary}
          fillOpacity="0.15"
          stroke={accent}
          strokeWidth="1"
          strokeOpacity="0.75"
        />
        <circle cx="0" cy="0" r="2.6" fill={accent} fillOpacity="0.85" />
      </g>
      {/* Secondary bud */}
      <g transform="translate(68, 22)">
        <circle
          cx="0"
          cy="0"
          r="7"
          fill={accent}
          fillOpacity="0.22"
          stroke={accent}
          strokeWidth="0.95"
          strokeOpacity="0.6"
        />
        <circle cx="0" cy="0" r="2.2" fill={accent} fillOpacity="0.75" />
      </g>
      <g transform="translate(22, 70)">
        <circle
          cx="0"
          cy="0"
          r="6.5"
          fill={accent}
          fillOpacity="0.2"
          stroke={accent}
          strokeWidth="0.95"
          strokeOpacity="0.58"
        />
        <circle cx="0" cy="0" r="2" fill={accent} fillOpacity="0.75" />
      </g>
      {/* Fine gold berry stipples */}
      <circle cx="102" cy="56" r="2" fill={accent} fillOpacity="0.65" />
      <circle cx="118" cy="68" r="1.5" fill={accent} fillOpacity="0.55" />
      <circle cx="56" cy="108" r="2" fill={accent} fillOpacity="0.6" />
      <circle cx="67" cy="126" r="1.4" fill={accent} fillOpacity="0.5" />
    </svg>
  );
}

function MarigoldGarlandHeader({
  primary,
  accent,
}: {
  primary: string;
  accent: string;
}) {
  return (
    <svg
      viewBox="0 0 440 112"
      preserveAspectRatio="none"
      className="w-full h-24 sm:h-28"
      fill="none"
    >
      {/* Draped garland scallops */}
      <path
        d="M0 10C55 56 105 56 146 10C185 52 255 52 294 10C335 56 385 56 440 10"
        stroke={accent}
        strokeWidth="1.6"
        strokeOpacity="0.65"
      />
      <path
        d="M0 16C55 64 105 64 146 16C185 60 255 60 294 16C335 64 385 64 440 16"
        stroke={primary}
        strokeWidth="0.9"
        strokeDasharray="3 4"
        strokeOpacity="0.45"
      />
      {/* Marigold blossoms along curves */}
      {[36, 73, 110, 185, 220, 255, 330, 367, 404].map((x, idx) => {
        const y = idx % 3 === 1 ? 47 : 34;
        return (
          <g key={x} transform={`translate(${x}, ${y})`}>
            <circle
              cx="0"
              cy="0"
              r="7.5"
              fill={accent}
              fillOpacity="0.28"
              stroke={accent}
              strokeWidth="1"
              strokeOpacity="0.7"
            />
            <circle cx="0" cy="0" r="3.2" fill={primary} fillOpacity="0.55" />
          </g>
        );
      })}
      {/* Hanging brass bell / lantern strands */}
      {[146, 294].map((x) => (
        <g key={x} transform={`translate(${x}, 10)`}>
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="46"
            stroke={accent}
            strokeWidth="1"
            strokeOpacity="0.6"
          />
          <circle cx="0" cy="20" r="3" fill="#FFFDF8" stroke={accent} strokeWidth="0.9" />
          <circle cx="0" cy="32" r="3" fill="#FFFDF8" stroke={accent} strokeWidth="0.9" />
          <path
            d="M-6 48C-6 43 6 43 6 48L8 56H-8L-6 48Z"
            fill={accent}
            fillOpacity="0.32"
            stroke={accent}
            strokeWidth="1"
          />
          <circle cx="0" cy="60" r="2.2" fill={primary} fillOpacity="0.7" />
        </g>
      ))}
    </svg>
  );
}

function RoyalArchCrest({
  primary,
  accent,
}: {
  primary: string;
  accent: string;
}) {
  return (
    <svg viewBox="0 0 440 165" className="w-full h-36 sm:h-40" fill="none">
      {/* Cusped Mughal arch outline */}
      <path
        d="M28 160V92C28 54 64 42 96 44C122 24 152 24 176 34C194 14 208 8 220 6C232 8 246 14 264 34C288 24 318 24 344 44C376 42 412 54 412 92V160"
        stroke={accent}
        strokeWidth="1.5"
        strokeOpacity="0.65"
      />
      <path
        d="M38 160V94C38 62 70 50 100 52C125 34 154 33 177 43C195 24 209 18 220 15C231 18 245 24 263 43C286 33 315 34 340 52C370 50 402 62 402 94V160"
        stroke={primary}
        strokeWidth="0.9"
        strokeOpacity="0.4"
      />
      {/* Delicate keystone jewel */}
      <polygon
        points="220,16 226,26 220,36 214,26"
        fill={accent}
        fillOpacity="0.28"
        stroke={accent}
        strokeWidth="1"
      />
      {/* Corner rosette filigree */}
      <circle cx="48" cy="30" r="9" stroke={accent} strokeWidth="0.85" strokeOpacity="0.4" />
      <circle cx="48" cy="30" r="3" fill={accent} fillOpacity="0.5" />
      <circle cx="392" cy="30" r="9" stroke={accent} strokeWidth="0.85" strokeOpacity="0.4" />
      <circle cx="392" cy="30" r="3" fill={accent} fillOpacity="0.5" />
    </svg>
  );
}

function AbstractOrganicLayers({
  primary,
  accent,
  secondary,
}: {
  primary: string;
  accent: string;
  secondary: string;
}) {
  return (
    <>
      <svg
        viewBox="0 0 260 220"
        className="w-52 h-44 sm:w-60 sm:h-52 -translate-x-4 -translate-y-4"
        fill="none"
      >
        <path
          d="M-20 120C22 142 90 120 118 68C144 20 198 4 240 16"
          stroke={accent}
          strokeWidth="1.2"
          strokeOpacity="0.55"
        />
        <path
          d="M0 0C72 0 112 46 92 98C72 150 22 172 -10 150Z"
          fill={accent}
          fillOpacity="0.11"
        />
        <path
          d="M35 -10C92 10 116 58 84 94C56 126 12 110 -5 64Z"
          fill={primary}
          fillOpacity="0.06"
        />
        <ellipse
          cx="124"
          cy="44"
          rx="44"
          ry="18"
          transform="rotate(-22 124 44)"
          stroke={secondary}
          strokeWidth="0.9"
          strokeOpacity="0.38"
        />
      </svg>
      <svg
        viewBox="0 0 240 200"
        className="absolute bottom-14 right-0 w-48 h-40 translate-x-6"
        fill="none"
      >
        <path
          d="M250 85C192 52 135 76 112 124C92 166 56 186 14 176"
          stroke={accent}
          strokeWidth="1.15"
          strokeOpacity="0.45"
        />
        <circle cx="195" cy="148" r="56" fill={accent} fillOpacity="0.09" />
        <circle
          cx="166"
          cy="132"
          r="32"
          stroke={primary}
          strokeWidth="0.85"
          strokeOpacity="0.28"
        />
      </svg>
    </>
  );
}

function CelestialStarsOverlay({
  accent,
  primary,
}: {
  accent: string;
  primary: string;
}) {
  return (
    <svg viewBox="0 0 440 150" className="w-full h-32 sm:h-36" fill="none">
      {/* Subtle orbital halo */}
      <path
        d="M52 0C88 68 152 102 220 102C288 102 352 68 388 0"
        stroke={accent}
        strokeWidth="0.9"
        strokeDasharray="2 5"
        strokeOpacity="0.42"
      />
      {/* 4-point sparkles */}
      {[
        { x: 54, y: 38, s: 1 },
        { x: 112, y: 24, s: 0.7 },
        { x: 332, y: 28, s: 0.75 },
        { x: 388, y: 46, s: 1.05 },
        { x: 220, y: 18, s: 0.9 },
      ].map((star, idx) => (
        <path
          key={idx}
          transform={`translate(${star.x}, ${star.y}) scale(${star.s})`}
          d="M0 -9L2.1 -2.1L9 0L2.1 2.1L0 9L-2.1 2.1L-9 0L-2.1 -2.1Z"
          fill={accent}
          fillOpacity="0.72"
        />
      ))}
      <circle cx="82" cy="56" r="1.5" fill={primary} fillOpacity="0.6" />
      <circle cx="152" cy="48" r="1.8" fill={accent} fillOpacity="0.55" />
      <circle cx="290" cy="46" r="1.6" fill={accent} fillOpacity="0.55" />
      <circle cx="362" cy="70" r="1.5" fill={primary} fillOpacity="0.6" />
    </svg>
  );
}

export const CardOrnamentFrame = memo(function CardOrnamentFrame({
  theme,
  bounded = false,
}: CardOrnamentFrameProps) {
  const { palette, cardArt } = theme;
  const { motif, borderStyle } = cardArt;
  const posClass = bounded ? "absolute inset-0" : "fixed md:absolute inset-0";

  if (motif === "none" && borderStyle === "none") return null;

  return (
    <div
      aria-hidden="true"
      data-testid="card-ornament-frame"
      className={`pointer-events-none ${posClass} z-10 overflow-hidden select-none`}
    >
      {/* Frame Borders */}
      {borderStyle === "gold-filigree" && (
        <div
          className="absolute inset-2.5 sm:inset-3 rounded-2xl border"
          style={{ borderColor: `${palette.accent}52` }}
        >
          <div
            className="absolute inset-1.5 rounded-xl border"
            style={{ borderColor: `${palette.accent}28` }}
          />
          <div className="absolute -top-0.5 -left-0.5">
            <CornerFiligree color={palette.accent} />
          </div>
          <div className="absolute -top-0.5 -right-0.5 scale-x-[-1]">
            <CornerFiligree color={palette.accent} />
          </div>
          <div className="absolute -bottom-0.5 -left-0.5 scale-y-[-1]">
            <CornerFiligree color={palette.accent} />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 scale-x-[-1] scale-y-[-1]">
            <CornerFiligree color={palette.accent} />
          </div>
        </div>
      )}

      {borderStyle === "arch-frame" && (
        <div
          className="absolute inset-2.5 sm:inset-3 rounded-t-[190px] rounded-b-2xl border"
          style={{ borderColor: `${palette.accent}58` }}
        >
          <div
            className="absolute inset-1.5 rounded-t-[182px] rounded-b-xl border"
            style={{ borderColor: `${palette.accent}2C` }}
          />
        </div>
      )}

      {borderStyle === "editorial-double" && (
        <div
          className="absolute inset-3 border"
          style={{ borderColor: `${palette.primary}38` }}
        >
          <div
            className="absolute inset-1.5 border"
            style={{ borderColor: `${palette.accent}42` }}
          />
        </div>
      )}

      {borderStyle === "botanical-vine" && (
        <div
          className="absolute inset-3 rounded-3xl border border-dashed"
          style={{ borderColor: `${palette.accent}4A` }}
        />
      )}

      {/* Subtle Lower Corner Flourishes that frame scrolled scenes without crossing headers */}
      {motif === "floral-bouquet" && (
        <div className="absolute bottom-14 left-0 scale-y-[-1] opacity-55">
          <FloralSprigCorner
            primary={palette.primary}
            accent={palette.accent}
            secondary={palette.secondary}
          />
        </div>
      )}

      {motif === "abstract-organic" && (
        <svg
          viewBox="0 0 240 200"
          className="absolute bottom-14 right-0 w-44 h-36 translate-x-6 opacity-85"
          fill="none"
        >
          <path
            d="M250 85C192 52 135 76 112 124C92 166 56 186 14 176"
            stroke={palette.accent}
            strokeWidth="1.15"
            strokeOpacity="0.45"
          />
          <circle cx="195" cy="148" r="56" fill={palette.accent} fillOpacity="0.09" />
          <circle
            cx="166"
            cy="132"
            r="32"
            stroke={palette.primary}
            strokeWidth="0.85"
            strokeOpacity="0.28"
          />
        </svg>
      )}
    </div>
  );
});

export const CardHeaderCrown = memo(function CardHeaderCrown({
  theme,
}: {
  theme: EventDesignData["theme"];
}) {
  const { palette, cardArt } = theme;
  const { motif } = cardArt;

  if (motif === "none") return null;

  return (
    <div
      aria-hidden="true"
      data-testid="card-header-crown"
      className="pointer-events-none absolute inset-x-0 top-0 z-10 overflow-hidden select-none"
    >
      {motif === "floral-bouquet" && (
        <div className="relative w-full h-44">
          <div className="absolute top-0 left-0">
            <FloralSprigCorner
              primary={palette.primary}
              accent={palette.accent}
              secondary={palette.secondary}
            />
          </div>
          <div className="absolute top-0 right-0 scale-x-[-1]">
            <FloralSprigCorner
              primary={palette.primary}
              accent={palette.accent}
              secondary={palette.secondary}
            />
          </div>
        </div>
      )}

      {motif === "marigold-garland" && (
        <MarigoldGarlandHeader
          primary={palette.primary}
          accent={palette.accent}
        />
      )}

      {motif === "royal-arch" && (
        <RoyalArchCrest primary={palette.primary} accent={palette.accent} />
      )}

      {motif === "abstract-organic" && (
        <div className="relative w-full h-44">
          <AbstractOrganicLayers
            primary={palette.primary}
            accent={palette.accent}
            secondary={palette.secondary}
          />
        </div>
      )}

      {motif === "celestial-stars" && (
        <CelestialStarsOverlay
          accent={palette.accent}
          primary={palette.primary}
        />
      )}
    </div>
  );
});

export function OrnamentalDivider({
  motif,
  accentColor,
  primaryColor,
}: {
  motif: CardArtMotif;
  accentColor: string;
  primaryColor: string;
}) {
  return (
    <div
      aria-hidden="true"
      className="my-2 flex items-center justify-center gap-3 px-6 opacity-80"
    >
      <div
        className="h-px flex-1 max-w-[72px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}77)`,
        }}
      />
      {motif === "floral-bouquet" || motif === "marigold-garland" ? (
        <svg viewBox="0 0 40 20" className="w-8 h-4" fill="none">
          <path
            d="M4 10C10 6 14 6 17 10C14 14 10 14 4 10Z"
            fill={primaryColor}
            fillOpacity="0.22"
          />
          <path
            d="M36 10C30 6 26 6 23 10C26 14 30 14 36 10Z"
            fill={primaryColor}
            fillOpacity="0.22"
          />
          <circle
            cx="20"
            cy="10"
            r="4.2"
            fill={accentColor}
            fillOpacity="0.35"
            stroke={accentColor}
            strokeWidth="1"
          />
        </svg>
      ) : motif === "abstract-organic" ? (
        <svg viewBox="0 0 36 16" className="w-8 h-3.5" fill="none">
          <ellipse cx="14" cy="8" rx="6" ry="4" stroke={accentColor} strokeWidth="1" />
          <ellipse cx="22" cy="8" rx="6" ry="4" stroke={primaryColor} strokeWidth="1" strokeOpacity="0.65" />
        </svg>
      ) : (
        <span
          className="w-2 h-2 rotate-45 border"
          style={{
            borderColor: accentColor,
            backgroundColor: `${accentColor}44`,
          }}
        />
      )}
      <div
        className="h-px flex-1 max-w-[72px]"
        style={{
          background: `linear-gradient(90deg, ${accentColor}77, transparent)`,
        }}
      />
    </div>
  );
}
