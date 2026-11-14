"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Lock, Monitor, RotateCcw, Smartphone, Tablet } from "lucide-react";
import { useStudioStore } from "@/store/useStudioStore";
import { resolveCardBackdropUrl } from "@/lib/templates/presets";
import { InvitationPlayer } from "@/components/invitation/InvitationPlayer";

const DEVICE_SPECS = {
  mobile: {
    width: 390,
    height: 760,
  },
  tablet: {
    width: 720,
    height: 880,
  },
  desktop: {
    width: 1060,
    height: 700,
  },
} as const;

export const StudioCanvas = memo(function StudioCanvas() {
  const eventMeta = useStudioStore((s) => s.eventMeta);
  const designData = useStudioStore((s) => s.designData);
  const previewDevice = useStudioStore((s) => s.previewDevice);
  const previewStage = useStudioStore((s) => s.previewStage);
  const replayCounter = useStudioStore((s) => s.replayCounter);
  const setPreviewDevice = useStudioStore((s) => s.setPreviewDevice);
  const setPreviewStage = useStudioStore((s) => s.setPreviewStage);
  const triggerReplay = useStudioStore((s) => s.triggerReplay);

  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportSize, setViewportSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const updateSize = () => {
      if (el) {
        setViewportSize({
          width: el.clientWidth,
          height: el.clientHeight,
        });
      }
    };

    updateSize();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(() => updateSize());
      observer.observe(el);
      return () => observer.disconnect();
    }
  }, []);

  const currentSpec = DEVICE_SPECS[previewDevice];

  const computedScale = useMemo(() => {
    if (!viewportSize.width || !viewportSize.height) return 1;

    // Buffer to leave comfortable breathing room inside canvas
    const paddingX = viewportSize.width < 640 ? 16 : 32;
    const paddingY = viewportSize.height < 640 ? 16 : 32;

    const availableWidth = Math.max(100, viewportSize.width - paddingX);
    const availableHeight = Math.max(120, viewportSize.height - paddingY);

    const scaleByW = availableWidth / currentSpec.width;
    const scaleByH = availableHeight / currentSpec.height;

    // Scale so that device chassis fits within both available width and height
    const fit = Math.min(scaleByW, scaleByH);

    // Don't upscale past 1.0; clamp minimum to 0.35
    return Math.min(1, Math.max(0.35, Number(fit.toFixed(3))));
  }, [currentSpec, viewportSize]);

  const isScaled = computedScale !== 1;
  const isPresentationMode = previewDevice !== "mobile";
  const ambientPhotoUrl =
    designData.content.heroImageUrl ||
    designData.content.couple.brideImageUrl ||
    designData.content.gallery[0]?.url ||
    resolveCardBackdropUrl(designData.theme.cardArt) ||
    null;

  const frameClasses =
    previewDevice === "mobile"
      ? "w-[390px] rounded-[44px] border-[10px] border-stone-900 shadow-[0_28px_70px_-15px_rgba(24,20,15,0.45)] ring-1 ring-amber-200/30 bg-white"
      : previewDevice === "tablet"
        ? "w-[720px] rounded-[36px] border-[12px] border-stone-800 shadow-[0_28px_70px_-15px_rgba(24,20,15,0.5)] ring-1 ring-amber-200/20 bg-[#100E0C]"
        : "w-[1060px] rounded-2xl border border-stone-700 shadow-2xl bg-[#100E0C] flex flex-col";

  return (
    <div className="flex-1 drafting-grid flex flex-col overflow-hidden">
      {/* Canvas Device & Stage Controls */}
      <div className="h-12 border-b border-stone-200/90 bg-white/85 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between gap-1.5 sm:gap-2 shrink-0">
        {/* Device Switcher (Mobile/Tablet/Desktop): only shown on desktop/tablet screens */}
        <div className="hidden md:flex items-center gap-1 rounded-xl bg-stone-100 p-1">
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
                className={`inline-flex items-center gap-1.5 rounded-lg px-2 sm:px-2.5 py-1 text-xs font-medium transition-colors duration-150 cursor-pointer ${
                  active
                    ? "bg-white text-stone-900 shadow-xs font-semibold"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{dev.label}</span>
              </button>
            );
          })}
        </div>

        {/* Stage & Replay Controls */}
        <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-1.5 sm:gap-2">
          <div className="flex items-center gap-0.5 rounded-xl bg-stone-100 p-1 text-xs shrink-0">
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
                  className={`rounded-lg px-2.5 sm:px-2.5 py-1 text-xs font-medium cursor-pointer transition-colors duration-150 ${
                    active
                      ? "bg-white text-stone-900 shadow-xs font-semibold"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  {stage.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={triggerReplay}
            className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-2.5 sm:px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer shrink-0"
            title="Replay seal reveal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-xs">Replay</span>
          </button>
        </div>
      </div>

      {/* Scrollable / Interactive Preview Viewport */}
      <div
        ref={viewportRef}
        className="flex-1 overflow-auto p-2 sm:p-5 flex items-center justify-center relative select-none"
      >
        <div
          style={{
            width: `${Math.round(currentSpec.width * computedScale)}px`,
            height: `${Math.round(currentSpec.height * computedScale)}px`,
          }}
          className="relative shrink-0 flex items-center justify-center transition-[width,height] duration-200 ease-out"
        >
          <div
            className={`overflow-hidden shrink-0 ${frameClasses} absolute top-0 left-0`}
            style={{
              width: `${currentSpec.width}px`,
              height: `${currentSpec.height}px`,
              transform: isScaled ? `scale(${computedScale})` : undefined,
              transformOrigin: "top left",
              transition: "transform 200ms ease-out",
            }}
          >
            {/* Mobile dynamic island notch */}
            {previewDevice === "mobile" && (
              <div
                aria-hidden="true"
                className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-4 bg-stone-900 rounded-full z-40 pointer-events-none"
              />
            )}

            {/* Tablet camera dot */}
            {previewDevice === "tablet" && (
              <div
                aria-hidden="true"
                className="absolute top-2.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-stone-900 rounded-full border border-stone-700/60 z-40 pointer-events-none"
              />
            )}

            {/* Desktop macOS Browser Window Bar */}
            {previewDevice === "desktop" && (
              <div className="h-9 bg-stone-900/90 border-b border-white/10 px-4 flex items-center justify-between shrink-0 select-none z-30">
                <div className="flex items-center gap-1.5 w-16">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3.5 py-1 text-[11px] text-stone-300 border border-white/10 w-64 justify-center">
                  <Lock className="w-2.5 h-2.5 text-stone-400 shrink-0" />
                  <span className="font-mono text-[10px] text-stone-300 truncate">
                    invitovix.com/e/{eventMeta.slug || "wedding"}
                  </span>
                </div>
                <div className="w-16" />
              </div>
            )}

            {/* Device Body Container */}
            <div
              className={
                previewDevice === "mobile"
                  ? "h-full w-full"
                  : previewDevice === "tablet"
                    ? "relative h-full w-full flex items-center justify-center p-6 overflow-hidden"
                    : "flex-1 flex items-center justify-center p-4 overflow-hidden relative"
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

              {/* Desktop Left Companion Wing */}
              {previewDevice === "desktop" && (
                <div className="hidden xl:flex flex-col gap-2 w-48 mr-4 text-left relative z-10 select-none shrink-0">
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

              {/* Center Invitation Stationery Slot */}
              <div
                key="studio-card-slot"
                className={
                  previewDevice === "mobile"
                    ? "h-full w-full"
                    : previewDevice === "tablet"
                      ? "relative z-10 w-full max-w-[400px] h-[760px] rounded-[24px] overflow-hidden border border-white/15 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.8)] shrink-0"
                      : "relative z-10 w-full max-w-[400px] h-[610px] rounded-[24px] overflow-hidden border border-white/15 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.8)] shrink-0"
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
                  isStudioPreview
                  bounded
                  forcedStage={previewStage}
                  replayKey={replayCounter}
                />
              </div>

              {/* Desktop Right Companion Wing */}
              {previewDevice === "desktop" && (
                <div className="hidden xl:flex flex-col gap-2 w-48 ml-4 text-left relative z-10 select-none shrink-0">
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
    </div>
  );
});
