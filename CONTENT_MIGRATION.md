# Content migration

The initial site content previously lived in `data/company.ts`,
`data/projects.ts` and `data/services.ts`. These files remain only as a traceable
launch snapshot and frontend fallback. Payload is the editing source of truth
after seeding.

## Import process

After applying the PostgreSQL migration:

```bash
npm run seed
```

The seed:

- uploads the three existing website images to the configured media adapter;
- creates or updates project categories, services, sectors and capabilities;
- creates or updates projects by slug;
- publishes the launch records;
- creates the homepage, about page, contact page and site-settings globals;
- creates a clearly marked placeholder testimonial;
- never creates an administrator or embeds credentials.

The operation is idempotent. Records are matched by stable slug, filename or
global identity and updated on subsequent runs. It is safe to rerun during
initial staging, but review staff edits first because matching seeded fields
will be reset to the launch snapshot.

## Recommended staging workflow

1. Migrate and seed a non-production database.
2. Sign in at `/admin`.
3. Confirm every relationship and uploaded media record.
4. Replace all generated concept images with approved project photography.
5. Resolve every item in `CONTENT_CHECKLIST.md`.
6. Keep unverified claims as drafts or remove them.
7. Test project preview and publishing.
8. Export or back up the verified database and media before launch.
9. Apply the same migration to production, then seed only if production is
   empty.

## Publication rules

Projects, services and testimonials use Payload drafts and version history.
Public queries explicitly request published documents. Draft projects do not
appear in lists, detail routes, related projects or the sitemap.

Revalidation hooks refresh the affected public paths after content is
published, updated, unpublished or deleted. A project slug change refreshes
both its previous and new detail route.

## Company information still requiring verification

The seed intentionally preserves placeholders instead of inventing business
facts. At minimum, verify:

- official phone, WhatsApp and email addresses;
- registered office address, map URL and operating hours;
- contractor registration, GST and other registration details;
- approved social profiles;
- company history, founding date and leadership information;
- all statistics, project counts, workforce and coverage claims;
- each project title, client type, location, scope, date, area and status;
- certifications, testimonials and client references;
- the production domain, legal/privacy copy and social preview asset.

The exhaustive launch list is in `CONTENT_CHECKLIST.md`.
