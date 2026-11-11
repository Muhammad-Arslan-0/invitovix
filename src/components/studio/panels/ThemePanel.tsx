"use client";

import { memo, useState } from "react";
import { ImagePlus, Sparkles, Trash2 } from "lucide-react";
import { TemplateRecord } from "@/types/invitation";
import { useStudioStore } from "@/store/useStudioStore";
import {
  INVITATION_DOMAINS,
  formatCategoryBadge,
  getDomainConfig,
  getDomainForCategory,
} from "@/lib/templates/categories";
import {
  CARD_BACKDROP_PRESETS,
  CARD_BORDER_OPTIONS,
  CARD_MOTIF_OPTIONS,
  HERO_FRAME_OPTIONS,
  getBackdropPresetsForDomain,
  getTemplatesByDomain,
  resolveCardBackdropUrl,
} from "@/lib/templates/presets";
import { MediaUploader } from "../MediaUploader";

interface ThemePanelProps {
  templates: TemplateRecord[];
  userId?: string;
}

export const ThemePanel = memo(function ThemePanel({
  templates,
  userId,
}: ThemePanelProps) {
  const eventId = useStudioStore((s) => s.eventMeta.id);
  const eventType = useStudioStore((s) => s.eventMeta.event_type);
  const templateId = useStudioStore((s) => s.eventMeta.template_id);
  const theme = useStudioStore((s) => s.designData.theme);
  const applyTemplate = useStudioStore((s) => s.applyTemplate);
  const switchEventCategory = useStudioStore((s) => s.switchEventCategory);
  const updatePalette = useStudioStore((s) => s.updatePalette);
  const updateTypography = useStudioStore((s) => s.updateTypography);
  const updateCardArt = useStudioStore((s) => s.updateCardArt);
  const setPaperTexture = useStudioStore((s) => s.setPaperTexture);
  const setPreviewStage = useStudioStore((s) => s.setPreviewStage);

  const [showAllScenes, setShowAllScenes] = useState(false);

  const { palette, typography, paperTexture, cardArt } = theme;
  const activeBackdropUrl = resolveCardBackdropUrl(cardArt);
  const currentDomain = getDomainForCategory(eventType);
  const domainConfig = getDomainConfig(currentDomain);
  const domainTemplates = getTemplatesByDomain(templates, currentDomain);
  const domainScenes = showAllScenes
    ? CARD_BACKDROP_PRESETS
    : getBackdropPresetsForDomain(currentDomain);

  return (
    <div className="space-y-6">
      {/* Invitation Category Switcher */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
          Invitation Category
        </h3>
        <div
          role="group"
          aria-label="Invitation Category"
          className="grid grid-cols-2 gap-1.5"
        >
          {INVITATION_DOMAINS.map((domain) => {
            const active = domain.id === currentDomain;
            return (
              <button
                key={domain.id}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  switchEventCategory(domain.subCategories[0].id, templates)
                }
                className={`rounded-xl border px-2.5 py-2 text-left transition cursor-pointer ${
                  active
                    ? "border-stone-900 bg-stone-900 text-white shadow-2xs"
                    : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
                }`}
              >
                <p className="text-[11px] font-semibold leading-tight">
                  {domain.label}
                </p>
                <p
                  className={`text-[9.5px] mt-0.5 line-clamp-1 ${
                    active ? "text-amber-200/90" : "text-stone-400"
                  }`}
                >
                  {domain.subLabel}
                </p>
              </button>
            );
          })}
        </div>

        {domainConfig.subCategories.length > 1 && (
          <div className="mt-2.5">
            <p className="text-[10px] font-medium uppercase tracking-wider text-stone-400 mb-1.5">
              Event Focus
            </p>
            <div className="flex flex-wrap gap-1.5">
              {domainConfig.subCategories.map((sub) => {
                const subActive =
                  (eventType ?? "wedding").trim().toLowerCase() === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => switchEventCategory(sub.id, templates)}
                    className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition cursor-pointer ${
                      subActive
                        ? "bg-amber-600 text-white shadow-2xs"
                        : "border border-stone-200 bg-stone-50 text-stone-600 hover:bg-white"
                    }`}
                  >
                    {sub.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Category-Isolated Template Switcher */}
      <div className="border-t border-stone-200 pt-5">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            {domainConfig.templateLabel} Templates
          </h3>
          <span className="text-[10px] text-stone-400 font-medium">
            {domainTemplates.length} styles
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {domainTemplates.map((tpl) => {
            const active = templateId === tpl.id;
            const p = tpl.default_config.theme.palette;
            const bgImg = resolveCardBackdropUrl(
              tpl.default_config.theme.cardArt
            );
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => applyTemplate(tpl)}
                className={`relative overflow-hidden rounded-2xl border p-2.5 text-left transition cursor-pointer ${
                  active
                    ? "border-stone-900 bg-stone-50 ring-1 ring-stone-900"
                    : "border-stone-200 hover:border-stone-300 bg-white"
                }`}
              >
                <div
                  className="h-10 rounded-xl mb-2 relative overflow-hidden border flex items-center justify-between px-2"
                  style={{
                    backgroundColor: p.background,
                    borderColor: `${p.accent}55`,
                  }}
                >
                  {bgImg && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={bgImg}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover opacity-55"
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-1">
                    <span
                      className="w-3 h-3 rounded-full border border-white/60 shadow-2xs"
                      style={{ backgroundColor: p.background }}
                    />
                    <span
                      className="w-3 h-3 rounded-full border border-white/60 shadow-2xs"
                      style={{ backgroundColor: p.primary }}
                    />
                    <span
                      className="w-3 h-3 rounded-full border border-white/60 shadow-2xs"
                      style={{ backgroundColor: p.accent }}
                    />
                  </div>
                  <span
                    className="relative z-10 text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-white/85"
                    style={{ color: p.primary }}
                  >
                    {formatCategoryBadge(tpl.category)}
                  </span>
                </div>
                <p className="text-xs font-medium text-stone-900 line-clamp-1">
                  {tpl.title}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Scenes & Card Background */}
      <div className="border-t border-stone-200 pt-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <ImagePlus className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>{domainConfig.sceneSectionHeading}</span>
          </h3>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowAllScenes((prev) => !prev)}
              className="text-[10px] font-medium text-stone-500 hover:text-stone-900 cursor-pointer"
            >
              {showAllScenes ? "Category only" : "Show all"}
            </button>
            <button
              type="button"
              onClick={() => setPreviewStage("opened")}
              className="text-[11px] font-medium text-amber-700 hover:underline cursor-pointer"
            >
              Preview
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {domainScenes.map((scene) => {
            const active = cardArt.backdropPreset === scene.id;
            return (
              <button
                key={scene.id}
                type="button"
                onClick={() => {
                  setPreviewStage("opened");
                  updateCardArt({ backdropPreset: scene.id });
                }}
                className={`group rounded-xl border p-1.5 text-left transition cursor-pointer ${
                  active
                    ? "border-stone-900 ring-1 ring-stone-900 bg-stone-50"
                    : "border-stone-200 hover:border-stone-300 bg-white"
                }`}
              >
                <div
                  className="h-14 rounded-lg overflow-hidden relative border border-black/5"
                  style={{ background: scene.previewGradient }}
                >
                  {scene.imageUrl && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={scene.imageUrl}
                      alt={scene.label}
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  )}
                </div>
                <p className="mt-1.5 text-[10px] font-semibold text-stone-900 leading-tight line-clamp-1">
                  {scene.label}
                </p>
                <p className="text-[9px] text-stone-400 line-clamp-1">
                  {scene.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* Custom Background Upload */}
        {userId && eventId && (
          <div className="space-y-2 pt-1">
            {cardArt.backdropUrl && (
              <div className="relative rounded-xl overflow-hidden border border-stone-200 h-20 flex items-center justify-between bg-stone-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cardArt.backdropUrl}
                  alt="Custom background preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewStage("opened");
                      updateCardArt({ backdropPreset: "custom" });
                    }}
                    className={`rounded-lg px-2 py-1 text-[10px] font-medium cursor-pointer ${
                      cardArt.backdropPreset === "custom"
                        ? "bg-amber-400 text-stone-950"
                        : "bg-white/90 text-stone-800"
                    }`}
                  >
                    {cardArt.backdropPreset === "custom"
                      ? "Custom Active"
                      : "Use Custom"}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateCardArt({
                        backdropUrl: null,
                        backdropPreset:
                          cardArt.backdropPreset === "custom"
                            ? "none"
                            : cardArt.backdropPreset,
                      })
                    }
                    className="inline-flex items-center gap-1 rounded-lg bg-black/75 px-2 py-1 text-[10px] text-white hover:bg-black cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>
            )}

            <MediaUploader
              userId={userId}
              eventId={eventId}
              accept="image/png,image/jpeg,image/webp"
              label={
                cardArt.backdropUrl
                  ? "Replace Custom Card Background"
                  : "Upload Custom Card Background"
              }
              folder="images"
              onUploaded={(url) => {
                setPreviewStage("opened");
                updateCardArt({
                  backdropPreset: "custom",
                  backdropUrl: url,
                });
              }}
            />
          </div>
        )}

        {activeBackdropUrl && (
          <div className="pt-1">
            <div className="flex items-center justify-between text-xs text-stone-600 mb-1">
              <span>Scene Art Intensity</span>
              <span className="font-mono text-[11px]">
                {Math.round(cardArt.backdropOpacity * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={65}
              value={Math.round(cardArt.backdropOpacity * 100)}
              onChange={(e) => {
                setPreviewStage("opened");
                updateCardArt({
                  backdropOpacity: Number(e.target.value) / 100,
                });
              }}
              className="w-full accent-stone-900"
              aria-label="Scene art intensity"
            />
          </div>
        )}
      </div>

      {/* Floral, Arches & Abstract Art Overlays */}
      <div className="border-t border-stone-200 pt-5 space-y-3.5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Flowers, Arches &amp; Abstract Art</span>
        </h3>

        <div>
          <label className="block text-xs text-stone-600 mb-1.5">
            Decorative Motif Layer
          </label>
          <div className="grid grid-cols-2 gap-2">
            {CARD_MOTIF_OPTIONS.map((item) => {
              const active = cardArt.motif === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setPreviewStage("opened");
                    updateCardArt({ motif: item.id });
                  }}
                  className={`rounded-xl border px-2.5 py-2 text-left transition cursor-pointer ${
                    active
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-200 text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  <p className="text-[11px] font-semibold leading-tight">
                    {item.label}
                  </p>
                  <p
                    className={`text-[9.5px] mt-0.5 line-clamp-1 ${
                      active ? "text-stone-300" : "text-stone-400"
                    }`}
                  >
                    {item.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs text-stone-600 mb-1.5">
            Card Frame Border
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {CARD_BORDER_OPTIONS.map((border) => (
              <button
                key={border.id}
                type="button"
                onClick={() => {
                  setPreviewStage("opened");
                  updateCardArt({ borderStyle: border.id });
                }}
                className={`rounded-xl border py-2 px-1.5 text-[11px] font-medium transition cursor-pointer ${
                  cardArt.borderStyle === border.id
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-200 text-stone-700 hover:bg-stone-50"
                }`}
              >
                {border.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs text-stone-600 mb-1.5">
            Hero Photo Crop Frame
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {HERO_FRAME_OPTIONS.map((frm) => (
              <button
                key={frm.id}
                type="button"
                onClick={() => {
                  setPreviewStage("opened");
                  updateCardArt({ heroFrame: frm.id });
                }}
                className={`rounded-xl border py-2 text-[11px] font-medium transition cursor-pointer ${
                  cardArt.heroFrame === frm.id
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-200 text-stone-700 hover:bg-stone-50"
                }`}
              >
                {frm.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Color Palette */}
      <div className="border-t border-stone-200 pt-5">
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
      <div className="space-y-3 border-t border-stone-200 pt-5">
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
      <div className="border-t border-stone-200 pt-5">
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
