"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Globe,
  Loader2,
  Save,
  Users,
} from "lucide-react";
import { useStudioStore } from "@/store/useStudioStore";
import { ShareDialog } from "./ShareDialog";
import { startNavigation } from "@/components/ui/NavigationProgress";

interface StudioTopBarProps {
  onSave: () => Promise<void>;
  onTogglePublish: () => Promise<void>;
}

export function StudioTopBar({ onSave, onTogglePublish }: StudioTopBarProps) {
  const router = useRouter();
  const { eventMeta, isDirty, isSaving, updateMeta } = useStudioStore();
  const [navTarget, setNavTarget] = useState<"dashboard" | "rsvps" | null>(null);
  const [isPending, startTransition] = useTransition();

  function navigateTo(target: "dashboard" | "rsvps", href: string) {
    setNavTarget(target);
    startNavigation();
    startTransition(() => {
      router.push(href);
    });
  }

  return (
    <header className="h-15 border-b border-stone-200 bg-white/95 backdrop-blur-md px-4 flex items-center justify-between gap-3 shrink-0 z-30">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={() => navigateTo("dashboard", "/dashboard")}
          onMouseEnter={() => router.prefetch("/dashboard")}
          disabled={isPending && navTarget === "dashboard"}
          className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 disabled:opacity-70 transition cursor-pointer"
        >
          {isPending && navTarget === "dashboard" ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <ArrowLeft className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">
            {isPending && navTarget === "dashboard" ? "Loading..." : "Dashboard"}
          </span>
        </button>

        <input
          type="text"
          value={eventMeta.title}
          onChange={(e) => updateMeta({ title: e.target.value })}
          className="text-sm font-serif font-semibold text-stone-900 bg-transparent border-b border-transparent hover:border-stone-300 focus:border-stone-900 focus:outline-none px-1 py-0.5 truncate max-w-[180px] sm:max-w-xs"
          aria-label="Invitation Title"
        />

        <span
          className={`hidden md:inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
            isDirty
              ? "bg-amber-100 text-amber-800"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isDirty ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
            }`}
          />
          {isDirty ? "Unsaved changes" : "Saved"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() =>
            navigateTo("rsvps", `/dashboard/events/${eventMeta.id}/rsvps`)
          }
          onMouseEnter={() =>
            router.prefetch(`/dashboard/events/${eventMeta.id}/rsvps`)
          }
          disabled={isPending && navTarget === "rsvps"}
          className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-70 transition cursor-pointer"
        >
          {isPending && navTarget === "rsvps" ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Users className="w-3.5 h-3.5" />
          )}
          <span>
            {isPending && navTarget === "rsvps" ? "Opening..." : "RSVPs"}
          </span>
        </button>

        <ShareDialog
          slug={eventMeta.slug}
          title={eventMeta.title}
          isPublished={eventMeta.is_published}
          onTogglePublish={onTogglePublish}
        />

        <button
          type="button"
          onClick={onTogglePublish}
          disabled={isSaving}
          className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
            eventMeta.is_published
              ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
              : "border border-stone-300 bg-white text-stone-700 hover:bg-stone-50"
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{eventMeta.is_published ? "Published" : "Publish"}</span>
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={isSaving || !isDirty}
          className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-stone-800 disabled:opacity-50 transition cursor-pointer shadow-xs"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : isDirty ? (
            <>
              <Save className="w-3.5 h-3.5 text-amber-300" />
              <span>Save</span>
            </>
          ) : (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-300" />
              <span>Saved</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
