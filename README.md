# Invitovix

Interactive animated event and wedding invitation platform built with **Next.js App Router (TypeScript)**, **Tailwind CSS**, **Framer Motion**, **GSAP**, **DotLottie**, **Howler.js**, **Zustand**, and **Supabase**.

## Local Development Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure Supabase Cloud**
   - Copy `.env.example` to `.env.local`:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=https://szwirgptjptqrtdgaqbi.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
     NEXT_PUBLIC_SITE_URL=http://localhost:3000
     ```
   - Run the SQL files in `supabase/migrations/` (`001_initial_schema.sql`, `002_storage_buckets.sql`, `003_seed_templates.sql`) in your Supabase SQL Editor.
   - Add `http://localhost:3000/auth/callback` to **Authentication → URL Configuration → Redirect URLs** in Supabase.

3. **Run the development server**
   ```bash
   npm run dev
   ```
   - Landing page: `http://localhost:3000`
   - Guest demo experience (works even before Supabase keys): `http://localhost:3000/e/demo`
   - Creator Studio & Host Dashboard: `http://localhost:3000/login` -> `/dashboard`

