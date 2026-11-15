import { describe, expect, it } from "vitest";
import {
  formatBytes,
  computeStorageStats,
  AssetItem,
} from "@/lib/storage/assetManager";

describe("Asset Manager & Storage Optimization", () => {
  it("formats byte sizes cleanly for user consumption", () => {
    expect(formatBytes(0)).toBe("0 KB");
    expect(formatBytes(-100)).toBe("0 KB");
    expect(formatBytes(512)).toBe("1 KB");
    expect(formatBytes(1024)).toBe("1 KB");
    expect(formatBytes(150 * 1024)).toBe("150 KB");
    expect(formatBytes(1024 * 1024)).toBe("1.0 MB");
    expect(formatBytes(2.5 * 1024 * 1024)).toBe("2.5 MB");
    expect(formatBytes(10.75 * 1024 * 1024)).toBe("10.8 MB");
  });

  it("computes accurate aggregate metrics across images and audio assets", () => {
    const mockAssets: AssetItem[] = [
      {
        id: "1",
        name: "bride-portrait.webp",
        path: "user-1/images/bride-portrait.webp",
        publicUrl: "https://example.com/bride.webp",
        sizeBytes: 200 * 1024,
        formattedSize: "200 KB",
        createdAt: "2026-11-15T12:00:00Z",
        type: "image",
      },
      {
        id: "2",
        name: "groom-portrait.webp",
        path: "user-1/images/groom-portrait.webp",
        publicUrl: "https://example.com/groom.webp",
        sizeBytes: 300 * 1024,
        formattedSize: "300 KB",
        createdAt: "2026-11-15T12:05:00Z",
        type: "image",
      },
      {
        id: "3",
        name: "wedding-song.mp3",
        path: "user-1/audio/wedding-song.mp3",
        publicUrl: "https://example.com/song.mp3",
        sizeBytes: 1500 * 1024,
        formattedSize: "1.5 MB",
        createdAt: "2026-11-15T12:10:00Z",
        type: "audio",
      },
    ];

    const stats = computeStorageStats(mockAssets);
    expect(stats.totalCount).toBe(3);
    expect(stats.imageCount).toBe(2);
    expect(stats.audioCount).toBe(1);
    expect(stats.totalSizeBytes).toBe(2000 * 1024);
    expect(stats.formattedTotalSize).toBe("2.0 MB");
  });

  it("handles empty asset list safely", () => {
    const stats = computeStorageStats([]);
    expect(stats.totalCount).toBe(0);
    expect(stats.imageCount).toBe(0);
    expect(stats.audioCount).toBe(0);
    expect(stats.totalSizeBytes).toBe(0);
    expect(stats.formattedTotalSize).toBe("0 KB");
  });
});
