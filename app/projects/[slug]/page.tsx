import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return { title: "Project not found" };
  return { title: project.title, description: project.summary };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const related = projects.filter((item) => item.slug !== project.slug && item.category === project.category).slice(0, 2);
  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    locationCreated: project.location,
  };
  return (
    <main id="main-content">
      <section className="project-detail-hero">
        <img src={project.coverImage} alt={`${project.title} placeholder project image`} width="1900" height="1300" />
        <div className="project-detail-shade" />
        <div className="project-detail-title"><p className="eyebrow">{project.category} / {project.location}</p><h1>{project.title}</h1></div>
      </section>
      <dl className="project-meta">
        <div><dt>Location</dt><dd>{project.location}</dd></div>
        <div><dt>Client</dt><dd>{project.clientType}</dd></div>
        <div><dt>Year</dt><dd>{project.year}</dd></div>
        <div><dt>Status</dt><dd>{project.status}</dd></div>
        <div><dt>Area</dt><dd>{project.area}</dd></div>
        <div><dt>Contract</dt><dd>{project.contractType}</dd></div>
      </dl>
      <section className="project-story">
        <h2>Project overview</h2>
        <div>
          <p className="project-story-lead">{project.summary}</p>
          <div className="project-story-grid">
            <div><h3>Context</h3><p>{project.description}</p><h3>Scope</h3><p>{project.scope}</p></div>
            <div><h3>Challenges</h3><p>{project.challenges}</p><h3>Execution approach</h3><p>{project.approach}</p></div>
            <div><h3>Services</h3><ul>{project.services.map((service) => <li key={service}>{service}</li>)}</ul></div>
            <div><h3>Materials</h3><ul>{project.materials.map((material) => <li key={material}>{material}</li>)}</ul></div>
          </div>
        </div>
      </section>
      <section className="project-gallery">{project.gallery.slice(0, 2).map((image, index) => <img key={`${image}-${index}`} src={image} alt={`${project.title} gallery placeholder ${index + 1}`} width="1400" height="1000" loading="lazy" />)}</section>
      {related.length > 0 && <section className="content-section"><div className="editorial-grid"><aside>Related work</aside><div className="project-grid">{related.map((item) => <ProjectCard key={item.slug} project={item} />)}</div></div></section>}
      <section className="project-next"><p>Have a project with similar requirements?</p><Link className="button button-copper" href="/contact">Discuss the brief</Link></section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </main>
  );
}

