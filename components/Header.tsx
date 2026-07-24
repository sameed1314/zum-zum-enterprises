"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { company, navigation } from "@/data/company";

export function Header() {
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
        <Link className="wordmark" href="/" aria-label="Zum Zum Enterprises home">
          <span className="wordmark-mark">ZZ</span>
          <span><strong>Zum Zum</strong><small>Enterprises</small></span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
        </nav>
        <div className="header-actions">
          <Link className="button button-copper header-cta" href="/contact">
            Start a project <ArrowUpRight size={17} aria-hidden="true" />
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
              {navigation.map((item, index) => (
                <motion.div key={item.href} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + index * 0.045 }}>
                  <Link href={item.href} onClick={() => setOpen(false)}><span>0{index + 1}</span>{item.label}</Link>
                </motion.div>
              ))}
            </nav>
            <div className="mobile-menu-contact">
              <p>{company.classification}</p>
              <a href={company.emailHref}>{company.email}</a>
              <a href={company.phoneHref}>{company.phone}</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

