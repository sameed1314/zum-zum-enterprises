import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { getCertifications, getSiteSettings } from "@/src/lib/queries";

const controls = [
  ["Material inspection", "Verify approved materials, condition, storage and traceable records."],
  ["Workmanship checks", "Inspect defined stages before work is covered or released."],
  ["Site supervision", "Maintain visible technical oversight across active work fronts."],
  ["Documentation", "Record inspections, observations, approvals and closeout evidence."],
  ["Safety briefings", "Communicate task hazards, controls and responsibilities before work."],
  ["Personal protection", "Define and enforce task-appropriate PPE expectations."],
  ["Risk identification", "Review access, lifting, work at height, excavation and live interfaces."],
  ["Incident prevention", "Use planning, supervision and corrective actions to reduce exposure."],
  ["Environmental care", "Manage waste, dust, water, noise and site housekeeping responsibly."],
];

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: "Quality & Safety",
    description:
      "Quality-control, site safety and environmental responsibility at Zum Zum Enterprises.",
    alternates: { canonical: `${settings.productionURL}/quality-safety` },
  };
}

export default async function QualitySafetyPage() {
  const certifications = await getCertifications();
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Quality & Safety"
        title="Control the work. Protect the people."
        intro="Quality and safety are managed through planned inspections, visible supervision, documented controls and clear accountability."
      />
      <section className="content-section">
        <div className="editorial-grid">
          <aside>Operating principles</aside>
          <div>
            <h2>Evidence before claims.</h2>
            <p className="lead-copy">
              Requirements are translated into practical field controls: what
              must be checked, when it must be checked, who owns the decision
              and what evidence closes the activity.
            </p>
          </div>
        </div>
        <div className="quality-grid">
          {controls.map(([title, copy], index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="certification-note section-forest">
        <p className="eyebrow">Compliance</p>
        {certifications.length > 0 ? (
          <>
            <h2>Verified certifications and registrations.</h2>
            <div className="certification-list">
              {certifications.map((certification) => (
                <article key={certification.name}>
                  <h3>{certification.name}</h3>
                  {certification.issuingAuthority && <p>{certification.issuingAuthority}</p>}
                  {certification.registrationNumber && <p>{certification.registrationNumber}</p>}
                </article>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2>Certifications and registrations will be listed only after verification.</h2>
            <p>No unverified registration, award or certification claim is published.</p>
          </>
        )}
      </section>
    </main>
  );
}
