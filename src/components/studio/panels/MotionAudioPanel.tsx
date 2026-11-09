"use client";

import * as Switch from "@radix-ui/react-switch";
import { Play, Square } from "lucide-react";
import { useState } from "react";
import { useStudioStore } from "@/store/useStudioStore";
import { AUDIO_TRACK_PRESETS } from "@/lib/templates/presets";
import { audioEngine } from "@/lib/audio/audioEngine";
import { MediaUploader } from "../MediaUploader";

interface MotionAudioPanelProps {
  userId: string;
}

export function MotionAudioPanel({ userId }: MotionAudioPanelProps) {
  const { eventMeta, designData, updateMotion, updateAudio, updateMeta } =
    useStudioStore();
  const { motion, audio } = designData;
  const [testingAudio, setTestingAudio] = useState(false);

  function handleTestAudio() {
    if (testingAudio) {
      audioEngine.stopAndUnload();
      setTestingAudio(false);
      return;
    }
    const src = audioEngine.resolveSource(audio);
    if (src) {
      audioEngine.setMuted(false);
      audioEngine.unlockAndPlay(src, audio.volume);
      setTestingAudio(true);
    }
  }

  return (
    <div className="space-y-6">
      {/* Animation Style */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          Choreography &amp; Effects
        </h3>

        <div>
          <label className="block text-xs text-stone-600 mb-1.5">
            Reveal Pacing
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { id: "royal-unfold", label: "Royal Unfold" },
                { id: "cinematic-silk", label: "Cinematic Silk" },
                { id: "playful-pop", label: "Playful Pop" },
                { id: "editorial-fade", label: "Editorial Fade" },
              ] as const
            ).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => updateMotion({ preset: p.id })}
                className={`rounded-xl border py-2 px-2.5 text-xs font-medium cursor-pointer ${
                  motion.preset === p.id
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-200 text-stone-700 hover:bg-stone-50"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs text-stone-600 mb-1.5">
            Ambient Particles
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {(
              ["none", "gold-dust", "petals", "confetti", "starlight"] as const
            ).map((part) => (
              <button
                key={part}
                type="button"
                onClick={() => updateMotion({ particles: part })}
                className={`rounded-lg border py-1.5 text-[11px] capitalize cursor-pointer ${
                  motion.particles === part
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-200 text-stone-700"
                }`}
              >
                {part.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs text-stone-600 mb-1.5">
            Unseal Lottie Flourish
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {(
              [
                { id: "floral-flourish", label: "Floral Bloom" },
                { id: "confetti-burst", label: "Confetti Burst" },
                { id: "sparkle-ring", label: "Sparkle Ring" },
                { id: "none", label: "None" },
              ] as const
            ).map((lot) => (
              <button
                key={lot.id}
                type="button"
                onClick={() => updateMotion({ lottieAccent: lot.id })}
                className={`rounded-lg border py-1.5 text-[11px] cursor-pointer ${
                  motion.lottieAccent === lot.id
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-200 text-stone-700"
                }`}
              >
                {lot.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Audio Configuration */}
      <div className="space-y-4 border-t border-stone-200 pt-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold text-stone-900">
              Background Music
            </h3>
            <p className="text-[11px] text-stone-500">
              Unlocks on guest&apos;s tap-to-open gesture
            </p>
          </div>
          <Switch.Root
            checked={audio.enabled}
            onCheckedChange={(checked) => updateAudio({ enabled: checked })}
            className="w-10 h-5.5 rounded-full bg-stone-300 data-[state=checked]:bg-stone-900 relative transition cursor-pointer"
          >
            <Switch.Thumb className="block w-4 h-4 rounded-full bg-white translate-x-0.5 transition-transform data-[state=checked]:translate-x-5" />
          </Switch.Root>
        </div>

        {audio.enabled && (
          <>
            <div className="space-y-2">
              {AUDIO_TRACK_PRESETS.map((track) => {
                const active = audio.trackId === track.id;
                return (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => {
                      updateAudio({
                        trackId: track.id,
                        trackTitle: track.title,
                        customUrl: null,
                      });
                      updateMeta({ audio_url: track.src });
                    }}
                    className={`w-full flex items-center justify-between rounded-xl border px-3 py-2.5 text-left transition cursor-pointer ${
                      active
                        ? "border-stone-900 bg-stone-50 ring-1 ring-stone-900"
                        : "border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    <div>
                      <p className="text-xs font-medium text-stone-900">
                        {track.title}
                      </p>
                      <p className="text-[11px] text-stone-500">{track.mood}</p>
                    </div>
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        active ? "bg-amber-600" : "bg-stone-200"
                      }`}
                    />
                  </button>
                );
              })}

              {audio.trackId === "custom" && audio.customUrl && (
                <div className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-950">
                  Custom Track: <strong>{audio.trackTitle}</strong>
                </div>
              )}
            </div>

            <MediaUploader
              userId={userId}
              eventId={eventMeta.id}
              accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg"
              label="Upload Custom MP3 / WAV Track"
              folder="audio"
              onUploaded={(url, fileName) => {
                const cleanTitle = fileName.replace(/\.[^/.]+$/, "");
                updateAudio({
                  trackId: "custom",
                  trackTitle: cleanTitle,
                  customUrl: url,
                });
                updateMeta({ audio_url: url });
              }}
            />

            <div>
              <div className="flex items-center justify-between text-xs text-stone-600 mb-1">
                <span>Playback Volume</span>
                <span>{Math.round(audio.volume * 100)}%</span>
              </div>
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={audio.volume}
                onChange={(e) => {
                  const vol = Number(e.target.value);
                  updateAudio({ volume: vol });
                  audioEngine.setVolume(vol);
                }}
                className="w-full accent-stone-900"
              />
            </div>

            <button
              type="button"
              onClick={handleTestAudio}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 py-2 text-xs font-medium text-stone-800 hover:bg-stone-50 cursor-pointer"
            >
              {testingAudio ? (
                <>
                  <Square className="w-3.5 h-3.5" />
                  <span>Stop Audio Preview</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Test Sound Preview</span>
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

