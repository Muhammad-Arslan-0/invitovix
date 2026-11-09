import { describe, expect, it } from "vitest";
import {
  buildGoogleCalendarUrl,
  buildMapsUrl,
  generateIcsContent,
} from "@/lib/utils/calendar";
import { generateUniqueSlug, isValidSlug, toSlug } from "@/lib/utils/slug";

describe("Slug utilities", () => {
  it("normalizes titles into clean URL slugs", () => {
    expect(toSlug("Amina & Zayan's Royal Nikah!")).toBe(
      "amina-zayans-royal-nikah"
    );
    expect(toSlug("   ")).toBe("celebration");
  });

  it("generates unique valid slugs", () => {
    const s1 = generateUniqueSlug("Maya Turns 30");
    const s2 = generateUniqueSlug("Maya Turns 30");
    expect(isValidSlug(s1)).toBe(true);
    expect(s1).not.toBe(s2);
  });
});

describe("Calendar & Maps utilities", () => {
  const sample = {
    title: "Amina & Zayan Nikah",
    startDateIso: "2027-02-14T18:30:00.000Z",
    durationHours: 4,
    venueName: "The Serai Courtyard",
    venueAddress: "Gulberg III, Lahore",
    description: "Join us for the celebration",
  };

  it("builds a valid Google Calendar template URL", () => {
    const url = buildGoogleCalendarUrl(sample);
    expect(url).toContain("https://calendar.google.com/calendar/render");
    expect(url).toContain("action=TEMPLATE");
    expect(url).toContain("20270214T183000Z%2F20270214T223000Z");
  });

  it("builds RFC-5545 compliant ICS content", () => {
    const ics = generateIcsContent(sample);
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("DTSTART:20270214T183000Z");
    expect(ics).toContain("DTEND:20270214T223000Z");
    expect(ics).toContain("SUMMARY:Amina & Zayan Nikah");
    expect(ics).toContain("END:VCALENDAR");
  });

  it("prefers custom map URL when provided and falls back to search query", () => {
    expect(buildMapsUrl("Venue", "City", "https://maps.google.com/?q=123")).toBe(
      "https://maps.google.com/?q=123"
    );
    expect(buildMapsUrl("The Serai", "Lahore", null)).toContain(
      "https://www.google.com/maps/search/?api=1&query="
    );
  });
});

