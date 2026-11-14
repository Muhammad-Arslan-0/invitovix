import { create } from "zustand";
import {
  EventDesignData,
  EventRecord,
  GalleryPhoto,
  ItineraryItem,
  TemplateRecord,
} from "@/types/invitation";
import {
  DEFAULT_DESIGN_DATA,
  STARTER_TEMPLATES,
  mergeDesignData,
} from "@/lib/templates/presets";
import {
  getDomainForCategory,
  getInvitationTypeMeta,
} from "@/lib/templates/categories";

const STARTER_HEADLINES = new Set(
  STARTER_TEMPLATES.map((t) => t.default_config.content.headline.trim())
);

export type StudioTab = "theme" | "envelope" | "content" | "motion";
export type PreviewDevice = "mobile" | "tablet" | "desktop";
export type PreviewStage = "sealed" | "opened";

export interface StudioEventMeta {
  id: string;
  slug: string;
  title: string;
  event_type: string;
  event_date: string;
  venue_name: string;
  venue_address: string;
  venue_map_url: string;
  template_id: string | null;
  audio_url: string | null;
  is_published: boolean;
}

interface StudioState {
  eventMeta: StudioEventMeta;
  designData: EventDesignData;
  activeTab: StudioTab;
  previewDevice: PreviewDevice;
  previewStage: PreviewStage;
  replayCounter: number;
  isDirty: boolean;
  isSaving: boolean;
  lastSavedAt: string | null;

  hydrateEvent: (event: EventRecord) => void;
  setActiveTab: (tab: StudioTab) => void;
  setPreviewDevice: (device: PreviewDevice) => void;
  setPreviewStage: (stage: PreviewStage) => void;
  triggerReplay: () => void;

  updateMeta: (patch: Partial<StudioEventMeta>) => void;
  applyTemplate: (template: TemplateRecord) => void;
  switchEventCategory: (
    nextCategory: string,
    availableTemplates?: TemplateRecord[]
  ) => void;
  updatePalette: (
    patch: Partial<EventDesignData["theme"]["palette"]>
  ) => void;
  updateTypography: (
    patch: Partial<EventDesignData["theme"]["typography"]>
  ) => void;
  updateCardArt: (
    patch: Partial<EventDesignData["theme"]["cardArt"]>
  ) => void;
  setPaperTexture: (
    texture: EventDesignData["theme"]["paperTexture"]
  ) => void;

  updateEnvelope: (patch: Partial<EventDesignData["envelope"]>) => void;
  updateWaxSeal: (
    patch: Partial<EventDesignData["envelope"]["waxSeal"]>
  ) => void;

  updateContent: (patch: Partial<EventDesignData["content"]>) => void;
  updateCouple: (
    patch: Partial<EventDesignData["content"]["couple"]>
  ) => void;
  updateSections: (patch: Partial<EventDesignData["sections"]>) => void;
  setItinerary: (items: ItineraryItem[]) => void;
  addItineraryItem: (item: ItineraryItem) => void;
  updateItineraryItem: (id: string, patch: Partial<ItineraryItem>) => void;
  removeItineraryItem: (id: string) => void;
  addGalleryPhoto: (photo: GalleryPhoto) => void;
  removeGalleryPhoto: (id: string) => void;

  updateMotion: (patch: Partial<EventDesignData["motion"]>) => void;
  updateAudio: (patch: Partial<EventDesignData["audio"]>) => void;

  setSaving: (saving: boolean) => void;
  markSaved: () => void;
}

const initialMeta: StudioEventMeta = {
  id: "",
  slug: "",
  title: "",
  event_type: "wedding",
  event_date: "2027-02-14T18:30:00.000Z",
  venue_name: "",
  venue_address: "",
  venue_map_url: "",
  template_id: null,
  audio_url: null,
  is_published: false,
};

