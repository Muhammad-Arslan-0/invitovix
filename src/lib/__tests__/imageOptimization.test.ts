import { describe, it, expect } from "vitest";
import {
  validateImageFile,
  formatBytes,
  MAX_IMAGE_FILE_MB,
  MIN_CROP_ZOOM,
  MAX_CROP_ZOOM,
  calculateDefaultZoom,
  TARGET_DIMENSIONS,
} from "../utils/imageOptimization";

describe("Image Validation & Optimization Utilities", () => {
  it("approves valid JPEG, PNG, and WebP images within size limits", () => {
    const validJpg = new File(["dummy content"], "photo.jpg", {
      type: "image/jpeg",
    });
    const validPng = new File(["dummy content"], "portrait.png", {
      type: "image/png",
    });
    const validWebp = new File(["dummy content"], "couple.webp", {
      type: "image/webp",
    });

    expect(validateImageFile(validJpg).valid).toBe(true);
    expect(validateImageFile(validPng).valid).toBe(true);
    expect(validateImageFile(validWebp).valid).toBe(true);
  });

  it("rejects images exceeding the 15 MB threshold with friendly user error", () => {
    // 16 MB dummy file
    const sixteenMb = 16 * 1024 * 1024;
    const oversizedFile = {
      name: "huge-raw-camera.jpg",
      type: "image/jpeg",
      size: sixteenMb,
    } as unknown as File;

    const result = validateImageFile(oversizedFile, MAX_IMAGE_FILE_MB);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Photo exceeds the maximum allowed size of 15 MB");
    expect(result.error).toContain("16 MB");
  });

  it("respects custom maxMb limits", () => {
    const fourMb = 4 * 1024 * 1024;
    const testFile = {
      name: "midsize.png",
      type: "image/png",
      size: fourMb,
    } as unknown as File;

    // Allowed under 10MB
    expect(validateImageFile(testFile, 10).valid).toBe(true);

    // Rejected under 2MB
    const rejected = validateImageFile(testFile, 2);
    expect(rejected.valid).toBe(false);
    expect(rejected.error).toContain("maximum allowed size of 2 MB");
  });

  it("rejects non-image files", () => {
    const pdfFile = new File(["pdf"], "document.pdf", {
      type: "application/pdf",
    });
    const result = validateImageFile(pdfFile);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Unsupported image format");
  });

  it("formats byte sizes into clean human-readable text", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(150 * 1024)).toBe("150 KB");
    expect(formatBytes(4.5 * 1024 * 1024)).toBe("4.5 MB");
    expect(formatBytes(16 * 1024 * 1024)).toBe("16 MB");
  });

  it("defines standard high-res aspect ratio dimensions for cards", () => {
    // Portrait (4:5) for Couple Scene
    expect(TARGET_DIMENSIONS.portrait.width).toBe(1200);
    expect(TARGET_DIMENSIONS.portrait.height).toBe(1500);
    expect(TARGET_DIMENSIONS.portrait.aspectRatio).toBeCloseTo(0.8, 2);

    // Landscape (16:9) for Hero Cover
    expect(TARGET_DIMENSIONS.landscape.width).toBe(1600);
    expect(TARGET_DIMENSIONS.landscape.height).toBe(900);
    expect(TARGET_DIMENSIONS.landscape.aspectRatio).toBeCloseTo(16 / 9, 2);

    // Square (1:1) for Photo Gallery
    expect(TARGET_DIMENSIONS.square.width).toBe(1080);
    expect(TARGET_DIMENSIONS.square.height).toBe(1080);
    expect(TARGET_DIMENSIONS.square.aspectRatio).toBe(1);
  });

  it("supports zooming out down to 0.35 on the slider and calculates comfortable default zoom", () => {
    expect(MIN_CROP_ZOOM).toBe(0.35);
    expect(MAX_CROP_ZOOM).toBe(2.5);

    // For a 4:3 landscape photo in a 4:5 portrait frame, default zoom should not be 1.0 (over-cropped)
    const landscapeZoom = calculateDefaultZoom(4000, 3000, 240, 300);
    expect(landscapeZoom).toBeLessThan(1.0);
    expect(landscapeZoom).toBeGreaterThanOrEqual(MIN_CROP_ZOOM);

    // For a matching aspect ratio, default zoom fits cleanly
    const matchingZoom = calculateDefaultZoom(1600, 900, 340, 191);
    expect(matchingZoom).toBe(0.95);
  });
});
