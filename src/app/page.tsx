"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import SocialIcons from "@/components/SocialIcons";

export default function Home() {
  return (
    <section className="min-h-[70vh] grid place-items-center px-2">
      <div className="flex flex-col items-center text-center gap-6 max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="rounded-full overflow-hidden w-24 h-24 sm:w-28 sm:h-28 border border-black/10"
        >
          <Image
            src="/portrait.svg"
            alt="Portrait"
            width={112}
            height={112}
            className="object-cover w-full h-full"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-xl sm:text-3xl tracking-tight px-2"
        >
          Skin &amp; Hair Care Enthusiast sharing real tips
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-pretty text-sm sm:text-base text-foreground/70 px-4"
        >
          Micro-level UGC creator. Minimal, honest &amp; helpful content.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <SocialIcons size={22} />
        </motion.div>
      </div>
    </section>
  );
}
