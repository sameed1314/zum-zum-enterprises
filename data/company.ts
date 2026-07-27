export const company = {
  fullName: "Zum Zum Enterprises",
  shortName: "Zum Zum",
  tagline: "Engineered for the terrain. Built for the long term.",
  classification: "Class-A Construction Contractor",
  phone: "+91 [PHONE NUMBER]",
  phoneHref: "tel:+910000000000",
  whatsapp: "+91 [WHATSAPP NUMBER]",
  whatsappHref:
    "https://wa.me/910000000000?text=Hello%2C%20I%20would%20like%20to%20discuss%20a%20construction%20project%20with%20Zum%20Zum%20Enterprises.",
<<<<<<< HEAD
  email: "projects@zumzumenterprises.example",
  emailHref: "mailto:projects@zumzumenterprises.example",
=======
  email: "projects@zumzumenterprises.com",
  emailHref: "mailto:projects@zumzumenterprises.com",
>>>>>>> 4721fae (minor Fix)
  address: "[OFFICE ADDRESS], Jammu & Kashmir, India",
  mapsLink: "#",
  businessHours: "Monday–Saturday · 9:00–18:00",
  social: { instagram: "#", facebook: "#", linkedin: "#" },
  placeholders: {
    yearsExperience: "[XX]+",
    completedProjects: "[XX]+",
    professionals: "[XX]+",
    districtsServed: "[XX]",
    areaDelivered: "[XX]M",
    registrationNumber: "[CONTRACTOR REGISTRATION NUMBER]",
    gstNumber: "[GST NUMBER]",
    certifications: "[CERTIFICATIONS, IF APPLICABLE]",
  },
} as const;

export const navigation = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/quality-safety", label: "Quality & Safety" },
  { href: "/contact", label: "Contact" },
] as const;
