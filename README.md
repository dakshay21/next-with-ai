# Bookmarks

A minimal personal bookmarks app built with Next.js and Supabase.

## Setup

1. Copy environment variables:

```bash
cp .env.example .env.local
```

2. Create a [Supabase project](https://supabase.com/dashboard) and add your URL and publishable key to `.env.local`.

3. Apply the database migration in Supabase SQL Editor (paste contents of `supabase/migrations/20250607000000_init_schema.sql`) or run:

```bash
npx supabase db push
```

4. Configure Supabase Auth (Dashboard):

   - **Authentication → Providers → Email:** Confirm email **ON**, custom SMTP **OFF**
   - **Authentication → Email Templates → Confirm signup:** customize subject/body with welcome copy + `{{ .ConfirmationURL }}`
   - **Authentication → URL Configuration:**
     - Site URL: `http://localhost:3000` (or your production URL)
     - Redirect URLs: `http://localhost:3000/auth/callback`

5. Install and run:

```bash
npm install
npm run dev
```

## Email testing (built-in Supabase mail)

Default Supabase SMTP only sends to **org team member emails**. Sign up with an address on your Supabase org team, or add test addresses under Org → Team.

## Deploy (Vercel)

1. Push to GitHub and import in Vercel
2. Set env vars from `.env.example` (use production `NEXT_PUBLIC_APP_URL`)
3. Add production `/auth/callback` to Supabase redirect URLs

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run lint` — ESLint
