"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import * as Dialog from "@radix-ui/react-dialog";
import {
  CheckCircle2,
  ClipboardPaste,
  Compass,
  ExternalLink,
  HelpCircle,
  Link2,
  Loader2,
  MapPin,
  Maximize2,
  Minimize2,
  Sparkles,
  X,
} from "lucide-react";
import {
  Coordinates,
  GeocodedPlace,
  buildGoogleMapsCoordsUrl,
  buildGoogleMapsSearchUrl,
  extractPlaceNameFromMapUrl,
  formatCoordinatesLabel,
  isGoogleMapsUrl,
  isValidCoordinates,
  parseCoordinatesFromMapUrl,
} from "@/lib/utils/location";
import type { MapTileStyle } from "./LeafletMapCanvas";

const DynamicLeafletMap = dynamic(() => import("./LeafletMapCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-stone-100 text-stone-500 text-xs">
      <Loader2 className="w-4 h-4 animate-spin text-amber-700" />
      <span>Loading map preview...</span>
    </div>
  ),
});

export interface LocationSelectionPayload {
  address: string;
  mapUrl: string;
  lat: number;
  lng: number;
  suggestedPlaceName?: string;
}

interface VenueLocationPickerProps {
  address: string;
  mapUrl: string;
  venueName?: string;
  onChangeAddress: (address: string) => void;
  onChangeMapUrl: (mapUrl: string) => void;
  onLocationPicked: (payload: LocationSelectionPayload) => void;
  onApplySuggestedName?: (name: string) => void;
  addressLabel?: string;
  addressPlaceholder?: string;
  defaultMapExpanded?: boolean;
  allowModalExpand?: boolean;
  compact?: boolean;
}

