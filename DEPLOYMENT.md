# Production deployment

This application is provider-neutral, but every production deployment requires
three persistent services:

1. A Node.js-compatible Next.js host.
2. PostgreSQL.
3. S3-compatible object storage with a public delivery URL.

The examples below use Vercel and Cloudflare R2 terminology. Equivalent managed
services are supported.

## 1. Provision infrastructure

Create a PostgreSQL database with TLS support and automated backups. Use a
dedicated application user and a connection string that your runtime can reach.
For serverless hosting, use the provider's pooled connection URL when one is
available.

Create a private object-storage bucket and a public delivery path through an R2
custom domain, CloudFront or an equivalent CDN. The bucket is not a replacement
for the PostgreSQL database: Payload stores file metadata in PostgreSQL and the
binary objects in the bucket.

## 2. Configure environment variables

Set these values in every production runtime and migration job:

| Variable | Requirement |
| --- | --- |
| `DATABASE_URI` | PostgreSQL connection URI, including TLS options where required |
| `PAYLOAD_SECRET` | Unique random secret, minimum 32 characters |
| `NEXT_PUBLIC_SERVER_URL` | Canonical HTTPS origin, with no trailing slash |
| `PREVIEW_SECRET` | Separate random preview secret, minimum 24 characters |
| `S3_ENDPOINT` | S3 API endpoint |
| `S3_REGION` | Provider region; `auto` for R2 |
| `S3_BUCKET` | Bucket name |
| `S3_ACCESS_KEY_ID` | Restricted bucket credential |
| `S3_SECRET_ACCESS_KEY` | Restricted bucket secret |
| `S3_PUBLIC_URL` | Public CDN/custom-domain origin |
| `S3_FORCE_PATH_STYLE` | Usually `true` for R2-compatible endpoints |
| `S3_CLIENT_UPLOADS` | `true` to upload directly from the Payload admin |

Recommended email settings:

| Variable | Requirement |
| --- | --- |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE` | SMTP transport |
| `SMTP_USER`, `SMTP_PASSWORD` | SMTP credentials |
| `SMTP_FROM_EMAIL`, `SMTP_FROM_NAME` | Verified sender identity |
| `CONTACT_NOTIFICATION_EMAIL` | Internal enquiry recipient |
| `SEND_ENQUIRY_CONFIRMATION` | `true` only after sender and copy are approved |

Optional Cloudflare Turnstile settings:

| Variable | Requirement |
| --- | --- |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Browser-visible site key |
| `TURNSTILE_SECRET_KEY` | Server-only verification key |

Generate secrets with a cryptographically secure password manager or:

```bash
openssl rand -base64 48
```

Never reuse database, Payload and preview secrets. Never prefix server secrets
with `NEXT_PUBLIC_`.

## 3. Vercel configuration

- Framework preset: Next.js
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: leave unset
- Node.js: 22.x or newer
- Root directory: repository root

Add the production environment values before the first build. The runtime
validator rejects an incomplete production CMS configuration.

The application does not run migrations inside `npm run build`. Build hooks can
run concurrently and are the wrong place for schema mutation. Apply migrations
as a single controlled release step:

```bash
npm run payload:migrate:status
npm run payload:migrate
```

Use a CI deployment job, provider command shell or a trusted workstation that
has temporary access to the production database. Only one migration job should
run at a time.

## 4. First deployment

1. Take a database snapshot if the database is not empty.
2. Apply committed migrations.
3. Deploy the application.
4. Check `https://your-domain.example/api/health`.
5. Visit `/admin` and create the first administrator.
6. Run `npm run seed` once against production if the launch snapshot is wanted.
7. Sign in and replace every item listed in `CONTENT_CHECKLIST.md`.
8. Upload a test image, create a draft project, preview it and publish it.
9. Submit a test enquiry and confirm it remains stored even if email is
   deliberately unavailable.
10. Verify sitemap, canonical URLs, social metadata and mobile navigation.

The first administrator is automatically assigned `super-admin`. No production
password is present in source or seed data.

## 5. Media storage

Use a restricted S3 credential scoped to the application bucket. Configure CORS
on the bucket for the production admin origin if client uploads are enabled.
The public URL should be an HTTPS CDN or custom-domain origin, not a private API
endpoint.

Back up both PostgreSQL and the object bucket. Restoring only one can leave
orphaned file metadata or missing objects.

## 6. Email and form protection

Enquiries are written to PostgreSQL before email is attempted. Email failure is
recorded on the enquiry and does not discard the submission.

The repository includes a honeypot, server validation, duplicate suppression
and an in-process rate limit. On serverless or horizontally scaled production,
also enable Turnstile and provider-level rate limiting because in-memory limits
are instance-local.

## 7. Operations

- Poll `/api/health` from the hosting provider or uptime monitor.
- Alert on non-2xx health responses and elevated `/api/enquiries` errors.
- Keep Payload and Next.js patch releases current after testing.
- Review admin users and enquiry access quarterly.
- Rotate database, storage and SMTP credentials.
- Test database and bucket restores on a schedule.
- Keep logs free of request bodies, tokens, passwords and enquiry messages.

## 8. Rollback

Before each schema release, take a verified database snapshot and preserve a
bucket recovery point. Deploy backward-compatible schema changes before code
that requires them where possible.

If application code must be rolled back:

1. Stop new releases and capture current logs.
2. Redeploy the last known-good commit.
3. Do not automatically execute a migration `down` function.
4. Restore a database snapshot only after assessing data written since the
   migration.
5. Restore bucket objects only when the database and object timeline match.

Payload migration down statements are an engineering aid, not a substitute for
production backup and recovery.
