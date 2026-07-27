import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { RichTextContent } from "@/components/RichTextContent";
import { getAboutPage, getSiteSettings } from "@/src/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([
    getAboutPage(),
    getSiteSettings(),
  ]);
  return {
    title: page.seo?.title || "About",
    description: page.seo?.description || page.hero.introduction,
    alternates: {
      canonical: page.seo?.canonicalURL || `${settings.productionURL}/about`,
    },
    robots: page.seo?.noIndex ? { index: false, follow: false } : undefined,
  };
}

export default async function AboutPage() {
  const page = await getAboutPage();
  return (
    <main id="main-content">
      <PageHero
        eyebrow={page.hero.eyebrow}
        title={page.hero.heading}
        intro={page.hero.introduction}
        image={page.hero.image?.url}
      />
      <section className="content-section">
        <div className="editorial-grid">
          <aside>01 / Company</aside>
          <div>
            <h2>Serious delivery for demanding projects.</h2>
            <RichTextContent
              className="lead-copy"
              data={page.companyIntroduction}
            />
          </div>
        </div>
      </section>
      <section className="split-content">
        <div className="split-content-image">
          <Image
            src="/images/project-residence.webp"
            alt="Contemporary stone residence in Kashmir"
            width={1400}
            height={1050}
            sizes="(max-width: 800px) 100vw, 50vw"
          />
        </div>
        <div className="split-content-copy">
          <p className="eyebrow">Execution philosophy</p>
          <h2>Plan with precision. Build with control.</h2>
          {page.history ? (
            <RichTextContent data={page.history} />
          ) : (
            <p>
              Zum Zum Enterprises approaches every assignment as a coordinated
              system: requirements, site realities, design information,
              procurement, sequencing, quality, safety and handover must move
              together.
            </p>
          )}
        </div>
      </section>
      <section className="content-section">
        <div className="editorial-grid">
          <aside>02 / Mission &amp; vision</aside>
          <div>
            <h2>Useful buildings. Durable outcomes.</h2>
            <div className="lead-copy">
              {page.mission && <><strong>Mission</strong><RichTextContent data={page.mission} /></>}
              {page.vision && <><strong>Vision</strong><RichTextContent data={page.vision} /></>}
            </div>
          </div>
        </div>
        {page.values.length > 0 && (
          <div className="values-grid">
            {page.values.map(({ title, description }, index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        )}
      </section>
      {page.leadershipContent && (
        <section className="content-section section-dark">
          <div className="editorial-grid">
            <aside>03 / People</aside>
            <div>
              <h2>Leadership close to the work.</h2>
              <RichTextContent
                className="lead-copy light-copy"
                data={page.leadershipContent}
              />
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
