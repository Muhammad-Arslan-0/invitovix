import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { mergeDesignData, STARTER_TEMPLATES } from "@/lib/templates/presets";
import { EventRecord, TemplateRecord } from "@/types/invitation";
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

  const templates: TemplateRecord[] =
    templatesRaw && templatesRaw.length > 0
      ? templatesRaw.map((t) => ({
          ...t,
          default_config: mergeDesignData(t.default_config),
        }))
      : STARTER_TEMPLATES;

  const rsvpStats = new Map<string, { count: number; attending: number }>();
  for (const r of rsvpsRaw ?? []) {
    const prev = rsvpStats.get(r.event_id) ?? { count: 0, attending: 0 };
    prev.count += 1;
    if (r.attending_status === "attending") {
      prev.attending += r.guests_count ?? 1;
    }
    rsvpStats.set(r.event_id, prev);
  }

  const events = (eventsRaw ?? []).map((ev) => {
    const stats = rsvpStats.get(ev.id) ?? { count: 0, attending: 0 };
    return {
      ...(ev as EventRecord),
      design_data: mergeDesignData(ev.design_data),
      rsvp_count: stats.count,
      attending_guests: stats.attending,
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

