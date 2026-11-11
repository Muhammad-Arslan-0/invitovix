import { describe, expect, it } from "vitest";
import { eventDesignDataSchema, rsvpSubmissionSchema } from "@/types/invitation";
import {
  DEFAULT_DESIGN_DATA,
  STARTER_TEMPLATES,
  isWeddingTemplate,
  mergeDesignData,
  mergeTemplateCatalog,
} from "@/lib/templates/presets";

describe("Invitation schemas & template merging", () => {
  it("validates every starter template default_config and guarantees wedding-only categories", () => {
    expect(STARTER_TEMPLATES.length).toBeGreaterThanOrEqual(7);
    for (const tpl of STARTER_TEMPLATES) {
      const result = eventDesignDataSchema.safeParse(tpl.default_config);
      expect(result.success).toBe(true);
      expect(isWeddingTemplate(tpl)).toBe(true);
      expect(["birthday", "gala"]).not.toContain(tpl.category.toLowerCase());
    }
  });

  it("filters retired birthday and gala Supabase rows out of the live catalog", () => {
    const merged = mergeTemplateCatalog(
      [
        {
          id: "11111111-1111-4111-8111-111111111103",
          title: "Confetti Atelier (Editorial Birthday)",
          category: "birthday",
          thumbnail_url: null,
          is_active: true,
          created_at: "2026-01-01T00:00:00.000Z",
          default_config: STARTER_TEMPLATES[0].default_config,
        },
        {
          id: "11111111-1111-4111-8111-111111111104",
          title: "Noir & Champagne (Black-Tie Gala)",
          category: "gala",
          thumbnail_url: null,
          is_active: true,
          created_at: "2026-01-01T00:00:00.000Z",
          default_config: STARTER_TEMPLATES[0].default_config,
        },
        {
          id: "22222222-2222-4222-8222-222222222201",
          title: "Legacy Birthday Custom Row",
          category: "birthday",
          thumbnail_url: null,
          is_active: true,
          created_at: "2026-01-01T00:00:00.000Z",
          default_config: STARTER_TEMPLATES[0].default_config,
        },
        {
          id: "22222222-2222-4222-8222-222222222202",
          title: "Custom Nikah Rose",
          category: "nikah",
          thumbnail_url: null,
          is_active: true,
          created_at: "2026-01-01T00:00:00.000Z",
          default_config: STARTER_TEMPLATES[0].default_config,
        },
      ],
      STARTER_TEMPLATES
    );

    expect(merged.some((t) => t.category === "birthday")).toBe(false);
    expect(merged.some((t) => t.category === "gala")).toBe(false);
    expect(merged.some((t) => t.title === "Custom Nikah Rose")).toBe(true);
  });

  it("merges partial JSONB config with safe defaults", () => {
    const merged = mergeDesignData({
      theme: {
        presetId: "custom",
        palette: { primary: "#223344" },
      },
      content: {
        headline: "Sara & Omar",
      },
    });

    expect(merged.theme.palette.primary).toBe("#223344");
    expect(merged.theme.palette.background).toBe(
      DEFAULT_DESIGN_DATA.theme.palette.background
    );
    expect(merged.content.headline).toBe("Sara & Omar");
    expect(merged.envelope.waxSeal.enabled).toBe(true);
  });

  it("validates RSVP payloads and rejects empty names", () => {
    const valid = rsvpSubmissionSchema.safeParse({
      guest_name: "Ali Raza",
      email: "ali@example.com",
      phone: "",
      attending_status: "attending",
      guests_count: 3,
      notes: "Vegetarian option please",
    });
    expect(valid.success).toBe(true);

    const invalid = rsvpSubmissionSchema.safeParse({
      guest_name: "A",
      attending_status: "attending",
      guests_count: 1,
    });
    expect(invalid.success).toBe(false);
  });
});

