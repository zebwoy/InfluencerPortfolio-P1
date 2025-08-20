"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef } from "react";

type Achievement = {
  id: string;
  date: string; // ISO string
  title: string;
  description: string;
};

export default function AchievementsPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });

  // Parallax transforms for layered hero elements
  const ySlow = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const yMed = useTransform(scrollYProgress, [0, 1], [0, 250]);
  const yFast = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  const achievements: Achievement[] = useMemo(
    () => [
      {
        id: "a-2025-01",
        date: "2025-01-20",
        title: "Shortlisted for Creators Summit 2025",
        description: "Recognized among the top emerging UGC creators in skincare and haircare niches.",
      },
      {
        id: "a-2024-11",
        date: "2024-11-02",
        title: "100K Total Content Views",
        description: "Crossed 100,000 organic views across brand campaigns and portfolio content.",
      },
      {
        id: "a-2024-08",
        date: "2024-08-16",
        title: "Featured Creator – ZeyaCare",
        description: "Featured for consistent quality and on-brand creative direction in personal care.",
      },
      {
        id: "a-2024-05",
        date: "2024-05-01",
        title: "10 Brand Collaborations",
        description: "Completed 10+ paid collaborations with high delivery satisfaction.",
      },
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    []
  );

  return (
    <div ref={containerRef} className="min-h-screen bg-black">
      {/* Hero with subtle parallax layers to match site theme */}
      <section className="relative overflow-hidden pt-28 pb-24 sm:pt-32 sm:pb-28 max-[350px]:pt-24 max-[350px]:pb-16">
        {/* Gradient accents */}
        <motion.div style={{ y: yFast, opacity: opacityFade }} className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 sm:w-[28rem] sm:h-[28rem] rounded-full bg-gradient-to-br from-purple-600/20 to-blue-500/10 blur-3xl" />
        <motion.div style={{ y: yMed, opacity: opacityFade }} className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 sm:w-[32rem] sm:h-[32rem] rounded-full bg-gradient-to-tr from-emerald-500/10 to-cyan-400/10 blur-3xl" />
        <motion.div style={{ y: ySlow, opacity: opacityFade }} className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_40%_at_50%_0%,rgba(255,255,255,0.05),transparent)]" />

        <div className="relative mx-auto max-w-5xl px-6 sm:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight max-[350px]:text-3xl">
            Achievements
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="mt-4 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto max-[350px]:text-sm">
            A timeline of milestones, recognitions, and moments that shaped the journey.
          </motion.p>
        </div>
      </section>

      {/* Timeline */}
      <section className="relative pb-24 sm:pb-32">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          {/* Single continuous line (responsive position) */}
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10 sm:left-1/2 sm:-translate-x-1/2 sm:w-[2px]" />

            <ul className="space-y-10 sm:space-y-16">
              {achievements.map((a, index) => {
                const isLeft = index % 2 === 0;
                return (
                  <li key={a.id} className="relative">
                    {/* Dot centered within the row */}
                    <span className="absolute top-1/2 left-4 sm:left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white" />

                    {/* Content grid: single column on mobile with left padding; two columns on desktop */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
                      {/* Left column (desktop) or single (mobile) */}
                      {isLeft ? (
                        <div className="pl-10 sm:pl-0 sm:pr-10">
                          <TimelineCard side="left" achievement={a} />
                        </div>
                      ) : (
                        <div className="hidden sm:block" />
                      )}

                      {/* Right column */}
                      {!isLeft ? (
                        <div className="pl-10 sm:pl-10">
                          <TimelineCard side="right" achievement={a} />
                        </div>
                      ) : (
                        <div className="hidden sm:block" />
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function TimelineCard({ side, achievement }: { side: "left" | "right"; achievement: Achievement }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.5 }}
      className={`relative bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-md`}
    >
      <time className="text-xs font-medium tracking-wide uppercase text-gray-400">
        {new Date(achievement.date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" })}
      </time>
      <h3 className="mt-2 text-lg sm:text-xl font-semibold text-white max-[350px]:text-base">{achievement.title}</h3>
      <p className="mt-2 text-sm sm:text-base text-gray-300 leading-relaxed max-[350px]:text-[13px]">{achievement.description}</p>
    </motion.article>
  );
}


