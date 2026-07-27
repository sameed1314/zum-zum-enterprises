import path from "node:path";
import { fileURLToPath } from "node:url";
import config from "@payload-config";
import { getPayload, type RequiredDataFromCollectionSlug } from "payload";
import { company, navigation } from "@/data/company";
import { projects as sourceProjects } from "@/data/projects";
import {
  processSteps,
  sectors as sourceSectors,
  services as sourceServices,
} from "@/data/services";
import type {
  Capability,
  Media,
  Project,
  ProjectCategory,
  Sector,
  Service,
} from "@/src/payload-types";
import { textToLexical } from "@/src/lib/richtext";
import { slugify } from "@/src/lib/slug";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dirname, "../..");

const mediaSource = [
  {
    file: "hero-kashmir-construction.webp",
    title: "Kashmir institutional construction hero",
    alt: "Contemporary stone and concrete institutional complex in a Kashmir mountain setting",
  },
  {
    file: "project-residence.webp",
    title: "Premium residence project",
    alt: "Contemporary stone residence in Kashmir",
  },
  {
    file: "project-infrastructure.webp",
    title: "Civil infrastructure project",
    alt: "Mountain infrastructure and retaining-wall project in Kashmir",
  },
] as const;

const categoryNames = [
  "Residential",
  "Commercial",
  "Institutional",
  "Government",
  "Infrastructure",
  "Renovation",
  "Hospitality",
  "Interior Fit-Out",
];

const capabilitySource = [
  ["Civil Engineering", "Site-led interpretation and execution of civil scopes."],
  ["Structural Execution", "Controlled formwork, reinforcement, concrete and steel packages."],
  ["Site Management", "Daily coordination, work-front planning and issue resolution."],
  ["Project Planning", "Sequencing, milestones, resource planning and progress reporting."],
  ["Procurement", "Submittals, lead-time tracking, vendor coordination and material control."],
  ["Quantity Estimation", "Scope understanding, take-offs and package-level cost visibility."],
  ["Quality Assurance", "Inspection plans, hold points, records and closeout tracking."],
  ["Safety Management", "Briefings, task controls, PPE and risk-aware supervision."],
  ["Vendor Coordination", "Capability review, work package clarity and delivery coordination."],
  ["Construction Supervision", "Visible technical oversight across active work fronts."],
  ["Documentation", "Submittals, records, reports, drawings and handover information."],
  ["Handover Management", "Snagging, testing records, closeout and post-completion support."],
];

const serviceIconNames = [
  "Building2",
  "Mountain",
  "HardHat",
  "House",
  "Landmark",
  "Ruler",
  "DraftingCompass",
  "ShieldCheck",
];

async function seedMedia(
  payload: Awaited<ReturnType<typeof getPayload>>,
): Promise<Map<string, Media>> {
  const result = new Map<string, Media>();
  for (const item of mediaSource) {
    const existing = await payload.find({
      collection: "media",
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { filename: { equals: item.file } },
    });
    const media = existing.docs[0]
      ? await payload.update({
          collection: "media",
          id: existing.docs[0].id,
          overrideAccess: true,
          data: {
            title: item.title,
            alt: item.alt,
            category: "Website",
          },
        })
      : await payload.create({
          collection: "media",
          overrideAccess: true,
          filePath: path.resolve(root, "public/images", item.file),
          data: {
            title: item.title,
            alt: item.alt,
            category: "Website",
          },
        });
    result.set(`/images/${item.file}`, media);
  }
  return result;
}

