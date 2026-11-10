"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import {
  CalendarClock,
  Heart,
  Images,
  MailCheck,
  MapPin,
  Sparkles,
} from "lucide-react";
import { EventDesignData } from "@/types/invitation";
import { getContrastTextColor } from "@/lib/utils/colors";

export type InvitationSectionId =
  | "invite-hero"
  | "invite-story"
  | "invite-schedule"
  | "invite-venue"
  | "invite-gallery"
  | "invite-rsvp";

interface NavItem {
  id: InvitationSectionId;
  label: string;
  icon: typeof Sparkles;
}

interface InvitationBottomNavProps {
  designData: EventDesignData;
  isStudioPreview?: boolean;
  bounded?: boolean;
  scrollContainerRef?: RefObject<HTMLDivElement | null>;
  isBoundedScroll?: boolean;
  onSelectSection: (sectionId: InvitationSectionId) => void;
}

export function getVisibleInvitationSections(
  designData: EventDesignData,
  isStudioPreview = false
): NavItem[] {
  const { sections, content } = designData;
  const items: NavItem[] = [
    { id: "invite-hero", label: "Cover", icon: Sparkles },
  ];

  if (sections.showCountdown || content.storyQuote) {
    items.push({ id: "invite-story", label: "Story", icon: Heart });
  }
  if (sections.showItinerary && content.itinerary.length > 0) {
    items.push({ id: "invite-schedule", label: "Events", icon: CalendarClock });
  }
  if (sections.showVenue) {
    items.push({ id: "invite-venue", label: "Venue", icon: MapPin });
  }
  if (sections.showGallery && (content.gallery.length > 0 || isStudioPreview)) {
    items.push({ id: "invite-gallery", label: "Gallery", icon: Images });
  }
  if (sections.showRsvp) {
    items.push({ id: "invite-rsvp", label: "RSVP", icon: MailCheck });
  }

  return items;
}

