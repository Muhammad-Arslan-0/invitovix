import type { Metadata } from "next";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { DEMO_EVENT, mergeDesignData } from "@/lib/templates/presets";
import { EventRecord } from "@/types/invitation";
import { InvitationPlayer } from "@/components/invitation/InvitationPlayer";

export const dynamic = "force-dynamic";

interface GuestInvitePageProps {
  params: Promise<{ slug: string }>;
}

async function resolveEventBySlug(slug: string): Promise<{
  event: EventRecord | null;
  isOwnerDraft: boolean;
}> {
  if (slug === "demo") {
    return { event: DEMO_EVENT, isOwnerDraft: false };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { event: null, isOwnerDraft: false };
  }

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!event) {
    return { event: null, isOwnerDraft: false };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const typedEvent = {
    ...event,
    design_data: mergeDesignData(event.design_data),
  } as EventRecord;

  const isOwnerDraft = !typedEvent.is_published && user?.id === typedEvent.user_id;

  if (!typedEvent.is_published && !isOwnerDraft) {
    return { event: null, isOwnerDraft: false };
  }

  return { event: typedEvent, isOwnerDraft };
}

export async function generateMetadata({
  params,
}: GuestInvitePageProps): Promise<Metadata> {
  const { slug } = await params;
  const { event } = await resolveEventBySlug(slug);

  if (!event) {
    return {
      title: "Invitation Unavailable",
      description: "This Invitovix invitation could not be found.",
    };
  }

  const design = mergeDesignData(event.design_data);
  const formattedDate = new Date(event.event_date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const description = `${design.content.subtitle} · ${formattedDate} at ${event.venue_name}`;

  return {
    title: `${design.content.headline || event.title} — You're Invited`,
    description,
    openGraph: {
      title: `${design.content.headline || event.title} — Invitation`,
      description,
      type: "website",
      images: design.content.heroImageUrl
        ? [{ url: design.content.heroImageUrl }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${design.content.headline || event.title}`,
      description,
    },
  };
}

export default async function GuestInvitePage({
  params,
}: GuestInvitePageProps) {
  const { slug } = await params;
  const { event, isOwnerDraft } = await resolveEventBySlug(slug);

  if (!event) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#fcfaf7] px-6 text-center">
        <div className="max-w-md rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
          <p className="text-xs uppercase tracking-[0.24em] text-amber-700 font-medium">
            Invitovix
          </p>
          <h1 className="mt-2 text-2xl font-serif font-semibold text-stone-900">
            Invitation Not Published Yet
          </h1>
          <p className="mt-2 text-sm text-stone-600 leading-relaxed">
            This invitation link either does not exist or is still saved as a
            private draft by its host.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/e/demo"
              className="rounded-xl bg-stone-900 px-4 py-2.5 text-xs font-medium text-white hover:bg-stone-800 transition"
            >
              View Demo Invite
            </Link>
            <Link
              href="/"
              className="rounded-xl border border-stone-300 px-4 py-2.5 text-xs font-medium text-stone-700 hover:bg-stone-50 transition"
            >
              Go Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {isOwnerDraft && (
        <div className="sticky top-0 z-50 bg-amber-950 text-amber-100 px-4 py-2 text-center text-xs flex items-center justify-center gap-3 shadow">
          <span>
            <strong>Draft Preview:</strong> Only visible to you. Publish in
            Creator Studio to share with guests.
          </span>
          <Link
            href={`/studio/${event.id}`}
            className="underline underline-offset-2 font-semibold hover:text-white"
          >
            Back to Studio
          </Link>
        </div>
      )}

      <InvitationPlayer
        eventId={event.id}
        slug={event.slug}
        title={event.title}
        eventDate={event.event_date}
        venueName={event.venue_name}
        venueAddress={event.venue_address}
        venueMapUrl={event.venue_map_url}
        audioUrl={event.audio_url}
        designData={event.design_data}
      />
    </main>
  );
}

