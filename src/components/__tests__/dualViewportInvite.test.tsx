import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { GuestInviteShell } from "@/components/invitation/GuestInviteShell";
import { getVisibleInvitationSections } from "@/components/invitation/InvitationBottomNav";
import { DEMO_EVENT, mergeDesignData } from "@/lib/templates/presets";
import { getContrastTextColor, isLightHexColor } from "@/lib/utils/colors";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock("@lottiefiles/dotlottie-react", () => ({
  DotLottieReact: () => null,
}));

vi.mock("@/lib/audio/audioEngine", () => ({
  audioEngine: {
    resolveSource: () => "/audio/ambient-piano.wav",
    setMuted: vi.fn(),
    unlockAndPlay: vi.fn(() => true),
    toggleMute: vi.fn(() => true),
    stopAndUnload: vi.fn(),
  },
}));

class MockObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe("Dual-Viewport Invitation Architecture", () => {
  beforeEach(() => {
    globalThis.IntersectionObserver =
      MockObserver as unknown as typeof IntersectionObserver;
    globalThis.ResizeObserver =
      MockObserver as unknown as typeof ResizeObserver;
    Element.prototype.scrollIntoView = vi.fn();
    Element.prototype.scrollTo = vi.fn();

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query.includes("768") || query.includes("1200"),
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

  it("computes luminance contrast cleanly across light and dark invitation palettes", () => {
    expect(isLightHexColor("#E5C185")).toBe(true);
    expect(isLightHexColor("#D4AF37")).toBe(true);
    expect(isLightHexColor("#114232")).toBe(false);
    expect(isLightHexColor("#C94B38")).toBe(false);

    expect(getContrastTextColor("#E5C185")).toBe("#111111");
    expect(getContrastTextColor("#114232")).toBe("#FFFFFF");
  });

  it("filters bottom navigation sections dynamically based on EventDesignData flags", () => {
    const base = mergeDesignData(DEMO_EVENT.design_data);
    expect(getVisibleInvitationSections(base).map((i) => i.id)).toEqual([
      "invite-hero",
      "invite-couple",
      "invite-story",
      "invite-schedule",
      "invite-venue",
      "invite-rsvp",
    ]);

    const studioWithGallery = {
      ...base,
      sections: {
        ...base.sections,
        showCouple: false,
        showItinerary: false,
        showVenue: false,
      },
    };
    expect(
      getVisibleInvitationSections(studioWithGallery, true).map((i) => i.id)
    ).toEqual(["invite-hero", "invite-story", "invite-gallery", "invite-rsvp"]);
  });

  it("renders CoupleScene, floral/abstract art backdrop, and Bride/Groom portrait URLs cleanly", async () => {
    const customCoupleDesign = mergeDesignData({
      ...DEMO_EVENT.design_data,
      theme: {
        ...DEMO_EVENT.design_data.theme,
        cardArt: {
          motif: "floral-bouquet",
          borderStyle: "arch-frame",
          backdropPreset: "peony-arch",
          backdropUrl: null,
          backdropOpacity: 0.45,
          heroFrame: "polaroid",
        },
      },
      content: {
        ...DEMO_EVENT.design_data.content,
        couple: {
          layout: "side-by-side",
          frameShape: "polaroid",
          crestText: "&",
          brideName: "Zoya Khan",
          brideRole: "Daughter of Tariq",
          brideImageUrl: "https://example.com/bride.jpg",
          groomName: "Omar Ali",
          groomRole: "Son of Mansoor",
          groomImageUrl: "https://example.com/groom.jpg",
        },
      },
    });

    render(
      <GuestInviteShell
        eventId={DEMO_EVENT.id}
        slug={DEMO_EVENT.slug}
        title="Zoya & Omar"
        eventDate={DEMO_EVENT.event_date}
        venueName={DEMO_EVENT.venue_name}
        designData={customCoupleDesign}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /open & rsvp/i }));

    await waitFor(
      () => {
        expect(screen.getByTestId("card-art-backdrop")).toBeTruthy();
        expect(screen.getByTestId("card-ornament-frame")).toBeTruthy();
        expect(screen.getByTestId("card-header-crown")).toBeTruthy();
        expect(screen.getByTestId("couple-scene")).toBeTruthy();
        expect(screen.getByAltText("Zoya Khan").getAttribute("src")).toBe(
          "https://example.com/bride.jpg"
        );
        expect(screen.getByAltText("Omar Ali").getAttribute("src")).toBe(
          "https://example.com/groom.jpg"
        );
      },
      { timeout: 3000 }
    );
  }, 10000);

  it("renders GuestInviteShell on SSR with companion wings, centered card frame, and draft banner", () => {
    const html = renderToString(
      <GuestInviteShell
        eventId={DEMO_EVENT.id}
        slug={DEMO_EVENT.slug}
        title={DEMO_EVENT.title}
        eventDate={DEMO_EVENT.event_date}
        venueName={DEMO_EVENT.venue_name}
        venueAddress={DEMO_EVENT.venue_address}
        venueMapUrl={DEMO_EVENT.venue_map_url}
        audioUrl={DEMO_EVENT.audio_url}
        designData={DEMO_EVENT.design_data}
        isOwnerDraft
      />
    );

    expect(html).toContain("desktop-ambient-backdrop");
    expect(html).toContain("desktop-left-wing");
    expect(html).toContain("guest-card-frame");
    expect(html).toContain("desktop-right-wing");
    expect(html).toContain("Amina &amp; Zayan");
    expect(html).toContain("The Serai Courtyard &amp; Conservatory");
    expect(html).toContain("Back to Studio");
  });

  it("unseals from Right Wing Quick RSVP, opens card view, and renders bottom navigation dock", async () => {
    render(
      <GuestInviteShell
        eventId={DEMO_EVENT.id}
        slug={DEMO_EVENT.slug}
        title={DEMO_EVENT.title}
        eventDate={DEMO_EVENT.event_date}
        venueName={DEMO_EVENT.venue_name}
        venueAddress={DEMO_EVENT.venue_address}
        venueMapUrl={DEMO_EVENT.venue_map_url}
        audioUrl={DEMO_EVENT.audio_url}
        designData={DEMO_EVENT.design_data}
      />
    );

    const openRsvpBtn = screen.getByRole("button", { name: /open & rsvp/i });
    fireEvent.click(openRsvpBtn);

    await waitFor(
      () => {
        expect(
          screen.getByRole("navigation", { name: /invitation sections/i })
        ).toBeTruthy();
        expect(screen.getByRole("button", { name: /^quick rsvp$/i })).toBeTruthy();
        expect(screen.getByRole("button", { name: /mute music/i })).toBeTruthy();
        expect(screen.getByText("Confirm RSVP")).toBeTruthy();
      },
      { timeout: 3000 }
    );

    await waitFor(
      () => {
        expect(Element.prototype.scrollTo).toHaveBeenCalled();
      },
      { timeout: 1000 }
    );

    const dock = screen.getByRole("navigation", { name: /invitation sections/i });
    const rsvpTab = Array.from(dock.querySelectorAll("button")).find((btn) =>
      btn.textContent?.includes("RSVP")
    );
    const coverTab = Array.from(dock.querySelectorAll("button")).find((btn) =>
      btn.textContent?.includes("Cover")
    );
    expect(rsvpTab).toBeTruthy();
    expect(coverTab).toBeTruthy();

    fireEvent.click(rsvpTab!);
    expect(rsvpTab!.getAttribute("aria-current")).toBe("location");

    fireEvent.click(coverTab!);
    expect(coverTab!.getAttribute("aria-current")).toBe("location");
    expect(rsvpTab!.getAttribute("aria-current")).toBeNull();
  });
});
