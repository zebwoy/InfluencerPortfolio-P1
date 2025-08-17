"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaHeart, FaRegHeart, FaShareAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { PortfolioItem } from "./ClientPortfolio";

interface Props {
  items: PortfolioItem[];
  initialItemId?: string | null;
  uiPreset?: "compact" | "detailed";
}

export default function PortfolioGrid({ items, initialItemId, uiPreset = "detailed" }: Props) {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check for initialItemId or hash in URL to open specific item
  useEffect(() => {
    if (initialItemId) {
      const item = items.find(item => item.id === initialItemId);
      if (item) {
        setSelectedItem(item);
        setIsModalOpen(true);
      }
    } else {
      // Check for hash in URL as fallback
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const item = items.find(item => item.id === hash);
        if (item) {
          setSelectedItem(item);
          setIsModalOpen(true);
          // Remove hash from URL but keep the item open
          window.history.replaceState(null, '', '/portfolio');
        }
      }
    }
  }, [items, initialItemId]);

  const openItemModal = (item: PortfolioItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeItemModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
        {items.map((item, index) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100/50 backdrop-blur-sm cursor-pointer"
            onClick={() => openItemModal(item)}
          >
            {/* Media Container */}
            <div className="relative aspect-[4/5] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
              {item.type === "image" ? (
                <Image
                  src={item.src}
                  alt="Portfolio item"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={index < 4}
                />
              ) : (
                <VideoCard src={item.src} poster={item.thumb} />
              )}
              
              {/* Overlay gradient on hover (non-interactive) */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Type badge */}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md ${
                  item.type === "image" 
                    ? "bg-blue-500/90 text-white shadow-lg" 
                    : "bg-purple-500/90 text-white shadow-lg"
                }`}>
                  {item.type}
                </span>
              </div>
            </div>
            
            {/* Action Buttons Section */}
            <div className="p-4 bg-gray-900/80 backdrop-blur-sm border-t border-gray-800/50">
              <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
                {/* Like Button */}
                <LikeButton itemId={item.id} uiPreset={uiPreset} />
                {/* Share Button */}
                <ShareButton itemId={item.id} item={item} uiPreset={uiPreset} />
                {/* More (overflow) */}
                <div className="col-span-2">
                  <MoreActions item={item} />
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Item Modal */}
      <AnimatePresence>
        {isModalOpen && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm"
            onClick={closeItemModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-[min(95vw,1200px)] max-h-[92vh] md:max-h-[90vh] bg-white rounded-lg sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeItemModal}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-200 backdrop-blur-sm"
              >
                <IoClose size={16} className="sm:w-5 sm:h-5" />
              </button>

              {/* Media Content */}
              <div className="relative w-full bg-gray-900 h-[58vh] md:h-[62vh] lg:h-[68vh]">
                {selectedItem.type === "image" ? (
                  <Image
                    src={selectedItem.src}
                    alt="Portfolio item"
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 80vw"
                  />
                ) : (
                  <video
                    src={selectedItem.src}
                    className="w-full h-full object-contain select-none"
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                    controlsList="nodownload nofullscreen noremoteplayback"
                    disablePictureInPicture
                    onContextMenu={(e) => e.preventDefault()}
                    style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none' }}
                  />
                )}
              </div>

              {/* Item Info */}
              <div className="p-3 sm:p-5 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <div>
                    <span className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium ${
                      selectedItem.type === "image" 
                        ? "bg-blue-100 text-blue-800" 
                        : "bg-purple-100 text-purple-800"
                    }`}>
                      {selectedItem.type}
                    </span>
                    <p className="text-xs sm:text-sm text-gray-500 mt-2">
                      Added on {new Date(selectedItem.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {/* Action Buttons in Modal */}
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <LikeButton itemId={selectedItem.id} />
                    <ShareButton itemId={selectedItem.id} item={selectedItem} />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MoreActions({ item }: { item: PortfolioItem }) {
  return (
    <div className="w-full flex items-center justify-center gap-3 px-3 py-2 text-gray-300">
      <button
        className="px-3 py-2 rounded-lg bg-gray-800/80 hover:bg-gray-700 border border-gray-700 text-sm font-medium"
        onClick={(e) => {
          e.stopPropagation();
          const url = `${window.location.origin}/portfolio?item=${item.id}`;
          navigator.clipboard.writeText(url).catch(() => {});
        }}
      >
        Copy Link
      </button>
      <a
        href={item.src}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-2 rounded-lg bg-gray-800/80 hover:bg-gray-700 border border-gray-700 text-sm font-medium"
        onClick={(e) => e.stopPropagation()}
      >
        Open Source
      </a>
    </div>
  );
}

function VideoCard({ src, poster }: { src: string; poster?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (!isReady) {
        console.log(`Video not ready for ${src}, attempting to load...`);
        videoRef.current.load();
        return;
      }
      if (videoRef.current.paused) {
        console.log(`Attempting to play video: ${src}`);
        videoRef.current.play().catch(error => console.error(`Failed to play video ${src}:`, error));
      } else {
        console.log(`Attempting to pause video: ${src}`);
        videoRef.current.pause();
      }
    }
  }, [isReady, src]);

  // Handle hover play/pause for desktop
  const handleMouseEnter = useCallback(() => {
    if (videoRef.current && isReady && videoRef.current.paused) {
      setIsHovering(true);
      videoRef.current.play().catch(error => console.error(`Failed to play video ${src}:`, error));
    }
  }, [isReady, src]);

  const handleMouseLeave = useCallback(() => {
    if (videoRef.current && isReady && !videoRef.current.paused) {
      setIsHovering(false);
      videoRef.current.pause();
    }
  }, [isReady]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsReady(true);
      setIsBuffering(false);
    };
    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);
    const handlePause = () => setIsBuffering(false);

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("pause", handlePause);

    if (video.readyState >= 3) {
      setIsReady(true);
    }

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("pause", handlePause);
    };
  }, [src]);

  return (
    <div 
      className="relative w-full h-full" 
      onClick={togglePlay}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out cursor-pointer select-none"
        muted={true}
        loop
        playsInline
        preload="auto"
        controlsList="nodownload nofullscreen noremoteplayback"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
        style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none' }}
      />
      {!isReady && !isBuffering && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/50 text-white/90">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-white rounded-full animate-spin"></div>
        </div>
      )}
      {isBuffering && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/50 text-white/90">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-white rounded-full animate-spin"></div>
        </div>
      )}
      {/* Hover indicator for desktop */}
      {isHovering && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30 text-white/90">
          <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

function LikeButton({ itemId, uiPreset }: { itemId: string; uiPreset: "compact" | "detailed" }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const loadLikeData = useCallback(async () => {
    try {
      const response = await fetch(`/api/portfolio/${itemId}/likes`);
      if (response.ok) {
        const data = await response.json();
        setLikeCount(data.likeCount || 0);
        setIsLiked(data.isLiked || false);
      }
    } catch (error) {
      console.error("Failed to load like data:", error);
    }
  }, [itemId]);

  useEffect(() => {
    loadLikeData();
  }, [loadLikeData]);

  const handleLike = async () => {
    if (isPending) return;
    // Optimistic update for instant feedback
    const nextLiked = !isLiked;
    const prevLiked = isLiked;
    const prevCount = likeCount;
    const nextCount = nextLiked ? likeCount + 1 : Math.max(0, likeCount - 1);
    setIsLiked(nextLiked);
    setLikeCount(nextCount);
    setIsPending(true);

    try {
      const response = await fetch(`/api/portfolio/${itemId}/likes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: nextLiked ? "like" : "unlike" }),
      });
      if (!response.ok) {
        // Revert on failure
        setIsLiked(prevLiked);
        setLikeCount(prevCount);
      }
    } catch (error) {
      console.error("Failed to update like:", error);
      setIsLiked(prevLiked);
      setLikeCount(prevCount);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation(); // Prevent triggering the parent article click
        handleLike();
      }}
      disabled={isPending}
      className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 lg:px-6 lg:py-3.5 min-h-[44px] sm:min-h-[48px] lg:min-h-[52px] rounded-xl transition-all duration-300 btn-premium ${
        isLiked
          ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/25"
          : "bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600"
      } ${isPending ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
    >
      {isLiked ? (
        <FaHeart className="text-white" size={24} />
      ) : (
        <FaRegHeart className="text-gray-200" size={24} />
      )}
      <span className={`font-semibold ${uiPreset === "compact" ? "hidden sm:inline text-base lg:text-lg" : "text-sm sm:text-base lg:text-lg"}`}>{isLiked ? "Liked" : "Like"}</span>
      {likeCount > 0 && (
        <span className={`px-2 sm:px-2.5 py-1 rounded-lg font-bold ${uiPreset === "compact" ? "hidden sm:inline text-xs sm:text-sm" : "text-xs sm:text-sm"} ${
          isLiked ? "bg-white/25 text-white" : "bg-gray-600/90 text-gray-100"
        }`}>{likeCount}</span>
      )}
    </button>
  );
}

function ShareButton({ itemId, item, uiPreset }: { itemId: string; item: PortfolioItem; uiPreset: "compact" | "detailed" }) {
  const [isSharing, setIsSharing] = useState(false);
  const [message, setMessage] = useState("Share");
  const [shareCount, setShareCount] = useState<number | null>(null);

  useEffect(() => {
    const loadShares = async () => {
      try {
        const r = await fetch(`/api/portfolio/${itemId}/shares`);
        if (r.ok) {
          const data = await r.json();
          setShareCount(typeof data.shareCount === 'number' ? data.shareCount : 0);
        }
      } catch {}
    };
    loadShares();
  }, [itemId]);

  const handleShare = async () => {
    if (isSharing) return;
    setIsSharing(true);
    
    try {
      // Create a shareable URL that will open this specific item
      const shareUrl = `${window.location.origin}/portfolio?item=${itemId}`;
      const shareTitle = `Check out this amazing ${item.type} from my portfolio!`;
      const shareText = `I found this incredible piece that I think you'll love. Click to view it in full detail!`;

      const n = navigator as Navigator & {
        canShare?: (data?: { title?: string; text?: string; url?: string }) => boolean;
      };
      const canNative = typeof n.share === 'function' && typeof n.canShare === 'function' && n.canShare({ title: shareTitle, text: shareText, url: shareUrl });
      if (canNative) {
        // Use native sharing on mobile devices
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        setMessage("Shared!");
        setTimeout(() => setMessage("Share"), 2000);
        // Log share
        fetch(`/api/portfolio/${itemId}/shares`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ method: 'native' }) }).catch(() => {});
        setShareCount((c) => (c ?? 0) + 1);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        setMessage("Copied!");
        setTimeout(() => setMessage("Share"), 2000);
        
        // Show a toast notification
        showToast("Link copied to clipboard! Share this link to show the specific item.");
        // Log share
        fetch(`/api/portfolio/${itemId}/shares`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ method: 'copy' }) }).catch(() => {});
        setShareCount((c) => (c ?? 0) + 1);
      }
    } catch (error) {
      console.error("Share failed:", error);
      setMessage("Error!");
      setTimeout(() => setMessage("Share"), 2000);
    } finally {
      setIsSharing(false);
    }
  };

  const showToast = (message: string) => {
    // Create a simple toast notification
    const toast = document.createElement("div");
    toast.className = "fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg z-50";
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation(); // Prevent triggering the parent article click
        handleShare();
      }}
      disabled={isSharing}
      data-share={itemId}
      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 lg:px-6 lg:py-3.5 min-h-[44px] sm:min-h-[48px] lg:min-h-[52px] rounded-xl bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600 transition-all duration-300 btn-premium hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <FaShareAlt className="text-gray-200" size={22} />
      <span className={`font-semibold ${uiPreset === "compact" ? "hidden sm:inline text-base lg:text-lg" : "text-sm sm:text-base lg:text-lg"}`}>{message}</span>
      {shareCount !== null && (
        <span className={`px-2 sm:px-2.5 py-1 rounded-lg font-bold bg-gray-600/90 text-gray-100 ${uiPreset === "compact" ? "hidden sm:inline text-xs sm:text-sm" : "text-xs sm:text-sm"}`}>{shareCount}</span>
      )}
    </button>
  );
} 