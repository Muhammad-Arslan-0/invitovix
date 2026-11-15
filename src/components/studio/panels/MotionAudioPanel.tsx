"use client";

import { memo, useEffect, useState, useMemo, useRef } from "react";
import * as Switch from "@radix-ui/react-switch";
import {
  Play,
  Square,
  FolderOpen,
  Image as ImageIcon,
  Music2,
  Trash2,
  Upload,
  RefreshCw,
  Search,
  Check,
  HardDrive,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { useStudioStore } from "@/store/useStudioStore";
import { AUDIO_TRACK_PRESETS } from "@/lib/templates/presets";
import { audioEngine } from "@/lib/audio/audioEngine";
import { MediaUploader } from "../MediaUploader";
import {
  AssetItem,
  listUserAssets,
  deleteAsset,
  computeStorageStats,
} from "@/lib/storage/assetManager";
import { createClient } from "@/lib/supabase/client";

interface MotionAudioPanelProps {
  userId: string;
}

export const MotionAudioPanel = memo(function MotionAudioPanel({
  userId,
}: MotionAudioPanelProps) {
  const eventId = useStudioStore((s) => s.eventMeta.id);
  const motion = useStudioStore((s) => s.designData.motion);
  const audio = useStudioStore((s) => s.designData.audio);
  const updateMotion = useStudioStore((s) => s.updateMotion);
  const updateAudio = useStudioStore((s) => s.updateAudio);
  const updateMeta = useStudioStore((s) => s.updateMeta);
  const updateCouple = useStudioStore((s) => s.updateCouple);
  const updateContent = useStudioStore((s) => s.updateContent);
  const updateCardArt = useStudioStore((s) => s.updateCardArt);

  const [testingAudio, setTestingAudio] = useState(false);

  // Panel view filter: "all" | "assets" | "audio"
  const [panelView, setPanelView] = useState<"all" | "assets" | "audio">("all");

  // Storage Assets state
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [assetFilter, setAssetFilter] = useState<"all" | "image" | "audio">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Audio snippet preview player
  const [previewSnippetUrl, setPreviewSnippetUrl] = useState<string | null>(null);
  const snippetAudioRef = useRef<HTMLAudioElement | null>(null);

  // Direct asset uploader
  const directUploadRef = useRef<HTMLInputElement | null>(null);
  const [directUploading, setDirectUploading] = useState(false);

  useEffect(() => {
    return () => {
      audioEngine.stopAndUnload();
      if (snippetAudioRef.current) {
        snippetAudioRef.current.pause();
      }
    };
  }, []);

  // Fetch creator's storage assets
  const fetchAssets = async () => {
    if (!userId) return;
    setLoadingAssets(true);
    try {
      const data = await listUserAssets(userId);
      setAssets(data);
    } finally {
      setLoadingAssets(false);
    }
  };

  useEffect(() => {
    fetchAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const stats = useMemo(() => computeStorageStats(assets), [assets]);

  const filteredAssets = useMemo(() => {
    return assets.filter((item) => {
      if (assetFilter !== "all" && item.type !== assetFilter) return false;
      if (!searchQuery.trim()) return true;
      return item.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [assets, assetFilter, searchQuery]);

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

  function toggleSnippet(url: string) {
    if (previewSnippetUrl === url) {
      snippetAudioRef.current?.pause();
      setPreviewSnippetUrl(null);
    } else {
      if (snippetAudioRef.current) {
        snippetAudioRef.current.src = url;
        snippetAudioRef.current.play().catch(() => {});
        setPreviewSnippetUrl(url);
      }
    }
  }

  // Delete an asset from storage
  async function handleDeleteAsset(asset: AssetItem) {
    setDeletingId(asset.id);
    try {
      const res = await deleteAsset(asset.path);
      if (res.success) {
        setAssets((prev) => prev.filter((a) => a.id !== asset.id));
        setConfirmDeleteId(null);
        if (previewSnippetUrl === asset.publicUrl && snippetAudioRef.current) {
          snippetAudioRef.current.pause();
          setPreviewSnippetUrl(null);
        }
      }
    } finally {
      setDeletingId(null);
    }
  }

  // Handle direct file upload from the Assets manager
  async function handleDirectUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    setDirectUploading(true);
    try {
      const supabase = createClient();
      const isAudio = file.type.startsWith("audio/") || file.name.match(/\.(mp3|wav|ogg)$/i);
      const folder = isAudio ? "audio" : "images";
      const baseName = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9_-]/g, "_");
      const ext = file.name.split(".").pop() || (isAudio ? "mp3" : "webp");
      const objectPath = `${userId}/${eventId}/${folder}/${Date.now()}-${baseName}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from("card-assets")
        .upload(objectPath, file, {
          cacheControl: "3600",
          contentType: file.type || undefined,
          upsert: false,
        });

      if (!uploadErr) {
        await fetchAssets();
      }
    } finally {
      setDirectUploading(false);
      if (directUploadRef.current) directUploadRef.current.value = "";
    }
  }

  // Apply an image asset to active card
  function applyImageAsset(
    url: string,
    target: "bride" | "groom" | "hero" | "backdrop"
  ) {
    if (target === "bride") {
      updateCouple({ brideImageUrl: url, brideOriginalUrl: url });
      setAppliedNotice("Set as Bride Photo");
    } else if (target === "groom") {
      updateCouple({ groomImageUrl: url, groomOriginalUrl: url });
      setAppliedNotice("Set as Groom Photo");
    } else if (target === "hero") {
      updateContent({ heroImageUrl: url, heroOriginalUrl: url });
      setAppliedNotice("Set as Cover Hero");
    } else if (target === "backdrop") {
      updateCardArt({ backdropUrl: url, backdropPreset: "custom" });
      setAppliedNotice("Set as Card Backdrop");
    }
    setActiveMenuId(null);
    setTimeout(() => setAppliedNotice(null), 3000);
  }

  // Apply an audio asset as background music
  function applyAudioAsset(asset: AssetItem) {
    const cleanTitle = asset.name.replace(/\.[^/.]+$/, "");
    updateAudio({
      enabled: true,
      trackId: "custom",
      trackTitle: cleanTitle,
      customUrl: asset.publicUrl,
    });
    updateMeta({ audio_url: asset.publicUrl });
    setAppliedNotice(`Set '${cleanTitle}' as Background Music`);
    setTimeout(() => setAppliedNotice(null), 3000);
  }

  return (
    <div className="space-y-6">
      {/* Hidden audio element for preview snippets */}
      <audio
        ref={snippetAudioRef}
        onEnded={() => setPreviewSnippetUrl(null)}
        className="hidden"
      />

      {/* Top Filter Bar */}
      <div className="flex items-center gap-1 rounded-xl bg-stone-100 p-1">
        <button
          type="button"
          onClick={() => setPanelView("all")}
          className={`flex-1 rounded-lg py-1.5 text-center text-xs font-medium transition cursor-pointer ${
            panelView === "all"
              ? "bg-white text-stone-900 shadow-xs"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setPanelView("assets")}
          className={`flex-1 inline-flex items-center justify-center gap-1 rounded-lg py-1.5 text-center text-xs font-medium transition cursor-pointer ${
            panelView === "assets"
              ? "bg-white text-stone-900 shadow-xs"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <FolderOpen className="w-3.5 h-3.5 text-amber-600" />
          <span>Assets ({stats.totalCount})</span>
        </button>
        <button
          type="button"
          onClick={() => setPanelView("audio")}
          className={`flex-1 inline-flex items-center justify-center gap-1 rounded-lg py-1.5 text-center text-xs font-medium transition cursor-pointer ${
            panelView === "audio"
              ? "bg-white text-stone-900 shadow-xs"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <Music2 className="w-3.5 h-3.5 text-amber-600" />
          <span>Audio &amp; Motion</span>
        </button>
      </div>

      {appliedNotice && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800 flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{appliedNotice}</span>
        </div>
      )}

      {/* SECTION 1: CREATOR STORAGE ASSETS */}
      {(panelView === "all" || panelView === "assets") && (
        <div className="space-y-4 rounded-2xl border border-stone-200 bg-stone-50/60 p-4">
          {/* Storage Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-amber-600" />
                <span>Your Storage Assets</span>
              </h3>
              <p className="text-[11px] text-stone-500">
                {stats.totalCount} files • {stats.formattedTotalSize} stored
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={fetchAssets}
                disabled={loadingAssets}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition cursor-pointer"
                title="Refresh Assets"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${loadingAssets ? "animate-spin text-amber-600" : ""}`}
                />
              </button>
              <input
                ref={directUploadRef}
                type="file"
                accept="image/*,audio/*"
                onChange={handleDirectUpload}
                className="hidden"
              />
              <button
                type="button"
                disabled={directUploading}
                onClick={() => directUploadRef.current?.click()}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-900 text-white text-[11px] font-semibold hover:bg-stone-800 transition cursor-pointer"
              >
                <Upload className="w-3 h-3 text-amber-300" />
                <span>{directUploading ? "Uploading..." : "Upload Asset"}</span>
              </button>
            </div>
          </div>

          {/* Filter Pills & Search */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              {(
                [
                  { id: "all", label: `All (${assets.length})` },
                  { id: "image", label: `Images (${stats.imageCount})` },
                  { id: "audio", label: `Audio (${stats.audioCount})` },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setAssetFilter(f.id)}
                  className={`rounded-lg px-2 py-1 text-[11px] font-medium transition cursor-pointer ${
                    assetFilter === f.id
                      ? "bg-stone-900 text-white"
                      : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {assets.length > 2 && (
              <div className="relative w-28 sm:w-36">
                <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-6 pr-2 py-1 text-[10px] rounded-lg border border-stone-200 bg-white placeholder-stone-400 focus:outline-hidden focus:border-stone-900"
                />
              </div>
            )}
          </div>

          {/* Asset Grid / List */}
          {loadingAssets ? (
            <div className="py-8 text-center text-xs text-stone-400">
              Loading your storage library...
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="py-6 text-center border border-dashed border-stone-300 rounded-xl bg-white p-4">
              <FolderOpen className="w-6 h-6 text-stone-300 mx-auto mb-1.5" />
              <p className="text-xs font-medium text-stone-700">No assets in storage</p>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Upload photos or audio tracks to reuse them across cards.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {filteredAssets.map((asset) => {
                const isDeleting = deletingId === asset.id;
                const isConfirming = confirmDeleteId === asset.id;
                const isPlaying = previewSnippetUrl === asset.publicUrl;
                const isMenuOpen = activeMenuId === asset.id;

                if (asset.type === "image") {
                  return (
                    <div
                      key={asset.id}
                      className="rounded-xl border border-stone-200 bg-white p-2.5 flex items-center justify-between gap-2.5 shadow-2xs hover:border-amber-400 transition"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={asset.publicUrl}
                            alt={asset.name}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-stone-900 truncate" title={asset.name}>
                            {asset.name}
                          </p>
                          <p className="text-[10px] text-stone-400">
                            {asset.formattedSize}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 relative">
                        {isConfirming ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={isDeleting}
                              onClick={() => handleDeleteAsset(asset)}
                              className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-semibold hover:bg-rose-700 transition cursor-pointer"
                            >
                              {isDeleting ? "..." : "Delete"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            {/* Use In Card Dropdown */}
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() =>
                                  setActiveMenuId(isMenuOpen ? null : asset.id)
                                }
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-[11px] font-medium text-stone-700 transition cursor-pointer"
                              >
                                <span>Use</span>
                                <ChevronDown className="w-3 h-3 text-stone-400" />
                              </button>

                              {isMenuOpen && (
                                <div className="absolute right-0 top-full mt-1 z-30 w-36 rounded-xl border border-stone-200 bg-white p-1 shadow-lg text-[11px] space-y-0.5 animate-in fade-in duration-150">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      applyImageAsset(asset.publicUrl, "bride")
                                    }
                                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-amber-50 hover:text-amber-900 transition cursor-pointer"
                                  >
                                    Bride Photo
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      applyImageAsset(asset.publicUrl, "groom")
                                    }
                                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-amber-50 hover:text-amber-900 transition cursor-pointer"
                                  >
                                    Groom Photo
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      applyImageAsset(asset.publicUrl, "hero")
                                    }
                                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-amber-50 hover:text-amber-900 transition cursor-pointer"
                                  >
                                    Hero Cover
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      applyImageAsset(asset.publicUrl, "backdrop")
                                    }
                                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-amber-50 hover:text-amber-900 transition cursor-pointer"
                                  >
                                    Card Backdrop
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(asset.id)}
                              className="p-1 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                              title="Delete from storage"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                }

                // Audio Asset Card
                return (
                  <div
                    key={asset.id}
                    className="rounded-xl border border-stone-200 bg-white p-2.5 flex items-center justify-between gap-2.5 shadow-2xs hover:border-amber-400 transition"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => toggleSnippet(asset.publicUrl)}
                        className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200 flex items-center justify-center shrink-0 transition cursor-pointer"
                        title={isPlaying ? "Stop" : "Play"}
                      >
                        {isPlaying ? (
                          <Square className="w-3 h-3 fill-current" />
                        ) : (
                          <Play className="w-3 h-3 fill-current translate-x-0.5" />
                        )}
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-stone-900 truncate" title={asset.name}>
                          {asset.name}
                        </p>
                        <p className="text-[10px] text-stone-400">
                          {asset.formattedSize}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isConfirming ? (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={isDeleting}
                            onClick={() => handleDeleteAsset(asset)}
                            className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-semibold hover:bg-rose-700 transition cursor-pointer"
                          >
                            {isDeleting ? "..." : "Delete"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => applyAudioAsset(asset)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-stone-900 text-white text-[11px] font-medium hover:bg-stone-800 transition cursor-pointer"
                          >
                            <Check className="w-3 h-3 text-amber-300" />
                            <span>Set Music</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(asset.id)}
                            className="p-1 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Delete from storage"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: AUDIO CONFIGURATION */}
      {(panelView === "all" || panelView === "audio") && (
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

              {/* Custom Track Uploader with Asset Picker */}
              <MediaUploader
                userId={userId}
                eventId={eventId}
                accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg"
                label="Upload / Choose Custom Audio Track"
                folder="audio"
                onUploaded={(url, fileName) => {
                  const cleanTitle = fileName.replace(/\.[^/.]+$/, "");
                  updateAudio({
                    trackId: "custom",
                    trackTitle: cleanTitle,
                    customUrl: url,
                  });
                  updateMeta({ audio_url: url });
                  fetchAssets();
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
      )}

      {/* SECTION 3: MOTION & EFFECTS */}
      {(panelView === "all" || panelView === "audio") && (
        <div className="space-y-3 border-t border-stone-200 pt-5">
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
      )}
    </div>
  );
});
