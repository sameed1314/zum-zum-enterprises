import type { MetadataRoute } from "next";
import { getProjects, getSiteSettings } from "@/src/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, projects] = await Promise.all([
    getSiteSettings(),
    getProjects(),
  ]);
  const routes = [
    "",
    "/about",
    "/projects",
    "/services",
    "/capabilities",
    "/quality-safety",
    "/contact",
  ];
  return [
    ...routes.map((route) => ({
      url: `${settings.productionURL}${route}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.8,
    })),
    ...projects.map((project) => ({
      url: `${settings.productionURL}/projects/${project.slug}`,
      lastModified: project.updatedAt ? new Date(project.updatedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
