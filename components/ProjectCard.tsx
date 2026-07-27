import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ProjectCardData } from "@/src/lib/content-types";

const statusLabel = (status: ProjectCardData["status"]) =>
  status[0].toUpperCase() + status.slice(1);

export function ProjectCard({ project, priority = false }: { project: ProjectCardData; priority?: boolean }) {
  return (
    <article className="project-card">
      <Link href={`/projects/${project.slug}`} aria-label={`View ${project.title}`}>
        <div className="project-image">
          <Image
            src={project.coverImage.url}
            alt={project.coverImage.alt}
            width={1200}
            height={900}
            priority={priority}
            sizes="(max-width: 800px) 100vw, 50vw"
          />
          <div className="project-card-index">0{project.displayOrder}</div>
          <span className="project-card-open"><ArrowUpRight aria-hidden="true" /></span>
        </div>
        <div className="project-card-content">
          <div><p>{project.category}</p><h3>{project.title}</h3></div>
          <dl>
            <div><dt>Location</dt><dd>{project.location}</dd></div>
            <div><dt>Status</dt><dd>{statusLabel(project.status)}</dd></div>
          </dl>
        </div>
      </Link>
    </article>
  );
}
