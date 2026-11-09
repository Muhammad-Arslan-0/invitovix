import {
  EventDesignData,
  EventRecord,
  TemplateRecord,
  eventDesignDataSchema,
} from "@/types/invitation";

export const AUDIO_TRACK_PRESETS = [
  {
    id: "ambient-piano" as const,
    title: "Velvet Nocturne",
    mood: "Warm Felt Piano",
    src: "/audio/ambient-piano.wav",
  },
  {
    id: "celestial-harp" as const,
    title: "Moonlight Harp",
    mood: "Ethereal Strings",
    src: "/audio/celestial-harp.wav",
  },
  {
    id: "festive-strings" as const,
    title: "Golden Hour Chimes",
    mood: "Uplifting Acoustic",
    src: "/audio/festive-strings.wav",
  },
];

export const STARTER_TEMPLATES: TemplateRecord[] = [
  {
    id: "11111111-1111-4111-8111-111111111101",
    title: "Noor-e-Nikah (Royal Emerald)",
    category: "wedding",
    thumbnail_url: "/templates/noor-emerald.svg",
    is_active: true,
    created_at: "2026-01-01T00:00:00.000Z",
    default_config: {
      theme: {
        presetId: "noor-emerald",
        palette: {
          background: "#FAF6EE",
          surface: "#FFFDF8",
          primary: "#114232",
          secondary: "#1B5E47",
          accent: "#C99A3B",
          text: "#17261F",
          mutedText: "#5E6B64",
        },
        typography: {
          displayFont: "cinzel",
          bodyFont: "cormorant",
          scriptFont: "great-vibes",
        },
        paperTexture: "linen",
      },
      envelope: {
        style: "royal-flap",
        envelopeColor: "#114232",
        linerColor: "#C99A3B",
        waxSeal: {
          enabled: true,
          color: "#B3842B",
          monogram: "A&Z",
          emblem: "floral",
        },
        promptText: "Tap the gold wax seal to unseal your invitation",
      },
      content: {
        hostLine: "Together with their beloved families",
        headline: "Amina & Zayan",
        subtitle: "Request the honor of your presence at their Nikah & Reception",
        storyQuote:
          "Two souls, one timeless promise — surrounded by family, prayer, and celebration.",
        heroImageUrl: null,
        dressCode: "Formal Traditional / Emerald & Champagne",
        itinerary: [
          {
            id: "it-1",
            title: "Guest Arrival & Rose Sherbet",
            time: "6:30 PM",
            description: "Courtyard lantern reception and acoustic strings",
          },
          {
            id: "it-2",
            title: "Nikah Ceremony",
            time: "7:30 PM",
            description: "Sacred vows beneath the floral pavilion",
          },
          {
            id: "it-3",
            title: "Royal Banquet Dinner",
            time: "8:45 PM",
            description: "Candlelit feast and family toasts",
          },
        ],
        gallery: [],
        rsvpHeadline: "Kindly Reply",
        rsvpDeadline: "Two weeks prior to the celebration",
        maxGuestsPerParty: 6,
      },
      sections: {
        showCountdown: true,
        showItinerary: true,
        showVenue: true,
        showGallery: true,
        showRsvp: true,
      },
      motion: {
        preset: "royal-unfold",
        particles: "gold-dust",
        lottieAccent: "floral-flourish",
      },
      audio: {
        enabled: true,
        trackId: "ambient-piano",
        trackTitle: "Velvet Nocturne",
        customUrl: null,
        volume: 0.6,
      },
    },
  },
  {
    id: "11111111-1111-4111-8111-111111111102",
    title: "Moonlit Valima (Midnight Pearl)",
    category: "valima",
    thumbnail_url: "/templates/moonlit-valima.svg",
    is_active: true,
    created_at: "2026-01-01T00:00:00.000Z",
    default_config: {
      theme: {
        presetId: "moonlit-valima",
        palette: {
          background: "#0E1324",
          surface: "#161D35",
          primary: "#E5C185",
          secondary: "#242E52",
          accent: "#F3D9B1",
          text: "#F7F3EA",
          mutedText: "#A8B2CE",
        },
        typography: {
          displayFont: "playfair",
          bodyFont: "jakarta",
          scriptFont: "great-vibes",
        },
        paperTexture: "silk",
      },
      envelope: {
        style: "arch-pocket",
        envelopeColor: "#161D35",
        linerColor: "#E5C185",
        waxSeal: {
          enabled: true,
          color: "#C99A4E",
          monogram: "H&S",
          emblem: "crescent",
        },
        promptText: "Tap the crescent seal to open under starlight",
      },
      content: {
        hostLine:
          "Mr. & Mrs. Siddiqui cordially invite you to the Valima Reception of",
        headline: "Hamza & Sana",
        subtitle: "An evening of moonlight, gratitude, and heartfelt celebration",
        storyQuote:
          "As the stars gather above, we celebrate a new chapter blessed with love and warmth.",
        heroImageUrl: null,
        dressCode: "Evening Formal / Midnight, Ivory & Pearl",
        itinerary: [
          {
            id: "it-1",
            title: "Red Carpet & Portraits",
            time: "7:30 PM",
            description: "Welcome mocktails and family photographs",
          },
          {
            id: "it-2",
            title: "Grand Entrance",
            time: "8:30 PM",
            description: "Candlelit walkway and live instrumental tribute",
          },
          {
            id: "it-3",
            title: "Valima Dinner & Chai Salon",
            time: "9:15 PM",
            description: "Artisanal culinary showcase and dessert bar",
          },
        ],
        gallery: [],
        rsvpHeadline: "Reserve Your Seat",
        rsvpDeadline: "Please confirm attendance at your earliest convenience",
        maxGuestsPerParty: 6,
      },
      sections: {
        showCountdown: true,
        showItinerary: true,
        showVenue: true,
        showGallery: true,
        showRsvp: true,
      },
      motion: {
        preset: "cinematic-silk",
        particles: "starlight",
        lottieAccent: "sparkle-ring",
      },
      audio: {
        enabled: true,
        trackId: "celestial-harp",
        trackTitle: "Moonlight Harp",
        customUrl: null,
        volume: 0.55,
      },
    },
  },
  {
    id: "11111111-1111-4111-8111-111111111103",
    title: "Confetti Atelier (Editorial Birthday)",
    category: "birthday",
    thumbnail_url: "/templates/confetti-atelier.svg",
    is_active: true,
    created_at: "2026-01-01T00:00:00.000Z",
    default_config: {
      theme: {
        presetId: "confetti-atelier",
        palette: {
          background: "#FFF7F2",
          surface: "#FFFFFF",
          primary: "#C94B38",
          secondary: "#F29E74",
          accent: "#E8B931",
          text: "#231917",
          mutedText: "#755F59",
        },
        typography: {
          displayFont: "syne",
          bodyFont: "dm-sans",
          scriptFont: "great-vibes",
        },
        paperTexture: "vellum",
      },
      envelope: {
        style: "minimal-folio",
        envelopeColor: "#C94B38",
        linerColor: "#F9DFD5",
        waxSeal: {
          enabled: true,
          color: "#E8B931",
          monogram: "30",
          emblem: "star",
        },
        promptText: "Tap the golden star seal to pop the celebration",
      },
      content: {
        hostLine: "Raise a glass & celebrate",
        headline: "Maya Turns 30",
        subtitle: "Golden hour rooftops, vinyl beats, and unforgettable memories",
        storyQuote:
          "Three decades of adventures — come celebrate the next chapter together!",
        heroImageUrl: null,
        dressCode: "Cocktail Chic / Sunset Hues",
        itinerary: [
          {
            id: "it-1",
            title: "Sunset Spritz & Polaroids",
            time: "6:00 PM",
            description: "Rooftop terrace welcome drinks",
          },
          {
            id: "it-2",
            title: "Candlelight Toasts & Cake",
            time: "8:00 PM",
            description: "Speeches, sparklers, and artisan cake cutting",
          },
          {
            id: "it-3",
            title: "Late Night Vinyl Set",
            time: "9:30 PM",
            description: "Dance floor under the string lights",
          },
        ],
        gallery: [],
        rsvpHeadline: "Are You In?",
        rsvpDeadline: "Let us know so we save your spot",
        maxGuestsPerParty: 4,
      },
      sections: {
        showCountdown: true,
        showItinerary: true,
        showVenue: true,
        showGallery: true,
        showRsvp: true,
      },
      motion: {
        preset: "playful-pop",
        particles: "confetti",
        lottieAccent: "confetti-burst",
      },
      audio: {
        enabled: true,
        trackId: "festive-strings",
        trackTitle: "Golden Hour Chimes",
        customUrl: null,
        volume: 0.65,
      },
    },
  },
  {
    id: "11111111-1111-4111-8111-111111111104",
    title: "Noir & Champagne (Black-Tie Gala)",
    category: "gala",
    thumbnail_url: "/templates/noir-gala.svg",
    is_active: true,
    created_at: "2026-01-01T00:00:00.000Z",
    default_config: {
      theme: {
        presetId: "noir-gala",
        palette: {
          background: "#0B0B0D",
          surface: "#151519",
          primary: "#D4AF37",
          secondary: "#2A251B",
          accent: "#F3E5AB",
          text: "#F5F2EB",
          mutedText: "#9E978B",
        },
        typography: {
          displayFont: "cinzel",
          bodyFont: "jakarta",
          scriptFont: "cormorant",
        },
        paperTexture: "obsidian",
      },
      envelope: {
        style: "art-deco",
        envelopeColor: "#151519",
        linerColor: "#D4AF37",
        waxSeal: {
          enabled: true,
          color: "#D4AF37",
          monogram: "VIP",
          emblem: "crown",
        },
        promptText: "Tap the crest to enter the annual gala",
      },
      content: {
        hostLine: "An Exclusive Evening Benefiting Creative Arts",
        headline: "The Lumiere Gala",
        subtitle: "Black-tie dinner, live auction, and symphony showcase",
        storyQuote:
          "Elegance in every detail — celebrating visionaries, patronage, and timeless craft.",
        heroImageUrl: null,
        dressCode: "Strict Black Tie",
        itinerary: [
          {
            id: "it-1",
            title: "Champagne Reception",
            time: "7:00 PM",
            description: "Gallery atrium preview & string quartet",
          },
          {
            id: "it-2",
            title: "Keynote & Honors",
            time: "8:15 PM",
            description: "Three-course gala dinner and awards",
          },
          {
            id: "it-3",
            title: "Midnight Encore",
            time: "10:00 PM",
            description: "Jazz lounge and curated dessert tasting",
          },
        ],
        gallery: [],
        rsvpHeadline: "Confirm Attendance",
        rsvpDeadline: "Kindly RSVP for seating assignment",
        maxGuestsPerParty: 4,
      },
      sections: {
        showCountdown: true,
        showItinerary: true,
        showVenue: true,
        showGallery: true,
        showRsvp: true,
      },
      motion: {
        preset: "editorial-fade",
        particles: "gold-dust",
        lottieAccent: "sparkle-ring",
      },
      audio: {
        enabled: true,
        trackId: "ambient-piano",
        trackTitle: "Velvet Nocturne",
        customUrl: null,
        volume: 0.5,
      },
    },
  },
];

