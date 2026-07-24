import type { Metadata } from "next";
import { ProjectFilter } from "@/components/Interactive";
import { PageHero } from "@/components/PageHero";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore residential, commercial, institutional, government and civil construction projects by Zum Zum Enterprises.",
};

export default function ProjectsPage() {
  return (
    <main id="main-content">
      <PageHero eyebrow="Projects" title="Work that carries its own evidence." intro="A structured project portfolio ready for Zum Zum Enterprises’ verified photographs, client-approved facts and completed-project records." image="/images/project-infrastructure.webp" />
      <section className="project-index-section">
        <ProjectFilter projects={projects} />
      </section>
    </main>
  );
}

