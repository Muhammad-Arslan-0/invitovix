import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") ?? "/dashboard";
  // Protect against open redirect attacks by ensuring next is a safe relative pathname
  const next =
    rawNext.startsWith("/") && !rawNext.startsWith("//")
      ? rawNext
      : "/dashboard";

  if (code) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          // Ensure profile exists even if user predated trigger
          await supabase.from("profiles").upsert(
            {
              id: user.id,
              email: user.email,
              full_name:
                (user.user_metadata?.full_name as string | undefined) ||
                user.email?.split("@")[0] ||
                "Host",
            },
            { onConflict: "id" }
          );
        }

        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // If password reset recovery link, forward directly to /reset-password
  // preserving query params (like code, token_hash, etc.) so client can authenticate
  if (next === "/reset-password") {
    const forwardUrl = new URL(`${origin}/reset-password`);
    searchParams.forEach((val, key) => {
      if (key !== "next") {
        forwardUrl.searchParams.set(key, val);
      }
    });
    return NextResponse.redirect(forwardUrl.toString());
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}

