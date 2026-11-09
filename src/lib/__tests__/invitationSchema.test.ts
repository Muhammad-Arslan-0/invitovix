import { describe, expect, it } from "vitest";
import { eventDesignDataSchema, rsvpSubmissionSchema } from "@/types/invitation";
import {
  DEFAULT_DESIGN_DATA,
  STARTER_TEMPLATES,
  mergeDesignData,
} from "@/lib/templates/presets";

describe("Invitation schemas & template merging", () => {
  it("validates every starter template default_config cleanly", () => {
    for (const tpl of STARTER_TEMPLATES) {
      const result = eventDesignDataSchema.safeParse(tpl.default_config);
      expect(result.success).toBe(true);
    }
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

