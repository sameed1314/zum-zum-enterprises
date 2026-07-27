import "server-only";

import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import type {
  AboutPage,
  ContactPage,
  Homepage,
  Media,
  Project,
  ProjectCategory,
  Sector,
  Service,
  SiteSetting,
  Testimonial,
} from "@/src/payload-types";
import {
  fallbackAboutPage,
  fallbackContactPage,
  fallbackHomepage,
  fallbackProjectCards,
  fallbackProjects,
  fallbackServices,
  fallbackSiteSettings,
} from "@/src/lib/fallback-content";
import type {
  AboutPageData,
  ContactPageData,
  HomepageData,
  ProjectCardData,
  ProjectDetailData,
  PublicMedia,
  ServiceData,
  SiteSettingsData,
} from "@/src/lib/content-types";
import { isCMSConfigured } from "@/src/lib/env";

const isDocument = <T extends { id: number }>(
  value: number | null | T | undefined,
): value is T => Boolean(value && typeof value === "object" && "id" in value);

function mediaValue(
  value: number | Media | null | undefined,
  size?: "card" | "gallery" | "hero" | "thumbnail",
  fallback?: PublicMedia,
): PublicMedia {
  if (!isDocument(value)) {
    return fallback || {
      url: "/images/hero-kashmir-construction.webp",
      alt: "Zum Zum Enterprises construction project",
    };
  }
  const sizedURL = size ? value.sizes?.[size]?.url : undefined;
  return {
    url: sizedURL || value.url || fallback?.url || "/images/hero-kashmir-construction.webp",
    alt: value.alt || fallback?.alt || "Zum Zum Enterprises construction project",
    caption: value.caption || undefined,
  };
}

function categoryName(value: number | ProjectCategory): string {
  return isDocument(value) ? value.name : "Construction";
}

function projectCard(project: Project): ProjectCardData {
  return {
    slug: project.slug,
    title: project.title,
    shortSummary: project.shortSummary,
    category: categoryName(project.category),
    location: project.location,
    year: project.year || undefined,
    status: project.status,
    coverImage: mediaValue(project.coverImage, "card"),
    featured: project.featured === true,
    displayOrder: project.displayOrder || 0,
    updatedAt: project.updatedAt,
  };
}

function projectDetail(project: Project): ProjectDetailData {
  const cover = mediaValue(project.coverImage, "hero");
  return {
    ...projectCard(project),
    district: project.district || undefined,
    clientType: project.clientType || undefined,
    scopeOfWork: project.scopeOfWork || undefined,
    contractType: project.contractType || undefined,
    builtUpArea: project.builtUpArea || undefined,
    duration: project.duration || undefined,
    startDate: project.startDate || undefined,
    completionDate: project.completionDate || undefined,
    projectValue:
      project.projectValue?.displayPublicly === true
        ? project.projectValue.value || undefined
        : undefined,
    architectConsultant: project.architectConsultant || undefined,
    executionResponsibilities: project.executionResponsibilities || undefined,
    materials: project.materials?.map((item) => item.name) || [],
    constructionMethods:
      project.constructionMethods?.map((item) => item.name) || [],
    qualityControl: project.qualityControl || undefined,
    safetyInformation: project.safetyInformation || undefined,
    overview: project.overview,
    challenge: project.challenge,
    executionApproach: project.executionApproach,
    outcome: project.outcome,
    qualityAndSafety: project.qualityAndSafety,
    heroImage: mediaValue(project.heroImage, "hero", cover),
    gallery:
      project.gallery
        ?.slice()
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
        .map((item) => {
          const media = mediaValue(item.media, "gallery", cover);
          return {
            ...media,
            alt: item.altOverride || media.alt,
            caption: item.caption || media.caption,
          };
        }) || [],
    services:
      project.services
        ?.filter((service): service is Service => isDocument(service))
        .map((service) => service.name) || [],
    sectors:
      project.sectors
        ?.filter((sector): sector is Sector => isDocument(sector))
        .map((sector) => sector.name) || [],
    relatedProjects:
      project.relatedProjects
        ?.filter((related): related is Project => isDocument(related))
        .map(projectCard) || [],
    seo: project.seo,
  };
}

