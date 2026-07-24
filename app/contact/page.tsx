import type { Metadata } from "next";
import { ContactForm } from "@/components/Interactive";
import { PageHero } from "@/components/PageHero";
import { company } from "@/data/company";

export const metadata: Metadata = {
  title: "Contact",
  description: "Discuss a construction project in Jammu and Kashmir with Zum Zum Enterprises.",
};

export default function ContactPage() {
  return (
    <main id="main-content">
      <PageHero eyebrow="Contact" title="Bring us the brief." intro="Share the project type, location, current stage and timing. The right technical conversation starts with clear information." image="/images/project-residence.webp" />
      <section className="content-section">
        <div className="contact-layout">
          <div className="contact-details">
            <h2>Project enquiries.</h2>
            <dl>
              <div><dt>Phone</dt><dd><a href={company.phoneHref}>{company.phone}</a></dd></div>
              <div><dt>WhatsApp</dt><dd><a href={company.whatsappHref} target="_blank" rel="noreferrer">{company.whatsapp}</a></dd></div>
              <div><dt>Email</dt><dd><a href={company.emailHref}>{company.email}</a></dd></div>
              <div><dt>Office</dt><dd>{company.address}</dd></div>
              <div><dt>Business hours</dt><dd>{company.businessHours}</dd></div>
            </dl>
            <div className="map-placeholder"><span>Map location pending</span><p>Add the verified Google Maps link in the central company configuration.</p></div>
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}

