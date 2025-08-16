"use client";
import Link from "next/link";
import { motion } from "framer-motion";

type Props = {
  size?: number;
  colorClassName?: string;
  className?: string;
};

export default function SocialIcons({
  size = 20,
  colorClassName = "text-foreground/80",
  className = "",
}: Props) {
  const iconClass = `${colorClassName} hover:text-foreground transition-colors`;
  const iconSize = { width: size, height: size };

  const item = {
    hidden: { opacity: 0, y: 4 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.ul
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.06 }}
      className={`flex items-center gap-4 ${className}`}
    >
      <motion.li variants={item}>
        <Link aria-label="Instagram" href="https://www.instagram.com/zeya__ugc/" target="_blank">
          <svg
            {...iconSize}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={iconClass}
          >
            <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor"/>
            <circle cx="12" cy="12" r="4" stroke="currentColor"/>
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
          </svg>
        </Link>
      </motion.li>
      
      {/* <motion.li variants={item}>
        <Link aria-label="YouTube" href="https://youtube.com" target="_blank">
          <svg
            {...iconSize}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={iconClass}
          >
            <rect x="2" y="6" width="20" height="12" rx="3" stroke="currentColor"/>
            <path d="M10 9v6l6-3-6-3Z" fill="currentColor"/>
          </svg>
        </Link>
      </motion.li> */}
      <motion.li variants={item}>
        <Link aria-label="Email" href="mailto:zsarfaraz80@gmail.com">
          <svg
            {...iconSize}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={iconClass}
          >
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor"/>
            <path d="M4 7l8 6 8-6" stroke="currentColor"/>
          </svg>
        </Link>
      </motion.li>
    </motion.ul>
  );
}

