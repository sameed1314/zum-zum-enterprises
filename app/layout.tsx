import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ScrollTools } from "@/components/Motion";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.zumzumenterprises.example"),
  title: { default: "Zum Zum Enterprises | Class-A Contractor in Kashmir", template: "%s | Zum Zum Enterprises" },
  description: "Zum Zum Enterprises delivers residential, commercial, institutional and civil construction projects across Jammu and Kashmir.",
  keywords: ["construction company in Kashmir", "Class-A contractor in Kashmir", "civil contractor Srinagar", "turnkey construction Kashmir"],
  openGraph: { title: "Zum Zum Enterprises", description: "Class-A construction and contracting capability across Jammu and Kashmir.", type: "website", images: ["/images/hero-kashmir-construction.webp"] },
  twitter: { card: "summary_large_image", title: "Zum Zum Enterprises", description: "Engineered for the terrain. Built for the long term.", images: ["/images/hero-kashmir-construction.webp"] },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    name: "Zum Zum Enterprises",
    description: "Class-A construction and contracting company serving Jammu and Kashmir.",
    address: { "@type": "PostalAddress", addressRegion: "Jammu and Kashmir", addressCountry: "IN" },
    telephone: "[PHONE NUMBER]",
    email: "[EMAIL ADDRESS]",
    areaServed: "Jammu and Kashmir",
    url: "https://www.zumzumenterprises.example",
  };
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <Header />
        {children}
        <Footer />
        <ScrollTools />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </body>
    </html>
  );
}
