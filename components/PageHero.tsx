import Image from "next/image";
import Link from "next/link";

export function PageHero({ eyebrow, title, intro, image = "/images/hero-kashmir-construction.webp" }: { eyebrow: string; title: string; intro: string; image?: string }) {
  return (
    <section className="page-hero">
      <Image src={image} alt="" width={1800} height={1100} priority sizes="100vw" />
      <div className="page-hero-overlay" />
      <div className="page-hero-content"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{intro}</p></div>
      <div className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>{eyebrow}</span></div>
    </section>
  );
}
