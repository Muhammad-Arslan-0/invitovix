"use client";

import { memo } from "react";
import { Monitor, RotateCcw, Smartphone, Tablet } from "lucide-react";
import { useStudioStore } from "@/store/useStudioStore";
import { resolveCardBackdropUrl } from "@/lib/templates/presets";
import { InvitationPlayer } from "@/components/invitation/InvitationPlayer";

export const StudioCanvas = memo(function StudioCanvas() {
  const eventMeta = useStudioStore((s) => s.eventMeta);
  const designData = useStudioStore((s) => s.designData);
  const previewDevice = useStudioStore((s) => s.previewDevice);
  const previewStage = useStudioStore((s) => s.previewStage);
  const previewGuestTier = useStudioStore((s) => s.previewGuestTier);
  const replayCounter = useStudioStore((s) => s.replayCounter);
  const setPreviewDevice = useStudioStore((s) => s.setPreviewDevice);
  const setPreviewStage = useStudioStore((s) => s.setPreviewStage);
  const setPreviewGuestTier = useStudioStore((s) => s.setPreviewGuestTier);
  const triggerReplay = useStudioStore((s) => s.triggerReplay);

  const isPresentationMode = previewDevice !== "mobile";
  const ambientPhotoUrl =
    designData.content.heroImageUrl ||
    designData.content.couple.brideImageUrl ||
    designData.content.gallery[0]?.url ||
    resolveCardBackdropUrl(designData.theme.cardArt) ||
    null;

  const frameClasses =
    previewDevice === "mobile"
      ? "w-[390px] max-w-full rounded-[44px] border-[10px] border-stone-900 shadow-[0_28px_70px_-15px_rgba(24,20,15,0.45)] ring-1 ring-amber-200/30 bg-white"
      : previewDevice === "tablet"
        ? "w-[720px] max-w-full rounded-[28px] border-[8px] border-stone-800 shadow-[0_24px_60px_-15px_rgba(24,20,15,0.35)] bg-[#100E0C]"
        : "w-full max-w-5xl rounded-2xl border border-stone-800 shadow-2xl bg-[#100E0C]";

  return (
    <div className="flex-1 drafting-grid flex flex-col overflow-hidden">
      {/* Canvas Device & Stage Controls */}
      <div className="h-12 border-b border-stone-200/90 bg-white/85 backdrop-blur-md px-4 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1 rounded-xl bg-stone-100 p-1">
          {(
            [
              { id: "mobile", icon: Smartphone, label: "Mobile" },
              { id: "tablet", icon: Tablet, label: "Tablet" },
              { id: "desktop", icon: Monitor, label: "Desktop" },
            ] as const
          ).map((dev) => {
            const Icon = dev.icon;
            const active = previewDevice === dev.id;
            return (
              <button
                key={dev.id}
                type="button"
                onClick={() => setPreviewDevice(dev.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors duration-150 cursor-pointer ${
                  active
                    ? "bg-white text-stone-900 shadow-xs"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{dev.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 rounded-xl bg-stone-100 p-1 text-xs">
            {(
              [
                { id: "sealed", label: "Envelope" },
                { id: "opened", label: "Inside Card" },
              ] as const
            ).map((stage) => {
              const active = previewStage === stage.id;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setPreviewStage(stage.id)}
                  className={`rounded-lg px-2.5 py-1 font-medium cursor-pointer transition-colors duration-150 ${
                    active
                      ? "bg-white text-stone-900 shadow-xs"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  {stage.label}
                </button>
              );
            })}
          </div>

          {/* Guest Tier Preview Switcher */}
          <div className="hidden lg:flex items-center gap-0.5 rounded-xl bg-stone-100 p-1 text-xs">
            <button
              type="button"
              onClick={() => setPreviewGuestTier("all")}
              className={`rounded-lg px-2.5 py-1 font-medium cursor-pointer transition-colors duration-150 ${
                previewGuestTier === "all"
                  ? "bg-white text-stone-900 shadow-xs"
                  : "text-stone-500 hover:text-stone-800"
              }`}
              title="Preview invitation as 3-Days Wedding Guest"
            >
              All Events (3 Days)
            </button>
            <button
              type="button"
              onClick={() => setPreviewGuestTier("reception")}
              className={`rounded-lg px-2.5 py-1 font-medium cursor-pointer transition-colors duration-150 ${
                previewGuestTier === "reception"
                  ? "bg-white text-stone-900 shadow-xs"
                  : "text-stone-500 hover:text-stone-800"
              }`}
              title="Preview invitation as Reception-Only Guest"
            >
              Reception Only
            </button>
          </div>

          <button
            type="button"
            onClick={triggerReplay}
            className="inline-flex items-center gap-1 rounded-xl border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
            title="Replay seal reveal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Replay Reveal</span>
          </button>
        </div>
      </div>

      {/* Scrollable Preview Viewport */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex justify-center items-start">
        <div
          className={`relative overflow-hidden ${frameClasses}`}
          style={{
            height: previewDevice === "mobile" ? "760px" : "calc(100vh - 150px)",
          }}
        >
          {/* Single persistent container tree so toggling Mobile/Tablet/Desktop never unmounts InvitationPlayer */}
          <div
            className={
              isPresentationMode
                ? "relative h-full w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden"
                : "h-full w-full"
            }
          >
            {isPresentationMode && (
              <>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    backgroundColor: "#100E0C",
                    backgroundImage: `radial-gradient(circle at 22% 24%, ${designData.theme.palette.primary}66 0%, transparent 50%), radial-gradient(circle at 78% 72%, ${designData.theme.palette.accent}3D 0%, transparent 52%), radial-gradient(circle at 50% 50%, #1F1B17 0%, #090807 100%)`,
                  }}
                />
                {ambientPhotoUrl && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={ambientPhotoUrl}
                    alt=""
                    className="pointer-events-none absolute inset-0 w-full h-full object-cover filter blur-xl opacity-30 scale-105"
                  />
                )}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-black/45"
                />
              </>
            )}

            {isPresentationMode && previewDevice === "desktop" && (
              <div className="hidden xl:flex flex-col gap-2 w-44 mr-5 text-left relative z-10 select-none">
                <div className="rounded-xl bg-white/[0.06] backdrop-blur-md border border-white/12 p-3.5 text-stone-200">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-amber-300">
                    Save The Date
                  </span>
                  <p className="mt-1 text-sm font-serif font-semibold text-white line-clamp-2">
                    {designData.content.headline}
                  </p>
                  <p className="mt-1 text-[10px] text-stone-400">
                    Desktop Overview Wing
                  </p>
                </div>
              </div>
            )}

            <div
              key="studio-card-slot"
              className={
                isPresentationMode
                  ? "relative z-10 w-full max-w-[400px] h-full rounded-[24px] overflow-hidden border border-white/15 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.8)]"
                  : "h-full w-full"
              }
            >
              <InvitationPlayer
                eventId={eventMeta.id}
                slug={eventMeta.slug}
                title={eventMeta.title}
                eventType={eventMeta.event_type}
                eventDate={eventMeta.event_date}
                venueName={eventMeta.venue_name}
                venueAddress={eventMeta.venue_address}
                venueMapUrl={eventMeta.venue_map_url}
                audioUrl={eventMeta.audio_url}
                designData={designData}
                guestAccess={previewGuestTier}
                isStudioPreview
                bounded
                forcedStage={previewStage}
                replayKey={replayCounter}
              />
            </div>

            {isPresentationMode && previewDevice === "desktop" && (
              <div className="hidden xl:flex flex-col gap-2 w-44 ml-5 text-left relative z-10 select-none">
                <div className="rounded-xl bg-white/[0.06] backdrop-blur-md border border-white/12 p-3.5 text-stone-200">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-amber-300">
                    Concierge
                  </span>
                  <p className="mt-1 text-xs font-medium text-white line-clamp-1">
                    {eventMeta.venue_name || "Venue Preview"}
                  </p>
                  <p className="mt-1 text-[10px] text-stone-400">
                    Quick RSVP · Maps · Audio
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
