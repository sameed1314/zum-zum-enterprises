import { company, navigation } from "@/data/company";
import { projects } from "@/data/projects";
import {
  processSteps,
  sectors,
  services,
} from "@/data/services";
import type {
  AboutPageData,
  ContactPageData,
  HomepageData,
  ProjectCardData,
  ProjectDetailData,
  ServiceData,
  SiteSettingsData,
} from "@/src/lib/content-types";
import { textToLexical } from "@/src/lib/richtext";

const fallbackMedia = (url: string, alt: string) => ({ url, alt });

export const fallbackProjects: ProjectDetailData[] = projects.map((project) => ({
  slug: project.slug,
  title: project.title,
  shortSummary: project.summary,
  category: project.category,
  location: project.location,
  year: project.year,
  status: project.status.toLowerCase() as ProjectDetailData["status"],
  coverImage: fallbackMedia(
    project.coverImage,
    `${project.title} project in ${project.location}`,
  ),
  featured: project.featured,
  displayOrder: project.displayOrder,
  clientType: project.clientType,
  scopeOfWork: project.scope,
  contractType: project.contractType,
  builtUpArea: project.area,
  duration: project.duration,
  materials: project.materials,
  constructionMethods: [],
  overview: textToLexical(project.description),
  challenge: textToLexical(project.challenges),
  executionApproach: textToLexical(project.approach),
  heroImage: fallbackMedia(
    project.coverImage,
    `${project.title} project in ${project.location}`,
  ),
  gallery: project.gallery.map((url, index) =>
    fallbackMedia(url, `${project.title} project view ${index + 1}`),
  ),
  services: project.services,
  sectors: [],
  relatedProjects: [],
}));

export const fallbackProjectCards: ProjectCardData[] = fallbackProjects;

export const fallbackServices: ServiceData[] = services.map((service, index) => ({
  slug: service.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  name: service.title,
  shortDescription: service.description,
  capabilities: service.capabilities,
  icon: service.icon.displayName || service.icon.name,
  featured: index < 6,
  displayOrder: index + 1,
}));

export const fallbackSiteSettings: SiteSettingsData = {
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
  navigation: navigation.map((item) => ({ label: item.label, url: item.href })),
  primaryCTA: { label: "Start a project", url: "/contact" },
  footerDescription:
    "Disciplined construction delivery across residential, commercial, institutional and civil infrastructure projects.",
  footerNavigationGroups: [],
  footerCTA: {
    eyebrow: "Build with us",
    heading: "Planning a project in Jammu & Kashmir?",
    label: "Request a consultation",
    url: "/contact",
  },
  copyrightText: "© 2026 Zum Zum Enterprises",
  footerRegistrationText: "Registration and GST details pending confirmation",
  productionURL:
    process.env.NEXT_PUBLIC_SERVER_URL ||
    "https://www.zumzumenterprises.example",
};

export const fallbackHomepage: HomepageData = {
  heroEyebrow: "Construction / Civil / Turnkey",
  heroHeading: "Building Kashmir’s",
  heroAccent: "next landmark.",
  heroSupportingText:
    "Class-A construction and contracting expertise across civil, commercial, institutional, residential and infrastructure projects.",
  heroImage: fallbackMedia(
    "/images/hero-kashmir-construction.webp",
    "Contemporary stone and concrete complex in a Kashmir mountain setting",
  ),
  primaryCTA: { label: "Explore our projects", url: "/projects" },
  secondaryCTA: { label: "Discuss a project", url: "/contact" },
  introductoryStatement:
    "From complex civil works to landmark buildings, Zum Zum Enterprises delivers projects defined by engineering discipline, controlled execution and long-term value.",
  featuredProjects: fallbackProjectCards.filter((project) => project.featured),
  featuredServices: fallbackServices.slice(0, 8),
  featuredSectors: [...sectors],
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
    image: fallbackMedia(
      "/images/project-infrastructure.webp",
      "Mountain infrastructure and retaining-wall project",
    ),
    points: [
      "Class-A contractor capability",
      "Experienced technical site teams",
      "Quality-control hold points",
      "Safety-focused delivery",
      "Terrain and weather planning",
      "Supplier and subcontractor coordination",
    ],
  },
  constructionProcess: processSteps.map((title) => ({ title })),
  testimonial: {
    text: "The final website will feature verified client feedback here. This placeholder demonstrates the intended editorial treatment without inventing an endorsement.",
    attribution: "Institutional client / Name pending approval",
    isPlaceholder: true,
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
};

export const fallbackAboutPage: AboutPageData = {
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
};

export const fallbackContactPage: ContactPageData = {
  hero: {
    eyebrow: "Contact",
    heading: "Bring us the brief.",
    introduction:
      "Share the project type, location, current stage and timing. The right technical conversation starts with clear information.",
    image: fallbackMedia(
      "/images/project-residence.webp",
      "Contemporary stone residence in Kashmir",
    ),
  },
  officeHeading: "Project enquiries.",
  enquiryCategories: [
    "Construction project",
    "Government / institutional project",
    "Residential project",
    "Commercial project",
    "Renovation / restoration",
    "Civil infrastructure",
  ],
  formSupportingText:
    "Share the project type, location, current stage and timing. We will use the details only to respond to your enquiry.",
  whatsappCTA: {
    label: "Continue on WhatsApp",
    url: company.whatsappHref,
    message:
      "Hello, I would like to discuss a construction project with Zum Zum Enterprises.",
  },
  faqs: [],
};
