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
    expect(html).toContain("Event Location / Address");
  });

  it("auto-fills address and coordinates when searching or clicking map while keeping venue name manual", async () => {
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
            placeName: "",
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
        venueName="My Custom Lawn"
        onChangeAddress={onChangeAddress}
        onChangeMapUrl={onChangeMapUrl}
        onLocationPicked={onLocationPicked}
        onApplySuggestedName={onApplySuggestedName}
      />
    );

    const searchInput = screen.getByPlaceholderText(
      /Search place, hotel, street, or city/i
    );
    fireEvent.change(searchInput, { target: { value: "Pearl Continental" } });
    fireEvent.click(screen.getByRole("button", { name: /^Find$/i }));

    await waitFor(() => {
      expect(screen.getByText("Pearl Continental Hotel")).toBeTruthy();
    });

    fireEvent.click(screen.getByText("Pearl Continental Hotel"));

    expect(onLocationPicked).toHaveBeenCalledWith({
      address: "Shahrah-e-Quaid-e-Azam, Mall Road, Lahore, Pakistan",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=31.554600,74.331200",
      lat: 31.5546,
      lng: 74.3312,
      suggestedPlaceName: "Pearl Continental Hotel",
    });

    // Optional manual venue suggestion chip lets user opt in without forcing overwrite
    fireEvent.click(screen.getByRole("button", { name: /Use as Venue Name/i }));
    expect(onApplySuggestedName).toHaveBeenCalledWith("Pearl Continental Hotel");

    // Clicking on map triggers reverse geocoding and auto-fills address + coordinates
    fireEvent.click(screen.getByRole("button", { name: /Simulate Map Click/i }));

    await waitFor(() => {
      expect(onLocationPicked).toHaveBeenCalledWith({
        address: "55 Canal Bank Road, Gulberg III, Lahore, Pakistan",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=31.515000,74.351000",
        lat: 31.515,
        lng: 74.351,
        suggestedPlaceName: undefined,
      });
    });
  });
});

