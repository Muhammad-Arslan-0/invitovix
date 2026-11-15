"use client";

import { useState, type RefObject } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Minus, Plus, Send } from "lucide-react";
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
import { useCardLanguage } from "@/lib/i18n/CardLanguageContext";
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
  isStudioPreview = false,
  scrollRootRef,
}: RsvpSceneProps) {
  const { t, isRTL } = useCardLanguage();
  const { theme, content, sections } = designData;
  const typeMeta = getInvitationTypeMeta(eventType);

  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<AttendingStatus>("attending");
  const [guestsCount, setGuestsCount] = useState(1);
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!sections.showRsvp) return null;

  const maxGuests = content.maxGuestsPerParty || 6;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    const parsed = rsvpSubmissionSchema.safeParse({
      guest_name: guestName,
      email,
      phone,
      attending_status: status,
      guests_count: status === "declined" ? 1 : guestsCount,
      notes: notes.trim() || null,
    });

    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0]?.message ?? t("pleaseCheckDetails"));
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
        setErrorMsg(error.message || t("pleaseCheckDetails"));
        return;
      }

      setSubmitted(true);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : t("pleaseCheckDetails")
      );
    } finally {
      setSubmitting(false);
    }
  }

  const buttonTextColor = getContrastTextColor(theme.palette.primary);

  const attendingOptions = [
    { id: "attending" as const, label: t("joyfullyAccepts") },
    { id: "tentative" as const, label: t("tentative") },
    { id: "declined" as const, label: t("regrets") },
  ];

  return (
    <motion.section
      id={id}
      dir={isRTL ? "rtl" : "ltr"}
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
              {t("thankYou")}, {guestName}!
            </h3>
            <p
              className="mt-2 text-sm relative z-10 max-w-xs mx-auto"
              style={{ color: theme.palette.mutedText }}
            >
              {status === "attending"
                ? guestsCount === 1
                  ? t("rsvpConfirmedSingle")
                  : t("rsvpConfirmedPlural", { count: guestsCount })
                : status === "tentative"
                  ? t("tentativeNoted")
                  : t("regretsNoted")}
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
                {t("submitAnotherDemo")}
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
                {t("responseCard")}
              </p>
              <h2
                className="mt-1 text-2xl sm:text-3xl font-semibold"
                style={{
                  color: theme.palette.primary,
                  fontFamily: getDisplayFontFamily(theme.typography.displayFont),
                }}
              >
                {content.rsvpHeadline || t("kindlyReply")}
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
              {attendingOptions.map((opt) => {
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
                {t("fullName")} *
              </label>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder={t("fullNamePlaceholder")}
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
                  {t("emailAddress")}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailPlaceholder")}
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
                  {t("phoneNumber")}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t("phonePlaceholder")}
                  style={{
                    borderColor: `${theme.palette.accent}44`,
                    backgroundColor: theme.palette.background,
                    color: theme.palette.text,
                  }}
                  className="w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                />
              </div>
            </div>

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
                  {t("guestCount")}
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
                {t("notesOrDietary")}
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t("notesPlaceholder")}
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
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-sm font-semibold shadow-md transition hover:opacity-95 disabled:opacity-60 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t("submitting")}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>
                    {isStudioPreview ? "Preview RSVP Submit" : t("sendRsvp")}
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
