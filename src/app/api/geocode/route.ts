import { NextRequest, NextResponse } from "next/server";
import {
  GeocodedPlace,
  formatCoordinatesLabel,
  formatReadableAddress,
  isValidCoordinates,
  parseCoordinatesFromMapUrl,
  extractPlaceNameFromMapUrl,
  isGoogleMapsUrl,
} from "@/lib/utils/location";

const REQUEST_HEADERS = {
  "User-Agent": "Invitovix/1.0 (https://github.com/Muhammad-Arslan-0/invitovix)",
  Accept: "application/json",
};

const searchCache = new Map<string, { expires: number; data: unknown }>();
const CACHE_TTL_MS = 1000 * 60 * 10; // 10 minutes

function setCache(key: string, data: unknown) {
  if (searchCache.size >= 150) {
    const oldestKey = searchCache.keys().next().value;
    if (oldestKey) searchCache.delete(oldestKey);
  }
  searchCache.set(key, { expires: Date.now() + CACHE_TTL_MS, data });
}

function getCache<T>(key: string): T | null {
  const entry = searchCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    searchCache.delete(key);
    return null;
  }
  return entry.data as T;
}

interface NominatimItem {
  place_id?: number | string;
  lat?: string;
  lon?: string;
  name?: string;
  display_name?: string;
  type?: string;
  address?: Record<string, string | undefined>;
}

interface PhotonFeature {
  geometry?: { coordinates?: [number, number] };
  properties?: {
    osm_id?: number | string;
    name?: string;
    housenumber?: string;
    street?: string;
    district?: string;
    locality?: string;
    city?: string;
    county?: string;
    state?: string;
    country?: string;
    osm_value?: string;
  };
}

function normalizeNominatim(item: NominatimItem, idx = 0): GeocodedPlace | null {
  const lat = Number.parseFloat(item.lat ?? "");
  const lng = Number.parseFloat(item.lon ?? "");
  if (!isValidCoordinates(lat, lng)) return null;

  const address = formatReadableAddress(item.address, item.display_name);
  const placeName =
    (item.name && item.name.trim()) ||
    item.address?.amenity ||
    item.address?.building ||
    item.address?.leisure ||
    "";

  return {
    id: String(item.place_id ?? `nom-${idx}-${lat.toFixed(4)}`),
    lat,
    lng,
    address: address || item.display_name || formatCoordinatesLabel(lat, lng),
    placeName,
    category: item.type,
  };
}

function normalizePhoton(feature: PhotonFeature, idx = 0): GeocodedPlace | null {
  const coords = feature.geometry?.coordinates;
  if (!coords || coords.length < 2) return null;
  const [lng, lat] = coords;
  if (!isValidCoordinates(lat, lng)) return null;

  const p = feature.properties ?? {};
  const address = formatReadableAddress({
    house_number: p.housenumber,
    road: p.street,
    suburb: p.district || p.locality,
    city: p.city,
    county: p.county,
    state: p.state,
    country: p.country,
  });

  const placeName = p.name?.trim() || "";
  const combinedAddress =
    address || [placeName, p.city, p.country].filter(Boolean).join(", ");

  return {
    id: String(p.osm_id ?? `photon-${idx}-${lat.toFixed(4)}`),
    lat,
    lng,
    address: combinedAddress || formatCoordinatesLabel(lat, lng),
    placeName,
    category: p.osm_value,
  };
}

