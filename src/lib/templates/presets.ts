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
  InvitationDomainId,
  TemplateRecord,
  eventDesignDataSchema,
} from "@/types/invitation";
import { getDomainForCategory } from "./categories";

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
  domains: InvitationDomainId[];
}> = [
  {
    id: "none",
    label: "Pure Paper",
    subtitle: "Clean stationery finish",
    imageUrl: null,
    previewGradient: "linear-gradient(135deg, #FAF6EE, #EDE4D3)",
    domains: ["wedding", "birthday", "gala", "party"],
  },
  {
    id: "nikah-courtyard",
    label: "Nikah Courtyard",
    subtitle: "Lantern arches & jasmine",
    imageUrl: "/art/nikah-courtyard.jpg",
    previewGradient: "linear-gradient(135deg, #114232, #C99A3B)",
    domains: ["wedding"],
  },
  {
    id: "peony-arch",
    label: "Peony Bloom Arch",
    subtitle: "Watercolor blush & rose",
    imageUrl: "/art/peony-arch.jpg",
    previewGradient: "linear-gradient(135deg, #FDF2EE, #C87D87)",
    domains: ["wedding", "party"],
  },
  {
    id: "marigold-mehndi",
    label: "Marigold Mehndi",
    subtitle: "Festive mogra & saffron",
    imageUrl: "/art/marigold-mehndi.jpg",
    previewGradient: "linear-gradient(135deg, #FFF5DB, #E29E21)",
    domains: ["wedding"],
  },
  {
    id: "baraat-palace",
    label: "Shahi Baraat",
    subtitle: "Crimson roses & chandeliers",
    imageUrl: "/art/baraat-palace.jpg",
    previewGradient: "linear-gradient(135deg, #FAF3EB, #6E1423)",
    domains: ["wedding"],
  },
  {
    id: "engagement-bloom",
    label: "Ivory Magnolia",
    subtitle: "Eucalyptus & rose quartz",
    imageUrl: "/art/engagement-bloom.jpg",
    previewGradient: "linear-gradient(135deg, #FBF8F4, #7C9286)",
    domains: ["wedding", "party"],
  },
  {
    id: "abstract-silk",
    label: "Abstract Silk",
    subtitle: "Editorial champagne waves",
    imageUrl: "/art/abstract-silk.jpg",
    previewGradient: "linear-gradient(135deg, #F7F3ED, #B5825E)",
    domains: ["wedding", "gala"],
  },
  {
    id: "moonlit-garden",
    label: "Moonlit Garden",
    subtitle: "Midnight flora & pearl",
    imageUrl: "/art/moonlit-garden.jpg",
    previewGradient: "linear-gradient(135deg, #0E1324, #4A5A8A)",
    domains: ["wedding", "birthday", "gala"],
  },
  {
    id: "birthday-confetti",
    label: "Confetti Atelier",
    subtitle: "Warm coral & gold ribbon",
    imageUrl: "/art/birthday-confetti.jpg",
    previewGradient: "linear-gradient(135deg, #FFF7F2, #C94B38)",
    domains: ["birthday", "party"],
  },
  {
    id: "birthday-candles",
    label: "Sunburst Soiree",
    subtitle: "Terracotta cake & cobalt",
    imageUrl: "/art/birthday-candles.jpg",
    previewGradient: "linear-gradient(135deg, #FDF8F2, #1D3C6A)",
    domains: ["birthday", "party"],
  },
  {
    id: "gala-noir",
    label: "Noir Art Deco",
    subtitle: "Obsidian & champagne foil",
    imageUrl: "/art/gala-noir.jpg",
    previewGradient: "linear-gradient(135deg, #0B0B0D, #D4AF37)",
    domains: ["gala"],
  },
  {
    id: "baby-shower",
    label: "Little Cloud Meadow",
    subtitle: "Botanical sage & chamomile",
    imageUrl: "/art/baby-shower.jpg",
    previewGradient: "linear-gradient(135deg, #F8FAF8, #7FA393)",
    domains: ["party"],
  },
  {
    id: "graduation-laurel",
    label: "Honor Laurel",
    subtitle: "Olive wreath & champagne",
    imageUrl: "/art/graduation-laurel.jpg",
    previewGradient: "linear-gradient(135deg, #FAF6EE, #1E3A5F)",
    domains: ["party"],
  },
];

export function getBackdropPresetsForDomain(domainId: InvitationDomainId) {
  return CARD_BACKDROP_PRESETS.filter((preset) =>
    preset.domains.includes(domainId)
  );
}

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
  { id: "rounded", label: "Soft Rounded" },
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

export function isWeddingTemplate(
  tpl: Pick<TemplateRecord, "id" | "category">
): boolean {
  return getDomainForCategory(tpl.category) === "wedding";
}

