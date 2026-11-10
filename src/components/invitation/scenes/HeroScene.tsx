"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Calendar, MapPin, Sparkles } from "lucide-react";
import { EventDesignData } from "@/types/invitation";
import {
  getBodyFontFamily,
  getDisplayFontFamily,
  getScriptFontFamily,
} from "@/lib/utils/fonts";

interface HeroSceneProps {
  id?: string;
  designData: EventDesignData;
  eventDate: string;
  venueName: string;
}

export function HeroScene({
  id = "invite-hero",
  designData,
  eventDate,
  venueName,
}: HeroSceneProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const { theme, content, motion: motionCfg } = designData;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const yOffset =
        motionCfg.preset === "playful-pop"
          ? 36
          : motionCfg.preset === "editorial-fade"
            ? 14
            : 26;

      gsap.from(".hero-stagger", {
        y: yOffset,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        clearProps: "transform",
      });

      gsap.from(".hero-line", {
        scaleX: 0,
        duration: 0.85,
        delay: 0.35,
        ease: "power2.out",
      });
    }, el);

    return () => ctx.revert();
  }, [motionCfg.preset]);

  const dateObj = new Date(eventDate);
  const validDate = !Number.isNaN(dateObj.getTime());
  const dateDisplay = validDate
    ? dateObj.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        ...(mounted ? {} : { timeZone: "UTC" }),
      })
    : "Save the Date";
  const timeDisplay = validDate
    ? dateObj.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        ...(mounted ? {} : { timeZone: "UTC" }),
      })
    : "";

  return (
    <section
      id={id}
      ref={containerRef}
      className="scroll-mt-4 relative px-6 pt-12 pb-10 text-center flex flex-col items-center"
    >
      {/* Ornate header crest */}
      <div
        className="hero-stagger inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-[11px] uppercase tracking-[0.24em]"
        style={{
          borderColor: `${theme.palette.accent}55`,
          color: theme.palette.accent,
          backgroundColor: `${theme.palette.surface}BB`,
          fontFamily: getBodyFontFamily(theme.typography.bodyFont),
        }}
      >
        <Sparkles className="w-3 h-3" />
        <span>Cordially Invited</span>
      </div>

      {/* Host Line */}
      <p
        className="hero-stagger mt-7 text-xs sm:text-sm uppercase tracking-[0.22em] max-w-md leading-relaxed"
        style={{
          color: theme.palette.mutedText,
          fontFamily: getBodyFontFamily(theme.typography.bodyFont),
        }}
      >
        {content.hostLine}
      </p>

      {/* Main Headline */}
      <h1
        className="hero-stagger mt-4 text-4xl sm:text-5xl font-semibold tracking-wide leading-[1.12] max-w-lg"
        style={{
          color: theme.palette.primary,
          fontFamily: getDisplayFontFamily(theme.typography.displayFont),
        }}
      >
        {content.headline}
      </h1>

      {/* Animated Gold/Accent Hairline */}
      <div
        className="hero-line mt-5 h-[1.5px] w-28 origin-center"
        style={{
          background: `linear-gradient(90deg, transparent, ${theme.palette.accent}, transparent)`,
        }}
      />

      {/* Subtitle */}
      <p
        className="hero-stagger mt-5 text-base sm:text-lg max-w-md leading-relaxed"
        style={{
          color: theme.palette.text,
          fontFamily: getScriptFontFamily(theme.typography.scriptFont),
          fontSize:
            theme.typography.scriptFont === "great-vibes" ? "1.6rem" : "1.15rem",
        }}
      >
        {content.subtitle}
      </p>

      {/* Optional Hero Portrait / Cover Image */}
      {content.heroImageUrl && (
        <div
          className="hero-stagger mt-8 relative w-full max-w-sm aspect-[4/5] rounded-[28px] overflow-hidden border shadow-xl"
          style={{
            borderColor: `${theme.palette.accent}66`,
            backgroundColor: theme.palette.surface,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={content.heroImageUrl}
            alt={content.headline}
            className="w-full h-full object-cover"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-2.5 rounded-[20px] border"
            style={{ borderColor: `${theme.palette.accent}55` }}
          />
        </div>
      )}

      {/* Key Event Pill Summary */}
      <div
        className="hero-stagger mt-8 w-full max-w-md rounded-2xl border p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left"
        style={{
          backgroundColor: theme.palette.surface,
          borderColor: `${theme.palette.accent}40`,
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="p-2 rounded-xl shrink-0"
            style={{
              backgroundColor: `${theme.palette.accent}1A`,
              color: theme.palette.accent,
            }}
          >
            <Calendar className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p
              className="text-[10px] uppercase tracking-[0.2em]"
              style={{ color: theme.palette.mutedText }}
            >
              Date &amp; Time
            </p>
            <p
              className="text-xs sm:text-sm font-medium mt-0.5 leading-snug"
              style={{ color: theme.palette.text }}
            >
              {dateDisplay}
            </p>
            {timeDisplay && (
              <p
                className="text-xs mt-0.5"
                style={{ color: theme.palette.mutedText }}
              >
                {timeDisplay}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div
            className="p-2 rounded-xl shrink-0"
            style={{
              backgroundColor: `${theme.palette.accent}1A`,
              color: theme.palette.accent,
            }}
          >
            <MapPin className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p
              className="text-[10px] uppercase tracking-[0.2em]"
              style={{ color: theme.palette.mutedText }}
            >
              Venue
            </p>
            <p
              className="text-xs sm:text-sm font-medium mt-0.5 leading-snug"
              style={{ color: theme.palette.text }}
            >
              {venueName}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

