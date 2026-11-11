import { BrandMark } from "./BrandMark";

interface LuxLoaderProps {
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

export function LuxLoader({
  title = "Preparing Invitovix",
  subtitle = "Polishing typography, animations, and assets...",
  compact = false,
}: LuxLoaderProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${
        compact ? "py-6" : "min-h-[60vh] px-6 py-16"
      }`}
    >
      <div className="relative flex items-center justify-center">
        {/* Ambient expanding halo */}
        <span
          aria-hidden="true"
          className="absolute w-20 h-20 rounded-full bg-amber-400/20 animate-ping"
          style={{ animationDuration: "2s" }}
        />
        <span
          aria-hidden="true"
          className="absolute w-16 h-16 rounded-full border border-amber-500/40 animate-spin"
          style={{ animationDuration: "6s" }}
        />
        {/* Brushed gold envelope emblem */}
        <BrandMark
          size="lg"
          decorative
          className="relative w-12 h-12"
        />
      </div>

      <h2
        className="mt-6 text-lg font-semibold tracking-wide text-stone-900"
        style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
      >
        {title}
      </h2>
      <p className="mt-1.5 text-xs sm:text-sm text-stone-500 max-w-xs">
        {subtitle}
      </p>

      {/* Smooth glide bar */}
      <div className="mt-5 w-44 h-1 rounded-full bg-stone-200/80 overflow-hidden">
        <div
          className="h-full w-2/5 rounded-full animate-bar-glide"
          style={{
            background:
              "linear-gradient(90deg, transparent, #C99A3B, #114232, transparent)",
          }}
        />
      </div>
    </div>
  );
}

