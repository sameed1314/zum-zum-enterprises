import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ScrollTools } from "@/components/Motion";
import { getServices, getSiteSettings } from "@/src/lib/queries";
import "../globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title =
    settings.seo?.title ||
    `${settings.fullCompanyName} | ${settings.contractorClassification} in Kashmir`;
  const description =
    settings.seo?.description || settings.companyDescription;
  return {
    metadataBase: new URL(settings.productionURL),
    title: {
      default: title,
      template: `%s | ${settings.fullCompanyName}`,
    },
    description,
    keywords: [
      "construction company in Kashmir",
      "Class-A contractor in Kashmir",
      "civil contractor Srinagar",
      "turnkey construction Kashmir",
    ],
    openGraph: {
      title,
      description,
      type: "website",
      images: ["/images/hero-kashmir-construction.webp"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/hero-kashmir-construction.webp"],
    },
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
  };
}

export default async function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, services] = await Promise.all([
    getSiteSettings(),
    getServices(),
  ]);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    name: settings.fullCompanyName,
    description: settings.companyDescription,
    address: { "@type": "PostalAddress", addressRegion: "Jammu and Kashmir", addressCountry: "IN" },
    telephone: settings.phoneNumbers[0]?.number,
    email: settings.emailAddresses[0]?.email,
    areaServed: "Jammu and Kashmir",
    url: settings.productionURL,
  };
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <Header settings={settings} />
        {children}
        <Footer settings={settings} services={services} />
        <ScrollTools />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
