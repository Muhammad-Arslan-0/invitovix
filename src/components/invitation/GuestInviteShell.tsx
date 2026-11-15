"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  CalendarPlus,
  CheckCircle2,
  Compass,
  Download,
  ExternalLink,
  MapPin,
  Music2,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import { EventDesignData } from "@/types/invitation";
import {
  buildGoogleCalendarUrl,
  buildMapsUrl,
  downloadIcsFile,
} from "@/lib/utils/calendar";
import {
  buildOsmLinkUrl,
  parseCoordinatesFromMapUrl,
} from "@/lib/utils/location";
import { getContrastTextColor } from "@/lib/utils/colors";
import {
  getBodyFontFamily,
  getDisplayFontFamily,
  getScriptFontFamily,
} from "@/lib/utils/fonts";
import {
  formatCategoryBadge,
  resolveSubtitle,
} from "@/lib/templates/categories";
import { resolveCardBackdropUrl } from "@/lib/templates/presets";
import { useCountdown } from "@/hooks/useCountdown";
import { VenuePreviewMap } from "@/components/maps/VenuePreviewMap";
import {
  CardLanguageProvider,
  useCardLanguage,
} from "@/lib/i18n/CardLanguageContext";
import { LanguageSelector } from "./LanguageSelector";
import {
  InvitationPlaybackSnapshot,
  InvitationPlayer,
  InvitationPlayerHandle,
} from "./InvitationPlayer";
import { InvitationSectionId } from "./InvitationBottomNav";

interface GuestInviteShellProps {
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
  guestAccess?: string | null;
  isOwnerDraft?: boolean;
  initialLang?: string | null;
}