function serviceValue(service: Service): ServiceData {
  return {
    slug: service.slug,
    name: service.name,
    shortDescription: service.shortDescription,
    capabilities: service.capabilities?.map((item) => item.label) || [],
    icon: service.icon || undefined,
    featured: service.featured === true,
    displayOrder: service.displayOrder || 0,
  };
}

async function withFallback<T>(
  operation: () => Promise<T>,
  fallback: T,
  label: string,
): Promise<T> {
  if (!isCMSConfigured()) return fallback;
  try {
    return await operation();
  } catch (error) {
    console.error(`Payload query failed for ${label}`, {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return fallback;
  }
}

async function fetchSiteSettings(): Promise<SiteSettingsData> {
  return withFallback(async () => {
    const payload = await getPayload({ config });
    const settings = (await payload.findGlobal({
      slug: "site-settings",
      depth: 1,
      draft: false,
      overrideAccess: false,
    })) as SiteSetting;
    return {
      fullCompanyName: settings.fullCompanyName,
      shortCompanyName: settings.shortCompanyName,
      tagline: settings.tagline,
      companyDescription: settings.companyDescription,
      contractorClassification: settings.contractorClassification,
      phoneNumbers:
        settings.phoneNumbers?.map(({ label, number }) => ({ label, number })) || [],
      whatsappNumber: settings.whatsappNumber || undefined,
      emailAddresses:
        settings.emailAddresses?.map(({ label, email }) => ({ label, email })) || [],
      officeAddress: settings.officeAddress || undefined,
      googleMapsURL: settings.googleMapsURL || undefined,
      businessHours: settings.businessHours || undefined,
      socialLinks:
        settings.socialLinks?.map(({ platform, url }) => ({ platform, url })) || [],
      navigation:
        settings.navigation
          ?.filter((item) => item.visible !== false)
          .map(({ label, url, newTab }) => ({
            label,
            url,
            newTab: newTab === true,
          })) || [],
      primaryCTA: {
        label: settings.primaryCTA.label,
        url: settings.primaryCTA.url,
        newTab: settings.primaryCTA.newTab === true,
      },
      footerDescription: settings.footerDescription || undefined,
      footerNavigationGroups:
        settings.footerNavigationGroups?.map((group) => ({
          label: group.label,
          links:
            group.links?.map(({ label, url, newTab }) => ({
              label,
              url,
              newTab: newTab === true,
            })) || [],
        })) || [],
      footerCTA: {
        eyebrow: settings.footerCTA.eyebrow || undefined,
        heading: settings.footerCTA.heading || undefined,
        label: settings.footerCTA.label,
        url: settings.footerCTA.url,
        newTab: settings.footerCTA.newTab === true,
      },
      copyrightText: settings.copyrightText || undefined,
      footerRegistrationText: settings.footerRegistrationText || undefined,
      registrationDetails: settings.registrationDetails,
      announcement: settings.announcement,
      seo: settings.seo,
      productionURL: settings.productionURL.replace(/\/$/, ""),
    };
  }, fallbackSiteSettings, "site settings");
}

export const getSiteSettings = unstable_cache(fetchSiteSettings, ["site-settings"], {
  revalidate: 3600,
});

async function fetchProjects(): Promise<ProjectCardData[]> {
  return withFallback(async () => {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "projects",
      depth: 1,
      limit: 100,
      overrideAccess: false,
      pagination: false,
      sort: "displayOrder",
      where: { _status: { equals: "published" } },
    });
    return result.docs.map(projectCard);
  }, fallbackProjectCards, "projects");
}

export const getProjects = unstable_cache(fetchProjects, ["projects"], {
  revalidate: 3600,
});

