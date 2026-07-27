"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { SiteSettingsData } from "@/src/lib/content-types";

export function Header({ settings }: { settings: SiteSettingsData }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <Link className="wordmark" href="/" aria-label={`${settings.fullCompanyName} home`}>
          <span className="wordmark-mark">ZZ</span>
          <span><strong>{settings.shortCompanyName}</strong><small>Enterprises</small></span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {settings.navigation.map((item) => <Link key={`${item.url}-${item.label}`} href={item.url} target={item.newTab ? "_blank" : undefined} rel={item.newTab ? "noreferrer" : undefined}>{item.label}</Link>)}
        </nav>
        <div className="header-actions">
          <Link className="button button-copper header-cta" href={settings.primaryCTA.url}>
            {settings.primaryCTA.label} <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
          <button className="menu-toggle" type="button" onClick={() => setOpen(true)} aria-label="Open navigation" aria-expanded={open}>
            <Menu aria-hidden="true" />
          </button>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div className="mobile-menu" initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}>
            <div className="mobile-menu-top">
              <span className="eyebrow">Navigate / Zum Zum</span>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close navigation"><X aria-hidden="true" /></button>
            </div>
            <nav aria-label="Mobile navigation">
              {settings.navigation.map((item, index) => (
                <motion.div key={`${item.url}-${item.label}`} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + index * 0.045 }}>
                  <Link href={item.url} target={item.newTab ? "_blank" : undefined} rel={item.newTab ? "noreferrer" : undefined} onClick={() => setOpen(false)}><span>0{index + 1}</span>{item.label}</Link>
                </motion.div>
              ))}
            </nav>
            <div className="mobile-menu-contact">
              <p>{settings.contractorClassification}</p>
              {settings.emailAddresses[0] && <a href={`mailto:${settings.emailAddresses[0].email}`}>{settings.emailAddresses[0].email}</a>}
              {settings.phoneNumbers[0] && <a href={`tel:${settings.phoneNumbers[0].number.replace(/[^\d+]/g, "")}`}>{settings.phoneNumbers[0].number}</a>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
