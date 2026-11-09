"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Volume2, VolumeX } from "lucide-react";
import { EventDesignData } from "@/types/invitation";
import { audioEngine } from "@/lib/audio/audioEngine";
import { getPaperTextureClass } from "@/lib/utils/fonts";
import { EnvelopeStage } from "./EnvelopeStage";
import { ParticleLayer } from "./ParticleLayer";
import { HeroScene } from "./scenes/HeroScene";
import { StoryCountdownScene } from "./scenes/StoryCountdownScene";
import { ItineraryScene } from "./scenes/ItineraryScene";
import { VenueScene } from "./scenes/VenueScene";
import { GalleryScene } from "./scenes/GalleryScene";
import { RsvpScene } from "./scenes/RsvpScene";

interface InvitationPlayerProps {
  eventId: string;
  slug: string;
  title: string;
  eventDate: string;
  venueName: string;
  venueAddress?: string | null;
  venueMapUrl?: string | null;
  audioUrl?: string | null;
  designData: EventDesignData;
  isStudioPreview?: boolean;
  forcedStage?: "sealed" | "opened";
  replayKey?: number;
}

export function InvitationPlayer({
  eventId,
  slug,
  title,
  eventDate,
  venueName,
  venueAddress,
  venueMapUrl,
  audioUrl,
  designData,
  isStudioPreview = false,
  forcedStage,
  replayKey = 0,
}: InvitationPlayerProps) {
  const [stage, setStage] = useState<"sealed" | "opening" | "opened">(
    forcedStage ?? "sealed"
  );
  const [startMuted, setStartMuted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Sync stage when controlled by Studio toolbar
  useEffect(() => {
    if (forcedStage) {
      setStage(forcedStage);
    }
  }, [forcedStage, replayKey]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      audioEngine.stopAndUnload();
    };
  }, []);

  function handleUnseal() {
    if (stage !== "sealed") return;

    // Synchronous audio unlock inside user gesture handler
    if (designData.audio.enabled && !startMuted) {
      const resolvedSrc =
        audioUrl && designData.audio.trackId === "custom"
          ? audioUrl
          : audioEngine.resolveSource(designData.audio);
      if (resolvedSrc) {
        audioEngine.setMuted(false);
        setIsMuted(false);
        audioEngine.unlockAndPlay(resolvedSrc, designData.audio.volume);
      }
    } else {
      setIsMuted(true);
      audioEngine.setMuted(true);
    }

    setStage("opening");
    setTimeout(() => {
      setStage("opened");
    }, 1250);
  }

  function handleToggleMute() {
    if (!designData.audio.enabled) return;
    const nextMuted = audioEngine.toggleMute();
    setIsMuted(nextMuted);

    // If user opened silently and now unmutes, start audio on this click gesture
    if (!nextMuted) {
      const resolvedSrc =
        audioUrl && designData.audio.trackId === "custom"
          ? audioUrl
          : audioEngine.resolveSource(designData.audio);
      if (resolvedSrc) {
        audioEngine.unlockAndPlay(resolvedSrc, designData.audio.volume);
      }
    }
  }

  function handleReplay() {
    audioEngine.stopAndUnload();
    setStage("sealed");
  }

  const { theme, motion: motionCfg } = designData;
  const textureClass = getPaperTextureClass(theme.paperTexture);

  return (
    <div
      className={`relative min-h-screen w-full overflow-x-hidden ${textureClass}`}
      style={{
        backgroundColor: theme.palette.background,
        color: theme.palette.text,
      }}
    >
      <AnimatePresence mode="wait">
        {stage !== "opened" ? (
          <motion.div
            key="envelope-view"
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.45 }}
            className="min-h-screen flex flex-col"
          >
            <EnvelopeStage
              designData={designData}
              eventDate={eventDate}
              stage={stage}
              startMuted={startMuted}
              onToggleStartMuted={() => setStartMuted((m) => !m)}
              onUnseal={handleUnseal}
            />
          </motion.div>
        ) : (
          <motion.div
            key="card-view"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="relative min-h-screen"
          >
            <ParticleLayer
              kind={motionCfg.particles}
              accentColor={theme.palette.accent}
              primaryColor={theme.palette.primary}
            />

            {/* Subtle top accent border */}
            <div
              aria-hidden="true"
              className="h-1.5 w-full"
              style={{
                background: `linear-gradient(90deg, ${theme.palette.primary}, ${theme.palette.accent}, ${theme.palette.primary})`,
              }}
            />

            <div className="relative z-20">
              <HeroScene
                designData={designData}
                eventDate={eventDate}
                venueName={venueName}
              />

              <StoryCountdownScene
                designData={designData}
                eventDate={eventDate}
              />

              <ItineraryScene designData={designData} />

              <VenueScene
                designData={designData}
                title={title}
                slug={slug}
                eventDate={eventDate}
                venueName={venueName}
                venueAddress={venueAddress}
                venueMapUrl={venueMapUrl}
              />

              <GalleryScene
                designData={designData}
                isStudioPreview={isStudioPreview}
              />

              <RsvpScene
                eventId={eventId}
                designData={designData}
                isStudioPreview={isStudioPreview}
              />

              <footer
                className="pb-20 pt-4 text-center text-[11px] uppercase tracking-[0.22em] opacity-65"
                style={{ color: theme.palette.mutedText }}
              >
                Powered by Invitovix
              </footer>
            </div>

            {/* Persistent Audio & Replay Floating Micro-Bar */}
            <div
              className={`${
                isStudioPreview ? "sticky bottom-4" : "fixed bottom-4"
              } right-4 z-40 flex items-center justify-end gap-2 px-4 pointer-events-none`}
            >
              <button
                type="button"
                onClick={handleReplay}
                className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium backdrop-blur-md border shadow-lg transition hover:scale-105 cursor-pointer"
                style={{
                  backgroundColor: `${theme.palette.surface}E6`,
                  borderColor: `${theme.palette.accent}55`,
                  color: theme.palette.text,
                }}
                title="Replay envelope reveal"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Replay</span>
              </button>

              {designData.audio.enabled && (
                <button
                  type="button"
                  onClick={handleToggleMute}
                  className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium backdrop-blur-md border shadow-lg transition hover:scale-105 cursor-pointer"
                  style={{
                    backgroundColor: `${theme.palette.surface}E6`,
                    borderColor: `${theme.palette.accent}55`,
                    color: theme.palette.text,
                  }}
                  aria-label={isMuted ? "Unmute music" : "Mute music"}
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Muted</span>
                    </>
                  ) : (
                    <>
                      <Volume2
                        className="w-3.5 h-3.5 animate-pulse"
                        style={{ color: theme.palette.accent }}
                      />
                      <span>{designData.audio.trackTitle}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