export async function getProjectBySlug(
  slug: string,
  draft = false,
): Promise<ProjectDetailData | null> {
  const fallback = fallbackProjects.find((project) => project.slug === slug) || null;
  const fetchProject = async () =>
    withFallback(async () => {
      const payload = await getPayload({ config });
      const result = await payload.find({
        collection: "projects",
        depth: 2,
        draft,
        limit: 1,
        overrideAccess: draft,
        where: {
          and: [
            { slug: { equals: slug } },
            ...(draft ? [] : [{ _status: { equals: "published" as const } }]),
          ],
        },
      });
      return result.docs[0] ? projectDetail(result.docs[0]) : null;
    }, fallback, `project ${slug}`);

  if (draft) return fetchProject();
  return unstable_cache(fetchProject, ["project", slug], { revalidate: 3600 })();
}

async function fetchServices(): Promise<ServiceData[]> {
  return withFallback(async () => {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "services",
      depth: 0,
      limit: 100,
      overrideAccess: false,
      pagination: false,
      sort: "displayOrder",
      where: {
        and: [
          { _status: { equals: "published" } },
          { active: { equals: true } },
        ],
      },
    });
    return result.docs.map(serviceValue);
  }, fallbackServices, "services");
}

export const getServices = unstable_cache(fetchServices, ["services"], {
  revalidate: 3600,
});

export const getProjectCategories = unstable_cache(async () =>
  withFallback(async () => {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "project-categories",
      depth: 0,
      limit: 100,
      overrideAccess: false,
      pagination: false,
      sort: "displayOrder",
      where: { active: { equals: true } },
    });
    return result.docs.map((category) => category.name);
  }, [...new Set(fallbackProjectCards.map((project) => project.category))], "project categories"),
["project-categories"], { revalidate: 3600 });

async function fetchHomepage(): Promise<HomepageData> {
  return withFallback(async () => {
    const payload = await getPayload({ config });
    const homepage = (await payload.findGlobal({
      slug: "homepage",
      depth: 2,
      draft: false,
      overrideAccess: false,
    })) as Homepage;
    const testimonial = homepage.testimonials?.find(
      (item): item is Testimonial => isDocument(item) && item.active !== false,
    );
    return {
      heroEyebrow: homepage.heroEyebrow,
      heroHeading: homepage.heroHeading,
      heroAccent: homepage.heroAccent || undefined,
      heroSupportingText: homepage.heroSupportingText,
      heroImage: mediaValue(homepage.heroImage, "hero", fallbackHomepage.heroImage),
      primaryCTA: {
        label: homepage.primaryCTA.label,
        url: homepage.primaryCTA.url,
        newTab: homepage.primaryCTA.newTab === true,
      },
      secondaryCTA: {
        label: homepage.secondaryCTA.label,
        url: homepage.secondaryCTA.url,
        newTab: homepage.secondaryCTA.newTab === true,
      },
      introductoryStatement: homepage.introductoryStatement,
      featuredProjects:
        homepage.featuredProjects
          ?.filter((project): project is Project => isDocument(project))
          .map(projectCard) || [],
      featuredServices:
        homepage.featuredServices
          ?.filter((service): service is Service => isDocument(service))
          .map(serviceValue) || [],
      featuredSectors:
        homepage.featuredSectors
          ?.filter((sector): sector is Sector => isDocument(sector))
          .map((sector) => sector.name) || [],
      statistics:
        homepage.statistics?.map(({ value, label, verified }) => ({
          value,
          label,
          verified: verified === true,
        })) || [],
      whySection: {
        eyebrow: homepage.whySection?.eyebrow || undefined,
        heading: homepage.whySection?.heading || undefined,
        introduction: homepage.whySection?.introduction || undefined,
        image: mediaValue(
          homepage.whySection?.image,
          "gallery",
          fallbackHomepage.whySection.image,
        ),
        points: homepage.whySection?.points?.map((point) => point.label) || [],
      },
      constructionProcess:
        homepage.constructionProcess?.map(({ title, description }) => ({
          title,
          description: description || undefined,
        })) || [],
      testimonial: testimonial
        ? {
            text: testimonial.text,
            attribution:
              [testimonial.personName, testimonial.designation, testimonial.organisation]
                .filter(Boolean)
                .join(" · ") || "Client",
            isPlaceholder: testimonial.isPlaceholder === true,
          }
        : undefined,
      sectionVisibility: homepage.sectionVisibility || {},
      seo: homepage.seo,
    };
  }, fallbackHomepage, "homepage");
}

