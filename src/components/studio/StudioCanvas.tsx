"use client";

import { motion } from "framer-motion";
import { Monitor, RotateCcw, Smartphone, Tablet } from "lucide-react";
import { useStudioStore } from "@/store/useStudioStore";
import { InvitationPlayer } from "@/components/invitation/InvitationPlayer";

export function StudioCanvas() {
  const {
    eventMeta,
    designData,
    previewDevice,
    previewStage,
    replayCounter,
    setPreviewDevice,
    setPreviewStage,
    triggerReplay,
  } = useStudioStore();

  const frameClasses =
    previewDevice === "mobile"
      ? "w-[390px] max-w-full rounded-[44px] border-[10px] border-stone-900 shadow-[0_28px_70px_-15px_rgba(24,20,15,0.45)] ring-1 ring-amber-200/30"
      : previewDevice === "tablet"
        ? "w-[700px] max-w-full rounded-[28px] border-[8px] border-stone-800 shadow-[0_24px_60px_-15px_rgba(24,20,15,0.35)]"
        : "w-full max-w-4xl rounded-2xl border border-stone-300 shadow-xl";

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
                className={`relative inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                  active
                    ? "text-stone-900"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="studio-device-pill"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
                    className="absolute inset-0 rounded-lg bg-white shadow-xs"
                  />
                )}
                <Icon className="relative z-10 w-3.5 h-3.5" />
                <span className="relative z-10 hidden sm:inline">
                  {dev.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl bg-stone-100 p-1 text-xs">
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
                  className={`relative rounded-lg px-2.5 py-1 font-medium cursor-pointer transition ${
                    active ? "text-stone-900" : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="studio-stage-pill"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
                      className="absolute inset-0 rounded-lg bg-white shadow-xs"
                    />
                  )}
                  <span className="relative z-10">{stage.label}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={triggerReplay}
            className="inline-flex items-center gap-1 rounded-xl border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 transition cursor-pointer"
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
          className={`bg-white overflow-y-auto overflow-x-hidden transition-all duration-300 ${frameClasses}`}
          style={{
            height: previewDevice === "mobile" ? "760px" : "calc(100vh - 150px)",
          }}
        >
          <InvitationPlayer
            eventId={eventMeta.id}
            slug={eventMeta.slug}
            title={eventMeta.title}
            eventDate={eventMeta.event_date}
            venueName={eventMeta.venue_name}
            venueAddress={eventMeta.venue_address}
            venueMapUrl={eventMeta.venue_map_url}
            audioUrl={eventMeta.audio_url}
            designData={designData}
            isStudioPreview
            forcedStage={previewStage}
            replayKey={replayCounter}
          />
        </div>
      </div>
    </div>
  );
}
