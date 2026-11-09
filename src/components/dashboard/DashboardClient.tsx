"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Check,
  Copy,
  ExternalLink,
  Globe,
  LogOut,
  MapPin,
  Palette,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";
import { EventRecord, TemplateRecord } from "@/types/invitation";
import { createClient } from "@/lib/supabase/client";
import { CreateEventModal } from "./CreateEventModal";

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
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const totalPublished = events.filter((e) => e.is_published).length;
  const totalRsvps = events.reduce((sum, e) => sum + e.rsvp_count, 0);
  const totalConfirmedGuests = events.reduce(
    (sum, e) => sum + e.attending_guests,
    0
  );

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
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
    <div className="min-h-screen bg-[#fcfaf7]">
      {/* Top Navbar */}
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-stone-900 text-amber-300 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="font-serif text-lg font-semibold tracking-wide text-stone-900">
              Invitovix
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-stone-500">
              {userName || userEmail}
            </span>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-100 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header & Create CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-stone-900">
              Host Dashboard
            </h1>
            <p className="text-sm text-stone-500 mt-1">
              Manage your animated invitations, publish share links, and track
              guest RSVPs.
            </p>
          </div>
          <CreateEventModal templates={templates} userId={userId} />
        </div>

        {/* KPI Cards */}
        <div className="mt-7 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Invitations", value: events.length },
            { label: "Published Live", value: totalPublished },
            { label: "RSVP Submissions", value: totalRsvps },
            { label: "Confirmed Guests", value: totalConfirmedGuests },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs"
            >
              <p className="text-xs font-medium text-stone-500">{stat.label}</p>
              <p className="mt-2 text-2xl sm:text-3xl font-serif font-semibold text-stone-900">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Events Grid */}
        <section className="mt-9">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500 mb-4">
            Your Invitations
          </h2>

          {events.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-12 text-center">
              <Sparkles className="w-8 h-8 text-amber-600 mx-auto" />
              <h3 className="mt-3 text-lg font-serif font-semibold text-stone-900">
                No invitations created yet
              </h3>
              <p className="mt-1 text-sm text-stone-500 max-w-md mx-auto">
                Click &ldquo;New Invitation&rdquo; above to pick a curated
                template and customize your interactive wax-seal invitation.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map((event) => {
                const palette = event.design_data.theme.palette;
                const formattedDate = new Date(
                  event.event_date
                ).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <div
                    key={event.id}
                    className="rounded-3xl border border-stone-200 bg-white overflow-hidden shadow-2xs flex flex-col justify-between"
                  >
                    {/* Visual swatch header */}
                    <div
                      className="h-32 p-5 flex flex-col justify-between relative"
                      style={{
                        backgroundColor: palette.background,
                        borderBottom: `1px solid ${palette.accent}33`,
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                          style={{
                            backgroundColor: `${palette.accent}22`,
                            color: palette.primary,
                          }}
                        >
                          {event.event_type}
                        </span>
                        <button
                          type="button"
                          disabled={busyId === event.id}
                          onClick={() => handleTogglePublish(event)}
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium cursor-pointer transition ${
                            event.is_published
                              ? "bg-emerald-600 text-white"
                              : "bg-stone-800/80 text-stone-100"
                          }`}
                        >
                          <Globe className="w-3 h-3" />
                          <span>
                            {event.is_published ? "Published" : "Draft"}
                          </span>
                        </button>
                      </div>

                      <div>
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
                        <Link
                          href={`/studio/${event.id}`}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-stone-900 px-3 py-2 text-xs font-medium text-white hover:bg-stone-800 transition"
                        >
                          <Palette className="w-3.5 h-3.5" />
                          <span>Open Studio</span>
                        </Link>
                        <Link
                          href={`/dashboard/events/${event.id}/rsvps`}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 transition"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>RSVPs ({event.rsvp_count})</span>
                        </Link>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopyLink(event)}
                            className="inline-flex items-center gap-1 text-stone-600 hover:text-stone-900 cursor-pointer"
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
                            className="inline-flex items-center gap-1 text-stone-600 hover:text-stone-900"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </Link>
                        </div>

                        <button
                          type="button"
                          disabled={busyId === event.id}
                          onClick={() => handleDelete(event)}
                          className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                          title="Delete invitation"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

