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
