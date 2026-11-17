"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AuthRedirectHandler() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash;

    if (hash) {
      if (
        hash.includes("type=recovery") ||
        hash.includes("error_code=otp_expired") ||
        hash.includes("error=access_denied") ||
        (hash.includes("access_token") && hash.includes("recovery"))
      ) {
        const cleanHash = hash.replace(/^#/, "");
        const params = new URLSearchParams(cleanHash);
        router.replace(`/reset-password?${params.toString()}`);
      }
    }
  }, [router]);

  return null;
}