function buildAppliedTemplateDesign(
  s: StudioState,
  template: TemplateRecord
): EventDesignData {
  const merged = mergeDesignData(template.default_config);
  const prevCouple = s.designData.content.couple;
  const prevCardArt = s.designData.theme.cardArt;
  const hasCustomBackdrop =
    prevCardArt.backdropPreset === "custom" && Boolean(prevCardArt.backdropUrl);

  const prevDomain = getDomainForCategory(s.eventMeta.event_type);
  const nextDomain = getDomainForCategory(template.category);
  const sameDomain = prevDomain === nextDomain;

  const trimmedHeadline = s.designData.content.headline.trim();
  const hasCustomHeadline =
    Boolean(trimmedHeadline) && !STARTER_HEADLINES.has(trimmedHeadline);

  return {
    ...merged,
    theme: {
      ...merged.theme,
      cardArt: hasCustomBackdrop
        ? {
            ...merged.theme.cardArt,
            backdropPreset: "custom",
            backdropUrl: prevCardArt.backdropUrl,
          }
        : {
            ...merged.theme.cardArt,
            backdropUrl:
              prevCardArt.backdropUrl ?? merged.theme.cardArt.backdropUrl,
          },
    },
    content: {
      ...merged.content,
      headline: sameDomain
        ? s.designData.content.headline || merged.content.headline
        : hasCustomHeadline
          ? s.designData.content.headline
          : merged.content.headline,
      hostLine: sameDomain
        ? s.designData.content.hostLine || merged.content.hostLine
        : merged.content.hostLine,
      heroImageUrl: s.designData.content.heroImageUrl,
      gallery: s.designData.content.gallery,
      couple: sameDomain
        ? {
            ...merged.content.couple,
            brideName: prevCouple.brideName || merged.content.couple.brideName,
            brideRole: prevCouple.brideRole || merged.content.couple.brideRole,
            brideImageUrl:
              prevCouple.brideImageUrl ?? merged.content.couple.brideImageUrl,
            groomName: prevCouple.groomName || merged.content.couple.groomName,
            groomRole: prevCouple.groomRole || merged.content.couple.groomRole,
            groomImageUrl:
              prevCouple.groomImageUrl ?? merged.content.couple.groomImageUrl,
            crestText: prevCouple.crestText || merged.content.couple.crestText,
          }
        : {
            ...merged.content.couple,
            brideImageUrl:
              prevCouple.brideImageUrl ?? merged.content.couple.brideImageUrl,
            groomImageUrl:
              prevCouple.groomImageUrl ?? merged.content.couple.groomImageUrl,
          },
    },
  };
}

