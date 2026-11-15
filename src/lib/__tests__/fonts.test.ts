import { describe, expect, it } from "vitest";
import {
  DISPLAY_FONT_OPTIONS,
  SCRIPT_FONT_OPTIONS,
  BODY_FONT_OPTIONS,
  getDisplayFontFamily,
  getBodyFontFamily,
  getScriptFontFamily,
  getPaperTextureClass,
} from "@/lib/utils/fonts";

describe("Typography & Font System", () => {
  it("provides comprehensive curated font collections for Invitovix celebrations", () => {
    expect(DISPLAY_FONT_OPTIONS.length).toBeGreaterThanOrEqual(14);
    expect(SCRIPT_FONT_OPTIONS.length).toBeGreaterThanOrEqual(8);
    expect(BODY_FONT_OPTIONS.length).toBeGreaterThanOrEqual(9);

    // Verify all display fonts have distinct non-empty ids and labels
    const displayIds = DISPLAY_FONT_OPTIONS.map((f) => f.id);
    expect(new Set(displayIds).size).toBe(displayIds.length);
    expect(displayIds).toContain("cinzel");
    expect(displayIds).toContain("playfair");
    expect(displayIds).toContain("bodoni");
    expect(displayIds).toContain("prata");
    expect(displayIds).toContain("marcellus");
    expect(displayIds).toContain("italiana");
    expect(displayIds).toContain("cinzel-decorative");
    expect(displayIds).toContain("abril");
    expect(displayIds).toContain("syne");
    expect(displayIds).toContain("montserrat");
    expect(displayIds).toContain("tenor");
    expect(displayIds).toContain("raleway");
    expect(displayIds).toContain("oswald");

    // Verify all script fonts have distinct non-empty ids and labels
    const scriptIds = SCRIPT_FONT_OPTIONS.map((f) => f.id);
    expect(new Set(scriptIds).size).toBe(scriptIds.length);
    expect(scriptIds).toContain("great-vibes");
    expect(scriptIds).toContain("pinyon-script");
    expect(scriptIds).toContain("alex-brush");
    expect(scriptIds).toContain("parisienne");
    expect(scriptIds).toContain("allura");
    expect(scriptIds).toContain("sacramento");
    expect(scriptIds).toContain("playball");
    expect(scriptIds).toContain("cormorant");

    // Verify all body fonts have distinct non-empty ids and labels
    const bodyIds = BODY_FONT_OPTIONS.map((f) => f.id);
    expect(new Set(bodyIds).size).toBe(bodyIds.length);
    expect(bodyIds).toContain("jakarta");
    expect(bodyIds).toContain("dm-sans");
    expect(bodyIds).toContain("inter");
    expect(bodyIds).toContain("outfit");
    expect(bodyIds).toContain("cormorant");
    expect(bodyIds).toContain("lora");
    expect(bodyIds).toContain("eb-garamond");
    expect(bodyIds).toContain("montserrat");
    expect(bodyIds).toContain("spectral");
  });

  it("resolves valid CSS font family variable declarations for every display font", () => {
    for (const opt of DISPLAY_FONT_OPTIONS) {
      const family = getDisplayFontFamily(opt.id);
      expect(family).toBeTruthy();
      expect(family).toContain("var(--font-");
      expect(family).toMatch(/(serif|sans-serif)/);
    }
  });

  it("resolves valid CSS font family variable declarations for every script font", () => {
    for (const opt of SCRIPT_FONT_OPTIONS) {
      const family = getScriptFontFamily(opt.id);
      expect(family).toBeTruthy();
      expect(family).toContain("var(--font-");
      expect(family).toMatch(/(cursive|serif)/);
    }
  });

  it("resolves valid CSS font family variable declarations for every body font", () => {
    for (const opt of BODY_FONT_OPTIONS) {
      const family = getBodyFontFamily(opt.id);
      expect(family).toBeTruthy();
      expect(family).toContain("var(--font-");
      expect(family).toMatch(/(sans-serif|serif)/);
    }
  });

  it("gracefully falls back to default typography for unknown font identifiers", () => {
    // @ts-expect-error test unknown font fallback
    expect(getDisplayFontFamily("unknown-font")).toContain("var(--font-cinzel)");
    // @ts-expect-error test unknown font fallback
    expect(getBodyFontFamily("unknown-font")).toContain("var(--font-jakarta)");
    // @ts-expect-error test unknown font fallback
    expect(getScriptFontFamily("unknown-font")).toContain("var(--font-great-vibes)");
  });

  it("resolves paper texture utility classes accurately", () => {
    expect(getPaperTextureClass("linen")).toBe("texture-linen");
    expect(getPaperTextureClass("vellum")).toBe("texture-vellum");
    expect(getPaperTextureClass("silk")).toBe("texture-silk");
    expect(getPaperTextureClass("obsidian")).toBe("texture-obsidian");
    // @ts-expect-error test unknown texture fallback
    expect(getPaperTextureClass("none")).toBe("");
  });
});
