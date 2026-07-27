# Zum Zum Enterprises

The production website and content platform for Zum Zum Enterprises. The
existing cinematic, Kashmir-rooted frontend is preserved, while projects,
services, company information, page content, SEO, media and enquiries are now
managed through Payload CMS.

## Platform

- Next.js 16 App Router and React 19
- Payload CMS 3 at `/admin`
- PostgreSQL with committed Payload migrations
- S3-compatible production media storage (Cloudflare R2, AWS S3 or equivalent)
- Lexical rich text with a typed frontend renderer
- Drafts, version history, secure preview and on-demand revalidation
- Role-based access for super administrators, editors and enquiry managers
- Stored enquiries with validation, abuse controls and optional email
  notifications

The public website remains available if the CMS is temporarily unavailable by
using a read-only fallback snapshot of the migrated launch content. The admin,
publishing and enquiry-storage features require PostgreSQL.

## Public and admin routes

- `/`, `/about`, `/projects`, `/projects/[slug]`
- `/services`, `/capabilities`, `/quality-safety`, `/contact`
- `/admin` — Payload administration
- `/api/enquiries` — public enquiry handler
- `/api/preview` and `/api/preview/exit` — authenticated draft preview
- `/api/health` — database and storage readiness
- `/sitemap.xml` and `/robots.txt`

## Local development

Prerequisites:

- Node.js 22.13 or newer
- npm
- PostgreSQL 15 or newer, or Docker with Compose

```bash
npm install
cp .env.example .env
docker compose up -d postgres
npm run payload:migrate
npm run seed
npm run dev
```

Open `http://localhost:3000/admin`. On a new database, Payload presents the
first-user form. That first account is promoted to `super-admin`; use a unique,
strong password. The seed script deliberately creates no user credentials.

If PostgreSQL is installed outside Docker, update `DATABASE_URI` before running
the migration.

## Content migration and editing

`npm run seed` imports the current company data, services, sectors, projects and
three existing images. It is idempotent: rerunning it updates matching records
instead of duplicating them. Content is created as published launch content,
while any unverified facts remain visibly marked as placeholders.

Editors can create drafts, preview them from Payload and publish when approved.
Anonymous public queries always constrain versioned collections to
`_status = published`.

See [CONTENT_MIGRATION.md](CONTENT_MIGRATION.md) for the migration workflow and
[CONTENT_CHECKLIST.md](CONTENT_CHECKLIST.md) for the remaining company facts and
assets that require verification.

## Useful commands

```bash
npm run dev                         # Next.js and Payload development server
npm run build                       # production build
npm run start                       # production server
npm run lint                        # ESLint
npm run typecheck                   # strict TypeScript check
npm test                            # unit and contract tests
npm run payload:generate-types      # regenerate Payload TypeScript types
npm run payload:generate-importmap  # regenerate admin import map
npm run payload:migrate:create -- --name change_name
npm run payload:migrate             # apply committed migrations
npm run payload:migrate:status
npm run seed
```

Run the database-backed publishing test after migrating and seeding a disposable
test database:

```bash
RUN_PAYLOAD_INTEGRATION_TESTS=true npm test
```

Never point the integration test at production.

## Environment

Copy `.env.example` to `.env` locally. The required production values are:

- `DATABASE_URI`
- `PAYLOAD_SECRET` (at least 32 random characters)
- `NEXT_PUBLIC_SERVER_URL`
- `PREVIEW_SECRET` (at least 24 random characters)
- `S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`, `S3_PUBLIC_URL`

SMTP and Turnstile values are optional but recommended for a public launch.
Only the Turnstile site key and the public server URL are browser-visible.
Never commit `.env` or provider credentials.

## Production deployment

The application targets a standard Node.js Next.js host such as Vercel,
Railway, Render or Fly.io. Production also needs persistent PostgreSQL and
persistent S3-compatible object storage. Do not use local disk for production
uploads.

The deployment sequence is:

1. Provision PostgreSQL and S3-compatible storage.
2. Add and validate all production environment variables.
3. Apply `npm run payload:migrate` in one controlled release job.
4. Build with `npm run build`.
5. Start with `npm run start`, or let the Next.js host manage runtime.
6. Visit `/admin` and create the first super administrator.
7. Run `npm run seed` once, review imported content, then replace placeholders.
8. Verify `/api/health`, media upload, draft preview and the enquiry flow.

Do not run schema push or concurrent migration jobs in production. Full hosting,
R2, backup and rollback instructions are in
[DEPLOYMENT.md](DEPLOYMENT.md).

## Repository structure

```text
app/(frontend)       Public pages and server routes
app/(payload)        Payload admin and REST routes
components           Existing visual system and dynamic UI
src/collections      Payload collections
src/globals          Website globals
src/access           Role-based access helpers
src/hooks            Cache revalidation hooks
src/lib              Queries, validation, email and content adapters
src/migrations       Committed PostgreSQL migrations
src/seed             Idempotent content import
tests                Unit and optional integration tests
```

The legacy Cloudflare Worker, Vinext and D1 scaffold has been removed. The app
now uses one standard Next.js/Payload runtime on every supported host.
