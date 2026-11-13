import { describe, expect, it } from "vitest";
import { eventDesignDataSchema, rsvpSubmissionSchema } from "@/types/invitation";
import {
  DEFAULT_DESIGN_DATA,
  STARTER_TEMPLATES,
  WEDDING_STARTER_TEMPLATES,
  getTemplatesByDomain,
  isWeddingTemplate,
  mergeDesignData,
  mergeTemplateCatalog,
  resolveDemoEventForPreset,
} from "@/lib/templates/presets";
import {
  formatCategoryBadge,
  getDomainForCategory,
  getInvitationTypeMeta,
} from "@/lib/templates/categories";

describe("Invitation schemas & multi-category template merging", () => {
  it("validates all 23 multi-category starter templates and guarantees strict domain isolation", () => {
    expect(STARTER_TEMPLATES.length).toBe(23);
    expect(WEDDING_STARTER_TEMPLATES.length).toBe(15);

    for (const tpl of STARTER_TEMPLATES) {
      const result = eventDesignDataSchema.safeParse(tpl.default_config);
      expect(result.success).toBe(true);
    }

    const weddingTemplates = getTemplatesByDomain(STARTER_TEMPLATES, "wedding");
    const birthdayTemplates = getTemplatesByDomain(STARTER_TEMPLATES, "birthday");
    const galaTemplates = getTemplatesByDomain(STARTER_TEMPLATES, "gala");
    const partyTemplates = getTemplatesByDomain(STARTER_TEMPLATES, "party");

    expect(weddingTemplates.length).toBe(15);
    expect(weddingTemplates.every((t) => isWeddingTemplate(t))).toBe(true);
    expect(
      weddingTemplates.some((t) =>
        ["birthday", "gala", "corporate", "baby-shower", "graduation"].includes(
          t.category.toLowerCase()
        )
      )
    ).toBe(false);

    expect(birthdayTemplates.length).toBe(3);
    expect(birthdayTemplates.every((t) => t.category === "birthday")).toBe(true);

    expect(galaTemplates.length).toBe(2);
    expect(
      galaTemplates.map((t) => t.category).sort()
    ).toEqual(["corporate", "gala"]);

    expect(partyTemplates.length).toBe(3);
    expect(
      partyTemplates.map((t) => t.category).sort()
    ).toEqual(["anniversary", "baby-shower", "graduation"]);
  });

  it("merges Supabase rows across all invitation categories cleanly", () => {
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
          id: "22222222-2222-4222-8222-222222222201",
          title: "Custom Rooftop Birthday",
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
        {
          id: "22222222-2222-4222-8222-222222222203",
          title: "Custom Executive Gala",
          category: "gala",
          thumbnail_url: null,
          is_active: true,
          created_at: "2026-01-01T00:00:00.000Z",
          default_config: STARTER_TEMPLATES[0].default_config,
        },
      ],
      STARTER_TEMPLATES
    );

    expect(merged.some((t) => t.title === "Custom Rooftop Birthday")).toBe(true);
    expect(merged.some((t) => t.title === "Custom Nikah Rose")).toBe(true);
    expect(merged.some((t) => t.title === "Custom Executive Gala")).toBe(true);
    expect(getTemplatesByDomain(merged, "wedding").some((t) => t.category === "birthday")).toBe(false);
    expect(getTemplatesByDomain(merged, "birthday").some((t) => t.title === "Custom Nikah Rose")).toBe(false);
  });

  it("resolves category metadata and /e/demo preset records accurately", () => {
    expect(getDomainForCategory("mehndi")).toBe("wedding");
    expect(getDomainForCategory("birthday")).toBe("birthday");
    expect(getDomainForCategory("corporate")).toBe("gala");
    expect(getDomainForCategory("baby-shower")).toBe("party");
    expect(formatCategoryBadge("gala")).toBe("Black-Tie Gala");
    expect(formatCategoryBadge("baby-shower")).toBe("Baby Shower");

    expect(getInvitationTypeMeta("birthday").bottomNavSpotlightLabel).toBe("Honoree");
    expect(getInvitationTypeMeta("gala").bottomNavSpotlightLabel).toBe("Hosts");
    expect(getInvitationTypeMeta("valima").bottomNavSpotlightLabel).toBe("Couple");

    const demoBirthday = resolveDemoEventForPreset("confetti-atelier");
    expect(demoBirthday.event_type).toBe("birthday");
    expect(demoBirthday.design_data.content.couple.layout).toBe("featured-solo");
    expect(demoBirthday.venue_name).toContain("Terrace");
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
