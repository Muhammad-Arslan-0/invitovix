import { NextRequest, NextResponse } from "next/server";
import {
  GeocodedPlace,
  formatCoordinatesLabel,
  formatReadableAddress,
  isValidCoordinates,
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

async function searchPlaces(query: string): Promise<GeocodedPlace[]> {
  const cacheKey = `q:${query.toLowerCase()}`;
  const cached = getCache<GeocodedPlace[]>(cacheKey);
  if (cached) return cached;

  try {
    const nomUrl = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=6&accept-language=en&q=${encodeURIComponent(
      query
    )}`;
    const res = await fetch(nomUrl, {
      headers: REQUEST_HEADERS,
      signal: AbortSignal.timeout(4500),
    });
    if (res.ok) {
      const items = (await res.json()) as NominatimItem[];
      const normalized = items
        .map((item, i) => normalizeNominatim(item, i))
        .filter((x): x is GeocodedPlace => x !== null);
      if (normalized.length > 0) {
        setCache(cacheKey, normalized);
        return normalized;
      }
    }
  } catch {
    // Fallback to Photon below
  }

  try {
    const photonUrl = `https://photon.komoot.io/api/?limit=6&lang=en&q=${encodeURIComponent(
      query
    )}`;
    const res = await fetch(photonUrl, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(4500),
    });
    if (res.ok) {
      const json = (await res.json()) as { features?: PhotonFeature[] };
      const normalized = (json.features ?? [])
        .map((f, i) => normalizePhoton(f, i))
        .filter((x): x is GeocodedPlace => x !== null);
      setCache(cacheKey, normalized);
      return normalized;
    }
  } catch {
    // Both upstream services unreachable
  }

  return [];
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

