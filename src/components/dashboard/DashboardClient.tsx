"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  Check,
  Copy,
  ExternalLink,
  Globe,
  Loader2,
  LogOut,
  MapPin,
  Palette,
  Trash2,
  Users,
} from "lucide-react";
import {
  EventRecord,
  InvitationDomainId,
  TemplateRecord,
} from "@/types/invitation";
import { createClient } from "@/lib/supabase/client";
import {
  INVITATION_DOMAINS,
  formatCategoryBadge,
  getDomainForCategory,
} from "@/lib/templates/categories";
import { resolveCardBackdropUrl } from "@/lib/templates/presets";
import { hexToRgba } from "@/lib/utils/colors";
import { CreateEventModal } from "./CreateEventModal";
import { BrandMark } from "@/components/ui/BrandMark";
import { startNavigation } from "@/components/ui/NavigationProgress";

interface EventWithCount extends EventRecord {
  rsvp_count: number;
  attending_guests: number;
}

interface DashboardClientProps {
  userId: string;
  userEmail: string;
  userName: string;
  initialEvents: EventWithCount[];
  templates: TemplateRecord[];
}

export function DashboardClient({
  userId,
  userEmail,
  userName,
  initialEvents,
  templates,
}: DashboardClientProps) {
  const router = useRouter();
  const [events, setEvents] = useState<EventWithCount[]>(initialEvents);
  const [activeFilter, setActiveFilter] = useState<"all" | InvitationDomainId>(
    "all"
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [navTarget, setNavTarget] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredEvents =
    activeFilter === "all"
      ? events
      : events.filter(
          (e) => getDomainForCategory(e.event_type) === activeFilter
        );

  const totalPublished = events.filter((e) => e.is_published).length;
  const totalRsvps = events.reduce((sum, e) => sum + e.rsvp_count, 0);
  const totalConfirmedGuests = events.reduce(
    (sum, e) => sum + e.attending_guests,
    0
  );

  function handleNavigate(key: string, href: string) {
    setNavTarget(key);
    startNavigation();
    startTransition(() => {
      router.push(href);
    });
  }

  async function handleSignOut() {
    setNavTarget("signout");
    startNavigation();
    const supabase = createClient();
    await supabase.auth.signOut();
    startTransition(() => {
      router.push("/");
      router.refresh();
    });
  }

  async function handleCopyLink(event: EventWithCount) {
    const url = `${window.location.origin}/e/${event.slug}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(event.id);
    setTimeout(() => setCopiedId(null), 1800);
  }

  async function handleTogglePublish(event: EventWithCount) {
    setBusyId(event.id);
    try {
      const supabase = createClient();
      const nextStatus = !event.is_published;
      const { error } = await supabase
        .from("events")
        .update({ is_published: nextStatus })
        .eq("id", event.id);

      if (!error) {
        setEvents((prev) =>
          prev.map((e) =>
            e.id === event.id ? { ...e, is_published: nextStatus } : e
          )
        );
      }
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(event: EventWithCount) {
    if (
      !window.confirm(
        `Delete "${event.title}" and all its RSVP responses? This cannot be undone.`
      )
    ) {
      return;
    }

    setBusyId(event.id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", event.id);
      if (!error) {
        setEvents((prev) => prev.filter((e) => e.id !== event.id));
      }
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfaf7] luxury-editorial-bg">
      {/* Top Navbar */}
      <header className="border-b border-stone-200/90 bg-white/85 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <BrandMark
              size="sm"
              rounded="xl"
              decorative
              className="group-hover:scale-105 transition"
            />
            <span className="font-serif text-lg font-semibold tracking-wide text-stone-900">
              Invitovix
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs font-medium text-stone-500">
              {userName || userEmail}
            </span>
            <button
              type="button"
              disabled={navTarget === "signout"}
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-100 disabled:opacity-60 transition cursor-pointer"
            >
              {navTarget === "signout" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <LogOut className="w-3.5 h-3.5" />
              )}
              <span>{navTarget === "signout" ? "Signing out..." : "Sign Out"}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header & Create CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-amber-700 font-semibold">
              Creator Workspace
            </p>
            <h1
              className="mt-1 text-2xl sm:text-3xl font-semibold text-stone-900"
              style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
            >
              Host Dashboard
            </h1>
            <p className="text-sm text-stone-500 mt-1">
              Manage your animated invitations, publish share links, and track
              guest RSVPs.
            </p>
          </div>
          <CreateEventModal
            templates={templates}
            userId={userId}
            defaultDomain={activeFilter === "all" ? "wedding" : activeFilter}
          />
        </motion.div>

        {/* KPI Cards */}
        <div className="mt-7 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Invitations", value: events.length, accent: "border-stone-200" },
            { label: "Published Live", value: totalPublished, accent: "border-emerald-200/80" },
            { label: "RSVP Submissions", value: totalRsvps, accent: "border-amber-200/90" },
            { label: "Confirmed Guests", value: totalConfirmedGuests, accent: "border-stone-200" },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className={`rounded-2xl border ${stat.accent} bg-white/95 p-5 shadow-2xs hover:shadow-md transition-shadow`}
            >
              <p className="text-xs font-medium text-stone-500">{stat.label}</p>
              <p className="mt-2 text-2xl sm:text-3xl font-serif font-semibold text-stone-900 tabular-nums">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Events Grid */}
        <section className="mt-9">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
              Your Invitations
            </h2>

            <div
              role="tablist"
              aria-label="Filter invitations by category"
              className="flex flex-wrap items-center gap-1.5"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeFilter === "all"}
                onClick={() => setActiveFilter("all")}
                className={`rounded-full px-3 py-1 text-xs font-medium transition cursor-pointer ${
                  activeFilter === "all"
                    ? "bg-stone-900 text-white shadow-2xs"
                    : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                }`}
              >
                All ({events.length})
              </button>
              {INVITATION_DOMAINS.map((domain) => {
                const count = events.filter(
                  (e) => getDomainForCategory(e.event_type) === domain.id
                ).length;
                const active = activeFilter === domain.id;
                return (
                  <button
                    key={domain.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveFilter(domain.id)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition cursor-pointer ${
                      active
                        ? "bg-stone-900 text-white shadow-2xs"
                        : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    {domain.shortLabel} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {events.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl border border-dashed border-stone-300 bg-white/90 p-12 text-center shadow-2xs"
            >
              <BrandMark
                size="lg"
                decorative
                className="mx-auto"
              />
              <h3 className="mt-4 text-lg font-serif font-semibold text-stone-900">
                No invitations created yet
              </h3>
              <p className="mt-1.5 text-sm text-stone-500 max-w-md mx-auto">
                Click &ldquo;New Invitation&rdquo; above to pick a Wedding,
                Birthday, Gala, or Party template and customize your interactive
                wax-seal invitation.
              </p>
            </motion.div>
          ) : filteredEvents.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-stone-300 bg-white/90 p-10 text-center">
              <p className="text-sm font-medium text-stone-700">
                No invitations in this category yet.
              </p>
              <button
                type="button"
                onClick={() => setActiveFilter("all")}
                className="mt-3 rounded-xl border border-stone-300 px-3.5 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 cursor-pointer"
              >
                Show All Invitations
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredEvents.map((event, idx) => {
                const palette = event.design_data.theme.palette;
                const waxSeal = event.design_data.envelope.waxSeal;
                const sceneUrl =
                  event.design_data.content.heroImageUrl ||
                  resolveCardBackdropUrl(event.design_data.theme.cardArt);
                const formattedDate = new Date(
                  event.event_date
                ).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  ...(mounted ? {} : { timeZone: "UTC" }),
                });

                const studioKey = `studio-${event.id}`;
                const rsvpKey = `rsvp-${event.id}`;
                const isOpeningStudio = navTarget === studioKey && isPending;
                const isOpeningRsvps = navTarget === rsvpKey && isPending;

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: Math.min(idx * 0.06, 0.3),
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={{ y: -3 }}
                    className="group rounded-3xl border border-stone-200/90 bg-white overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Visual swatch header */}
                    <div
                      className="h-36 p-5 flex flex-col justify-between relative overflow-hidden"
                      style={{
                        backgroundColor: palette.background,
                        borderBottom: `1px solid ${palette.accent}33`,
                      }}
                    >
                      {sceneUrl && (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={sceneUrl}
                            alt=""
                            className="pointer-events-none absolute inset-0 w-full h-full object-cover opacity-40"
                          />
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0"
                            style={{
                              background: `linear-gradient(180deg, ${hexToRgba(palette.background, 0.3)} 0%, ${hexToRgba(palette.background, 0.78)} 100%)`,
                            }}
                          />
                        </>
                      )}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-6 -bottom-6 w-28 h-28 rounded-full opacity-20"
                        style={{
                          background: `radial-gradient(circle, ${palette.accent}, transparent 70%)`,
                        }}
                      />

                      <div className="relative z-10 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow ring-1 ring-white/40"
                            style={{ backgroundColor: waxSeal.color }}
                          >
                            {waxSeal.monogram || "INV"}
                          </span>
                          <span
                            className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                            style={{
                              backgroundColor: `${palette.accent}22`,
                              color: palette.primary,
                            }}
                          >
                            {formatCategoryBadge(event.event_type)}
                          </span>
                        </div>

                        <button
                          type="button"
                          disabled={busyId === event.id}
                          onClick={() => handleTogglePublish(event)}
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium cursor-pointer transition ${
                            event.is_published
                              ? "bg-emerald-600 text-white shadow-xs"
                              : "bg-stone-900/80 text-stone-100 hover:bg-stone-900"
                          }`}
                        >
                          {busyId === event.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Globe className="w-3 h-3" />
                          )}
                          <span>
                            {event.is_published ? "Published" : "Draft"}
                          </span>
                        </button>
                      </div>

                      <div className="relative z-10">
                        <h3
                          className="text-lg font-serif font-semibold line-clamp-1"
                          style={{ color: palette.primary }}
                        >
                          {event.title}
                        </h3>
                        <p
                          className="text-xs font-mono opacity-80"
                          style={{ color: palette.mutedText }}
                        >
                          /e/{event.slug}
                        </p>
                      </div>
                    </div>

                    {/* Metadata & Actions */}
                    <div className="p-5 space-y-4">
                      <div className="space-y-1.5 text-xs text-stone-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          <span>{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" />
                          <span className="line-clamp-1">
                            {event.venue_name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-stone-400" />
                          <span>
                            {event.rsvp_count} responses ({event.attending_guests}{" "}
                            attending)
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onMouseEnter={() => router.prefetch(`/studio/${event.id}`)}
                          onClick={() =>
                            handleNavigate(studioKey, `/studio/${event.id}`)
                          }
                          disabled={isOpeningStudio}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-stone-900 px-3 py-2.5 text-xs font-medium text-white hover:bg-stone-800 disabled:opacity-75 transition cursor-pointer"
                        >
                          {isOpeningStudio ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-300" />
                              <span>Opening...</span>
                            </>
                          ) : (
                            <>
                              <Palette className="w-3.5 h-3.5 text-amber-300" />
                              <span>Open Studio</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onMouseEnter={() =>
                            router.prefetch(`/dashboard/events/${event.id}/rsvps`)
                          }
                          onClick={() =>
                            handleNavigate(
                              rsvpKey,
                              `/dashboard/events/${event.id}/rsvps`
                            )
                          }
                          disabled={isOpeningRsvps}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-xs font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-75 transition cursor-pointer"
                        >
                          {isOpeningRsvps ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Loading...</span>
                            </>
                          ) : (
                            <>
                              <Users className="w-3.5 h-3.5" />
                              <span>RSVPs ({event.rsvp_count})</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleCopyLink(event)}
                            className="inline-flex items-center gap-1 text-stone-600 hover:text-stone-900 cursor-pointer transition"
                          >
                            {copiedId === event.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700 font-medium">
                                  Copied!
                                </span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>

                          <Link
                            href={`/e/${event.slug}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-stone-600 hover:text-stone-900 transition"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </Link>
                        </div>

                        <button
                          type="button"
                          disabled={busyId === event.id}
                          onClick={() => handleDelete(event)}
                          className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer transition"
                          title="Delete invitation"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
