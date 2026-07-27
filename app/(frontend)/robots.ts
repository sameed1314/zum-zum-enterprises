import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/src/lib/queries";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/preview"],
      },
    ],
    sitemap: `${settings.productionURL}/sitemap.xml`,
  };
}
