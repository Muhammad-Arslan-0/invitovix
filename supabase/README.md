# Invitovix — Supabase Cloud Setup Guide

Project Ref: `szwirgptjptqrtdgaqbi`
Project URL: `https://szwirgptjptqrtdgaqbi.supabase.co`

## 1. Environment Variables
Copy `.env.example` to `.env.local` and set your **anon / publishable** key from **Supabase Dashboard → Project Settings → API**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://szwirgptjptqrtdgaqbi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 2. Run SQL Migrations
Open **Supabase Dashboard → SQL Editor** and execute these three files in order:
1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_storage_buckets.sql`
3. `supabase/migrations/003_seed_templates.sql`

## 3. Configure Auth Redirect URLs (For Magic Link & Auth Callback)
In **Supabase Dashboard → Authentication → URL Configuration**:
- Set **Site URL** to `http://localhost:3000`
- Add `http://localhost:3000/auth/callback` to **Redirect URLs**

