import { createClient } from "@/lib/supabase/client";

export interface AssetItem {
  id: string;
  name: string;
  path: string; // relative storage path inside bucket 'card-assets'
  publicUrl: string;
  sizeBytes: number;
  formattedSize: string;
  createdAt: string;
  type: "image" | "audio" | "other";
  mimeType?: string;
}

export interface StorageStats {
  totalCount: number;
  totalSizeBytes: number;
  formattedTotalSize: string;
  imageCount: number;
  audioCount: number;
}

export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${Math.round(kb)} KB`;
  }
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

/**
 * Recursively crawl the user's storage directory inside `card-assets`
 * and aggregate all media files.
 */
export async function listUserAssets(userId: string): Promise<AssetItem[]> {
  if (!userId) return [];
  const assets: AssetItem[] = [];
  const seenPaths = new Set<string>();

  try {
    const supabase = createClient();

    async function crawlFolder(folderPath: string, depth = 0) {
      if (depth > 4) return;
      try {
        const { data, error } = await supabase.storage
          .from("card-assets")
          .list(folderPath, {
            limit: 100,
            sortBy: { column: "created_at", order: "desc" },
          });

        if (error || !data) return;

        for (const item of data) {
          if (!item.name || item.name === ".emptyFolderPlaceholder") continue;

          const currentPath = folderPath ? `${folderPath}/${item.name}` : item.name;

          if (item.id === null) {
            await crawlFolder(currentPath, depth + 1);
          } else {
            if (seenPaths.has(currentPath)) continue;
            seenPaths.add(currentPath);

            const {
              data: { publicUrl },
            } = supabase.storage.from("card-assets").getPublicUrl(currentPath);

            const ext = item.name.split(".").pop()?.toLowerCase() || "";
            const isAudio =
              ["mp3", "wav", "ogg", "m4a", "aac", "mpeg"].includes(ext) ||
              item.metadata?.mimetype?.startsWith("audio/");
            const isImage =
              ["webp", "jpg", "jpeg", "png", "svg", "gif", "avif"].includes(ext) ||
              item.metadata?.mimetype?.startsWith("image/");

            const size = item.metadata?.size || 0;

            assets.push({
              id: currentPath,
              name: item.name,
              path: currentPath,
              publicUrl,
              sizeBytes: size,
              formattedSize: formatBytes(size),
              createdAt: item.created_at || new Date().toISOString(),
              type: isAudio ? "audio" : isImage ? "image" : "other",
              mimeType: item.metadata?.mimetype,
            });
          }
        }
      } catch {
        // Non-blocking fallback
      }
    }

    // 1. Crawl the user's root storage directory inside 'card-assets'
    await crawlFolder(userId);

    // 2. Discover active media URLs saved in user's events database
    try {
      const { data: userEvents } = await supabase
        .from("events")
        .select("id, design_data, audio_url")
        .eq("user_id", userId);

      if (userEvents && Array.isArray(userEvents)) {
        for (const ev of userEvents) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const dd = ev.design_data as any;
          const candidateUrls: Array<{ url?: string | null; type: "image" | "audio" }> = [
            { url: dd?.content?.heroImageUrl, type: "image" },
            { url: dd?.content?.couple?.brideImageUrl, type: "image" },
            { url: dd?.content?.couple?.brideOriginalUrl, type: "image" },
            { url: dd?.content?.couple?.groomImageUrl, type: "image" },
            { url: dd?.content?.couple?.groomOriginalUrl, type: "image" },
            { url: dd?.theme?.cardArt?.backdropUrl, type: "image" },
            { url: dd?.audio?.customUrl, type: "audio" },
            { url: ev.audio_url, type: "audio" },
          ];

          if (Array.isArray(dd?.content?.gallery)) {
            for (const g of dd.content.gallery) {
              candidateUrls.push({ url: g?.imageUrl, type: "image" });
            }
          }

          for (const candidate of candidateUrls) {
            if (!candidate.url || typeof candidate.url !== "string") continue;
            if (!candidate.url.includes("card-assets")) continue;

            const match = candidate.url.match(/card-assets\/(.+)$/);
            if (match && match[1]) {
              const relPath = decodeURIComponent(match[1].split("?")[0]);
              if (!seenPaths.has(relPath)) {
                seenPaths.add(relPath);
                const fileName = relPath.split("/").pop() || "asset";
                assets.push({
                  id: relPath,
                  name: fileName,
                  path: relPath,
                  publicUrl: candidate.url,
                  sizeBytes: 150 * 1024,
                  formattedSize: "~150 KB",
                  createdAt: new Date().toISOString(),
                  type: candidate.type,
                });
              }
            }
          }
        }
      }
    } catch {
      // Non-blocking fallback
    }
  } catch {
    // If Supabase env is not configured, return empty gracefully
    return [];
  }

  return assets.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Permanently delete a file from Supabase storage bucket `card-assets`.
 */
export async function deleteAsset(
  path: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    let cleanPath = path;
    if (cleanPath.includes("card-assets/")) {
      cleanPath = cleanPath.substring(
        cleanPath.indexOf("card-assets/") + "card-assets/".length
      );
    }
    cleanPath = decodeURIComponent(cleanPath.split("?")[0]);

    const { error } = await supabase.storage.from("card-assets").remove([cleanPath]);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete file from storage.",
    };
  }
}

/**
 * Compute aggregate storage metrics across all user assets.
 */
export function computeStorageStats(assets: AssetItem[]): StorageStats {
  const totalCount = assets.length;
  let totalSizeBytes = 0;
  let imageCount = 0;
  let audioCount = 0;

  for (const a of assets) {
    totalSizeBytes += a.sizeBytes || 0;
    if (a.type === "image") imageCount++;
    if (a.type === "audio") audioCount++;
  }

  return {
    totalCount,
    totalSizeBytes,
    formattedTotalSize: formatBytes(totalSizeBytes),
    imageCount,
    audioCount,
  };
}
