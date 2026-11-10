"use client";

import { memo } from "react";
import { TemplateRecord } from "@/types/invitation";
import { useStudioStore } from "@/store/useStudioStore";

interface ThemePanelProps {
  templates: TemplateRecord[];
}

export const ThemePanel = memo(function ThemePanel({
  templates,
}: ThemePanelProps) {
  const templateId = useStudioStore((s) => s.eventMeta.template_id);
  const theme = useStudioStore((s) => s.designData.theme);
  const applyTemplate = useStudioStore((s) => s.applyTemplate);
  const updatePalette = useStudioStore((s) => s.updatePalette);
  const updateTypography = useStudioStore((s) => s.updateTypography);
  const setPaperTexture = useStudioStore((s) => s.setPaperTexture);

  const { palette, typography, paperTexture } = theme;

  return (
    <div className="space-y-6">
      {/* Starter Template Switcher */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2.5">
          Starter Templates
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {templates.map((tpl) => {
            const active = templateId === tpl.id;
            const p = tpl.default_config.theme.palette;
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => applyTemplate(tpl)}
                className={`rounded-2xl border p-2.5 text-left transition cursor-pointer ${
                  active
                    ? "border-stone-900 bg-stone-50 ring-1 ring-stone-900"
                    : "border-stone-200 hover:border-stone-300"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/10"
                    style={{ backgroundColor: p.background }}
                  />
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/10"
                    style={{ backgroundColor: p.primary }}
                  />
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/10"
                    style={{ backgroundColor: p.accent }}
                  />
                </div>
                <p className="text-xs font-medium text-stone-900 line-clamp-1">
                  {tpl.title}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-stone-400">
                  {tpl.category}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Palette */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2.5">
          Color Palette
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {(
            [
              { key: "background", label: "Backdrop" },
              { key: "surface", label: "Card Surface" },
              { key: "primary", label: "Primary" },
              { key: "accent", label: "Gold / Accent" },
              { key: "text", label: "Body Text" },
              { key: "mutedText", label: "Muted Text" },
            ] as const
          ).map((item) => (
            <label
              key={item.key}
              className="flex items-center justify-between gap-2 rounded-xl border border-stone-200 px-3 py-2 text-xs cursor-pointer"
            >
              <span className="text-stone-700">{item.label}</span>
              <input
                type="color"
                value={palette[item.key]}
                onChange={(e) => updatePalette({ [item.key]: e.target.value })}
                className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          Typography Pairing
        </h3>

        <div>
          <label className="block text-xs text-stone-600 mb-1">
            Display Heading Font
          </label>
          <select
            value={typography.displayFont}
            onChange={(e) =>
              updateTypography({
                displayFont: e.target.value as typeof typography.displayFont,
              })
            }
            className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs focus:border-stone-900 focus:outline-none"
          >
            <option value="cinzel">Cinzel (Royal Serif)</option>
            <option value="playfair">Playfair Display (Editorial)</option>
            <option value="cormorant">Cormorant Garamond (Classic)</option>
            <option value="syne">Syne (Modern Bold)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-stone-600 mb-1">
            Body Copy Font
          </label>
          <select
            value={typography.bodyFont}
            onChange={(e) =>
              updateTypography({
                bodyFont: e.target.value as typeof typography.bodyFont,
              })
            }
            className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs focus:border-stone-900 focus:outline-none"
          >
            <option value="cormorant">Cormorant Garamond</option>
            <option value="jakarta">Plus Jakarta Sans</option>
            <option value="dm-sans">DM Sans</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-stone-600 mb-1">
            Script / Accent Font
          </label>
          <select
            value={typography.scriptFont}
            onChange={(e) =>
              updateTypography({
                scriptFont: e.target.value as typeof typography.scriptFont,
              })
            }
            className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs focus:border-stone-900 focus:outline-none"
          >
            <option value="great-vibes">Great Vibes (Calligraphy)</option>
            <option value="cormorant">Cormorant Italic</option>
          </select>
        </div>
      </div>

      {/* Paper Texture */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
          Card Paper Texture
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {(["linen", "vellum", "silk", "obsidian", "clean"] as const).map(
            (tex) => (
              <button
                key={tex}
                type="button"
                onClick={() => setPaperTexture(tex)}
                className={`rounded-xl border py-2 text-xs capitalize transition cursor-pointer ${
                  paperTexture === tex
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-200 text-stone-700 hover:bg-stone-50"
                }`}
              >
                {tex}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
});

