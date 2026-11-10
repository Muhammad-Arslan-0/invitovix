"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Loader2,
  Palette,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { AttendingStatus, RsvpRecord } from "@/types/invitation";
import { createClient } from "@/lib/supabase/client";
import { startNavigation } from "@/components/ui/NavigationProgress";

interface RsvpTableProps {
  eventId: string;
  eventTitle: string;
  eventSlug: string;
  initialRsvps: RsvpRecord[];
}

export function RsvpTable({
  eventId,
  eventTitle,
  eventSlug,
  initialRsvps,
}: RsvpTableProps) {
  const router = useRouter();
  const [rsvps, setRsvps] = useState<RsvpRecord[]>(initialRsvps);
  const [filter, setFilter] = useState<"all" | AttendingStatus>("all");
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [navTarget, setNavTarget] = useState<"dashboard" | "studio" | null>(null);
  const [isPending, startTransition] = useTransition();

  function navigateTo(target: "dashboard" | "studio", href: string) {
    setNavTarget(target);
    startNavigation();
    startTransition(() => {
      router.push(href);
    });
  }

  const stats = useMemo(() => {
    let attendingHeadcount = 0;
    let attendingParties = 0;
    let tentative = 0;
    let declined = 0;

    for (const r of rsvps) {
      if (r.attending_status === "attending") {
        attendingParties += 1;
        attendingHeadcount += r.guests_count || 1;
      } else if (r.attending_status === "tentative") {
        tentative += 1;
      } else {
        declined += 1;
      }
    }
    return { attendingHeadcount, attendingParties, tentative, declined };
  }, [rsvps]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rsvps.filter((r) => {
      if (filter !== "all" && r.attending_status !== filter) return false;
      if (!q) return true;
      return (
        r.guest_name.toLowerCase().includes(q) ||
        (r.email ?? "").toLowerCase().includes(q) ||
        (r.notes ?? "").toLowerCase().includes(q)
      );
    });
  }, [rsvps, filter, query]);

  async function handleDelete(id: string) {
    if (!window.confirm("Remove this RSVP response?")) return;
    setDeletingId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("rsvps").delete().eq("id", id);
      if (!error) {
        setRsvps((prev) => prev.filter((r) => r.id !== id));
      }
    } finally {
      setDeletingId(null);
    }
  }

  function exportCsv() {
    const header = [
      "Guest Name",
      "Status",
      "Guests Count",
      "Email",
      "Phone",
      "Notes",
      "Submitted At",
    ];
    const rows = filtered.map((r) => [
      r.guest_name,
      r.attending_status,
      String(r.guests_count),
      r.email ?? "",
      r.phone ?? "",
      (r.notes ?? "").replace(/\n/g, " "),
      r.created_at,
    ]);

    const csv = [header, ...rows]
      .map((cols) =>
        cols.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${eventSlug}-rsvps.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-[#fcfaf7] px-4 sm:px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={() => navigateTo("dashboard", "/dashboard")}
              disabled={isPending && navTarget === "dashboard"}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-900 cursor-pointer disabled:opacity-70"
            >
              {isPending && navTarget === "dashboard" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ArrowLeft className="w-3.5 h-3.5" />
              )}
              <span>
                {isPending && navTarget === "dashboard"
                  ? "Returning to Dashboard..."
                  : "Back to Dashboard"}
              </span>
            </button>
            <h1 className="mt-2 text-2xl sm:text-3xl font-serif font-semibold text-stone-900">
              {eventTitle} — Guest RSVPs
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => navigateTo("studio", `/studio/${eventId}`)}
              disabled={isPending && navTarget === "studio"}
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 cursor-pointer disabled:opacity-70"
            >
              {isPending && navTarget === "studio" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Palette className="w-3.5 h-3.5 text-amber-700" />
              )}
              <span>
                {isPending && navTarget === "studio"
                  ? "Opening Studio..."
                  : "Edit Invite"}
              </span>
            </button>
            <button
              type="button"
              onClick={exportCsv}
              className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 px-3.5 py-2 text-xs font-medium text-white hover:bg-stone-800 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="rounded-2xl border border-stone-200 bg-white p-4">
            <p className="text-xs text-stone-500">Confirmed Guests</p>
            <p className="mt-1 text-2xl font-serif font-semibold text-emerald-700">
              {stats.attendingHeadcount}
            </p>
            <p className="text-[11px] text-stone-400">
              across {stats.attendingParties} parties
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-4">
            <p className="text-xs text-stone-500">Tentative</p>
            <p className="mt-1 text-2xl font-serif font-semibold text-amber-700">
              {stats.tentative}
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-4">
            <p className="text-xs text-stone-500">Declined</p>
            <p className="mt-1 text-2xl font-serif font-semibold text-stone-600">
              {stats.declined}
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-4">
            <p className="text-xs text-stone-500">Total Responses</p>
            <p className="mt-1 text-2xl font-serif font-semibold text-stone-900">
              {rsvps.length}
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex flex-wrap gap-1.5">
            {(["all", "attending", "tentative", "declined"] as const).map(
              (f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-medium capitalize transition cursor-pointer ${
                    filter === f
                      ? "bg-stone-900 text-white"
                      : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  {f}
                </button>
              )
            )}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search guest or notes..."
              className="w-full rounded-xl border border-stone-200 bg-white pl-9 pr-3 py-2 text-xs focus:border-stone-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 rounded-2xl border border-stone-200 bg-white overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-10 text-center text-stone-500 text-sm">
              <Users className="w-6 h-6 mx-auto mb-2 text-stone-300" />
              No RSVP responses match your filter yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 font-medium">Guest</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Party</th>
                    <th className="px-4 py-3 font-medium">Contact</th>
                    <th className="px-4 py-3 font-medium">Notes</th>
                    <th className="px-4 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-stone-50/70">
                      <td className="px-4 py-3 font-medium text-stone-900">
                        {r.guest_name}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${
                            r.attending_status === "attending"
                              ? "bg-emerald-100 text-emerald-800"
                              : r.attending_status === "tentative"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-stone-100 text-stone-600"
                          }`}
                        >
                          {r.attending_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 tabular-nums text-stone-700">
                        {r.attending_status === "declined" ? "—" : r.guests_count}
                      </td>
                      <td className="px-4 py-3 text-stone-500">
                        <div>{r.email || "—"}</div>
                        {r.phone && <div className="text-[11px]">{r.phone}</div>}
                      </td>
                      <td className="px-4 py-3 text-stone-600 max-w-xs">
                        {r.notes || "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          disabled={deletingId === r.id}
                          onClick={() => handleDelete(r.id)}
                          className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                          title="Delete RSVP"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

