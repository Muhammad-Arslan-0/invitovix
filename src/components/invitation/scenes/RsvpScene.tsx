"use client";

import { useMemo, useState, type RefObject } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Minus, Plus, Send, Sparkles } from "lucide-react";
import {
  AttendingStatus,
  EventDesignData,
  rsvpSubmissionSchema,
} from "@/types/invitation";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { DEMO_EVENT } from "@/lib/templates/presets";
import { getContrastTextColor } from "@/lib/utils/colors";
import {
  getBodyFontFamily,
  getDisplayFontFamily,
} from "@/lib/utils/fonts";
import { getInvitationTypeMeta } from "@/lib/templates/categories";
import { LottieAccent } from "../LottieAccent";

interface RsvpSceneProps {
  id?: string;
  eventId: string;
  designData: EventDesignData;
  eventType?: string;
  guestAccess?: string | null;
  isStudioPreview?: boolean;
  scrollRootRef?: RefObject<HTMLDivElement | null>;
}

export function RsvpScene({
  id = "invite-rsvp",
  eventId,
  designData,
  eventType = "wedding",
  guestAccess: propGuestAccess,
  isStudioPreview = false,
  scrollRootRef,
}: RsvpSceneProps) {
  const { theme, content, sections } = designData;
  const typeMeta = getInvitationTypeMeta(eventType);

  const effectiveAccess = useMemo(() => {
    if (propGuestAccess) return propGuestAccess.toLowerCase();
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const val = sp.get("access") || sp.get("tier") || sp.get("events") || sp.get("invite");
      if (val) return val.toLowerCase();
    }
    return "all";
  }, [propGuestAccess]);

  const isReceptionGuest = effectiveAccess === "reception" || effectiveAccess === "valima";

  const ceremonyOptions = useMemo(() => {
    if (isReceptionGuest) return [];
    const list: string[] = [];
    for (const item of content.itinerary) {
      const label = item.dayLabel?.trim() || item.title?.trim();
      if (label && !list.includes(label)) {
        list.push(label);
      }
    }
    return list;
  }, [content.itinerary, isReceptionGuest]);

  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<AttendingStatus>("attending");
  const [guestsCount, setGuestsCount] = useState(1);
  const [selectedCeremonies, setSelectedCeremonies] = useState<string[]>(() => ceremonyOptions);
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function toggleCeremony(day: string) {
    setSelectedCeremonies((prev) =>
      prev.includes(day)
        ? prev.length > 1
          ? prev.filter((d) => d !== day)
          : prev
        : [...prev, day]
    );
  }

  if (!sections.showRsvp) return null;

  const maxGuests = content.maxGuestsPerParty || 6;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    const eventTag = isReceptionGuest
      ? "[Reception Only]"
      : selectedCeremonies.length > 0 && ceremonyOptions.length > 1
        ? `[Attending: ${selectedCeremonies.join(", ")}]`
        : "";
    const compiledNotes = [eventTag, notes.trim()].filter(Boolean).join(" ");

    const parsed = rsvpSubmissionSchema.safeParse({
      guest_name: guestName,
      email,
      phone,
      attending_status: status,
      guests_count: status === "declined" ? 1 : guestsCount,
      notes: compiledNotes,
    });

    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0]?.message ?? "Please check your details");
      return;
    }

    setSubmitting(true);

    try {
      const { isConfigured } = getSupabaseEnv();
      const isDemo = isStudioPreview || eventId === DEMO_EVENT.id || !isConfigured;

      if (isDemo) {
        await new Promise((r) => setTimeout(r, 450));
        setSubmitted(true);
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.from("rsvps").insert({
        event_id: eventId,
        guest_name: parsed.data.guest_name,
        email: parsed.data.email || null,
        phone: parsed.data.phone || null,
        attending_status: parsed.data.attending_status,
        guests_count: parsed.data.guests_count,
        notes: parsed.data.notes || null,
      });

      if (error) {
        setErrorMsg(error.message || "Could not submit RSVP. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Unexpected error submitting RSVP."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const buttonTextColor = getContrastTextColor(theme.palette.primary);

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{
        once: true,
        amount: 0.05,
        ...(scrollRootRef ? { root: scrollRootRef } : {}),
      }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="scroll-mt-14 px-6 sm:px-7 pt-8 pb-24 max-w-lg mx-auto"
    >
      <div
        className="relative rounded-3xl border p-6 sm:p-7 shadow-md overflow-hidden backdrop-blur-xs"
        style={{
          backgroundColor: `${theme.palette.surface}EF`,
          borderColor: `${theme.palette.accent}55`,
        }}
      >
        {submitted ? (
          <div className="relative py-8 text-center">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <LottieAccent kind="confetti-burst" className="w-60 h-60" />
            </div>
            <CheckCircle2
              className="w-12 h-12 mx-auto relative z-10"
              style={{ color: theme.palette.accent }}
            />
            <h3
              className="mt-4 text-2xl font-semibold relative z-10"
              style={{
                color: theme.palette.primary,
                fontFamily: getDisplayFontFamily(theme.typography.displayFont),
              }}
            >
              Thank You, {guestName}!
            </h3>
            <p
              className="mt-2 text-sm relative z-10 max-w-xs mx-auto"
              style={{ color: theme.palette.mutedText }}
            >
              {status === "attending"
                ? `Your RSVP for ${guestsCount} guest${guestsCount > 1 ? "s" : ""} is confirmed.`
                : status === "tentative"
                  ? "We have noted your tentative response."
                  : "Thank you for letting us know — you will be missed."}
            </p>
            {(isStudioPreview || eventId === DEMO_EVENT.id) && (
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setGuestName("");
                  setNotes("");
                }}
                className="relative z-10 mt-5 text-xs underline underline-offset-4 cursor-pointer"
                style={{ color: theme.palette.accent }}
              >
                Submit another demo response
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-5">
              <p
                className="text-[11px] uppercase tracking-[0.25em]"
                style={{ color: theme.palette.accent }}
              >
                Response Card
              </p>
              <h2
                className="mt-1 text-2xl sm:text-3xl font-semibold"
                style={{
                  color: theme.palette.primary,
                  fontFamily: getDisplayFontFamily(theme.typography.displayFont),
                }}
              >
                {content.rsvpHeadline || "Kindly Reply"}
              </h2>
              {content.rsvpDeadline && (
                <p
                  className="mt-1 text-xs"
                  style={{
                    color: theme.palette.mutedText,
                    fontFamily: getBodyFontFamily(theme.typography.bodyFont),
                  }}
                >
                  {content.rsvpDeadline}
                </p>
              )}
            </div>

            {/* Attending Status Segmented Pills */}
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: "attending", label: "Joyfully Accepts" },
                  { id: "tentative", label: "Tentative" },
                  { id: "declined", label: "Regrets" },
                ] as const
              ).map((opt) => {
                const active = status === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setStatus(opt.id)}
                    style={{
                      backgroundColor: active
                        ? theme.palette.primary
                        : "transparent",
                      color: active ? buttonTextColor : theme.palette.text,
                      borderColor: active
                        ? theme.palette.primary
                        : `${theme.palette.accent}55`,
                    }}
                    className="rounded-xl border py-2.5 px-2 text-xs font-medium transition cursor-pointer"
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            <div>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: theme.palette.mutedText }}
              >
                Full Name *
              </label>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder={typeMeta.rsvpNamePlaceholder}
                style={{
                  borderColor: `${theme.palette.accent}44`,
                  backgroundColor: theme.palette.background,
                  color: theme.palette.text,
                }}
                className="w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  className="block text-xs font-medium mb-1"
                  style={{ color: theme.palette.mutedText }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="guest@example.com"
                  style={{
                    borderColor: `${theme.palette.accent}44`,
                    backgroundColor: theme.palette.background,
                    color: theme.palette.text,
                  }}
                  className="w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                />
              </div>

              <div>
                <label
                  className="block text-xs font-medium mb-1"
                  style={{ color: theme.palette.mutedText }}
                >
                  Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 555 0199"
                  style={{
                    borderColor: `${theme.palette.accent}44`,
                    backgroundColor: theme.palette.background,
                    color: theme.palette.text,
                  }}
                  className="w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                />
              </div>
            </div>

            {/* Multi-day ceremony attendance or reception confirmation */}
            {status !== "declined" && isReceptionGuest && (
              <div
                className="rounded-xl border px-3.5 py-2 text-xs flex items-center gap-2"
                style={{
                  borderColor: `${theme.palette.accent}55`,
                  backgroundColor: `${theme.palette.surface}E0`,
                  color: theme.palette.primary,
                }}
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: theme.palette.accent }} />
                <span>RSVP response for Reception &amp; Banquet</span>
              </div>
            )}

            {status !== "declined" && !isReceptionGuest && ceremonyOptions.length > 1 && (
              <div className="space-y-1.5">
                <label
                  className="block text-xs font-medium"
                  style={{ color: theme.palette.mutedText }}
                >
                  Select Days / Ceremonies You Will Attend:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {ceremonyOptions.map((ceremony) => {
                    const active = selectedCeremonies.includes(ceremony);
                    return (
                      <button
                        key={ceremony}
                        type="button"
                        onClick={() => toggleCeremony(ceremony)}
                        className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                          active ? "shadow-2xs font-semibold" : "opacity-80"
                        }`}
                        style={{
                          backgroundColor: active ? theme.palette.primary : "transparent",
                          color: active ? buttonTextColor : theme.palette.text,
                          borderColor: active ? theme.palette.primary : `${theme.palette.accent}55`,
                        }}
                      >
                        <span>{active ? "✓" : "+"}</span>
                        <span>{ceremony}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {status !== "declined" && (
              <div
                className="flex items-center justify-between rounded-xl border px-3.5 py-2.5"
                style={{
                  borderColor: `${theme.palette.accent}44`,
                  backgroundColor: theme.palette.background,
                }}
              >
                <span
                  className="text-xs font-medium"
                  style={{ color: theme.palette.text }}
                >
                  Number of Guests
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setGuestsCount((c) => Math.max(1, c - 1))}
                    className="w-7 h-7 rounded-lg border flex items-center justify-center cursor-pointer"
                    style={{ borderColor: `${theme.palette.accent}55` }}
                    aria-label="Decrease guest count"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-semibold tabular-nums w-5 text-center">
                    {guestsCount}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setGuestsCount((c) => Math.min(maxGuests, c + 1))
                    }
                    className="w-7 h-7 rounded-lg border flex items-center justify-center cursor-pointer"
                    style={{ borderColor: `${theme.palette.accent}55` }}
                    aria-label="Increase guest count"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            <div>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: theme.palette.mutedText }}
              >
                Dietary Notes or Wishes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any allergies, song requests, or warm wishes..."
                style={{
                  borderColor: `${theme.palette.accent}44`,
                  backgroundColor: theme.palette.background,
                  color: theme.palette.text,
                }}
                className="w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-500 text-center">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{
                backgroundColor: theme.palette.primary,
                color: buttonTextColor,
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold shadow-lg transition hover:opacity-95 disabled:opacity-60 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending RSVP...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>
                    {isStudioPreview ? "Preview RSVP Submit" : "Confirm RSVP"}
                  </span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </motion.section>
  );
}

