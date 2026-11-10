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
} from "@/lib/templates/presets";
import { useStudioStore } from "@/store/useStudioStore";

const pushMock = vi.fn();
const refreshMock = vi.fn();
const prefetchMock = vi.fn();

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

    render(
      <DashboardClient
        userId={DEMO_EVENT.user_id}
        userEmail="host@invitovix.test"
        userName="Amina"
        initialEvents={sampleEvents}
        templates={STARTER_TEMPLATES}
      />
    );

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
        templates={STARTER_TEMPLATES}
        userId={DEMO_EVENT.user_id}
      />
    );

    const titleInput = screen.getByLabelText("Invitation Title") as HTMLInputElement;
    expect(titleInput.value).toBe(DEMO_EVENT.title);
    expect(screen.getByText("Starter Templates")).toBeTruthy();

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

    fireEvent.click(screen.getByRole("button", { name: /dashboard/i }));
    expect(pushMock).toHaveBeenCalledWith("/dashboard");
  });

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

  it("safely normalizes nullish JSONB fields in mergeDesignData", () => {
    const normalized = mergeDesignData({
      theme: { palette: { primary: null, accent: "#C99A3B" } },
      envelope: { waxSeal: { color: null, monogram: null } },
      content: { heroImageUrl: null },
    });

    expect(normalized.theme.palette.primary).toBe("#114232");
    expect(normalized.theme.palette.accent).toBe("#C99A3B");
    expect(normalized.envelope.waxSeal.color).toBe("#B3842B");
    expect(normalized.envelope.waxSeal.monogram).toBe("A&Z");
  });
});
