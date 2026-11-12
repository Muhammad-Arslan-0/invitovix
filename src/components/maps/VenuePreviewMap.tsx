"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { Coordinates } from "@/lib/utils/location";

const DynamicLeafletMap = dynamic(() => import("./LeafletMapCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-44 rounded-2xl border border-stone-200/60 bg-stone-100/70 flex items-center justify-center gap-2 text-xs text-stone-500">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span>Loading map preview...</span>
    </div>
  ),
});

interface VenuePreviewMapProps {
  coordinates: Coordinates;
  venueName: string;
  pinColor?: string;
  accentColor?: string;
  heightClass?: string;
}

export function VenuePreviewMap({
  coordinates,
  venueName,
  pinColor,
  accentColor,
  heightClass = "h-44",
}: VenuePreviewMapProps) {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-black/10 shadow-xs">
      <DynamicLeafletMap
        coordinates={coordinates}
        interactive={false}
        zoom={15}
        pinColor={pinColor}
        accentColor={accentColor}
        venueLabel={venueName}
        tileStyle="satellite"
        className={`w-full ${heightClass}`}
      />
    </div>
  );
}

