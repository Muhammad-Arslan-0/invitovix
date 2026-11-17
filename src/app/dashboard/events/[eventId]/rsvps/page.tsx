import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { RsvpRecord } from "@/types/invitation";
import { RsvpTable } from "@/components/dashboard/RsvpTable";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Event RSVPs",
  description: "Live guest RSVP responses for your Invitovix invitation.",
  robots: {
    index: false,
    follow: false,
  },
};

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

  const [{ data: event }, { data: rsvps }] = await Promise.all([
    supabase
      .from("events")
      .select("id, title, slug, user_id")
      .eq("id", eventId)
      .maybeSingle(),
    supabase
      .from("rsvps")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false }),
  ]);

  if (!event || event.user_id !== user.id) {
    notFound();
  }

  return (
    <RsvpTable
      eventId={event.id}
      eventTitle={event.title}
      eventSlug={event.slug}
      initialRsvps={(rsvps ?? []) as RsvpRecord[]}
    />
  );
}
