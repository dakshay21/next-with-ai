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

**Production URL:** https://next-with-ai-two.vercel.app

1. Push to GitHub and import in Vercel (or `npx vercel deploy --prod`)
2. Set env vars in Vercel → Project → Settings → Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_APP_URL` → your Vercel URL (e.g. `https://next-with-ai-two.vercel.app`)
3. In Supabase → Authentication → URL Configuration:
   - **Site URL:** `https://next-with-ai-two.vercel.app`
   - **Redirect URLs:** add `https://next-with-ai-two.vercel.app/auth/callback`

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run lint` — ESLint
