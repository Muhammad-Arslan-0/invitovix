export const SITE_NAME = "Invitovix";

export const SITE_ALTERNATE_NAMES = [
  "Invitovix Live Invitations",
  "Invitovix Digital Invitation Cards",
  "Invitovix Invitation Maker",
];

export const SITE_TAGLINE =
  "Live Digital Invitation Cards & Online Invite Maker";

export const SITE_DEFAULT_TITLE = `${SITE_NAME} — ${SITE_TAGLINE}`;

export const SITE_DEFAULT_DESCRIPTION =
  "Create interactive wax-seal live invitation cards online with Invitovix. Design digital wedding (Nikah, Mehndi, Baraat, Valima), birthday, baby shower & gala invites with music, maps & live RSVP.";

export const SITE_KEYWORDS = [
  "Invitovix",
  "invitation card",
  "live invitation card",
  "digital invitation card",
  "online invitation maker",
  "interactive invitation card",
  "animated invitation card",
  "wax seal digital invitation",
  "wedding invitation card",
  "digital wedding invitation",
  "live wedding invitation card",
  "nikah invitation card",
  "mehndi invitation card",
  "baraat invitation card",
  "valima invitation card",
  "walima invitation card",
  "engagement invitation card",
  "birthday invitation card",
  "live birthday invitation",
  "baby shower invitation card",
  "anniversary invitation card",
  "graduation invitation card",
  "gala invitation",
  "WhatsApp wedding invitation",
  "online RSVP invitation card",
  "multi-language digital invitation",
];

export interface SeoFaqItem {
  question: string;
  answer: string;
}

export const HOMEPAGE_FAQS: SeoFaqItem[] = [
  {
    question: "What is a live invitation card on Invitovix?",
    answer:
      "A live invitation card on Invitovix is an interactive, mobile-first digital invitation delivered via a shareable link or QR code. Unlike a static PDF or image, guests tap an embossed wax seal to unseal your envelope, listen to curated background music, view your ceremony schedule and venue map, switch languages, save the date to Google or Apple Calendar, and submit live RSVPs in real time.",
  },
  {
    question: "How do I create a digital invitation card on Invitovix?",
    answer:
      "Sign in to the Invitovix Creator Studio, choose your celebration category (Weddings, Birthdays, Galas & Corporate, or Parties & Showers), pick a luxury template, customize your names, portraits, colors, fonts, wax seal, music, and venue map pin, then publish your unique /e/your-event link and QR code in minutes.",
  },
  {
    question:
      "Can I make separate cards for Nikah, Mehndi, Baraat, Valima, and Birthdays?",
    answer:
      "Yes. Invitovix offers dedicated, culturally authentic templates for Nikah, Mehndi & Sangeet, Baraat, Valima (Walima), Engagement, Anand Karaj, Hindu Vivah, Milestone Birthdays, Black-Tie Galas, Corporate Summits, Baby Showers, Anniversaries, and Graduations — plus guest-tier access links for multi-day celebrations.",
  },
  {
    question: "Can I share my Invitovix live invitation card on WhatsApp?",
    answer:
      "Yes. Every published Invitovix invitation generates a clean link with rich Open Graph previews (event title, date, venue, and cover portrait) designed for WhatsApp, iMessage, Instagram, and email, along with a print-ready QR code for physical keepsake inserts.",
  },
  {
    question: "Does Invitovix include real-time RSVP tracking and calendar sync?",
    answer:
      "Yes. Guests confirm attendance, party size, and dietary or personal notes directly inside the live invitation card. Hosts monitor attending headcounts and export guest lists to CSV from the Invitovix Dashboard, while guests add the event to Google Calendar or Apple Calendar (.ics) in one tap.",
  },
  {
    question: "Can my guests view the invitation in Urdu, Arabic, or other languages?",
    answer:
      "Yes. Invitovix supports built-in card translations including English, Urdu (with authentic Nastaleeq typography), Arabic, Hindi, French, Spanish, Turkish, and Indonesian so international family and guests read every detail naturally.",
  },
];

export function resolveSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3000";

  const normalized = raw.startsWith("http") ? raw : `https://${raw}`;
  try {
    const parsed = new URL(normalized);
    return parsed.origin;
  } catch {
    return "http://localhost:3000";
  }
}

export function resolveMetadataBase(): URL {
  return new URL(resolveSiteUrl());
}

export function absoluteUrl(path = "/"): string {
  const base = resolveSiteUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return cleanPath === "/" ? base : `${base}${cleanPath}`;
}