async function resolveGoogleMapsLink(input: string): Promise<GeocodedPlace | null> {
  const trimmed = input.trim();

  // 1. Direct coordinates from the URL or text if already present
  const directCoords = parseCoordinatesFromMapUrl(trimmed);
  const directName = extractPlaceNameFromMapUrl(trimmed) || "";

  if (directCoords) {
    const reversed = await reversePlace(directCoords.lat, directCoords.lng);
    return {
      id: `gmaps-${directCoords.lat.toFixed(5)}-${directCoords.lng.toFixed(5)}`,
      lat: directCoords.lat,
      lng: directCoords.lng,
      address:
        reversed.result?.address ||
        formatCoordinatesLabel(directCoords.lat, directCoords.lng),
      placeName: directName || reversed.result?.placeName || "",
      category: "venue",
    };
  }

  // 2. Short links (maps.app.goo.gl, goo.gl/maps) or full google maps URLs requiring redirect inspection
  if (
    /https?:\/\/(?:[a-z0-9.-]+\.)?(?:maps\.app\.goo\.gl|goo\.gl\/maps|google\.[a-z.]+\/maps)/i.test(
      trimmed
    )
  ) {
    try {
      let targetUrl = trimmed;

      // Fast-path: Check HTTP redirect Location header
      try {
        const redirectRes = await fetch(trimmed, {
          method: "GET",
          redirect: "manual",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
          signal: AbortSignal.timeout(3500),
        });
        const redirectHeader = redirectRes.headers.get("location");
        if (redirectHeader) {
          targetUrl = redirectHeader;
        }
      } catch {}

      // Check if coordinates were obtained directly from the redirect Location header
      let coords = parseCoordinatesFromMapUrl(targetUrl);
      let placeName = extractPlaceNameFromMapUrl(targetUrl) || "";

      if (!coords) {
        const res = await fetch(targetUrl, {
          method: "GET",
          redirect: "follow",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          },
          signal: AbortSignal.timeout(5000),
        });

        let finalUrl = res.url;
        if (finalUrl.includes("consent.google.com")) {
          try {
            const parsedConsent = new URL(finalUrl);
            const cont = parsedConsent.searchParams.get("continue");
            if (cont) finalUrl = decodeURIComponent(cont);
          } catch {}
        }

        coords = parseCoordinatesFromMapUrl(finalUrl);
        if (!placeName) {
          placeName = extractPlaceNameFromMapUrl(finalUrl) || "";
        }

        // If coordinates weren't directly in the final URL, inspect HTML content
        if (!coords) {
          const html = await res.text();

          // Check og:title for place name
          const titleMatch =
            html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i) ||
            html.match(/<title>([^<]+)<\/title>/i);
          if (titleMatch && !placeName) {
            const cleanTitle = titleMatch[1].replace(/ - Google Maps$/, "").trim();
            if (cleanTitle && !cleanTitle.toLowerCase().includes("google maps")) {
              placeName = cleanTitle;
            }
          }

          // Check center=lat,lng
          const centerMatch =
            html.match(/center=(-?\d+(?:\.\d+)?)%2C(-?\d+(?:\.\d+)?)/i) ||
            html.match(/center=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/i);
          if (centerMatch) {
            const lat = parseFloat(centerMatch[1]);
            const lng = parseFloat(centerMatch[2]);
            if (isValidCoordinates(lat, lng)) coords = { lat, lng };
          }

          // Check !3dlat!4dlng in body text
          if (!coords) {
            const bangMatch = html.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
            if (bangMatch) {
              const lat = parseFloat(bangMatch[1]);
              const lng = parseFloat(bangMatch[2]);
              if (isValidCoordinates(lat, lng)) coords = { lat, lng };
            }
          }

          // Check /@lat,lng in body text
          if (!coords) {
            const atMatch = html.match(/\/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
            if (atMatch) {
              const lat = parseFloat(atMatch[1]);
              const lng = parseFloat(atMatch[2]);
              if (isValidCoordinates(lat, lng)) coords = { lat, lng };
            }
          }
        }
      }

      if (coords) {
        const reversed = await reversePlace(coords.lat, coords.lng);
        return {
          id: `gmaps-${coords.lat.toFixed(5)}-${coords.lng.toFixed(5)}`,
          lat: coords.lat,
          lng: coords.lng,
          address:
            reversed.result?.address ||
            formatCoordinatesLabel(coords.lat, coords.lng),
          placeName: placeName || reversed.result?.placeName || "",
          category: "venue",
        };
      }
    } catch {
      // Fetch failed or timed out
    }
  }

  return null;
}

