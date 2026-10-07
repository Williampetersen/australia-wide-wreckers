# Australia Wide Wreckers

Marketing site for Australia Wide Wreckers, a cash-for-cars and free car removal
business serving Newcastle, Lake Macquarie, Maitland, Cessnock, Port Stephens
and the Central Coast (NSW).

Built with Next.js (App Router), TypeScript and Tailwind CSS v4.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env.local` and fill in the values you have — the site
runs without any of them, but the quote form, analytics and pixel tracking
stay inactive until configured:

- `RESEND_API_KEY` / `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL` — required for
  the contact form (`src/app/api/quote/route.ts`) to actually email quote
  requests. Sign up at [resend.com](https://resend.com) and verify a sending
  domain.
- `NEXT_PUBLIC_GA_ID` — Google Analytics 4 measurement ID.
- `NEXT_PUBLIC_META_PIXEL_ID` — Meta (Facebook) Pixel ID.

## Where content lives

Business content is data-driven rather than hardcoded into pages:

- `src/lib/site.ts` — business name, phone numbers, hours, depots, review link
- `src/lib/services.ts` — the six services (`/services/[slug]`)
- `src/lib/locations.ts` — every suburb page (`/locations/[slug]`)
- `src/lib/faqs.ts` — FAQ content (also powers the FAQPage JSON-LD)

Editing those files updates the relevant pages, sitemap and structured data
automatically — no need to touch the page components for routine content
changes.

## Structured data & SEO

- `src/lib/schema.ts` builds JSON-LD (Organization, Service, FAQPage) rendered
  via `src/components/JsonLd.tsx`.
- `src/app/sitemap.ts` and `src/app/robots.ts` are generated from the same
  location/service data.
- `src/app/opengraph-image.tsx` generates the social share image at build time.

## Before going live

- Fill in the real ABN in `src/lib/site.ts` (`abn` field) — the privacy policy
  and terms pages reference it.
- Set `googleRating` / `googleReviewCount` in `src/lib/site.ts` once you have
  real figures from your Google Business Profile — until then the homepage
  reviews badge shows a generic "read our reviews" link instead of a number.
- Have the privacy policy and terms of use pages reviewed by a solicitor —
  they're a reasonable starting template, not legal advice.
- Configure the env vars above for the quote form to actually deliver leads.

## Scripts

```bash
npm run dev      # start the dev server
npm run build    # production build
npm run start    # run the production build
npm run lint     # eslint
```

## Deployment

Deploys cleanly to [Vercel](https://vercel.com/new) or any Node hosting that
supports Next.js. Set the environment variables above in your hosting
provider's dashboard.

## Live chat

Real people answer every chat. There is no bot: the only automatic text is the welcome message, the offline message and system notices. Visitors chat from a small widget on the public site; the team answers from `/admin` (an installable app).

How it fits together: the website stays on Vercel. Chat data lives in Supabase (Postgres). Messages move **browser to Supabase directly** over Realtime Broadcast on private channels, because serverless functions cannot hold WebSocket connections. If the Supabase variables are not set, the launcher does not render and the site and `/api/quote` behave exactly as before.

### Set it up

1. **Create a Supabase project** (https://supabase.com). Pick a region close to NSW (Sydney).
2. **Run the migration and seed.** In the SQL editor run `supabase/migrations/20261007120000_live_chat.sql`, then `supabase/seed.sql` (or use the Supabase CLI: `supabase link` then `supabase db push`).
3. **Enable anonymous sign-ins:** Authentication, Sign In / Providers, turn on *Allow anonymous sign-ins*.
4. **Optional Turnstile:** Authentication, Attack Protection, Captcha, choose Cloudflare Turnstile and paste the secret key. Put the *site key* in `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and tick the option in the admin Settings. It must also be enabled in Settings before the widget uses it.
5. **Extensions:** the migration enables `pg_cron`, `pg_net` and `pg_trgm`. If your project blocks that from SQL, enable them under Database, Extensions first.
6. **Store two secrets in Vault** so Postgres can call the site (Database, Vault, or SQL):
   ```sql
   select vault.create_secret('https://YOUR-SITE.example', 'chat_site_url');
   select vault.create_secret('THE-SAME-VALUE-AS-CHAT_WEBHOOK_SECRET', 'chat_webhook_secret');
   ```
   Until both exist, notifications and the scheduled jobs are silently skipped.
7. **Storage:** the migration creates the private `chat-uploads` bucket (8 MB limit, JPEG/PNG/WebP/HEIC). Check it under Storage.
8. **Vercel environment variables:** copy everything under "Live chat" from `.env.example`. `SUPABASE_SECRET_KEY` and `VAPID_PRIVATE_KEY` are server-only. Redeploy after adding them (NEXT_PUBLIC values are baked in at build time).
9. **VAPID keys:** `npx web-push generate-vapid-keys`, then set `NEXT_PUBLIC_VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY`.
10. **Create the first owner:**
    ```bash
    node --env-file=.env.local scripts/create-chat-owner.mjs --email you@example.com --name "Your Name"
    ```
    They receive an email to choose a password, then sign in at `/admin/login`.
11. **Install the admin app on a phone:** open `/admin` in Chrome (Android: menu, Install app) or Safari (iPhone: Share, Add to Home Screen; push needs iOS 16.4 or later and the app added to the Home Screen). Then Settings, My profile, *Enable notifications*, and *Send test notification*.

### Day to day

- Set yourself **Online** at the top of the admin. The widget shows "Online" only while at least one agent is online (and, by default, inside business hours, Mon to Sat 9am to 5pm Sydney time).
- Outside those hours the widget takes a name, mobile or email plus a message, and the team is emailed straight away.
- Cash offers sent from a chat appear as a card with Accept, Call me and No thanks. Accepting notifies everyone.
- Every `/api/quote` submission is also saved to the Leads page (the email flow is unchanged).

### Tests and checks

- `npm test` runs the unit tests (phone normalisation, Sydney business hours including daylight saving, message grouping, canned variables, link detection).
- `supabase/tests/rls.sql` proves the security rules (visitors cannot see each other's chats or internal notes, cannot write as agents, cannot join the inbox topic, and so on). Run it against a scratch database: `psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/rls.sql`. It rolls back everything it creates.
- `npm run lint` and `npm run build` must pass (CI runs both).

### Privacy and data

Chats are stored in Supabase until they are closed and older than the retention period (24 months by default, change it in Settings). Admins can delete a conversation and its photos at any time from the conversation header. A note about chat data is on the Privacy Policy page; have it checked by your solicitor.

To back up chat data, use Supabase's database backups (Project Settings, Database, Backups) or export tables from the Table editor. The Leads page exports CSV.

