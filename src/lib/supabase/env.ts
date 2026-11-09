export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  const isConfigured =
    Boolean(url) &&
    Boolean(anonKey) &&
    !anonKey.includes("your-supabase-anon-key") &&
    url.startsWith("http");

  return {
    url,
    anonKey,
    isConfigured,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  };
}

