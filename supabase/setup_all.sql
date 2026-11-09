-- ============================================================================
-- Invitovix Complete Supabase Setup Script (Idempotent / Safe to Re-run)
-- Paste into Supabase Dashboard -> SQL Editor -> New Query -> Run
-- Includes: Tables, Triggers, RLS Policies, Starter Templates, Storage Buckets
-- ============================================================================

create extension if not exists pgcrypto;

-- 1. Profiles
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Templates
create table if not exists public.templates (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text not null default 'wedding',
  thumbnail_url text,
  default_config jsonb not null default '{}'::jsonb,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Events (Invitations)
create table if not exists public.events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  template_id uuid references public.templates(id) on delete set null,
  slug text unique not null,
  title text not null,
  event_type text default 'wedding',
  event_date timestamp with time zone not null,
  venue_name text not null,
  venue_address text,
  venue_map_url text,
  audio_url text,
  design_data jsonb not null default '{}'::jsonb,
  is_published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. RSVPs
create table if not exists public.rsvps (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references public.events(id) on delete cascade not null,
  guest_name text not null,
  email text,
  phone text,
  attending_status text not null check (attending_status in ('attending', 'declined', 'tentative')),
  guests_count int default 1 check (guests_count >= 1 and guests_count <= 20),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes
create index if not exists idx_events_slug on public.events (slug);
create index if not exists idx_events_user_id on public.events (user_id);
create index if not exists idx_rsvps_event_id on public.rsvps (event_id);

-- Updated_at trigger for events
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists trg_events_updated_at on public.events;
create trigger trg_events_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

-- Auto-create profile when a user registers via Supabase Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(coalesce(new.email, ''), '@', 1)),
    new.email
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(nullif(public.profiles.full_name, ''), excluded.full_name);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

insert into public.profiles (id, full_name, email)
select
  u.id,
  coalesce(u.raw_user_meta_data ->> 'full_name', split_part(coalesce(u.email, ''), '@', 1)),
  u.email
from auth.users u
on conflict (id) do nothing;

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.templates enable row level security;
alter table public.events enable row level security;
alter table public.rsvps enable row level security;

-- Schema & Table Grants (required for Supabase anon / publishable & authenticated roles)
grant usage on schema public to anon, authenticated;
grant select on table public.templates to anon, authenticated;
grant select, insert, update on table public.profiles to authenticated;
grant select on table public.events to anon;
grant select, insert, update, delete on table public.events to authenticated;
grant insert on table public.rsvps to anon;
grant select, insert, delete on table public.rsvps to authenticated;

-- Profiles Policies
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Templates Policies
drop policy if exists "Templates are viewable by everyone" on public.templates;
create policy "Templates are viewable by everyone"
  on public.templates for select
  using (true);

-- Events Policies
drop policy if exists "Public events are viewable by slug" on public.events;
drop policy if exists "Published events or host drafts are viewable" on public.events;
create policy "Published events or host drafts are viewable"
  on public.events for select
  using (is_published = true or auth.uid() = user_id);

drop policy if exists "Users can manage own events" on public.events;
drop policy if exists "Users can insert own events" on public.events;
create policy "Users can insert own events"
  on public.events for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own events" on public.events;
create policy "Users can update own events"
  on public.events for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own events" on public.events;
create policy "Users can delete own events"
  on public.events for delete
  using (auth.uid() = user_id);

-- RSVPs Policies
drop policy if exists "Anyone can insert RSVP" on public.rsvps;
drop policy if exists "Anyone can insert RSVP for published events" on public.rsvps;
create policy "Anyone can insert RSVP for published events"
  on public.rsvps for insert
  with check (
    exists (
      select 1 from public.events
      where events.id = rsvps.event_id and events.is_published = true
    )
  );

drop policy if exists "Hosts can view RSVPs for their events" on public.rsvps;
create policy "Hosts can view RSVPs for their events"
  on public.rsvps for select
  using (
    exists (
      select 1 from public.events
      where events.id = rsvps.event_id and events.user_id = auth.uid()
    )
  );

drop policy if exists "Hosts can delete RSVPs for their events" on public.rsvps;
create policy "Hosts can delete RSVPs for their events"
  on public.rsvps for delete
  using (
    exists (
      select 1 from public.events
      where events.id = rsvps.event_id and events.user_id = auth.uid()
    )
  );

-- Seed 4 Curated Starter Templates
insert into public.templates (id, title, category, thumbnail_url, is_active, default_config)
values
(
  '11111111-1111-4111-8111-111111111101',
  'Noor-e-Nikah (Royal Emerald)',
  'wedding',
  '/templates/noor-emerald.svg',
  true,
  '{
    "theme": {
      "presetId": "noor-emerald",
      "palette": {
        "background": "#FAF6EE",
        "surface": "#FFFDF8",
        "primary": "#114232",
        "secondary": "#1B5E47",
        "accent": "#C99A3B",
        "text": "#17261F",
        "mutedText": "#5E6B64"
      },
      "typography": {
        "displayFont": "cinzel",
        "bodyFont": "cormorant",
        "scriptFont": "great-vibes"
      },
      "paperTexture": "linen"
    },
    "envelope": {
      "style": "royal-flap",
      "envelopeColor": "#114232",
      "linerColor": "#C99A3B",
      "waxSeal": {
        "enabled": true,
        "color": "#B3842B",
        "monogram": "A&Z",
        "emblem": "floral"
      },
      "promptText": "Tap the gold wax seal to unseal your invitation"
    },
    "content": {
      "hostLine": "Together with their beloved families",
      "headline": "Amina & Zayan",
      "subtitle": "Request the honor of your presence at their Nikah & Reception",
      "storyQuote": "Two souls, one timeless promise — surrounded by family, prayer, and celebration.",
      "heroImageUrl": null,
      "dressCode": "Formal Traditional / Emerald & Champagne",
      "itinerary": [
        { "id": "it-1", "title": "Guest Arrival & Welcome Rose Sherbet", "time": "6:30 PM", "description": "Courtyard lantern reception and acoustic strings" },
        { "id": "it-2", "title": "Nikah Ceremony", "time": "7:30 PM", "description": "Sacred vows beneath the floral pavilion" },
        { "id": "it-3", "title": "Royal Banquet Dinner", "time": "8:45 PM", "description": "Candlelit feast and family toasts" }
      ],
      "gallery": [],
      "rsvpHeadline": "Kindly Reply",
      "rsvpDeadline": "Two weeks prior to the celebration",
      "maxGuestsPerParty": 6
    },
    "sections": {
      "showCountdown": true,
      "showItinerary": true,
      "showVenue": true,
      "showGallery": true,
      "showRsvp": true
    },
    "motion": {
      "preset": "royal-unfold",
      "particles": "gold-dust",
      "lottieAccent": "floral-flourish"
    },
    "audio": {
      "enabled": true,
      "trackId": "ambient-piano",
      "trackTitle": "Velvet Nocturne",
      "customUrl": null,
      "volume": 0.6
    }
  }'::jsonb
),
(
  '11111111-1111-4111-8111-111111111102',
  'Moonlit Valima (Midnight Pearl)',
  'valima',
  '/templates/moonlit-valima.svg',
  true,
  '{
    "theme": {
      "presetId": "moonlit-valima",
      "palette": {
        "background": "#0E1324",
        "surface": "#161D35",
        "primary": "#E5C185",
        "secondary": "#242E52",
        "accent": "#F3D9B1",
        "text": "#F7F3EA",
        "mutedText": "#A8B2CE"
      },
      "typography": {
        "displayFont": "playfair",
        "bodyFont": "jakarta",
        "scriptFont": "great-vibes"
      },
      "paperTexture": "silk"
    },
    "envelope": {
      "style": "arch-pocket",
      "envelopeColor": "#161D35",
      "linerColor": "#E5C185",
      "waxSeal": {
        "enabled": true,
        "color": "#C99A4E",
        "monogram": "H&S",
        "emblem": "crescent"
      },
      "promptText": "Tap the crescent seal to open under starlight"
    },
    "content": {
      "hostLine": "Mr. & Mrs. Siddiqui cordially invite you to the Valima Reception of",
      "headline": "Hamza & Sana",
      "subtitle": "An evening of moonlight, gratitude, and heartfelt celebration",
      "storyQuote": "As the stars gather above, we celebrate a new chapter blessed with love and warmth.",
      "heroImageUrl": null,
      "dressCode": "Evening Formal / Midnight, Ivory & Pearl",
      "itinerary": [
        { "id": "it-1", "title": "Red Carpet & Portraits", "time": "7:30 PM", "description": "Welcome mocktails and family photographs" },
        { "id": "it-2", "title": "Grand Entrance", "time": "8:30 PM", "description": "Candlelit walkway and live instrumental tribute" },
        { "id": "it-3", "title": "Valima Dinner & Dessert Salon", "time": "9:15 PM", "description": "Artisanal culinary showcase and chai bar" }
      ],
      "gallery": [],
      "rsvpHeadline": "Reserve Your Seat",
      "rsvpDeadline": "Please confirm attendance at your earliest convenience",
      "maxGuestsPerParty": 6
    },
    "sections": {
      "showCountdown": true,
      "showItinerary": true,
      "showVenue": true,
      "showGallery": true,
      "showRsvp": true
    },
    "motion": {
      "preset": "cinematic-silk",
      "particles": "starlight",
      "lottieAccent": "sparkle-ring"
    },
    "audio": {
      "enabled": true,
      "trackId": "celestial-harp",
      "trackTitle": "Moonlight Harp",
      "customUrl": null,
      "volume": 0.55
    }
  }'::jsonb
),
(
  '11111111-1111-4111-8111-111111111103',
  'Confetti Atelier (Editorial Birthday)',
  'birthday',
  '/templates/confetti-atelier.svg',
  true,
  '{
    "theme": {
      "presetId": "confetti-atelier",
      "palette": {
        "background": "#FFF7F2",
        "surface": "#FFFFFF",
        "primary": "#C94B38",
        "secondary": "#F29E74",
        "accent": "#E8B931",
        "text": "#231917",
        "mutedText": "#755F59"
      },
      "typography": {
        "displayFont": "syne",
        "bodyFont": "dm-sans",
        "scriptFont": "great-vibes"
      },
      "paperTexture": "vellum"
    },
    "envelope": {
      "style": "minimal-folio",
      "envelopeColor": "#C94B38",
      "linerColor": "#F9DFD5",
      "waxSeal": {
        "enabled": true,
        "color": "#E8B931",
        "monogram": "30",
        "emblem": "star"
      },
      "promptText": "Tap the golden star seal to pop the celebration"
    },
    "content": {
      "hostLine": "Raise a glass & celebrate",
      "headline": "Maya Turns 30",
      "subtitle": "Golden hour rooftops, vinyl beats, and unforgettable memories",
      "storyQuote": "Three decades of adventures — come celebrate the next chapter together!",
      "heroImageUrl": null,
      "dressCode": "Cocktail Chic / Sunset Hues",
      "itinerary": [
        { "id": "it-1", "title": "Sunset Spritz & Polaroids", "time": "6:00 PM", "description": "Rooftop terrace welcome drinks" },
        { "id": "it-2", "title": "Candlelight Toasts & Cake", "time": "8:00 PM", "description": "Speeches, sparklers, and artisan cake cutting" },
        { "id": "it-3", "title": "Late Night Vinyl Set", "time": "9:30 PM", "description": "Dance floor under the string lights" }
      ],
      "gallery": [],
      "rsvpHeadline": "Are You In?",
      "rsvpDeadline": "Let us know so we save your spot at the bar",
      "maxGuestsPerParty": 4
    },
    "sections": {
      "showCountdown": true,
      "showItinerary": true,
      "showVenue": true,
      "showGallery": true,
      "showRsvp": true
    },
    "motion": {
      "preset": "playful-pop",
      "particles": "confetti",
      "lottieAccent": "confetti-burst"
    },
    "audio": {
      "enabled": true,
      "trackId": "festive-strings",
      "trackTitle": "Golden Hour Chimes",
      "customUrl": null,
      "volume": 0.65
    }
  }'::jsonb
),
(
  '11111111-1111-4111-8111-111111111104',
  'Noir & Champagne (Black-Tie Gala)',
  'gala',
  '/templates/noir-gala.svg',
  true,
  '{
    "theme": {
      "presetId": "noir-gala",
      "palette": {
        "background": "#0B0B0D",
        "surface": "#151519",
        "primary": "#D4AF37",
        "secondary": "#2A251B",
        "accent": "#F3E5AB",
        "text": "#F5F2EB",
        "mutedText": "#9E978B"
      },
      "typography": {
        "displayFont": "cinzel",
        "bodyFont": "jakarta",
        "scriptFont": "cormorant"
      },
      "paperTexture": "obsidian"
    },
    "envelope": {
      "style": "art-deco",
      "envelopeColor": "#151519",
      "linerColor": "#D4AF37",
      "waxSeal": {
        "enabled": true,
        "color": "#D4AF37",
        "monogram": "VIP",
        "emblem": "crown"
      },
      "promptText": "Tap the crest to enter the annual gala"
    },
    "content": {
      "hostLine": "An Exclusive Evening Benefiting Creative Arts",
      "headline": "The Lumiere Gala",
      "subtitle": "Black-tie dinner, live auction, and symphony showcase",
      "storyQuote": "Elegance in every detail — celebrating visionaries, patronage, and timeless craft.",
      "heroImageUrl": null,
      "dressCode": "Strict Black Tie",
      "itinerary": [
        { "id": "it-1", "title": "Champagne Reception", "time": "7:00 PM", "description": "Gallery atrium preview & string quartet" },
        { "id": "it-2", "title": "Keynote & Honors", "time": "8:15 PM", "description": "Three-course gala dinner and awards" },
        { "id": "it-3", "title": "Midnight Encore", "time": "10:00 PM", "description": "Jazz lounge and curated dessert tasting" }
      ],
      "gallery": [],
      "rsvpHeadline": "Confirm Attendance",
      "rsvpDeadline": "Kindly RSVP for seating assignment",
      "maxGuestsPerParty": 4
    },
    "sections": {
      "showCountdown": true,
      "showItinerary": true,
      "showVenue": true,
      "showGallery": true,
      "showRsvp": true
    },
    "motion": {
      "preset": "editorial-fade",
      "particles": "gold-dust",
      "lottieAccent": "sparkle-ring"
    },
    "audio": {
      "enabled": true,
      "trackId": "ambient-piano",
      "trackTitle": "Velvet Nocturne",
      "customUrl": null,
      "volume": 0.5
    }
  }'::jsonb
)
on conflict (id) do update
  set title = excluded.title,
      category = excluded.category,
      thumbnail_url = excluded.thumbnail_url,
      default_config = excluded.default_config,
      is_active = excluded.is_active;

-- Storage Buckets & Access Policies
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'card-assets',
  'card-assets',
  true,
  10485760,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/ogg'
  ]
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit)
values ('templates', 'templates', true, 10485760)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit;

drop policy if exists "Public read card-assets" on storage.objects;
create policy "Public read card-assets"
  on storage.objects for select
  using (bucket_id = 'card-assets');

drop policy if exists "Public read templates" on storage.objects;
create policy "Public read templates"
  on storage.objects for select
  using (bucket_id = 'templates');

drop policy if exists "Authenticated upload own card-assets" on storage.objects;
create policy "Authenticated upload own card-assets"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'card-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Authenticated update own card-assets" on storage.objects;
create policy "Authenticated update own card-assets"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'card-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Authenticated delete own card-assets" on storage.objects;
create policy "Authenticated delete own card-assets"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'card-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

