"use client";

import * as Switch from "@radix-ui/react-switch";
import { Plus, Trash2 } from "lucide-react";
import { useStudioStore } from "@/store/useStudioStore";
import { toSlug } from "@/lib/utils/slug";
import { MediaUploader } from "../MediaUploader";

interface ContentPanelProps {
  userId: string;
}

export function ContentPanel({ userId }: ContentPanelProps) {
  const {
    eventMeta,
    designData,
    updateMeta,
    updateContent,
    updateSections,
    addItineraryItem,
    updateItineraryItem,
    removeItineraryItem,
    addGalleryPhoto,
    removeGalleryPhoto,
    setPreviewStage,
  } = useStudioStore();

  const { content, sections } = designData;

  const localDatetimeValue = (() => {
    const d = new Date(eventMeta.event_date);
    if (Number.isNaN(d.getTime())) return "";
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().slice(0, 16);
  })();

  return (
    <div className="space-y-6">
      {/* Core Event Metadata */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          Event Basics
        </h3>

        <div>
          <label className="block text-xs text-stone-600 mb-1">
            Event Slug (/e/{eventMeta.slug})
          </label>
          <input
            type="text"
            value={eventMeta.slug}
            onChange={(e) => updateMeta({ slug: toSlug(e.target.value) })}
            className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs font-mono focus:border-stone-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs text-stone-600 mb-1">
            Date &amp; Time
          </label>
          <input
            type="datetime-local"
            value={localDatetimeValue}
            onChange={(e) => {
              if (e.target.value) {
                updateMeta({
                  event_date: new Date(e.target.value).toISOString(),
                });
              }
            }}
            className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-stone-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs text-stone-600 mb-1">
            Venue Name
          </label>
          <input
            type="text"
            value={eventMeta.venue_name}
            onChange={(e) => updateMeta({ venue_name: e.target.value })}
            className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-stone-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs text-stone-600 mb-1">
            Venue Address
          </label>
          <input
            type="text"
            value={eventMeta.venue_address}
            onChange={(e) => updateMeta({ venue_address: e.target.value })}
            className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-stone-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs text-stone-600 mb-1">
            Custom Google Maps URL (Optional)
          </label>
          <input
            type="url"
            value={eventMeta.venue_map_url}
            onChange={(e) => updateMeta({ venue_map_url: e.target.value })}
            placeholder="https://maps.google.com/..."
            className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-stone-900 focus:outline-none"
          />
        </div>
      </div>

      {/* Card Typography Copy */}
      <div className="space-y-3 border-t border-stone-200 pt-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Invitation Copy
          </h3>
          <button
            type="button"
            onClick={() => setPreviewStage("opened")}
            className="text-[11px] font-medium text-amber-700 hover:underline cursor-pointer"
          >
            Jump to Card
          </button>
        </div>

        <div>
          <label className="block text-xs text-stone-600 mb-1">Host Line</label>
          <input
            type="text"
            value={content.hostLine}
            onChange={(e) => updateContent({ hostLine: e.target.value })}
            className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-stone-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs text-stone-600 mb-1">
            Main Headline
          </label>
          <input
            type="text"
            value={content.headline}
            onChange={(e) => {
              updateContent({ headline: e.target.value });
              updateMeta({ title: e.target.value });
            }}
            className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-stone-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs text-stone-600 mb-1">Subtitle</label>
          <textarea
            rows={2}
            value={content.subtitle}
            onChange={(e) => updateContent({ subtitle: e.target.value })}
            className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-stone-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs text-stone-600 mb-1">
            Story / Welcome Quote
          </label>
          <textarea
            rows={2}
            value={content.storyQuote}
            onChange={(e) => updateContent({ storyQuote: e.target.value })}
            className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-stone-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs text-stone-600 mb-1">
            Dress Code
          </label>
          <input
            type="text"
            value={content.dressCode}
            onChange={(e) => updateContent({ dressCode: e.target.value })}
            className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-stone-900 focus:outline-none"
          />
        </div>
      </div>

      {/* Hero Cover Image */}
      <div className="space-y-2.5 border-t border-stone-200 pt-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          Hero Couple / Event Photo
        </h3>

        {content.heroImageUrl && (
          <div className="relative rounded-xl overflow-hidden border border-stone-200 h-32">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content.heroImageUrl}
              alt="Hero preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => updateContent({ heroImageUrl: null })}
              className="absolute top-2 right-2 rounded-lg bg-black/70 px-2 py-1 text-[10px] text-white hover:bg-black cursor-pointer"
            >
              Remove
            </button>
          </div>
        )}

        <MediaUploader
          userId={userId}
          eventId={eventMeta.id}
          accept="image/png,image/jpeg,image/webp"
          label={content.heroImageUrl ? "Replace Hero Photo" : "Upload Hero Photo"}
          folder="images"
          onUploaded={(url) => {
            setPreviewStage("opened");
            updateContent({ heroImageUrl: url });
          }}
        />
      </div>

      {/* Itinerary Schedule */}
      <div className="space-y-3 border-t border-stone-200 pt-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Schedule Timeline
          </h3>
          <button
            type="button"
            onClick={() =>
              addItineraryItem({
                id: `it-${Date.now()}`,
                title: "Celebration Moment",
                time: "8:00 PM",
                description: "Details for your guests",
              })
            }
            className="inline-flex items-center gap-1 text-xs font-medium text-stone-800 hover:text-amber-700 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {content.itinerary.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-stone-200 p-3 space-y-2 bg-stone-50/50"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={item.time}
                  onChange={(e) =>
                    updateItineraryItem(item.id, { time: e.target.value })
                  }
                  placeholder="7:30 PM"
                  className="w-24 rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs"
                />
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) =>
                    updateItineraryItem(item.id, { title: e.target.value })
                  }
                  placeholder="Ceremony"
                  className="flex-1 rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-medium"
                />
                <button
                  type="button"
                  onClick={() => removeItineraryItem(item.id)}
                  className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                  aria-label="Remove schedule item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                type="text"
                value={item.description}
                onChange={(e) =>
                  updateItineraryItem(item.id, { description: e.target.value })
                }
                placeholder="Short description..."
                className="w-full rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs text-stone-600"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="space-y-3 border-t border-stone-200 pt-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          Photo Gallery ({content.gallery.length}/8)
        </h3>

        {content.gallery.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {content.gallery.map((photo) => (
              <div
                key={photo.id}
                className="relative aspect-square rounded-xl overflow-hidden border border-stone-200"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeGalleryPhoto(photo.id)}
                  className="absolute top-1 right-1 rounded-full bg-black/70 p-1 text-white hover:bg-black cursor-pointer"
                  aria-label="Remove gallery photo"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {content.gallery.length < 8 && (
          <MediaUploader
            userId={userId}
            eventId={eventMeta.id}
            accept="image/png,image/jpeg,image/webp"
            label="Add Gallery Photo"
            folder="images"
            onUploaded={(url, fileName) => {
              setPreviewStage("opened");
              addGalleryPhoto({
                id: `img-${Date.now()}`,
                url,
                caption: fileName.replace(/\.[^/.]+$/, ""),
              });
            }}
          />
        )}
      </div>

      {/* Section Toggles & RSVP Settings */}
      <div className="space-y-3 border-t border-stone-200 pt-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          Visible Sections &amp; RSVP
        </h3>

        {(
          [
            { key: "showCountdown", label: "Live Countdown Timer" },
            { key: "showItinerary", label: "Evening Schedule" },
            { key: "showVenue", label: "Venue, Maps & Calendar Sync" },
            { key: "showGallery", label: "Photo Gallery" },
            { key: "showRsvp", label: "Interactive RSVP Card" },
          ] as const
        ).map((sec) => (
          <div
            key={sec.key}
            className="flex items-center justify-between text-xs py-1"
          >
            <span className="text-stone-700">{sec.label}</span>
            <Switch.Root
              checked={sections[sec.key]}
              onCheckedChange={(checked) =>
                updateSections({ [sec.key]: checked })
              }
              className="w-9 h-5 rounded-full bg-stone-300 data-[state=checked]:bg-stone-900 relative transition cursor-pointer"
            >
              <Switch.Thumb className="block w-3.5 h-3.5 rounded-full bg-white translate-x-0.5 transition-transform data-[state=checked]:translate-x-4.5" />
            </Switch.Root>
          </div>
        ))}

        <div>
          <label className="block text-xs text-stone-600 mb-1">
            RSVP Headline
          </label>
          <input
            type="text"
            value={content.rsvpHeadline}
            onChange={(e) => updateContent({ rsvpHeadline: e.target.value })}
            className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-stone-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs text-stone-600 mb-1">
            Max Guests Per Party ({content.maxGuestsPerParty})
          </label>
          <input
            type="range"
            min={1}
            max={15}
            value={content.maxGuestsPerParty}
            onChange={(e) =>
              updateContent({ maxGuestsPerParty: Number(e.target.value) })
            }
            className="w-full accent-stone-900"
          />
        </div>
      </div>
    </div>
  );
}

