"use client";

import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  MAX_IMAGE_FILE_MB,
  validateImageFile,
  fileToDataUrl,
  compressOriginalImage,
  AspectRatioType,
  CropState,
} from "@/lib/utils/imageOptimization";
import { ImageCropModal, FrameShapeOption } from "./ImageCropModal";

export interface UploadedMediaExtra {
  originalUrl?: string;
  crop?: CropState;
}

interface MediaUploaderProps {
  userId: string;
  eventId: string;
  accept: string;
  label: string;
  folder?: "images" | "audio";
  enableCrop?: boolean;
  cropAspect?: AspectRatioType;
  initialFrameShape?: FrameShapeOption;
  initialCrop?: CropState | null;
  targetType?: "bride" | "groom" | "hero" | "gallery";
  personName?: string;
  roleBadge?: string;
  primaryColor?: string;
  accentColor?: string;
  surfaceColor?: string;
  maxFileMb?: number;
  onUploaded: (
    publicUrl: string,
    fileName: string,
    extra?: UploadedMediaExtra
  ) => void;
}

export function MediaUploader({
  userId,
  eventId,
  accept,
  label,
  folder = "images",
  enableCrop = true,
  cropAspect = "portrait",
  initialFrameShape = "arch",
  initialCrop = null,
  targetType = "bride",
  personName,
  roleBadge,
  primaryColor,
  accentColor,
  surfaceColor,
  maxFileMb = MAX_IMAGE_FILE_MB,
  onUploaded,
}: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cropper modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [pendingCropData, setPendingCropData] = useState<{
    compressedBlob: Blob;
    dataUrl: string;
    fileName: string;
    originalSizeBytes: number;
  } | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size & type
    if (folder === "images") {
      const validation = validateImageFile(file, maxFileMb);
      if (!validation.valid) {
        setError(validation.error || "Invalid image file.");
        if (inputRef.current) inputRef.current.value = "";
        return;
      }
    } else {
      // Audio or other assets
      const maxAudioBytes = 20 * 1024 * 1024;
      if (file.size > maxAudioBytes) {
        setError("Audio file exceeds the maximum 20 MB limit.");
        if (inputRef.current) inputRef.current.value = "";
        return;
      }
    }

    setError(null);

    // If it's an image and cropping/repositioning is enabled, compress source and open modal
    if (folder === "images" && enableCrop) {
      try {
        setUploading(true);
        // Pre-compress original to lightweight high-res WebP (~200KB)
        const compressedBlob = await compressOriginalImage(file);
        const dataUrl = await fileToDataUrl(compressedBlob);
        setUploading(false);

        setPendingCropData({
          compressedBlob,
          dataUrl,
          fileName: file.name,
          originalSizeBytes: file.size,
        });
        setCropModalOpen(true);
      } catch {
        setUploading(false);
        setError("Unable to read selected photo. Please try another image.");
      }
      return;
    }

    // Direct upload (e.g. audio or when cropping is disabled)
    await uploadDirect(file, file.name);
  }

  async function uploadDirect(blobOrFile: Blob | File, originalName: string) {
    setError(null);
    setUploading(true);

    try {
      const supabase = createClient();
      const isWebp = blobOrFile.type === "image/webp";
      const baseName = originalName
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9_-]/g, "_");
      const ext = isWebp ? "webp" : originalName.split(".").pop() || "bin";
      const objectPath = `${userId}/${eventId}/${folder}/${Date.now()}-${baseName}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from("card-assets")
        .upload(objectPath, blobOrFile, {
          cacheControl: "3600",
          contentType: blobOrFile.type || undefined,
          upsert: false,
        });

      if (uploadErr) {
        setError("Upload failed. Please try again.");
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("card-assets").getPublicUrl(objectPath);

      onUploaded(publicUrl, `${baseName}.${ext}`);
    } catch {
      setError("Upload failed. Please check your connection and try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  async function handleCropSave(
    originalBlob: Blob,
    croppedBlob: Blob,
    fileName: string,
    crop: CropState
  ) {
    setError(null);
    setUploading(true);

    try {
      const supabase = createClient();
      const baseName = fileName
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9_-]/g, "_");
      const timestamp = Date.now();

      // 1. Upload uncropped original compressed WebP (~200KB)
      const origPath = `${userId}/${eventId}/images/${timestamp}-orig-${baseName}.webp`;
      const { error: origErr } = await supabase.storage
        .from("card-assets")
        .upload(origPath, originalBlob, {
          cacheControl: "3600",
          contentType: "image/webp",
          upsert: false,
        });

      if (origErr) {
        setError("Upload failed. Please try again.");
        return;
      }

      const {
        data: { publicUrl: originalUrl },
      } = supabase.storage.from("card-assets").getPublicUrl(origPath);

      // 2. Upload cropped WebP (~150KB)
      const cropPath = `${userId}/${eventId}/images/${timestamp}-crop-${baseName}.webp`;
      const { error: cropErr } = await supabase.storage
        .from("card-assets")
        .upload(cropPath, croppedBlob, {
          cacheControl: "3600",
          contentType: "image/webp",
          upsert: false,
        });

      if (cropErr) {
        setError("Upload failed. Please try again.");
        return;
      }

      const {
        data: { publicUrl: croppedUrl },
      } = supabase.storage.from("card-assets").getPublicUrl(cropPath);

      onUploaded(croppedUrl, `${baseName}.webp`, {
        originalUrl,
        crop,
      });
    } catch {
      setError("Upload failed. Please check your connection and try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-stone-300 bg-stone-50 hover:bg-stone-100 px-3 py-2.5 text-xs font-medium text-stone-700 transition disabled:opacity-60 cursor-pointer"
      >
        {uploading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Uploading...</span>
          </>
        ) : (
          <>
            <Upload className="w-3.5 h-3.5" />
            <span>{label}</span>
          </>
        )}
      </button>

      {error && <p className="mt-1.5 text-[11px] text-rose-600">{error}</p>}

      {/* Interactive Crop & Reposition Modal */}
      {cropModalOpen && pendingCropData && (
        <ImageCropModal
          open={cropModalOpen}
          onOpenChange={(isOpen) => {
            setCropModalOpen(isOpen);
            if (!isOpen && inputRef.current) {
              inputRef.current.value = "";
            }
          }}
          imageSrc={pendingCropData.dataUrl}
          fileName={pendingCropData.fileName}
          originalSizeBytes={pendingCropData.originalSizeBytes}
          aspect={cropAspect}
          initialShape={initialFrameShape}
          initialCrop={initialCrop}
          targetType={targetType}
          personName={personName}
          roleBadge={roleBadge}
          primaryColor={primaryColor}
          accentColor={accentColor}
          surfaceColor={surfaceColor}
          onCropComplete={async ({ blob, crop }) => {
            await handleCropSave(
              pendingCropData.compressedBlob,
              blob,
              pendingCropData.fileName,
              crop
            );
          }}
        />
      )}
    </div>
  );
}
