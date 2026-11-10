"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Coordinates, DEFAULT_MAP_CENTER } from "@/lib/utils/location";

export type MapTileStyle = "street" | "editorial";

export interface LeafletMapCanvasProps {
  coordinates: Coordinates | null;
  fallbackCenter?: Coordinates;
  zoom?: number;
  interactive?: boolean;
  pinColor?: string;
  accentColor?: string;
  venueLabel?: string;
  tileStyle?: MapTileStyle;
  className?: string;
  onPick?: (lat: number, lng: number) => void;
}

const TILE_LAYERS: Record<
  MapTileStyle,
  { url: string; attribution: string; maxZoom: number }
> = {
  street: {
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  },
  editorial: {
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 20,
  },
};

function createPinIcon(
  pinColor: string,
  accentColor: string,
  pulse: boolean
): L.DivIcon {
  const safePrimary = pinColor || "#114232";
  const safeAccent = accentColor || "#C99A3B";

  return L.divIcon({
    className: "invitovix-map-pin-icon",
    iconSize: [38, 46],
    iconAnchor: [19, 44],
    popupAnchor: [0, -40],
    html: `
      <div style="position:relative;width:38px;height:46px;display:flex;align-items:center;justify-content:center;cursor:${
        pulse ? "grab" : "pointer"
      };">
        ${
          pulse
            ? `<span style="position:absolute;bottom:2px;width:20px;height:8px;border-radius:9999px;background:rgba(0,0,0,0.22);filter:blur(2px);"></span>`
            : `<span style="position:absolute;bottom:2px;width:18px;height:6px;border-radius:9999px;background:rgba(0,0,0,0.18);filter:blur(2px);"></span>`
        }
        <svg width="36" height="44" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 6px 10px rgba(0,0,0,0.28));">
          <path d="M18 2C9.71573 2 3 8.71573 3 17C3 28.25 18 42 18 42C18 42 33 28.25 33 17C33 8.71573 26.2843 2 18 2Z" fill="${safePrimary}" stroke="#FFFFFF" stroke-width="2.5"/>
          <circle cx="18" cy="16.5" r="6.5" fill="${safeAccent}" stroke="#FFFFFF" stroke-width="1.8"/>
          <circle cx="18" cy="16.5" r="2.2" fill="#FFFFFF"/>
        </svg>
      </div>
    `,
  });
}

export default function LeafletMapCanvas({
  coordinates,
  fallbackCenter = DEFAULT_MAP_CENTER,
  zoom,
  interactive = true,
  pinColor = "#114232",
  accentColor = "#C99A3B",
  venueLabel,
  tileStyle = "street",
  className = "w-full h-56",
  onPick,
}: LeafletMapCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const onPickRef = useRef(onPick);
  const prevCoordsRef = useRef<string | null>(null);

  useEffect(() => {
    onPickRef.current = onPick;
  }, [onPick]);

  // Initialize Leaflet map once on mount
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const initialCenter = coordinates ?? fallbackCenter;
    const initialZoom = zoom ?? (coordinates ? 16 : 12);

    const map = L.map(container, {
      center: [initialCenter.lat, initialCenter.lng],
      zoom: initialZoom,
      zoomControl: true,
      scrollWheelZoom: false,
      doubleClickZoom: interactive,
      dragging: true,
      attributionControl: true,
    });

    const layerConfig = TILE_LAYERS[tileStyle];
    const tileLayer = L.tileLayer(layerConfig.url, {
      attribution: layerConfig.attribution,
      maxZoom: layerConfig.maxZoom,
    });

    // Silent fallback to OpenStreetMap if an editorial tile provider fails
    tileLayer.on("tileerror", () => {
      if (tileStyle !== "street") {
        tileLayer.setUrl(TILE_LAYERS.street.url);
      }
    });

    tileLayer.addTo(map);
    tileLayerRef.current = tileLayer;
    mapRef.current = map;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (!interactive) return;
      const { lat, lng } = e.latlng;
      onPickRef.current?.(lat, lng);
    };

    map.on("click", handleMapClick);

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            if (container.clientWidth > 0 && container.clientHeight > 0) {
              map.invalidateSize({ animate: false });
            }
          })
        : null;
    resizeObserver?.observe(container);

    // Ensure tiles paint crisply inside dialogs or animated drawers
    const invalidateTimer = window.setTimeout(() => {
      map.invalidateSize({ animate: false });
    }, 180);

    return () => {
      window.clearTimeout(invalidateTimer);
      resizeObserver?.disconnect();
      map.off("click", handleMapClick);
      map.remove();
      mapRef.current = null;
      tileLayerRef.current = null;
      markerRef.current = null;
      prevCoordsRef.current = null;
    };
    // Intentionally initialize once per mount; prop updates sync below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Swap tile layer when tileStyle toggles
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const cfg = TILE_LAYERS[tileStyle];
    const nextLayer = L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      maxZoom: cfg.maxZoom,
    }).addTo(map);

    tileLayerRef.current = nextLayer;
  }, [tileStyle]);

  // Sync marker position, icon colors, and map camera
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!coordinates) {
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
        markerRef.current = null;
      }
      prevCoordsRef.current = null;
      return;
    }

    const icon = createPinIcon(pinColor, accentColor, interactive);
    const coordKey = `${coordinates.lat.toFixed(6)},${coordinates.lng.toFixed(6)}`;

    if (!markerRef.current) {
      const marker = L.marker([coordinates.lat, coordinates.lng], {
        icon,
        draggable: interactive,
        autoPan: interactive,
      }).addTo(map);

      if (interactive) {
        marker.on("dragend", () => {
          const pos = marker.getLatLng();
          onPickRef.current?.(pos.lat, pos.lng);
        });
      }

      markerRef.current = marker;
    } else {
      markerRef.current.setLatLng([coordinates.lat, coordinates.lng]);
      markerRef.current.setIcon(icon);
    }

    if (venueLabel && !interactive) {
      markerRef.current.bindTooltip(venueLabel, {
        direction: "top",
        offset: [0, -40],
      });
    } else if (markerRef.current.getTooltip()) {
      markerRef.current.unbindTooltip();
    }

    if (prevCoordsRef.current !== coordKey) {
      const targetZoom = Math.max(map.getZoom(), zoom ?? 15);
      if (prevCoordsRef.current === null) {
        map.setView([coordinates.lat, coordinates.lng], targetZoom, {
          animate: false,
        });
      } else {
        map.flyTo([coordinates.lat, coordinates.lng], targetZoom, {
          duration: 0.65,
        });
      }
      prevCoordsRef.current = coordKey;
    }
  }, [coordinates, pinColor, accentColor, interactive, venueLabel, zoom]);

  return (
    <div
      className={`relative isolate overflow-hidden bg-stone-100 ${className}`}
      style={{ zIndex: 0 }}
    >
      <div
        ref={containerRef}
        className={`w-full h-full ${interactive ? "cursor-crosshair" : ""}`}
      />
    </div>
  );
}

