import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { getCapabilities, getSiteSettings } from "@/src/lib/queries";

const fallbackCapabilities = [
  ["Civil engineering", "Site-led interpretation and execution of civil scopes."],
  ["Structural execution", "Controlled formwork, reinforcement, concrete and steel packages."],
  ["Site management", "Daily coordination, work-front planning and issue resolution."],
  ["Procurement", "Submittals, lead-time tracking, vendor coordination and material control."],
  ["Project planning", "Sequencing, milestones, resource planning and progress reporting."],
  ["Quantity estimation", "Scope understanding, take-offs and package-level cost visibility."],
  ["Quality assurance", "Inspection plans, hold points, records and closeout tracking."],
  ["Safety systems", "Briefings, task controls, PPE and risk-aware supervision."],
  ["Vendor management", "Capability review, work package clarity and delivery coordination."],
  ["Documentation", "Submittals, records, reports, drawings and handover information."],
  ["Workforce coordination", "Trade sequencing, productivity planning and site discipline."],
  ["Handover management", "Snagging, testing records, closeout and post-completion support."],
].map(([name, shortDescription]) => ({ name, shortDescription }));

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: "Capabilities",
    description:
      "Technical construction and project delivery capabilities of Zum Zum Enterprises.",
    alternates: { canonical: `${settings.productionURL}/capabilities` },
  };
}

export default async function CapabilitiesPage() {
  const cmsCapabilities = await getCapabilities();
  const capabilities =
    cmsCapabilities.length > 0 ? cmsCapabilities : fallbackCapabilities;
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Capabilities"
        title="Technical depth behind field execution."
        intro="The systems, disciplines and site capabilities required to move complex construction from drawings to durable completed work."
        image="/images/project-infrastructure.webp"
      />
      <section className="content-section">
        <div className="editorial-grid">
          <aside>Delivery capability</aside>
          <div>
            <h2>Coordinated from information to installation.</h2>
            <p className="lead-copy">
              Zum Zum Enterprises aligns technical information, labour,
              suppliers, equipment, inspections and stakeholder decisions around
              the live construction programme.
            </p>
          </div>
        </div>
        <div className="capability-grid">
          {capabilities.map(({ name, shortDescription }, index) => (
            <article key={name}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{name}</h3>
              <p>{shortDescription}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="equipment-section section-dark">
        <div>
          <p className="eyebrow">Equipment &amp; resources</p>
          <h2>Inventory pending verification.</h2>
        </div>
        <p>
          Confirmed equipment, owned and hired plant, technical staff numbers,
          specialist trades, yard capacity and supplier resources will be added
          after company verification.
        </p>
      </section>
    </main>
  );
}
