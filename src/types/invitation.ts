import { z } from "zod";

export const paletteSchema = z.object({
  background: z.string(),
  surface: z.string(),
  primary: z.string(),
  secondary: z.string(),
  accent: z.string(),
  text: z.string(),
  mutedText: z.string(),
});

export const typographySchema = z.object({
  displayFont: z.enum(["cinzel", "cormorant", "playfair", "syne"]),
  bodyFont: z.enum(["jakarta", "dm-sans", "cormorant"]),
  scriptFont: z.enum(["great-vibes", "cormorant"]),
});

export const itineraryItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  time: z.string(),
  description: z.string(),
});

export const galleryPhotoSchema = z.object({
  id: z.string(),
  url: z.string(),
  caption: z.string(),
});

export const eventDesignDataSchema = z.object({
  theme: z.object({
    presetId: z.string(),
    palette: paletteSchema,
    typography: typographySchema,
    paperTexture: z.enum(["linen", "vellum", "silk", "obsidian", "clean"]),
  }),
  envelope: z.object({
    style: z.enum(["royal-flap", "arch-pocket", "minimal-folio", "art-deco"]),
    envelopeColor: z.string(),
    linerColor: z.string(),
    waxSeal: z.object({
      enabled: z.boolean(),
      color: z.string(),
      monogram: z.string(),
      emblem: z.enum(["monogram", "floral", "crown", "crescent", "star"]),
    }),
    promptText: z.string(),
  }),
  content: z.object({
    hostLine: z.string(),
    headline: z.string(),
    subtitle: z.string(),
    storyQuote: z.string(),
    heroImageUrl: z.string().nullable(),
    dressCode: z.string(),
    itinerary: z.array(itineraryItemSchema),
    gallery: z.array(galleryPhotoSchema),
    rsvpHeadline: z.string(),
    rsvpDeadline: z.string(),
    maxGuestsPerParty: z.number().int().min(1).max(20),
  }),
  sections: z.object({
    showCountdown: z.boolean(),
    showItinerary: z.boolean(),
    showVenue: z.boolean(),
    showGallery: z.boolean(),
    showRsvp: z.boolean(),
  }),
  motion: z.object({
    preset: z.enum([
      "cinematic-silk",
      "royal-unfold",
      "playful-pop",
      "editorial-fade",
    ]),
    particles: z.enum(["none", "gold-dust", "petals", "confetti", "starlight"]),
    lottieAccent: z.enum([
      "none",
      "confetti-burst",
      "floral-flourish",
      "sparkle-ring",
    ]),
  }),
  audio: z.object({
    enabled: z.boolean(),
    trackId: z.enum([
      "ambient-piano",
      "celestial-harp",
      "festive-strings",
      "custom",
    ]),
    trackTitle: z.string(),
    customUrl: z.string().nullable(),
    volume: z.number().min(0).max(1),
  }),
});

export type EventDesignData = z.infer<typeof eventDesignDataSchema>;
export type ItineraryItem = z.infer<typeof itineraryItemSchema>;
export type GalleryPhoto = z.infer<typeof galleryPhotoSchema>;
export type EventCategory = "wedding" | "valima" | "birthday" | "gala";
export type AttendingStatus = "attending" | "declined" | "tentative";

export interface TemplateRecord {
  id: string;
  title: string;
  category: EventCategory | string;
  thumbnail_url: string | null;
  default_config: EventDesignData;
  is_active: boolean;
  created_at: string;
}

export interface EventRecord {
  id: string;
  user_id: string;
  template_id: string | null;
  slug: string;
  title: string;
  event_type: string;
  event_date: string;
  venue_name: string;
  venue_address: string | null;
  venue_map_url: string | null;
  audio_url: string | null;
  design_data: EventDesignData;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface RsvpRecord {
  id: string;
  event_id: string;
  guest_name: string;
  email: string | null;
  phone: string | null;
  attending_status: AttendingStatus;
  guests_count: number;
  notes: string | null;
  created_at: string;
}

export const rsvpSubmissionSchema = z.object({
  guest_name: z.string().trim().min(2, "Please enter your full name").max(120),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email")
    .optional()
    .or(z.literal("")),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  attending_status: z.enum(["attending", "declined", "tentative"]),
  guests_count: z.number().int().min(1).max(20),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