export function InvitationBottomNav({
  designData,
  isStudioPreview = false,
  bounded = false,
  scrollContainerRef,
  isBoundedScroll = false,
  onSelectSection,
}: InvitationBottomNavProps) {
  const { theme } = designData;
  const items = useMemo(
    () => getVisibleInvitationSections(designData, isStudioPreview),
    [designData, isStudioPreview]
  );

  const [activeId, setActiveId] = useState<InvitationSectionId>("invite-hero");
  const resolvedActiveId = items.some((i) => i.id === activeId)
    ? activeId
    : (items[0]?.id ?? "invite-hero");
  const activeIndex = Math.max(
    0,
    items.findIndex((i) => i.id === resolvedActiveId)
  );

  const activeIdRef = useRef<InvitationSectionId>(resolvedActiveId);
  activeIdRef.current = resolvedActiveId;

  const manualLockUntilRef = useRef<number>(0);
  const lockSettleTimerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const computeActiveSection = useCallback(() => {
    if (performance.now() < manualLockUntilRef.current) return;

    const scroller = isBoundedScroll ? scrollContainerRef?.current ?? null : null;
    const elements = items
      .map((item) => ({
        id: item.id,
        el: scroller
          ? ((scroller.querySelector(`#${item.id}`) as HTMLElement | null) ??
            document.getElementById(item.id))
          : document.getElementById(item.id),
      }))
      .filter((entry): entry is { id: InvitationSectionId; el: HTMLElement } =>
        Boolean(entry.el)
      );

    if (elements.length === 0) return;

    let nextId: InvitationSectionId = elements[0].id;

    if (scroller) {
      const { scrollTop, clientHeight, scrollHeight } = scroller;
      if (scrollTop <= 16) {
        nextId = elements[0].id;
      } else if (
        scrollHeight > clientHeight + 24 &&
        scrollTop + clientHeight >= scrollHeight - 28
      ) {
        nextId = elements[elements.length - 1].id;
      } else {
        const rootTop = scroller.getBoundingClientRect().top;
        const probeY = rootTop + clientHeight * 0.35;
        for (const entry of elements) {
          if (entry.el.getBoundingClientRect().top <= probeY + 12) {
            nextId = entry.id;
          }
        }
      }
    } else {
      const scrollY = window.scrollY;
      const winH = window.innerHeight;
      const docH = document.documentElement.scrollHeight;
      if (scrollY <= 16) {
        nextId = elements[0].id;
      } else if (docH > winH + 24 && scrollY + winH >= docH - 28) {
        nextId = elements[elements.length - 1].id;
      } else {
        const probeY = winH * 0.35;
        for (const entry of elements) {
          if (entry.el.getBoundingClientRect().top <= probeY + 12) {
            nextId = entry.id;
          }
        }
      }
    }

    if (nextId !== activeIdRef.current) {
      activeIdRef.current = nextId;
      setActiveId(nextId);
    }
  }, [items, scrollContainerRef, isBoundedScroll]);

  useEffect(() => {
    const scroller = isBoundedScroll ? scrollContainerRef?.current ?? null : null;
    const scrollTarget: HTMLElement | Window | null = isBoundedScroll
      ? scroller
      : typeof window !== "undefined"
        ? window
        : null;

    if (!scrollTarget) return;

    const scheduleSync = () => {
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        computeActiveSection();
      });
    };

    const releaseManualLock = () => {
      manualLockUntilRef.current = 0;
    };

    computeActiveSection();
    scrollTarget.addEventListener("scroll", scheduleSync, { passive: true });
    scrollTarget.addEventListener("wheel", releaseManualLock, { passive: true });
    scrollTarget.addEventListener("touchstart", releaseManualLock, {
      passive: true,
    });
    window.addEventListener("resize", scheduleSync, { passive: true });

    return () => {
      scrollTarget.removeEventListener("scroll", scheduleSync);
      scrollTarget.removeEventListener("wheel", releaseManualLock);
      scrollTarget.removeEventListener("touchstart", releaseManualLock);
      window.removeEventListener("resize", scheduleSync);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [computeActiveSection, scrollContainerRef, isBoundedScroll]);

  useEffect(() => {
    return () => {
      if (lockSettleTimerRef.current !== null) {
        window.clearTimeout(lockSettleTimerRef.current);
      }
    };
  }, []);

  if (items.length <= 1) return null;

  const activeTextColor = getContrastTextColor(theme.palette.primary);
  const posClass = bounded ? "absolute bottom-2.5 sm:bottom-3" : "fixed md:absolute bottom-2.5 sm:bottom-3";

  const handleSelect = (sectionId: InvitationSectionId) => {
    manualLockUntilRef.current = performance.now() + 700;
    if (lockSettleTimerRef.current !== null) {
      window.clearTimeout(lockSettleTimerRef.current);
    }
    activeIdRef.current = sectionId;
    setActiveId(sectionId);
    onSelectSection(sectionId);
    lockSettleTimerRef.current = window.setTimeout(() => {
      manualLockUntilRef.current = 0;
      computeActiveSection();
    }, 720);
  };

  return (
    <nav
      aria-label="Invitation sections"
      data-testid="invitation-bottom-nav"
      className={`${posClass} inset-x-2.5 sm:inset-x-3 z-40 flex justify-center pointer-events-none`}
    >
      <div
        className="pointer-events-auto relative w-full max-w-[408px] flex items-stretch rounded-2xl border p-1 shadow-[0_14px_34px_-10px_rgba(0,0,0,0.42)] backdrop-blur-md"
        style={{
          backgroundColor: `${theme.palette.surface}ED`,
          borderColor: `${theme.palette.accent}52`,
        }}
      >
        {/* Pure compositor sliding active tab indicator (zero layout reflow) */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1 bottom-1 left-1 rounded-xl shadow-xs transition-transform duration-200 ease-out"
          style={{
            width: `calc((100% - 8px) / ${items.length})`,
            transform: `translate3d(${activeIndex * 100}%, 0, 0)`,
            backgroundColor: theme.palette.primary,
          }}
        />

        {items.map((item) => {
          const Icon = item.icon;
          const active = resolvedActiveId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              style={{
                color: active ? activeTextColor : theme.palette.mutedText,
              }}
              className="relative z-10 flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 text-[10px] font-medium leading-tight tracking-tight transition-colors duration-150 cursor-pointer select-none"
              aria-current={active ? "location" : undefined}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate max-w-full">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
