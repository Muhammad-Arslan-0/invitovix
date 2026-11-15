"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  X,
  Upload,
  Image as ImageIcon,
  Music2,
  Trash2,
  Search,
  Check,
  Loader2,
  FolderOpen,
  Play,
  Square,
  AlertTriangle,
  HardDrive,
} from "lucide-react";
import {
  AssetItem,
  listUserAssets,
  deleteAsset,
  computeStorageStats,
} from "@/lib/storage/assetManager";

interface AssetPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  eventId: string;
  folder?: "images" | "audio";
  title?: string;
  accept: string;
  onSelectAsset: (asset: AssetItem) => void;
  onUploadFile: (file: File) => void;
  uploading?: boolean;
}

export function AssetPickerModal({
  open,
  onOpenChange,
  userId,
  folder = "images",
  title,
  accept,
  onSelectAsset,
  onUploadFile,
  uploading = false,
}: AssetPickerModalProps) {
  const [activeTab, setActiveTab] = useState<"library" | "upload">("library");
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [playingAudioUrl, setPlayingAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dropInputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Stop audio when modal closes or unmounts
  useEffect(() => {
    if (!open && audioRef.current) {
      audioRef.current.pause();
      setPlayingAudioUrl(null);
    }
  }, [open]);

  // Load assets when modal opens
  useEffect(() => {
    if (!open || !userId) return;
    let isMounted = true;
    setLoading(true);

    listUserAssets(userId)
      .then((loaded) => {
        if (isMounted) {
          setAssets(loaded);
          // If no existing assets matching this folder, switch to upload tab
          const matching = loaded.filter((a) =>
            folder === "images" ? a.type === "image" : a.type === "audio"
          );
          if (matching.length === 0) {
            setActiveTab("upload");
          } else {
            setActiveTab("library");
          }
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [open, userId, folder]);

  // Filter assets by folder type and search query
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchType =
        folder === "images" ? asset.type === "image" : asset.type === "audio";
      if (!matchType) return false;
      if (!searchQuery.trim()) return true;
      return asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [assets, folder, searchQuery]);

  const stats = useMemo(() => computeStorageStats(assets), [assets]);

  // Handle deleting an asset
  async function handleDelete(asset: AssetItem) {
    setDeletingId(asset.id);
    try {
      const res = await deleteAsset(asset.path);
      if (res.success) {
        setAssets((prev) => prev.filter((a) => a.id !== asset.id));
        setConfirmDeleteId(null);
        if (playingAudioUrl === asset.publicUrl && audioRef.current) {
          audioRef.current.pause();
          setPlayingAudioUrl(null);
        }
      }
    } finally {
      setDeletingId(null);
    }
  }

  // Handle play/pause audio snippet
  function toggleAudioSnippet(url: string) {
    if (playingAudioUrl === url) {
      audioRef.current?.pause();
      setPlayingAudioUrl(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play().catch(() => {});
        setPlayingAudioUrl(url);
      }
    }
  }

  function handleFileDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onUploadFile(file);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby="asset-picker-description"
          className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl border border-stone-200 outline-none max-h-[88vh] flex flex-col"
        >
          {/* Hidden audio element for preview snippets */}
          <audio
            ref={audioRef}
            onEnded={() => setPlayingAudioUrl(null)}
            className="hidden"
          />

          {/* Modal Header */}
          <div className="flex items-start justify-between border-b border-stone-200 pb-4 shrink-0">
            <div>
              <Dialog.Title className="text-base font-semibold text-stone-900 flex items-center gap-2">
                {folder === "images" ? (
                  <ImageIcon className="w-5 h-5 text-amber-600" />
                ) : (
                  <Music2 className="w-5 h-5 text-amber-600" />
                )}
                <span>
                  {title ||
                    (folder === "images" ? "Select Photo" : "Select Audio Track")}
                </span>
              </Dialog.Title>
              <Dialog.Description
                id="asset-picker-description"
                className="mt-1 text-xs text-stone-500 flex items-center gap-2"
              >
                <span>
                  Choose from your uploaded library or upload a new file.
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium text-[10px]">
                  <HardDrive className="w-3 h-3 text-stone-400" />
                  {stats.totalCount} assets ({stats.formattedTotalSize})
                </span>
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-full p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Tab Switcher */}
          <div className="mt-4 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-1 rounded-xl bg-stone-100 p-1">
              <button
                type="button"
                onClick={() => setActiveTab("library")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                  activeTab === "library"
                    ? "bg-white text-stone-900 shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <FolderOpen className="w-3.5 h-3.5 text-amber-600" />
                <span>Your Library ({filteredAssets.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("upload")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                  activeTab === "upload"
                    ? "bg-white text-stone-900 shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <Upload className="w-3.5 h-3.5 text-amber-600" />
                <span>Upload New</span>
              </button>
            </div>

            {activeTab === "library" && filteredAssets.length > 0 && (
              <div className="relative w-48 sm:w-60">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search assets..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-stone-200 bg-white placeholder-stone-400 focus:outline-hidden focus:border-stone-900"
                />
              </div>
            )}
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto mt-4 pr-1 min-h-[260px]">
            {activeTab === "library" ? (
              loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-2 text-stone-400">
                  <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
                  <p className="text-xs">Loading your assets...</p>
                </div>
              ) : filteredAssets.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center gap-3 text-center border-2 border-dashed border-stone-200 rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-700">
                    <FolderOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-stone-800">
                      No {folder === "images" ? "photos" : "audio tracks"} in your library yet
                    </p>
                    <p className="text-xs text-stone-500 mt-1 max-w-sm">
                      Upload your first file to reuse it across any card or section without re-uploading.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("upload")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New File</span>
                  </button>
                </div>
              ) : (
                <div
                  className={
                    folder === "images"
                      ? "grid grid-cols-2 sm:grid-cols-3 gap-3"
                      : "space-y-2"
                  }
                >
                  {filteredAssets.map((asset) => {
                    const isDeleting = deletingId === asset.id;
                    const isConfirming = confirmDeleteId === asset.id;
                    const isPlaying = playingAudioUrl === asset.publicUrl;

                    if (folder === "images") {
                      return (
                        <div
                          key={asset.id}
                          className="group relative rounded-xl border border-stone-200 bg-stone-50 overflow-hidden hover:border-amber-500 hover:shadow-md transition flex flex-col"
                        >
                          {/* Image preview */}
                          <div className="relative aspect-4/3 w-full bg-stone-200 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={asset.publicUrl}
                              alt={asset.name}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {/* Select button overlay */}
                            <button
                              type="button"
                              onClick={() => onSelectAsset(asset)}
                              className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 text-white text-xs font-semibold transition cursor-pointer"
                            >
                              <Check className="w-4 h-4 text-amber-300" />
                              <span>Select Photo</span>
                            </button>
                          </div>

                          {/* Details & Delete bar */}
                          <div className="p-2 bg-white flex items-center justify-between gap-1 border-t border-stone-100">
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-medium text-stone-800 truncate" title={asset.name}>
                                {asset.name}
                              </p>
                              <p className="text-[10px] text-stone-400">
                                {asset.formattedSize}
                              </p>
                            </div>

                            {/* Delete button or confirmation */}
                            {isConfirming ? (
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  disabled={isDeleting}
                                  onClick={() => handleDelete(asset)}
                                  className="px-2 py-1 rounded-md bg-rose-600 text-white text-[10px] font-semibold hover:bg-rose-700 transition cursor-pointer"
                                  title="Confirm permanent deletion"
                                >
                                  {isDeleting ? "..." : "Delete"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="px-1.5 py-1 rounded-md bg-stone-200 text-stone-700 text-[10px] cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(asset.id)}
                                className="p-1 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition shrink-0 cursor-pointer"
                                title="Delete from storage"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    }

                    // Audio track card
                    return (
                      <div
                        key={asset.id}
                        className="rounded-xl border border-stone-200 bg-stone-50/70 p-3 flex items-center justify-between gap-3 hover:border-amber-500 hover:bg-amber-50/20 transition"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <button
                            type="button"
                            onClick={() => toggleAudioSnippet(asset.publicUrl)}
                            className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200 flex items-center justify-center shrink-0 transition cursor-pointer"
                            title={isPlaying ? "Stop Preview" : "Play Preview"}
                          >
                            {isPlaying ? (
                              <Square className="w-3.5 h-3.5 fill-current" />
                            ) : (
                              <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                            )}
                          </button>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-stone-900 truncate" title={asset.name}>
                              {asset.name}
                            </p>
                            <p className="text-[10px] text-stone-500">
                              {asset.formattedSize} • Uploaded {new Date(asset.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {isConfirming ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={isDeleting}
                                onClick={() => handleDelete(asset)}
                                className="px-2 py-1 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition cursor-pointer"
                              >
                                {isDeleting ? "..." : "Confirm"}
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2 py-1 rounded-lg bg-stone-200 text-stone-700 text-xs cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => onSelectAsset(asset)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5 text-amber-300" />
                                <span>Use Track</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(asset.id)}
                                className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                title="Delete from storage"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              /* Upload New Tab */
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                className={`h-64 flex flex-col items-center justify-center gap-3 text-center border-2 border-dashed rounded-2xl p-6 transition ${
                  dragOver
                    ? "border-amber-600 bg-amber-50/50"
                    : "border-stone-300 bg-stone-50 hover:bg-stone-100/50"
                }`}
              >
                <input
                  ref={dropInputRef}
                  type="file"
                  accept={accept}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onUploadFile(file);
                  }}
                  className="hidden"
                />

                <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-stone-200 flex items-center justify-center text-amber-600">
                  <Upload className="w-6 h-6" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-stone-800">
                    Drag &amp; drop your {folder === "images" ? "image" : "audio file"} here
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    {folder === "images"
                      ? "Supports WebP, PNG, JPG up to 10MB (automatically optimized)"
                      : "Supports MP3, WAV, OGG up to 20MB"}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => dropInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition disabled:opacity-60 cursor-pointer"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Processing &amp; Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5 text-amber-300" />
                      <span>Browse From Computer</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 shrink-0">
            <span className="flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>Assets uploaded here are saved to your storage and can be used on any card.</span>
            </span>
            <Dialog.Close asChild>
              <button
                type="button"
                className="px-3 py-1 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
