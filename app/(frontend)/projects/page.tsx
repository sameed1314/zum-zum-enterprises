import type { Metadata } from "next";
import { ProjectFilter } from "@/components/Interactive";
import { PageHero } from "@/components/PageHero";
import {
  getProjectCategories,
  getProjects,
  getSiteSettings,
} from "@/src/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: "Projects",
    description:
      "Explore residential, commercial, institutional, government and civil construction projects by Zum Zum Enterprises.",
    alternates: { canonical: `${settings.productionURL}/projects` },
  };
}

export default async function ProjectsPage() {
  const [projects, categories] = await Promise.all([
    getProjects(),
    getProjectCategories(),
  ]);
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Projects"
        title="Work that carries its own evidence."
        intro="Explore published project records, execution details and approved project photography from across Jammu and Kashmir."
        image="/images/project-infrastructure.webp"
      />
      <section className="project-index-section">
        {projects.length > 0 ? (
          <ProjectFilter projects={projects} categories={categories} />
        ) : (
          <div className="empty-state">
            <p className="eyebrow">Portfolio update in progress</p>
            <h2>Published project records will appear here.</h2>
          </div>
        )}
      </section>
    </main>
  );
}
