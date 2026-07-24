"use client";

import { ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { company } from "@/data/company";
import { projectCategories, type Project } from "@/data/projects";

export function ProjectFilter({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<(typeof projectCategories)[number]>("All");
  const visibleProjects = useMemo(() => {
    if (active === "All") return projects;
    if (active === "Completed" || active === "Ongoing") return projects.filter((project) => project.status === active);
    return projects.filter((project) => project.category === active);
  }, [active, projects]);
  return (
    <>
      <div className="filter-bar" aria-label="Filter projects">
        {projectCategories.map((category) => <button key={category} type="button" aria-pressed={active === category} onClick={() => setActive(category)}>{category}</button>)}
      </div>
      <p className="filter-status" aria-live="polite">Showing {visibleProjects.length} project{visibleProjects.length === 1 ? "" : "s"}</p>
      <div className="project-grid">{visibleProjects.map((project) => <ProjectCard key={project.slug} project={project} />)}</div>
    </>
  );
}

export function ContactForm() {
  const [name, setName] = useState("");
  const [type, setType] = useState("Construction project");
  const [location, setLocation] = useState("");
  return (
    <form className="contact-form" onSubmit={(event) => {
      event.preventDefault();
      const message = `Hello, I am ${name || "[Name]"}. I would like to discuss a ${type.toLowerCase()}${location ? ` in ${location}` : ""} with Zum Zum Enterprises.`;
      window.open(`https://wa.me/910000000000?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    }}>
      <div className="form-row">
        <label>Your name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name" required /></label>
        <label>Phone or email<input placeholder="How should we reach you?" required /></label>
      </div>
      <div className="form-row">
        <label>Project type<select value={type} onChange={(event) => setType(event.target.value)}><option>Construction project</option><option>Government / institutional project</option><option>Residential project</option><option>Commercial project</option><option>Renovation / restoration</option><option>Civil infrastructure</option></select></label>
        <label>Project location<input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="District / city" /></label>
      </div>
      <label>Brief<textarea rows={5} placeholder="Tell us about the project, scope, timing and current stage." /></label>
      <div className="form-submit-row">
        <p>This static form prepares a WhatsApp enquiry. Replace the placeholder number in <code>data/company.ts</code> before launch.</p>
        <button className="button button-copper" type="submit">Continue on WhatsApp <ArrowUpRight size={18} aria-hidden="true" /></button>
      </div>
      <a className="email-fallback" href={company.emailHref}>Prefer email? Write to {company.email}</a>
    </form>
  );
}

