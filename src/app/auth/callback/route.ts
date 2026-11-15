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

  // If password reset recovery link expired, redirect back to forgot-password with clear error
  if (next === "/reset-password") {
    return NextResponse.redirect(`${origin}/forgot-password?error=link_expired`);
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}

