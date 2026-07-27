import type { Metadata } from "next";
import { ContactForm } from "@/components/Interactive";
import { PageHero } from "@/components/PageHero";
import { RichTextContent } from "@/components/RichTextContent";
import { getContactPage, getSiteSettings } from "@/src/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([
    getContactPage(),
    getSiteSettings(),
  ]);
  return {
    title: page.seo?.title || "Contact",
    description: page.seo?.description || page.hero.introduction,
    alternates: {
      canonical: page.seo?.canonicalURL || `${settings.productionURL}/contact`,
    },
    robots: page.seo?.noIndex ? { index: false, follow: false } : undefined,
  };
}

export default async function ContactPage() {
  const [page, settings] = await Promise.all([
    getContactPage(),
    getSiteSettings(),
  ]);
  const whatsappNumber = settings.whatsappNumber?.replace(/\D/g, "");
  const whatsappMessage =
    page.whatsappCTA.message ||
    "Hello, I would like to discuss a construction project with Zum Zum Enterprises.";
  const whatsappURL = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
    : page.whatsappCTA.url;

  return (
    <main id="main-content">
      <PageHero
        eyebrow={page.hero.eyebrow}
        title={page.hero.heading}
        intro={page.hero.introduction}
        image={page.hero.image?.url}
      />
      <section className="content-section">
        <div className="contact-layout">
          <div className="contact-details">
            <h2>{page.officeHeading || "Project enquiries."}</h2>
            <dl>
              {settings.phoneNumbers.map((phone) => (
                <div key={phone.number}>
                  <dt>{phone.label}</dt>
                  <dd>
                    <a href={`tel:${phone.number.replace(/[^\d+]/g, "")}`}>
                      {phone.number}
                    </a>
                  </dd>
                </div>
              ))}
              {settings.whatsappNumber && (
                <div>
                  <dt>WhatsApp</dt>
                  <dd>
                    <a href={whatsappURL} target="_blank" rel="noreferrer">
                      {settings.whatsappNumber}
                    </a>
                  </dd>
                </div>
              )}
              {settings.emailAddresses.map((email) => (
                <div key={email.email}>
                  <dt>{email.label}</dt>
                  <dd>
                    <a href={`mailto:${email.email}`}>{email.email}</a>
                  </dd>
                </div>
              ))}
              {settings.officeAddress && (
                <div><dt>Office</dt><dd>{settings.officeAddress}</dd></div>
              )}
              {settings.businessHours && (
                <div><dt>Business hours</dt><dd>{settings.businessHours}</dd></div>
              )}
            </dl>
            {page.officeInformation && (
              <RichTextContent data={page.officeInformation} />
            )}
            <div className="map-placeholder">
              <span>{settings.googleMapsURL ? "Office location" : "Map location pending"}</span>
              {settings.googleMapsURL ? (
                <p><a href={settings.googleMapsURL} target="_blank" rel="noreferrer">Open in Google Maps</a></p>
              ) : (
                <p>Add the verified Google Maps link in Site Settings.</p>
              )}
            </div>
          </div>
          <ContactForm
            categories={page.enquiryCategories}
            supportingText={page.formSupportingText}
            whatsappURL={whatsappURL}
          />
        </div>
      </section>
    </main>
  );
}
