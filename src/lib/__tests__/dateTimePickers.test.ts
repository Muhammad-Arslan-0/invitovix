import { describe, expect, it } from "vitest";
import {
  parseDateToIso,
  formatIsoToDisplayDate,
  parseTimeTo24h,
  format24hTo12h,
} from "@/lib/utils/dateTimePickers";

describe("dateTimePickers utilities", () => {
  describe("parseDateToIso", () => {
    it("returns empty string for null, undefined or empty input", () => {
      expect(parseDateToIso("")).toBe("");
      expect(parseDateToIso(null)).toBe("");
      expect(parseDateToIso(undefined)).toBe("");
      expect(parseDateToIso("   ")).toBe("");
    });

    it("preserves already valid ISO YYYY-MM-DD", () => {
      expect(parseDateToIso("2026-10-24")).toBe("2026-10-24");
      expect(parseDateToIso("2027-02-14")).toBe("2027-02-14");
    });

    it("parses human readable dates with year", () => {
      expect(parseDateToIso("Fri, Oct 24, 2026")).toBe("2026-10-24");
      expect(parseDateToIso("November 28, 2026")).toBe("2026-11-28");
    });

    it("uses fallback year when parsing date strings without year", () => {
      const res = parseDateToIso("Friday, Oct 24", 2026);
      expect(res).toBe("2026-10-24");
    });

    it("returns empty string for non-date text", () => {
      expect(parseDateToIso("Sunset Cocktail")).toBe("");
    });
  });

  describe("formatIsoToDisplayDate", () => {
    it("returns empty string for empty input", () => {
      expect(formatIsoToDisplayDate("")).toBe("");
    });

    it("formats ISO string to formatted display date", () => {
      const res = formatIsoToDisplayDate("2026-10-24");
      expect(res).toContain("2026");
      expect(res).toContain("Oct");
      expect(res).toContain("24");
    });

    it("handles invalid formats safely", () => {
      expect(formatIsoToDisplayDate("invalid-date")).toBe("invalid-date");
    });
  });

  describe("parseTimeTo24h", () => {
    it("returns empty string for null, undefined or empty input", () => {
      expect(parseTimeTo24h("")).toBe("");
      expect(parseTimeTo24h(null)).toBe("");
      expect(parseTimeTo24h(undefined)).toBe("");
    });

    it("preserves 24h formatted time", () => {
      expect(parseTimeTo24h("18:30")).toBe("18:30");
      expect(parseTimeTo24h("09:15")).toBe("09:15");
      expect(parseTimeTo24h("00:00")).toBe("00:00");
    });

    it("converts 12h PM time to 24h", () => {
      expect(parseTimeTo24h("6:30 PM")).toBe("18:30");
      expect(parseTimeTo24h("12:00 PM")).toBe("12:00");
      expect(parseTimeTo24h("1:45 pm")).toBe("13:45");
      expect(parseTimeTo24h("7pm")).toBe("19:00");
    });

    it("converts 12h AM time to 24h", () => {
      expect(parseTimeTo24h("9:30 AM")).toBe("09:30");
      expect(parseTimeTo24h("12:00 AM")).toBe("00:00");
      expect(parseTimeTo24h("12:30 am")).toBe("00:30");
      expect(parseTimeTo24h("8am")).toBe("08:00");
    });

    it("returns empty string for non-time text", () => {
      expect(parseTimeTo24h("Around Sunset")).toBe("");
    });
  });

  describe("format24hTo12h", () => {
    it("returns empty string for empty input", () => {
      expect(format24hTo12h("")).toBe("");
    });

    it("converts 24h afternoon/evening time to 12h PM", () => {
      expect(format24hTo12h("18:30")).toBe("6:30 PM");
      expect(format24hTo12h("12:00")).toBe("12:00 PM");
      expect(format24hTo12h("23:45")).toBe("11:45 PM");
    });

    it("converts 24h morning time to 12h AM", () => {
      expect(format24hTo12h("09:15")).toBe("9:15 AM");
      expect(format24hTo12h("00:30")).toBe("12:30 AM");
      expect(format24hTo12h("00:00")).toBe("12:00 AM");
      expect(format24hTo12h("11:59")).toBe("11:59 AM");
    });
  });
});
