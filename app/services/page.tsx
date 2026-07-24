import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Services",
  description: "Construction, civil contracting, turnkey execution, structural works and project management services in Kashmir.",
};

export default function ServicesPage() {
  return (
    <main id="main-content">
      <PageHero eyebrow="Services" title="One delivery system. Multiple project types." intro="Construction services organised around accountable planning, procurement, execution, quality and handover." image="/images/project-residence.webp" />
      <section className="content-section">
        <div className="services-page-list">
          {services.map((service) => (
            <article className="service-detail" key={service.number}>
              <span>{service.number}</span>
              <h2>{service.title}</h2>
              <div><p>{service.description} Typical engagement scope is confirmed against drawings, specifications, site constraints and commercial requirements.</p><div className="chip-list">{service.capabilities.map((item) => <span key={item}>{item}</span>)}</div></div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

