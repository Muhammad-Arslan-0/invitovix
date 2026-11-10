"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const NAV_START_EVENT = "invitovix:nav-start";
const NAV_DONE_EVENT = "invitovix:nav-done";

export function startNavigation() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(NAV_START_EVENT));
  }
}

export function stopNavigation() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(NAV_DONE_EVENT));
  }
}

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const begin = () => {
    clearTimers();
    setVisible(true);
    setProgress(16);

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        const step = prev < 50 ? 9 : prev < 75 ? 4 : 1.5;
        return Math.min(90, prev + step);
      });
    }, 180);
  };

  const complete = () => {
    clearTimers();
    setProgress(100);
    hideTimerRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 260);
  };

  useEffect(() => {
    complete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  useEffect(() => {
    const onStart = () => begin();
    const onDone = () => complete();

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      const targetAttr = anchor.getAttribute("target");
      if (
        !href ||
        targetAttr === "_blank" ||
        anchor.hasAttribute("download") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return;
      }

      try {
        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) return;
        const nextRoute = `${url.pathname}${url.search}`;
        const currentRoute = `${window.location.pathname}${window.location.search}`;
        if (nextRoute === currentRoute) return;
        begin();
      } catch {
        // Ignore malformed URLs
      }
    };

    window.addEventListener(NAV_START_EVENT, onStart);
    window.addEventListener(NAV_DONE_EVENT, onDone);
    document.addEventListener("click", onClick, true);

    return () => {
      clearTimers();
      window.removeEventListener(NAV_START_EVENT, onStart);
      window.removeEventListener(NAV_DONE_EVENT, onDone);
      document.removeEventListener("click", onClick, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 right-0 z-[100] h-[3px] bg-transparent"
    >
      <div
        className="h-full transition-[width] duration-200 ease-out relative"
        style={{
          width: `${progress}%`,
          background:
            "linear-gradient(90deg, #114232 0%, #C99A3B 55%, #F3D9B1 100%)",
          boxShadow: "0 0 12px rgba(201, 154, 59, 0.75)",
        }}
      >
        <span className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/70" />
      </div>
    </div>
  );
}

