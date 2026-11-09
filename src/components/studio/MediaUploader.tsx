"use client";

import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface MediaUploaderProps {
  userId: string;
  eventId: string;
  accept: string;
  label: string;
  folder?: "images" | "audio";
  onUploaded: (publicUrl: string, fileName: string) => void;
}

export function MediaUploader({
  userId,
  eventId,
  accept,
  label,
  folder = "images",
  onUploaded,
}: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError("File exceeds 10 MB storage limit.");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const supabase = createClient();
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const objectPath = `${userId}/${eventId}/${folder}/${Date.now()}-${safeName}`;

      const { error: uploadErr } = await supabase.storage
        .from("card-assets")
        .upload(objectPath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadErr) {
        setError(uploadErr.message);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("card-assets").getPublicUrl(objectPath);

      onUploaded(publicUrl, file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
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
            <span>Uploading to Supabase...</span>
          </>
        ) : (
          <>
            <Upload className="w-3.5 h-3.5" />
            <span>{label}</span>
          </>
        )}
      </button>
      {error && <p className="mt-1.5 text-[11px] text-rose-600">{error}</p>}
    </div>
  );
}

