import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Quality & Safety",
  description: "Quality-control, site safety and environmental responsibility at Zum Zum Enterprises.",
};

const controls = [
  ["01", "Material inspection", "Verify approved materials, condition, storage and traceable records."],
  ["02", "Workmanship checks", "Inspect defined stages before work is covered or released."],
  ["03", "Site supervision", "Maintain visible technical oversight across active work fronts."],
  ["04", "Documentation", "Record inspections, observations, approvals and closeout evidence."],
  ["05", "Safety briefings", "Communicate task hazards, controls and responsibilities before work."],
  ["06", "Personal protection", "Define and enforce task-appropriate PPE expectations."],
  ["07", "Risk identification", "Review access, lifting, work at height, excavation and live interfaces."],
  ["08", "Incident prevention", "Use planning, supervision and corrective actions to reduce exposure."],
  ["09", "Environmental care", "Manage waste, dust, water, noise and site housekeeping responsibly."],
];

export default function QualitySafetyPage() {
  return (
    <main id="main-content">
      <PageHero eyebrow="Quality & Safety" title="Control the work. Protect the people." intro="Quality and safety are managed through planned inspections, visible supervision, documented controls and clear accountability." />
      <section className="content-section">
        <div className="editorial-grid"><aside>Operating principles</aside><div><h2>Evidence before claims.</h2><p className="lead-copy">Requirements are translated into practical field controls: what must be checked, when it must be checked, who owns the decision and what evidence closes the activity.</p></div></div>
        <div className="quality-grid">{controls.map(([number, title, copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </section>
      <section className="certification-note section-forest">
        <p className="eyebrow">Compliance</p><h2>Certifications and registrations will be listed only after verification.</h2><p>Placeholder: add approved contractor registration, GST details, safety certifications, quality certifications and issuing authorities with valid document references.</p>
      </section>
    </main>
  );
}

