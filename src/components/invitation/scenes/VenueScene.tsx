"use client";

import { useEffect, useState, type RefObject } from "react";
import { motion } from "framer-motion";
import { CalendarPlus, Download, MapPin, Navigation } from "lucide-react";
import { EventDesignData } from "@/types/invitation";
import {
  buildGoogleCalendarUrl,
  buildMapsUrl,
  downloadIcsFile,
} from "@/lib/utils/calendar";
import {
  buildOsmLinkUrl,
  parseCoordinatesFromMapUrl,
} from "@/lib/utils/location";
import { getContrastTextColor } from "@/lib/utils/colors";
import { VenuePreviewMap } from "@/components/maps/VenuePreviewMap";
import {
  getBodyFontFamily,
  getDisplayFontFamily,
} from "@/lib/utils/fonts";

interface VenueSceneProps {
  id?: string;
  designData: EventDesignData;
  title: string;
  slug: string;
  eventDate: string;
  venueName: string;
  venueAddress?: string | null;
  venueMapUrl?: string | null;
  scrollRootRef?: RefObject<HTMLDivElement | null>;
}

export function VenueScene({
  id = "invite-venue",
  designData,
  title,
  slug,
  eventDate,
  venueName,
  venueAddress,
  venueMapUrl,
  scrollRootRef,
}: VenueSceneProps) {
  const { theme, content, sections } = designData;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!sections.showVenue) return null;

  const mapsUrl = buildMapsUrl(venueName, venueAddress, venueMapUrl);
  const coords = parseCoordinatesFromMapUrl(venueMapUrl);
  const osmUrl = coords ? buildOsmLinkUrl(coords.lat, coords.lng) : null;
  const calendarInput = {
    title: content.headline || title,
    startDateIso: eventDate,
    durationHours: 4,
    venueName,
    venueAddress,
    description: content.subtitle,
    url:
      mounted && typeof window !== "undefined"
        ? `${window.location.origin}/e/${slug}`
        : undefined,
  };
  const googleCalUrl = buildGoogleCalendarUrl(calendarInput);

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{
        once: true,
        amount: 0.05,
        ...(scrollRootRef ? { root: scrollRootRef } : {}),
      }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="scroll-mt-14 px-6 sm:px-7 py-8 max-w-lg mx-auto"
    >
      <div
        className="rounded-3xl border p-6 text-center shadow-sm backdrop-blur-xs"
        style={{
          backgroundColor: `${theme.palette.surface}ED`,
          borderColor: `${theme.palette.accent}44`,
        }}
      >
        <div
          className="mx-auto w-11 h-11 rounded-full flex items-center justify-center mb-3"
          style={{
            backgroundColor: `${theme.palette.accent}1E`,
            color: theme.palette.accent,
          }}
        >
          <MapPin className="w-5 h-5" />
        </div>

        <p
          className="text-[11px] uppercase tracking-[0.24em]"
          style={{ color: theme.palette.accent }}
        >
          Location &amp; Sync
        </p>
        <h2
          className="mt-1.5 text-2xl font-semibold"
          style={{
            color: theme.palette.primary,
            fontFamily: getDisplayFontFamily(theme.typography.displayFont),
          }}
        >
          {venueName}
        </h2>
        {venueAddress && (
          <p
            className="mt-2 text-sm leading-relaxed max-w-sm mx-auto"
            style={{
              color: theme.palette.mutedText,
              fontFamily: getBodyFontFamily(theme.typography.bodyFont),
            }}
          >
            {venueAddress}
          </p>
        )}

        {coords && (
          <div className="mt-5 text-left">
            <VenuePreviewMap
              coordinates={coords}
              venueName={venueName}
              pinColor={theme.palette.primary}
              accentColor={theme.palette.accent}
            />
          </div>
        )}

        <div className="mt-5 flex flex-col gap-2.5">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: theme.palette.primary,
              color: getContrastTextColor(theme.palette.primary),
            }}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-md transition hover:opacity-90"
          >
            <Navigation className="w-4 h-4" />
            <span>Open Directions in Google Maps</span>
          </a>

          {osmUrl && (
            <a
              href={osmUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                borderColor: `${theme.palette.accent}44`,
                color: theme.palette.mutedText,
              }}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-[11px] font-medium transition hover:opacity-80"
            >
              <MapPin
                className="w-3 h-3"
                style={{ color: theme.palette.accent }}
              />
              <span>View Location on Map</span>
            </a>
          )}

          <div className="grid grid-cols-2 gap-2.5">
            <a
              href={googleCalUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                borderColor: `${theme.palette.accent}66`,
                color: theme.palette.text,
              }}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-medium transition hover:opacity-80"
            >
              <CalendarPlus
                className="w-3.5 h-3.5"
                style={{ color: theme.palette.accent }}
              />
              <span>Google Calendar</span>
            </a>

            <button
              type="button"
              onClick={() => downloadIcsFile(calendarInput, `${slug || "event"}.ics`)}
              style={{
                borderColor: `${theme.palette.accent}66`,
                color: theme.palette.text,
              }}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-medium transition hover:opacity-80 cursor-pointer"
            >
              <Download
                className="w-3.5 h-3.5"
                style={{ color: theme.palette.accent }}
              />
              <span>Apple / .ICS</span>
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

