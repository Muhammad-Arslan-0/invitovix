import type { Metadata } from "next";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  mergeDesignData,
  resolveDemoEventForPreset,
} from "@/lib/templates/presets";
import { EventRecord } from "@/types/invitation";
import { GuestInviteShell } from "@/components/invitation/GuestInviteShell";
import { BrandMark } from "@/components/ui/BrandMark";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildEventSchema } from "@/lib/seo/structuredData";

export const dynamic = "force-dynamic";

interface GuestInvitePageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{
    template?: string;
    access?: string;
    tier?: string;
    events?: string;
    day?: string;
    invite?: string;
    lang?: string;
    locale?: string;
  }>;
}

async function resolveEventBySlug(
  slug: string,
  templateParam?: string
): Promise<{
  event: EventRecord | null;
  isOwnerDraft: boolean;
}> {
  if (slug === "demo") {
    return {
      event: resolveDemoEventForPreset(templateParam),
      isOwnerDraft: false,
    };
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
  searchParams,
}: GuestInvitePageProps): Promise<Metadata> {
  const { slug } = await params;
  const sp = searchParams ? await searchParams : undefined;
  const { event } = await resolveEventBySlug(slug, sp?.template);

  if (!event) {
    return {
      title: "Invitation Unavailable",
      description: "This Invitovix invitation could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const isDemo = slug === "demo";
  const design = mergeDesignData(event.design_data);
  const formattedDate = new Date(event.event_date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const description = isDemo
    ? `Experience an interactive wax-seal live invitation card demo on Invitovix — ${design.content.subtitle} · ${formattedDate} at ${event.venue_name}.`
    : `${design.content.subtitle} · ${formattedDate} at ${event.venue_name}`;

  const ogImages =
    design.content.heroImageUrl || design.content.couple.brideImageUrl
      ? [
          {
            url: (design.content.heroImageUrl ||
              design.content.couple.brideImageUrl)!,
            alt: `${design.content.headline || event.title} invitation preview`,
          },
        ]
      : [
          {
            url: "/opengraph-image",
            width: 1200,
            height: 630,
            alt: `${design.content.headline || event.title} — Invitovix Live Invitation Card`,
          },
        ];

  return {
    title: isDemo
      ? `${design.content.headline || event.title} — Live Digital Invitation Card Demo`
      : `${design.content.headline || event.title} — You're Invited`,
    description,
    alternates: {
      canonical: isDemo ? "/e/demo" : `/e/${slug}`,
    },
    robots: isDemo
      ? {
          index: true,
          follow: true,
        }
      : {
          index: false,
          follow: true,
        },
    openGraph: {
      title: `${design.content.headline || event.title} — Live Invitation`,
      description,
      type: "website",
      url: isDemo ? "/e/demo" : `/e/${slug}`,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: `${design.content.headline || event.title}`,
      description,
      images: ogImages.map((img) => img.url),
    },
  };
}

export default async function GuestInvitePage({
  params,
  searchParams,
}: GuestInvitePageProps) {
  const { slug } = await params;
  const sp = searchParams ? await searchParams : undefined;
  const guestAccess =
    sp?.access || sp?.tier || sp?.events || sp?.day || sp?.invite || null;
  const initialLang = sp?.lang || sp?.locale || null;
  const { event, isOwnerDraft } = await resolveEventBySlug(slug, sp?.template);

  if (!event) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#fcfaf7] px-6 text-center">
        <div className="max-w-md rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
          <BrandMark
            size="lg"
            decorative
            className="mx-auto mb-3"
          />
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
    <>
      {slug === "demo" && <JsonLd data={buildEventSchema(event)} />}
      <GuestInviteShell
        eventId={event.id}
        slug={event.slug}
        title={event.title}
        eventType={event.event_type}
        eventDate={event.event_date}
        venueName={event.venue_name}
        venueAddress={event.venue_address}
        venueMapUrl={event.venue_map_url}
        audioUrl={event.audio_url}
        designData={event.design_data}
        guestAccess={guestAccess}
        isOwnerDraft={isOwnerDraft}
        initialLang={initialLang}
      />
    </>
  );
}

