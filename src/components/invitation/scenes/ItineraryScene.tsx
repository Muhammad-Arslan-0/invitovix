"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { EventDesignData } from "@/types/invitation";
import {
  getBodyFontFamily,
  getDisplayFontFamily,
} from "@/lib/utils/fonts";

interface ItinerarySceneProps {
  designData: EventDesignData;
}

export function ItineraryScene({ designData }: ItinerarySceneProps) {
  const { theme, content, sections } = designData;

  if (!sections.showItinerary || content.itinerary.length === 0) {
    return null;
  }

  return (
    <section className="px-6 py-8 max-w-lg mx-auto">
      <div className="text-center mb-7">
        <p
          className="text-[11px] uppercase tracking-[0.25em]"
          style={{ color: theme.palette.accent }}
        >
          Order of Events
        </p>
        <h2
          className="mt-1.5 text-2xl sm:text-3xl font-semibold"
          style={{
            color: theme.palette.primary,
            fontFamily: getDisplayFontFamily(theme.typography.displayFont),
          }}
        >
          Evening Schedule
        </h2>
      </div>

      <div className="relative pl-6 space-y-4">
        {/* Timeline vertical rule */}
        <div
          aria-hidden="true"
          className="absolute left-2.5 top-3 bottom-3 w-px"
          style={{ backgroundColor: `${theme.palette.accent}55` }}
        />

        {content.itinerary.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 0.55,
              delay: idx * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative rounded-2xl border p-4 shadow-sm"
            style={{
              backgroundColor: theme.palette.surface,
              borderColor: `${theme.palette.accent}35`,
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

            <div className="flex items-center gap-1.5 text-xs font-medium">
              <Clock
                className="w-3.5 h-3.5"
                style={{ color: theme.palette.accent }}
              />
              <span style={{ color: theme.palette.accent }}>{item.time}</span>
            </div>
            <h3
              className="mt-1 text-base font-semibold"
              style={{
                color: theme.palette.text,
                fontFamily: getDisplayFontFamily(theme.typography.displayFont),
              }}
            >
              {item.title}
            </h3>
            {item.description && (
              <p
                className="mt-1 text-xs sm:text-sm leading-relaxed"
                style={{
                  color: theme.palette.mutedText,
                  fontFamily: getBodyFontFamily(theme.typography.bodyFont),
                }}
              >
                {item.description}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

