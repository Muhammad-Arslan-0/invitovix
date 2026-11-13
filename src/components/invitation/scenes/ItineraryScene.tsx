"use client";

import { useMemo, useState, type RefObject } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, ExternalLink, MapPin, Sparkles } from "lucide-react";
import { EventDesignData, ItineraryItem } from "@/types/invitation";
import {
  getBodyFontFamily,
  getDisplayFontFamily,
} from "@/lib/utils/fonts";
import { getInvitationTypeMeta } from "@/lib/templates/categories";

interface ItinerarySceneProps {
  id?: string;
  designData: EventDesignData;
  eventType?: string;
  guestAccess?: string | null;
  scrollRootRef?: RefObject<HTMLDivElement | null>;
}

function isReceptionItem(item: ItineraryItem): boolean {
  if (item.guestTier === "reception_only") return true;
  const t = (item.title + " " + (item.dayLabel ?? "")).toLowerCase();
  return t.includes("reception") || t.includes("valima") || t.includes("walima");
}

export function ItineraryScene({
  id = "invite-schedule",
  designData,
  eventType = "wedding",
  guestAccess: propGuestAccess,
  scrollRootRef,
}: ItinerarySceneProps) {
  const { theme, content, sections } = designData;
  const typeMeta = getInvitationTypeMeta(eventType);

  // Determine effective guest access from prop or browser search params
  const effectiveAccess = useMemo(() => {
    if (propGuestAccess) return propGuestAccess.toLowerCase();
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const val = sp.get("access") || sp.get("tier") || sp.get("events") || sp.get("invite");
      if (val) return val.toLowerCase();
    }
    return "all";
  }, [propGuestAccess]);

  const isReceptionGuest = effectiveAccess === "reception" || effectiveAccess === "valima";

  // Filter items according to guest invitation tier
  const visibleItems = useMemo(() => {
    if (!isReceptionGuest) {
      return content.itinerary;
    }
    const receptionItems = content.itinerary.filter(isReceptionItem);
    // If no explicit reception items tagged, show items marked as "all" or fallback to last item
    if (receptionItems.length > 0) {
      return receptionItems;
    }
    const allItems = content.itinerary.filter((i) => i.guestTier === "all" || !i.guestTier);
    return allItems.length > 0 ? allItems : content.itinerary.slice(-1);
  }, [content.itinerary, isReceptionGuest]);

  // Multi-day filter state for 3-day wedding guests
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>("all");

  const distinctDays = useMemo(() => {
    const days: string[] = [];
    for (const item of visibleItems) {
      const label = item.dayLabel?.trim();
      if (label && !days.includes(label)) {
        days.push(label);
      }
    }
    return days;
  }, [visibleItems]);

  const filteredByDay = useMemo(() => {
    if (selectedDayFilter === "all") return visibleItems;
    return visibleItems.filter((i) => i.dayLabel?.trim() === selectedDayFilter);
  }, [visibleItems, selectedDayFilter]);

  if (!sections.showItinerary || content.itinerary.length === 0) {
    return null;
  }

  const isWedding = typeMeta.domain === "wedding";

  // Clean, elegant headings without ever showing "Evening Schedule"
  const headingTitle = isReceptionGuest
    ? "Wedding Reception"
    : isWedding
      ? distinctDays.length > 1
        ? "Wedding Ceremonies"
        : "Ceremonies & Events"
      : typeMeta.itineraryHeading;

  const eyebrowTitle = isReceptionGuest
    ? "You Are Cordially Invited"
    : isWedding
      ? distinctDays.length > 1
        ? "Multi-Day Festivities"
        : "Wedding Festivities"
      : typeMeta.itineraryEyebrow;

  return (
    <section id={id} className="scroll-mt-14 px-5 sm:px-7 py-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <p
          className="text-[11px] uppercase tracking-[0.25em] font-semibold"
          style={{ color: theme.palette.accent }}
        >
          {eyebrowTitle}
        </p>
        <h2
          className="mt-1 text-2xl sm:text-3xl font-semibold"
          style={{
            color: theme.palette.primary,
            fontFamily: getDisplayFontFamily(theme.typography.displayFont),
          }}
        >
          {headingTitle}
        </h2>

        {/* Reception Only Badge Banner */}
        {isReceptionGuest && (
          <div
            className="mt-3.5 inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-medium shadow-2xs"
            style={{
              borderColor: `${theme.palette.accent}55`,
              backgroundColor: `${theme.palette.surface}F0`,
              color: theme.palette.primary,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: theme.palette.accent }} />
            <span>Reception &amp; Dinner Invitation</span>
          </div>
        )}

        {/* Multi-Day Navigation Pills (When multiple days like Mehndi, Baraat, Reception exist) */}
        {!isReceptionGuest && distinctDays.length > 1 && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedDayFilter("all")}
              className={`rounded-full px-3 py-1 text-[11px] font-medium transition cursor-pointer border ${
                selectedDayFilter === "all"
                  ? "shadow-xs font-semibold"
                  : "hover:opacity-85"
              }`}
              style={{
                backgroundColor:
                  selectedDayFilter === "all"
                    ? theme.palette.primary
                    : `${theme.palette.surface}D0`,
                color:
                  selectedDayFilter === "all"
                    ? theme.palette.background
                    : theme.palette.text,
                borderColor: `${theme.palette.accent}40`,
              }}
            >
              All Days ({distinctDays.length})
            </button>
            {distinctDays.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDayFilter(day)}
                className={`rounded-full px-3 py-1 text-[11px] font-medium transition cursor-pointer border ${
                  selectedDayFilter === day
                    ? "shadow-xs font-semibold"
                    : "hover:opacity-85"
                }`}
                style={{
                  backgroundColor:
                    selectedDayFilter === day
                      ? theme.palette.primary
                      : `${theme.palette.surface}D0`,
                  color:
                    selectedDayFilter === day
                      ? theme.palette.background
                      : theme.palette.text,
                  borderColor: `${theme.palette.accent}40`,
                }}
              >
                {day}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Timeline List */}
      <div className="relative pl-6 space-y-4">
        {/* Timeline vertical rule */}
        <div
          aria-hidden="true"
          className="absolute left-2.5 top-3 bottom-3 w-px"
          style={{ backgroundColor: `${theme.palette.accent}55` }}
        />

        {filteredByDay.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{
              once: true,
              amount: 0.05,
              ...(scrollRootRef ? { root: scrollRootRef } : {}),
            }}
            transition={{
              duration: 0.45,
              delay: idx * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative rounded-2xl border p-4 sm:p-5 shadow-sm backdrop-blur-xs transition-shadow hover:shadow-md"
            style={{
              backgroundColor: `${theme.palette.surface}F2`,
              borderColor: `${theme.palette.accent}38`,
            }}
          >
            {/* Milestone node */}
            <span
              aria-hidden="true"
              className="absolute -left-[20px] top-5 w-3 h-3 rounded-full border-2"
              style={{
                backgroundColor: theme.palette.accent,
                borderColor: theme.palette.background,
              }}
            />

            {/* Top row: Day badge, Date, Time */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {item.dayLabel && (
                <span
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase shadow-2xs"
                  style={{
                    backgroundColor: `${theme.palette.primary}18`,
                    color: theme.palette.primary,
                    border: `1px solid ${theme.palette.primary}30`,
                  }}
                >
                  {item.dayLabel}
                </span>
              )}

              {item.date && (
                <div
                  className="inline-flex items-center gap-1 text-[11px] font-medium"
                  style={{ color: theme.palette.mutedText }}
                >
                  <Calendar className="w-3 h-3" style={{ color: theme.palette.accent }} />
                  <span>{item.date}</span>
                </div>
              )}

              {item.time && (
                <div
                  className="inline-flex items-center gap-1 text-[11px] font-semibold ml-auto"
                  style={{ color: theme.palette.accent }}
                >
                  <Clock className="w-3 h-3" />
                  <span>{item.time}</span>
                </div>
              )}
            </div>

            {/* Event Title */}
            <h3
              className="text-base sm:text-lg font-semibold leading-tight"
              style={{
                color: theme.palette.text,
                fontFamily: getDisplayFontFamily(theme.typography.displayFont),
              }}
            >
              {item.title}
            </h3>

            {/* Description */}
            {item.description && (
              <p
                className="mt-1.5 text-xs sm:text-sm leading-relaxed"
                style={{
                  color: theme.palette.mutedText,
                  fontFamily: getBodyFontFamily(theme.typography.bodyFont),
                }}
              >
                {item.description}
              </p>
            )}

            {/* Venue & Location if specified for this ceremony */}
            {item.venue && (
              <div className="mt-3 pt-2.5 border-t border-stone-200/50 flex flex-wrap items-center justify-between gap-2">
                <div
                  className="inline-flex items-center gap-1.5 text-xs font-medium"
                  style={{ color: theme.palette.text }}
                >
                  <MapPin
                    className="w-3.5 h-3.5 shrink-0"
                    style={{ color: theme.palette.accent }}
                  />
                  <span>
                    {item.venue}
                    {item.venueAddress ? ` · ${item.venueAddress}` : ""}
                  </span>
                </div>
                {item.mapUrl && (
                  <a
                    href={item.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-medium hover:underline"
                    style={{ color: theme.palette.accent }}
                  >
                    <span>Directions</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}

            {/* Ceremony Dress Code hint if specified */}
            {item.dressCode && (
              <div className="mt-2">
                <span
                  className="inline-block rounded-md px-2 py-0.5 text-[10px] font-medium"
                  style={{
                    backgroundColor: `${theme.palette.accent}15`,
                    color: theme.palette.mutedText,
                  }}
                >
                  Attire: {item.dressCode}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
