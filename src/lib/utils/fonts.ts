import { EventDesignData } from "@/types/invitation";

export interface FontOption<T extends string = string> {
  id: T;
  name: string;
  category: "serif" | "sans" | "script" | "display";
  vibe: string;
}

export const DISPLAY_FONT_OPTIONS: FontOption<
  EventDesignData["theme"]["typography"]["displayFont"]
>[] = [
  // Royal & Editorial Serif
  { id: "cinzel", name: "Cinzel", category: "serif", vibe: "Royal Roman Imperial" },
  { id: "playfair", name: "Playfair Display", category: "serif", vibe: "Vogue High-Fashion Editorial" },
  { id: "cormorant", name: "Cormorant Garamond", category: "serif", vibe: "Fine Heritage Book Serif" },
  { id: "bodoni", name: "Bodoni Moda", category: "serif", vibe: "Italian Haute Couture Didone" },
  { id: "prata", name: "Prata", category: "serif", vibe: "Teardrop Luxury & Poise" },
  { id: "marcellus", name: "Marcellus", category: "serif", vibe: "Majestic Flared Roman" },
  { id: "italiana", name: "Italiana", category: "serif", vibe: "Italian Calligraphic Fashion" },
  { id: "cinzel-decorative", name: "Cinzel Decorative", category: "serif", vibe: "Opulent Flourished Crowns" },
  { id: "abril", name: "Abril Fatface", category: "serif", vibe: "Bold Dramatic Headline" },
  // Modern & Architectural Sans
  { id: "syne", name: "Syne", category: "sans", vibe: "Art-House Avant-Garde" },
  { id: "montserrat", name: "Montserrat", category: "sans", vibe: "Clean Architectural Luxury" },
  { id: "tenor", name: "Tenor Sans", category: "sans", vibe: "Refined Slender Fashion Sans" },
  { id: "raleway", name: "Raleway", category: "sans", vibe: "Sophisticated Modernist Sans" },
  { id: "oswald", name: "Oswald", category: "sans", vibe: "Compact Bold Impact" },
];

export const SCRIPT_FONT_OPTIONS: FontOption<
  EventDesignData["theme"]["typography"]["scriptFont"]
>[] = [
  { id: "great-vibes", name: "Great Vibes", category: "script", vibe: "Formal English Calligraphy" },
  { id: "pinyon-script", name: "Pinyon Script", category: "script", vibe: "High-Society Aristocratic Cursive" },
  { id: "alex-brush", name: "Alex Brush", category: "script", vibe: "Flowing Modern Signature" },
  { id: "parisienne", name: "Parisienne", category: "script", vibe: "Romantic Parisian Romance" },
  { id: "allura", name: "Allura", category: "script", vibe: "Smooth Stylized Flourish" },
  { id: "sacramento", name: "Sacramento", category: "script", vibe: "Delicate Retro Monoline" },
  { id: "playball", name: "Playball", category: "script", vibe: "Festive Rounded Cursive" },
  { id: "cormorant", name: "Cormorant Italic", category: "serif", vibe: "Dignified Classical Italic" },
];

export const BODY_FONT_OPTIONS: FontOption<
  EventDesignData["theme"]["typography"]["bodyFont"]
>[] = [
  { id: "jakarta", name: "Plus Jakarta Sans", category: "sans", vibe: "Crisp Contemporary Sans" },
  { id: "dm-sans", name: "DM Sans", category: "sans", vibe: "Clean Minimalist Geometric" },
  { id: "inter", name: "Inter", category: "sans", vibe: "Ultra-Legible Modern Sans" },
  { id: "outfit", name: "Outfit", category: "sans", vibe: "Warm Premium Contemporary" },
  { id: "montserrat", name: "Montserrat", category: "sans", vibe: "Architectural Clean Sans" },
  { id: "cormorant", name: "Cormorant Garamond", category: "serif", vibe: "Classic Renaissance Serif" },
  { id: "lora", name: "Lora", category: "serif", vibe: "Calligraphic Literary Serif" },
  { id: "eb-garamond", name: "EB Garamond", category: "serif", vibe: "Historical Traditional Serif" },
  { id: "spectral", name: "Spectral", category: "serif", vibe: "Crisp Elegant Screen Serif" },
];

