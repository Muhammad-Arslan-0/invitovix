import { describe, expect, it } from "vitest";
import {
  blessingHeaderSchema,
  eventDesignDataSchema,
  BlessingHeaderConfig,
  BlessingHeaderPreset,
} from "@/types/invitation";
import {
  ISLAMIC_BLESSING_PRESETS,
  getBlessingPresetById,
} from "@/lib/constants/islamicBlessings";
import {
  STARTER_TEMPLATES,
  mergeDesignData,
} from "@/lib/templates/presets";

describe("Islamic Blessings & Ayat System", () => {
  it("provides full default configuration when empty object is passed", () => {
    const parsed = blessingHeaderSchema.parse({});
    expect(parsed.enabled).toBe(false);
    expect(parsed.preset).toBe("none");
    expect(parsed.arabicText).toContain("بِسْمِ");
    expect(parsed.translation).toContain("In the name of Allah");
    expect(parsed.showTranslation).toBe(true);
    expect(parsed.showOrnament).toBe(true);
    expect(parsed.style).toBe("calligraphy");
  });

  it("validates all 7 curated Islamic presets with Arabic text and English translations", () => {
    expect(ISLAMIC_BLESSING_PRESETS.length).toBeGreaterThanOrEqual(7);

    const presetIds = ISLAMIC_BLESSING_PRESETS.map((p) => p.id);
    expect(presetIds).toContain("bismillah-classic");
    expect(presetIds).toContain("ayat-ar-rum");
    expect(presetIds).toContain("ayat-pairs");
    expect(presetIds).toContain("dua-barakallah");
    expect(presetIds).toContain("dua-rabbana");
    expect(presetIds).toContain("ayat-garments");
    expect(presetIds).toContain("bismillah-compact");

    for (const preset of ISLAMIC_BLESSING_PRESETS) {
      expect(preset.name.length).toBeGreaterThan(0);
      expect(preset.arabicText.length).toBeGreaterThan(0);
      expect(preset.translation.length).toBeGreaterThan(0);
      expect(["wedding", "general", "family"]).toContain(preset.recommendedCategory);

      // Verify preset works with Zod schema
      const config: BlessingHeaderConfig = {
        enabled: true,
        preset: preset.id as BlessingHeaderPreset,
        arabicText: preset.arabicText,
        translation: preset.translation,
        reference: preset.reference,
        showTranslation: true,
        showOrnament: true,
        style: "calligraphy",
      };
      const result = blessingHeaderSchema.safeParse(config);
      expect(result.success).toBe(true);
    }
  });

  it("retrieves preset by ID correctly and handles invalid IDs", () => {
    const arRum = getBlessingPresetById("ayat-ar-rum");
    expect(arRum).toBeDefined();
    expect(arRum?.arabicText).toContain("وَمِنْ");
    expect(arRum?.reference).toBe("Surah Ar-Rum 30:21");

    const nonExistent = getBlessingPresetById("unknown-preset");
    expect(nonExistent).toBeUndefined();
  });

  it("guarantees all 23 starter templates pass eventDesignDataSchema cleanly", () => {
    for (const tpl of STARTER_TEMPLATES) {
      const result = eventDesignDataSchema.safeParse(tpl.default_config);
      expect(result.success, `Template ${tpl.title} failed schema parse`).toBe(true);
    }
  });

  it("enables Surah Ar-Rum on Noor-e-Nikah template by default", () => {
    const noor = STARTER_TEMPLATES.find(
      (t) => t.id === "11111111-1111-4111-8111-111111111101" || t.title.includes("Noor-e-Nikah")
    );
    expect(noor).toBeDefined();
    const blessing = noor?.default_config.content.blessingHeader;
    expect(blessing?.enabled).toBe(true);
    expect(blessing?.preset).toBe("ayat-ar-rum");
    expect(blessing?.arabicText).toContain("وَمِنْ");
    expect(blessing?.reference).toBe("Surah Ar-Rum 30:21");
  });

  it("merges legacy design data without blessingHeader safely into modern schema", () => {
    const legacyRaw = {
      theme: { presetId: "classic-gold" },
      content: {
        hostLine: "Together with our families",
        headline: "Adam & Eve",
      },
    };
    const merged = mergeDesignData(legacyRaw);
    expect(merged.content.blessingHeader).toBeDefined();
    expect(merged.content.blessingHeader?.enabled).toBe(false);
  });
});