export const DEFAULT_DESIGN_DATA: EventDesignData =
  STARTER_TEMPLATES[0].default_config;

export function mergeDesignData(raw: unknown): EventDesignData {
  const parsed = eventDesignDataSchema.safeParse(raw);
  if (parsed.success) {
    return parsed.data;
  }

  const candidate =
    typeof raw === "object" && raw !== null
      ? (raw as Partial<EventDesignData>)
      : {};

  return {
    theme: {
      ...DEFAULT_DESIGN_DATA.theme,
      ...candidate.theme,
      palette: {
        ...DEFAULT_DESIGN_DATA.theme.palette,
        ...candidate.theme?.palette,
      },
      typography: {
        ...DEFAULT_DESIGN_DATA.theme.typography,
        ...candidate.theme?.typography,
      },
    },
    envelope: {
      ...DEFAULT_DESIGN_DATA.envelope,
      ...candidate.envelope,
      waxSeal: {
        ...DEFAULT_DESIGN_DATA.envelope.waxSeal,
        ...candidate.envelope?.waxSeal,
      },
    },
    content: {
      ...DEFAULT_DESIGN_DATA.content,
      ...candidate.content,
      itinerary: Array.isArray(candidate.content?.itinerary)
        ? candidate.content.itinerary
        : DEFAULT_DESIGN_DATA.content.itinerary,
      gallery: Array.isArray(candidate.content?.gallery)
        ? candidate.content.gallery
        : DEFAULT_DESIGN_DATA.content.gallery,
    },
    sections: {
      ...DEFAULT_DESIGN_DATA.sections,
      ...candidate.sections,
    },
    motion: {
      ...DEFAULT_DESIGN_DATA.motion,
      ...candidate.motion,
    },
    audio: {
      ...DEFAULT_DESIGN_DATA.audio,
      ...candidate.audio,
    },
  };
}

export const DEMO_EVENT: EventRecord = {
  id: "00000000-0000-4000-8000-000000000001",
  user_id: "00000000-0000-4000-8000-000000000000",
  template_id: STARTER_TEMPLATES[0].id,
  slug: "demo",
  title: "Amina & Zayan — Royal Nikah",
  event_type: "wedding",
  event_date: "2027-02-14T18:30:00.000Z",
  venue_name: "The Serai Courtyard & Conservatory",
  venue_address: "42 Rose Garden Avenue, Gulberg III, Lahore",
  venue_map_url:
    "https://www.google.com/maps/search/?api=1&query=Gulberg+III+Lahore",
  audio_url: "/audio/ambient-piano.wav",
  design_data: STARTER_TEMPLATES[0].default_config,
  is_published: true,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

