"use client";

import { memo } from "react";
import { EventDesignData } from "@/types/invitation";
import { hexToRgba } from "@/lib/utils/colors";
import { resolveCardBackdropUrl } from "@/lib/templates/presets";

interface CardArtBackdropProps {
  theme: EventDesignData["theme"];
  bounded?: boolean;
}

export const CardArtBackdrop = memo(function CardArtBackdrop({
  theme,
  bounded = false,
}: CardArtBackdropProps) {
  const backdropUrl = resolveCardBackdropUrl(theme.cardArt);
  if (!backdropUrl) return null;

  const opacity = Math.min(0.65, Math.max(0.08, theme.cardArt.backdropOpacity));
  const bg = theme.palette.background;
  const posClass = bounded ? "absolute inset-0" : "fixed md:absolute inset-0";

  return (
    <div
      aria-hidden="true"
      data-testid="card-art-backdrop"
      className={`pointer-events-none ${posClass} z-0 overflow-hidden select-none`}
    >
      {/* Curated marriage scene or user-uploaded custom card wallpaper */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={backdropUrl}
        alt=""
        style={{ opacity }}
        className="w-full h-full object-cover object-center transition-opacity duration-500"
      />

      {/* Center breathing vignette & edge fade so invitation typography stays crisp */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 68% 60% at 50% 44%, ${hexToRgba(bg, 0.42)} 0%, ${hexToRgba(bg, 0.14)} 68%, ${hexToRgba(bg, 0.24)} 100%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${hexToRgba(bg, 0.22)} 0%, transparent 16%, transparent 80%, ${hexToRgba(bg, 0.54)} 100%)`,
        }}
      />
    </div>
  );
});
