"use client";

import { motion, useReducedMotion, useScroll } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div className={className} initial={reduceMotion ? false : { opacity: 0, y: 28 }} whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

export function ScrollTools() {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <>
      <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} />
      <button className={`back-to-top ${visible ? "is-visible" : ""}`} type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top">
        <ArrowUp size={18} aria-hidden="true" />
      </button>
    </>
  );
}

