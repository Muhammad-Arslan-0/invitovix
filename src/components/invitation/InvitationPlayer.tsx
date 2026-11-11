"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EventDesignData } from "@/types/invitation";
import { audioEngine } from "@/lib/audio/audioEngine";
import { getPaperTextureClass } from "@/lib/utils/fonts";
import { EnvelopeStage } from "./EnvelopeStage";
import { ParticleLayer } from "./ParticleLayer";
import { FloatingAudioDisc } from "./FloatingAudioDisc";
import { CardArtBackdrop } from "./CardArtBackdrop";
import { CardHeaderCrown, CardOrnamentFrame } from "./CardOrnamentFrame";
import {
  InvitationBottomNav,
  InvitationSectionId,
} from "./InvitationBottomNav";
import { HeroScene } from "./scenes/HeroScene";
import { CoupleScene } from "./scenes/CoupleScene";
import { StoryCountdownScene } from "./scenes/StoryCountdownScene";
import { ItineraryScene } from "./scenes/ItineraryScene";
import { VenueScene } from "./scenes/VenueScene";
import { GalleryScene } from "./scenes/GalleryScene";
import { RsvpScene } from "./scenes/RsvpScene";

export interface InvitationPlaybackSnapshot {
  stage: "sealed" | "opening" | "opened";
  isMuted: boolean;
}

export interface InvitationPlayerHandle {
  unseal: () => void;
  toggleMute: () => void;
  replay: () => void;
  navigateToSection: (sectionId: InvitationSectionId) => void;
}

interface InvitationPlayerProps {
  eventId: string;
  slug: string;
  title: string;
  eventType?: string;
  eventDate: string;
  venueName: string;
  venueAddress?: string | null;
  venueMapUrl?: string | null;
  audioUrl?: string | null;
  designData: EventDesignData;
  isStudioPreview?: boolean;
  forcedStage?: "sealed" | "opened";
  replayKey?: number;
  bounded?: boolean;
  hasDraftBanner?: boolean;
  onPlaybackChange?: (snapshot: InvitationPlaybackSnapshot) => void;
}

export const InvitationPlayer = forwardRef<
  InvitationPlayerHandle,
  InvitationPlayerProps