export const useStudioStore = create<StudioState>((set) => ({
  eventMeta: initialMeta,
  designData: DEFAULT_DESIGN_DATA,
  activeTab: "theme",
  previewDevice: "mobile",
  previewStage: "sealed",
  replayCounter: 0,
  isDirty: false,
  isSaving: false,
  lastSavedAt: null,

  hydrateEvent: (event) =>
    set({
      eventMeta: {
        id: event.id,
        slug: event.slug,
        title: event.title,
        event_type: event.event_type,
        event_date: event.event_date,
        venue_name: event.venue_name,
        venue_address: event.venue_address ?? "",
        venue_map_url: event.venue_map_url ?? "",
        template_id: event.template_id,
        audio_url: event.audio_url,
        is_published: event.is_published,
      },
      designData: mergeDesignData(event.design_data),
      isDirty: false,
      previewStage: "sealed",
      lastSavedAt: event.updated_at,
    }),

  setActiveTab: (activeTab) => set({ activeTab }),
  setPreviewDevice: (previewDevice) => set({ previewDevice }),
  setPreviewStage: (previewStage) => set({ previewStage }),
  triggerReplay: () =>
    set((s) => ({
      previewStage: "sealed",
      replayCounter: s.replayCounter + 1,
    })),

  updateMeta: (patch) =>
    set((s) => ({
      eventMeta: { ...s.eventMeta, ...patch },
      isDirty: true,
    })),

  applyTemplate: (template) =>
    set((s) => ({
      eventMeta: {
        ...s.eventMeta,
        template_id: template.id,
        event_type: template.category,
      },
      designData: buildAppliedTemplateDesign(s, template),
      isDirty: true,
    })),

  switchEventCategory: (nextCategory, availableTemplates = STARTER_TEMPLATES) =>
    set((s) => {
      const normalizedNext = nextCategory.trim().toLowerCase();
      const prevDomain = getDomainForCategory(s.eventMeta.event_type);
      const nextDomain = getDomainForCategory(normalizedNext);

      if (prevDomain !== nextDomain) {
        const pool =
          availableTemplates.length > 0 ? availableTemplates : STARTER_TEMPLATES;
        const targetTemplate =
          pool.find((t) => t.category.toLowerCase() === normalizedNext) ??
          pool.find((t) => getDomainForCategory(t.category) === nextDomain) ??
          STARTER_TEMPLATES.find(
            (t) => getDomainForCategory(t.category) === nextDomain
          );

        if (targetTemplate) {
          return {
            eventMeta: {
              ...s.eventMeta,
              template_id: targetTemplate.id,
              event_type: nextCategory,
            },
            designData: buildAppliedTemplateDesign(s, targetTemplate),
            isDirty: true,
          };
        }
      }

      const nextMeta = getInvitationTypeMeta(nextCategory);
      const currentLayout = s.designData.content.couple.layout;
      const nextLayout = nextMeta.isSoloDefault
        ? "featured-solo"
        : currentLayout === "featured-solo"
          ? "side-by-side"
          : currentLayout;

      return {
        eventMeta: {
          ...s.eventMeta,
          event_type: nextCategory,
        },
        designData: {
          ...s.designData,
          content: {
            ...s.designData.content,
            couple: {
              ...s.designData.content.couple,
              layout: nextLayout,
            },
          },
        },
        isDirty: true,
      };
    }),

  updatePalette: (patch) =>
    set((s) => ({
      designData: {
        ...s.designData,
        theme: {
          ...s.designData.theme,
          palette: { ...s.designData.theme.palette, ...patch },
        },
      },
      isDirty: true,
    })),

  updateTypography: (patch) =>
    set((s) => ({
      designData: {
        ...s.designData,
        theme: {
          ...s.designData.theme,
          typography: { ...s.designData.theme.typography, ...patch },
        },
      },
      isDirty: true,
    })),

  updateCardArt: (patch) =>
    set((s) => ({
      designData: {
        ...s.designData,
        theme: {
          ...s.designData.theme,
          cardArt: { ...s.designData.theme.cardArt, ...patch },
        },
      },
      isDirty: true,
    })),

  setPaperTexture: (paperTexture) =>
    set((s) => ({
      designData: {
        ...s.designData,
        theme: { ...s.designData.theme, paperTexture },
      },
      isDirty: true,
    })),

  updateEnvelope: (patch) =>
    set((s) => ({
      designData: {
        ...s.designData,
        envelope: { ...s.designData.envelope, ...patch },
      },
      isDirty: true,
    })),

  updateWaxSeal: (patch) =>
    set((s) => ({
      designData: {
        ...s.designData,
        envelope: {
          ...s.designData.envelope,
          waxSeal: { ...s.designData.envelope.waxSeal, ...patch },
        },
      },
      isDirty: true,
    })),

  updateContent: (patch) =>
    set((s) => ({
      designData: {
        ...s.designData,
        content: { ...s.designData.content, ...patch },
      },
      isDirty: true,
    })),

  updateCouple: (patch) =>
    set((s) => ({
      designData: {
        ...s.designData,
        content: {
          ...s.designData.content,
          couple: { ...s.designData.content.couple, ...patch },
        },
      },
      isDirty: true,
    })),

  updateSections: (patch) =>
    set((s) => ({
      designData: {
        ...s.designData,
        sections: { ...s.designData.sections, ...patch },
      },
      isDirty: true,
    })),

  setItinerary: (itinerary) =>
    set((s) => ({
      designData: {
        ...s.designData,
        content: {
          ...s.designData.content,
          itinerary,
        },
      },
      isDirty: true,
    })),

  addItineraryItem: (item) =>
    set((s) => ({
      designData: {
        ...s.designData,
        content: {
          ...s.designData.content,
          itinerary: [...s.designData.content.itinerary, item],
        },
      },
      isDirty: true,
    })),

  updateItineraryItem: (id, patch) =>
    set((s) => ({
      designData: {
        ...s.designData,
        content: {
          ...s.designData.content,
          itinerary: s.designData.content.itinerary.map((item) =>
            item.id === id ? { ...item, ...patch } : item
          ),
        },
      },
      isDirty: true,
    })),

  removeItineraryItem: (id) =>
    set((s) => ({
      designData: {
        ...s.designData,
        content: {
          ...s.designData.content,
          itinerary: s.designData.content.itinerary.filter(
            (item) => item.id !== id
          ),
        },
      },
      isDirty: true,
    })),

  addGalleryPhoto: (photo) =>
    set((s) => ({
      designData: {
        ...s.designData,
        content: {
          ...s.designData.content,
          gallery: [...s.designData.content.gallery, photo].slice(0, 8),
        },
      },
      isDirty: true,
    })),

  removeGalleryPhoto: (id) =>
    set((s) => ({
      designData: {
        ...s.designData,
        content: {
          ...s.designData.content,
          gallery: s.designData.content.gallery.filter((p) => p.id !== id),
        },
      },
      isDirty: true,
    })),

  updateMotion: (patch) =>
    set((s) => ({
      designData: {
        ...s.designData,
        motion: { ...s.designData.motion, ...patch },
      },
      isDirty: true,
    })),

  updateAudio: (patch) =>
    set((s) => ({
      designData: {
        ...s.designData,
        audio: { ...s.designData.audio, ...patch },
      },
      isDirty: true,
    })),

  setSaving: (isSaving) => set({ isSaving }),
  markSaved: () =>
    set({
      isDirty: false,
      isSaving: false,
      lastSavedAt: new Date().toISOString(),
    }),
}));

