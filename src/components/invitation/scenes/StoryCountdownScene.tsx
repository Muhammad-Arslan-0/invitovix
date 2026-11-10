"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shirt } from "lucide-react";
import { EventDesignData } from "@/types/invitation";
import {
  getBodyFontFamily,
  getDisplayFontFamily,
} from "@/lib/utils/fonts";

interface StoryCountdownSceneProps {
  designData: EventDesignData;
  eventDate: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function calcRemaining(targetIso: string): TimeRemaining {
  const diff = new Date(targetIso).getTime() - Date.now();
  if (Number.isNaN(diff) || diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, isPast: false };
}

export function StoryCountdownScene({
  designData,
  eventDate,
}: StoryCountdownSceneProps) {
  const { theme, content, sections } = designData;
  const [remaining, setRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    setRemaining(calcRemaining(eventDate));
    const timer = setInterval(() => {
      setRemaining(calcRemaining(eventDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [eventDate]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="px-6 py-8 max-w-lg mx-auto text-center"
    >
      {/* Quote Card */}
      {content.storyQuote && (
        <div
          className="rounded-3xl border px-6 py-7 shadow-sm"
          style={{
            backgroundColor: theme.palette.surface,
            borderColor: `${theme.palette.accent}35`,
          }}
        >
          <p
            className="text-base sm:text-lg italic leading-relaxed"
            style={{
              color: theme.palette.text,
              fontFamily: getBodyFontFamily(theme.typography.bodyFont),
            }}
          >
            &ldquo;{content.storyQuote}&rdquo;
          </p>

          {content.dressCode && (
            <div
              className="mt-5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs border"
              style={{
                borderColor: `${theme.palette.accent}44`,
                color: theme.palette.mutedText,
              }}
            >
              <Shirt
                className="w-3.5 h-3.5"
                style={{ color: theme.palette.accent }}
              />
              <span>Dress Code: {content.dressCode}</span>
            </div>
          )}
        </div>
      )}

      {/* Live Countdown */}
      {sections.showCountdown && (
        <div className="mt-8">
          <p
            className="text-[11px] uppercase tracking-[0.25em] mb-4"
            style={{ color: theme.palette.mutedText }}
          >
            {remaining.isPast ? "Celebration Moment" : "Counting Down To The Day"}
          </p>

          {remaining.isPast ? (
            <div
              className="rounded-2xl border py-4 px-5 text-sm font-medium"
              style={{
                backgroundColor: theme.palette.surface,
                borderColor: `${theme.palette.accent}44`,
                color: theme.palette.primary,
              }}
            >
              The celebration has arrived — we look forward to welcoming you!
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2.5">
              {[
                { label: "Days", value: remaining.days },
                { label: "Hours", value: remaining.hours },
                { label: "Mins", value: remaining.minutes },
                { label: "Secs", value: remaining.seconds },
              ].map((unit, idx) => (
                <motion.div
                  key={unit.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: idx * 0.06 }}
                  whileHover={{ y: -2 }}
                  className="rounded-2xl border py-3.5 px-2 shadow-sm backdrop-blur-xs"
                  style={{
                    backgroundColor: theme.palette.surface,
                    borderColor: `${theme.palette.accent}48`,
                    boxShadow: `0 10px 25px -12px ${theme.palette.accent}44`,
                  }}
                >
                  <div
                    className="text-2xl sm:text-3xl font-semibold tabular-nums"
                    style={{
                      color: theme.palette.primary,
                      fontFamily: getDisplayFontFamily(
                        theme.typography.displayFont
                      ),
                    }}
                  >
                    {String(unit.value).padStart(2, "0")}
                  </div>
                  <div
                    className="text-[10px] uppercase tracking-[0.2em] mt-1"
                    style={{ color: theme.palette.mutedText }}
                  >
                    {unit.label}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.section>
  );
}

