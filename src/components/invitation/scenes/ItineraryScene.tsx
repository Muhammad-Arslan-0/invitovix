"use client";

import { useMemo, useState, type RefObject } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, ExternalLink, MapPin } from "lucide-react";
import { EventDesignData } from "@/types/invitation";
import {
  getBodyFontFamily,
  getDisplayFontFamily,
} from "@/lib/utils/fonts";
import { getInvitationTypeMeta } from "@/lib/templates/categories";
import { useCardLanguage } from "@/lib/i18n/CardLanguageContext";

interface ItinerarySceneProps {
  id?: string;
  designData: EventDesignData;
  eventType?: string;
  guestAccess?: string | null;
  scrollRootRef?: RefObject<HTMLDivElement | null>;
}

export function ItineraryScene({
  id = "invite-schedule",
  designData,
  eventType = "wedding",
  scrollRootRef,
}: ItinerarySceneProps) {
  const { t, isRTL, language } = useCardLanguage();
  const { theme, content, sections } = designData;
  const typeMeta = getInvitationTypeMeta(eventType);

  const visibleItems = content.itinerary;

  // Filter state when the organizer includes multiple distinct day labels (e.g. Day 1, Day 2)
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

  const headingTitle = isWedding
    ? distinctDays.length > 1
      ? language !== "en"
        ? t("weddingCeremonies")
        : "Wedding Ceremonies"
      : language !== "en"
        ? t("ceremoniesAndEvents")
        : "Ceremonies & Events"
    : typeMeta.itineraryHeading;

  const eyebrowTitle = isWedding
    ? distinctDays.length > 1
      ? language !== "en"
        ? t("celebrationSchedule")
        : "Celebration Schedule"
      : language !== "en"
        ? t("weddingProgram")
        : "Wedding Program"
    : typeMeta.itineraryEyebrow;

  return (
    <section
      id={id}
      dir={isRTL ? "rtl" : "ltr"}
      className="scroll-mt-14 px-5 sm:px-7 py-8 max-w-lg mx-auto"
    >
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
            fontFamily: getDisplayFontFamily(theme.typography.displayFont, language),
          }}
        >
          {headingTitle}
        </h2>

        {/* Multi-Day Navigation Pills (When organizer has distinct days) */}
        {distinctDays.length > 1 && (
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
              {t("allEvents")} ({distinctDays.length})
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
      <div className={`relative ${isRTL ? "pr-6" : "pl-6"} space-y-4`}>
        {/* Timeline vertical rule */}
        <div
          aria-hidden="true"
          className={`absolute ${isRTL ? "right-2.5" : "left-2.5"} top-3 bottom-3 w-px`}
          style={{ backgroundColor: `${theme.palette.accent}55` }}
        />

        {filteredByDay.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: isRTL ? 12 : -12 }}
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
              className={`absolute ${isRTL ? "-right-[20px]" : "-left-[20px]"} top-5 w-3 h-3 rounded-full border-2`}
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
                  className="inline-flex items-center gap-1 text-xs"
                  style={{ color: theme.palette.mutedText }}
                >
                  <Calendar className="w-3 h-3 shrink-0" />
                  <span>{item.date}</span>
                </div>
              )}

              {item.time && (
                <div
                  className="inline-flex items-center gap-1 text-xs font-medium ml-auto"
                  style={{ color: theme.palette.accent }}
                >
                  <Clock className="w-3 h-3 shrink-0" />
                  <span>{item.time}</span>
                </div>
              )}
            </div>

            {/* Main title */}
            <h3
              className="text-lg font-semibold leading-snug"
              style={{
                color: theme.palette.primary,
                fontFamily: getDisplayFontFamily(theme.typography.displayFont, language),
              }}
            >
              {item.title}
            </h3>

            {/* Description */}
            {item.description && (
              <p
                className="mt-1.5 text-xs sm:text-sm leading-relaxed"
                style={{
                  color: theme.palette.text,
                  fontFamily: getBodyFontFamily(theme.typography.bodyFont, language),
                }}
              >
                {item.description}
              </p>
            )}

            {/* Location & Dress code footer */}
            {(item.venue || item.dressCode) && (
              <div
                className="mt-3 pt-3 border-t flex flex-wrap items-center justify-between gap-2 text-xs"
                style={{ borderColor: `${theme.palette.accent}24` }}
              >
                {item.venue && (
                  <div
                    className="inline-flex items-center gap-1"
                    style={{ color: theme.palette.mutedText }}
                  >
                    <MapPin
                      className="w-3 h-3 shrink-0"
                      style={{ color: theme.palette.accent }}
                    />
                    <span>{item.venue}</span>
                    {item.mapUrl && (
                      <a
                        href={item.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-1 hover:underline inline-flex items-center gap-0.5"
                        style={{ color: theme.palette.accent }}
                      >
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                )}

                {item.dressCode && (
                  <span
                    className="text-[11px] font-medium"
                    style={{ color: theme.palette.mutedText }}
                  >
                    {t("dressCode")}: {item.dressCode}
                  </span>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