async function searchPlaces(query: string): Promise<GeocodedPlace[]> {
  const cacheKey = `q:${query.toLowerCase()}`;
  const cached = getCache<GeocodedPlace[]>(cacheKey);
  if (cached) return cached;

  // 1. Check if query is a Google Maps share link, URL, or raw coordinates
  if (isGoogleMapsUrl(query) || parseCoordinatesFromMapUrl(query)) {
    const resolvedGoogle = await resolveGoogleMapsLink(query);
    if (resolvedGoogle) {
      const payload = [resolvedGoogle];
      setCache(cacheKey, payload);
      return payload;
    }
  }

  // 3. If GOOGLE_MAPS_API_KEY is configured, use official Google Places API (highest venue accuracy)
  const googleApiKey =
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (googleApiKey) {
    try {
      const googleUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        query
      )}&key=${googleApiKey}`;
      const res = await fetch(googleUrl, { signal: AbortSignal.timeout(3500) });
      if (res.ok) {
        const data = (await res.json()) as {
          results?: Array<{
            place_id: string;
            name: string;
            formatted_address: string;
            geometry?: {
              location: { lat: number; lng: number };
            };
            types?: string[];
          }>;
        };
        const googlePlaces: GeocodedPlace[] = (data.results ?? [])
          .map((r) => ({
            id: r.place_id,
            lat: r.geometry?.location.lat ?? 0,
            lng: r.geometry?.location.lng ?? 0,
            placeName: r.name,
            address: r.formatted_address,
            category: r.types?.[0],
          }))
          .filter((p) => isValidCoordinates(p.lat, p.lng));

        if (googlePlaces.length > 0) {
          setCache(cacheKey, googlePlaces);
          return googlePlaces;
        }
      }
    } catch {
      // Fallback to OSM below
    }
  }

  // 4. Query Photon (fast POI & venue autocomplete) and Nominatim concurrently
  const photonPromise = (async (): Promise<GeocodedPlace[]> => {
    try {
      const photonUrl = `https://photon.komoot.io/api/?limit=6&lang=en&q=${encodeURIComponent(
        query
      )}`;
      const res = await fetch(photonUrl, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(3500),
      });
      if (!res.ok) return [];
      const json = (await res.json()) as { features?: PhotonFeature[] };
      return (json.features ?? [])
        .map((f, i) => normalizePhoton(f, i))
        .filter((x): x is GeocodedPlace => x !== null);
    } catch {
      return [];
    }
  })();

  const nominatimPromise = (async (): Promise<GeocodedPlace[]> => {
    try {
      const nomUrl = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=6&accept-language=en&q=${encodeURIComponent(
        query
      )}`;
      const res = await fetch(nomUrl, {
        headers: REQUEST_HEADERS,
        signal: AbortSignal.timeout(3500),
      });
      if (!res.ok) return [];
      const items = (await res.json()) as NominatimItem[];
      return items
        .map((item, i) => normalizeNominatim(item, i))
        .filter((x): x is GeocodedPlace => x !== null);
    } catch {
      return [];
    }
  })();

  const [photonResults, nomResults] = await Promise.all([
    photonPromise,
    nominatimPromise,
  ]);

  // Combine and deduplicate by coordinate grid (lat/lng ~100m)
  const combined: GeocodedPlace[] = [];
  const seen = new Set<string>();

  // Prioritize results that have explicit place names
  const allResults = [...photonResults, ...nomResults].sort((a, b) => {
    const aHasName = a.placeName ? 1 : 0;
    const bHasName = b.placeName ? 1 : 0;
    return bHasName - aHasName;
  });

  for (const place of allResults) {
    const key = `${place.lat.toFixed(3)},${place.lng.toFixed(3)}`;
    if (!seen.has(key)) {
      seen.add(key);
      combined.push(place);
    }
  }

  // 5. Smart Fallback for local businesses not yet indexed in OpenStreetMap (e.g. "Pearl Cuisine Chichawatni")
  // If no direct venue match was found, extract the city/town name from the query and locate it!
  const words = query.trim().split(/\s+/);
  if (words.length > 1) {
    const candidateCity = words[words.length - 1];
    // Check if any existing result already matches this city
    const hasCityMatch = combined.some((p) =>
      p.address.toLowerCase().includes(candidateCity.toLowerCase())
    );

    if (!hasCityMatch && candidateCity.length >= 3) {
      try {
        const cityNomUrl = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=1&accept-language=en&q=${encodeURIComponent(
          candidateCity
        )}`;
        const cityRes = await fetch(cityNomUrl, {
          headers: REQUEST_HEADERS,
          signal: AbortSignal.timeout(2500),
        });
        if (cityRes.ok) {
          const cityItems = (await cityRes.json()) as NominatimItem[];
          const cityNormalized = cityItems[0]
            ? normalizeNominatim(cityItems[0], 0)
            : null;
          if (cityNormalized) {
            // Prepend city-level match with the user's searched venue name
            const venueLabel = words.slice(0, -1).join(" ");
            const fallbackPlace: GeocodedPlace = {
              id: `fallback-${cityNormalized.lat.toFixed(4)}`,
              lat: cityNormalized.lat,
              lng: cityNormalized.lng,
              placeName: `${venueLabel} (${candidateCity})`,
              address: `${venueLabel}, ${cityNormalized.address}`,
              category: "city_area",
            };
            combined.unshift(fallbackPlace);
          }
        }
      } catch {
        // Fallback search skipped
      }
    }
  }

  if (combined.length > 0) {
    setCache(cacheKey, combined);
  }

  return combined;
}

async function reversePlace(
  lat: number,
  lng: number
): Promise<{ result: GeocodedPlace; fallback?: boolean }> {
  const key = `r:${lat.toFixed(5)},${lng.toFixed(5)}`;
  const cached = getCache<{ result: GeocodedPlace; fallback?: boolean }>(key);
  if (cached) return cached;

  try {
    const nomUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&zoom=18&accept-language=en&lat=${lat}&lon=${lng}`;
    const res = await fetch(nomUrl, {
      headers: REQUEST_HEADERS,
      signal: AbortSignal.timeout(4500),
    });
    if (res.ok) {
      const item = (await res.json()) as NominatimItem & { error?: string };
      if (!item.error) {
        const normalized = normalizeNominatim(
          { ...item, lat: String(lat), lon: String(lng) },
          0
        );
        if (normalized) {
          const payload = { result: normalized };
          setCache(key, payload);
          return payload;
        }
      }
    }
  } catch {
    // Fallback to Photon reverse below
  }

  try {
    const photonUrl = `https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}`;
    const res = await fetch(photonUrl, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(4500),
    });
    if (res.ok) {
      const json = (await res.json()) as { features?: PhotonFeature[] };
      const first = json.features?.[0];
      if (first) {
        const normalized = normalizePhoton(first, 0);
        if (normalized) {
          normalized.lat = lat;
          normalized.lng = lng;
          const payload = { result: normalized };
          setCache(key, payload);
          return payload;
        }
      }
    }
  } catch {
    // Coordinates fallback below
  }

  return {
    result: {
      id: `coords-${lat.toFixed(5)}-${lng.toFixed(5)}`,
      lat,
      lng,
      address: formatCoordinatesLabel(lat, lng),
      placeName: "",
    },
    fallback: true,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();
  const latParam = searchParams.get("lat");
  const lngParam = searchParams.get("lng");

  if (query) {
    if (query.length < 2) {
      return NextResponse.json({ results: [] });
    }
    const results = await searchPlaces(query);
    return NextResponse.json({ results });
  }

  if (latParam !== null && lngParam !== null) {
    const lat = Number.parseFloat(latParam);
    const lng = Number.parseFloat(lngParam);
    if (!isValidCoordinates(lat, lng)) {
      return NextResponse.json(
        { error: "Invalid latitude or longitude coordinates." },
        { status: 400 }
      );
    }
    const payload = await reversePlace(lat, lng);
    return NextResponse.json(payload);
  }

  return NextResponse.json(
    { error: "Provide either `q` for search or `lat` & `lng` for lookup." },
    { status: 400 }
  );
}