export function VenueLocationPicker({
  address,
  mapUrl,
  venueName,
  onChangeAddress,
  onChangeMapUrl,
  onLocationPicked,
  onApplySuggestedName,
  allowModalExpand = true,
  compact = false,
}: VenueLocationPickerProps) {
  const coordinates = parseCoordinatesFromMapUrl(mapUrl);
  const [activeCoords, setActiveCoords] = useState<Coordinates | null>(() =>
    parseCoordinatesFromMapUrl(mapUrl)
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [inlineTall, setInlineTall] = useState(false);
  const tileStyle: MapTileStyle = "satellite";

  const [googleLinkInput, setGoogleLinkInput] = useState(mapUrl || "");
  const [isLinking, setIsLinking] = useState(false);
  const [isLinkedSuccess, setIsLinkedSuccess] = useState(
    Boolean(mapUrl && (isGoogleMapsUrl(mapUrl) || parseCoordinatesFromMapUrl(mapUrl)))
  );
  const [showGuide, setShowGuide] = useState(false);
  const [geoNotice, setGeoNotice] = useState<string | null>(null);
  const [isReversing, setIsReversing] = useState(false);

  const googleLinkInputRef = useRef<HTMLInputElement | null>(null);
  const reverseReqIdRef = useRef(0);

  // Sync when mapUrl changes from parent
  useEffect(() => {
    if (mapUrl && mapUrl !== googleLinkInput) {
      setGoogleLinkInput(mapUrl);
      setIsLinkedSuccess(
        Boolean(isGoogleMapsUrl(mapUrl) || parseCoordinatesFromMapUrl(mapUrl))
      );
    }
    const parsed = parseCoordinatesFromMapUrl(mapUrl);
    if (parsed) {
      setActiveCoords(parsed);
    }
  }, [mapUrl]);

  // Open Google Maps pre-searched with the user's venue
  function handleOpenGoogleMapsSearch() {
    const parts = [venueName, address].filter(Boolean).map((s) => s!.trim());
    const query = parts.length > 0 ? parts.join(", ") : "Wedding Hall";
    const targetUrl = buildGoogleMapsSearchUrl(query);
    if (typeof window !== "undefined") {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }
  }

  // Process pasted Google Maps share link, URL, or coordinates
  async function handleProcessGoogleLink(rawInput: string) {
    const clean = rawInput.trim();
    if (!clean) return;

    setIsLinking(true);
    setGeoNotice(null);

    // 1. Direct coordinate check
    const directCoords = parseCoordinatesFromMapUrl(clean);
    const directName = extractPlaceNameFromMapUrl(clean);

    if (directCoords) {
      setActiveCoords(directCoords);
      const nextMapUrl = clean.startsWith("http")
        ? clean
        : buildGoogleMapsCoordsUrl(directCoords.lat, directCoords.lng);
      onChangeMapUrl(nextMapUrl);
      setIsLinkedSuccess(true);
      setIsLinking(false);

      if (directName && onApplySuggestedName) {
        onApplySuggestedName(directName);
      }

      if (!address.trim()) {
        void handlePinPicked(directCoords.lat, directCoords.lng);
      } else {
        onLocationPicked({
          address: address.trim(),
          mapUrl: nextMapUrl,
          lat: directCoords.lat,
          lng: directCoords.lng,
          suggestedPlaceName: directName || undefined,
        });
      }
      return;
    }

    // 2. Fetch via /api/geocode to expand short links (maps.app.goo.gl) and resolve coordinates
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(clean)}`);
      if (!res.ok) throw new Error("Could not resolve link");
      const data = (await res.json()) as { results?: GeocodedPlace[] };
      const place = data.results?.[0];

      if (place && isValidCoordinates(place.lat, place.lng)) {
        const resolvedCoords: Coordinates = { lat: place.lat, lng: place.lng };
        setActiveCoords(resolvedCoords);

        const nextMapUrl = clean.startsWith("http")
          ? clean
          : buildGoogleMapsCoordsUrl(place.lat, place.lng);

        onChangeMapUrl(nextMapUrl);
        setIsLinkedSuccess(true);

        const resolvedAddress = place.address || formatCoordinatesLabel(place.lat, place.lng);
        onChangeAddress(resolvedAddress);

        if (place.placeName && onApplySuggestedName) {
          onApplySuggestedName(place.placeName);
        }

        onLocationPicked({
          address: resolvedAddress,
          mapUrl: nextMapUrl,
          lat: place.lat,
          lng: place.lng,
          suggestedPlaceName: place.placeName || undefined,
        });
        setGeoNotice(null);
      } else {
        setIsLinkedSuccess(false);
        setGeoNotice(
          "Could not detect venue from this link. Try copying from your browser's address bar or click on the map."
        );
      }
    } catch {
      setIsLinkedSuccess(false);
      setGeoNotice(
        "Could not load Google Maps link. Please check the URL or click directly on the map below."
      );
    } finally {
      setIsLinking(false);
    }
  }

  // Paste directly from clipboard
  async function handlePasteFromClipboard() {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          setGoogleLinkInput(text.trim());
          void handleProcessGoogleLink(text.trim());
          return;
        }
      }
    } catch {
      // Browser permission blocked clipboard reading
    }
    googleLinkInputRef.current?.focus();
  }

  // Direct map click
  async function handlePinPicked(lat: number, lng: number) {
    setActiveCoords({ lat, lng });
    const nextUrl = buildGoogleMapsCoordsUrl(lat, lng);
    const reqId = ++reverseReqIdRef.current;

    onChangeMapUrl(nextUrl);
    setGoogleLinkInput(nextUrl);
    setIsLinkedSuccess(true);
    setGeoNotice(null);
    setIsReversing(true);

    try {
      const res = await fetch(
        `/api/geocode?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`
      );
      if (!res.ok) throw new Error("Reverse lookup failed");
      const data = (await res.json()) as {
        result?: GeocodedPlace;
        fallback?: boolean;
      };

      if (reqId !== reverseReqIdRef.current) return;

      const resolvedAddress =
        data.result?.address || formatCoordinatesLabel(lat, lng);
      const placeName = data.result?.placeName || "";

      onChangeAddress(resolvedAddress);
      if (placeName && onApplySuggestedName && !venueName?.trim()) {
        onApplySuggestedName(placeName);
      }

      onLocationPicked({
        address: resolvedAddress,
        mapUrl: nextUrl,
        lat,
        lng,
        suggestedPlaceName: placeName || undefined,
      });
    } catch {
      if (reqId !== reverseReqIdRef.current) return;
      const fallbackAddress = address.trim() || formatCoordinatesLabel(lat, lng);
      onLocationPicked({
        address: fallbackAddress,
        mapUrl: nextUrl,
        lat,
        lng,
      });
    } finally {
      if (reqId === reverseReqIdRef.current) {
        setIsReversing(false);
      }
    }
  }

  const cleanVenueName = venueName?.trim();
  const searchButtonText = cleanVenueName
    ? `Search "${cleanVenueName.length > 22 ? cleanVenueName.slice(0, 22) + '...' : cleanVenueName}" on Google Maps`
    : "Search Venue on Google Maps";

  const effectiveCoords = activeCoords || coordinates;

  const mapHeight = compact
    ? inlineTall
      ? "h-72"
      : "h-48"
    : inlineTall
      ? "h-80"
      : "h-56";

  return (
    <div className="space-y-3">
      {/* Redesigned Card: Google Maps Venue Finder */}
      <div className="rounded-2xl border border-stone-200/90 bg-white p-3.5 sm:p-4 space-y-3 shadow-2xs">
        {/* Title row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-800 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-amber-700" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-semibold text-stone-900 truncate">
                Find on Google Maps
              </h4>
              <p className="text-[11px] text-stone-500 truncate">
                Search venue, copy share link, paste below
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowGuide((v) => !v)}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-500 hover:text-stone-800 transition cursor-pointer shrink-0"
            title="How to get Google Maps link"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Guide</span>
          </button>
        </div>

        {/* 1-Click Search Button (Full width, responsive, clean) */}
        <button
          type="button"
          onClick={handleOpenGoogleMapsSearch}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white px-3.5 py-2 text-xs font-medium shadow-xs transition cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">{searchButtonText}</span>
        </button>

        {/* 3-Step Guide (Expandable) */}
        {showGuide && (
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-2.5 text-[11px] text-stone-700 space-y-1 leading-relaxed">
            <p className="font-semibold text-stone-900 flex items-center gap-1 text-[11px]">
              <Sparkles className="w-3 h-3 text-amber-700" />
              Quick 3 Steps:
            </p>
            <ol className="list-decimal list-inside space-y-0.5 text-stone-600 pl-1">
              <li>Click the search button above to open Google Maps.</li>
              <li>Tap <strong className="text-stone-800">Share</strong> → <strong className="text-stone-800">Copy link</strong> (or copy URL).</li>
              <li>Click <strong className="text-stone-800">Paste</strong> below — name &amp; pin auto-sync!</li>
            </ol>
          </div>
        )}

        {/* Link Input Row */}
        <div className="space-y-1.5">
          <div className="relative flex items-center">
            <Link2 className="w-3.5 h-3.5 text-stone-400 absolute left-3 pointer-events-none" />
            <input
              ref={googleLinkInputRef}
              type="text"
              value={googleLinkInput}
              onChange={(e) => {
                setGoogleLinkInput(e.target.value);
                const val = e.target.value.trim();
                if (isGoogleMapsUrl(val) || parseCoordinatesFromMapUrl(val)) {
                  void handleProcessGoogleLink(val);
                }
              }}
              onPaste={(e) => {
                const pasted = e.clipboardData.getData("text");
                if (
                  pasted &&
                  (isGoogleMapsUrl(pasted) || parseCoordinatesFromMapUrl(pasted))
                ) {
                  e.preventDefault();
                  setGoogleLinkInput(pasted.trim());
                  void handleProcessGoogleLink(pasted.trim());
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (googleLinkInput.trim()) {
                    void handleProcessGoogleLink(googleLinkInput.trim());
                  }
                }
              }}
              placeholder="Paste Google Maps link (e.g. https://maps.app.goo.gl/...)"
              className="w-full rounded-xl border border-stone-200 bg-stone-50/60 pl-8 pr-28 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-stone-900 focus:outline-none transition"
            />

            <div className="absolute right-1.5 flex items-center gap-1">
              {isLinking && (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-700 mr-1" />
              )}
              {googleLinkInput && (
                <button
                  type="button"
                  onClick={() => {
                    setGoogleLinkInput("");
                    setIsLinkedSuccess(false);
                  }}
                  className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                  aria-label="Clear link"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
              <button
                type="button"
                onClick={handlePasteFromClipboard}
                className="inline-flex items-center gap-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 px-2 py-1 text-[10px] font-semibold cursor-pointer transition shrink-0"
                title="Paste from clipboard"
              >
                <ClipboardPaste className="w-3 h-3" />
                <span>Paste</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (googleLinkInput.trim()) {
                    void handleProcessGoogleLink(googleLinkInput.trim());
                  }
                }}
                disabled={isLinking || !googleLinkInput.trim()}
                className="rounded-lg bg-stone-900 px-2.5 py-1 text-[10px] font-medium text-white hover:bg-stone-800 disabled:opacity-40 cursor-pointer transition shrink-0"
              >
                Set Pin
              </button>
            </div>
          </div>

          {/* Sync Success Badge with auto-fetched details */}
          {isLinkedSuccess && effectiveCoords && (
            <div className="rounded-xl bg-emerald-50/90 border border-emerald-200 p-2.5 text-xs text-emerald-950 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 font-medium text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Linked with Google Maps</span>
                </span>
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-900 hover:underline"
                >
                  <span>Test Link</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              {address && (
                <p className="text-[11px] text-emerald-800 line-clamp-2 pl-5">
                  📍 {address}
                </p>
              )}
            </div>
          )}

          {geoNotice && (
            <p className="text-[11px] text-stone-500 leading-snug px-0.5">
              {geoNotice}
            </p>
          )}
        </div>
      </div>

      {/* Clean Leaflet Map Canvas */}
      <div className="relative rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <DynamicLeafletMap
          coordinates={effectiveCoords}
          interactive
          tileStyle={tileStyle}
          className={`w-full ${mapHeight}`}
          onPick={(lat, lng) => void handlePinPicked(lat, lng)}
        />

        {/* Expand Map Control (top-right) */}
        <div className="absolute top-2.5 right-2.5 z-[500] flex items-center gap-1.5">
          {allowModalExpand ? (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1 rounded-lg bg-white/95 backdrop-blur-xs border border-stone-200/90 px-2 py-1 text-[10px] font-medium text-stone-700 hover:text-stone-900 shadow-xs cursor-pointer"
              title="Expand large map picker"
            >
              <Maximize2 className="w-3 h-3" />
              <span className="hidden sm:inline">Expand</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setInlineTall((prev) => !prev)}
              className="inline-flex items-center gap-1 rounded-lg bg-white/95 backdrop-blur-xs border border-stone-200/90 px-2 py-1 text-[10px] font-medium text-stone-700 hover:text-stone-900 shadow-xs cursor-pointer"
              title={inlineTall ? "Compact map" : "Larger map"}
            >
              {inlineTall ? (
                <Minimize2 className="w-3 h-3" />
              ) : (
                <Maximize2 className="w-3 h-3" />
              )}
            </button>
          )}
        </div>

        {/* Coordinates status pill (bottom-left) */}
        <div className="pointer-events-none absolute bottom-2.5 left-2.5 right-2.5 z-[500] flex items-center justify-between gap-2">
          <div className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-xs border border-stone-200/90 px-3 py-1 text-[11px] text-stone-700 shadow-sm max-w-full">
            {isReversing ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-amber-700 shrink-0" />
                <span>Auto-fetching address...</span>
              </>
            ) : effectiveCoords ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                <span className="truncate font-mono text-[10px]">
                  {formatCoordinatesLabel(effectiveCoords.lat, effectiveCoords.lng)}
                </span>
              </>
            ) : (
              <>
                <Compass className="w-3 h-3 text-amber-700 shrink-0" />
                <span>Click map to mark exact location</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Modal Map Picker */}
      {allowModalExpand && (
        <Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-stone-950/55 backdrop-blur-sm" />
            <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[94vw] max-w-3xl max-h-[90vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-5 sm:p-6 shadow-2xl border border-stone-200">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-amber-700 font-semibold">
                    Interactive Location Picker
                  </p>
                  <Dialog.Title className="mt-0.5 text-lg font-serif font-semibold text-stone-900">
                    Pin Exact Event Location
                  </Dialog.Title>
                  <Dialog.Description className="text-xs text-stone-500 mt-0.5">
                    Click anywhere on the map or drag the pin to adjust.
                  </Dialog.Description>
                </div>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="rounded-full p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 cursor-pointer"
                    aria-label="Close map picker"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </Dialog.Close>
              </div>

              <div className="relative rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                <DynamicLeafletMap
                  coordinates={effectiveCoords}
                  interactive
                  tileStyle={tileStyle}
                  className="w-full h-[380px]"
                  onPick={(lat, lng) => void handlePinPicked(lat, lng)}
                />
              </div>

              <div className="mt-4 rounded-2xl border border-stone-200 bg-stone-50 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
                    Selected Location Address
                  </p>
                  <p className="text-xs text-stone-800 font-medium truncate">
                    {address || "Click map to set exact coordinates"}
                  </p>
                </div>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="rounded-xl bg-stone-900 px-4 py-2 text-xs font-medium text-white hover:bg-stone-800 cursor-pointer shrink-0"
                  >
                    Use This Location
                  </button>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </div>
  );
}