export const getHomepage = unstable_cache(fetchHomepage, ["homepage"], {
  revalidate: 3600,
});

export const getAboutPage = unstable_cache(async (): Promise<AboutPageData> =>
  withFallback(async () => {
    const payload = await getPayload({ config });
    const page = (await payload.findGlobal({
      slug: "about-page",
      depth: 1,
      draft: false,
      overrideAccess: false,
    })) as AboutPage;
    return {
      hero: {
        eyebrow: page.hero.eyebrow,
        heading: page.hero.heading,
        introduction: page.hero.introduction,
        image: isDocument(page.hero.image)
          ? mediaValue(page.hero.image, "hero")
          : undefined,
      },
      companyIntroduction: page.companyIntroduction,
      history: page.history,
      mission: page.mission,
      vision: page.vision,
      values: page.values?.map(({ title, description }) => ({ title, description })) || [],
      leadershipContent: page.leadershipContent,
      seo: page.seo,
    };
  }, fallbackAboutPage, "about page"),
["about-page"], { revalidate: 3600 });

export const getContactPage = unstable_cache(async (): Promise<ContactPageData> =>
  withFallback(async () => {
    const payload = await getPayload({ config });
    const page = (await payload.findGlobal({
      slug: "contact-page",
      depth: 1,
      draft: false,
      overrideAccess: false,
    })) as ContactPage;
    return {
      hero: {
        eyebrow: page.hero.eyebrow,
        heading: page.hero.heading,
        introduction: page.hero.introduction,
        image: isDocument(page.hero.image)
          ? mediaValue(page.hero.image, "hero")
          : undefined,
      },
      officeHeading: page.officeHeading || undefined,
      officeInformation: page.officeInformation,
      mapEmbedURL: page.mapEmbedURL || undefined,
      enquiryCategories: page.enquiryCategories?.map((item) => item.label) || [],
      formSupportingText: page.formSupportingText || undefined,
      whatsappCTA: {
        label: page.whatsappCTA.label,
        url: page.whatsappCTA.url,
        newTab: page.whatsappCTA.newTab === true,
        message: page.whatsappCTA.message || undefined,
      },
      faqs: page.faqs?.map(({ question, answer }) => ({ question, answer })) || [],
      seo: page.seo,
    };
  }, fallbackContactPage, "contact page"),
["contact-page"], { revalidate: 3600 });

export const getCapabilities = unstable_cache(async () =>
  withFallback(async () => {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "capabilities",
      depth: 0,
      limit: 100,
      overrideAccess: false,
      pagination: false,
      sort: "displayOrder",
      where: { active: { equals: true } },
    });
    return result.docs.map((item) => ({
      name: item.name,
      shortDescription: item.shortDescription,
    }));
  }, [], "capabilities"),
["capabilities"], { revalidate: 3600 });

export const getCertifications = unstable_cache(async () =>
  withFallback(async () => {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "certifications",
      depth: 1,
      limit: 100,
      overrideAccess: false,
      pagination: false,
      sort: "displayOrder",
      where: { publiclyVisible: { equals: true } },
    });
    return result.docs.map((item) => ({
      name: item.name,
      issuingAuthority: item.issuingAuthority || undefined,
      registrationNumber:
        item.showDetailsPublicly === true ? item.registrationNumber || undefined : undefined,
    }));
  }, [], "certifications"),
["certifications"], { revalidate: 3600 });
