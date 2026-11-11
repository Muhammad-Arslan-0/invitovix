import {
  CardArtConfig,
  CardBackdropPreset,
  CardBorderStyle,
  CardArtMotif,
  CoupleFrameShape,
  CoupleProfile,
  EventDesignData,
  EventRecord,
  HeroFrameStyle,
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

export const CARD_BACKDROP_PRESETS: Array<{
  id: Exclude<CardBackdropPreset, "custom">;
  label: string;
  subtitle: string;
  imageUrl: string | null;
  previewGradient: string;
}> = [
  {
    id: "none",
    label: "Pure Paper",
    subtitle: "Clean stationery finish",
    imageUrl: null,
    previewGradient: "linear-gradient(135deg, #FAF6EE, #EDE4D3)",
  },
  {
    id: "nikah-courtyard",
    label: "Nikah Courtyard",
    subtitle: "Lantern arches & jasmine",
    imageUrl: "/art/nikah-courtyard.jpg",
    previewGradient: "linear-gradient(135deg, #114232, #C99A3B)",
  },
  {
    id: "peony-arch",
    label: "Peony Bloom Arch",
    subtitle: "Watercolor blush & rose",
    imageUrl: "/art/peony-arch.jpg",
    previewGradient: "linear-gradient(135deg, #FDF2EE, #C87D87)",
  },
  {
    id: "marigold-mehndi",
    label: "Marigold Mehndi",
    subtitle: "Festive mogra & saffron",
    imageUrl: "/art/marigold-mehndi.jpg",
    previewGradient: "linear-gradient(135deg, #FFF5DB, #E29E21)",
  },
  {
    id: "baraat-palace",
    label: "Shahi Baraat",
    subtitle: "Crimson roses & chandeliers",
    imageUrl: "/art/baraat-palace.jpg",
    previewGradient: "linear-gradient(135deg, #FAF3EB, #6E1423)",
  },
  {
    id: "engagement-bloom",
    label: "Ivory Magnolia",
    subtitle: "Eucalyptus & rose quartz",
    imageUrl: "/art/engagement-bloom.jpg",
    previewGradient: "linear-gradient(135deg, #FBF8F4, #7C9286)",
  },
  {
    id: "abstract-silk",
    label: "Abstract Silk",
    subtitle: "Editorial champagne waves",
    imageUrl: "/art/abstract-silk.jpg",
    previewGradient: "linear-gradient(135deg, #F7F3ED, #B5825E)",
  },
  {
    id: "moonlit-garden",
    label: "Moonlit Garden",
    subtitle: "Midnight flora & pearl",
    imageUrl: "/art/moonlit-garden.jpg",
    previewGradient: "linear-gradient(135deg, #0E1324, #4A5A8A)",
  },
];

export const CARD_MOTIF_OPTIONS: Array<{
  id: CardArtMotif;
  label: string;
  description: string;
}> = [
  { id: "none", label: "Minimal", description: "Clean typographic focus" },
  {
    id: "floral-bouquet",
    label: "Floral Bouquet",
    description: "Peony & rose botanicals",
  },
  {
    id: "marigold-garland",
    label: "Marigold Toran",
    description: "Festive garlands & lanterns",
  },
  {
    id: "royal-arch",
    label: "Royal Arch",
    description: "Sculpted Nikah dome crest",
  },
  {
    id: "abstract-organic",
    label: "Abstract Curves",
    description: "Modern organic ribbons",
  },
  {
    id: "celestial-stars",
    label: "Starlight",
    description: "Crescent & delicate stars",
  },
];

export const CARD_BORDER_OPTIONS: Array<{
  id: CardBorderStyle;
  label: string;
}> = [
  { id: "none", label: "Borderless" },
  { id: "gold-filigree", label: "Gold Filigree" },
  { id: "arch-frame", label: "Royal Arch" },
  { id: "editorial-double", label: "Editorial Double" },
  { id: "botanical-vine", label: "Botanical Vine" },
];

export const HERO_FRAME_OPTIONS: Array<{
  id: HeroFrameStyle;
  label: string;
}> = [
  { id: "arch", label: "Arch Dome" },
  { id: "oval", label: "Editorial Oval" },
  { id: "polaroid", label: "Film Polaroid" },
  { id: "rounded", label: "Modern Soft" },
];

export const COUPLE_FRAME_OPTIONS: Array<{
  id: CoupleFrameShape;
  label: string;
}> = [
  { id: "arch", label: "Royal Arch" },
  { id: "oval", label: "Cameo Oval" },
  { id: "scallop", label: "Scallop Medallion" },
  { id: "polaroid", label: "Film Polaroid" },
];

export const LEGACY_CARD_ART_FALLBACK: CardArtConfig = {
  motif: "none",
  borderStyle: "none",
  backdropPreset: "none",
  backdropUrl: null,
  backdropOpacity: 0.32,
  heroFrame: "arch",
};

export const LEGACY_COUPLE_FALLBACK: CoupleProfile = {
  layout: "side-by-side",
  frameShape: "arch",
  crestText: "&",
  brideName: "Amina",
  brideRole: "Daughter of Mr. & Mrs. Tariq",
  brideImageUrl: null,
  groomName: "Zayan",
  groomRole: "Son of Mr. & Mrs. Mansoor",
  groomImageUrl: null,
};

export function resolveCardBackdropUrl(
  cardArt: Partial<CardArtConfig> | null | undefined
): string | null {
  if (!cardArt || cardArt.backdropPreset === "none") return null;
  if (cardArt.backdropPreset === "custom") {
    return typeof cardArt.backdropUrl === "string" && cardArt.backdropUrl.trim()
      ? cardArt.backdropUrl
      : null;
  }
  const preset = CARD_BACKDROP_PRESETS.find(
    (p) => p.id === cardArt.backdropPreset
  );
  return preset?.imageUrl ?? null;
}

export const WEDDING_TEMPLATE_CATEGORIES = new Set([
  "wedding",
  "nikah",
  "mehndi",
  "baraat",
  "valima",
  "walima",
  "engagement",
  "reception",
  "sangeet",
  "rukhsati",
]);

export const RETIRED_NON_WEDDING_TEMPLATE_IDS = new Set([
  "11111111-1111-4111-8111-111111111103",
  "11111111-1111-4111-8111-111111111104",
]);

export function isWeddingTemplate(
  tpl: Pick<TemplateRecord, "id" | "category">
): boolean {
  if (RETIRED_NON_WEDDING_TEMPLATE_IDS.has(tpl.id)) return false;
  return WEDDING_TEMPLATE_CATEGORIES.has(tpl.category.trim().toLowerCase());
}

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
        cardArt: {
          motif: "royal-arch",
          borderStyle: "gold-filigree",
          backdropPreset: "nikah-courtyard",
          backdropUrl: null,
          backdropOpacity: 0.44,
          heroFrame: "arch",
        },
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
        subtitle:
          "Request the honor of your presence at their Nikah & Reception",
        storyQuote:
          "Two souls, one timeless promise — surrounded by family, prayer, and celebration.",
        heroImageUrl: null,
        couple: {
          layout: "side-by-side",
          frameShape: "arch",
          crestText: "&",
          brideName: "Amina Tariq",
          brideRole: "Daughter of Mr. & Mrs. Tariq",
          brideImageUrl: null,
          groomName: "Zayan Mansoor",
          groomRole: "Son of Mr. & Mrs. Mansoor",
          groomImageUrl: null,
        },
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
        showCouple: true,
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
    id: "11111111-1111-4111-8111-111111111105",
    title: "Blush Peony & Champagne Arch",
    category: "wedding",
    thumbnail_url: "/art/peony-arch.jpg",
    is_active: true,
    created_at: "2026-02-01T00:00:00.000Z",
    default_config: {
      theme: {
        presetId: "blush-peony",
        palette: {
          background: "#FDF8F5",
          surface: "#FFFFFF",
          primary: "#6E2B3E",
          secondary: "#A65E70",
          accent: "#C89A52",
          text: "#2B191E",
          mutedText: "#7C646B",
        },
        typography: {
          displayFont: "cormorant",
          bodyFont: "jakarta",
          scriptFont: "great-vibes",
        },
        paperTexture: "vellum",
        cardArt: {
          motif: "floral-bouquet",
          borderStyle: "arch-frame",
          backdropPreset: "peony-arch",
          backdropUrl: null,
          backdropOpacity: 0.5,
          heroFrame: "arch",
        },
      },
      envelope: {
        style: "arch-pocket",
        envelopeColor: "#6E2B3E",
        linerColor: "#E8C794",
        waxSeal: {
          enabled: true,
          color: "#C89A52",
          monogram: "Z&O",
          emblem: "floral",
        },
        promptText: "Tap the floral crest to unseal the celebration",
      },
      content: {
        hostLine: "In joyful celebration of their marriage",
        headline: "Zoya & Omar",
        subtitle: "Invite you to share an afternoon of blooms, vows & dinner",
        storyQuote:
          "Surrounded by spring peonies and the people who mean the world to us.",
        heroImageUrl: null,
        couple: {
          layout: "side-by-side",
          frameShape: "arch",
          crestText: "&",
          brideName: "Zoya Raza",
          brideRole: "The Bride",
          brideImageUrl: null,
          groomName: "Omar Farooq",
          groomRole: "The Groom",
          groomImageUrl: null,
        },
        dressCode: "Garden Couture / Rose, Ivory & Champagne",
        itinerary: [
          {
            id: "it-1",
            title: "Botanical Welcome Tea",
            time: "5:00 PM",
            description: "Rosewater spritz & acoustic strings under the pergola",
          },
          {
            id: "it-2",
            title: "Vows Beneath the Floral Arch",
            time: "6:15 PM",
            description: "Intimate ceremony framed by blush peonies",
          },
          {
            id: "it-3",
            title: "Conservatory Candlelight Dinner",
            time: "7:45 PM",
            description: "Shared tables, speeches, and dessert bar",
          },
        ],
        gallery: [],
        rsvpHeadline: "Celebrate With Us",
        rsvpDeadline: "Kindly confirm two weeks prior",
        maxGuestsPerParty: 6,
      },
      sections: {
        showCouple: true,
        showCountdown: true,
        showItinerary: true,
        showVenue: true,
        showGallery: true,
        showRsvp: true,
      },
      motion: {
        preset: "cinematic-silk",
        particles: "petals",
        lottieAccent: "floral-flourish",
      },
      audio: {
        enabled: true,
        trackId: "celestial-harp",
        trackTitle: "Moonlight Harp",
        customUrl: null,
        volume: 0.6,
      },
    },
  },
  {
    id: "11111111-1111-4111-8111-111111111106",
    title: "Mehndi Marigold & Courtyard",
    category: "mehndi",
    thumbnail_url: "/art/marigold-mehndi.jpg",
    is_active: true,
    created_at: "2026-02-02T00:00:00.000Z",
    default_config: {
      theme: {
        presetId: "marigold-mehndi",
        palette: {
          background: "#FFF9EE",
          surface: "#FFFDF7",
          primary: "#B44323",
          secondary: "#D97724",
          accent: "#E29E21",
          text: "#2A1B12",
          mutedText: "#7B6150",
        },
        typography: {
          displayFont: "playfair",
          bodyFont: "dm-sans",
          scriptFont: "great-vibes",
        },
        paperTexture: "linen",
        cardArt: {
          motif: "marigold-garland",
          borderStyle: "gold-filigree",
          backdropPreset: "marigold-mehndi",
          backdropUrl: null,
          backdropOpacity: 0.46,
          heroFrame: "polaroid",
        },
      },
      envelope: {
        style: "royal-flap",
        envelopeColor: "#B44323",
        linerColor: "#F4C257",
        waxSeal: {
          enabled: true,
          color: "#E29E21",
          monogram: "H&D",
          emblem: "floral",
        },
        promptText: "Unseal the marigold envelope for our Mehndi night",
      },
      content: {
        hostLine: "Come dance, laugh & celebrate the Dholki & Mehndi of",
        headline: "Hira & Daniyal",
        subtitle: "Marigold garlands, dhol rhythms & starlit courtyard festivities",
        storyQuote:
          "Henna, music, and vibrant colors as two families become one.",
        heroImageUrl: null,
        couple: {
          layout: "side-by-side",
          frameShape: "scallop",
          crestText: "&",
          brideName: "Hira Noor",
          brideRole: "Team Bride",
          brideImageUrl: null,
          groomName: "Daniyal Mir",
          groomRole: "Team Groom",
          groomImageUrl: null,
        },
        dressCode: "Festive Desi / Mustard, Sage, Coral & Emerald",
        itinerary: [
          {
            id: "it-1",
            title: "Mogra Welcome & Bangles Bar",
            time: "7:00 PM",
            description: "Fresh jasmine bracelets & artisan henna corner",
          },
          {
            id: "it-2",
            title: "Rasm-e-Heena & Dhol Entrance",
            time: "8:30 PM",
            description: "Choreographed family dances beneath the fairy lights",
          },
          {
            id: "it-3",
            title: "Late Night Street Feast",
            time: "10:00 PM",
            description: "Chai cart, kulfi & live qawwali",
          },
        ],
        gallery: [],
        rsvpHeadline: "Join the Festivities",
        rsvpDeadline: "RSVP with your party headcount",
        maxGuestsPerParty: 8,
      },
      sections: {
        showCouple: true,
        showCountdown: true,
        showItinerary: true,
        showVenue: true,
        showGallery: true,
        showRsvp: true,
      },
      motion: {
        preset: "playful-pop",
        particles: "petals",
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
    id: "11111111-1111-4111-8111-111111111107",
    title: "Avant-Garde Champagne Silk",
    category: "wedding",
    thumbnail_url: "/art/abstract-silk.jpg",
    is_active: true,
    created_at: "2026-02-03T00:00:00.000Z",
    default_config: {
      theme: {
        presetId: "champagne-silk",
        palette: {
          background: "#F7F3ED",
          surface: "#FCF9F4",
          primary: "#261E1A",
          secondary: "#5B483E",
          accent: "#B5825E",
          text: "#201915",
          mutedText: "#72645B",
        },
        typography: {
          displayFont: "syne",
          bodyFont: "cormorant",
          scriptFont: "cormorant",
        },
        paperTexture: "silk",
        cardArt: {
          motif: "abstract-organic",
          borderStyle: "editorial-double",
          backdropPreset: "abstract-silk",
          backdropUrl: null,
          backdropOpacity: 0.48,
          heroFrame: "polaroid",
        },
      },
      envelope: {
        style: "minimal-folio",
        envelopeColor: "#261E1A",
        linerColor: "#DFC3AC",
        waxSeal: {
          enabled: true,
          color: "#B5825E",
          monogram: "M&F",
          emblem: "monogram",
        },
        promptText: "Tap seal to open the modern wedding folio",
      },
      content: {
        hostLine: "An Editorial Celebration",
        headline: "Maham & Faris",
        subtitle: "Modern vows, sculptural florals & late-evening supper",
        storyQuote:
          "Crafted around minimal beauty, meaningful vows, and effortless joy.",
        heroImageUrl: null,
        couple: {
          layout: "editorial-split",
          frameShape: "polaroid",
          crestText: "+",
          brideName: "Maham",
          brideRole: "Architect & Collector",
          brideImageUrl: null,
          groomName: "Faris",
          groomRole: "Designer & Dreamer",
          groomImageUrl: null,
        },
        dressCode: "Modern Black & Earth Tones",
        itinerary: [
          {
            id: "it-1",
            title: "Atelier Cocktail Hour",
            time: "6:00 PM",
            description: "Warm espresso tonics & ambient vinyl set",
          },
          {
            id: "it-2",
            title: "Candlelit Signing & Toasts",
            time: "7:30 PM",
            description: "Minimalist glasshouse vows",
          },
          {
            id: "it-3",
            title: "Tasting Dinner",
            time: "8:45 PM",
            description: "Four-course contemporary supper",
          },
        ],
        gallery: [],
        rsvpHeadline: "Your Presence Matters",
        rsvpDeadline: "Please respond online below",
        maxGuestsPerParty: 4,
      },
      sections: {
        showCouple: true,
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
        volume: 0.55,
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
        cardArt: {
          motif: "celestial-stars",
          borderStyle: "arch-frame",
          backdropPreset: "moonlit-garden",
          backdropUrl: null,
          backdropOpacity: 0.5,
          heroFrame: "oval",
        },
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
        subtitle:
          "An evening of moonlight, gratitude, and heartfelt celebration",
        storyQuote:
          "As the stars gather above, we celebrate a new chapter blessed with love and warmth.",
        heroImageUrl: null,
        couple: {
          layout: "side-by-side",
          frameShape: "oval",
          crestText: "&",
          brideName: "Sana",
          brideRole: "The Bride",
          brideImageUrl: null,
          groomName: "Hamza",
          groomRole: "Son of Mr. & Mrs. Siddiqui",
          groomImageUrl: null,
        },
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
        showCouple: true,
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
    id: "11111111-1111-4111-8111-111111111108",
    title: "Shahi Baraat (Crimson & Zari)",
    category: "baraat",
    thumbnail_url: "/art/baraat-palace.jpg",
    is_active: true,
    created_at: "2026-02-04T00:00:00.000Z",
    default_config: {
      theme: {
        presetId: "shahi-baraat",
        palette: {
          background: "#FAF3EB",
          surface: "#FFFDF9",
          primary: "#6E1423",
          secondary: "#9A2A3B",
          accent: "#C9983A",
          text: "#241114",
          mutedText: "#785D60",
        },
        typography: {
          displayFont: "cinzel",
          bodyFont: "cormorant",
          scriptFont: "great-vibes",
        },
        paperTexture: "linen",
        cardArt: {
          motif: "royal-arch",
          borderStyle: "gold-filigree",
          backdropPreset: "baraat-palace",
          backdropUrl: null,
          backdropOpacity: 0.46,
          heroFrame: "arch",
        },
      },
      envelope: {
        style: "royal-flap",
        envelopeColor: "#6E1423",
        linerColor: "#D6A954",
        waxSeal: {
          enabled: true,
          color: "#C9983A",
          monogram: "S&H",
          emblem: "crown",
        },
        promptText: "Tap the royal crest to welcome the Shahi Baraat",
      },
      content: {
        hostLine: "Mr. & Mrs. Qureshi joyously invite you to the Baraat of",
        headline: "Salma & Haris",
        subtitle:
          "Procession under candlelit chandeliers, Nikah vows & royal banquet",
        storyQuote:
          "Two traditions woven together with crimson roses, heritage, and blessings.",
        heroImageUrl: null,
        couple: {
          layout: "side-by-side",
          frameShape: "arch",
          crestText: "&",
          brideName: "Salma Qureshi",
          brideRole: "The Bride",
          brideImageUrl: null,
          groomName: "Haris Javed",
          groomRole: "The Groom",
          groomImageUrl: null,
        },
        dressCode: "Royal Heritage / Crimson, Ivory & Antique Gold",
        itinerary: [
          {
            id: "it-1",
            title: "Istiqbal-e-Baraat",
            time: "7:00 PM",
            description: "Grand floral welcome and traditional dhol procession",
          },
          {
            id: "it-2",
            title: "Nikah & Garland Exchange",
            time: "8:00 PM",
            description: "Sacred vows beneath the crimson jharokha pavilion",
          },
          {
            id: "it-3",
            title: "Shahi Dastarkhwan",
            time: "9:15 PM",
            description: "Heritage multi-course dinner and family blessings",
          },
        ],
        gallery: [],
        rsvpHeadline: "Grace Us With Your Presence",
        rsvpDeadline: "Please confirm attendance two weeks prior",
        maxGuestsPerParty: 6,
      },
      sections: {
        showCouple: true,
        showCountdown: true,
        showItinerary: true,
        showVenue: true,
        showGallery: true,
        showRsvp: true,
      },
      motion: {
        preset: "royal-unfold",
        particles: "petals",
        lottieAccent: "floral-flourish",
      },
      audio: {
        enabled: true,
        trackId: "festive-strings",
        trackTitle: "Golden Hour Chimes",
        customUrl: null,
        volume: 0.6,
      },
    },
  },
  {
    id: "11111111-1111-4111-8111-111111111109",
    title: "Ivory Magnolia & Rose Engagement",
    category: "engagement",
    thumbnail_url: "/art/engagement-bloom.jpg",
    is_active: true,
    created_at: "2026-02-05T00:00:00.000Z",
    default_config: {
      theme: {
        presetId: "ivory-engagement",
        palette: {
          background: "#FBF8F4",
          surface: "#FFFFFF",
          primary: "#3D4F46",
          secondary: "#7C9286",
          accent: "#C7927A",
          text: "#212724",
          mutedText: "#6D7772",
        },
        typography: {
          displayFont: "cormorant",
          bodyFont: "jakarta",
          scriptFont: "great-vibes",
        },
        paperTexture: "vellum",
        cardArt: {
          motif: "floral-bouquet",
          borderStyle: "botanical-vine",
          backdropPreset: "engagement-bloom",
          backdropUrl: null,
          backdropOpacity: 0.5,
          heroFrame: "oval",
        },
      },
      envelope: {
        style: "arch-pocket",
        envelopeColor: "#3D4F46",
        linerColor: "#E4C5B6",
        waxSeal: {
          enabled: true,
          color: "#C7927A",
          monogram: "R&K",
          emblem: "floral",
        },
        promptText: "Tap the rose-gold seal to celebrate the engagement",
      },
      content: {
        hostLine: "Together with both families, celebrate the engagement of",
        headline: "Rania & Kabir",
        subtitle:
          "Ring ceremony, botanical garden high-tea & evening portraits",
        storyQuote:
          "From one unforgettable promise to a lifetime ahead — begin this chapter with us.",
        heroImageUrl: null,
        couple: {
          layout: "side-by-side",
          frameShape: "oval",
          crestText: "&",
          brideName: "Rania Aziz",
          brideRole: "Soon-to-be Bride",
          brideImageUrl: null,
          groomName: "Kabir Hassan",
          groomRole: "Soon-to-be Groom",
          groomImageUrl: null,
        },
        dressCode: "Pastel Sage, Champagne & Pearl",
        itinerary: [
          {
            id: "it-1",
            title: "Garden Aperitifs & Portraits",
            time: "5:00 PM",
            description: "Welcome tea & magnolia courtyard photos",
          },
          {
            id: "it-2",
            title: "Rasm-e-Nisbat & Ring Exchange",
            time: "6:15 PM",
            description: "Formal exchange of rings & sweet traditions",
          },
          {
            id: "it-3",
            title: "Sunset Conservatory Dinner",
            time: "7:30 PM",
            description: "Acoustic violin & intimate celebration feast",
          },
        ],
        gallery: [],
        rsvpHeadline: "Join Our Celebration",
        rsvpDeadline: "Kindly confirm below",
        maxGuestsPerParty: 5,
      },
      sections: {
        showCouple: true,
        showCountdown: true,
        showItinerary: true,
        showVenue: true,
        showGallery: true,
        showRsvp: true,
      },
      motion: {
        preset: "cinematic-silk",
        particles: "gold-dust",
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
];

export const DEFAULT_DESIGN_DATA: EventDesignData =
  STARTER_TEMPLATES[0].default_config;

function stripNullish<T extends Record<string, unknown>>(
  obj: Partial<T> | null | undefined
): Partial<T> {
  if (!obj || typeof obj !== "object") return {};
  const cleaned: Partial<T> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== null && v !== undefined) {
      cleaned[k as keyof T] = v as T[keyof T];
    }
  }
  return cleaned;
}

export function mergeDesignData(raw: unknown): EventDesignData {
  const parsed = eventDesignDataSchema.safeParse(raw);
  if (parsed.success) {
    return parsed.data;
  }

  const candidate =
    typeof raw === "object" && raw !== null
      ? (raw as {
          theme?: Partial<EventDesignData["theme"]> & {
            cardArt?: Partial<CardArtConfig> | null;
          };
          envelope?: Partial<EventDesignData["envelope"]>;
          content?: Partial<EventDesignData["content"]> & {
            couple?: Partial<CoupleProfile> | null;
          };
          sections?: Partial<EventDesignData["sections"]>;
          motion?: Partial<EventDesignData["motion"]>;
          audio?: Partial<EventDesignData["audio"]>;
        })
      : {};

  const rawCardArt = candidate.theme?.cardArt;
  const normalizedCardArt: CardArtConfig = {
    ...LEGACY_CARD_ART_FALLBACK,
    ...stripNullish(rawCardArt),
    backdropUrl:
      typeof rawCardArt?.backdropUrl === "string"
        ? rawCardArt.backdropUrl
        : null,
    backdropOpacity:
      typeof rawCardArt?.backdropOpacity === "number" &&
      Number.isFinite(rawCardArt.backdropOpacity)
        ? Math.min(0.65, Math.max(0.08, rawCardArt.backdropOpacity))
        : LEGACY_CARD_ART_FALLBACK.backdropOpacity,
  };

  const rawCouple = candidate.content?.couple;
  const normalizedCouple: CoupleProfile = {
    ...LEGACY_COUPLE_FALLBACK,
    ...stripNullish(rawCouple),
    brideImageUrl:
      typeof rawCouple?.brideImageUrl === "string"
        ? rawCouple.brideImageUrl
        : null,
    groomImageUrl:
      typeof rawCouple?.groomImageUrl === "string"
        ? rawCouple.groomImageUrl
        : null,
  };

  const rawSections = candidate.sections;

  return {
    theme: {
      ...DEFAULT_DESIGN_DATA.theme,
      ...stripNullish(candidate.theme),
      palette: {
        ...DEFAULT_DESIGN_DATA.theme.palette,
        ...stripNullish(candidate.theme?.palette),
      },
      typography: {
        ...DEFAULT_DESIGN_DATA.theme.typography,
        ...stripNullish(candidate.theme?.typography),
      },
      cardArt: normalizedCardArt,
    },
    envelope: {
      ...DEFAULT_DESIGN_DATA.envelope,
      ...stripNullish(candidate.envelope),
      waxSeal: {
        ...DEFAULT_DESIGN_DATA.envelope.waxSeal,
        ...stripNullish(candidate.envelope?.waxSeal),
      },
    },
    content: {
      ...DEFAULT_DESIGN_DATA.content,
      ...stripNullish(candidate.content),
      heroImageUrl:
        typeof candidate.content?.heroImageUrl === "string"
          ? candidate.content.heroImageUrl
          : null,
      couple: normalizedCouple,
      itinerary: Array.isArray(candidate.content?.itinerary)
        ? candidate.content.itinerary
        : DEFAULT_DESIGN_DATA.content.itinerary,
      gallery: Array.isArray(candidate.content?.gallery)
        ? candidate.content.gallery
        : DEFAULT_DESIGN_DATA.content.gallery,
    },
    sections: {
      ...DEFAULT_DESIGN_DATA.sections,
      ...stripNullish(rawSections),
      showCouple:
        typeof rawSections?.showCouple === "boolean"
          ? rawSections.showCouple
          : false,
    },
    motion: {
      ...DEFAULT_DESIGN_DATA.motion,
      ...stripNullish(candidate.motion),
    },
    audio: {
      ...DEFAULT_DESIGN_DATA.audio,
      ...stripNullish(candidate.audio),
      customUrl:
        typeof candidate.audio?.customUrl === "string"
          ? candidate.audio.customUrl
          : null,
    },
  };
}

/**
 * Merges live Supabase template records with curated code presets so new trendy
 * marriage templates and upgraded art configs are immediately available even
 * before optional SQL migrations are executed.
 */
export function mergeTemplateCatalog(
  dbRows: Array<
    Omit<TemplateRecord, "default_config"> & { default_config: unknown }
  > | null | undefined,
  starterTemplates: TemplateRecord[] = STARTER_TEMPLATES
): TemplateRecord[] {
  const starterById = new Map(starterTemplates.map((t) => [t.id, t]));
  const dbById = new Map((dbRows ?? []).map((t) => [t.id, t]));

  const merged: TemplateRecord[] = starterTemplates.map((starter) => {
    const dbMatch = dbById.get(starter.id);
    if (!dbMatch) return starter;

    const rawCfg =
      typeof dbMatch.default_config === "object" &&
      dbMatch.default_config !== null
        ? (dbMatch.default_config as {
            theme?: { cardArt?: Partial<CardArtConfig> };
            content?: { couple?: Partial<CoupleProfile> };
            sections?: { showCouple?: boolean };
          })
        : {};

    const mergedConfig = mergeDesignData(dbMatch.default_config);
    // Upgrade legacy seeded templates that lack cardArt / couple presets
    if (!rawCfg.theme?.cardArt) {
      mergedConfig.theme.cardArt = starter.default_config.theme.cardArt;
    }
    if (!rawCfg.content?.couple) {
      mergedConfig.content.couple = starter.default_config.content.couple;
    }
    if (typeof rawCfg.sections?.showCouple !== "boolean") {
      mergedConfig.sections.showCouple =
        starter.default_config.sections.showCouple;
    }

    return {
      ...starter,
      ...dbMatch,
      default_config: mergedConfig,
    };
  });

  // Preserve extra custom wedding DB templates while excluding retired non-wedding starters
  for (const row of dbRows ?? []) {
    if (
      !starterById.has(row.id) &&
      row.is_active !== false &&
      isWeddingTemplate(row)
    ) {
      merged.push({
        ...row,
        default_config: mergeDesignData(row.default_config),
      });
    }
  }

  return merged;
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
    "https://www.google.com/maps/search/?api=1&query=31.510500,74.348700",
  audio_url: "/audio/ambient-piano.wav",
  design_data: STARTER_TEMPLATES[0].default_config,
  is_published: true,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};
