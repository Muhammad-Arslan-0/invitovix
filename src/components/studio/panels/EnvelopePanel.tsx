"use client";

import { memo } from "react";
import * as Switch from "@radix-ui/react-switch";
import { useStudioStore } from "@/store/useStudioStore";

export const EnvelopePanel = memo(function EnvelopePanel() {
  const envelope = useStudioStore((s) => s.designData.envelope);
  const updateEnvelope = useStudioStore((s) => s.updateEnvelope);
  const updateWaxSeal = useStudioStore((s) => s.updateWaxSeal);
  const setPreviewStage = useStudioStore((s) => s.setPreviewStage);

  return (
    <div className="space-y-6">
      {/* Envelope Geometry */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Envelope Cut
          </h3>
          <button
            type="button"
            onClick={() => setPreviewStage("sealed")}
            className="text-[11px] font-medium text-amber-700 hover:underline cursor-pointer"
          >
            View Sealed State
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {(
            [
              { id: "royal-flap", label: "Royal Flap" },
              { id: "arch-pocket", label: "Arch Pocket" },
              { id: "minimal-folio", label: "Minimal Folio" },
              { id: "art-deco", label: "Art Deco" },
            ] as const
          ).map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => {
                setPreviewStage("sealed");
                updateEnvelope({ style: style.id });
              }}
              className={`rounded-xl border px-3 py-2 text-xs font-medium transition cursor-pointer ${
                envelope.style === style.id
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-stone-200 text-stone-700 hover:bg-stone-50"
              }`}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>

      {/* Envelope Colors */}
      <div className="grid grid-cols-2 gap-2.5">
        <label className="flex items-center justify-between rounded-xl border border-stone-200 px-3 py-2 text-xs cursor-pointer">
          <span className="text-stone-700">Envelope</span>
          <input
            type="color"
            value={envelope.envelopeColor}
            onChange={(e) => {
              setPreviewStage("sealed");
              updateEnvelope({ envelopeColor: e.target.value });
            }}
            className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between rounded-xl border border-stone-200 px-3 py-2 text-xs cursor-pointer">
          <span className="text-stone-700">Foil Trim</span>
          <input
            type="color"
            value={envelope.linerColor}
            onChange={(e) => {
              setPreviewStage("sealed");
              updateEnvelope({ linerColor: e.target.value });
            }}
            className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer"
          />
        </label>
      </div>

      {/* Wax Seal Controls */}
      <div className="rounded-2xl border border-stone-200 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold text-stone-900">
              Embossed Wax Seal
            </h3>
            <p className="text-[11px] text-stone-500">
              Interactive tap-to-open crest
            </p>
          </div>
          <Switch.Root
            checked={envelope.waxSeal.enabled}
            onCheckedChange={(checked) => {
              setPreviewStage("sealed");
              updateWaxSeal({ enabled: checked });
            }}
            className="w-10 h-5.5 rounded-full bg-stone-300 data-[state=checked]:bg-stone-900 relative transition cursor-pointer"
          >
            <Switch.Thumb className="block w-4 h-4 rounded-full bg-white translate-x-0.5 transition-transform data-[state=checked]:translate-x-5" />
          </Switch.Root>
        </div>

        {envelope.waxSeal.enabled && (
          <>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs text-stone-600 mb-1">
                  Monogram
                </label>
                <input
                  type="text"
                  maxLength={5}
                  value={envelope.waxSeal.monogram}
                  onChange={(e) => {
                    setPreviewStage("sealed");
                    updateWaxSeal({ monogram: e.target.value.toUpperCase() });
                  }}
                  placeholder="A&Z"
                  className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs uppercase focus:border-stone-900 focus:outline-none"
                />
              </div>

              <label className="flex flex-col justify-between">
                <span className="text-xs text-stone-600 mb-1">Wax Color</span>
                <div className="flex items-center justify-between rounded-xl border border-stone-200 px-3 py-1.5">
                  <span className="text-[11px] font-mono text-stone-500">
                    {envelope.waxSeal.color}
                  </span>
                  <input
                    type="color"
                    value={envelope.waxSeal.color}
                    onChange={(e) => {
                      setPreviewStage("sealed");
                      updateWaxSeal({ color: e.target.value });
                    }}
                    className="w-5 h-5 border-0 bg-transparent cursor-pointer"
                  />
                </div>
              </label>
            </div>

            <div>
              <label className="block text-xs text-stone-600 mb-1.5">
                Crest Emblem
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  ["monogram", "floral", "crown", "crescent", "star"] as const
                ).map((emb) => (
                  <button
                    key={emb}
                    type="button"
                    onClick={() => {
                      setPreviewStage("sealed");
                      updateWaxSeal({ emblem: emb });
                    }}
                    className={`rounded-lg border py-1.5 text-[11px] capitalize cursor-pointer ${
                      envelope.waxSeal.emblem === emb
                        ? "border-stone-900 bg-stone-900 text-white"
                        : "border-stone-200 text-stone-700"
                    }`}
                  >
                    {emb}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Tap Prompt */}
      <div>
        <label className="block text-xs font-medium text-stone-700 mb-1">
          Guest Tap Prompt
        </label>
        <input
          type="text"
          value={envelope.promptText}
          onChange={(e) => {
            setPreviewStage("sealed");
            updateEnvelope({ promptText: e.target.value });
          }}
          className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-stone-900 focus:outline-none"
        />
      </div>
    </div>
  );
});

