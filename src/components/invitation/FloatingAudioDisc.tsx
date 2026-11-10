"use client";

import { Disc3, RotateCcw, VolumeX } from "lucide-react";
import { EventDesignData } from "@/types/invitation";

interface FloatingAudioDiscProps {
  designData: EventDesignData;
  isMuted: boolean;
  onToggleMute: () => void;
  onReplay: () => void;
  bounded?: boolean;
  hasDraftBanner?: boolean;
}

export function FloatingAudioDisc({
  designData,
  isMuted,
  onToggleMute,
  onReplay,
  bounded = false,
  hasDraftBanner = false,
}: FloatingAudioDiscProps) {
  const { theme, audio } = designData;
  const topClass = hasDraftBanner ? "top-12 md:top-3.5" : "top-3.5";
  const posClass = bounded ? `absolute ${topClass}` : `fixed md:absolute ${topClass}`;

  return (
    <div
      className={`${posClass} right-3.5 z-40 flex items-center gap-1.5 pointer-events-none`}
    >
      <button
        type="button"
        onClick={onReplay}
        className="pointer-events-auto inline-flex items-center gap-1 rounded-full px-2.5 py-2 text-[11px] font-medium backdrop-blur-md border shadow-md transition hover:scale-105 cursor-pointer"
        style={{
          backgroundColor: `${theme.palette.surface}E8`,
          borderColor: `${theme.palette.accent}55`,
          color: theme.palette.text,
        }}
        title="Replay envelope reveal"
        aria-label="Replay envelope reveal"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Replay</span>
      </button>

      {audio.enabled && (
        <button
          type="button"
          onClick={onToggleMute}
          className="pointer-events-auto group relative inline-flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-md border shadow-lg transition hover:scale-105 cursor-pointer"
          style={{
            backgroundColor: `${theme.palette.surface}EC`,
            borderColor: `${theme.palette.accent}70`,
            color: theme.palette.text,
          }}
          title={
            isMuted
              ? `Play ${audio.trackTitle}`
              : `Playing: ${audio.trackTitle} (click to mute)`
          }
          aria-label={isMuted ? "Unmute music" : "Mute music"}
        >
          {isMuted ? (
            <VolumeX
              className="w-4 h-4 opacity-75"
              style={{ color: theme.palette.mutedText }}
            />
          ) : (
            <>
              <span
                aria-hidden="true"
                className="absolute inset-0.5 rounded-full opacity-30 animate-ping"
                style={{ border: `1px solid ${theme.palette.accent}` }}
              />
              <Disc3
                className="w-5 h-5 animate-disc-spin"
                style={{ color: theme.palette.accent }}
              />
            </>
          )}
        </button>
      )}
    </div>
  );
}

