import { EventDesignData } from "@/types/invitation";

export function getDisplayFontFamily(
  font: EventDesignData["theme"]["typography"]["displayFont"]
): string {
  switch (font) {
    case "cinzel":
      return "var(--font-cinzel), Georgia, serif";
    case "cormorant":
      return "var(--font-cormorant), Georgia, serif";
    case "playfair":
      return "var(--font-playfair), Georgia, serif";
    case "syne":
      return "var(--font-syne), system-ui, sans-serif";
  }
}

export function getBodyFontFamily(
  font: EventDesignData["theme"]["typography"]["bodyFont"]
): string {
  switch (font) {
    case "jakarta":
      return "var(--font-jakarta), system-ui, sans-serif";
    case "dm-sans":
      return "var(--font-dm-sans), system-ui, sans-serif";
    case "cormorant":
      return "var(--font-cormorant), Georgia, serif";
  }
}

export function getScriptFontFamily(
  font: EventDesignData["theme"]["typography"]["scriptFont"]
): string {
  switch (font) {
    case "great-vibes":
      return "var(--font-great-vibes), cursive";
    case "cormorant":
      return "var(--font-cormorant), Georgia, serif";
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

