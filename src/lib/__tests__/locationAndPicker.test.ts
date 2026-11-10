import { describe, expect, it } from "vitest";
import {
  buildGoogleMapsCoordsUrl,
  buildOsmLinkUrl,
  formatReadableAddress,
  parseCoordinatesFromMapUrl,
} from "@/lib/utils/location";

describe("Location & Coordinate Utilities", () => {
  it("extracts coordinates from Google Maps, OpenStreetMap, and plain lat/lng formats", () => {
    expect(
      parseCoordinatesFromMapUrl(
        "https://www.google.com/maps/search/?api=1&query=31.510500,74.348700"
      )
    ).toEqual({ lat: 31.5105, lng: 74.3487 });

    expect(
      parseCoordinatesFromMapUrl(
        "https://www.google.com/maps/place/Royal+Palm/@31.520412,74.358741,17z"
      )
    ).toEqual({ lat: 31.520412, lng: 74.358741 });

    expect(
      parseCoordinatesFromMapUrl(
        "https://www.openstreetmap.org/?mlat=24.8607&mlon=67.0011#map=16/24.8607/67.0011"
      )
    ).toEqual({ lat: 24.8607, lng: 67.0011 });

    expect(parseCoordinatesFromMapUrl("33.6844, 73.0479")).toEqual({
      lat: 33.6844,
      lng: 73.0479,
    });
  });

  it("rejects out-of-range coordinates or plain search text URLs", () => {
    expect(
      parseCoordinatesFromMapUrl("https://www.google.com/maps/search/?api=1&query=Gulberg+Lahore")
    ).toBeNull();
    expect(parseCoordinatesFromMapUrl("99.123, 220.456")).toBeNull();
    expect(parseCoordinatesFromMapUrl(null)).toBeNull();
  });

  it("builds valid Google Maps and OpenStreetMap pin URLs", () => {
    expect(buildGoogleMapsCoordsUrl(31.5105, 74.3487)).toBe(
      "https://www.google.com/maps/search/?api=1&query=31.510500,74.348700"
    );
    expect(buildOsmLinkUrl(31.5105, 74.3487)).toBe(
      "https://www.openstreetmap.org/?mlat=31.510500&mlon=74.348700#map=16/31.510500/74.348700"
    );
  });

  it("formats readable deduplicated street addresses", () => {
    expect(
      formatReadableAddress({
        house_number: "42",
        road: "Rose Garden Avenue",
        suburb: "Gulberg III",
        city: "Lahore",
        state: "Punjab",
        country: "Pakistan",
      })
    ).toBe("42 Rose Garden Avenue, Gulberg III, Lahore, Punjab, Pakistan");

    expect(
      formatReadableAddress({
        road: "Main Boulevard",
        city: "Islamabad",
        state: "Islamabad",
        country: "Pakistan",
      })
    ).toBe("Main Boulevard, Islamabad, Pakistan");
  });
});

