import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { company, navigation } from "@/data/company";
import { services } from "@/data/services";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-lead">
        <p className="eyebrow">Build with us</p>
        <h2>Planning a project in Jammu &amp; Kashmir?</h2>
        <Link className="button button-copper" href="/contact">Request a consultation <ArrowUpRight size={18} aria-hidden="true" /></Link>
      </div>
      <div className="footer-grid">
        <div>
          <div className="footer-wordmark">ZUM ZUM</div>
          <p>Disciplined construction delivery across residential, commercial, institutional and civil infrastructure projects.</p>
          <span className="classification">{company.classification}</span>
        </div>
        <div><h3>Navigate</h3>{navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</div>
        <div><h3>Services</h3>{services.slice(0, 6).map((service) => <Link key={service.number} href="/services">{service.title}</Link>)}</div>
        <div>
          <h3>Contact</h3>
          <a href={company.phoneHref}>{company.phone}</a>
          <a href={company.emailHref}>{company.email}</a>
          <a href={company.whatsappHref} target="_blank" rel="noreferrer">WhatsApp <ArrowUpRight size={14} aria-hidden="true" /></a>
          <p>{company.address}</p><p>{company.businessHours}</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Zum Zum Enterprises</span>
        <span>Registration and GST details pending confirmation</span>
        <Link href="/quality-safety">Quality &amp; Safety</Link>
      </div>
    </footer>
  );
}

