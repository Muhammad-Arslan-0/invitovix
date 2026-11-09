import { describe, expect, it } from "vitest";
import { useStudioStore } from "@/store/useStudioStore";
import { DEMO_EVENT, STARTER_TEMPLATES } from "@/lib/templates/presets";

describe("useStudioStore", () => {
  it("hydrates event metadata and tracks dirty state on edits", () => {
    const store = useStudioStore.getState();
    store.hydrateEvent(DEMO_EVENT);

    expect(useStudioStore.getState().isDirty).toBe(false);
    expect(useStudioStore.getState().eventMeta.slug).toBe("demo");

    store.updateContent({ headline: "Updated Couple Headline" });
    expect(useStudioStore.getState().isDirty).toBe(true);
    expect(useStudioStore.getState().designData.content.headline).toBe(
      "Updated Couple Headline"
    );

    store.updateWaxSeal({ monogram: "S&O" });
    expect(useStudioStore.getState().designData.envelope.waxSeal.monogram).toBe(
      "S&O"
    );

    store.markSaved();
    expect(useStudioStore.getState().isDirty).toBe(false);
  });

  it("switches templates while preserving existing headline", () => {
    const store = useStudioStore.getState();
    store.hydrateEvent(DEMO_EVENT);
    store.updateContent({ headline: "Custom Event Title" });
    store.applyTemplate(STARTER_TEMPLATES[1]);

    const next = useStudioStore.getState();
    expect(next.designData.theme.presetId).toBe("moonlit-valima");
    expect(next.designData.content.headline).toBe("Custom Event Title");
  });
});