async function seed() {
  const payload = await getPayload({ config });
  payload.logger.info("Seeding Zum Zum Enterprises content…");

  const media = await seedMedia(payload);

  const categories = new Map<string, ProjectCategory>();
  for (const [index, name] of categoryNames.entries()) {
    const slug = slugify(name);
    const existing = await payload.find({
      collection: "project-categories",
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { slug: { equals: slug } },
    });
    const data: RequiredDataFromCollectionSlug<"project-categories"> = {
      name,
      slug,
      description: `${name} construction projects delivered by Zum Zum Enterprises.`,
      displayOrder: index + 1,
      active: true,
    };
    const category = existing.docs[0]
      ? await payload.update({
          collection: "project-categories",
          id: existing.docs[0].id,
          data,
          overrideAccess: true,
          context: { skipRevalidation: true },
        })
      : await payload.create({
          collection: "project-categories",
          data,
          overrideAccess: true,
          context: { skipRevalidation: true },
        });
    categories.set(name, category);
  }

  const services = new Map<string, Service>();
  for (const [index, source] of sourceServices.entries()) {
    const slug = slugify(source.title);
    const existing = await payload.find({
      collection: "services",
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { slug: { equals: slug } },
    });
    const data: RequiredDataFromCollectionSlug<"services"> = {
      name: source.title,
      slug,
      shortDescription: source.description,
      fullDescription: textToLexical(source.description),
      icon: serviceIconNames[index],
      capabilities: source.capabilities.map((label) => ({ label })),
      featured: index < 6,
      displayOrder: index + 1,
      active: true,
      _status: "published",
    };
    const service = existing.docs[0]
      ? await payload.update({
          collection: "services",
          id: existing.docs[0].id,
          data,
          draft: false,
          overrideAccess: true,
          context: { skipRevalidation: true },
        })
      : await payload.create({
          collection: "services",
          data,
          draft: false,
          overrideAccess: true,
          context: { skipRevalidation: true },
        });
    services.set(source.title.toLowerCase(), service);
  }

  const sectors = new Map<string, Sector>();
  for (const [index, name] of sourceSectors.entries()) {
    const slug = slugify(name);
    const existing = await payload.find({
      collection: "sectors",
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { slug: { equals: slug } },
    });
    const data: RequiredDataFromCollectionSlug<"sectors"> = {
      name,
      slug,
      description: `${name} construction capability across Jammu and Kashmir.`,
      displayOrder: index + 1,
      active: true,
    };
    const sector = existing.docs[0]
      ? await payload.update({
          collection: "sectors",
          id: existing.docs[0].id,
          data,
          overrideAccess: true,
          context: { skipRevalidation: true },
        })
      : await payload.create({
          collection: "sectors",
          data,
          overrideAccess: true,
          context: { skipRevalidation: true },
        });
    sectors.set(name, sector);
  }

  const capabilities = new Map<string, Capability>();
  for (const [index, [name, shortDescription]] of capabilitySource.entries()) {
    const existing = await payload.find({
      collection: "capabilities",
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { name: { equals: name } },
    });
    const data = {
      name,
      shortDescription,
      detailedDescription: textToLexical(shortDescription),
      displayOrder: index + 1,
      active: true,
    };
    const capability = existing.docs[0]
      ? await payload.update({
          collection: "capabilities",
          id: existing.docs[0].id,
          data,
          overrideAccess: true,
          context: { skipRevalidation: true },
        })
      : await payload.create({
          collection: "capabilities",
          data,
          overrideAccess: true,
          context: { skipRevalidation: true },
        });
    capabilities.set(name, capability);
  }

  const seededProjects: Project[] = [];
  for (const source of sourceProjects) {
    const existing = await payload.find({
      collection: "projects",
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { slug: { equals: source.slug } },
    });
    const cover = media.get(source.coverImage);
    if (!cover) throw new Error(`Missing seeded media for ${source.coverImage}`);
    const gallery = source.gallery
      .map((image, index) => {
        const asset = media.get(image);
        return asset
          ? {
              media: asset.id,
              displayOrder: index + 1,
              caption: "Placeholder project photography pending replacement.",
            }
          : null;
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
    const projectServices = source.services
      .map((name) => services.get(name.toLowerCase())?.id)
      .filter((id): id is number => typeof id === "number");
    const sector = sectors.get(
      source.category === "Institutional"
        ? "Education"
        : source.category === "Infrastructure"
          ? "Public Infrastructure"
          : source.category,
    );
    const category = categories.get(source.category);
    if (!category) throw new Error(`Missing category for ${source.category}`);
    const data: RequiredDataFromCollectionSlug<"projects"> = {
      title: source.title,
      slug: source.slug,
      shortSummary: source.summary,
      category: category.id,
      location: source.location,
      year: source.year,
      status: source.status.toLowerCase() as Project["status"],
      clientType: source.clientType,
      featured: source.featured,
      displayOrder: source.displayOrder,
      scopeOfWork: source.scope,
      contractType: source.contractType,
      builtUpArea: source.area,
      duration: source.duration,
      materials: source.materials.map((name) => ({ name })),
      qualityControl: "Project-specific quality information pending verification.",
      safetyInformation: "Project-specific safety information pending verification.",
      overview: textToLexical(source.description),
      challenge: textToLexical(source.challenges),
      executionApproach: textToLexical(source.approach),
      coverImage: cover.id,
      heroImage: cover.id,
      gallery,
      services: projectServices,
      sectors: sector ? [sector.id] : [],
      _status: "published",
    };
    const project = existing.docs[0]
      ? await payload.update({
          collection: "projects",
          id: existing.docs[0].id,
          data,
          draft: false,
          overrideAccess: true,
          context: { skipRevalidation: true },
        })
      : await payload.create({
          collection: "projects",
          data,
          draft: false,
          overrideAccess: true,
          context: { skipRevalidation: true },
        });
    seededProjects.push(project);
  }

  const testimonialExisting = await payload.find({
    collection: "testimonials",
    limit: 1,
    overrideAccess: true,
    where: { isPlaceholder: { equals: true } },
  });
  const testimonialData = {
    text: "The final website will feature verified client feedback here. This placeholder demonstrates the intended editorial treatment without inventing an endorsement.",
    personName: "Name pending approval",
    clientType: "Institutional client",
    isPlaceholder: true,
    featured: true,
    active: true,
    displayOrder: 1,
    _status: "published" as const,
  };
  const testimonial = testimonialExisting.docs[0]
    ? await payload.update({
        collection: "testimonials",
        id: testimonialExisting.docs[0].id,
        data: testimonialData,
        overrideAccess: true,
        context: { skipRevalidation: true },
      })
    : await payload.create({
        collection: "testimonials",
        data: testimonialData,
        overrideAccess: true,
        context: { skipRevalidation: true },
      });

  await payload.updateGlobal({
    slug: "site-settings",
    overrideAccess: true,
    context: { skipRevalidation: true },
    data: {
      fullCompanyName: company.fullName,
      shortCompanyName: company.shortName,
      tagline: company.tagline,
      companyDescription:
        "Disciplined construction delivery across residential, commercial, institutional and civil infrastructure projects.",
      contractorClassification: company.classification,
      phoneNumbers: [{ label: "Projects", number: company.phone }],
      whatsappNumber: company.whatsapp,
      emailAddresses: [{ label: "Projects", email: company.email }],
      officeAddress: company.address,
      googleMapsURL: company.mapsLink,
      businessHours: company.businessHours,
      socialLinks: Object.entries(company.social).map(([platform, url]) => ({
        platform,
        url,
      })),
      navigation: navigation.map((item) => ({
        label: item.label,
        url: item.href,
        visible: true,
      })),
      primaryCTA: { label: "Start a project", url: "/contact" },
      footerDescription:
        "Disciplined construction delivery across residential, commercial, institutional and civil infrastructure projects.",
      footerCTA: {
        eyebrow: "Build with us",
        heading: "Planning a project in Jammu & Kashmir?",
        label: "Request a consultation",
        url: "/contact",
      },
      copyrightText: `© ${new Date().getFullYear()} Zum Zum Enterprises`,
      footerRegistrationText: "Registration and GST details pending confirmation",
      productionURL:
        process.env.NEXT_PUBLIC_SERVER_URL ||
        "https://www.zumzumenterprises.example",
      _status: "published",
    },
  });

  const hero = media.get("/images/hero-kashmir-construction.webp");
  const infrastructure = media.get("/images/project-infrastructure.webp");
  await payload.updateGlobal({
    slug: "homepage",
    overrideAccess: true,
    context: { skipRevalidation: true },
    data: {
      heroEyebrow: "Construction / Civil / Turnkey",
      heroHeading: "Building Kashmir’s",
      heroAccent: "next landmark.",
      heroSupportingText:
        "Class-A construction and contracting expertise across civil, commercial, institutional, residential and infrastructure projects.",
      heroImage: hero?.id,
      primaryCTA: { label: "Explore our projects", url: "/projects" },
      secondaryCTA: { label: "Discuss a project", url: "/contact" },
      introductoryStatement:
        "From complex civil works to landmark buildings, Zum Zum Enterprises delivers projects defined by engineering discipline, controlled execution and long-term value.",
      featuredProjects: seededProjects
        .filter((project) => project.featured)
        .map((project) => project.id),
      featuredServices: [...services.values()]
        .filter((service) => service.featured)
        .map((service) => service.id),
      featuredSectors: [...sectors.values()].map((sector) => sector.id),
      statistics: [
        { value: company.placeholders.yearsExperience, label: "Years of experience", verified: false },
        { value: company.placeholders.completedProjects, label: "Completed projects", verified: false },
        { value: company.placeholders.professionals, label: "Skilled professionals", verified: false },
        { value: company.placeholders.districtsServed, label: "Districts served", verified: false },
        { value: company.placeholders.areaDelivered, label: "Sq. ft. delivered", verified: false },
      ],
      whySection: {
        eyebrow: "Why Zum Zum / regional execution",
        heading: "Local knowledge. Formal delivery discipline.",
        introduction:
          "Projects in Jammu and Kashmir demand terrain-aware logistics, seasonal planning and reliable coordination across every work front.",
        image: infrastructure?.id,
        points: [
          "Class-A contractor capability",
          "Experienced technical site teams",
          "Quality-control hold points",
          "Safety-focused delivery",
          "Terrain and weather planning",
          "Supplier and subcontractor coordination",
        ].map((label) => ({ label })),
      },
      constructionProcess: processSteps.map((title) => ({ title })),
      testimonials: [testimonial.id],
      finalCTA: {
        heading: "Bring us the brief.",
        supportingText: "Start with the project type, location and current stage.",
        label: "Discuss a project",
        url: "/contact",
      },
      sectionVisibility: {
        statistics: true,
        projects: true,
        services: true,
        why: true,
        process: true,
        sectors: true,
        testimonials: true,
      },
      _status: "published",
    },
  });

  await payload.updateGlobal({
    slug: "about-page",
    overrideAccess: true,
    context: { skipRevalidation: true },
    data: {
      hero: {
        eyebrow: "About",
        heading: "A contractor shaped by Kashmir.",
        introduction:
          "Zum Zum Enterprises brings formal construction discipline, regional execution knowledge and accountable site leadership to complex projects across Jammu and Kashmir.",
      },
      companyIntroduction: textToLexical(
        "From institutional buildings and premium residences to infrastructure and renovation, the company coordinates people, information, materials and field execution around a clear project outcome.",
      ),
      mission: textToLexical(
        "Deliver well-coordinated construction through disciplined planning and technically controlled execution.",
      ),
      vision: textToLexical(
        "Build a recognised Kashmir-based contracting organisation trusted with larger, more complex and more consequential projects.",
      ),
      values: [
        ["Discipline", "Programmes, approvals and work fronts are managed through clear controls."],
        ["Accountability", "Ownership is visible from leadership through site execution and closeout."],
        ["Technical rigour", "Details, materials and workmanship are reviewed against defined requirements."],
        ["Clarity", "Clients and consultants receive direct, evidence-based project communication."],
        ["Respect for place", "Terrain, climate, context and local supply realities inform every plan."],
        ["Long-term value", "Decisions consider performance, maintainability and the completed asset."],
      ].map(([title, description]) => ({ title, description })),
      leadershipContent: textToLexical(
        "Add verified leadership profiles, engineering qualifications, workforce scale and organisation details here.",
      ),
      cta: { label: "Discuss a project", url: "/contact" },
      _status: "published",
    },
  });

  await payload.updateGlobal({
    slug: "contact-page",
    overrideAccess: true,
    context: { skipRevalidation: true },
    data: {
      hero: {
        eyebrow: "Contact",
        heading: "Bring us the brief.",
        introduction:
          "Share the project type, location, current stage and timing. The right technical conversation starts with clear information.",
      },
      officeHeading: "Project enquiries.",
      enquiryCategories: [
        "Construction project",
        "Government / institutional project",
        "Residential project",
        "Commercial project",
        "Renovation / restoration",
        "Civil infrastructure",
      ].map((label) => ({ label })),
      formSupportingText:
        "Your details are used only to review and respond to this enquiry.",
      whatsappCTA: {
        label: "Continue on WhatsApp",
        url: company.whatsappHref,
        newTab: true,
        message:
          "Hello, I would like to discuss a construction project with Zum Zum Enterprises.",
      },
      _status: "published",
    },
  });

  payload.logger.info(
    `Seed complete: ${seededProjects.length} projects, ${services.size} services, ${media.size} media assets.`,
  );
  process.exit(0);
}

await seed();
