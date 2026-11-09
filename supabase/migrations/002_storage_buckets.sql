-- Invitovix Storage Buckets & Access Policies
-- Creates `card-assets` (user uploads) and `templates` (system textures & audio)

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'card-assets',
  'card-assets',
  true,
  10485760, -- 10 MB
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

-- Public read access for card-assets and templates
drop policy if exists "Public read card-assets" on storage.objects;
create policy "Public read card-assets"
  on storage.objects for select
  using (bucket_id = 'card-assets');

drop policy if exists "Public read templates" on storage.objects;
create policy "Public read templates"
  on storage.objects for select
  using (bucket_id = 'templates');

-- Authenticated users can upload/modify/delete inside their own `<uid>/...` folder
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

