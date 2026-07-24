# Zum Zum Enterprises website

A production-ready, static-first website for a Class-A construction contractor
in Jammu and Kashmir. The visual system is cinematic, architectural and
Kashmir-rooted, with restrained concrete, forest and copper tones.

## Pages

- Home
- About
- Projects and filterable portfolio
- Data-generated project detail pages
- Services
- Capabilities
- Quality & Safety
- Contact with WhatsApp enquiry generation

## Content editing

Central company details are in `data/company.ts`. Project records and image
mapping are in `data/projects.ts`. Services, sectors and delivery process are in
`data/services.ts`.

To add a project, duplicate a project object in `data/projects.ts`, give it a
unique `slug`, add local images under `public/images`, and update the image
paths. The listing, filter and detail route are generated automatically.

## Local setup

```bash
npm install
npm run dev
```

Run the production validation with:

```bash
npm run build
```

## Static contact handling

The enquiry form builds a prefilled WhatsApp message. Replace the placeholder
WhatsApp number in both `data/company.ts` and `components/Interactive.tsx`.
Email links use the central company configuration.

## Deployment

The project is configured for OpenAI Sites and can also be adapted for Vercel,
Netlify or Cloudflare. Keep `.openai/hosting.json` with the Sites checkout.

## Before public launch

Complete every item in `CONTENT_CHECKLIST.md`, replace the `.example` canonical
domain in metadata, and verify all project facts with the company.

