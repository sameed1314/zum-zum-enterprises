import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/Motion";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
import { company } from "@/data/company";
import { featuredProjects } from "@/data/projects";
import { processSteps, sectors, services } from "@/data/services";

export default function Home() {
  const stats = [
    [company.placeholders.yearsExperience, "Years of experience"],
    [company.placeholders.completedProjects, "Completed projects"],
    [company.placeholders.professionals, "Skilled professionals"],
    [company.placeholders.districtsServed, "Districts served"],
    [company.placeholders.areaDelivered, "Sq. ft. delivered"],
  ];
  return (
    <main id="main-content">
      <section className="hero">
        <img className="hero-media" src="/images/hero-kashmir-construction.webp" alt="Contemporary stone and concrete institutional complex in a Kashmir mountain setting" width="1920" height="1080" />
        <div className="hero-shade" /><div className="blueprint-grid" aria-hidden="true" />
        <div className="hero-topline"><span>{company.classification}</span><span>Jammu &amp; Kashmir / India</span><span>34.0837° N / 74.7973° E</span></div>
        <div className="hero-content">
          <p className="eyebrow">Construction / Civil / Turnkey</p>
          <h1>Building Kashmir&apos;s<br /><em>next landmark.</em></h1>
          <div className="hero-content-bottom">
            <p>Class-A construction and contracting expertise across civil, commercial, institutional, residential and infrastructure projects.</p>
            <div className="hero-actions">
              <Link className="button button-copper" href="/projects">Explore our projects <ArrowUpRight size={18} aria-hidden="true" /></Link>
              <Link className="text-link" href="/contact">Discuss a project <ArrowRight size={18} aria-hidden="true" /></Link>
            </div>
          </div>
        </div>
        <div className="hero-index"><span>Featured work</span><strong>01 / 03</strong><p>Institutional Complex — Srinagar</p></div>
        <a className="scroll-cue" href="#statement" aria-label="Scroll to introduction">Scroll <ArrowDown size={16} aria-hidden="true" /></a>
      </section>

      <section className="statement section-dark" id="statement">
        <div className="statement-number">00 —</div>
        <Reveal><p>From complex civil works to landmark buildings, Zum Zum Enterprises delivers projects defined by <span>engineering discipline</span>, controlled execution and long-term value.</p></Reveal>
      </section>

      <section className="stats-section section-light">
        <p className="eyebrow">Scale / figures pending verification</p>
        <div className="stats-grid">
          {stats.map(([value, label]) => <Reveal className="stat" key={label}><strong>{value}</strong><span>{label}</span></Reveal>)}
          <Reveal className="stat stat-accent"><strong>A</strong><span>Contractor class</span></Reveal>
        </div>
      </section>

      <section className="projects-section section-light">
        <SectionHeading number="01" eyebrow="Selected projects" title="Built work, presented with clarity." copy="Structured placeholders ready to be replaced with verified project records and photography." />
        <div className="featured-projects">{featuredProjects.map((project, index) => <Reveal key={project.slug}><ProjectCard project={project} priority={index === 0} /></Reveal>)}</div>
        <Link className="button button-dark section-button" href="/projects">View all projects <ArrowRight size={18} aria-hidden="true" /></Link>
      </section>

      <section className="services-section section-dark">
        <SectionHeading number="02" eyebrow="What we deliver" title="Construction capability across the full project lifecycle." />
        <div className="service-list">
          {services.map((service) => {
            const Icon = service.icon;
            return <Reveal className="service-row" key={service.number}><span>{service.number}</span><Icon size={27} strokeWidth={1.4} aria-hidden="true" /><h3>{service.title}</h3><p>{service.description}</p><ArrowUpRight size={22} aria-hidden="true" /></Reveal>;
          })}
        </div>
      </section>

      <section className="why-section section-forest">
        <div className="why-image"><img src="/images/project-infrastructure.webp" alt="Mountain infrastructure and retaining-wall project" width="1200" height="900" loading="lazy" /></div>
        <div className="why-content">
          <p className="eyebrow">Why Zum Zum / regional execution</p><h2>Local knowledge. Formal delivery discipline.</h2>
          <p className="why-intro">Projects in Jammu and Kashmir demand terrain-aware logistics, seasonal planning and reliable coordination across every work front.</p>
          <div className="why-points">{["Class-A contractor capability", "Experienced technical site teams", "Quality-control hold points", "Safety-focused delivery", "Terrain and weather planning", "Supplier and subcontractor coordination"].map((point, index) => <div key={point}><span>0{index + 1}</span><p>{point}</p></div>)}</div>
          <Link className="text-link" href="/capabilities">Review our capabilities <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="process-section section-light">
        <SectionHeading number="03" eyebrow="Method" title="A controlled path from brief to handover." copy="Clear accountability at each stage keeps decisions, procurement and site execution aligned." />
        <div className="process-line">{processSteps.map((step, index) => <Reveal className="process-step" key={step}><span>{String(index + 1).padStart(2, "0")}</span><h3>{step}</h3></Reveal>)}</div>
      </section>

      <section className="sectors-section section-copper">
        <div><p className="eyebrow">Sectors served</p><h2>Built for diverse operating environments.</h2></div>
        <div className="sector-cloud">{sectors.map((sector) => <span key={sector}>{sector}</span>)}</div>
      </section>

      <section className="testimonial-section section-light">
        <p className="eyebrow">Client perspective / placeholder</p>
        <blockquote>“The final website will feature verified client feedback here. This placeholder demonstrates the intended scale and editorial treatment without inventing an endorsement.”</blockquote>
        <p>— Institutional client / Name pending approval</p>
      </section>
    </main>
  );
}

