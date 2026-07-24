export type ProjectCategory =
  | "Institutional"
  | "Residential"
  | "Commercial"
  | "Government"
  | "Infrastructure"
  | "Renovation";

export interface Project {
  slug: string;
  title: string;
  location: string;
  category: ProjectCategory;
  year: string;
  status: "Completed" | "Ongoing";
  clientType: string;
  scope: string;
  area: string;
  contractType: string;
  duration: string;
  summary: string;
  description: string;
  challenges: string;
  approach: string;
  services: string[];
  materials: string[];
  coverImage: string;
  gallery: string[];
  featured: boolean;
  displayOrder: number;
}

const imagery = {
  institutional: "/images/hero-kashmir-construction.webp",
  residence: "/images/project-residence.webp",
  infrastructure: "/images/project-infrastructure.webp",
};

const common = {
  year: "[YEAR]",
  area: "[BUILT-UP AREA]",
  contractType: "[CONTRACT TYPE]",
  duration: "[PROJECT DURATION]",
  description:
    "This sample case study demonstrates the information structure. Replace it with verified project details and original photography before launch.",
};

export const projects: Project[] = [
  {
    ...common,
    slug: "institutional-complex-srinagar",
    title: "Institutional Complex",
    location: "Srinagar",
    category: "Institutional",
    status: "Completed",
    clientType: "Institutional client",
    scope: "Civil, structural and finishing works",
    summary: "A multi-block institutional development coordinated around active-site constraints and rigorous handover requirements.",
    challenges: "Sequenced access, seasonal weather and consistent finishing across multiple work fronts.",
    approach: "Package-based planning, material controls and progressive quality inspections.",
    services: ["General construction", "Site management", "Quality assurance"],
    materials: ["Reinforced concrete", "Local stone", "High-performance glazing"],
    coverImage: imagery.institutional,
    gallery: [imagery.institutional, imagery.residence, imagery.infrastructure],
    featured: true,
    displayOrder: 1,
  },
  {
    ...common,
    slug: "premium-residence-pulwama",
    title: "Premium Residence",
    location: "Pulwama",
    category: "Residential",
    status: "Completed",
    clientType: "Private residential client",
    scope: "Turnkey shell, envelope and interior coordination",
    contractType: "Turnkey",
    summary: "A contemporary mountain residence combining disciplined structural work with finely controlled material junctions.",
    challenges: "Thermal performance, precise stone detailing and bespoke package coordination.",
    approach: "Early mock-ups, protected storage and close structural, envelope and interior coordination.",
    services: ["Residential construction", "Turnkey execution", "Interior fit-out"],
    materials: ["Stone", "Walnut timber", "Glass", "Concrete"],
    coverImage: imagery.residence,
    gallery: [imagery.residence, imagery.institutional, imagery.infrastructure],
    featured: true,
    displayOrder: 2,
  },
  {
    ...common,
    slug: "civil-infrastructure-development",
    title: "Civil Infrastructure Development",
    location: "Jammu & Kashmir",
    category: "Infrastructure",
    status: "Ongoing",
    clientType: "Public-sector client",
    scope: "Roadworks, drainage and retaining structures",
    area: "Multi-location package",
    summary: "Civil works planned for complex terrain, restricted access and changing ground conditions.",
    challenges: "Mountain access, water management, slope stability and active-zone safety.",
    approach: "Phased mobilisation, survey-led sequencing and terrain-specific logistics planning.",
    services: ["Civil contracting", "Site development", "Project management"],
    materials: ["Reinforced concrete", "Structural steel", "Engineered fill"],
    coverImage: imagery.infrastructure,
    gallery: [imagery.infrastructure, imagery.institutional, imagery.residence],
    featured: true,
    displayOrder: 3,
  },
  {
    ...common,
    slug: "commercial-development-anantnag",
    title: "Commercial Development",
    location: "Anantnag",
    category: "Commercial",
    status: "Completed",
    clientType: "Private developer",
    scope: "Structure, façade and common-area finishes",
    summary: "A high-footfall commercial facility delivered through closely sequenced structural and finishing packages.",
    challenges: "Dense services coordination and concurrent finishing activities.",
    approach: "Zone-based planning and inspection-led package closeout.",
    services: ["Commercial construction", "Structural works", "Fit-out"],
    materials: ["Concrete", "Steel", "Stone"],
    coverImage: imagery.institutional,
    gallery: [imagery.institutional, imagery.infrastructure],
    featured: false,
    displayOrder: 4,
  },
  {
    ...common,
    slug: "government-administrative-building",
    title: "Administrative Building",
    location: "Central Kashmir",
    category: "Government",
    status: "Completed",
    clientType: "Government department",
    scope: "Civil construction and external development",
    summary: "A public building planned around specification compliance, durable materials and controlled documentation.",
    challenges: "Multi-stakeholder approvals and technical submittal coordination.",
    approach: "Milestone controls, approval registers and progressive handover.",
    services: ["Government projects", "Civil construction", "Documentation"],
    materials: ["Concrete", "Stone", "Metalwork"],
    coverImage: imagery.residence,
    gallery: [imagery.residence, imagery.institutional],
    featured: false,
    displayOrder: 5,
  },
  {
    ...common,
    slug: "hospitality-renovation-gulmarg",
    title: "Hospitality Renovation",
    location: "Gulmarg",
    category: "Renovation",
    status: "Completed",
    clientType: "Hospitality operator",
    scope: "Structural repair, envelope upgrades and interior renewal",
    summary: "A live-environment renovation balancing careful demolition, fabric protection and controlled finishing.",
    challenges: "Short working seasons and protection of retained elements.",
    approach: "Investigative surveys, sample approvals and phased area release.",
    services: ["Renovation", "Structural repair", "Interior fit-out"],
    materials: ["Stone", "Timber", "Insulation"],
    coverImage: imagery.infrastructure,
    gallery: [imagery.infrastructure, imagery.residence],
    featured: false,
    displayOrder: 6,
  },
  {
    ...common,
    slug: "education-building-south-kashmir",
    title: "Education Building",
    location: "South Kashmir",
    category: "Institutional",
    status: "Ongoing",
    clientType: "Education institution",
    scope: "Building construction and campus works",
    summary: "An adaptable learning environment with robust circulation, services coordination and long-life finishes.",
    challenges: "Programme interfaces and campus access.",
    approach: "Work-front planning and stakeholder coordination.",
    services: ["Institutional construction", "Site development"],
    materials: ["Concrete", "Brick", "Stone"],
    coverImage: imagery.institutional,
    gallery: [imagery.institutional, imagery.residence],
    featured: false,
    displayOrder: 7,
  },
  {
    ...common,
    slug: "mixed-use-structure-baramulla",
    title: "Mixed-Use Structure",
    location: "Baramulla",
    category: "Commercial",
    status: "Ongoing",
    clientType: "Private developer",
    scope: "Structural frame and core works",
    summary: "A concrete-frame development executed through repeatable cycles, dimensional control and active safety planning.",
    challenges: "Urban access and vertical logistics.",
    approach: "Cycle planning, hold-point inspections and logistics zoning.",
    services: ["Structural works", "Commercial construction"],
    materials: ["Reinforced concrete", "Steel"],
    coverImage: imagery.residence,
    gallery: [imagery.residence, imagery.infrastructure],
    featured: false,
    displayOrder: 8,
  },
];

export const featuredProjects = projects.filter((project) => project.featured);
export const projectCategories = [
  "All",
  "Residential",
  "Commercial",
  "Institutional",
  "Government",
  "Infrastructure",
  "Renovation",
  "Completed",
  "Ongoing",
] as const;

