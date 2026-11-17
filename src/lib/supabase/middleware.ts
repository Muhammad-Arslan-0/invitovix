import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "./env";

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const { url, anonKey, isConfigured } = getSupabaseEnv();
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/api/geocode") ||
    pathname.startsWith("/api/auth/check-email")
  ) {
    return supabaseResponse;
  }

  // Handle Supabase Auth recovery or error query parameters landing on the root "/"
  if (pathname === "/") {
    const error = request.nextUrl.searchParams.get("error");
    const errorCode = request.nextUrl.searchParams.get("error_code");
    const code = request.nextUrl.searchParams.get("code");
    const type = request.nextUrl.searchParams.get("type");

    if (
      errorCode === "otp_expired" ||
      error === "access_denied" ||
      type === "recovery"
    ) {
      const resetUrl = request.nextUrl.clone();
      resetUrl.pathname = "/reset-password";
      return NextResponse.redirect(resetUrl);
    }

    if (code && !request.cookies.getAll().some((c) => c.name.startsWith("sb-"))) {
      const callbackUrl = request.nextUrl.clone();
      callbackUrl.pathname = "/auth/callback";
      if (!callbackUrl.searchParams.has("next")) {
        callbackUrl.searchParams.set("next", "/reset-password");
      }
      return NextResponse.redirect(callbackUrl);
    }
  }

  const isProtected =
    pathname.startsWith("/dashboard") || pathname.startsWith("/studio");

  if (!isConfigured) {
    if (isProtected) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("setup", "missing");
      return NextResponse.redirect(loginUrl);
    }
    return supabaseResponse;
  }

  const requestCookies = request.cookies.getAll();
  const hasAuthCookie = requestCookies.some((c) => c.name.startsWith("sb-"));

  // Fast-path when visitor has no Supabase session cookie at all (0ms, avoids unnecessary Auth round trip)
  if (!hasAuthCookie) {
    if (isProtected) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(redirectUrl);
    }
    return supabaseResponse;
  }

  // Skip remote auth verification during Next.js background prefetches on public routes only
  const isPrefetch =
    request.headers.get("next-router-prefetch") === "1" ||
    request.headers.get("purpose") === "prefetch";
  if (isPrefetch && !isProtected) {
    return supabaseResponse;
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && isProtected) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && pathname === "/login") {
    const dashUrl = request.nextUrl.clone();
    dashUrl.pathname = "/dashboard";
    const redirectRes = NextResponse.redirect(dashUrl);
    supabaseResponse.cookies.getAll().forEach((c) => {
      redirectRes.cookies.set(c.name, c.value);
    });
    return redirectRes;
  }

  return supabaseResponse;
}
