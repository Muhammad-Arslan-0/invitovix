"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import * as Dialog from "@radix-ui/react-dialog";
import {
  CheckCircle2,
  Compass,
  Loader2,
  LocateFixed,
  MapPin,
  Maximize2,
  Minimize2,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import {
  GeocodedPlace,
  buildGoogleMapsCoordsUrl,
  formatCoordinatesLabel,
  parseCoordinatesFromMapUrl,
} from "@/lib/utils/location";
import type { MapTileStyle } from "./LeafletMapCanvas";

const DynamicLeafletMap = dynamic(() => import("./LeafletMapCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-stone-100 text-stone-500 text-xs">
      <Loader2 className="w-4 h-4 animate-spin text-amber-700" />
      <span>Loading free OpenStreetMap...</span>
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
  addressLabel = "Event Location / Address",
  addressPlaceholder = "Search or click on the map to auto-fill location...",
  defaultMapExpanded = true,
  allowModalExpand = true,
  compact = false,
}: VenueLocationPickerProps) {
  const coordinates = parseCoordinatesFromMapUrl(mapUrl);

  const [mapOpen, setMapOpen] = useState(defaultMapExpanded);
  const [modalOpen, setModalOpen] = useState(false);
  const [inlineTall, setInlineTall] = useState(false);
  const [tileStyle, setTileStyle] = useState<MapTileStyle>("street");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GeocodedPlace[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [isReversing, setIsReversing] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [suggestedPlace, setSuggestedPlace] = useState<string | null>(null);
  const [geoNotice, setGeoNotice] = useState<string | null>(null);

  const searchAbortRef = useRef<AbortController | null>(null);
  const reverseReqIdRef = useRef(0);
  const searchBoxRef = useRef<HTMLDivElement | null>(null);

  // Close autocomplete dropdown on outside click
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // Debounced free geocoding search
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 3) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = window.setTimeout(() => {
      void executeSearch(trimmed);
    }, 380);

    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  async function executeSearch(queryText: string) {
    const q = queryText.trim();
    if (q.length < 2) return;

    searchAbortRef.current?.abort();
    const controller = new AbortController();
    searchAbortRef.current = controller;

    setIsSearching(true);
    setGeoNotice(null);

    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`, {
        signal: controller.signal,
      });
      if (!res.ok) throw new Error("Lookup unavailable");
      const data = (await res.json()) as { results?: GeocodedPlace[] };
      const list = data.results ?? [];
      setSearchResults(list);
      setShowDropdown(true);
      if (list.length === 0) {
        setGeoNotice("No places matched. Try clicking directly on the map.");
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setGeoNotice("Search service busy — click anywhere on the map to pin.");
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsSearching(false);
      }
    }
  }

  function handleSelectSearchResult(place: GeocodedPlace) {
    const nextUrl = buildGoogleMapsCoordsUrl(place.lat, place.lng);
    setShowDropdown(false);
    setSearchQuery(place.placeName || place.address);
    setGeoNotice(null);
    setSuggestedPlace(
      place.placeName &&
        place.placeName.toLowerCase() !== (venueName || "").trim().toLowerCase()
        ? place.placeName
        : null
    );
    onLocationPicked({
      address: place.address,
      mapUrl: nextUrl,
      lat: place.lat,
      lng: place.lng,
      suggestedPlaceName: place.placeName || undefined,
    });
  }

  async function handlePinPicked(lat: number, lng: number) {
    const nextUrl = buildGoogleMapsCoordsUrl(lat, lng);
    const reqId = ++reverseReqIdRef.current;

    // Update exact map coordinates immediately so Save always has latest pin
    onChangeMapUrl(nextUrl);
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

      setSuggestedPlace(
        placeName &&
          placeName.toLowerCase() !== (venueName || "").trim().toLowerCase()
          ? placeName
          : null
      );

      onLocationPicked({
        address: resolvedAddress,
        mapUrl: nextUrl,
        lat,
        lng,
        suggestedPlaceName: placeName || undefined,
      });

      if (data.fallback) {
        setGeoNotice(
          "Pinned exact GPS coordinates. You can refine the street text above."
        );
      }
    } catch {
      if (reqId !== reverseReqIdRef.current) return;
      const fallbackAddress = address.trim() || formatCoordinatesLabel(lat, lng);
      onLocationPicked({
        address: fallbackAddress,
        mapUrl: nextUrl,
        lat,
        lng,
      });
      setGeoNotice(
        "Pinned exact coordinates. Add or adjust the address text if needed."
      );
    } finally {
      if (reqId === reverseReqIdRef.current) {
        setIsReversing(false);
      }
    }
  }

  function handleUseCurrentLocation() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoNotice("Browser GPS location is unavailable on this device.");
      return;
    }

    setIsLocating(true);
    setGeoNotice(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setMapOpen(true);
        void handlePinPicked(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        setIsLocating(false);
        setGeoNotice(
          err.code === err.PERMISSION_DENIED
            ? "Location permission denied — search or click on the map instead."
            : "Could not detect current position — pick a spot on the map."
        );
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  function renderMapControlsAndCanvas(heightClass: string, inModal = false) {
    return (
      <div className="space-y-2.5">
        {/* Search Bar + GPS Button */}
        <div className="flex items-center gap-1.5">
          <div ref={searchBoxRef} className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim().length >= 3) setShowDropdown(true);
              }}
              onFocus={() => {
                if (searchResults.length > 0) setShowDropdown(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void executeSearch(searchQuery);
                }
              }}
              placeholder="Search place, hotel, street, or city..."
              className="w-full rounded-xl border border-stone-200 bg-white pl-8 pr-16 py-2 text-xs text-stone-800 focus:border-stone-900 focus:outline-none transition"
            />
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {isSearching && (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-700" />
              )}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                    setShowDropdown(false);
                  }}
                  className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
              <button
                type="button"
                onClick={() => void executeSearch(searchQuery)}
                className="rounded-lg bg-stone-900 px-2 py-1 text-[10px] font-medium text-white hover:bg-stone-800 cursor-pointer"
              >
                Find
              </button>
            </div>

            {showDropdown && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 z-[1100] max-h-52 overflow-y-auto rounded-2xl border border-stone-200 bg-white shadow-xl divide-y divide-stone-100">
                {searchResults.map((place) => (
                  <button
                    key={place.id}
                    type="button"
                    onClick={() => handleSelectSearchResult(place)}
                    className="w-full text-left px-3 py-2.5 hover:bg-amber-50/60 transition flex items-start gap-2 cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      {place.placeName && (
                        <p className="text-xs font-semibold text-stone-900 truncate">
                          {place.placeName}
                        </p>
                      )}
                      <p className="text-[11px] text-stone-600 line-clamp-2">
                        {place.address}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            title="Snap to my current GPS location"
            className="inline-flex items-center gap-1 rounded-xl border border-stone-200 bg-white px-2.5 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-60 cursor-pointer shrink-0 transition"
          >
            {isLocating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-700" />
            ) : (
              <LocateFixed className="w-3.5 h-3.5 text-emerald-700" />
            )}
            <span className="hidden sm:inline">My Location</span>
          </button>
        </div>

        {/* Interactive OpenStreetMap Canvas */}
        <div className="relative rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          <DynamicLeafletMap
            coordinates={coordinates}
            interactive
            tileStyle={tileStyle}
            className={`w-full ${heightClass}`}
            onPick={(lat, lng) => void handlePinPicked(lat, lng)}
          />

          {/* Floating Map Controls Overlay (top-right) */}
          <div className="absolute top-2.5 right-2.5 z-[500] flex items-center gap-1.5">
            <div className="flex items-center rounded-lg bg-white/95 backdrop-blur-xs border border-stone-200/90 p-0.5 shadow-xs text-[10px] font-medium">
              {(
                [
                  { id: "street", label: "Street" },
                  { id: "editorial", label: "Clean" },
                ] as const
              ).map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setTileStyle(st.id)}
                  className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                    tileStyle === st.id
                      ? "bg-stone-900 text-white"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {!inModal &&
              (allowModalExpand ? (
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
              ))}
          </div>

          {/* Floating Instruction / Status Bar (bottom-left) */}
          <div className="pointer-events-none absolute bottom-2.5 left-2.5 right-2.5 z-[500] flex items-center justify-between gap-2">
            <div className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-xs border border-stone-200/90 px-3 py-1 text-[11px] text-stone-700 shadow-sm max-w-full">
              {isReversing ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin text-amber-700 shrink-0" />
                  <span>Auto-filling address...</span>
                </>
              ) : coordinates ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span className="truncate font-mono text-[10px]">
                    {formatCoordinatesLabel(coordinates.lat, coordinates.lng)}
                  </span>
                </>
              ) : (
                <>
                  <Compass className="w-3 h-3 text-amber-700 shrink-0" />
                  <span>Click map or drag pin to point exact location</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Optional Suggested Landmark Name Chip (never overwrites manual Venue Name) */}
        {suggestedPlace && onApplySuggestedName && (
          <div className="flex items-center justify-between gap-2 rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-1.5 text-[11px] text-amber-900">
            <span className="inline-flex items-center gap-1.5 truncate">
              <Sparkles className="w-3 h-3 text-amber-700 shrink-0" />
              <span className="truncate">
                Detected landmark: <strong>{suggestedPlace}</strong>
              </span>
            </span>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => {
                  onApplySuggestedName(suggestedPlace);
                  setSuggestedPlace(null);
                }}
                className="rounded-lg bg-stone-900 px-2 py-0.5 text-[10px] font-medium text-white hover:bg-stone-800 cursor-pointer"
              >
                Use as Venue Name
              </button>
              <button
                type="button"
                onClick={() => setSuggestedPlace(null)}
                className="p-0.5 text-amber-700 hover:text-amber-950 cursor-pointer"
                aria-label="Dismiss suggestion"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {geoNotice && (
          <p className="text-[11px] text-stone-500 leading-snug px-0.5">
            {geoNotice}
          </p>
        )}
      </div>
    );
  }

  const inlineHeight = compact
    ? inlineTall
      ? "h-72"
      : "h-48"
    : inlineTall
      ? "h-80"
      : "h-56";

  return (
    <div className="space-y-2.5">
      {/* Location / Address Field Header & Input */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-1">
          <label className="block text-xs font-medium text-stone-700">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-700" />
              {addressLabel}
            </span>
          </label>
          <button
            type="button"
            onClick={() => setMapOpen((v) => !v)}
            className="text-[11px] font-medium text-amber-800 hover:text-stone-900 underline underline-offset-2 cursor-pointer"
          >
            {mapOpen ? "Hide Map" : "Pick on Map"}
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            value={address}
            onChange={(e) => onChangeAddress(e.target.value)}
            placeholder={addressPlaceholder}
            className={`w-full rounded-xl border border-stone-200 bg-white px-3.5 pr-8 ${
              compact ? "py-2 text-xs" : "py-2.5 text-sm"
            } focus:border-stone-900 focus:outline-none transition`}
          />
          {address && (
            <button
              type="button"
              onClick={() => onChangeAddress("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
              aria-label="Clear address"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Inline Interactive Map Picker */}
      {mapOpen && renderMapControlsAndCanvas(inlineHeight, false)}

      {/* Spacious Expanded Modal Map Picker (used in Studio sidebar) */}
      {allowModalExpand && (
        <Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-stone-950/55 backdrop-blur-sm" />
            <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[94vw] max-w-3xl max-h-[90vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-5 sm:p-6 shadow-2xl border border-stone-200">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-amber-700 font-semibold">
                    Free OpenStreetMap Location Picker
                  </p>
                  <Dialog.Title className="mt-0.5 text-lg font-serif font-semibold text-stone-900">
                    Pin Exact Event Location
                  </Dialog.Title>
                  <Dialog.Description className="text-xs text-stone-500 mt-0.5">
                    Click anywhere on the map, drag the pin, or search to
                    auto-fill the address. Your venue name remains manual.
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

              {renderMapControlsAndCanvas("h-[380px]", true)}

              <div className="mt-4 rounded-2xl border border-stone-200 bg-stone-50 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
                    Selected Location Address
                  </p>
                  <p className="text-xs text-stone-800 font-medium truncate">
                    {address || "Click map or search to auto-fill address"}
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
