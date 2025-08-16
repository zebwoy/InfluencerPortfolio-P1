"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const hidden = useHideOnScroll({ threshold: 6, minTop: 48 });
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b border-black/5 transition-transform duration-200 ${hidden ? "-translate-y-full" : "translate-y-0"}`}>
      <div className="relative mx-auto max-w-5xl px-6 sm:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="font-medium tracking-tight">Zeya</Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-6 text-sm">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`hover:text-foreground transition-colors ${active ? "text-foreground" : "text-foreground/70"}`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile toggle */}
        <button
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-md border border-black/10 hover:bg-black/5"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-foreground/80">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.nav
            key="mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-black/5"
          >
            <ul className="px-6 py-3 space-y-2 text-sm">
              {links.map((l) => {
                const active = pathname === l.href;
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={`block py-1 ${active ? "text-foreground" : "text-foreground/70"}`}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

