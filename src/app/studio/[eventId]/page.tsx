import { notFound, redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { mergeDesignData, STARTER_TEMPLATES } from "@/lib/templates/presets";
import { EventRecord, TemplateRecord } from "@/types/invitation";
import { StudioShell } from "@/components/studio/StudioShell";

export const dynamic = "force-dynamic";

interface StudioPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function StudioPage({ params }: StudioPageProps) {
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

  const [{ data: eventRaw }, { data: templatesRaw }] = await Promise.all([
    supabase.from("events").select("*").eq("id", eventId).maybeSingle(),
    supabase
      .from("templates")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: true }),
  ]);

  if (!eventRaw || eventRaw.user_id !== user.id) {
    notFound();
  }

  const templates: TemplateRecord[] =
    templatesRaw && templatesRaw.length > 0
      ? templatesRaw.map((t) => ({
          ...t,
          default_config: mergeDesignData(t.default_config),
        }))
      : STARTER_TEMPLATES;

  const event: EventRecord = {
    ...(eventRaw as EventRecord),
    design_data: mergeDesignData(eventRaw.design_data),
  };

  return (
    <StudioShell initialEvent={event} templates={templates} userId={user.id} />
  );
}

