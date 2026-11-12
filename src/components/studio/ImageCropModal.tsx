"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Undo2,
  Check,
  X,
  Loader2,
  Move,
  Sparkles,
} from "lucide-react";
import {
  AspectRatioType,
  CropState,
  cropAndExportImage,
  formatBytes,
  loadImage,
  MIN_CROP_ZOOM,
  MAX_CROP_ZOOM,
  calculateDefaultZoom,
} from "@/lib/utils/imageOptimization";
import { CoupleFrameShape } from "@/types/invitation";

export type FrameShapeOption = CoupleFrameShape | "landscape" | "square";

export type TargetImageType = "bride" | "groom" | "hero" | "gallery";

interface ImageCropModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string | null;
  fileName?: string;
  originalSizeBytes?: number;
  aspect?: AspectRatioType;
  initialShape?: FrameShapeOption;
  initialCrop?: CropState | null;
  targetType?: TargetImageType;
  personName?: string;
  roleBadge?: string;
  primaryColor?: string;
  accentColor?: string;
  surfaceColor?: string;
  onCropComplete: (result: {
    blob: Blob;
    dataUrl: string;
    width: number;
    height: number;
    sizeBytes: number;
    shape?: FrameShapeOption;
    crop: CropState;
  }) => Promise<void> | void;
}

