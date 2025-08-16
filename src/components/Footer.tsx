"use client";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";

export default function Footer() {
  const hidden = useHideOnScroll({ threshold: 6, minTop: 48 });
  return (
    <footer className={`fixed bottom-0 left-0 right-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-t border-black/5 transition-transform duration-200 ${hidden ? "translate-y-full" : "translate-y-0"}`}>
      <div className="mx-auto max-w-5xl px-6 sm:px-8 py-3">
        <div className="text-sm text-foreground/70 text-center">
          © {new Date().getFullYear()} Zeya. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

