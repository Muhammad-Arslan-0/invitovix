import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { VenueLocationPicker } from "@/components/maps/VenueLocationPicker";

vi.mock("next/dynamic", () => ({
  default: () => {
    return function MockMapCanvas(props: {
      onPick?: (lat: number, lng: number) => void;
    }) {
      return (
        <div data-testid="mock-leaflet-map">
          <button
            type="button"
            onClick={() => props.onPick?.(31.515, 74.351)}
          >
            Simulate Map Click
          </button>
        </div>
      );
    };
  },
}));

describe("VenueLocationPicker", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders SSR cleanly without touching window.L", () => {
    const html = renderToString(
      <VenueLocationPicker
        address="42 Rose Garden Avenue, Lahore"
        mapUrl=""
        venueName="Royal Palm"
        onChangeAddress={vi.fn()}
        onChangeMapUrl={vi.fn()}
        onLocationPicked={vi.fn()}
      />
    );
    expect(html).toContain("Find on Google Maps");
  });

  it("auto-fills place name, address and coordinates when pasting a Google Maps link or clicking the map", async () => {
    const fetchMock = vi.fn().mockImplementation((input: string) => {
      if (input.includes("q=")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            results: [
              {
                id: "101",
                lat: 31.5546,
                lng: 74.3312,
                placeName: "Pearl Continental Hotel",
                address: "Shahrah-e-Quaid-e-Azam, Mall Road, Lahore, Pakistan",
              },
            ],
          }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({
          result: {
            id: "202",
            lat: 31.515,
            lng: 74.351,
            placeName: "Gulberg Lawn",
            address: "55 Canal Bank Road, Gulberg III, Lahore, Pakistan",
          },
        }),
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const onChangeAddress = vi.fn();
    const onChangeMapUrl = vi.fn();
    const onLocationPicked = vi.fn();
    const onApplySuggestedName = vi.fn();

    render(
      <VenueLocationPicker
        address=""
        mapUrl=""
        venueName=""
        onChangeAddress={onChangeAddress}
        onChangeMapUrl={onChangeMapUrl}
        onLocationPicked={onLocationPicked}
        onApplySuggestedName={onApplySuggestedName}
      />
    );

    const linkInput = screen.getByPlaceholderText(
      /Paste Google Maps link/i
    );
    fireEvent.change(linkInput, {
      target: { value: "https://maps.app.goo.gl/sample123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^Set Pin$/i }));

    await waitFor(() => {
      expect(onApplySuggestedName).toHaveBeenCalledWith("Pearl Continental Hotel");
    });

    expect(onChangeAddress).toHaveBeenCalledWith(
      "Shahrah-e-Quaid-e-Azam, Mall Road, Lahore, Pakistan"
    );
    expect(onLocationPicked).toHaveBeenCalledWith({
      address: "Shahrah-e-Quaid-e-Azam, Mall Road, Lahore, Pakistan",
      mapUrl: "https://maps.app.goo.gl/sample123",
      lat: 31.5546,
      lng: 74.3312,
      suggestedPlaceName: "Pearl Continental Hotel",
    });

    // Clicking on map triggers reverse geocoding and updates location
    fireEvent.click(screen.getByRole("button", { name: /Simulate Map Click/i }));

    await waitFor(() => {
      expect(onLocationPicked).toHaveBeenCalledWith({
        address: "55 Canal Bank Road, Gulberg III, Lahore, Pakistan",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=31.515000,74.351000",
        lat: 31.515,
        lng: 74.351,
        suggestedPlaceName: "Gulberg Lawn",
      });
    });
  });

  it("shows empty venue notice when no location is provided and allows clearing location cleanly", () => {
    const onChangeAddress = vi.fn();
    const onChangeMapUrl = vi.fn();
    const onLocationPicked = vi.fn();

    const { rerender } = render(
      <VenueLocationPicker
        address=""
        mapUrl=""
        venueName=""
        onChangeAddress={onChangeAddress}
        onChangeMapUrl={onChangeMapUrl}
        onLocationPicked={onLocationPicked}
      />
    );

    // Empty state message is rendered
    expect(
      screen.getByText(/No venue location set yet/i)
    ).toBeTruthy();
    expect(
      screen.getByText(/Click map to mark exact location/i)
    ).toBeTruthy();

    // Now render with an existing location
    rerender(
      <VenueLocationPicker
        address="Grand Ballroom"
        mapUrl="https://maps.google.com/?q=31.5,74.3"
        venueName="Grand Ballroom"
        onChangeAddress={onChangeAddress}
        onChangeMapUrl={onChangeMapUrl}
        onLocationPicked={onLocationPicked}
      />
    );

    expect(screen.getByText(/Linked with Google Maps/i)).toBeTruthy();
    const removeBtn = screen.getByRole("button", { name: /^Remove$/i });
    fireEvent.click(removeBtn);

    expect(onChangeAddress).toHaveBeenCalledWith("");
    expect(onChangeMapUrl).toHaveBeenCalledWith("");
    expect(onLocationPicked).toHaveBeenCalledWith({
      address: "",
      mapUrl: "",
      lat: 0,
      lng: 0,
    });
  });
});
