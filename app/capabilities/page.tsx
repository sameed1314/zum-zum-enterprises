import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Capabilities",
  description: "Technical construction and project delivery capabilities of Zum Zum Enterprises.",
};

const capabilities = [
  ["01", "Civil engineering", "Site-led interpretation and execution of civil scopes."],
  ["02", "Structural execution", "Controlled formwork, reinforcement, concrete and steel packages."],
  ["03", "Site management", "Daily coordination, work-front planning and issue resolution."],
  ["04", "Procurement", "Submittals, lead-time tracking, vendor coordination and material control."],
  ["05", "Project planning", "Sequencing, milestones, resource planning and progress reporting."],
  ["06", "Quantity estimation", "Scope understanding, take-offs and package-level cost visibility."],
  ["07", "Quality assurance", "Inspection plans, hold points, records and closeout tracking."],
  ["08", "Safety systems", "Briefings, task controls, PPE and risk-aware supervision."],
  ["09", "Vendor management", "Capability review, work package clarity and delivery coordination."],
  ["10", "Documentation", "Submittals, records, reports, drawings and handover information."],
  ["11", "Workforce coordination", "Trade sequencing, productivity planning and site discipline."],
  ["12", "Handover management", "Snagging, testing records, closeout and post-completion support."],
];

export default function CapabilitiesPage() {
  return (
    <main id="main-content">
      <PageHero eyebrow="Capabilities" title="Technical depth behind field execution." intro="The systems, disciplines and site capabilities required to move complex construction from drawings to durable completed work." image="/images/project-infrastructure.webp" />
      <section className="content-section">
        <div className="editorial-grid"><aside>Delivery capability</aside><div><h2>Coordinated from information to installation.</h2><p className="lead-copy">Zum Zum Enterprises aligns technical information, labour, suppliers, equipment, inspections and stakeholder decisions around the live construction programme.</p></div></div>
        <div className="capability-grid">{capabilities.map(([number, title, copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </section>
      <section className="equipment-section section-dark">
        <div><p className="eyebrow">Equipment &amp; resources</p><h2>Inventory pending verification.</h2></div>
        <p>Add confirmed equipment, owned and hired plant, technical staff numbers, specialist trades, yard capacity and supplier resources here. No unverified assets are presented.</p>
      </section>
    </main>
  );
}

