"use client";

import { ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import type { ProjectCardData } from "@/src/lib/content-types";

export function ProjectFilter({
  projects,
  categories,
}: {
  projects: ProjectCardData[];
  categories: string[];
}) {
  const filters = useMemo(
    () => ["All", ...categories, "Completed", "Ongoing", "Upcoming"],
    [categories],
  );
  const [active, setActive] = useState("All");
  const visibleProjects = useMemo(() => {
    if (active === "All") return projects;
    if (["Completed", "Ongoing", "Upcoming"].includes(active)) {
      return projects.filter((project) => project.status === active.toLowerCase());
    }
    return projects.filter((project) => project.category === active);
  }, [active, projects]);
  return (
    <>
      <div className="filter-bar" aria-label="Filter projects">
        {filters.map((category) => <button key={category} type="button" aria-pressed={active === category} onClick={() => setActive(category)}>{category}</button>)}
      </div>
      <p className="filter-status" aria-live="polite">Showing {visibleProjects.length} project{visibleProjects.length === 1 ? "" : "s"}</p>
      <div className="project-grid">{visibleProjects.map((project) => <ProjectCard key={project.slug} project={project} />)}</div>
    </>
  );
}

type SubmissionState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; reference: string }
  | { status: "error"; message: string; fields?: Record<string, string[]> };

export function ContactForm({
  categories,
  supportingText,
  whatsappURL,
}: {
  categories: string[];
  supportingText?: string;
  whatsappURL: string;
}) {
  const [state, setState] = useState<SubmissionState>({ status: "idle" });

  if (state.status === "success") {
    return (
      <div className="contact-form form-success" role="status">
        <p className="eyebrow">Enquiry received</p>
        <h2>Thank you. Your reference is {state.reference}.</h2>
        <p>Your enquiry has been saved. The team can now review and follow it up.</p>
        <a className="button button-copper" href={whatsappURL} target="_blank" rel="noreferrer">
          Also continue on WhatsApp <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </div>
    );
  }

  return (
    <form className="contact-form" noValidate onSubmit={async (event) => {
      event.preventDefault();
      if (state.status === "submitting") return;
      setState({ status: "submitting" });
      const form = new FormData(event.currentTarget);
      const params = new URLSearchParams(window.location.search);
      const payload = Object.fromEntries(form.entries());
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...payload,
          consent: form.get("consent") === "on",
          sourcePage: window.location.pathname,
          referrer: document.referrer,
          utmSource: params.get("utm_source") || undefined,
          utmMedium: params.get("utm_medium") || undefined,
          utmCampaign: params.get("utm_campaign") || undefined,
          utmTerm: params.get("utm_term") || undefined,
          utmContent: params.get("utm_content") || undefined,
        }),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        reference?: string;
        message?: string;
        fields?: Record<string, string[]>;
      };
      if (!response.ok || !result.ok || !result.reference) {
        setState({
          status: "error",
          message: result.message || "We could not submit your enquiry. Please try again.",
          fields: result.fields,
        });
        return;
      }
      setState({ status: "success", reference: result.reference });
    }}>
      <div className="form-row">
        <label>Your name<input name="fullName" placeholder="Full name" autoComplete="name" required />{state.status === "error" && state.fields?.fullName && <span className="field-error">{state.fields.fullName[0]}</span>}</label>
        <label>Phone<input name="phone" placeholder="+91…" autoComplete="tel" required />{state.status === "error" && state.fields?.phone && <span className="field-error">{state.fields.phone[0]}</span>}</label>
      </div>
      <div className="form-row">
        <label>Email<input name="email" type="email" placeholder="you@example.com" autoComplete="email" /></label>
        <label>Organisation<input name="organisation" placeholder="Company / organisation" autoComplete="organization" /></label>
      </div>
      <div className="form-row">
        <label>Project type<select name="projectType" defaultValue={categories[0] || "Construction project"}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
        <label>Project location<input name="projectLocation" placeholder="District / city" /></label>
      </div>
      <div className="form-row">
        <label>Estimated budget<input name="estimatedBudget" placeholder="Optional" /></label>
        <label>Expected start date<input name="expectedStartDate" type="date" /></label>
      </div>
      <label>Brief<textarea name="message" rows={5} minLength={20} placeholder="Tell us about the project, scope, timing and current stage." required />{state.status === "error" && state.fields?.message && <span className="field-error">{state.fields.message[0]}</span>}</label>
      <label className="consent-field"><span><input name="consent" type="checkbox" required /> I consent to Zum Zum Enterprises using these details to respond to this enquiry.</span></label>
      <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      {state.status === "error" && <p className="form-error" role="alert">{state.message}</p>}
      <div className="form-submit-row">
        <p>{supportingText || "Your details are used only to review and respond to this enquiry."}</p>
        <button className="button button-copper" type="submit" disabled={state.status === "submitting"}>{state.status === "submitting" ? "Submitting…" : "Send enquiry"} <ArrowUpRight size={18} aria-hidden="true" /></button>
      </div>
      <a className="email-fallback" href={whatsappURL} target="_blank" rel="noreferrer">Prefer WhatsApp? Continue there instead</a>
    </form>
  );
}
