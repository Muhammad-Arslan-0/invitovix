"use client";

import { memo, useState } from "react";
import * as Switch from "@radix-ui/react-switch";
import { Move, Plus, Sparkles, Trash2, UsersRound } from "lucide-react";
import { useStudioStore } from "@/store/useStudioStore";
import { COUPLE_FRAME_OPTIONS } from "@/lib/templates/presets";
import { getInvitationTypeMeta } from "@/lib/templates/categories";
import { toSlug } from "@/lib/utils/slug";
import { MediaUploader } from "../MediaUploader";
import { ImageCropModal, FrameShapeOption } from "../ImageCropModal";
import { VenueLocationPicker } from "@/components/maps/VenueLocationPicker";
import { createClient } from "@/lib/supabase/client";
import { CropState, AspectRatioType } from "@/lib/utils/imageOptimization";
import { CoupleFrameShape, HeroFrameStyle } from "@/types/invitation";

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
  const theme = useStudioStore((s) => s.designData.theme);

  const typeMeta = getInvitationTypeMeta(eventType);

  const updateMeta = useStudioStore((s) => s.updateMeta);
  const updateContent = useStudioStore((s) => s.updateContent);
  const updateCouple = useStudioStore((s) => s.updateCouple);
  const updateSections = useStudioStore((s) => s.updateSections);
  const setItinerary = useStudioStore((s) => s.setItinerary);
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

  const [adjustTarget, setAdjustTarget] = useState<{
    type: "bride" | "groom" | "hero" | "gallery";
    url: string;
    originalUrl: string;
    crop?: CropState | null;
    shape: FrameShapeOption;
    aspect: AspectRatioType;
    personName?: string;
    roleBadge?: string;
    galleryId?: string;
  } | null>(null);

  async function handleSaveAdjustedPhoto(result: {
    blob: Blob;
    shape?: FrameShapeOption;
    crop: CropState;
  }) {
    if (!adjustTarget) return;
    try {
      const supabase = createClient();
      const objectPath = `${userId}/${eventId}/images/${Date.now()}-crop-${adjustTarget.type}.webp`;

      const { error: uploadErr } = await supabase.storage
        .from("card-assets")
        .upload(objectPath, result.blob, {
          cacheControl: "3600",
          contentType: "image/webp",
          upsert: false,
        });

      if (uploadErr) {
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("card-assets").getPublicUrl(objectPath);

      setPreviewStage("opened");

      if (adjustTarget.type === "bride") {
        updateCouple({
          brideImageUrl: publicUrl,
          brideOriginalUrl: adjustTarget.originalUrl,
          brideCrop: result.crop,
          ...(result.shape &&
          result.shape !== "landscape" &&
          result.shape !== "square"
            ? { frameShape: result.shape as CoupleFrameShape }
            : {}),
        });
      } else if (adjustTarget.type === "groom") {
        updateCouple({
          groomImageUrl: publicUrl,
          groomOriginalUrl: adjustTarget.originalUrl,
          groomCrop: result.crop,
          ...(result.shape &&
          result.shape !== "landscape" &&
          result.shape !== "square"
            ? { frameShape: result.shape as CoupleFrameShape }
            : {}),
        });
      } else if (adjustTarget.type === "hero") {
        updateContent({
          heroImageUrl: publicUrl,
          heroOriginalUrl: adjustTarget.originalUrl,
          heroCrop: result.crop,
        });
        if (
          result.shape &&
          result.shape !== "landscape" &&
          result.shape !== "square" &&
          result.shape !== "scallop"
        ) {
          useStudioStore.setState((s) => ({
            designData: {
              ...s.designData,
              theme: {
                ...s.designData.theme,
                cardArt: {
                  ...s.designData.theme.cardArt,
                  heroFrame: result.shape as HeroFrameStyle,
                },
              },
            },
            isDirty: true,
          }));
        }
      } else if (adjustTarget.type === "gallery" && adjustTarget.galleryId) {
        const targetId = adjustTarget.galleryId;
        const currentGallery = useStudioStore.getState().designData.content.gallery;
        updateContent({
          gallery: currentGallery.map((p) =>
            p.id === targetId
              ? {
                  ...p,
                  url: publicUrl,
                  originalUrl: adjustTarget.originalUrl,
                  crop: result.crop,
                }
              : p
          ),
        });
      }
    } catch {
      // ignore
    }
  }

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
                <div className="space-y-1.5">
                  <div className="h-24 w-20 mx-auto rounded-t-full rounded-b-xl overflow-hidden border border-stone-300 shadow-xs relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={content.couple.brideImageUrl}
                      alt={content.couple.brideName || typeMeta.person1ShortLabel}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() =>
                        setAdjustTarget({
                          type: "bride",
                          url: content.couple.brideImageUrl!,
                          originalUrl:
                            content.couple.brideOriginalUrl ||
                            content.couple.brideImageUrl!,
                          crop: content.couple.brideCrop || null,
                          aspect: "portrait",
                          shape:
                            (content.couple.frameShape as FrameShapeOption) ||
                            "arch",
                          personName:
                            content.couple.brideName ||
                            typeMeta.person1ShortLabel,
                          roleBadge: typeMeta.person1BadgeLabel,
                        })
                      }
                      className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-2 py-0.5 text-[10px] font-medium text-stone-700 hover:bg-stone-100 transition cursor-pointer shadow-2xs"
                    >
                      <Move className="w-3 h-3 text-amber-600" />
                      <span>Adjust Position</span>
                    </button>
                  </div>
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
                enableCrop
                cropAspect="portrait"
                initialFrameShape={
                  (content.couple.frameShape as FrameShapeOption) || "arch"
                }
                initialCrop={content.couple.brideCrop || null}
                targetType="bride"
                personName={
                  content.couple.brideName || typeMeta.person1ShortLabel
                }
                roleBadge={typeMeta.person1BadgeLabel}
                primaryColor={theme.palette.primary}
                accentColor={theme.palette.accent}
                surfaceColor={theme.palette.surface}
                onUploaded={(url, _fileName, extra) => {
                  setPreviewStage("opened");
                  updateCouple({
                    brideImageUrl: url,
                    brideOriginalUrl: extra?.originalUrl || url,
                    brideCrop: extra?.crop,
                  });
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
                  <div className="space-y-1.5">
                    <div className="h-24 w-20 mx-auto rounded-t-full rounded-b-xl overflow-hidden border border-stone-300 shadow-xs relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={content.couple.groomImageUrl}
                        alt={
                          content.couple.groomName || typeMeta.person2ShortLabel
                        }
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() =>
                          setAdjustTarget({
                            type: "groom",
                            url: content.couple.groomImageUrl!,
                            originalUrl:
                              content.couple.groomOriginalUrl ||
                              content.couple.groomImageUrl!,
                            crop: content.couple.groomCrop || null,
                            aspect: "portrait",
                            shape:
                              (content.couple.frameShape as FrameShapeOption) ||
                              "arch",
                            personName:
                              content.couple.groomName ||
                              typeMeta.person2ShortLabel,
                            roleBadge: typeMeta.person2BadgeLabel,
                          })
                        }
                        className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-2 py-0.5 text-[10px] font-medium text-stone-700 hover:bg-stone-100 transition cursor-pointer shadow-2xs"
                      >
                        <Move className="w-3 h-3 text-amber-600" />
                        <span>Adjust Position</span>
                      </button>
                    </div>
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
                  enableCrop
                  cropAspect="portrait"
                  initialFrameShape={
                    (content.couple.frameShape as FrameShapeOption) || "arch"
                  }
                  initialCrop={content.couple.groomCrop || null}
                  targetType="groom"
                  personName={
                    content.couple.groomName || typeMeta.person2ShortLabel
                  }
                  roleBadge={typeMeta.person2BadgeLabel}
                  primaryColor={theme.palette.primary}
                  accentColor={theme.palette.accent}
                  surfaceColor={theme.palette.surface}
                  onUploaded={(url, _fileName, extra) => {
                    setPreviewStage("opened");
                    updateCouple({
                      groomImageUrl: url,
                      groomOriginalUrl: extra?.originalUrl || url,
                      groomCrop: extra?.crop,
                    });
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
            <div className="absolute top-2 right-2 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() =>
                  setAdjustTarget({
                    type: "hero",
                    url: content.heroImageUrl!,
                    originalUrl:
                      content.heroOriginalUrl || content.heroImageUrl!,
                    crop: content.heroCrop || null,
                    aspect: "portrait",
                    shape:
                      (theme.cardArt.heroFrame as FrameShapeOption) || "arch",
                    personName: content.headline,
                  })
                }
                className="rounded-lg bg-black/70 px-2 py-1 text-[10px] text-white hover:bg-black inline-flex items-center gap-1 cursor-pointer"
              >
                <Move className="w-3 h-3 text-amber-300" />
                <span>Adjust</span>
              </button>
              <button
                type="button"
                onClick={() => updateContent({ heroImageUrl: null })}
                className="rounded-lg bg-black/70 px-2 py-1 text-[10px] text-white hover:bg-black cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        <MediaUploader
          userId={userId}
          eventId={eventId}
          accept="image/png,image/jpeg,image/webp"
          label={
            content.heroImageUrl ? "Replace Hero Photo" : "Upload Hero Photo"
          }
          folder="images"
          enableCrop
          cropAspect="portrait"
          initialFrameShape={
            (theme.cardArt.heroFrame as FrameShapeOption) || "arch"
          }
          initialCrop={content.heroCrop || null}
          targetType="hero"
          personName={content.headline}
          primaryColor={theme.palette.primary}
          accentColor={theme.palette.accent}
          surfaceColor={theme.palette.surface}
          onUploaded={(url, _fileName, extra) => {
            setPreviewStage("opened");
            updateContent({
              heroImageUrl: url,
              heroOriginalUrl: extra?.originalUrl || url,
              heroCrop: extra?.crop,
            });
          }}
        />
      </div>

      {/* Itinerary Schedule / Multi-Day Ceremonies */}
      <div className="space-y-3.5 border-t border-stone-200 pt-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              {typeMeta.domain === "wedding"
                ? "Wedding Ceremonies & Events (Multi-Day)"
                : "Celebration Events Timeline"}
            </h3>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Add individual days (Mehndi, Baraat, Reception) and control which guests see which events.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {typeMeta.domain === "wedding" && (
              <button
                type="button"
                onClick={() =>
                  setItinerary([
                    {
                      id: `it-${Date.now()}-1`,
                      dayLabel: "Day 1 · Mehndi",
                      date: "Friday, Nov 14",
                      time: "7:30 PM",
                      title: "Mehndi & Sangeet Night",
                      description:
                        "Rasm-e-Heena, dholki rhythms, choreographed family performances & street food feast",
                      venue: "Courtyard Marquee & Lawn",
                      venueAddress: "Gulberg III, Lahore",
                      dressCode: "Festive Yellow, Coral & Emerald",
                      guestTier: "three_days",
                    },
                    {
                      id: `it-${Date.now()}-2`,
                      dayLabel: "Day 2 · Baraat",
                      date: "Saturday, Nov 15",
                      time: "8:00 PM",
                      title: "Shahi Baraat & Nikah",
                      description:
                        "Istiqbal-e-Baraat, sacred Nikah vows, garland exchange & royal banquet dinner",
                      venue: "Grand Ballroom, Pearl Continental",
                      venueAddress: "Mall Road, Lahore",
                      dressCode: "Regal Traditional / Crimson & Antique Gold",
                      guestTier: "three_days",
                    },
                    {
                      id: `it-${Date.now()}-3`,
                      dayLabel: "Day 3 · Reception",
                      date: "Sunday, Nov 16",
                      time: "8:30 PM",
                      title: "Valima / Grand Reception",
                      description:
                        "Welcoming the newlyweds, celebration dinner, dessert salon & toasts",
                      venue: "The Royal Palm Golf & Country Club",
                      venueAddress: "Canal Bank Road, Lahore",
                      dressCode: "Formal Evening / Pastel & Champagne",
                      guestTier: "all",
                    },
                  ])
                }
                className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-900 hover:bg-amber-100 transition cursor-pointer shadow-2xs"
                title="Quickly fill in the 3 classic Pakistani wedding events"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>3-Day Wedding Preset</span>
              </button>
            )}
            <button
              type="button"
              onClick={() =>
                addItineraryItem({
                  id: `it-${Date.now()}`,
                  dayLabel:
                    typeMeta.domain === "wedding"
                      ? `Day ${content.itinerary.length + 1}`
                      : undefined,
                  date: "Date & Day",
                  title: "Ceremony Title",
                  time: "8:00 PM",
                  description: "Ceremony details for your guests",
                  guestTier: "all",
                })
              }
              className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-2.5 py-1 text-xs font-medium text-stone-800 hover:bg-stone-50 transition cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Event</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {content.itinerary.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-stone-200 p-3.5 space-y-2.5 bg-stone-50/70 shadow-2xs"
            >
              {/* Row 1: Day Badge, Date, Time, Remove */}
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={item.dayLabel ?? ""}
                  onChange={(e) =>
                    updateItineraryItem(item.id, { dayLabel: e.target.value })
                  }
                  placeholder="Day 1 · Mehndi"
                  className="w-32 rounded-lg border border-stone-200 bg-white px-2.5 py-1 text-xs font-semibold text-stone-800"
                  title="Day Label (e.g. Day 1 · Mehndi, Day 2 · Baraat, Day 3 · Valima)"
                />
                <input
                  type="text"
                  value={item.date ?? ""}
                  onChange={(e) =>
                    updateItineraryItem(item.id, { date: e.target.value })
                  }
                  placeholder="Friday, 14 Nov"
                  className="w-32 rounded-lg border border-stone-200 bg-white px-2.5 py-1 text-xs text-stone-700"
                  title="Date of ceremony"
                />
                <input
                  type="text"
                  value={item.time}
                  onChange={(e) =>
                    updateItineraryItem(item.id, { time: e.target.value })
                  }
                  placeholder="7:30 PM"
                  className="w-24 rounded-lg border border-stone-200 bg-white px-2.5 py-1 text-xs"
                />
                <button
                  type="button"
                  onClick={() => removeItineraryItem(item.id)}
                  className="ml-auto text-stone-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                  aria-label="Remove ceremony item"
                  title="Remove this event"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Row 2: Title */}
              <input
                type="text"
                value={item.title}
                onChange={(e) =>
                  updateItineraryItem(item.id, { title: e.target.value })
                }
                placeholder="Ceremony Title (e.g., Mehndi & Sangeet)"
                className="w-full rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-stone-900"
              />

              {/* Row 3: Description */}
              <input
                type="text"
                value={item.description}
                onChange={(e) =>
                  updateItineraryItem(item.id, { description: e.target.value })
                }
                placeholder="Ceremony program details..."
                className="w-full rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs text-stone-600"
              />

              {/* Row 4: Optional Venue & Dress Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={item.venue ?? ""}
                  onChange={(e) =>
                    updateItineraryItem(item.id, { venue: e.target.value })
                  }
                  placeholder="Venue (e.g. Royal Palm Marquee)"
                  className="w-full rounded-lg border border-stone-200 bg-white px-2.5 py-1 text-xs text-stone-700"
                />
                <input
                  type="text"
                  value={item.dressCode ?? ""}
                  onChange={(e) =>
                    updateItineraryItem(item.id, { dressCode: e.target.value })
                  }
                  placeholder="Dress code (e.g. Yellow / Mustard)"
                  className="w-full rounded-lg border border-stone-200 bg-white px-2.5 py-1 text-xs text-stone-700"
                />
              </div>

              {/* Row 5: Guest Tier Access Selector */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-200/60 text-xs">
                <span className="text-[11px] font-medium text-stone-500">
                  Guest Invitation Access:
                </span>
                <select
                  value={item.guestTier ?? "all"}
                  onChange={(e) =>
                    updateItineraryItem(item.id, {
                      guestTier: e.target.value as
                        | "all"
                        | "three_days"
                        | "reception_only",
                    })
                  }
                  className="rounded-lg border border-stone-200 bg-white px-2.5 py-1 text-xs font-medium text-stone-800"
                >
                  <option value="all">🌐 All Guests (Everyone)</option>
                  <option value="three_days">
                    👑 3-Days Guests Only (Mehndi/Baraat)
                  </option>
                  <option value="reception_only">🥂 Reception Only Guests</option>
                </select>
              </div>
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
                className="relative aspect-square rounded-xl overflow-hidden border border-stone-200 group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1 right-1 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setAdjustTarget({
                        type: "gallery",
                        url: photo.url,
                        originalUrl: photo.originalUrl || photo.url,
                        crop: photo.crop || null,
                        aspect: "square",
                        shape: "square",
                        galleryId: photo.id,
                      })
                    }
                    className="rounded-full bg-black/70 p-1 text-white hover:bg-black cursor-pointer shadow-xs"
                    title="Adjust Crop"
                    aria-label="Adjust photo crop"
                  >
                    <Move className="w-3 h-3 text-amber-300" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeGalleryPhoto(photo.id)}
                    className="rounded-full bg-black/70 p-1 text-white hover:bg-black cursor-pointer shadow-xs"
                    title="Remove Photo"
                    aria-label="Remove gallery photo"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
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
            enableCrop
            cropAspect="square"
            initialFrameShape="square"
            targetType="gallery"
            primaryColor={theme.palette.primary}
            accentColor={theme.palette.accent}
            surfaceColor={theme.palette.surface}
            onUploaded={(url, fileName, extra) => {
              setPreviewStage("opened");
              addGalleryPhoto({
                id: `img-${Date.now()}`,
                url,
                originalUrl: extra?.originalUrl || url,
                crop: extra?.crop,
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

      {/* Adjust Crop & Reposition Modal for Existing Photos */}
      {adjustTarget && (
        <ImageCropModal
          open={!!adjustTarget}
          onOpenChange={(isOpen) => {
            if (!isOpen) setAdjustTarget(null);
          }}
          imageSrc={adjustTarget.originalUrl || adjustTarget.url}
          aspect={adjustTarget.aspect}
          initialShape={adjustTarget.shape}
          initialCrop={adjustTarget.crop}
          targetType={adjustTarget.type}
          personName={adjustTarget.personName}
          roleBadge={adjustTarget.roleBadge}
          primaryColor={theme.palette.primary}
          accentColor={theme.palette.accent}
          surfaceColor={theme.palette.surface}
          onCropComplete={async (result) => {
            await handleSaveAdjustedPhoto(result);
          }}
        />
      )}
    </div>
  );
});

