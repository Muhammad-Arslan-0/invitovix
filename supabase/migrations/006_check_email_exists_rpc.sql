-- Invitovix Email Existence Check RPC for Password Recovery
-- Safe to re-run (idempotent) in Supabase SQL Editor
-- Checks whether an email belongs to an existing account without exposing user data.

create or replace function public.check_email_exists(email_input text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  normalized_email text;
begin
  if email_input is null then
    return false;
  end if;

  normalized_email := lower(btrim(email_input));
  if normalized_email = '' then
    return false;
  end if;

  return exists (
    select 1
    from auth.users
    where lower(email) = normalized_email
  ) or exists (
    select 1
    from public.profiles
    where lower(email) = normalized_email
  );
end;
$$;

revoke all on function public.check_email_exists(text) from public;
grant execute on function public.check_email_exists(text) to anon, authenticated;
