"use client";

import { useEffect, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Mail, Music2, Palette, Type } from "lucide-react";
import { EventRecord, TemplateRecord } from "@/types/invitation";
import { useStudioStore } from "@/store/useStudioStore";
import { createClient } from "@/lib/supabase/client";
import { StudioTopBar } from "./StudioTopBar";
import { StudioCanvas } from "./StudioCanvas";
import { ThemePanel } from "./panels/ThemePanel";
import { EnvelopePanel } from "./panels/EnvelopePanel";
import { ContentPanel } from "./panels/ContentPanel";
import { MotionAudioPanel } from "./panels/MotionAudioPanel";
import { LuxLoader } from "@/components/ui/LuxLoader";

interface StudioShellProps {
  initialEvent: EventRecord;
  templates: TemplateRecord[];
  userId: string;
}

export function StudioShell({
  initialEvent,
  templates,
  userId,
}: StudioShellProps) {
  const {
    eventMeta,
    designData,
    activeTab,
    hydrateEvent,
    setActiveTab,
    updateMeta,
    setSaving,
    markSaved,
  } = useStudioStore();

  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    hydrateEvent(initialEvent);
  }, [initialEvent, hydrateEvent]);

  async function persistEvent(overridePublished?: boolean) {
    setSaveError(null);
    setSaving(true);
    try {
      const supabase = createClient();
      const nextPublished =
        overridePublished !== undefined
          ? overridePublished
          : eventMeta.is_published;

      const { error } = await supabase
        .from("events")
        .update({
          title: eventMeta.title,
          slug: eventMeta.slug,
          event_type: eventMeta.event_type,
          event_date: eventMeta.event_date,
          venue_name: eventMeta.venue_name,
          venue_address: eventMeta.venue_address || null,
          venue_map_url: eventMeta.venue_map_url || null,
          template_id: eventMeta.template_id,
          audio_url: eventMeta.audio_url,
          design_data: designData,
          is_published: nextPublished,
        })
        .eq("id", eventMeta.id);

      if (error) {
        setSaveError(error.message);
        setSaving(false);
        return;
      }

      if (overridePublished !== undefined) {
        updateMeta({ is_published: overridePublished });
      }
      markSaved();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save");
      setSaving(false);
    }
  }

  async function handleTogglePublish() {
    await persistEvent(!eventMeta.is_published);
  }

  if (eventMeta.id !== initialEvent.id) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#fcfaf7] luxury-editorial-bg">
        <LuxLoader
          title="Opening Creator Studio"
          subtitle={`Loading "${initialEvent.title}" canvas and motion layers...`}
        />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-[#fcfaf7] overflow-hidden">
      <StudioTopBar
        onSave={() => persistEvent()}
        onTogglePublish={handleTogglePublish}
      />

      {saveError && (
        <div className="bg-rose-50 border-b border-rose-200 px-4 py-2 text-xs text-rose-700 text-center">
          Save failed: {saveError}
        </div>
      )}

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Inspector Sidebar */}
        <aside className="w-full lg:w-[370px] xl:w-[400px] border-r border-stone-200 bg-white flex flex-col shrink-0 overflow-hidden max-h-[45vh] lg:max-h-none">
          <Tabs.Root
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as typeof activeTab)}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <Tabs.List className="grid grid-cols-4 border-b border-stone-200 bg-stone-50/70 p-1.5 gap-1 shrink-0">
              {(
                [
                  { id: "theme", label: "Theme", icon: Palette },
                  { id: "envelope", label: "Seal", icon: Mail },
                  { id: "content", label: "Content", icon: Type },
                  { id: "motion", label: "Audio", icon: Music2 },
                ] as const
              ).map((tab) => {
                const Icon = tab.icon;
                return (
                  <Tabs.Trigger
                    key={tab.id}
                    value={tab.id}
                    className="flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-[11px] font-medium text-stone-500 data-[state=active]:bg-white data-[state=active]:text-stone-900 data-[state=active]:shadow-xs transition cursor-pointer"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </Tabs.Trigger>
                );
              })}
            </Tabs.List>

            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              <Tabs.Content value="theme">
                <ThemePanel templates={templates} />
              </Tabs.Content>
              <Tabs.Content value="envelope">
                <EnvelopePanel />
              </Tabs.Content>
              <Tabs.Content value="content">
                <ContentPanel userId={userId} />
              </Tabs.Content>
              <Tabs.Content value="motion">
                <MotionAudioPanel userId={userId} />
              </Tabs.Content>
            </div>
          </Tabs.Root>
        </aside>

        {/* Center Live WYSIWYG Preview */}
        <StudioCanvas />
      </div>
    </div>
  );
}

