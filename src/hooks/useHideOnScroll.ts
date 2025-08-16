"use client";
import { useEffect, useRef, useState } from "react";

export function useHideOnScroll({ threshold = 8, minTop = 48 }: { threshold?: number; minTop?: number } = {}) {
  const prevY = useRef(0);
  const ticking = useRef(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    prevY.current = window.scrollY || 0;

    function onScroll() {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const delta = y - prevY.current;
        const abs = Math.abs(delta);

        if (y <= minTop) {
          setHidden(false);
        } else if (abs > threshold) {
          setHidden(delta > 0); // hide on scroll down
        }

        prevY.current = y;
        ticking.current = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold, minTop]);

  return hidden;
}

