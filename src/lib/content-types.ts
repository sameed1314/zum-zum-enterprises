import type {
  AboutPage,
  ContactPage,
  Homepage,
  Project,
  SiteSetting,
} from "@/src/payload-types";

export type LinkItem = {
  label: string;
  url: string;
  newTab?: boolean;
};

export type PublicMedia = {
  url: string;
  alt: string;
  caption?: string;
};

export type ProjectCardData = {
  slug: string;
  title: string;
  shortSummary: string;
  category: string;
  location: string;
  year?: string;
  status: "ongoing" | "completed" | "upcoming";
  coverImage: PublicMedia;
  featured: boolean;
  displayOrder: number;
  updatedAt?: string;
};

export type ProjectDetailData = ProjectCardData & {
  district?: string;
  clientType?: string;
  scopeOfWork?: string;
  contractType?: string;
  builtUpArea?: string;
  duration?: string;
  startDate?: string;
  completionDate?: string;
  projectValue?: string;
  architectConsultant?: string;
  executionResponsibilities?: string;
  materials: string[];
  constructionMethods: string[];
  qualityControl?: string;
  safetyInformation?: string;
  overview: Project["overview"];
  challenge?: Project["challenge"];
  executionApproach?: Project["executionApproach"];
  outcome?: Project["outcome"];
  qualityAndSafety?: Project["qualityAndSafety"];
  heroImage: PublicMedia;
  gallery: PublicMedia[];
  services: string[];
  sectors: string[];
  relatedProjects: ProjectCardData[];
  seo?: Project["seo"];
};

export type ServiceData = {
  slug: string;
  name: string;
  shortDescription: string;
  capabilities: string[];
  icon?: string;
  featured: boolean;
  displayOrder: number;
};

export type SiteSettingsData = {
  fullCompanyName: string;
  shortCompanyName: string;
  tagline: string;
  companyDescription: string;
  contractorClassification: string;
  phoneNumbers: { label: string; number: string }[];
  whatsappNumber?: string;
  emailAddresses: { label: string; email: string }[];
  officeAddress?: string;
  googleMapsURL?: string;
  businessHours?: string;
  socialLinks: { platform: string; url: string }[];
  navigation: LinkItem[];
  primaryCTA: LinkItem;
  footerDescription?: string;
  footerNavigationGroups: { label: string; links: LinkItem[] }[];
  footerCTA: LinkItem & { eyebrow?: string; heading?: string };
  copyrightText?: string;
  footerRegistrationText?: string;
  registrationDetails?: SiteSetting["registrationDetails"];
  announcement?: SiteSetting["announcement"];
  seo?: SiteSetting["seo"];
  productionURL: string;
};

export type HomepageData = {
  heroEyebrow: string;
  heroHeading: string;
  heroAccent?: string;
  heroSupportingText: string;
  heroImage: PublicMedia;
  primaryCTA: LinkItem;
  secondaryCTA: LinkItem;
  introductoryStatement: string;
  featuredProjects: ProjectCardData[];
  featuredServices: ServiceData[];
  featuredSectors: string[];
  statistics: { value: string; label: string; verified: boolean }[];
  whySection: {
    eyebrow?: string;
    heading?: string;
    introduction?: string;
    image: PublicMedia;
    points: string[];
  };
  constructionProcess: { title: string; description?: string }[];
  testimonial?: {
    text: string;
    attribution: string;
    isPlaceholder: boolean;
  };
  sectionVisibility: NonNullable<Homepage["sectionVisibility"]>;
  seo?: Homepage["seo"];
};

export type AboutPageData = {
  hero: {
    eyebrow: string;
    heading: string;
    introduction: string;
    image?: PublicMedia;
  };
  companyIntroduction: AboutPage["companyIntroduction"];
  history?: AboutPage["history"];
  mission?: AboutPage["mission"];
  vision?: AboutPage["vision"];
  values: { title: string; description: string }[];
  leadershipContent?: AboutPage["leadershipContent"];
  seo?: AboutPage["seo"];
};

export type ContactPageData = {
  hero: {
    eyebrow: string;
    heading: string;
    introduction: string;
    image?: PublicMedia;
  };
  officeHeading?: string;
  officeInformation?: ContactPage["officeInformation"];
  mapEmbedURL?: string;
  enquiryCategories: string[];
  formSupportingText?: string;
  whatsappCTA: LinkItem & { message?: string };
  faqs: { question: string; answer: string }[];
  seo?: ContactPage["seo"];
};
