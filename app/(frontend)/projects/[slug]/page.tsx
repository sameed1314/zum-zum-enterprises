import type { Metadata } from "next";
import { draftMode } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/ProjectCard";
import { RichTextContent } from "@/components/RichTextContent";
import {
  getProjectBySlug,
  getProjects,
  getSiteSettings,
} from "@/src/lib/queries";

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { isEnabled } = await draftMode();
  const [project, settings] = await Promise.all([
    getProjectBySlug(slug, isEnabled),
    getSiteSettings(),
  ]);
  if (!project) return { title: "Project not found" };
  return {
    title: project.seo?.title || project.title,
    description: project.seo?.description || project.shortSummary,
    alternates: {
      canonical:
        project.seo?.canonicalURL ||
        `${settings.productionURL}/projects/${project.slug}`,
    },
    robots:
      isEnabled || project.seo?.noIndex
        ? { index: false, follow: false }
        : undefined,
    openGraph: {
      title: project.seo?.title || project.title,
      description: project.seo?.description || project.shortSummary,
      images: [project.heroImage.url],
    },
  };
}

const label = (value: string) =>
  value
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { isEnabled } = await draftMode();
  const project = await getProjectBySlug(slug, isEnabled);
  if (!project) notFound();

  let related = project.relatedProjects;
  if (related.length === 0) {
    const projects = await getProjects();
    related = projects
      .filter(
        (item) =>
          item.slug !== project.slug && item.category === project.category,
      )
      .slice(0, 2);
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.shortSummary,
    locationCreated: project.location,
    image: project.heroImage.url,
  };

  return (
    <main id="main-content">
      {isEnabled && (
        <div className="preview-banner">
          Draft preview
          <a href={`/api/preview/exit?path=${encodeURIComponent(`/projects/${project.slug}`)}`}>
            Exit preview
          </a>
        </div>
      )}
      <section className="project-detail-hero">
        <Image
          src={project.heroImage.url}
          alt={project.heroImage.alt}
          width={1900}
          height={1300}
          priority
          sizes="100vw"
        />
        <div className="project-detail-shade" />
        <div className="project-detail-title">
          <p className="eyebrow">
            {project.category} / {project.location}
          </p>
          <h1>{project.title}</h1>
        </div>
      </section>
      <dl className="project-meta">
        {project.location && <div><dt>Location</dt><dd>{project.location}</dd></div>}
        {project.clientType && <div><dt>Client</dt><dd>{project.clientType}</dd></div>}
        {project.year && <div><dt>Year</dt><dd>{project.year}</dd></div>}
        <div><dt>Status</dt><dd>{label(project.status)}</dd></div>
        {project.builtUpArea && <div><dt>Area</dt><dd>{project.builtUpArea}</dd></div>}
        {project.contractType && <div><dt>Contract</dt><dd>{project.contractType}</dd></div>}
      </dl>
      <section className="project-story">
        <h2>Project overview</h2>
        <div>
          <p className="project-story-lead">{project.shortSummary}</p>
          <RichTextContent data={project.overview} />
          <div className="project-story-grid">
            {(project.scopeOfWork || project.executionResponsibilities) && (
              <div>
                {project.scopeOfWork && <><h3>Scope</h3><p>{project.scopeOfWork}</p></>}
                {project.executionResponsibilities && <><h3>Responsibilities</h3><p>{project.executionResponsibilities}</p></>}
              </div>
            )}
            {(project.challenge || project.executionApproach) && (
              <div>
                {project.challenge && <><h3>Challenges</h3><RichTextContent data={project.challenge} /></>}
                {project.executionApproach && <><h3>Execution approach</h3><RichTextContent data={project.executionApproach} /></>}
              </div>
            )}
            {project.services.length > 0 && (
              <div>
                <h3>Services</h3>
                <ul>{project.services.map((service) => <li key={service}>{service}</li>)}</ul>
              </div>
            )}
            {project.materials.length > 0 && (
              <div>
                <h3>Materials</h3>
                <ul>{project.materials.map((material) => <li key={material}>{material}</li>)}</ul>
              </div>
            )}
          </div>
          {project.outcome && <div className="project-outcome"><h3>Outcome</h3><RichTextContent data={project.outcome} /></div>}
        </div>
      </section>
      {project.gallery.length > 0 && (
        <section className="project-gallery">
          {project.gallery.map((image, index) => (
            <figure key={`${image.url}-${index}`}>
              <Image
                src={image.url}
                alt={image.alt}
                width={1400}
                height={1000}
                sizes="(max-width: 800px) 100vw, 50vw"
              />
              {image.caption && <figcaption>{image.caption}</figcaption>}
            </figure>
          ))}
        </section>
      )}
      {related.length > 0 && (
        <section className="content-section">
          <div className="editorial-grid">
            <aside>Related work</aside>
            <div className="project-grid">
              {related.map((item) => (
                <ProjectCard key={item.slug} project={item} />
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="project-next">
        <p>Have a project with similar requirements?</p>
        <Link
          className="button button-copper"
          href={`/contact?project=${encodeURIComponent(project.title)}`}
        >
          Discuss the brief
        </Link>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  );
}
