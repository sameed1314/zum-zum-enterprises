import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { getServices, getSiteSettings } from "@/src/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: "Services",
    description:
      "Construction, civil contracting, turnkey execution, structural works and project management services in Kashmir.",
    alternates: { canonical: `${settings.productionURL}/services` },
  };
}

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Services"
        title="One delivery system. Multiple project types."
        intro="Construction services organised around accountable planning, procurement, execution, quality and handover."
        image="/images/project-residence.webp"
      />
      <section className="content-section">
        {services.length > 0 ? (
          <div className="services-page-list">
            {services.map((service, index) => (
              <article className="service-detail" key={service.slug}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h2>{service.name}</h2>
                <div>
                  <p>{service.shortDescription}</p>
                  {service.capabilities.length > 0 && (
                    <div className="chip-list">
                      {service.capabilities.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="eyebrow">Services</p>
            <h2>Service information is being updated.</h2>
          </div>
        )}
      </section>
    </main>
  );
}
