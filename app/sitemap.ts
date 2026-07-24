import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.zumzumenterprises.example";
  const routes = ["", "/about", "/projects", "/services", "/capabilities", "/quality-safety", "/contact"];
  return [
    ...routes.map((route) => ({ url: `${baseUrl}${route}`, lastModified: new Date("2026-07-24"), changeFrequency: "monthly" as const, priority: route === "" ? 1 : 0.8 })),
    ...projects.map((project) => ({ url: `${baseUrl}/projects/${project.slug}`, lastModified: new Date("2026-07-24"), changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}

