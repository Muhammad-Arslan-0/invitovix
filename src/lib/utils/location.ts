export interface Coordinates {
  lat: number;
  lng: number;
}

export interface GeocodedPlace {
  id: string;
  lat: number;
  lng: number;
  address: string;
  placeName: string;
  category?: string;
}

export const DEFAULT_MAP_CENTER: Coordinates = {
  lat: 31.5105,
  lng: 74.3487,
};

export function isValidCoordinates(lat: number, lng: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

export function formatCoordinatesLabel(lat: number, lng: number): string {
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

export function buildGoogleMapsCoordsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat.toFixed(6)},${lng.toFixed(6)}`;
}

export function buildOsmLinkUrl(lat: number, lng: number, zoom = 16): string {
  const latStr = lat.toFixed(6);
  const lngStr = lng.toFixed(6);
  return `https://www.openstreetmap.org/?mlat=${latStr}&mlon=${lngStr}#map=${zoom}/${latStr}/${lngStr}`;
}

/**
 * Extracts exact latitude/longitude coordinates from common Google Maps,
 * OpenStreetMap, or plain "lat, lng" location strings.
 */
export function parseCoordinatesFromMapUrl(
  rawUrl?: string | null
): Coordinates | null {
  if (!rawUrl || typeof rawUrl !== "string") return null;
  const input = rawUrl.trim();
  if (!input) return null;

  const tryPair = (latStr?: string, lngStr?: string): Coordinates | null => {
    if (!latStr || !lngStr) return null;
    const lat = Number.parseFloat(latStr);
    const lng = Number.parseFloat(lngStr);
    return isValidCoordinates(lat, lng) ? { lat, lng } : null;
  };

  // Plain "31.5105, 74.3487"
  const rawMatch = input.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
  if (rawMatch) {
    return tryPair(rawMatch[1], rawMatch[2]);
  }

  // OpenStreetMap ?mlat=...&mlon=...
  const osmQueryMatch = input.match(
    /[?&]mlat=(-?\d+(?:\.\d+)?)(?:&[^#]*)?&mlon=(-?\d+(?:\.\d+)?)/i
  );
  if (osmQueryMatch) {
    const parsed = tryPair(osmQueryMatch[1], osmQueryMatch[2]);
    if (parsed) return parsed;
  }

  // OpenStreetMap #map=16/31.5105/74.3487
  const osmHashMatch = input.match(
    /#map=\d+\/(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)/i
  );
  if (osmHashMatch) {
    const parsed = tryPair(osmHashMatch[1], osmHashMatch[2]);
    if (parsed) return parsed;
  }

  // Google Maps ?query=lat,lng or ?q=lat,lng or ?ll=lat,lng or ?center=lat,lng
  const queryParamMatch = input.match(
    /[?&](?:query|q|ll|center)=(-?\d+(?:\.\d+)?)(?:,|%2C)\s*(-?\d+(?:\.\d+)?)/i
  );
  if (queryParamMatch) {
    const parsed = tryPair(queryParamMatch[1], queryParamMatch[2]);
    if (parsed) return parsed;
  }

  // Google Maps !3dlat!4dlng embed/data format
  const bangMatch = input.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  if (bangMatch) {
    const parsed = tryPair(bangMatch[1], bangMatch[2]);
    if (parsed) return parsed;
  }

  // Google Maps @lat,lng,zoom
  const atMatch = input.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (atMatch) {
    const parsed = tryPair(atMatch[1], atMatch[2]);
    if (parsed) return parsed;
  }

  return null;
}

export interface RawAddressParts {
  name?: string;
  house_number?: string;
  road?: string;
  neighbourhood?: string;
  suburb?: string;
  quarter?: string;
  city_district?: string;
  city?: string;
  town?: string;
  village?: string;
  county?: string;
  state?: string;
  country?: string;
}

export function formatReadableAddress(
  parts?: RawAddressParts | null,
  fallbackDisplayName?: string
): string {
  if (!parts) {
    return (fallbackDisplayName || "").trim();
  }

  const street = [parts.house_number, parts.road].filter(Boolean).join(" ").trim();
  const area = parts.neighbourhood || parts.suburb || parts.quarter || parts.city_district;
  const locality = parts.city || parts.town || parts.village || parts.county;
  const region = parts.state;
  const country = parts.country;

  const segments: string[] = [];
  for (const item of [street, area, locality, region, country]) {
    const cleaned = item?.trim();
    if (
      cleaned &&
      !segments.some((s) => s.toLowerCase() === cleaned.toLowerCase())
    ) {
      segments.push(cleaned);
    }
  }

  if (segments.length > 0) {
    return segments.join(", ");
  }

  return (fallbackDisplayName || "").trim();
}

