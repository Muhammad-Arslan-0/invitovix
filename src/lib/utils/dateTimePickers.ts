/**
 * Date and time picker parsing and formatting utilities
 * Provides seamless conversion between human-friendly display text
 * and ISO/24-hour formats used by native HTML5 date and time pickers.
 */

/**
 * Parses a variety of human date formats (e.g. "Fri, Oct 24, 2026", "2026-10-24", "October 24")
 * into standard YYYY-MM-DD format for <input type="date">.
 */
export function parseDateToIso(
  dateStr?: string | null,
  fallbackYear?: number
): string {
  if (!dateStr || !dateStr.trim()) return "";
  const s = dateStr.trim();

  // Already standard ISO YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // Try standard Date parsing
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) {
    let year = d.getFullYear();
    // In some engines, "Friday, Oct 24" without year parses to 2001
    if (year === 2001 && fallbackYear && !s.includes("2001")) {
      year = fallbackYear;
    }
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Fallback: check MM/DD/YYYY or DD/MM/YYYY
  const slashMatch = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    const month = String(slashMatch[1]).padStart(2, "0");
    const day = String(slashMatch[2]).padStart(2, "0");
    const year = slashMatch[3];
    return `${year}-${month}-${day}`;
  }

  return "";
}

/**
 * Formats a YYYY-MM-DD string into an elegant, human-readable display date
 * like "Fri, Oct 24, 2026" suited for wedding/celebration cards.
 */
export function formatIsoToDisplayDate(isoStr: string): string {
  if (!isoStr) return "";
  const parts = isoStr.split("-");
  if (parts.length !== 3) return isoStr;

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  const d = new Date(year, month, day);
  if (Number.isNaN(d.getTime())) return isoStr;

  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Parses a variety of time formats (e.g. "6:30 PM", "7:00pm", "18:30", "11:00 AM")
 * into standard HH:MM 24-hour format for <input type="time">.
 */
export function parseTimeTo24h(timeStr?: string | null): string {
  if (!timeStr || !timeStr.trim()) return "";
  const s = timeStr.trim();

  // Already 24h format HH:MM
  if (/^([01]\d|2[0-3]):[0-5]\d$/.test(s)) return s;

  // Match 12h formats: e.g. "6:30 PM", "6:30pm", "6pm", "11:00 AM"
  const match = s.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = match[2] ? match[2] : "00";
    const meridiem = match[3]?.toUpperCase();

    if (meridiem === "PM" && hours < 12) {
      hours += 12;
    } else if (meridiem === "AM" && hours === 12) {
      hours = 0;
    }

    if (hours >= 0 && hours <= 23) {
      return `${String(hours).padStart(2, "0")}:${minutes}`;
    }
  }

  return "";
}

/**
 * Formats a 24-hour HH:MM time into a clean 12-hour display format with AM/PM
 * like "6:30 PM" or "11:00 AM".
 */
export function format24hTo12h(time24: string): string {
  if (!time24) return "";
  const parts = time24.split(":");
  if (parts.length < 2) return time24;

  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  if (Number.isNaN(hours)) return time24;

  const meridiem = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${meridiem}`;
}
