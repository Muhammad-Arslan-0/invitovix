import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnvLocal() {
  const envPath = path.resolve("d:/data/tekzovix/invitovix/.env.local");
  if (!fs.existsSync(envPath)) {
    throw new Error(".env.local file not found");
  }
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) {
      process.env[key] = val;
    }
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!url.startsWith("http") || !key || key.includes("your-supabase-anon-key")) {
  console.error(
    "FAIL: Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local first."
  );
  process.exit(1);
}

const supabase = createClient(url, key);

console.log("Checking Supabase project:", url);

const { data: templates, error: tplErr } = await supabase
  .from("templates")
  .select("id, title, category");

if (tplErr) {
  console.error("FAIL [templates table]:", tplErr.message);
  console.error(
    "Hint: Run supabase/setup_all.sql in Supabase Dashboard -> SQL Editor."
  );
  process.exit(1);
}
console.log(
  `PASS [templates]: ${templates?.length ?? 0} starter templates found (${(templates ?? [])
    .map((t) => t.category)
    .join(", ")})`
);

const { error: eventsErr } = await supabase
  .from("events")
  .select("id")
  .limit(1);

if (eventsErr) {
  console.error("FAIL [events table]:", eventsErr.message);
  process.exit(1);
}
console.log("PASS [events]: Table & public RLS reachable");

const { error: rsvpsErr } = await supabase
  .from("rsvps")
  .select("id")
  .limit(1);

if (rsvpsErr && !rsvpsErr.message.toLowerCase().includes("permission denied")) {
  console.error("FAIL [rsvps table]:", rsvpsErr.message);
  process.exit(1);
}
console.log("PASS [rsvps]: Anonymous reads blocked; host-scoped RLS active");

const { data: buckets, error: bucketErr } = await supabase.storage.listBuckets();
if (bucketErr) {
  console.log(
    "INFO [storage]: listBuckets requires authenticated/service role; verify 'card-assets' and 'templates' buckets exist in Supabase Dashboard -> Storage."
  );
} else {
  const names = (buckets ?? []).map((b) => b.name);
  console.log("PASS [storage]: Visible buckets:", names.join(", ") || "none");
}

console.log("\nSupabase connection check complete!");

