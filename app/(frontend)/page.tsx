import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Motion";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceIcon } from "@/components/ServiceIcon";
import { getHomepage, getSiteSettings } from "@/src/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const [homepage, settings] = await Promise.all([
    getHomepage(),
    getSiteSettings(),
  ]);
  return {
    title: homepage.seo?.title || undefined,
    description:
      homepage.seo?.description || homepage.heroSupportingText,
    alternates: {
      canonical: homepage.seo?.canonicalURL || settings.productionURL,
    },
    robots: homepage.seo?.noIndex ? { index: false, follow: false } : undefined,
  };
}

export default async function Home() {
  const [homepage, settings] = await Promise.all([
    getHomepage(),
    getSiteSettings(),
  ]);
  const visibility = homepage.sectionVisibility;

  return (
    <main id="main-content">
      <section className="hero">
        <Image
          className="hero-media"
          src={homepage.heroImage.url}
          alt={homepage.heroImage.alt}
          width={1920}
          height={1080}
          priority
          sizes="100vw"
        />
        <div className="hero-shade" />
        <div className="blueprint-grid" aria-hidden="true" />
        <div className="hero-topline">
          <span>{settings.contractorClassification}</span>
          <span>Jammu &amp; Kashmir / India</span>
          <span>34.0837° N / 74.7973° E</span>
        </div>
        <div className="hero-content">
          <p className="eyebrow">{homepage.heroEyebrow}</p>
          <h1>
            {homepage.heroHeading}
            {homepage.heroAccent && (
              <>
                <br />
                <em>{homepage.heroAccent}</em>
              </>
            )}
          </h1>
          <div className="hero-content-bottom">
            <p>{homepage.heroSupportingText}</p>
            <div className="hero-actions">
              <Link
                className="button button-copper"
                href={homepage.primaryCTA.url}
              >
                {homepage.primaryCTA.label}{" "}
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <Link className="text-link" href={homepage.secondaryCTA.url}>
                {homepage.secondaryCTA.label}{" "}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
        {homepage.featuredProjects[0] && (
          <div className="hero-index">
            <span>Featured work</span>
            <strong>01 / {String(homepage.featuredProjects.length).padStart(2, "0")}</strong>
            <p>
              {homepage.featuredProjects[0].title} —{" "}
              {homepage.featuredProjects[0].location}
            </p>
          </div>
        )}
        <a
          className="scroll-cue"
          href="#statement"
          aria-label="Scroll to introduction"
        >
          Scroll <ArrowDown size={16} aria-hidden="true" />
        </a>
      </section>

      <section className="statement section-dark" id="statement">
        <div className="statement-number">00 —</div>
        <Reveal>
          <p>{homepage.introductoryStatement}</p>
        </Reveal>
      </section>

      {visibility.statistics !== false && homepage.statistics.length > 0 && (
        <section className="stats-section section-light">
          <p className="eyebrow">
            Scale / {homepage.statistics.every((stat) => stat.verified) ? "verified" : "figures pending verification"}
          </p>
          <div className="stats-grid">
            {homepage.statistics.map(({ value, label }) => (
              <Reveal className="stat" key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </Reveal>
            ))}
            <Reveal className="stat stat-accent">
              <strong>A</strong>
              <span>Contractor class</span>
            </Reveal>
          </div>
        </section>
      )}

      {visibility.projects !== false && homepage.featuredProjects.length > 0 && (
        <section className="projects-section section-light">
          <SectionHeading
            number="01"
            eyebrow="Selected projects"
            title="Built work, presented with clarity."
            copy="Explore published project records, execution details and photography."
          />
          <div className="featured-projects">
            {homepage.featuredProjects.map((project, index) => (
              <Reveal key={project.slug}>
                <ProjectCard project={project} priority={index === 0} />
              </Reveal>
            ))}
          </div>
          <Link className="button button-dark section-button" href="/projects">
            View all projects <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </section>
      )}

      {visibility.services !== false && homepage.featuredServices.length > 0 && (
        <section className="services-section section-dark">
          <SectionHeading
            number="02"
            eyebrow="What we deliver"
            title="Construction capability across the full project lifecycle."
          />
          <div className="service-list">
            {homepage.featuredServices.map((service, index) => (
              <Reveal className="service-row" key={service.slug}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <ServiceIcon name={service.icon} />
                <h3>{service.name}</h3>
                <p>{service.shortDescription}</p>
                <ArrowUpRight size={22} aria-hidden="true" />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {visibility.why !== false && (
        <section className="why-section section-forest">
          <div className="why-image">
            <Image
              src={homepage.whySection.image.url}
              alt={homepage.whySection.image.alt}
              width={1200}
              height={900}
              sizes="(max-width: 800px) 100vw, 50vw"
            />
          </div>
          <div className="why-content">
            <p className="eyebrow">{homepage.whySection.eyebrow}</p>
            <h2>{homepage.whySection.heading}</h2>
            <p className="why-intro">{homepage.whySection.introduction}</p>
            <div className="why-points">
              {homepage.whySection.points.map((point, index) => (
                <div key={point}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{point}</p>
                </div>
              ))}
            </div>
            <Link className="text-link" href="/capabilities">
              Review our capabilities{" "}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}

      {visibility.process !== false &&
        homepage.constructionProcess.length > 0 && (
          <section className="process-section section-light">
            <SectionHeading
              number="03"
              eyebrow="Method"
              title="A controlled path from brief to handover."
              copy="Clear accountability at each stage keeps decisions, procurement and site execution aligned."
            />
            <div className="process-line">
              {homepage.constructionProcess.map((step, index) => (
                <Reveal className="process-step" key={step.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{step.title}</h3>
                </Reveal>
              ))}
            </div>
          </section>
        )}

      {visibility.sectors !== false && homepage.featuredSectors.length > 0 && (
        <section className="sectors-section section-copper">
          <div>
            <p className="eyebrow">Sectors served</p>
            <h2>Built for diverse operating environments.</h2>
          </div>
          <div className="sector-cloud">
            {homepage.featuredSectors.map((sector) => (
              <span key={sector}>{sector}</span>
            ))}
          </div>
        </section>
      )}

      {visibility.testimonials !== false && homepage.testimonial && (
        <section className="testimonial-section section-light">
          <p className="eyebrow">
            Client perspective
            {homepage.testimonial.isPlaceholder ? " / placeholder" : ""}
          </p>
          <blockquote>“{homepage.testimonial.text}”</blockquote>
          <p>— {homepage.testimonial.attribution}</p>
        </section>
      )}
    </main>
  );
}