function GuestInviteShellInner({
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
  guestAccess,
  isOwnerDraft = false,
}: GuestInviteShellProps) {
  const {
    t,
    isRTL,
    language,
    formatDate,
    formatTime,
    translatedDesignData,
    translatedVenueName,
    translatedVenueAddress,
  } = useCardLanguage();

  const effectiveDesignData =
    translatedDesignData?.theme?.palette ? translatedDesignData : designData;
  const effectiveVenueName = translatedVenueName || venueName;
  const effectiveVenueAddress = translatedVenueAddress || venueAddress;

  const playerRef = useRef<InvitationPlayerHandle | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isWidescreen, setIsWidescreen] = useState(false);
  const [playback, setPlayback] = useState<InvitationPlaybackSnapshot>({
    stage: "sealed",
    isMuted: false,
  });

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const mq = window.matchMedia("(min-width: 1200px)");
    const sync = () => setIsWidescreen(mq.matches);
    sync();
    mq.addEventListener?.("change", sync);
    return () => mq.removeEventListener?.("change", sync);
  }, []);

  const handlePlaybackChange = useCallback(
    (snapshot: InvitationPlaybackSnapshot) => {
      setPlayback(snapshot);
    },
    []
  );

  const countdown = useCountdown(eventDate);

  const { theme, content, sections, audio } = effectiveDesignData;
  const ambientPhotoUrl =
    content.heroImageUrl ||
    content.couple.brideImageUrl ||
    content.gallery[0]?.url ||
    resolveCardBackdropUrl(theme.cardArt) ||
    null;
  const coords = parseCoordinatesFromMapUrl(venueMapUrl);
  const mapsUrl = buildMapsUrl(effectiveVenueName, effectiveVenueAddress, venueMapUrl);
  const osmUrl = coords ? buildOsmLinkUrl(coords.lat, coords.lng) : null;
  const accentBtnText = getContrastTextColor(theme.palette.accent);

  const effectiveSubtitle = resolveSubtitle(
    content.subtitle,
    content.itinerary,
    eventType
  );

  const calendarInput = {
    title: content.headline || title,
    startDateIso: eventDate,
    durationHours: 4,
    venueName: effectiveVenueName,
    venueAddress: effectiveVenueAddress,
    description: effectiveSubtitle,
    url:
      mounted && typeof window !== "undefined"
        ? `${window.location.origin}/e/${slug}`
        : undefined,
  };
  const googleCalUrl = buildGoogleCalendarUrl(calendarInput);

  const validDate = !Number.isNaN(new Date(eventDate).getTime());
  const dateDisplay = validDate
    ? formatDate(eventDate, {
        weekday: "short",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : t("saveTheDate");
  const timeDisplay = validDate
    ? formatTime(eventDate, {
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

  const handleWingNavigate = (sectionId: InvitationSectionId) => {
    playerRef.current?.navigateToSection(sectionId);
  };

  const handleWingAudioToggle = () => {
    if (playback.stage === "sealed") {
      playerRef.current?.unseal();
      return;
    }
    playerRef.current?.toggleMute();
  };

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      lang={language}
      className={`relative h-[100dvh] w-full overflow-hidden md:bg-[#100E0C] md:text-stone-100 flex flex-col ${
        language === "ur" ? "font-nastaleeq" : ""
      }`}
      data-testid="guest-invite-shell"
    >
      {/* 1. Desktop & Tablet Ambient Blurred Backdrop (hidden on Mobile < 768px) */}
      <div
        aria-hidden="true"
        data-testid="desktop-ambient-backdrop"
        className="fixed inset-0 hidden md:block pointer-events-none overflow-hidden"
      >
        <div
          className="absolute inset-0 animate-ambient-drift"
          style={{
            backgroundColor: "#100E0C",
            backgroundImage: `radial-gradient(circle at 20% 25%, ${theme.palette.primary}6B 0%, transparent 50%), radial-gradient(circle at 82% 74%, ${theme.palette.accent}3D 0%, transparent 52%), radial-gradient(circle at 50% 45%, #1E1915 0%, #090807 100%)`,
          }}
        />
        {ambientPhotoUrl && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={ambientPhotoUrl}
            alt=""
            style={{ objectPosition: "top center" }}
            className="absolute inset-0 w-full h-full object-cover object-top filter blur-3xl opacity-35 scale-105 transition-all duration-1000"
          />
        )}
        <div className="absolute inset-0 bg-black/48" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* Optional Owner Draft Banner */}
      {isOwnerDraft && (
        <div className="relative z-40 shrink-0 w-full bg-amber-950/95 backdrop-blur-md border-b border-amber-800/50 text-amber-100 px-4 py-2 text-center text-xs flex items-center justify-center gap-3 shadow-sm">
          <span>
            <strong>Draft Preview:</strong> Only visible to you. Publish in
            Creator Studio to share with guests.
          </span>
          <Link
            href={`/studio/${eventId}`}
            className="underline underline-offset-2 font-semibold hover:text-white"
          >
            Back to Studio
          </Link>
        </div>
      )}

      {/* 2. Dual-Viewport Presentation Stage */}
      <div className="relative z-10 flex-1 w-full flex items-center justify-center md:py-6 md:px-4 min-[1200px]:px-6 overflow-hidden">
        {/* Left Companion Wing (>= 1200px Desktop) */}
        <aside
          aria-label="Event Overview"
          data-testid="desktop-left-wing"
          className="hidden min-[1200px]:flex flex-col gap-4 w-60 min-[1360px]:w-72 shrink-0 min-[1200px]:mr-6 min-[1360px]:mr-8 max-h-[min(850px,calc(100dvh-3.5rem))] overflow-y-auto no-scrollbar"
        >
          <div className="rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/12 p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] tracking-[0.22em] uppercase text-amber-300/90 font-semibold">
                {t("saveTheDate")}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-400/15 text-amber-200 border border-amber-400/30">
                <Sparkles className="w-2.5 h-2.5" />
                {formatCategoryBadge(eventType)}
              </span>
            </div>

            <p
              className="mt-3 text-[11px] uppercase tracking-[0.18em] text-stone-400 line-clamp-2"
              style={{ fontFamily: getBodyFontFamily(theme.typography.bodyFont, language) }}
            >
              {content.hostLine}
            </p>
            <h2
              className="mt-1.5 text-2xl font-semibold text-white leading-tight"
              style={{
                fontFamily: getDisplayFontFamily(theme.typography.displayFont, language),
              }}
            >
              {content.headline}
            </h2>
            {effectiveSubtitle && (
              <p
                className="mt-1.5 text-sm text-amber-200/85 leading-snug line-clamp-2"
                style={{
                  fontFamily: getScriptFontFamily(theme.typography.scriptFont, language),
                }}
              >
                {effectiveSubtitle}
              </p>
            )}

            <div className="mt-4 pt-4 border-t border-white/10 space-y-1 text-xs">
              <p className="font-medium text-stone-100">{dateDisplay}</p>
              {timeDisplay && <p className="text-stone-400">{timeDisplay}</p>}
            </div>

            {sections.showCountdown && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-2">
                  {countdown.isPast ? t("eventStatus") : t("countdown")}
                </p>
                {countdown.isPast ? (
                  <p className="text-xs font-medium text-amber-200">
                    {t("celebrationUnderway")}
                  </p>
                ) : (
                  <div className="grid grid-cols-4 gap-1.5 text-center">
                    {[
                      { label: t("days"), val: countdown.days },
                      { label: t("hrs"), val: countdown.hours },
                      { label: t("min"), val: countdown.minutes },
                      { label: t("sec"), val: countdown.seconds },
                    ].map((unit) => (
                      <div
                        key={unit.label}
                        className="rounded-xl bg-black/30 border border-white/10 py-2 px-1"
                      >
                        <div className="text-sm font-semibold tabular-nums text-white">
                          {String(unit.val).padStart(2, "0")}
                        </div>
                        <div className="text-[9px] uppercase tracking-wider text-stone-400">
                          {unit.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Language Selector in Left Companion Wing */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <LanguageSelector variant="wing" />
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-2">
              <a
                href={googleCalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-2.5 py-2 text-[11px] font-medium text-stone-100 transition"
              >
                <CalendarPlus className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>{t("googleCal")}</span>
              </a>
              <button
                type="button"
                onClick={() =>
                  downloadIcsFile(calendarInput, `${slug || "event"}.ics`)
                }
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-2.5 py-2 text-[11px] font-medium text-stone-100 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>{t("ics")}</span>
              </button>
            </div>
          </div>
        </aside>

        {/* 3. Center Interactive Stationery Viewport (<768px Full-Bleed | >=768px Framed) */}
        <main
          aria-label="Interactive Invitation"
          data-testid="guest-card-frame"
          className="relative w-full md:w-[410px] lg:w-[420px] shrink-0 h-full md:min-h-[640px] md:h-[min(850px,calc(100dvh-3.5rem))] md:rounded-[28px] overflow-hidden md:border md:border-white/15 md:shadow-[0_32px_90px_-14px_rgba(0,0,0,0.8)]"
        >
          {/* Subtle top specular bezel glint on desktop/tablet */}
          <div
            aria-hidden="true"
            className="hidden md:block pointer-events-none absolute inset-x-0 top-0 h-px z-50 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />

          <InvitationPlayer
            ref={playerRef}
            eventId={eventId}
            slug={slug}
            title={title}
            eventType={eventType}
            eventDate={eventDate}
            venueName={effectiveVenueName}
            venueAddress={effectiveVenueAddress}
            venueMapUrl={venueMapUrl}
            audioUrl={audioUrl}
            designData={effectiveDesignData}
            guestAccess={guestAccess}
            hasDraftBanner={isOwnerDraft}
            bounded
            onPlaybackChange={handlePlaybackChange}
          />
        </main>

        {/* Right Companion Wing (>= 1200px Desktop) */}
        <aside
          aria-label="Quick Actions & Venue"
          data-testid="desktop-right-wing"
          className="hidden min-[1200px]:flex flex-col gap-4 w-60 min-[1360px]:w-72 shrink-0 min-[1200px]:ml-6 min-[1360px]:ml-8 max-h-[min(850px,calc(100dvh-3.5rem))] overflow-y-auto no-scrollbar"
        >
          {/* Concierge Quick RSVP & Venue Snippet */}
          <div className="rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/12 p-5 shadow-2xl space-y-4">
            {sections.showRsvp && (
              <div>
                <p className="text-[10px] tracking-[0.22em] uppercase text-amber-300/90 font-semibold">
                  {t("concierge")}
                </p>
                <button
                  type="button"
                  onClick={() => handleWingNavigate("invite-rsvp")}
                  style={{
                    backgroundColor: theme.palette.accent,
                    color: accentBtnText,
                  }}
                  className="mt-2.5 w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold shadow-lg transition hover:opacity-95 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    {playback.stage === "opened" ? t("quickRsvp") : t("openAndRsvp")}
                  </span>
                </button>
              </div>
            )}

            {sections.showVenue && (
              <div
                className={
                  sections.showRsvp ? "pt-4 border-t border-white/10" : ""
                }
              >
                <p className="text-[10px] tracking-[0.22em] uppercase text-stone-400 font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-amber-300" />
                  <span>{t("location")}</span>
                </p>
                <h3 className="mt-1.5 text-sm font-semibold text-white leading-snug">
                  {effectiveVenueName}
                </h3>
                {effectiveVenueAddress && (
                  <p className="mt-1 text-xs text-stone-400 leading-relaxed line-clamp-2">
                    {effectiveVenueAddress}
                  </p>
                )}

                {isWidescreen && coords && (
                  <div className="mt-3">
                    <VenuePreviewMap
                      coordinates={coords}
                      venueName={effectiveVenueName}
                      pinColor={theme.palette.primary}
                      accentColor={theme.palette.accent}
                      heightClass="h-28"
                    />
                  </div>
                )}

                <div className="mt-3 flex flex-col gap-2">
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 px-3 py-2 text-xs font-medium text-white transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span>{t("openInGoogleMaps")}</span>
                  </a>
                  {osmUrl && (
                    <button
                      type="button"
                      onClick={() => handleWingNavigate("invite-venue")}
                      className="inline-flex items-center justify-center gap-1.5 text-[11px] text-stone-300 hover:text-amber-200 transition cursor-pointer"
                    >
                      <Compass className="w-3 h-3" />
                      <span>{t("inspectVenueInsideCard")}</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Audio Track & Replay Control Card */}
          <div className="rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/12 p-4 shadow-2xl">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
                  <Music2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-stone-400">
                    {audio.enabled ? t("soundtrack") : t("presentation")}
                  </p>
                  <p className="text-xs font-medium text-white truncate">
                    {audio.enabled ? audio.trackTitle : t("silentMode")}
                  </p>
                </div>
              </div>

              {audio.enabled && (
                <button
                  type="button"
                  onClick={handleWingAudioToggle}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/10 hover:bg-white/15 px-2.5 py-1.5 text-[11px] font-medium text-white transition cursor-pointer shrink-0"
                  aria-label={
                    playback.stage === "sealed"
                      ? t("play")
                      : playback.isMuted
                        ? t("unmuteSoundtrack")
                        : t("muteSoundtrack")
                  }
                >
                  {playback.stage !== "opened" ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                      <span>{t("play")}</span>
                    </>
                  ) : playback.isMuted ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                      <span>{t("muted")}</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                      <span>{t("playing")}</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {playback.stage === "opened" && (
              <button
                type="button"
                onClick={() => playerRef.current?.replay()}
                className="mt-3 pt-3 border-t border-white/10 w-full inline-flex items-center justify-center gap-1.5 text-[11px] text-stone-300 hover:text-white transition cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t("replayWaxSeal")}</span>
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export function GuestInviteShell(props: GuestInviteShellProps) {
  return (
    <CardLanguageProvider
      initialDesignData={props.designData}
      venueName={props.venueName}
      venueAddress={props.venueAddress}
      initialLang={props.initialLang}
    >
      <GuestInviteShellInner {...props} />
    </CardLanguageProvider>
  );
}
