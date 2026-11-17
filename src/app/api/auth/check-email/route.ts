import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Lightweight per-IP rate limiting to prevent abuse / spam enumeration
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();

  if (rateLimitStore.size > 1000) {
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetAt <= now) {
        rateLimitStore.delete(key);
      }
    }
  }

  const current = rateLimitStore.get(ip);
  if (!current || current.resetAt <= now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  current.count += 1;
  return false;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        error:
          "Too many requests. Please wait a minute before trying again.",
      },
      { status: 429 }
    );
  }

  let body: { email?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 }
    );
  }

  const rawEmail = typeof body.email === "string" ? body.email : "";
  const normalizedEmail = rawEmail.trim().toLowerCase();

  if (!normalizedEmail || !EMAIL_REGEX.test(normalizedEmail)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json(
      {
        error:
          "Account recovery is currently unavailable. Please check back shortly.",
      },
      { status: 503 }
    );
  }

  const { data, error } = await supabase.rpc("check_email_exists", {
    email_input: normalizedEmail,
  });

  if (error) {
    console.error("[check-email] RPC error:", error.message);
    return NextResponse.json(
      {
        error:
          "Unable to verify this email address right now. Please try again shortly.",
      },
      { status: 503 }
    );
  }

  return NextResponse.json({ exists: Boolean(data) });
}
