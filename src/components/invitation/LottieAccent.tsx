"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode } from "react";
import { EventDesignData } from "@/types/invitation";

const DotLottieReact = dynamic(
  () =>
    import("@lottiefiles/dotlottie-react").then((mod) => mod.DotLottieReact),
  { ssr: false }
);

class LottieErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

interface LottieAccentProps {
  kind: EventDesignData["motion"]["lottieAccent"];
  loop?: boolean;
  className?: string;
}

const LOTTIE_PATHS: Record<
  Exclude<EventDesignData["motion"]["lottieAccent"], "none">,
  string
> = {
  "confetti-burst": "/lottie/confetti-burst.json",
  "floral-flourish": "/lottie/floral-flourish.json",
  "sparkle-ring": "/lottie/sparkle-ring.json",
};

export function LottieAccent({
  kind,
  loop = false,
  className = "w-48 h-48",
}: LottieAccentProps) {
  if (kind === "none") return null;
  const src = LOTTIE_PATHS[kind];

  return (
    <LottieErrorBoundary>
      <div className={`pointer-events-none select-none ${className}`}>
        <DotLottieReact src={src} autoplay loop={loop} />
      </div>
    </LottieErrorBoundary>
  );
}

