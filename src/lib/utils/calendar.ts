export interface CalendarEventInput {
  title: string;
  startDateIso: string;
  durationHours?: number;
  venueName: string;
  venueAddress?: string | null;
  description?: string;
  url?: string;
}

function formatUtcCompact(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    date.getUTCFullYear().toString() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    "T" +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    "Z"
  );
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

export function buildGoogleCalendarUrl(input: CalendarEventInput): string {
  const start = new Date(input.startDateIso);
  const safeStart = Number.isNaN(start.getTime()) ? new Date() : start;
  const end = new Date(
    safeStart.getTime() + (input.durationHours ?? 4) * 60 * 60 * 1000
  );

  const location = [input.venueName, input.venueAddress]
    .filter(Boolean)
    .join(", ");

  const details = [
    input.description,
    input.url ? `Invitation: ${input.url}` : null,
  ]
    .filter(Boolean)
    .join("\n\n");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: input.title,
    dates: `${formatUtcCompact(safeStart)}/${formatUtcCompact(end)}`,
    location,
    details,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function generateIcsContent(input: CalendarEventInput): string {
  const start = new Date(input.startDateIso);
  const safeStart = Number.isNaN(start.getTime()) ? new Date() : start;
  const end = new Date(
    safeStart.getTime() + (input.durationHours ?? 4) * 60 * 60 * 1000
  );
  const location = [input.venueName, input.venueAddress]
    .filter(Boolean)
    .join(", ");
  const description = [
    input.description ?? "",
    input.url ? `Invitation Link: ${input.url}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const uid = `${safeStart.getTime()}-${Math.random().toString(36).slice(2, 8)}@invitovix`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Invitovix//Interactive Invitations//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${formatUtcCompact(new Date())}`,
    `DTSTART:${formatUtcCompact(safeStart)}`,
    `DTEND:${formatUtcCompact(end)}`,
    `SUMMARY:${escapeIcsText(input.title)}`,
    `LOCATION:${escapeIcsText(location)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadIcsFile(input: CalendarEventInput, filename = "event.ics") {
  const ics = generateIcsContent(input);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function buildMapsUrl(
  venueName: string,
  venueAddress?: string | null,
  customMapUrl?: string | null
): string {
  if (customMapUrl && customMapUrl.trim().startsWith("http")) {
    return customMapUrl.trim();
  }
  const query = [venueName, venueAddress].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

