import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  mergeDesignData,
  mergeTemplateCatalog,
  STARTER_TEMPLATES,
} from "@/lib/templates/presets";
import { EventRecord } from "@/types/invitation";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    redirect("/login?setup=missing");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: eventsRaw }, { data: templatesRaw }, { data: rsvpsRaw }] =
    await Promise.all([
      supabase
        .from("events")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("templates")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: true }),
      supabase
        .from("rsvps")
        .select("event_id, attending_status, guests_count"),
    ]);

  const templates = mergeTemplateCatalog(templatesRaw, STARTER_TEMPLATES);

  const rsvpStats = new Map<
    string,
    {
      count: number;
      attending: number;
      attendingParties: number;
      tentative: number;
      declined: number;
    }
  >();
  for (const r of rsvpsRaw ?? []) {
    const prev = rsvpStats.get(r.event_id) ?? {
      count: 0,
      attending: 0,
      attendingParties: 0,
      tentative: 0,
      declined: 0,
    };
    prev.count += 1;
    if (r.attending_status === "attending") {
      prev.attending += r.guests_count ?? 1;
      prev.attendingParties += 1;
    } else if (r.attending_status === "tentative") {
      prev.tentative += 1;
    } else if (r.attending_status === "declined") {
      prev.declined += 1;
    }
    rsvpStats.set(r.event_id, prev);
  }

  const events = (eventsRaw ?? []).map((ev) => {
    const stats = rsvpStats.get(ev.id) ?? {
      count: 0,
      attending: 0,
      attendingParties: 0,
      tentative: 0,
      declined: 0,
    };
    return {
      ...(ev as EventRecord),
      design_data: mergeDesignData(ev.design_data),
      rsvp_count: stats.count,
      attending_guests: stats.attending,
      attending_parties: stats.attendingParties,
      tentative_count: stats.tentative,
      declined_count: stats.declined,
    };
  });

  const userName =
    (user.user_metadata?.full_name as string | undefined) ??
    user.email?.split("@")[0] ??
    "Host";

  return (
    <DashboardClient
      userId={user.id}
      userEmail={user.email ?? ""}
      userName={userName}
      initialEvents={events}
      templates={templates}
    />
  );
}

