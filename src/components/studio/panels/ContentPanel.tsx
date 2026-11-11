"use client";

import { memo } from "react";
import * as Switch from "@radix-ui/react-switch";
import { Plus, Trash2, UsersRound } from "lucide-react";
import { useStudioStore } from "@/store/useStudioStore";
import { COUPLE_FRAME_OPTIONS } from "@/lib/templates/presets";
import { getInvitationTypeMeta } from "@/lib/templates/categories";
import { toSlug } from "@/lib/utils/slug";
import { MediaUploader } from "../MediaUploader";
import { VenueLocationPicker } from "@/components/maps/VenueLocationPicker";

interface ContentPanelProps {
  userId: string;
}

export const ContentPanel = memo(function ContentPanel({
  userId,
}: ContentPanelProps) {
  const eventId = useStudioStore((s) => s.eventMeta.id);
  const eventType = useStudioStore((s) => s.eventMeta.event_type);
  const eventSlug = useStudioStore((s) => s.eventMeta.slug);
  const eventDate = useStudioStore((s) => s.eventMeta.event_date);
  const venueName = useStudioStore((s) => s.eventMeta.venue_name);
  const venueAddress = useStudioStore((s) => s.eventMeta.venue_address);
  const venueMapUrl = useStudioStore((s) => s.eventMeta.venue_map_url);
  const content = useStudioStore((s) => s.designData.content);
  const sections = useStudioStore((s) => s.designData.sections);

  const typeMeta = getInvitationTypeMeta(eventType);

  const updateMeta = useStudioStore((s) => s.updateMeta);
  const updateContent = useStudioStore((s) => s.updateContent);
  const updateCouple = useStudioStore((s) => s.updateCouple);
  const updateSections = useStudioStore((s) => s.updateSections);
  const addItineraryItem = useStudioStore((s) => s.addItineraryItem);
  const updateItineraryItem = useStudioStore((s) => s.updateItineraryItem);
  const removeItineraryItem = useStudioStore((s) => s.removeItineraryItem);
  const addGalleryPhoto = useStudioStore((s) => s.addGalleryPhoto);
  const removeGalleryPhoto = useStudioStore((s) => s.removeGalleryPhoto);
  const setPreviewStage = useStudioStore((s) => s.setPreviewStage);

  const localDatetimeValue = (() => {
    const d = new Date(eventDate);
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
            Event Slug (/e/{eventSlug})
          </label>
          <input
            type="text"
            value={eventSlug}
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
            Venue Name (Manual)
          </label>
          <input
            type="text"
            value={venueName}
            onChange={(e) => updateMeta({ venue_name: e.target.value })}
            placeholder={typeMeta.createVenuePlaceholder}
            className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-stone-900 focus:outline-none"
          />
        </div>

        <VenueLocationPicker
          address={venueAddress}
          mapUrl={venueMapUrl}
          venueName={venueName}
          onChangeAddress={(val) => updateMeta({ venue_address: val })}
          onChangeMapUrl={(val) => updateMeta({ venue_map_url: val })}
          onLocationPicked={({ address, mapUrl }) =>
            updateMeta({
              venue_address: address,
              venue_map_url: mapUrl,
            })
          }
          onApplySuggestedName={(name) => updateMeta({ venue_name: name })}
          addressLabel="Venue Location (Auto-fills from Map)"
          addressPlaceholder="Click on map or search address..."
          defaultMapExpanded
          allowModalExpand
          compact
        />

        <div>
          <label className="block text-xs text-stone-600 mb-1">
            Pinned Maps URL (Auto-generated or custom)
          </label>
          <input
            type="url"
            value={venueMapUrl}
            onChange={(e) => updateMeta({ venue_map_url: e.target.value })}
            placeholder="https://www.google.com/maps/search/?api=1&query=..."
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

      {/* Dynamic Person / Couple Spotlight Portraits */}
      <div className="space-y-3 border-t border-stone-200 pt-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <UsersRound className="w-3.5 h-3.5 text-amber-700" />
            <span>{typeMeta.spotlightSectionLabel}</span>
          </h3>
          <Switch.Root
            checked={sections.showCouple}
            aria-label={`Show ${typeMeta.spotlightToggleLabel}`}
            onCheckedChange={(checked) => {
              setPreviewStage("opened");
              updateSections({ showCouple: checked });
            }}
            className="w-9 h-5 rounded-full bg-stone-300 data-[state=checked]:bg-stone-900 relative transition cursor-pointer shrink-0"
          >
            <Switch.Thumb className="block w-3.5 h-3.5 rounded-full bg-white translate-x-0.5 transition-transform data-[state=checked]:translate-x-4.5" />
          </Switch.Root>
        </div>

        {sections.showCouple && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-2.5">
              <div>
                <label className="block text-[11px] text-stone-600 mb-1">
                  Showcase Layout
                </label>
                <div className="grid grid-cols-3 gap-1 rounded-xl border border-stone-200 p-1 bg-stone-50">
                  {(
                    [
                      { id: "featured-solo", label: "Solo" },
                      { id: "side-by-side", label: "Twin" },
                      { id: "editorial-split", label: "Split" },
                    ] as const
                  ).map((lay) => (
                    <button
                      key={lay.id}
                      type="button"
                      onClick={() => {
                        setPreviewStage("opened");
                        updateCouple({ layout: lay.id });
                      }}
                      className={`rounded-lg py-1 text-[11px] font-medium cursor-pointer transition ${
                        content.couple.layout === lay.id
                          ? "bg-stone-900 text-white"
                          : "text-stone-600 hover:text-stone-900"
                      }`}
                    >
                      {lay.label}
                    </button>
                  ))}
                </div>
              </div>

              {content.couple.layout !== "featured-solo" && (
                <div>
                  <label className="block text-[11px] text-stone-600 mb-1">
                    Center Crest
                  </label>
                  <input
                    type="text"
                    maxLength={8}
                    value={content.couple.crestText}
                    onChange={(e) =>
                      updateCouple({ crestText: e.target.value })
                    }
                    placeholder="&"
                    className="w-full rounded-xl border border-stone-200 px-3 py-1.5 text-xs text-center focus:border-stone-900 focus:outline-none"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] text-stone-600 mb-1">
                Portrait Frame Shape
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {COUPLE_FRAME_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setPreviewStage("opened");
                      updateCouple({ frameShape: opt.id });
                    }}
                    className={`rounded-xl border py-1.5 text-[11px] font-medium transition cursor-pointer ${
                      content.couple.frameShape === opt.id
                        ? "border-stone-900 bg-stone-900 text-white"
                        : "border-stone-200 text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Person 1 Card */}
            <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-700">
                  {typeMeta.person1CardTitle}
                </span>
                {content.couple.brideImageUrl && (
                  <button
                    type="button"
                    onClick={() => updateCouple({ brideImageUrl: null })}
                    className="text-[10px] font-medium text-rose-600 hover:underline cursor-pointer"
                  >
                    Remove Photo
                  </button>
                )}
              </div>

              {content.couple.brideImageUrl && (
                <div className="h-24 w-20 mx-auto rounded-t-full rounded-b-xl overflow-hidden border border-stone-300 shadow-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={content.couple.brideImageUrl}
                    alt={content.couple.brideName || typeMeta.person1ShortLabel}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <MediaUploader
                userId={userId}
                eventId={eventId}
                accept="image/png,image/jpeg,image/webp"
                label={
                  content.couple.brideImageUrl
                    ? typeMeta.person1ReplaceLabel
                    : typeMeta.person1UploadLabel
                }
                folder="images"
                onUploaded={(url) => {
                  setPreviewStage("opened");
                  updateCouple({ brideImageUrl: url });
                }}
              />

              <input
                type="text"
                value={content.couple.brideName}
                onChange={(e) => updateCouple({ brideName: e.target.value })}
                placeholder={typeMeta.person1NamePlaceholder}
                className="w-full rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs focus:border-stone-900 focus:outline-none"
              />
              <input
                type="text"
                value={content.couple.brideRole}
                onChange={(e) => updateCouple({ brideRole: e.target.value })}
                placeholder={typeMeta.person1RolePlaceholder}
                className="w-full rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-600 focus:border-stone-900 focus:outline-none"
              />
            </div>

            {/* Person 2 Card (or optional toggle button when Featured Solo) */}
            {content.couple.layout === "featured-solo" ? (
              <button
                type="button"
                onClick={() => {
                  setPreviewStage("opened");
                  updateCouple({ layout: "side-by-side" });
                }}
                className="w-full rounded-2xl border border-dashed border-stone-300 bg-stone-50/50 py-2.5 px-3 text-xs font-medium text-stone-600 hover:border-stone-900 hover:text-stone-900 transition cursor-pointer"
              >
                {typeMeta.addPerson2Label}
              </button>
            ) : (
              <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-700">
                    {typeMeta.person2CardTitle}
                  </span>
                  {content.couple.groomImageUrl && (
                    <button
                      type="button"
                      onClick={() => updateCouple({ groomImageUrl: null })}
                      className="text-[10px] font-medium text-rose-600 hover:underline cursor-pointer"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>

                {content.couple.groomImageUrl && (
                  <div className="h-24 w-20 mx-auto rounded-t-full rounded-b-xl overflow-hidden border border-stone-300 shadow-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={content.couple.groomImageUrl}
                      alt={
                        content.couple.groomName || typeMeta.person2ShortLabel
                      }
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <MediaUploader
                  userId={userId}
                  eventId={eventId}
                  accept="image/png,image/jpeg,image/webp"
                  label={
                    content.couple.groomImageUrl
                      ? typeMeta.person2ReplaceLabel
                      : typeMeta.person2UploadLabel
                  }
                  folder="images"
                  onUploaded={(url) => {
                    setPreviewStage("opened");
                    updateCouple({ groomImageUrl: url });
                  }}
                />

                <input
                  type="text"
                  value={content.couple.groomName}
                  onChange={(e) => updateCouple({ groomName: e.target.value })}
                  placeholder={typeMeta.person2NamePlaceholder}
                  className="w-full rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs focus:border-stone-900 focus:outline-none"
                />
                <input
                  type="text"
                  value={content.couple.groomRole}
                  onChange={(e) => updateCouple({ groomRole: e.target.value })}
                  placeholder={typeMeta.person2RolePlaceholder}
                  className="w-full rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-600 focus:border-stone-900 focus:outline-none"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hero Cover Image */}
      <div className="space-y-2.5 border-t border-stone-200 pt-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          {typeMeta.domain === "wedding"
            ? "Hero Couple / Event Photo"
            : "Hero Portrait / Cover Photo"}
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
          eventId={eventId}
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
            eventId={eventId}
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
            { key: "showCouple", label: typeMeta.spotlightToggleLabel },
            { key: "showCountdown", label: "Live Countdown Timer" },
            { key: "showItinerary", label: typeMeta.itineraryHeading },
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
});