export function getTemplatesByDomain(
  templates: TemplateRecord[],
  domainId: InvitationDomainId
): TemplateRecord[] {
  return templates.filter(
    (tpl) => getDomainForCategory(tpl.category) === domainId
  );
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
    thumbnail_url: "/templates/blush-peony.svg",
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
    thumbnail_url: "/templates/marigold-mehndi.svg",
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
    thumbnail_url: "/templates/champagne-silk.svg",
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
    thumbnail_url: "/templates/shahi-baraat.svg",
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
    thumbnail_url: "/templates/ivory-magnolia.svg",
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
  {
    id: "11111111-1111-4111-8111-111111111121",
    title: "Jharokha Rajputana (Jaipur Heritage & Pichwai Gold)",
    category: "wedding",
    thumbnail_url: "/templates/rajputana-heritage.svg",
    is_active: true,
    created_at: "2026-03-01T00:00:00.000Z",
    default_config: {
      theme: {
        presetId: "rajputana-heritage",
        palette: {
          background: "#FBF6EE",
          surface: "#FFFDF8",
          primary: "#681424",
          secondary: "#8C2436",
          accent: "#D4A348",
          text: "#2A1810",
          mutedText: "#7C5E50",
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
          backdropOpacity: 0.38,
          heroFrame: "arch",
        },
      },
      envelope: {
        style: "royal-flap",
        envelopeColor: "#5B121F",
        linerColor: "#D4A348",
        waxSeal: {
          enabled: true,
          color: "#B88628",
          monogram: "M&D",
          emblem: "crown",
        },
        promptText: "Tap the royal wax seal to unveil the imperial wedding folio",
      },
      content: {
        hostLine: "Under the gracious auspices of their elders & families",
        headline: "Meera & Devrat",
        subtitle: "Request the honor of your august presence at their Royal Vivah Sanskar & Banquet",
        storyQuote: "Rooted in heritage, celebrated with grandeur — two royal lineages unite under starlit palace arches.",
        heroImageUrl: null,
        couple: {
          layout: "side-by-side",
          frameShape: "arch",
          crestText: "&",
          brideName: "Meera Rathore",
          brideRole: "Daughter of Maharaj & Maharani Rathore",
          brideImageUrl: null,
          groomName: "Devrat Shekhawat",
          groomRole: "Son of Thakur & Thakurani Shekhawat",
          groomImageUrl: null,
        },
        dressCode: "Royal Heritage / Regal Sherwanis, Zari Lehengas & Turbans",
        itinerary: [
          {
            id: "it-1",
            title: "Shahi Swagat & Shehnai Welcome",
            time: "6:00 PM",
            description: "Rose petal showers, traditional welcome aarti and live shehnai ensemble",
          },
          {
            id: "it-2",
            title: "Varmala & Royal Arch Exchange",
            time: "7:30 PM",
            description: "Grand floral jaimala ceremony under illuminated marble courtyards",
          },
          {
            id: "it-3",
            title: "Pheras & Shahi Dastarkhwan Banquet",
            time: "8:45 PM",
            description: "Sacred Vedic vows around the agni kund followed by a grand royal feast",
          },
        ],
        gallery: [],
        rsvpHeadline: "R.S.V.P.",
        rsvpDeadline: "Kindly confirm your attendance three weeks prior to the royal nuptials",
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
        trackId: "festive-strings",
        trackTitle: "Golden Hour Chimes",
        customUrl: null,
        volume: 0.65,
      },
    },
  },
  {
    id: "11111111-1111-4111-8111-111111111122",
    title: "Dawat-e-Ishq (Midnight Indigo & Sufi Lanterns)",
    category: "wedding",
    thumbnail_url: "/templates/dawat-e-ishq.svg",
    is_active: true,
    created_at: "2026-03-02T00:00:00.000Z",
    default_config: {
      theme: {
        presetId: "dawat-e-ishq",
        palette: {
          background: "#0B132B",
          surface: "#131E3D",
          primary: "#E0A948",
          secondary: "#384B78",
          accent: "#F5C563",
          text: "#F7F8FC",
          mutedText: "#9BA9CC",
        },
        typography: {
          displayFont: "cinzel",
          bodyFont: "cormorant",
          scriptFont: "great-vibes",
        },
        paperTexture: "obsidian",
        cardArt: {
          motif: "celestial-stars",
          borderStyle: "gold-filigree",
          backdropPreset: "moonlit-garden",
          backdropUrl: null,
          backdropOpacity: 0.42,
          heroFrame: "oval",
        },
      },
      envelope: {
        style: "arch-pocket",
        envelopeColor: "#0B132B",
        linerColor: "#E0A948",
        waxSeal: {
          enabled: true,
          color: "#C98D2E",
          monogram: "I&F",
          emblem: "crescent",
        },
        promptText: "Tap the celestial wax seal to enter the starlit courtyard",
      },
      content: {
        hostLine: "Together with their families, in celebration of divine grace",
        headline: "Inaaya & Farhan",
        subtitle: "Cordially request your presence at their Dawat-e-Ishq & Qawwali Night",
        storyQuote: "Kahaan se aayi yeh taaza hawa... when hearts harmonize, starlight fills the night.",
        heroImageUrl: null,
        couple: {
          layout: "side-by-side",
          frameShape: "oval",
          crestText: "&",
          brideName: "Inaaya Mir",
          brideRole: "Daughter of Dr. & Mrs. Mir",
          brideImageUrl: null,
          groomName: "Farhan Qureshi",
          groomRole: "Son of Barrister & Mrs. Qureshi",
          groomImageUrl: null,
        },
        dressCode: "Nocturne Elegance / Velvet Kurtas, Anarkalis & Pashminas in Deep Jewel Tones",
        itinerary: [
          {
            id: "it-1",
            title: "Lantern Courtyard Welcome & Kahwa Bar",
            time: "7:00 PM",
            description: "Cardamom green tea, saffron dry fruits and acoustic harmonium prelude",
          },
          {
            id: "it-2",
            title: "Mehfil-e-Qawwali & Sufi Poetry",
            time: "8:15 PM",
            description: "Soulful renditions by world-renowned Ustad qawwals beneath candlelight",
          },
          {
            id: "it-3",
            title: "Shahi Dawat & Kashmiri Chai Salon",
            time: "10:00 PM",
            description: "Slow-cooked heritage feast followed by pink noon chai and pistachio jalebis",
          },
        ],
        gallery: [],
        rsvpHeadline: "Kindly Grace Us With Your Presence",
        rsvpDeadline: "Please confirm your attendance by the fourteenth of November",
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
        volume: 0.6,
      },
    },
  },
  {
    id: "11111111-1111-4111-8111-111111111123",
    title: "Tuscan Olive & Terracotta Villa (Destination Sunset)",
    category: "wedding",
    thumbnail_url: "/templates/tuscan-terracotta.svg",
    is_active: true,
    created_at: "2026-03-03T00:00:00.000Z",
    default_config: {
      theme: {
        presetId: "tuscan-terracotta",
        palette: {
          background: "#F9F6F0",
          surface: "#FFFFFF",
          primary: "#B85D38",
          secondary: "#566A4E",
          accent: "#D99B43",
          text: "#2B2118",
          mutedText: "#7A6E64",
        },
        typography: {
          displayFont: "cormorant",
          bodyFont: "dm-sans",
          scriptFont: "great-vibes",
        },
        paperTexture: "linen",
        cardArt: {
          motif: "floral-bouquet",
          borderStyle: "botanical-vine",
          backdropPreset: "peony-arch",
          backdropUrl: null,
          backdropOpacity: 0.32,
          heroFrame: "oval",
        },
      },
      envelope: {
        style: "minimal-folio",
        envelopeColor: "#B85D38",
        linerColor: "#EFE6D8",
        waxSeal: {
          enabled: true,
          color: "#8F4122",
          monogram: "S&M",
          emblem: "floral",
        },
        promptText: "Tap the terracotta wax seal to unseal your Italian villa invitation",
      },
      content: {
        hostLine: "Together with their joyfully expectant families",
        headline: "Sofia & Matteo",
        subtitle: "Warmly invite you to celebrate their destination wedding under the Tuscan sun",
        storyQuote: "Underneath the Italian olive groves and golden hills, two wanderers found home in each other.",
        heroImageUrl: null,
        couple: {
          layout: "side-by-side",
          frameShape: "oval",
          crestText: "&",
          brideName: "Sofia Romano",
          brideRole: "Daughter of Luca & Elena Romano",
          brideImageUrl: null,
          groomName: "Matteo Bianchi",
          groomRole: "Son of Marco & Giulia Bianchi",
          groomImageUrl: null,
        },
        dressCode: "Cocktail Al Fresco / Earthy Terracotta, Olive, Sage & Crisp Summer Linens",
        itinerary: [
          {
            id: "it-1",
            title: "Aperitivo & Prosecco in the Olive Grove",
            time: "4:30 PM",
            description: "Wood-fired crostini, sparkling spritz, and live Italian acoustic guitar",
          },
          {
            id: "it-2",
            title: "Garden Vows at Golden Hour",
            time: "5:45 PM",
            description: "Sunset ceremony framed by cypress trees and antique stone balustrades",
          },
          {
            id: "it-3",
            title: "Long Table Family Feast & Gelato Cart",
            time: "7:15 PM",
            description: "Handmade tagliolini, Chianti toasts, candlelit long tables and dancing under bistro lights",
          },
        ],
        gallery: [],
        rsvpHeadline: "Favorita Risposta",
        rsvpDeadline: "Please respond by the first of June to ensure villa accommodations",
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
        particles: "petals",
        lottieAccent: "floral-flourish",
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
    id: "11111111-1111-4111-8111-111111111124",
    title: "Kanjeevaram Temple Muhurtham (Kumkum & Vedic Gold)",
    category: "wedding",
    thumbnail_url: "/templates/kanjeevaram-temple.svg",
    is_active: true,
    created_at: "2026-03-04T00:00:00.000Z",
    default_config: {
      theme: {
        presetId: "kanjeevaram-temple",
        palette: {
          background: "#FDF8EE",
          surface: "#FFFDF7",
          primary: "#881B24",
          secondary: "#580E15",
          accent: "#D89F34",
          text: "#231617",
          mutedText: "#8E6351",
        },
        typography: {
          displayFont: "cinzel",
          bodyFont: "cormorant",
          scriptFont: "great-vibes",
        },
        paperTexture: "linen",
        cardArt: {
          motif: "marigold-garland",
          borderStyle: "gold-filigree",
          backdropPreset: "marigold-mehndi",
          backdropUrl: null,
          backdropOpacity: 0.35,
          heroFrame: "arch",
        },
      },
      envelope: {
        style: "royal-flap",
        envelopeColor: "#7A141D",
        linerColor: "#D89F34",
        waxSeal: {
          enabled: true,
          color: "#B87B1E",
          monogram: "A&S",
          emblem: "crown",
        },
        promptText: "Tap the auspicious gold seal to receive sacred blessings",
      },
      content: {
        hostLine: "Om Sri Ganeshaya Namaha · With the blessings of Almighty & Ancestors",
        headline: "Ananya & Siddharth",
        subtitle: "Request the honor of your presence & blessings at their auspicious Kalyanam",
        storyQuote: "United by sacred Vedic rites, walking seven sacred steps toward a lifetime of togetherness.",
        heroImageUrl: null,
        couple: {
          layout: "side-by-side",
          frameShape: "arch",
          crestText: "&",
          brideName: "Ananya Raman",
          brideRole: "Daughter of Sri. & Smt. Ramanathan",
          brideImageUrl: null,
          groomName: "Siddharth Iyer",
          groomRole: "Son of Sri. & Smt. Sundaresan",
          groomImageUrl: null,
        },
        dressCode: "Traditional South Indian / Kanjeevaram Silk Sarees & Veshti / Kurta",
        itinerary: [
          {
            id: "it-1",
            title: "Nadaswaram & Mangala Vadhyam",
            time: "7:30 AM",
            description: "Sacred dawn musical invocation, filter coffee and traditional welcome",
          },
          {
            id: "it-2",
            title: "Muhurtham & Maangalya Dhaaranam",
            time: "9:15 AM",
            description: "Tying of the holy thali amidst showering of akshata blessings",
          },
          {
            id: "it-3",
            title: "Kalyana Virundhu (Traditional Banana Leaf Feast)",
            time: "11:30 AM",
            description: "Sumptuous South Indian feast served on fresh plantain leaves",
          },
        ],
        gallery: [],
        rsvpHeadline: "Kindly Bless The Couple",
        rsvpDeadline: "Please confirm your attendance by the tenth of December",
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
        trackId: "festive-strings",
        trackTitle: "Golden Hour Chimes",
        customUrl: null,
        volume: 0.65,
      },
    },
  },
  {
    id: "11111111-1111-4111-8111-111111111125",
    title: "Old Money Quiet Luxury (Minimalist Blind Emboss)",
    category: "wedding",
    thumbnail_url: "/templates/quiet-luxury-minimalist.svg",
    is_active: true,
    created_at: "2026-03-05T00:00:00.000Z",
    default_config: {
      theme: {
        presetId: "quiet-luxury-minimalist",
        palette: {
          background: "#F7F5F0",
          surface: "#FDFBF7",
          primary: "#18181A",
          secondary: "#3B3D42",
          accent: "#C4B59D",
          text: "#121214",
          mutedText: "#666870",
        },
        typography: {
          displayFont: "playfair",
          bodyFont: "jakarta",
          scriptFont: "great-vibes",
        },
        paperTexture: "clean",
        cardArt: {
          motif: "none",
          borderStyle: "editorial-double",
          backdropPreset: "none",
          backdropUrl: null,
          backdropOpacity: 0.2,
          heroFrame: "polaroid",
        },
      },
      envelope: {
        style: "minimal-folio",
        envelopeColor: "#18181A",
        linerColor: "#F0EAE1",
        waxSeal: {
          enabled: true,
          color: "#26262B",
          monogram: "C&A",
          emblem: "monogram",
        },
        promptText: "Tap the blind-embossed onyx seal to view the folio",
      },
      content: {
        hostLine: "Mr. & Mrs. Charles Sterling request the honor of your presence",
        headline: "Camille & Alexander",
        subtitle: "At the celebration of their marriage & black-tie dinner reception",
        storyQuote: "Simplicity is the highest form of sophistication — quiet elegance, enduring devotion.",
        heroImageUrl: null,
        couple: {
          layout: "editorial-split",
          frameShape: "polaroid",
          crestText: "&",
          brideName: "Camille Sterling",
          brideRole: "Daughter of Mr. & Mrs. Sterling",
          brideImageUrl: null,
          groomName: "Alexander Vance",
          groomRole: "Son of Dr. & Mrs. Vance",
          groomImageUrl: null,
        },
        dressCode: "Strictly Black-Tie / Floor-length gowns & classic tuxedos",
        itinerary: [
          {
            id: "it-1",
            title: "Vintage Champagne & Caviar Service",
            time: "6:00 PM",
            description: "Library salon reception with live string quartet",
          },
          {
            id: "it-2",
            title: "Vows in the Sculpture Pavilion",
            time: "7:00 PM",
            description: "Architectural candlelight vows beneath vaulted glass arches",
          },
          {
            id: "it-3",
            title: "Tasting Menu Dinner & Midnight Jazz",
            time: "8:30 PM",
            description: "Six-course seasonal dinner paired with fine reserve wines and live jazz club",
          },
        ],
        gallery: [],
        rsvpHeadline: "Répondez S'il Vous Plaît",
        rsvpDeadline: "Kindly confirm your attendance by the twentieth of September",
        maxGuestsPerParty: 2,
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
        particles: "none",
        lottieAccent: "none",
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
  {
    id: "11111111-1111-4111-8111-111111111126",
    title: "Château de Lavande (French Rococo Blue & Gilt)",
    category: "valima",
    thumbnail_url: "/templates/chateau-rococo-blue.svg",
    is_active: true,
    created_at: "2026-03-06T00:00:00.000Z",
    default_config: {
      theme: {
        presetId: "chateau-rococo-blue",
        palette: {
          background: "#F8FAFC",
          surface: "#FFFFFF",
          primary: "#4A6B82",
          secondary: "#2C4355",
          accent: "#CBB07E",
          text: "#162836",
          mutedText: "#657D91",
        },
        typography: {
          displayFont: "cormorant",
          bodyFont: "cormorant",
          scriptFont: "great-vibes",
        },
        paperTexture: "silk",
        cardArt: {
          motif: "floral-bouquet",
          borderStyle: "botanical-vine",
          backdropPreset: "peony-arch",
          backdropUrl: null,
          backdropOpacity: 0.36,
          heroFrame: "oval",
        },
      },
      envelope: {
        style: "arch-pocket",
        envelopeColor: "#3D596E",
        linerColor: "#CBB07E",
        waxSeal: {
          enabled: true,
          color: "#9E8050",
          monogram: "E&J",
          emblem: "floral",
        },
        promptText: "Tap the gilded French seal to open the château invitation",
      },
      content: {
        hostLine: "Together with their families, in celebration of love and devotion",
        headline: "Elysia & Julian",
        subtitle: "Cordially invite you to celebrate their Valima & Evening Reception",
        storyQuote: "Where lavender breezes greet stone terrace balustrades, our forever begins.",
        heroImageUrl: null,
        couple: {
          layout: "side-by-side",
          frameShape: "oval",
          crestText: "&",
          brideName: "Elysia Beaumont",
          brideRole: "Daughter of Henri & Vivienne Beaumont",
          brideImageUrl: null,
          groomName: "Julian Saint-Clair",
          groomRole: "Son of Dominique & Claire Saint-Clair",
          groomImageUrl: null,
        },
        dressCode: "Pastel Formal / Powder Blue, Lavender, Champagne & Silver",
        itinerary: [
          {
            id: "it-1",
            title: "Terrace Portraits & French Macaron Bar",
            time: "6:30 PM",
            description: "Welcome sparkling cider, elderflower spritz and harp melodies",
          },
          {
            id: "it-2",
            title: "Grand Entrance of the Couple",
            time: "7:45 PM",
            description: "Welcome shower of white hydrangea petals on the grand terrace staircase",
          },
          {
            id: "it-3",
            title: "Château Banquet & Candlelit Toasts",
            time: "8:45 PM",
            description: "Exquisite four-course banquet accompanied by speeches and dessert pavilion",
          },
        ],
        gallery: [],
        rsvpHeadline: "Kindly Grace Us With Your Presence",
        rsvpDeadline: "Two weeks prior to the reception",
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
    id: "11111111-1111-4111-8111-111111111127",
    title: "Boho Sunset Sangeet (Terracotta, Ochre & Dholki)",
    category: "mehndi",
    thumbnail_url: "/templates/boho-sunset-sangeet.svg",
    is_active: true,
    created_at: "2026-03-07T00:00:00.000Z",
    default_config: {
      theme: {
        presetId: "boho-sunset-sangeet",
        palette: {
          background: "#FDF6EE",
          surface: "#FFFBF5",
          primary: "#DF7C39",
          secondary: "#9A4222",
          accent: "#E8A942",
          text: "#2A1D15",
          mutedText: "#7F5E4E",
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
          backdropOpacity: 0.35,
          heroFrame: "rounded",
        },
      },
      envelope: {
        style: "art-deco",
        envelopeColor: "#8C3A1E",
        linerColor: "#E8A942",
        waxSeal: {
          enabled: true,
          color: "#B44A26",
          monogram: "Z&K",
          emblem: "star",
        },
        promptText: "Tap the festive terracotta seal to join the sunset fiesta",
      },
      content: {
        hostLine: "Get ready for song, dance, henna & festive beats!",
        headline: "Zara & Kabir",
        subtitle: "Invite you to their colorful Boho Sunset Sangeet & Dholki Night",
        storyQuote: "Under golden twilight skies, when the dhol begins to play, our celebration begins!",
        heroImageUrl: null,
        couple: {
          layout: "side-by-side",
          frameShape: "rounded",
          crestText: "&",
          brideName: "Zara Farooqi",
          brideRole: "Daughter of Mr. & Mrs. Farooqi",
          brideImageUrl: null,
          groomName: "Kabir Malik",
          groomRole: "Son of Mr. & Mrs. Malik",
          groomImageUrl: null,
        },
        dressCode: "Festive Boho Chic / Sunset Orange, Mustard Yellow, Terracotta & Mirror Work",
        itinerary: [
          {
            id: "it-1",
            title: "Chaat Street & Henna Mehndi Lounge",
            time: "5:30 PM",
            description: "Pani puri shots, live bangle bar, artisanal henna artists and sunset lounge vibes",
          },
          {
            id: "it-2",
            title: "Dhol Beat Entrance & Sangeet Face-Off",
            time: "7:00 PM",
            description: "High-energy dance performances by family & friends around the outdoor fire pits",
          },
          {
            id: "it-3",
            title: "Midnight Street Food Carnival & DJ Set",
            time: "9:00 PM",
            description: "Live tawa grill feast, kulfi falooda cart and dancing till late",
          },
        ],
        gallery: [],
        rsvpHeadline: "Save Your Spot on the Dancefloor",
        rsvpDeadline: "Confirm by the first of November",
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
        preset: "playful-pop",
        particles: "gold-dust",
        lottieAccent: "sparkle-ring",
      },
      audio: {
        enabled: true,
        trackId: "festive-strings",
        trackTitle: "Golden Hour Chimes",
        customUrl: null,
        volume: 0.7,
      },
    },
  },
  {
    id: "11111111-1111-4111-8111-111111111128",
    title: "Anand Karaj (Rosewater Whisper & Mint Sage)",
    category: "wedding",
    thumbnail_url: "/templates/anand-karaj-sage.svg",
    is_active: true,
    created_at: "2026-03-08T00:00:00.000Z",
    default_config: {
      theme: {
        presetId: "anand-karaj-sage",
        palette: {
          background: "#F6F9F6",
          surface: "#FFFFFF",
          primary: "#4A6B5D",
          secondary: "#2C483C",
          accent: "#C5A55D",
          text: "#192E25",
          mutedText: "#5E776C",
        },
        typography: {
          displayFont: "cinzel",
          bodyFont: "cormorant",
          scriptFont: "great-vibes",
        },
        paperTexture: "vellum",
        cardArt: {
          motif: "floral-bouquet",
          borderStyle: "botanical-vine",
          backdropPreset: "peony-arch",
          backdropUrl: null,
          backdropOpacity: 0.3,
          heroFrame: "arch",
        },
      },
      envelope: {
        style: "arch-pocket",
        envelopeColor: "#3C584C",
        linerColor: "#C5A55D",
        waxSeal: {
          enabled: true,
          color: "#A88741",
          monogram: "S&H",
          emblem: "floral",
        },
        promptText: "Tap the sage floral seal to open the sacred wedding folio",
      },
      content: {
        hostLine: "Ik Onkar · With the divine grace and blessings of Waheguru",
        headline: "Simran & Harpreet",
        subtitle: "Humbly request your presence and blessings at their sacred Anand Karaj",
        storyQuote: "They are not said to be husband and wife who merely sit together. Rather, one soul in two bodies.",
        heroImageUrl: null,
        couple: {
          layout: "side-by-side",
          frameShape: "arch",
          crestText: "&",
          brideName: "Simran Kaur",
          brideRole: "Daughter of Sardar & Sardarni Grewal",
          brideImageUrl: null,
          groomName: "Harpreet Singh",
          groomRole: "Son of Sardar & Sardarni Dhillon",
          groomImageUrl: null,
        },
        dressCode: "Elegance in Pastels / Mint Sage, Rosewater Blush, Ivory & Powder Gold (Heads to be covered)",
        itinerary: [
          {
            id: "it-1",
            title: "Baraat Arrival & Milni Ceremony",
            time: "9:30 AM",
            description: "Traditional floral garland exchange between elder family members and warm breakfast",
          },
          {
            id: "it-2",
            title: "Anand Karaj (Laavan Nuptials)",
            time: "10:45 AM",
            description: "Four sacred circumambulations around Sri Guru Granth Sahib Ji accompanied by divine kirtan",
          },
          {
            id: "it-3",
            title: "Guru Ka Langar & Family Reception",
            time: "12:30 PM",
            description: "Sacred community meal followed by celebration lunch in the garden marquee",
          },
        ],
        gallery: [],
        rsvpHeadline: "Kindly Bless Our Union",
        rsvpDeadline: "Please confirm attendance by the twenty-fifth of October",
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
    id: "11111111-1111-4111-8111-111111111103",
    title: "Confetti Atelier (Editorial Birthday)",
    category: "birthday",
    thumbnail_url: "/art/birthday-confetti.jpg",
    is_active: true,
    created_at: "2026-02-06T00:00:00.000Z",
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
        cardArt: {
          motif: "celestial-stars",
          borderStyle: "editorial-double",
          backdropPreset: "birthday-confetti",
          backdropUrl: null,
          backdropOpacity: 0.52,
          heroFrame: "polaroid",
        },
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
        hostLine: "Raise a glass & celebrate the milestone birthday of",
        headline: "Maya Turns 30",
        subtitle:
          "Golden hour rooftops, vinyl beats, and unforgettable memories",
        storyQuote:
          "Three decades of adventures — come celebrate the next chapter together!",
        heroImageUrl: null,
        couple: {
          layout: "featured-solo",
          frameShape: "polaroid",
          crestText: "★",
          brideName: "Maya Siddiqui",
          brideRole: "Turning 30 · Dreamer & Traveler",
          brideImageUrl: null,
          groomName: "",
          groomRole: "",
          groomImageUrl: null,
        },
        dressCode: "Cocktail Chic / Sunset & Champagne Hues",
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
        rsvpDeadline: "Let us know so we save your spot at the table",
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
    id: "11111111-1111-4111-8111-111111111110",
    title: "Sunburst Soiree (Modern Birthday)",
    category: "birthday",
    thumbnail_url: "/art/birthday-candles.jpg",
    is_active: true,
    created_at: "2026-02-07T00:00:00.000Z",
    default_config: {
      theme: {
        presetId: "sunburst-birthday",
        palette: {
          background: "#FDF8F2",
          surface: "#FFFFFF",
          primary: "#1D3C6A",
          secondary: "#E07A5F",
          accent: "#E39B35",
          text: "#1B2331",
          mutedText: "#616C7D",
        },
        typography: {
          displayFont: "syne",
          bodyFont: "jakarta",
          scriptFont: "cormorant",
        },
        paperTexture: "clean",
        cardArt: {
          motif: "abstract-organic",
          borderStyle: "none",
          backdropPreset: "birthday-candles",
          backdropUrl: null,
          backdropOpacity: 0.56,
          heroFrame: "rounded",
        },
      },
      envelope: {
        style: "arch-pocket",
        envelopeColor: "#1D3C6A",
        linerColor: "#F2C57C",
        waxSeal: {
          enabled: true,
          color: "#E39B35",
          monogram: "25",
          emblem: "star",
        },
        promptText: "Unseal the art-house invite for a quarter-century toast",
      },
      content: {
        hostLine: "Join friends & family for the 25th Birthday Studio Night of",
        headline: "Daniyal's 25th",
        subtitle:
          "Artisan supper club, acoustic jazz & birthday midnight cake",
        storyQuote:
          "Twenty-five years bright — come for dinner, stay for the vinyl afterparty.",
        heroImageUrl: null,
        couple: {
          layout: "featured-solo",
          frameShape: "oval",
          crestText: "★",
          brideName: "Daniyal Karim",
          brideRole: "Quarter-Century Honoree",
          brideImageUrl: null,
          groomName: "",
          groomRole: "",
          groomImageUrl: null,
        },
        dressCode: "Modern Studio Smart / Cobalt, Terracotta & Cream",
        itinerary: [
          {
            id: "it-1",
            title: "Gallery Welcome Mocktails",
            time: "7:00 PM",
            description: "Signature citrus spritzes & espresso bar",
          },
          {
            id: "it-2",
            title: "Family-Style Long Table Supper",
            time: "8:15 PM",
            description: "Shared plates & birthday toasts",
          },
          {
            id: "it-3",
            title: "Cake & Late Night DJ",
            time: "9:45 PM",
            description: "25 candles & open dance set",
          },
        ],
        gallery: [],
        rsvpHeadline: "Save Your Seat",
        rsvpDeadline: "Confirm headcount below",
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
        preset: "playful-pop",
        particles: "confetti",
        lottieAccent: "confetti-burst",
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
    id: "11111111-1111-4111-8111-111111111111",
    title: "Midnight Velvet (Birthday Dinner)",
    category: "birthday",
    thumbnail_url: "/art/moonlit-garden.jpg",
    is_active: true,
    created_at: "2026-02-08T00:00:00.000Z",
    default_config: {
      theme: {
        presetId: "midnight-birthday",
        palette: {
          background: "#0E1324",
          surface: "#161D35",
          primary: "#E5C185",
          secondary: "#3A497A",
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
          borderStyle: "gold-filigree",
          backdropPreset: "moonlit-garden",
          backdropUrl: null,
          backdropOpacity: 0.48,
          heroFrame: "oval",
        },
      },
      envelope: {
        style: "royal-flap",
        envelopeColor: "#161D35",
        linerColor: "#E5C185",
        waxSeal: {
          enabled: true,
          color: "#C99A4E",
          monogram: "BD",
          emblem: "star",
        },
        promptText: "Tap the starlight crest for Alina's birthday dinner",
      },
      content: {
        hostLine: "An Intimate Candlelit Birthday Supper Honoring",
        headline: "Alina Under Starlight",
        subtitle: "Four courses, acoustic piano & wishes under midnight skies",
        storyQuote:
          "Good friends, timeless music, and a warm table make every year golden.",
        heroImageUrl: null,
        couple: {
          layout: "featured-solo",
          frameShape: "arch",
          crestText: "✦",
          brideName: "Alina Tariq",
          brideRole: "Birthday Celebrant",
          brideImageUrl: null,
          groomName: "",
          groomRole: "",
          groomImageUrl: null,
        },
        dressCode: "Midnight Cocktail / Navy, Pearl & Champagne",
        itinerary: [
          {
            id: "it-1",
            title: "Terrace Aperitif Hour",
            time: "7:30 PM",
            description: "Welcome mocktails & ambient strings",
          },
          {
            id: "it-2",
            title: "Candlelight Birthday Supper",
            time: "8:30 PM",
            description: "Chef's tasting menu & toasts",
          },
        ],
        gallery: [],
        rsvpHeadline: "Join The Table",
        rsvpDeadline: "Please confirm attendance",
        maxGuestsPerParty: 3,
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
        trackId: "ambient-piano",
        trackTitle: "Velvet Nocturne",
        customUrl: null,
        volume: 0.55,
      },
    },
  },
  {
    id: "11111111-1111-4111-8111-111111111104",
    title: "Noir & Champagne (Black-Tie Gala)",
    category: "gala",
    thumbnail_url: "/art/gala-noir.jpg",
    is_active: true,
    created_at: "2026-02-09T00:00:00.000Z",
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
        cardArt: {
          motif: "celestial-stars",
          borderStyle: "editorial-double",
          backdropPreset: "gala-noir",
          backdropUrl: null,
          backdropOpacity: 0.55,
          heroFrame: "arch",
        },
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
        couple: {
          layout: "editorial-split",
          frameShape: "oval",
          crestText: "◆",
          brideName: "Dr. Tariq Mahmood",
          brideRole: "Keynote Patron · Creative Arts",
          brideImageUrl: null,
          groomName: "Zara Mansoor",
          groomRole: "Evening Gala Chair",
          groomImageUrl: null,
        },
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
        volume: 0.5,
      },
    },
  },
  {
    id: "11111111-1111-4111-8111-111111111112",
    title: "Atelier Crest (Executive Summit)",
    category: "corporate",
    thumbnail_url: "/art/abstract-silk.jpg",
    is_active: true,
    created_at: "2026-02-10T00:00:00.000Z",
    default_config: {
      theme: {
        presetId: "executive-summit",
        palette: {
          background: "#F7F5F0",
          surface: "#FFFFFF",
          primary: "#1C2430",
          secondary: "#4D5E78",
          accent: "#B5825E",
          text: "#181C23",
          mutedText: "#636B78",
        },
        typography: {
          displayFont: "syne",
          bodyFont: "jakarta",
          scriptFont: "cormorant",
        },
        paperTexture: "clean",
        cardArt: {
          motif: "abstract-organic",
          borderStyle: "editorial-double",
          backdropPreset: "abstract-silk",
          backdropUrl: null,
          backdropOpacity: 0.44,
          heroFrame: "rounded",
        },
      },
      envelope: {
        style: "minimal-folio",
        envelopeColor: "#1C2430",
        linerColor: "#DFC3AC",
        waxSeal: {
          enabled: true,
          color: "#B5825E",
          monogram: "HDS",
          emblem: "monogram",
        },
        promptText: "Unseal your executive delegate folio",
      },
      content: {
        hostLine: "Leadership Roundtable & Founders Dinner",
        headline: "Horizon Summit",
        subtitle:
          "Founders keynote, private investor dinner & networking salon",
        storyQuote:
          "Gathering architects of technology, craft, and resilient design.",
        heroImageUrl: null,
        couple: {
          layout: "editorial-split",
          frameShape: "rounded",
          crestText: "×",
          brideName: "Nadia Qureshi",
          brideRole: "Keynote Speaker · Managing Partner",
          brideImageUrl: null,
          groomName: "Omar Aziz",
          groomRole: "Summit Program Lead",
          groomImageUrl: null,
        },
        dressCode: "Executive Business Formal",
        itinerary: [
          {
            id: "it-1",
            title: "Executive Arrival & Coffee Bar",
            time: "5:30 PM",
            description: "Badge check-in & architectural exhibition",
          },
          {
            id: "it-2",
            title: "Opening Keynote Conversation",
            time: "6:30 PM",
            description: "Fireside dialogue in the Main Pavilion",
          },
          {
            id: "it-3",
            title: "Private Tasting Dinner",
            time: "8:00 PM",
            description: "Curated table seating & partner toasts",
          },
        ],
        gallery: [],
        rsvpHeadline: "Register Your Seat",
        rsvpDeadline: "Please confirm delegate attendance",
        maxGuestsPerParty: 2,
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
        particles: "none",
        lottieAccent: "sparkle-ring",
      },
      audio: {
        enabled: true,
        trackId: "ambient-piano",
        trackTitle: "Velvet Nocturne",
        customUrl: null,
        volume: 0.45,
      },
    },
  },
  {
    id: "11111111-1111-4111-8111-111111111113",
    title: "Little Cloud Meadow (Baby Shower)",
    category: "baby-shower",
    thumbnail_url: "/art/baby-shower.jpg",
    is_active: true,
    created_at: "2026-02-11T00:00:00.000Z",
    default_config: {
      theme: {
        presetId: "baby-shower-cloud",
        palette: {
          background: "#F8FAF8",
          surface: "#FFFFFF",
          primary: "#3D6257",
          secondary: "#7FA393",
          accent: "#D3A468",
          text: "#22312C",
          mutedText: "#667871",
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
          backdropPreset: "baby-shower",
          backdropUrl: null,
          backdropOpacity: 0.54,
          heroFrame: "oval",
        },
      },
      envelope: {
        style: "arch-pocket",
        envelopeColor: "#4B7065",
        linerColor: "#E4D3B6",
        waxSeal: {
          enabled: true,
          color: "#D3A468",
          monogram: "B",
          emblem: "floral",
        },
        promptText: "Tap the meadow seal to welcome our little miracle",
      },
      content: {
        hostLine: "With Love & Joy, Join Us For A Baby Shower Honoring",
        headline: "Oh Baby! Celebrating Sara",
        subtitle:
          "Garden high-tea, sweet wishes & a warm welcome before baby arrives",
        storyQuote:
          "Ten tiny fingers and a lifetime of love — come shower Sara with warmth and blessings.",
        heroImageUrl: null,
        couple: {
          layout: "featured-solo",
          frameShape: "oval",
          crestText: "♥",
          brideName: "Sara Bilal",
          brideRole: "Mom-to-Be · Expecting Spring 2027",
          brideImageUrl: null,
          groomName: "",
          groomRole: "",
          groomImageUrl: null,
        },
        dressCode: "Pastel Botanicals / Sage, Chamomile & Soft Blue",
        itinerary: [
          {
            id: "it-1",
            title: "Garden Tea & Pastry Bar",
            time: "3:00 PM",
            description: "Welcome mocktails & keepsake polaroids",
          },
          {
            id: "it-2",
            title: "Shower Games & Story Wishes",
            time: "4:15 PM",
            description: "Handwritten advice cards for baby's library",
          },
          {
            id: "it-3",
            title: "Afternoon Brunch Table",
            time: "5:00 PM",
            description: "Savory bites & floral celebration cake",
          },
        ],
        gallery: [],
        rsvpHeadline: "Share In The Joy",
        rsvpDeadline: "Please confirm so we prepare your keepsake seat",
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
        preset: "cinematic-silk",
        particles: "petals",
        lottieAccent: "floral-flourish",
      },
      audio: {
        enabled: true,
        trackId: "celestial-harp",
        trackTitle: "Moonlight Harp",
        customUrl: null,
        volume: 0.5,
      },
    },
  },
  {
    id: "11111111-1111-4111-8111-111111111114",
    title: "Silver Jubilee (25th Anniversary)",
    category: "anniversary",
    thumbnail_url: "/art/peony-arch.jpg",
    is_active: true,
    created_at: "2026-02-12T00:00:00.000Z",
    default_config: {
      theme: {
        presetId: "silver-anniversary",
        palette: {
          background: "#FDF8F5",
          surface: "#FFFFFF",
          primary: "#5B293C",
          secondary: "#8C6270",
          accent: "#B8955A",
          text: "#251A1E",
          mutedText: "#725E65",
        },
        typography: {
          displayFont: "playfair",
          bodyFont: "cormorant",
          scriptFont: "great-vibes",
        },
        paperTexture: "linen",
        cardArt: {
          motif: "floral-bouquet",
          borderStyle: "gold-filigree",
          backdropPreset: "peony-arch",
          backdropUrl: null,
          backdropOpacity: 0.45,
          heroFrame: "arch",
        },
      },
      envelope: {
        style: "royal-flap",
        envelopeColor: "#5B293C",
        linerColor: "#DFC394",
        waxSeal: {
          enabled: true,
          color: "#B8955A",
          monogram: "25",
          emblem: "floral",
        },
        promptText: "Unseal 25 years of love, laughter & family memories",
      },
      content: {
        hostLine:
          "Hosted With Love By Their Children To Celebrate 25 Years Of",
        headline: "Samina & Waqar",
        subtitle: "Silver Jubilee Vow Renewal & Candlelit Family Dinner",
        storyQuote:
          "Twenty-five radiant years side by side — honoring every milestone with the people we cherish.",
        heroImageUrl: null,
        couple: {
          layout: "side-by-side",
          frameShape: "arch",
          crestText: "25",
          brideName: "Samina Waqar",
          brideRole: "25 Years of Grace",
          brideImageUrl: null,
          groomName: "Waqar Ahmed",
          groomRole: "Forever & Always",
          groomImageUrl: null,
        },
        dressCode: "Classic Evening / Plum, Silver & Champagne",
        itinerary: [
          {
            id: "it-1",
            title: "Family Archive & Aperitifs",
            time: "6:30 PM",
            description: "25-year memory gallery walk",
          },
          {
            id: "it-2",
            title: "Silver Jubilee Tribute",
            time: "7:30 PM",
            description: "Toast & renewal of blessings",
          },
          {
            id: "it-3",
            title: "Candlelight Supper",
            time: "8:30 PM",
            description: "Three-course celebration feast",
          },
        ],
        gallery: [],
        rsvpHeadline: "Celebrate With Us",
        rsvpDeadline: "Kindly confirm below",
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
        volume: 0.55,
      },
    },
  },
  {
    id: "11111111-1111-4111-8111-111111111115",
    title: "Honor Laurel (Graduation Celebration)",
    category: "graduation",
    thumbnail_url: "/art/graduation-laurel.jpg",
    is_active: true,
    created_at: "2026-02-13T00:00:00.000Z",
    default_config: {
      theme: {
        presetId: "graduation-laurel",
        palette: {
          background: "#FAF6EE",
          surface: "#FFFFFF",
          primary: "#1E3A5F",
          secondary: "#4D698E",
          accent: "#C5963E",
          text: "#182230",
          mutedText: "#637082",
        },
        typography: {
          displayFont: "cinzel",
          bodyFont: "jakarta",
          scriptFont: "cormorant",
        },
        paperTexture: "linen",
        cardArt: {
          motif: "floral-bouquet",
          borderStyle: "editorial-double",
          backdropPreset: "graduation-laurel",
          backdropUrl: null,
          backdropOpacity: 0.54,
          heroFrame: "oval",
        },
      },
      envelope: {
        style: "arch-pocket",
        envelopeColor: "#1E3A5F",
        linerColor: "#DFBF7E",
        waxSeal: {
          enabled: true,
          color: "#C5963E",
          monogram: "27",
          emblem: "crown",
        },
        promptText: "Unseal to celebrate the Class of 2027 milestone",
      },
      content: {
        hostLine: "Proudly Inviting You To Celebrate The Graduation Of",
        headline: "Ayaan Karim",
        subtitle: "B.S. Architecture Honours · Reception Dinner & Toasts",
        storyQuote:
          "Years of curiosity, late studio nights, and unwavering support — come raise a toast to what comes next.",
        heroImageUrl: null,
        couple: {
          layout: "featured-solo",
          frameShape: "oval",
          crestText: "27",
          brideName: "Ayaan Karim",
          brideRole: "Class of 2027 · Magna Cum Laude",
          brideImageUrl: null,
          groomName: "",
          groomRole: "",
          groomImageUrl: null,
        },
        dressCode: "Smart Conservatory / Navy, Ivory & Olive",
        itinerary: [
          {
            id: "it-1",
            title: "Garden Reception & Photos",
            time: "5:30 PM",
            description: "Welcome refreshments & thesis portfolio display",
          },
          {
            id: "it-2",
            title: "Toast To The Graduate",
            time: "6:45 PM",
            description: "Family reflections & celebratory cake",
          },
          {
            id: "it-3",
            title: "Dinner On The Lawn",
            time: "7:30 PM",
            description: "Evening feast under olive strings",
          },
        ],
        gallery: [],
        rsvpHeadline: "Join The Celebration",
        rsvpDeadline: "Please confirm attendance",
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
        preset: "editorial-fade",
        particles: "gold-dust",
        lottieAccent: "sparkle-ring",
      },
      audio: {
        enabled: true,
        trackId: "festive-strings",
        trackTitle: "Golden Hour Chimes",
        customUrl: null,
        volume: 0.55,
      },
    },
  },
];

export const WEDDING_STARTER_TEMPLATES: TemplateRecord[] =
  STARTER_TEMPLATES.filter(isWeddingTemplate);

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
 * Merges live Supabase template records with curated code presets across all
 * invitation domains (Weddings, Birthdays, Galas & Corporate, Parties & Showers)
 * so new categories and upgraded art configs work immediately even before
 * optional SQL migrations are executed.
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

  // Preserve extra active custom DB templates across any invitation category
  for (const row of dbRows ?? []) {
    if (!starterById.has(row.id) && row.is_active !== false) {
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

export const DEMO_VENUE_BY_DOMAIN: Record<
  InvitationDomainId,
  { venue_name: string; venue_address: string; venue_map_url: string }
> = {
  wedding: {
    venue_name: "The Serai Courtyard & Conservatory",
    venue_address: "42 Rose Garden Avenue, Gulberg III, Lahore",
    venue_map_url:
      "https://www.google.com/maps/search/?api=1&query=31.510500,74.348700",
  },
  birthday: {
    venue_name: "The Terrace Conservatoire & Rooftop",
    venue_address: "18 Crescent Skyline, Clifton Block 4, Karachi",
    venue_map_url:
      "https://www.google.com/maps/search/?api=1&query=24.813800,67.029900",
  },
  gala: {
    venue_name: "Grand Symphony Pavilion & Atrium",
    venue_address: "100 Constitution Avenue, Diplomatic Enclave, Islamabad",
    venue_map_url:
      "https://www.google.com/maps/search/?api=1&query=33.720000,73.060000",
  },
  party: {
    venue_name: "Magnolia Botanical Conservatory",
    venue_address: "74 Willow Park Lane, Model Town, Lahore",
    venue_map_url:
      "https://www.google.com/maps/search/?api=1&query=31.483900,74.325700",
  },
};

export function resolveDemoEventForPreset(presetSlug?: string): EventRecord {
  if (!presetSlug) return DEMO_EVENT;
  const matched = STARTER_TEMPLATES.find(
    (t) =>
      t.default_config.theme.presetId === presetSlug || t.id === presetSlug
  );
  if (!matched) return DEMO_EVENT;

  const domain = getDomainForCategory(matched.category);
  const venue = DEMO_VENUE_BY_DOMAIN[domain];
  const mergedDesign = mergeDesignData(matched.default_config);

  return {
    ...DEMO_EVENT,
    template_id: matched.id,
    event_type: matched.category,
    title: mergedDesign.content.headline,
    venue_name: venue.venue_name,
    venue_address: venue.venue_address,
    venue_map_url: venue.venue_map_url,
    audio_url:
      mergedDesign.audio.trackId !== "custom"
        ? `/audio/${mergedDesign.audio.trackId}.wav`
        : DEMO_EVENT.audio_url,
    design_data: mergedDesign,
  };
}
