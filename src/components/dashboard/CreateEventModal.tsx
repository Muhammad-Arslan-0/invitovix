"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { Calendar, Check, Loader2, MapPin, Plus, Sparkles, X } from "lucide-react";
import { TemplateRecord } from "@/types/invitation";
import { createClient } from "@/lib/supabase/client";
import { generateUniqueSlug, toSlug } from "@/lib/utils/slug";
import {
  isWeddingTemplate,
  mergeDesignData,
  resolveCardBackdropUrl,
} from "@/lib/templates/presets";
import { startNavigation } from "@/components/ui/NavigationProgress";
import { LuxLoader } from "@/components/ui/LuxLoader";
import { VenueLocationPicker } from "@/components/maps/VenueLocationPicker";

interface CreateEventModalProps {
  templates: TemplateRecord[];
  userId: string;
}

export function CreateEventModal({ templates, userId }: CreateEventModalProps) {
  const router = useRouter();
  const weddingTemplates = templates.filter(isWeddingTemplate);
  const [open, setOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    weddingTemplates[0]?.id ?? ""
  );
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [eventDate, setEventDate] = useState(() => {
    const d = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    d.setHours(18, 30, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [venueName, setVenueName] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [venueMapUrl, setVenueMapUrl] = useState("");
  const [launchPhase, setLaunchPhase] = useState<"idle" | "creating" | "opening">("idle");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const selectedTemplate =
    weddingTemplates.find((t) => t.id === selectedTemplateId) ??
    weddingTemplates[0];

  const isBusy = launchPhase !== "idle" || isPending;

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) {
      setSlug(value.trim() ? toSlug(value) : "");
    }
  }

  async function insertEventRecord(
    supabase: ReturnType<typeof createClient>,
    targetSlug: string,
    templateIdOverride?: string | null
  ) {
    const baseDesign = mergeDesignData(selectedTemplate!.default_config);
    baseDesign.content.headline = title.trim();

    return supabase
      .from("events")
      .insert({
        user_id: userId,
        template_id:
          templateIdOverride !== undefined
            ? templateIdOverride
            : selectedTemplate!.id,
        slug: targetSlug,
        title: title.trim(),
        event_type: selectedTemplate!.category,
        event_date: new Date(eventDate).toISOString(),
        venue_name: venueName.trim(),
        venue_address: venueAddress.trim() || null,
        venue_map_url: venueMapUrl.trim() || null,
        design_data: baseDesign,
        is_published: false,
      })
      .select("id")
      .single();
  }

  async function ensureProfileFallback(supabase: ReturnType<typeof createClient>) {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) return;
    await supabase.from("profiles").upsert(
      {
        id: user.id,
        email: user.email,
        full_name:
          (user.user_metadata?.full_name as string | undefined) ||
          user.email?.split("@")[0] ||
          "Host",
      },
      { onConflict: "id" }
    );
  }

  function navigateToStudio(eventId: string) {
    setLaunchPhase("opening");
    startNavigation();
    startTransition(() => {
      router.push(`/studio/${eventId}`);
    });
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTemplate || isBusy) return;
    setError(null);
    setLaunchPhase("creating");

    try {
      const supabase = createClient();
      const finalSlug = toSlug(slug || title) || generateUniqueSlug(title);

      let usedTemplateNullFallback = false;
      let { data, error: insertError } = await insertEventRecord(supabase, finalSlug);

      // Handle FK 23503: missing profile row OR local template not yet seeded in Supabase
      if (insertError?.code === "23503") {
        if (insertError.message.includes("template")) {
          usedTemplateNullFallback = true;
          const retryTplRes = await insertEventRecord(supabase, finalSlug, null);
          data = retryTplRes.data;
          insertError = retryTplRes.error;
        } else {
          await ensureProfileFallback(supabase);
          const retryProfileRes = await insertEventRecord(supabase, finalSlug);
          data = retryProfileRes.data;
          insertError = retryProfileRes.error;
          if (insertError?.code === "23503" && insertError.message.includes("template")) {
            usedTemplateNullFallback = true;
            const retryTplRes = await insertEventRecord(supabase, finalSlug, null);
            data = retryTplRes.data;
            insertError = retryTplRes.error;
          }
        }
      }

      if (insertError) {
        if (insertError.code === "23505") {
          const retrySlug = generateUniqueSlug(finalSlug);
          const { data: retryData, error: retryErr } = await insertEventRecord(
            supabase,
            retrySlug,
            usedTemplateNullFallback ? null : undefined
          );

          if (retryErr || !retryData) {
            setError(retryErr?.message || "Could not create event");
            setLaunchPhase("idle");
            return;
          }
          navigateToStudio(retryData.id);
          return;
        }

        setError(insertError.message);
        setLaunchPhase("idle");
        return;
      }

      if (data) {
        navigateToStudio(data.id);
      } else {
        setLaunchPhase("idle");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create event");
      setLaunchPhase("idle");
    }
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (isBusy) return;
        setOpen(next);
      }}
    >
      <Dialog.Trigger asChild>
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-medium text-white shadow-md hover:bg-stone-800 transition cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>New Invitation</span>
        </motion.button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-stone-950/55 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[94vw] max-w-2xl max-h-[90vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-stone-200">
          {isBusy ? (
            <div className="py-10 px-4">
              <Dialog.Title className="sr-only">Launching Creator Studio</Dialog.Title>
              <Dialog.Description className="sr-only">
                Saving your invitation and navigating to Studio.
              </Dialog.Description>
              <LuxLoader
                compact
                title={
                  launchPhase === "opening"
                    ? "Opening Creator Studio..."
                    : "Crafting Your Invitation..."
                }
                subtitle={
                  launchPhase === "opening"
                    ? `Loading "${title || "Invitation"}" with ${selectedTemplate?.title ?? "your"} styling.`
                    : "Saving template presets and preparing your interactive wax-seal canvas..."
                }
              />
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-700">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>New Experience</span>
                  </div>
                  <Dialog.Title className="mt-1 text-xl font-serif font-semibold text-stone-900">
                    Create Wedding Invitation
                  </Dialog.Title>
                  <Dialog.Description className="text-sm text-stone-500 mt-0.5">
                    Pick a starter wedding template and enter your ceremony details.
                  </Dialog.Description>
                </div>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="rounded-full p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 cursor-pointer"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </Dialog.Close>
              </div>

              <form onSubmit={handleCreate} className="mt-6 space-y-5">
                {/* Template Picker */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2.5">
                    1. Choose Wedding Template
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-60 overflow-y-auto pr-1">
                    {weddingTemplates.map((tpl) => {
                      const active = tpl.id === selectedTemplateId;
                      const palette = tpl.default_config.theme.palette;
                      const sceneUrl = resolveCardBackdropUrl(
                        tpl.default_config.theme.cardArt
                      );
                      return (
                        <motion.button
                          key={tpl.id}
                          type="button"
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedTemplateId(tpl.id)}
                          className={`relative rounded-2xl border p-2 text-left transition cursor-pointer ${
                            active
                              ? "border-stone-900 ring-2 ring-amber-500/35 bg-amber-50/40 shadow-sm"
                              : "border-stone-200 hover:border-stone-300 bg-white"
                          }`}
                        >
                          <div
                            className="h-20 rounded-xl flex flex-col items-center justify-center p-2 text-center border relative overflow-hidden"
                            style={{
                              backgroundColor: palette.background,
                              borderColor: `${palette.accent}66`,
                            }}
                          >
                            {sceneUrl && (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={sceneUrl}
                                alt=""
                                className="absolute inset-0 w-full h-full object-cover opacity-55"
                              />
                            )}
                            <span
                              className="relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-md ring-2 ring-white/40"
                              style={{ backgroundColor: palette.accent }}
                            >
                              {tpl.default_config.envelope.waxSeal.monogram}
                            </span>
                            <span
                              className="relative z-10 mt-1.5 text-[10px] font-semibold uppercase tracking-wider px-1.5 rounded-full bg-white/75"
                              style={{ color: palette.primary }}
                            >
                              {tpl.category}
                            </span>
                          </div>
                          <p className="mt-2 text-xs font-medium text-stone-900 line-clamp-1">
                            {tpl.title}
                          </p>
                          {active && (
                            <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-stone-900 text-amber-300 flex items-center justify-center shadow">
                              <Check className="w-3 h-3" />
                            </span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Event Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Couple / Wedding Headline *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g., Zara & Bilal Nikah"
                      className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm focus:border-stone-900 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Share URL Slug *
                    </label>
                    <div className="flex items-center rounded-xl border border-stone-300 overflow-hidden focus-within:border-stone-900 transition">
                      <span className="bg-stone-50 px-2.5 py-2.5 text-xs text-stone-500 border-r border-stone-200">
                        /e/
                      </span>
                      <input
                        type="text"
                        required
                        value={slug}
                        onChange={(e) => {
                          setSlugTouched(true);
                          setSlug(toSlug(e.target.value));
                        }}
                        placeholder="zara-bilal-nikah"
                        className="w-full px-3 py-2.5 text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        Date &amp; Time *
                      </span>
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm focus:border-stone-900 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        Venue Name (Manual) *
                      </span>
                    </label>
                    <input
                      type="text"
                      required
                      value={venueName}
                      onChange={(e) => setVenueName(e.target.value)}
                      placeholder="e.g., Royal Palm Conservatory"
                      className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm focus:border-stone-900 focus:outline-none transition"
                    />
                  </div>
                </div>

                <VenueLocationPicker
                  address={venueAddress}
                  mapUrl={venueMapUrl}
                  venueName={venueName}
                  onChangeAddress={setVenueAddress}
                  onChangeMapUrl={setVenueMapUrl}
                  onLocationPicked={({ address, mapUrl }) => {
                    setVenueAddress(address);
                    setVenueMapUrl(mapUrl);
                  }}
                  onApplySuggestedName={(name) => setVenueName(name)}
                  addressLabel="Event Location / Address (Auto-fills from Map)"
                  addressPlaceholder="Search place or point on map below — or type street & city"
                  defaultMapExpanded
                  allowModalExpand={false}
                />

                {error && (
                  <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                    {error}
                  </p>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 cursor-pointer transition"
                    >
                      Cancel
                    </button>
                  </Dialog.Close>
                  <button
                    type="submit"
                    disabled={isBusy}
                    className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-stone-800 disabled:opacity-60 cursor-pointer transition"
                  >
                    {isBusy ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Launching Studio...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Create &amp; Open Studio</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
