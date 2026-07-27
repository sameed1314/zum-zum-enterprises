import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ServiceData, SiteSettingsData } from "@/src/lib/content-types";

export function Footer({
  settings,
  services,
}: {
  settings: SiteSettingsData;
  services: ServiceData[];
}) {
  return (
    <footer className="footer">
      <div className="footer-lead">
        <p className="eyebrow">{settings.footerCTA.eyebrow || "Build with us"}</p>
        <h2>{settings.footerCTA.heading || "Planning a project in Jammu & Kashmir?"}</h2>
        <Link className="button button-copper" href={settings.footerCTA.url}>{settings.footerCTA.label} <ArrowUpRight size={18} aria-hidden="true" /></Link>
      </div>
      <div className="footer-grid">
        <div>
          <div className="footer-wordmark">{settings.shortCompanyName.toUpperCase()}</div>
          <p>{settings.footerDescription || settings.companyDescription}</p>
          <span className="classification">{settings.contractorClassification}</span>
        </div>
        <div><h3>Navigate</h3>{settings.navigation.map((item) => <Link key={`${item.url}-${item.label}`} href={item.url}>{item.label}</Link>)}</div>
        <div><h3>Services</h3>{services.slice(0, 6).map((service) => <Link key={service.slug} href="/services">{service.name}</Link>)}</div>
        <div>
          <h3>Contact</h3>
          {settings.phoneNumbers.map((phone) => <a key={phone.number} href={`tel:${phone.number.replace(/[^\d+]/g, "")}`}>{phone.number}</a>)}
          {settings.emailAddresses.map((email) => <a key={email.email} href={`mailto:${email.email}`}>{email.email}</a>)}
          {settings.whatsappNumber && <a href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent("Hello, I would like to discuss a construction project with Zum Zum Enterprises.")}`} target="_blank" rel="noreferrer">WhatsApp <ArrowUpRight size={14} aria-hidden="true" /></a>}
          {settings.officeAddress && <p>{settings.officeAddress}</p>}<p>{settings.businessHours}</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>{settings.copyrightText || `© 2026 ${settings.fullCompanyName}`}</span>
        <span>{settings.footerRegistrationText}</span>
        <Link href="/quality-safety">Quality &amp; Safety</Link>
      </div>
    </footer>
  );
}
