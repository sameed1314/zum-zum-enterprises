export function SectionHeading({ number, eyebrow, title, copy }: { number: string; eyebrow: string; title: string; copy?: string }) {
  return (
    <div className="section-heading">
      <div className="section-heading-meta"><span>{number}</span><p className="eyebrow">{eyebrow}</p></div>
      <div><h2>{title}</h2>{copy && <p>{copy}</p>}</div>
    </div>
  );
}

