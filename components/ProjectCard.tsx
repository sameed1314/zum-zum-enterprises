import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Project } from "@/data/projects";

export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  return (
    <article className="project-card">
      <Link href={`/projects/${project.slug}`} aria-label={`View ${project.title}`}>
        <div className="project-image">
          <img src={project.coverImage} alt={`${project.title} placeholder project image`} width="1200" height="900" loading={priority ? "eager" : "lazy"} />
          <div className="project-card-index">0{project.displayOrder}</div>
          <span className="project-card-open"><ArrowUpRight aria-hidden="true" /></span>
        </div>
        <div className="project-card-content">
          <div><p>{project.category}</p><h3>{project.title}</h3></div>
          <dl>
            <div><dt>Location</dt><dd>{project.location}</dd></div>
            <div><dt>Status</dt><dd>{project.status}</dd></div>
          </dl>
        </div>
      </Link>
    </article>
  );
}

