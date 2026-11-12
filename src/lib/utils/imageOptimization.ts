/**
 * Image optimization, validation, and canvas-based cropping utilities.
 * 
 * Compresses heavy smartphone/camera photos (often 10MB-25MB) client-side before upload,
 * reducing payload size by 90-98% (down to ~150KB-350KB) while preserving sharp retina quality.
 */

export const MAX_IMAGE_FILE_MB = 15;
export const MAX_IMAGE_BYTES = MAX_IMAGE_FILE_MB * 1024 * 1024;

export const MIN_CROP_ZOOM = 0.35;
export const MAX_CROP_ZOOM = 2.5;

export const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/heic",
];

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates file size and MIME type before processing.
 */
export function validateImageFile(
  file: File,
  maxMb: number = MAX_IMAGE_FILE_MB
): ImageValidationResult {
  if (!file) {
    return { valid: false, error: "No file selected." };
  }

  const maxBytes = maxMb * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `Photo exceeds the maximum allowed size of ${maxMb} MB (${formatBytes(
        file.size
      )}). Please select a lighter photo.`,
    };
  }

  // Some browsers report empty type for certain formats, so check extension fallback
  const isTypeValid =
    SUPPORTED_IMAGE_TYPES.includes(file.type.toLowerCase()) ||
    /\.(jpe?g|png|webp|avif|heic)$/i.test(file.name);

  if (!isTypeValid && file.type) {
    return {
      valid: false,
      error: "Unsupported image format. Please upload a JPG, PNG, or WebP photo.",
    };
  }

  return { valid: true };
}

/**
 * Human-readable byte formatting (e.g. 240 KB, 4.2 MB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes <= 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Read File or Blob as a Data URL string.
 */
export function fileToDataUrl(fileOrBlob: Blob | File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(fileOrBlob);
  });
}

/**
 * Load HTMLImageElement with anonymous cross-origin and cache busting fallback.
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => {
      // Retry with cache buster if initial request hit tainted CORS cache
      const retryImg = new Image();
      retryImg.crossOrigin = "anonymous";
      retryImg.onload = () => resolve(retryImg);
      retryImg.onerror = (err) => reject(err);
      const cacheBust = src.includes("?")
        ? `&_cors_cb=${Date.now()}`
        : `?_cors_cb=${Date.now()}`;
      retryImg.src = src.startsWith("data:") ? src : `${src}${cacheBust}`;
    };
    img.src = src;
  });
}

export type AspectRatioType = "portrait" | "landscape" | "square" | "free";

export interface TargetDimension {
  width: number;
  height: number;
  aspectRatio: number; // width / height
}

export const TARGET_DIMENSIONS: Record<AspectRatioType, TargetDimension> = {
  portrait: { width: 1200, height: 1500, aspectRatio: 4 / 5 },
  landscape: { width: 1600, height: 900, aspectRatio: 16 / 9 },
  square: { width: 1080, height: 1080, aspectRatio: 1 / 1 },
  free: { width: 1400, height: 1400, aspectRatio: 1 },
};

export interface CropState {
  panX: number; // offset in pixels in the viewport
  panY: number; // offset in pixels in the viewport
  zoom: number; // e.g. 0.35 to 2.5
  rotation: number; // 0, 90, 180, 270 in degrees
}

export interface CropExportOptions {
  image: HTMLImageElement;
  crop: CropState;
  viewportWidth: number;
  viewportHeight: number;
  aspect: AspectRatioType;
  quality?: number; // 0.1 to 1.0, default 0.85
  format?: "image/webp" | "image/jpeg";
}

export interface CropExportResult {
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
  sizeBytes: number;
}

/**
 * Calculates a comfortable initial default zoom for the photo inside the viewport frame.
 * Instead of aggressive close-up cropping (cover = 1.0), it computes a natural framing
 * so subjects/faces don't get chopped off on day 1, while still allowing the user to zoom out
 * down to MIN_CROP_ZOOM (0.35) or in up to MAX_CROP_ZOOM (2.5).
 */
export function calculateDefaultZoom(
  imgWidth: number,
  imgHeight: number,
  viewportWidth: number,
  viewportHeight: number,
  rotation = 0
): number {
  const isRotated90 = Math.abs(rotation % 180) === 90;
  const effectiveW = isRotated90 ? imgHeight : imgWidth;
  const effectiveH = isRotated90 ? imgWidth : imgHeight;

  if (effectiveW <= 0 || effectiveH <= 0) return 0.85;

  const scaleX = viewportWidth / effectiveW;
  const scaleY = viewportHeight / effectiveH;
  const coverScale = Math.max(scaleX, scaleY);
  const containScale = Math.min(scaleX, scaleY);

  const fitRatio = containScale / coverScale;

  // If the aspect ratio of the photo is significantly wider or taller than the frame,
  // provide a comfortable ~0.70-0.85 framing so subjects aren't zoomed into extreme close-up.
  if (fitRatio < 0.85) {
    return Math.max(
      MIN_CROP_ZOOM + 0.1,
      Number(Math.min(0.85, fitRatio * 1.25).toFixed(2))
    );
  }

  return 0.95;
}

