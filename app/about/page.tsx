import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "About",
  description: "About Zum Zum Enterprises, a Class-A construction contractor serving Jammu and Kashmir.",
};

const values = [
  ["01", "Discipline", "Programmes, approvals and work fronts are managed through clear controls."],
  ["02", "Accountability", "Ownership is visible from leadership through site execution and closeout."],
  ["03", "Technical rigour", "Details, materials and workmanship are reviewed against defined requirements."],
  ["04", "Clarity", "Clients and consultants receive direct, evidence-based project communication."],
  ["05", "Respect for place", "Terrain, climate, context and local supply realities inform every plan."],
  ["06", "Long-term value", "Decisions consider performance, maintainability and the completed asset."],
];

export default function AboutPage() {
  return (
    <main id="main-content">
      <PageHero eyebrow="About" title="A contractor shaped by Kashmir." intro="Zum Zum Enterprises brings formal construction discipline, regional execution knowledge and accountable site leadership to complex projects across Jammu and Kashmir." />
      <section className="content-section">
        <div className="editorial-grid">
          <aside>01 / Company</aside>
          <div>
            <h2>Serious delivery for demanding projects.</h2>
            <p className="lead-copy">From institutional buildings and premium residences to infrastructure and renovation, the company coordinates people, information, materials and field execution around a clear project outcome. Exact history, founding year, leadership profiles and verified milestones remain editable placeholders pending company confirmation.</p>
          </div>
        </div>
      </section>
      <section className="split-content">
        <div className="split-content-image"><img src="/images/project-residence.webp" alt="Contemporary stone residence in Kashmir" width="1400" height="1050" /></div>
        <div className="split-content-copy">
          <p className="eyebrow">Execution philosophy</p>
          <h2>Plan with precision. Build with control.</h2>
          <p>Zum Zum Enterprises approaches every assignment as a coordinated system: requirements, site realities, design information, procurement, sequencing, quality, safety and handover must move together.</p>
        </div>
      </section>
      <section className="content-section">
        <div className="editorial-grid"><aside>02 / Mission &amp; vision</aside><div><h2>Useful buildings. Durable outcomes.</h2><p className="lead-copy"><strong>Mission:</strong> Deliver well-coordinated construction through disciplined planning and technically controlled execution.<br /><br /><strong>Vision:</strong> Build a recognised Kashmir-based contracting organisation trusted with larger, more complex and more consequential projects.</p></div></div>
        <div className="values-grid">{values.map(([number, title, copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </section>
      <section className="content-section section-dark">
        <div className="editorial-grid"><aside>03 / People</aside><div><h2>Leadership close to the work.</h2><p className="lead-copy light-copy">Add verified leadership profiles, engineering qualifications, workforce scale and organisation details here. The final section is structured to present decision-makers, site leaders and specialist teams without making unsupported claims.</p></div></div>
      </section>
    </main>
  );
}

