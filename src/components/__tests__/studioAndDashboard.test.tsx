import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { StudioShell } from "@/components/studio/StudioShell";
import { RsvpTable } from "@/components/dashboard/RsvpTable";
import {
  DEMO_EVENT,
  STARTER_TEMPLATES,
  mergeDesignData,
  mergeTemplateCatalog,
} from "@/lib/templates/presets";
import { useStudioStore } from "@/store/useStudioStore";

const pushMock = vi.fn();
const refreshMock = vi.fn();
const prefetchMock = vi.fn();

vi.mock("@lottiefiles/dotlottie-react", () => ({
  DotLottieReact: () => null,
}));

vi.mock("next/dynamic", () => ({
  default: () => {
    return function MockDynamicMap() {
      return <div data-testid="mock-leaflet-map" />;
    };
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
    prefetch: prefetchMock,
    replace: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "/dashboard",
  useSearchParams: () => new URLSearchParams(),
}));

class MockObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe("Dashboard, StudioShell & RSVPs SSR + Client Mount", () => {
  beforeEach(() => {
    pushMock.mockClear();
    refreshMock.mockClear();
    prefetchMock.mockClear();
    globalThis.IntersectionObserver =
      MockObserver as unknown as typeof IntersectionObserver;
    globalThis.ResizeObserver =
      MockObserver as unknown as typeof ResizeObserver;
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it("renders DashboardClient cleanly on SSR and navigates to Studio on Open Studio click", () => {
    const sampleEvents = [
      {
        ...DEMO_EVENT,
        rsvp_count: 12,
        attending_guests: 28,
      },
    ];

    const ssrHtml = renderToString(
      <DashboardClient
        userId={DEMO_EVENT.user_id}
        userEmail="host@invitovix.test"
        userName="Amina"
        initialEvents={sampleEvents}
        templates={STARTER_TEMPLATES}
      />
    );
    expect(ssrHtml).toContain("Host Dashboard");
    expect(ssrHtml).toContain("Royal Nikah");

    const mixedWithLegacy = [
      ...STARTER_TEMPLATES,
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
    ];

    render(
      <DashboardClient
        userId={DEMO_EVENT.user_id}
        userEmail="host@invitovix.test"
        userName="Amina"
        initialEvents={sampleEvents}
        templates={mixedWithLegacy}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /new invitation/i }));
    expect(screen.getByText("Create Wedding Invitation")).toBeTruthy();
    expect(screen.getByText("Shahi Baraat (Crimson & Zari)")).toBeTruthy();
    expect(screen.getByText("Ivory Magnolia & Rose Engagement")).toBeTruthy();
    expect(screen.queryByText(/Confetti Atelier/i)).toBeNull();
    expect(screen.queryByText(/Black-Tie Gala/i)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /^close$/i }));

    const openStudioBtn = screen.getByRole("button", { name: /open studio/i });
    fireEvent.click(openStudioBtn);
    expect(pushMock).toHaveBeenCalledWith(`/studio/${DEMO_EVENT.id}`);
  });

  it("hydrates and renders StudioShell, inspector tabs, and live preview canvas without errors", async () => {
    useStudioStore.setState({
      eventMeta: {
        ...useStudioStore.getState().eventMeta,
        id: "",
      },
    });

    const ssrHtml = renderToString(
      <StudioShell
        initialEvent={DEMO_EVENT}
        templates={STARTER_TEMPLATES}
        userId={DEMO_EVENT.user_id}
      />
    );
    expect(ssrHtml).toContain("Opening Creator Studio");

    render(
      <StudioShell
        initialEvent={DEMO_EVENT}
        templates={[
          ...STARTER_TEMPLATES,
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
        ]}
        userId={DEMO_EVENT.user_id}
      />
    );

    const titleInput = screen.getByLabelText("Invitation Title") as HTMLInputElement;
    expect(titleInput.value).toBe(DEMO_EVENT.title);
    expect(screen.getByText("Wedding Templates")).toBeTruthy();
    expect(screen.getByText("Shahi Baraat (Crimson & Zari)")).toBeTruthy();
    expect(screen.getByText("Ivory Magnolia & Rose Engagement")).toBeTruthy();
    expect(screen.queryByText(/Confetti Atelier/i)).toBeNull();
    expect(screen.queryByText(/Black-Tie Gala/i)).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: /inside card/i }));
    await waitFor(
      () => {
        expect(useStudioStore.getState().previewStage).toBe("opened");
        expect(screen.getByText("Preview RSVP Submit")).toBeTruthy();
      },
      { timeout: 2500 }
    );

    const sealTab = screen.getByRole("tab", { name: /seal/i });
    fireEvent.mouseDown(sealTab, { button: 0, ctrlKey: false });
    fireEvent.click(sealTab);
    expect(screen.getByText("Embossed Wax Seal")).toBeTruthy();

    // Switch through Content and Audio, then back to Seal; visited panels remain cached (hidden, not destroyed)
    const contentTab = screen.getByRole("tab", { name: /content/i });
    fireEvent.mouseDown(contentTab, { button: 0, ctrlKey: false });
    fireEvent.click(contentTab);
    expect(screen.getByText("Venue Name (Manual)")).toBeTruthy();

    const audioTab = screen.getByRole("tab", { name: /audio/i });
    fireEvent.mouseDown(audioTab, { button: 0, ctrlKey: false });
    fireEvent.click(audioTab);
    expect(screen.getByText("Background Music")).toBeTruthy();

    fireEvent.mouseDown(sealTab, { button: 0, ctrlKey: false });
    fireEvent.click(sealTab);
    expect(screen.getByText("Embossed Wax Seal")).toBeTruthy();
    expect(screen.getByText("Venue Name (Manual)")).toBeTruthy();

    // Confirm all 7 bottom dock items render inside Studio Inside Card view for wedding presets
    const dock = screen.getByRole("navigation", { name: /invitation sections/i });
    const dockLabels = Array.from(dock.querySelectorAll("button")).map((b) =>
      b.textContent?.trim()
    );
    expect(dockLabels).toEqual([
      "Cover",
      "Couple",
      "Story",
      "Events",
      "Venue",
      "Gallery",
      "RSVP",
    ]);

    // Verify new Studio art & Bride/Groom controls update live store cleanly
    fireEvent.click(screen.getByRole("button", { name: /floral bouquet/i }));
    expect(useStudioStore.getState().designData.theme.cardArt.motif).toBe(
      "floral-bouquet"
    );
    expect(screen.getByText("Upload Bride Photo")).toBeTruthy();
    expect(screen.getByText("Upload Groom Photo")).toBeTruthy();

    // Toggle Tablet & Desktop device frames cleanly
    fireEvent.click(screen.getByRole("button", { name: /tablet/i }));
    fireEvent.click(screen.getByRole("button", { name: /desktop/i }));
    fireEvent.click(screen.getByRole("button", { name: /mobile/i }));
    expect(screen.getByText("Preview RSVP Submit")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /dashboard/i }));
    expect(pushMock).toHaveBeenCalledWith("/dashboard");
  }, 15000);

  it("renders RsvpTable and navigates to Studio from Edit Invite", () => {
    render(
      <RsvpTable
        eventId={DEMO_EVENT.id}
        eventTitle={DEMO_EVENT.title}
        eventSlug={DEMO_EVENT.slug}
        initialRsvps={[
          {
            id: "rsvp-1",
            event_id: DEMO_EVENT.id,
            guest_name: "Bilal Ahmed",
            email: "bilal@example.com",
            phone: null,
            attending_status: "attending",
            guests_count: 3,
            notes: "Excited to attend!",
            created_at: "2026-06-01T12:00:00.000Z",
          },
        ]}
      />
    );

    expect(screen.getByText("Bilal Ahmed")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /edit invite/i }));
    expect(pushMock).toHaveBeenCalledWith(`/studio/${DEMO_EVENT.id}`);
  });

  it("safely normalizes nullish JSONB fields in mergeDesignData and preserves legacy showCouple", () => {
    const normalized = mergeDesignData({
      theme: { palette: { primary: null, accent: "#C99A3B" } },
      envelope: { waxSeal: { color: null, monogram: null } },
      content: { heroImageUrl: null },
    });

    expect(normalized.theme.palette.primary).toBe("#114232");
    expect(normalized.theme.palette.accent).toBe("#C99A3B");
    expect(normalized.envelope.waxSeal.color).toBe("#B3842B");
    expect(normalized.envelope.waxSeal.monogram).toBe("A&Z");
    expect(normalized.theme.cardArt.motif).toBe("none");
    expect(normalized.theme.cardArt.backdropPreset).toBe("none");
    expect(normalized.sections.showCouple).toBe(false);
  });

  it("merges Supabase templates with new trendy starter templates and preserves uploaded couple portraits on template switch", () => {
    const mergedCatalog = mergeTemplateCatalog(
      [
        {
          id: STARTER_TEMPLATES[0].id,
          title: "Custom DB Title",
          category: "wedding",
          thumbnail_url: null,
          is_active: true,
          created_at: "2026-01-01T00:00:00.000Z",
          default_config: {
            ...STARTER_TEMPLATES[0].default_config,
            theme: {
              ...STARTER_TEMPLATES[0].default_config.theme,
              cardArt: undefined,
            },
          },
        },
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
      ],
      STARTER_TEMPLATES
    );

    expect(mergedCatalog.length).toBe(STARTER_TEMPLATES.length);
    expect(mergedCatalog.some((t) => t.category === "birthday")).toBe(false);
    expect(mergedCatalog.some((t) => t.category === "gala")).toBe(false);
    expect(mergedCatalog.some((t) => t.category === "baraat")).toBe(true);
    expect(mergedCatalog.some((t) => t.category === "engagement")).toBe(true);
    expect(mergedCatalog[0].title).toBe("Custom DB Title");
    expect(mergedCatalog[0].default_config.theme.cardArt.backdropPreset).toBe(
      "nikah-courtyard"
    );

    useStudioStore.getState().hydrateEvent(DEMO_EVENT);
    useStudioStore.getState().updateCouple({
      brideImageUrl: "https://example.com/custom-bride.jpg",
      groomImageUrl: "https://example.com/custom-groom.jpg",
    });
    useStudioStore.getState().applyTemplate(STARTER_TEMPLATES[1]);

    const next = useStudioStore.getState().designData;
    expect(next.theme.cardArt.backdropPreset).toBe("peony-arch");
    expect(next.content.couple.brideImageUrl).toBe(
      "https://example.com/custom-bride.jpg"
    );
    expect(next.content.couple.groomImageUrl).toBe(
      "https://example.com/custom-groom.jpg"
    );
  });
});