export const URDU_NASTALEEQ_FONT_FAMILY =
  "'Jameel Noori Nastaleeq', 'Noori Nastaleeq', 'Noto Nastaliq Urdu', 'Nafees Nastaleeq', 'Urdu Typesetting', serif";

export function getDisplayFontFamily(
  font: EventDesignData["theme"]["typography"]["displayFont"],
  language?: string
): string {
  if (language === "ur") {
    return URDU_NASTALEEQ_FONT_FAMILY;
  }
  if (language === "ar") {
    return "var(--font-aref-ruqaa), var(--font-amiri), serif";
  }
  switch (font) {
    case "cinzel":
      return "var(--font-cinzel), Georgia, serif";
    case "cinzel-decorative":
      return "var(--font-cinzel-decorative), 'Cinzel', Georgia, serif";
    case "cormorant":
      return "var(--font-cormorant), Georgia, serif";
    case "playfair":
      return "var(--font-playfair), Georgia, serif";
    case "bodoni":
      return "var(--font-bodoni), Didot, Georgia, serif";
    case "prata":
      return "var(--font-prata), Georgia, serif";
    case "marcellus":
      return "var(--font-marcellus), Georgia, serif";
    case "italiana":
      return "var(--font-italiana), Georgia, serif";
    case "abril":
      return "var(--font-abril), Georgia, serif";
    case "syne":
      return "var(--font-syne), system-ui, sans-serif";
    case "montserrat":
      return "var(--font-montserrat), system-ui, sans-serif";
    case "tenor":
      return "var(--font-tenor), system-ui, sans-serif";
    case "raleway":
      return "var(--font-raleway), system-ui, sans-serif";
    case "oswald":
      return "var(--font-oswald), system-ui, sans-serif";
    default:
      return "var(--font-cinzel), Georgia, serif";
  }
}

export function getBodyFontFamily(
  font: EventDesignData["theme"]["typography"]["bodyFont"],
  language?: string
): string {
  if (language === "ur") {
    return URDU_NASTALEEQ_FONT_FAMILY;
  }
  if (language === "ar") {
    return "var(--font-amiri), system-ui, serif";
  }
  switch (font) {
    case "jakarta":
      return "var(--font-jakarta), system-ui, sans-serif";
    case "dm-sans":
      return "var(--font-dm-sans), system-ui, sans-serif";
    case "inter":
      return "var(--font-inter), system-ui, sans-serif";
    case "outfit":
      return "var(--font-outfit), system-ui, sans-serif";
    case "cormorant":
      return "var(--font-cormorant), Georgia, serif";
    case "lora":
      return "var(--font-lora), Georgia, serif";
    case "eb-garamond":
      return "var(--font-eb-garamond), Georgia, serif";
    case "montserrat":
      return "var(--font-montserrat), system-ui, sans-serif";
    case "spectral":
      return "var(--font-spectral), Georgia, serif";
    default:
      return "var(--font-jakarta), system-ui, sans-serif";
  }
}

export function getScriptFontFamily(
  font: EventDesignData["theme"]["typography"]["scriptFont"],
  language?: string
): string {
  if (language === "ur") {
    return URDU_NASTALEEQ_FONT_FAMILY;
  }
  if (language === "ar") {
    return "var(--font-amiri), serif";
  }
  switch (font) {
    case "great-vibes":
      return "var(--font-great-vibes), cursive";
    case "pinyon-script":
      return "var(--font-pinyon), cursive";
    case "alex-brush":
      return "var(--font-alex-brush), cursive";
    case "parisienne":
      return "var(--font-parisienne), cursive";
    case "allura":
      return "var(--font-allura), cursive";
    case "sacramento":
      return "var(--font-sacramento), cursive";
    case "playball":
      return "var(--font-playball), cursive";
    case "cormorant":
      return "var(--font-cormorant), Georgia, serif";
    default:
      return "var(--font-great-vibes), cursive";
  }
}

export function getPaperTextureClass(
  texture: EventDesignData["theme"]["paperTexture"]
): string {
  switch (texture) {
    case "linen":
      return "texture-linen";
    case "vellum":
      return "texture-vellum";
    case "silk":
      return "texture-silk";
    case "obsidian":
      return "texture-obsidian";
    default:
      return "";
  }
}