export function ImageCropModal({
  open,
  onOpenChange,
  imageSrc,
  fileName = "photo.jpg",
  originalSizeBytes,
  aspect = "portrait",
  initialShape = "arch",
  initialCrop,
  targetType = "bride",
  personName,
  roleBadge,
  primaryColor = "#2C221E",
  accentColor = "#D4AF37",
  surfaceColor = "#FAF8F5",
  onCropComplete,
}: ImageCropModalProps) {
  const [loadedImg, setLoadedImg] = useState<HTMLImageElement | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Size mode: "card" (exact dimensions as shown in card) or "expanded" (1.5x zoom view)
  const [sizeMode, setSizeMode] = useState<"card" | "expanded">("card");

  // Crop & Transform state (panX, panY, zoom, rotation)
  const [crop, setCrop] = useState<CropState>(() => {
    if (initialCrop) return initialCrop;
    return { panX: 0, panY: 0, zoom: 0.85, rotation: 0 };
  });

  const [activeShape, setActiveShape] = useState<FrameShapeOption>(initialShape);

  // Viewport dimensions matching the exact invitation card frame
  const getViewportDimensions = useCallback(() => {
    const isExpanded = sizeMode === "expanded";

    if (aspect === "landscape") {
      // 16:9 Hero banner as shown on card
      const baseW = 320;
      const baseH = 180;
      return isExpanded
        ? { width: Math.round(baseW * 1.25), height: Math.round(baseH * 1.25) }
        : { width: baseW, height: baseH };
    }

    if (aspect === "square") {
      // 1:1 Gallery square as shown on card
      const baseSize = 140;
      return isExpanded
        ? { width: Math.round(baseSize * 1.5), height: Math.round(baseSize * 1.5) }
        : { width: baseSize, height: baseSize };
    }

    // Portrait (4:5)
    if (targetType === "hero") {
      // Hero single portrait in HeroScene
      const baseW = 240;
      const baseH = 300;
      return isExpanded
        ? { width: Math.round(baseW * 1.25), height: Math.round(baseH * 1.25) }
        : { width: baseW, height: baseH };
    }

    // Couple Scene Portrait Frame (exact mobile card dimensions: 150px x 188px)
    const cardCoupleW = 150;
    const cardCoupleH = 188;
    return isExpanded
      ? { width: Math.round(cardCoupleW * 1.5), height: Math.round(cardCoupleH * 1.5) }
      : { width: cardCoupleW, height: cardCoupleH };
  }, [aspect, sizeMode, targetType]);

  const { width: vpWidth, height: vpHeight } = getViewportDimensions();

  // Toggle between exact card size (1:1) and expanded (1.5x) while scaling pan smoothly
  const handleToggleSize = (mode: "card" | "expanded") => {
    if (mode === sizeMode) return;
    const scaleFactor = mode === "expanded" ? 1.5 : 1 / 1.5;
    setSizeMode(mode);
    setCrop((prev) => ({
      ...prev,
      panX: Math.round(prev.panX * scaleFactor),
      panY: Math.round(prev.panY * scaleFactor),
    }));
  };

  // Viewport container ref
  const viewportRef = useRef<HTMLDivElement | null>(null);

  // Dragging state
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{
    x: number;
    y: number;
    startPanX: number;
    startPanY: number;
  }>({
    x: 0,
    y: 0,
    startPanX: 0,
    startPanY: 0,
  });

  // Load image when open
  useEffect(() => {
    if (!open || !imageSrc) {
      setLoadedImg(null);
      setLoadError(null);
      return;
    }

    if (initialCrop) {
      setCrop(initialCrop);
    } else {
      setCrop({ panX: 0, panY: 0, zoom: 0.85, rotation: 0 });
    }
    setActiveShape(initialShape);
    setLoadError(null);

    let isMounted = true;
    loadImage(imageSrc)
      .then((img) => {
        if (!isMounted) return;
        setLoadedImg(img);
        // If no prior saved crop, compute a balanced, un-pinched default zoom
        if (!initialCrop) {
          const autoZoom = calculateDefaultZoom(
            img.naturalWidth,
            img.naturalHeight,
            vpWidth,
            vpHeight,
            0
          );
          setCrop({ panX: 0, panY: 0, zoom: autoZoom, rotation: 0 });
        }
      })
      .catch((err) => {
        if (isMounted) {
          setLoadError(
            err instanceof Error ? err.message : "Failed to load image preview."
          );
        }
      });

    return () => {
      isMounted = false;
    };
  }, [open, imageSrc, initialShape, initialCrop, vpWidth, vpHeight]);

  // Pointer dragging handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return; // Only primary mouse button
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startPanX: crop.panX,
      startPanY: crop.panY,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setCrop((prev) => ({
      ...prev,
      panX: dragStartRef.current.startPanX + dx,
      panY: dragStartRef.current.startPanY + dy,
    }));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore if not captured
      }
    }
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.05 : -0.05;
    setCrop((prev) => ({
      ...prev,
      zoom: Math.min(
        MAX_CROP_ZOOM,
        Math.max(MIN_CROP_ZOOM, Number((prev.zoom + zoomDelta).toFixed(2)))
      ),
    }));
  };

  const handleRotate = () => {
    setCrop((prev) => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360,
    }));
  };

  const handleReset = () => {
    if (loadedImg) {
      const autoZoom = calculateDefaultZoom(
        loadedImg.naturalWidth,
        loadedImg.naturalHeight,
        vpWidth,
        vpHeight,
        0
      );
      setCrop({
        panX: 0,
        panY: 0,
        zoom: autoZoom,
        rotation: 0,
      });
    } else {
      setCrop({
        panX: 0,
        panY: 0,
        zoom: 0.85,
        rotation: 0,
      });
    }
  };

  // Determine frame border-radius class matching PortraitFrame
  const getFrameMaskClass = () => {
    if (activeShape === "arch") {
      return "rounded-t-[999px] rounded-b-[18px]";
    }
    if (activeShape === "oval" || activeShape === "scallop") {
      return "rounded-[999px]";
    }
    if (activeShape === "polaroid") {
      return "rounded-lg";
    }
    if (activeShape === "landscape") {
      return "rounded-xl";
    }
    if (activeShape === "square") {
      return "rounded-2xl";
    }
    return "rounded-2xl";
  };

  // Compute CSS transform for live preview image
  const getImageStyle = (): React.CSSProperties => {
    if (!loadedImg) return {};

    const isRotated90 = Math.abs(crop.rotation % 180) === 90;
    const imgW = isRotated90 ? loadedImg.naturalHeight : loadedImg.naturalWidth;
    const imgH = isRotated90 ? loadedImg.naturalWidth : loadedImg.naturalHeight;

    const baseScale = Math.max(vpWidth / imgW, vpHeight / imgH);
    const totalScale = baseScale * crop.zoom;

    return {
      width: `${loadedImg.naturalWidth}px`,
      height: `${loadedImg.naturalHeight}px`,
      maxWidth: "none",
      maxHeight: "none",
      transform: `translate(-50%, -50%) translate(${crop.panX}px, ${crop.panY}px) scale(${totalScale}) rotate(${crop.rotation}deg)`,
      transformOrigin: "center center",
      position: "absolute",
      left: "50%",
      top: "50%",
      userSelect: "none",
      pointerEvents: "none",
    };
  };

  const handleApply = async () => {
    if (!loadedImg) return;
    setIsProcessing(true);

    try {
      const result = await cropAndExportImage({
        image: loadedImg,
        crop,
        viewportWidth: vpWidth,
        viewportHeight: vpHeight,
        aspect,
        quality: 0.86,
        format: "image/webp",
      });

      await onCropComplete({
        ...result,
        shape: activeShape,
        crop,
      });

      onOpenChange(false);
    } catch (err) {
      setLoadError(
        err instanceof Error ? err.message : "Failed to process image."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[94vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-5 sm:p-6 shadow-2xl border border-stone-200 focus:outline-none animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <Dialog.Title className="text-base font-semibold text-stone-900 flex items-center gap-2">
                <Move className="w-4 h-4 text-amber-600" />
                <span>Adjust Photo Position &amp; Frame</span>
              </Dialog.Title>
              <Dialog.Description className="text-xs text-stone-500 mt-0.5">
                Exact card-frame preview. Drag to position faces, zoom, or rotate.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-full p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Body */}
          <div className="py-4 space-y-4">
            {loadError ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-center">
                <p className="text-xs font-medium text-rose-700">{loadError}</p>
              </div>
            ) : !loadedImg ? (
              <div className="h-64 flex flex-col items-center justify-center gap-2 text-stone-400">
                <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
                <span className="text-xs">Preparing photo canvas...</span>
              </div>
            ) : (
              <>
                {/* View Mode Toggle: Exact Card Dimensions vs Expanded */}
                <div className="flex items-center justify-between pb-1 text-xs">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-stone-500">
                    Preview Size
                  </span>
                  <div className="inline-flex rounded-lg border border-stone-200 bg-stone-100 p-0.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => handleToggleSize("card")}
                      className={`rounded-md px-2.5 py-0.5 font-medium transition cursor-pointer ${
                        sizeMode === "card"
                          ? "bg-white text-stone-900 shadow-2xs font-semibold"
                          : "text-stone-600 hover:text-stone-900"
                      }`}
                    >
                      Exact Card Size (1:1)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleSize("expanded")}
                      className={`rounded-md px-2.5 py-0.5 font-medium transition cursor-pointer ${
                        sizeMode === "expanded"
                          ? "bg-white text-stone-900 shadow-2xs font-semibold"
                          : "text-stone-600 hover:text-stone-900"
                      }`}
                    >
                      Expanded View (1.5x)
                    </button>
                  </div>
                </div>

                {/* Simulated Card Stage Container */}
                <div
                  className="relative mx-auto rounded-2xl border p-4 sm:p-5 shadow-xs flex flex-col items-center justify-center transition-all duration-200 select-none"
                  style={{
                    backgroundColor: surfaceColor || "#FAF8F5",
                    borderColor: `${accentColor || "#D4AF37"}45`,
                  }}
                >
                  {/* Subject Name / Role badge preview matching card */}
                  {personName && (
                    <div className="mb-2.5 text-center">
                      {roleBadge && (
                        <span
                          className="text-[9px] uppercase tracking-[0.2em] font-medium block"
                          style={{ color: accentColor || "#B8860B" }}
                        >
                          {roleBadge}
                        </span>
                      )}
                      <span
                        className="text-xs font-semibold tracking-wide"
                        style={{ color: primaryColor || "#2C221E" }}
                      >
                        {personName}
                      </span>
                    </div>
                  )}

                  {/* Interactive Viewport Canvas matching Card Frame */}
                  <div
                    ref={viewportRef}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    onWheel={handleWheel}
                    style={{
                      width: `${vpWidth}px`,
                      height: `${vpHeight}px`,
                      borderColor: `${accentColor || "#D4AF37"}80`,
                    }}
                    className={`relative overflow-hidden cursor-grab active:cursor-grabbing border shadow-[0_12px_32px_-10px_rgba(0,0,0,0.35)] ${getFrameMaskClass()} bg-stone-900 touch-none`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={loadedImg.src}
                      alt={fileName}
                      style={getImageStyle()}
                      draggable={false}
                    />

                    {/* Exact decorative inset frame ring matching the card */}
                    <div
                      aria-hidden="true"
                      className={`pointer-events-none absolute inset-2 ${getFrameMaskClass()} border`}
                      style={{
                        borderColor: `${accentColor || "#D4AF37"}60`,
                        borderStyle: activeShape === "scallop" ? "dotted" : "solid",
                        borderWidth: activeShape === "scallop" ? "2px" : "1px",
                      }}
                    />

                    {/* Subtle drag hint pill */}
                    <div className="pointer-events-none absolute bottom-1.5 left-1/2 -translate-x-1/2 rounded-full bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[9px] font-medium text-white/90 shadow-sm flex items-center gap-1">
                      <Move className="w-2.5 h-2.5 text-amber-300" />
                      <span>Drag to position</span>
                    </div>
                  </div>

                  {/* Dimension tag for user clarity */}
                  <span className="mt-2 text-[10px] text-stone-500 font-mono">
                    {sizeMode === "card"
                      ? "Exact Card Frame (1:1)"
                      : "Expanded View (1.5x)"}{" "}
                    &bull; {vpWidth} &times; {vpHeight}px
                  </span>
                </div>

                {/* Optional Frame Shape Selector (if portrait) */}
                {aspect === "portrait" && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium uppercase tracking-wider text-stone-500">
                      Preview Frame Shape
                    </label>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {(
                        [
                          { id: "arch", label: "Royal Arch" },
                          { id: "oval", label: "Cameo Oval" },
                          { id: "rounded", label: "Soft Rounded" },
                          { id: "polaroid", label: "Polaroid" },
                          { id: "square", label: "Square" },
                        ] as const
                      ).map((shape) => (
                        <button
                          key={shape.id}
                          type="button"
                          onClick={() => setActiveShape(shape.id)}
                          className={`rounded-xl px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                            activeShape === shape.id
                              ? "bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs font-semibold"
                              : "bg-stone-100 text-stone-600 hover:bg-stone-200 border border-transparent"
                          }`}
                        >
                          {shape.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Transformation Toolbar: Zoom slider + Rotate + Reset */}
                <div className="rounded-2xl border border-stone-200 bg-stone-50/80 p-3 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-stone-700 flex items-center gap-1.5">
                      <ZoomIn className="w-3.5 h-3.5 text-stone-500" />
                      Zoom / Scale: {Math.round(crop.zoom * 100)}%
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={handleRotate}
                        title="Rotate 90 degrees"
                        className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-2 py-1 text-[11px] font-medium text-stone-700 hover:bg-stone-100 transition cursor-pointer shadow-2xs"
                      >
                        <RotateCw className="w-3 h-3 text-stone-600" />
                        <span>Rotate</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleReset}
                        title="Reset position and zoom"
                        className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-2 py-1 text-[11px] font-medium text-stone-700 hover:bg-stone-100 transition cursor-pointer shadow-2xs"
                      >
                        <Undo2 className="w-3 h-3 text-stone-600" />
                        <span>Reset</span>
                      </button>
                    </div>
                  </div>

                  {/* Zoom controls with wide range starting at MIN_CROP_ZOOM (0.35) */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setCrop((prev) => ({
                          ...prev,
                          zoom: Math.max(
                            MIN_CROP_ZOOM,
                            Number((prev.zoom - 0.05).toFixed(2))
                          ),
                        }))
                      }
                      disabled={crop.zoom <= MIN_CROP_ZOOM}
                      className="rounded-lg p-1 text-stone-500 hover:bg-stone-200 disabled:opacity-30 cursor-pointer"
                      aria-label="Zoom out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <input
                      type="range"
                      min={MIN_CROP_ZOOM}
                      max={MAX_CROP_ZOOM}
                      step="0.02"
                      value={crop.zoom}
                      onChange={(e) =>
                        setCrop((prev) => ({
                          ...prev,
                          zoom: parseFloat(e.target.value),
                        }))
                      }
                      className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setCrop((prev) => ({
                          ...prev,
                          zoom: Math.min(
                            MAX_CROP_ZOOM,
                            Number((prev.zoom + 0.05).toFixed(2))
                          ),
                        }))
                      }
                      disabled={crop.zoom >= MAX_CROP_ZOOM}
                      className="rounded-lg p-1 text-stone-500 hover:bg-stone-200 disabled:opacity-30 cursor-pointer"
                      aria-label="Zoom in"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Optimization & Storage Info Banner */}
                <div className="flex items-center gap-2 rounded-xl bg-amber-50/80 border border-amber-200/60 px-3 py-2 text-[11px] text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    {originalSizeBytes && originalSizeBytes > 0 ? (
                      <>
                        Compressed source from{" "}
                        <strong className="font-semibold">
                          {formatBytes(originalSizeBytes)}
                        </strong>{" "}
                        to lightweight high-res WebP for fast guest loading.
                      </>
                    ) : (
                      <>
                        Lightweight high-res WebP for fast guest loading.
                      </>
                    )}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => onOpenChange(false)}
              className="rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100 transition disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!loadedImg || isProcessing}
              onClick={handleApply}
              className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white px-4 py-2 text-xs font-medium shadow-xs transition disabled:opacity-50 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Optimizing &amp; Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply &amp; Save Photo</span>
                </>
              )}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
