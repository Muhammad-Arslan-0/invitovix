-- Invitovix Initial Database Schema, Triggers & Row Level Security
-- Safe to re-run (idempotent) in Supabase SQL Editor

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
  category text not null default 'wedding', -- wedding, valima, birthday, gala
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

-- Backfill profiles for any already-existing auth users
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