/**
 * Downscales and compresses a full original photo (e.g. 15MB phone camera shot)
 * to a lightweight, crisp WebP source (~200KB-350KB, max 1800px).
 * This ensures the uncropped original can be kept for future re-adjustments
 * without hogging storage or taking long to upload.
 */
export async function compressOriginalImage(
  fileOrBlob: File | Blob,
  maxDimension = 1800,
  quality = 0.88
): Promise<Blob> {
  const dataUrl = await fileToDataUrl(fileOrBlob);
  const img = await loadImage(dataUrl);

  const naturalW = img.naturalWidth;
  const naturalH = img.naturalHeight;

  if (naturalW <= 0 || naturalH <= 0) {
    return fileOrBlob;
  }

  let targetW = naturalW;
  let targetH = naturalH;
  const maxSide = Math.max(naturalW, naturalH);

  if (maxSide > maxDimension) {
    const scale = maxDimension / maxSide;
    targetW = Math.round(naturalW * scale);
    targetH = Math.round(naturalH * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d");
  if (!ctx) return fileOrBlob;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, targetW, targetH);

  return new Promise<Blob>((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else {
          canvas.toBlob(
            (fallback) => resolve(fallback || fileOrBlob),
            "image/jpeg",
            quality
          );
        }
      },
      "image/webp",
      quality
    );
  });
}

/**
 * Crops, repositions, scales, and compresses the image onto an offscreen canvas,
 * exporting an optimized WebP or JPEG blob.
 */
export async function cropAndExportImage(
  options: CropExportOptions
): Promise<CropExportResult> {
  const {
    image,
    crop,
    viewportWidth,
    viewportHeight,
    aspect,
    quality = 0.85,
    format = "image/webp",
  } = options;

  const targetDim = TARGET_DIMENSIONS[aspect] || TARGET_DIMENSIONS.portrait;
  const canvas = document.createElement("canvas");
  canvas.width = targetDim.width;
  canvas.height = targetDim.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Unable to create canvas 2D rendering context.");
  }

  // High quality smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Canvas scaling factor relative to the interactive viewport UI
  const scaleRatioX = targetDim.width / viewportWidth;
  const scaleRatioY = targetDim.height / viewportHeight;

  ctx.save();

  // Move origin to canvas center
  ctx.translate(targetDim.width / 2, targetDim.height / 2);

  // Apply pan (scaled up to export resolution)
  ctx.translate(crop.panX * scaleRatioX, crop.panY * scaleRatioY);

  // Apply rotation
  if (crop.rotation !== 0) {
    ctx.rotate((crop.rotation * Math.PI) / 180);
  }

  // Calculate base fit (object-fit: cover inside viewport)
  // When rotation is 90 or 270, effective image width/height swap
  const isRotated90 = Math.abs(crop.rotation % 180) === 90;
  const imgW = isRotated90 ? image.naturalHeight : image.naturalWidth;
  const imgH = isRotated90 ? image.naturalWidth : image.naturalHeight;

  // Fit cover base scale
  const scaleX = viewportWidth / imgW;
  const scaleY = viewportHeight / imgH;
  const baseScale = Math.max(scaleX, scaleY);

  // Apply zoom factor
  const totalScale = baseScale * crop.zoom;

  // Draw image centered
  const drawW = image.naturalWidth * totalScale * scaleRatioX;
  const drawH = image.naturalHeight * totalScale * scaleRatioY;

  ctx.drawImage(image, -drawW / 2, -drawH / 2, drawW, drawH);

  ctx.restore();

  // Export to Blob with compression
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) {
          resolve(b);
        } else {
          // Fallback to jpeg if browser fails to encode webp
          canvas.toBlob(
            (fallbackBlob) => {
              if (fallbackBlob) resolve(fallbackBlob);
              else reject(new Error("Failed to encode canvas image."));
            },
            "image/jpeg",
            quality
          );
        }
      },
      format,
      quality
    );
  });

  const dataUrl = canvas.toDataURL(format, quality);

  return {
    blob,
    dataUrl,
    width: targetDim.width,
    height: targetDim.height,
    sizeBytes: blob.size,
  };
}
