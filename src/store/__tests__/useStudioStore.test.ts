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

  it("switches same-domain templates while preserving existing headline and portraits", () => {
    const store = useStudioStore.getState();
    store.hydrateEvent(DEMO_EVENT);
    store.updateContent({ headline: "Custom Event Title" });
    store.updateCouple({
      brideImageUrl: "https://example.com/bride.jpg",
      groomImageUrl: "https://example.com/groom.jpg",
    });

    const moonlit = STARTER_TEMPLATES.find(
      (t) => t.default_config.theme.presetId === "moonlit-valima"
    );
    expect(moonlit).toBeDefined();
    store.applyTemplate(moonlit!);

    const next = useStudioStore.getState();
    expect(next.designData.theme.presetId).toBe("moonlit-valima");
    expect(next.designData.theme.cardArt.motif).toBe("celestial-stars");
    expect(next.designData.content.headline).toBe("Custom Event Title");
    expect(next.designData.content.couple.brideImageUrl).toBe(
      "https://example.com/bride.jpg"
    );
    expect(next.designData.content.couple.groomImageUrl).toBe(
      "https://example.com/groom.jpg"
    );
  });

  it("switches categories cleanly across domains and updates layout defaults", () => {
    const store = useStudioStore.getState();
    store.hydrateEvent(DEMO_EVENT);
    store.updateCouple({
      brideImageUrl: "https://example.com/honoree.jpg",
    });

    // Switching from starter Wedding headline replaces starter copy with Birthday copy
    store.switchEventCategory("birthday", STARTER_TEMPLATES);
    let state = useStudioStore.getState();
    expect(state.eventMeta.event_type).toBe("birthday");
    expect(state.designData.theme.presetId).toBe("confetti-atelier");
    expect(state.designData.content.headline).toBe("Maya Turns 30");
    expect(state.designData.content.couple.layout).toBe("featured-solo");
    expect(state.designData.content.couple.brideImageUrl).toBe(
      "https://example.com/honoree.jpg"
    );

    // Custom headline is preserved across cross-domain switches
    store.updateContent({ headline: "Custom Milestone Bash" });
    store.switchEventCategory("baby-shower", STARTER_TEMPLATES);
    state = useStudioStore.getState();
    expect(state.eventMeta.event_type).toBe("baby-shower");
    expect(state.designData.theme.presetId).toBe("baby-shower-cloud");
    expect(state.designData.content.headline).toBe("Custom Milestone Bash");
    expect(state.designData.content.couple.layout).toBe("featured-solo");

    // Within same domain ("party"), switching to anniversary toggles from solo to side-by-side
    store.switchEventCategory("anniversary", STARTER_TEMPLATES);
    state = useStudioStore.getState();
    expect(state.eventMeta.event_type).toBe("anniversary");
    expect(state.designData.content.couple.layout).toBe("side-by-side");
  });
});