>(function InvitationPlayer(
  {
    eventId,
    slug,
    title,
    eventType = "wedding",
    eventDate,
    venueName,
    venueAddress,
    venueMapUrl,
    audioUrl,
    designData,
    isStudioPreview = false,
    forcedStage,
    replayKey = 0,
    bounded = false,
    hasDraftBanner = false,
    onPlaybackChange,
  },
  ref
) {
  const [stage, setStage] = useState<"sealed" | "opening" | "opened">(
    forcedStage ?? "sealed"
  );
  const [startMuted, setStartMuted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isDesktopViewport, setIsDesktopViewport] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const pendingSectionRef = useRef<InvitationSectionId | null>(null);

  const isBoundedScroll = bounded || isStudioPreview || isDesktopViewport;

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setIsDesktopViewport(mq.matches);
    sync();
    mq.addEventListener?.("change", sync);
    return () => mq.removeEventListener?.("change", sync);
  }, []);

  // Sync stage when controlled by Studio toolbar
  useEffect(() => {
    if (forcedStage) {
      setStage(forcedStage);
    }
  }, [forcedStage, replayKey]);

  // Notify outer Desktop Studio Presentation Shell of stage / mute updates
  useEffect(() => {
    onPlaybackChange?.({ stage, isMuted });
  }, [stage, isMuted, onPlaybackChange]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      audioEngine.stopAndUnload();
    };
  }, []);

  const scrollToSection = useCallback(
    (sectionId: InvitationSectionId) => {
      const scroller = isBoundedScroll ? scrollContainerRef.current : null;
      const targetEl = scroller
        ? ((scroller.querySelector(`#${sectionId}`) as HTMLElement | null) ??
          document.getElementById(sectionId))
        : document.getElementById(sectionId);
      if (!targetEl) return;

      if (scroller) {
        const offsetTop =
          targetEl.getBoundingClientRect().top -
          scroller.getBoundingClientRect().top +
          scroller.scrollTop -
          52;
        scroller.scrollTo({ top: Math.max(0, offsetTop), behavior: "smooth" });
      } else {
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [isBoundedScroll]
  );

  // Flush queued section jump once the card-view DOM (after AnimatePresence exit) actually mounts
  const flushPendingScroll = useCallback(() => {
    if (!pendingSectionRef.current) return;
    const targetId = pendingSectionRef.current;
    pendingSectionRef.current = null;
    setTimeout(() => {
      scrollToSection(targetId);
    }, 120);
  }, [scrollToSection]);

  const handleUnseal = useCallback(() => {
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
  }, [stage, designData.audio, startMuted, audioUrl]);

  const handleToggleMute = useCallback(() => {
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
  }, [designData.audio, audioUrl]);

  const handleReplay = useCallback(() => {
    audioEngine.stopAndUnload();
    pendingSectionRef.current = null;
    setStage("sealed");
  }, []);

  const navigateToSection = useCallback(
    (sectionId: InvitationSectionId) => {
      if (stage === "opened") {
        scrollToSection(sectionId);
        return;
      }
      pendingSectionRef.current = sectionId;
      if (stage === "sealed") {
        handleUnseal();
      }
    },
    [stage, scrollToSection, handleUnseal]
  );

  useImperativeHandle(
    ref,
    () => ({
      unseal: handleUnseal,
      toggleMute: handleToggleMute,
      replay: handleReplay,
      navigateToSection,
    }),
    [handleUnseal, handleToggleMute, handleReplay, navigateToSection]
  );

  const { theme, motion: motionCfg } = designData;
  const textureClass = getPaperTextureClass(theme.paperTexture);

  return (
    <div
      className={`relative w-full overflow-hidden flex flex-col ${
        bounded ? "h-full" : "min-h-screen md:min-h-0 md:h-full"
      } ${textureClass}`}
      style={{
        backgroundColor: theme.palette.background,
        color: theme.palette.text,
      }}
    >
      <AnimatePresence mode="wait" initial={!isStudioPreview}>
        {stage !== "opened" ? (
          <motion.div
            key="envelope-view"
            exit={{ opacity: 0, scale: isStudioPreview ? 1 : 1.03 }}
            transition={{ duration: isStudioPreview ? 0.08 : 0.45 }}
            className={`flex-1 flex flex-col ${
              bounded
                ? "h-full overflow-y-auto no-scrollbar"
                : "min-h-screen md:min-h-0 md:h-full md:overflow-y-auto no-scrollbar"
            }`}
          >
            <EnvelopeStage
              designData={designData}
              eventDate={eventDate}
              stage={stage}
              startMuted={startMuted}
              onToggleStartMuted={() => setStartMuted((m) => !m)}
              onUnseal={handleUnseal}
              bounded={isBoundedScroll}
            />
          </motion.div>
        ) : (
          <motion.div
            key="card-view"
            initial={isStudioPreview ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: isStudioPreview ? 0.12 : 0.75,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`relative flex-1 flex flex-col ${
              bounded ? "h-full overflow-hidden" : "min-h-screen md:min-h-0 md:h-full md:overflow-hidden"
            }`}
          >
            <CardArtBackdrop theme={theme} bounded={isBoundedScroll} />

            <CardOrnamentFrame theme={theme} bounded={isBoundedScroll} />

            <ParticleLayer
              kind={motionCfg.particles}
              accentColor={theme.palette.accent}
              primaryColor={theme.palette.primary}
            />

            {/* Floating Rotating Music Disc & Replay Control */}
            <FloatingAudioDisc
              designData={designData}
              isMuted={isMuted}
              onToggleMute={handleToggleMute}
              onReplay={handleReplay}
              bounded={bounded}
              hasDraftBanner={hasDraftBanner}
            />

            {/* Scrollable Invitation Scenes Container */}
            <div
              ref={(node) => {
                scrollContainerRef.current = node;
                if (node) {
                  flushPendingScroll();
                }
              }}
              data-testid="invitation-scroll-container"
              className={`relative z-20 flex-1 ${
                bounded
                  ? "overflow-y-auto overflow-x-hidden no-scrollbar"
                  : "md:overflow-y-auto md:overflow-x-hidden no-scrollbar"
              }`}
            >
              {/* Subtle top accent border */}
              <div
                aria-hidden="true"
                className="h-1.5 w-full shrink-0"
                style={{
                  background: `linear-gradient(90deg, ${theme.palette.primary}, ${theme.palette.accent}, ${theme.palette.primary})`,
                }}
              />

              <div className="relative">
                <CardHeaderCrown theme={theme} />
                <HeroScene
                  id="invite-hero"
                  designData={designData}
                  eventType={eventType}
                  eventDate={eventDate}
                  venueName={venueName}
                />
              </div>

              <CoupleScene
                id="invite-couple"
                designData={designData}
                eventType={eventType}
                isStudioPreview={isStudioPreview}
                scrollRootRef={isBoundedScroll ? scrollContainerRef : undefined}
              />

              <StoryCountdownScene
                id="invite-story"
                designData={designData}
                eventDate={eventDate}
                scrollRootRef={isBoundedScroll ? scrollContainerRef : undefined}
              />

              <ItineraryScene
                id="invite-schedule"
                designData={designData}
                eventType={eventType}
                scrollRootRef={isBoundedScroll ? scrollContainerRef : undefined}
              />

              <VenueScene
                id="invite-venue"
                designData={designData}
                title={title}
                slug={slug}
                eventDate={eventDate}
                venueName={venueName}
                venueAddress={venueAddress}
                venueMapUrl={venueMapUrl}
                scrollRootRef={isBoundedScroll ? scrollContainerRef : undefined}
              />

              <GalleryScene
                id="invite-gallery"
                designData={designData}
                eventType={eventType}
                isStudioPreview={isStudioPreview}
                scrollRootRef={isBoundedScroll ? scrollContainerRef : undefined}
              />

              <RsvpScene
                id="invite-rsvp"
                eventId={eventId}
                designData={designData}
                eventType={eventType}
                isStudioPreview={isStudioPreview}
                scrollRootRef={isBoundedScroll ? scrollContainerRef : undefined}
              />

              <footer
                className="pb-24 pt-2 text-center text-[11px] uppercase tracking-[0.22em] opacity-65"
                style={{ color: theme.palette.mutedText }}
              >
                Powered by Invitovix
              </footer>
            </div>

            {/* Sticky Bottom Navigation Dock Anchored Inside Card Frame */}
            <InvitationBottomNav
              designData={designData}
              eventType={eventType}
              isStudioPreview={isStudioPreview}
              bounded={bounded}
              scrollContainerRef={scrollContainerRef}
              isBoundedScroll={isBoundedScroll}
              onSelectSection={scrollToSection}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
