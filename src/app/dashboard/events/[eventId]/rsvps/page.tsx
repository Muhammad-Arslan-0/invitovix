import { notFound, redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { RsvpRecord } from "@/types/invitation";
import { RsvpTable } from "@/components/dashboard/RsvpTable";

export const dynamic = "force-dynamic";

interface EventRsvpsPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function EventRsvpsPage({ params }: EventRsvpsPageProps) {
  const { eventId } = await params;
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

  const { data: event } = await supabase
    .from("events")
    .select("id, title, slug, user_id")
    .eq("id", eventId)
    .maybeSingle();

  if (!event || event.user_id !== user.id) {
    notFound();
  }

  const { data: rsvps } = await supabase
    .from("rsvps")
    .select("*")
    .eq("event_id", event.id)
    .order("created_at", { ascending: false });

  return (
    <RsvpTable
      eventId={event.id}
      eventTitle={event.title}
      eventSlug={event.slug}
      initialRsvps={(rsvps ?? []) as RsvpRecord[]}
    />
  );
}

