"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useMemo, useState } from "react";

export type UGCItem = {
  id: string;
  type: "image" | "video";
  src: string;
  platform: "Instagram" | "YouTube";
  caption?: string;
  thumb?: string;
  shareUrl?: string;
  initialLikes?: number;
};

type Props = {
  items: UGCItem[];
};

export default function UGCGrid({ items }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {items.map((item, index) => (
        <motion.article
          id={item.id}
          key={item.id}
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.4, delay: index * 0.04 }}
          className="group rounded-lg overflow-hidden border border-black/5"
        >
          <div className="relative aspect-[4/5] bg-black/5">
            {item.type === "image" ? (
              <Image
                src={item.src}
                alt={item.caption ?? "UGC"}
                fill
                className="object-cover"
              />
            ) : (
              <VideoCard src={item.src} poster={item.thumb} />
            )}
          </div>
          <ActionBar item={item} />
        </motion.article>
      ))}
    </div>
  );
}

function VideoCard({ src, poster }: { src: string; poster?: string }) {
  return (
    <video
      controls
      playsInline
      preload="metadata"
      className="w-full h-full object-cover"
      poster={poster}
    >
      <source src={src} />
    </video>
  );
}

function ActionBar({ item }: { item: UGCItem }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState<number>(() => {
    // Persist likes locally to work on static hosts
    try {
      const key = `likes:${item.id}`;
      const saved = localStorage.getItem(key);
      return saved ? Number(saved) : item.initialLikes ?? 0;
    } catch { return item.initialLikes ?? 0; }
  });
  const shareHref = useMemo(() => {
    if (item.shareUrl) return item.shareUrl;
    if (typeof window !== "undefined") {
      return `${window.location.origin}/portfolio#${item.id}`;
    }
    return `#${item.id}`;
  }, [item.shareUrl, item.id]);

  async function onShare() {
    const shareData: ShareData = {
      title: item.caption ?? "UGC",
      text: item.caption ?? "UGC",
      url: shareHref,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
    } catch {}
    try {
      await navigator.clipboard.writeText(shareHref);
      alert("Link copied");
    } catch {
      window.open(shareHref, "_blank");
    }
  }

  function toggleLike() {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikes((n) => {
      const next = nextLiked ? n + 1 : Math.max(0, n - 1);
      try { localStorage.setItem(`likes:${item.id}`, String(next)); } catch {}
      // Try backend if available (non-static deployments)
      fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, delta: nextLiked ? 1 : -1 }),
      }).catch(() => {});
      return next;
    });
  }

  return (
    <div className="p-3 text-sm grid gap-2">
      <div className="grid grid-cols-1 gap-1 sm:flex sm:items-center sm:justify-between">
        <span className="text-foreground/60 order-2 sm:order-none">{item.platform}</span>
        {item.caption && (
          <span className="line-clamp-2 sm:line-clamp-1 text-foreground/80 order-1 sm:order-none">{item.caption}</span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleLike}
          className="inline-flex items-center gap-1 rounded-md border border-black/10 px-2 py-1 hover:bg-black/5"
          aria-pressed={liked}
          aria-label="Like"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} xmlns="http://www.w3.org/2000/svg" className="text-foreground">
            <path d="M12 21s-6.7-4.3-9.1-7.5C.5 10.8 2 7 5.3 6.2 7 5.8 8.9 6.3 10 8c1.1-1.7 3-2.2 4.7-1.8 3.3.8 4.8 4.6 2.4 7.3C18.7 16.7 12 21 12 21Z" stroke="currentColor"/>
          </svg>
          <span className="text-xs">{likes}</span>
        </button>
        <button
          type="button"
          onClick={onShare}
          className="inline-flex items-center gap-1 rounded-md border border-black/10 px-2 py-1 hover:bg-black/5"
          aria-label="Share"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-foreground">
            <path d="M7 12l10-6v12L7 12Z" fill="currentColor"/>
          </svg>
          <span className="text-xs">Share</span>
        </button>
      </div>
    </div>
  );
}

