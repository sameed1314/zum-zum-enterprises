import {
  Building2,
  DraftingCompass,
  HardHat,
  House,
  Landmark,
  Mountain,
  Ruler,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export interface Service {
  number: string;
  title: string;
  description: string;
  capabilities: string[];
  icon: LucideIcon;
}

export const services: Service[] = [
  ["01", "General Construction", "End-to-end execution of buildings and civil works, coordinated from mobilisation through handover.", ["Site leadership", "Programme control", "Trade coordination"], Building2],
  ["02", "Civil Contracting", "Groundworks, reinforced concrete, site development, drainage, roads and retaining structures.", ["Earthworks", "Concrete works", "External development"], Mountain],
  ["03", "Turnkey Execution", "A single delivery structure covering planning, procurement, construction and closeout.", ["Procurement", "Package management", "Handover"], HardHat],
  ["04", "Residential Construction", "Climate-responsive homes built with close control of structure, envelope and finishing.", ["Private residences", "Multi-unit housing", "Premium finishes"], House],
  ["05", "Institutional & Government", "Specification-led execution for formal, stakeholder-rich projects.", ["Public buildings", "Education", "Healthcare"], Landmark],
  ["06", "Structural Works", "Reinforced-concrete and structural packages delivered through engineered sequences.", ["RCC frames", "Steel structures", "Structural repair"], Ruler],
  ["07", "Renovation & Fit-Out", "Controlled upgrades, repairs and interiors planned around retained fabric.", ["Restoration", "Interior fit-out", "Envelope upgrades"], DraftingCompass],
  ["08", "Project Management", "Planning, reporting, quality, safety and stakeholder coordination aligned to programme outcomes.", ["Cost tracking", "Quality controls", "Progress reporting"], ShieldCheck],
].map(([number, title, description, capabilities, icon]) => ({
  number,
  title,
  description,
  capabilities,
  icon,
})) as Service[];

export const sectors = [
  "Government",
  "Education",
  "Healthcare",
  "Hospitality",
  "Commercial",
  "Residential",
  "Industrial",
  "Public Infrastructure",
  "Community Buildings",
] as const;

export const processSteps = [
  "Consultation & requirements",
  "Site assessment",
  "Planning & estimation",
  "Design coordination",
  "Procurement & mobilisation",
  "Construction & execution",
  "Quality & safety inspections",
  "Handover & support",
] as const;

