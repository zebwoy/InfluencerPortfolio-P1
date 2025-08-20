"use client";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <section className="max-w-2xl space-y-4 leading-relaxed lg:py-10">
      <motion.h1 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        About
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 0.5 }}>
        I&apos;m Zeya, a skin and Hair Care enthusiast who creates honest, everyday
        User‑Generated Content. My focus is practicality: how routines feel, how
        real skin responds, and sharing what actually helps.
      </motion.p>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
        I don&apos;t sell products or do paid placements. I keep my work minimal and
        transparent so the content can speak for itself. If you enjoy simple,
        useful tips and calm visuals, you&apos;re in the right place.
      </motion.p>
    </section>
  );
}

