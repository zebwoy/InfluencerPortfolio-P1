"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PortfolioGrid from "./PortfolioGrid";

export interface PortfolioItem {
  id: string;
  type: "image" | "video";
  src: string;
  thumb?: string;
  createdAt: string;
}

export default function ClientPortfolio() {
  const [items, setItems] = useState<PortfolioItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [initialItemId, setInitialItemId] = useState<string | null>(null);
  const [uiPreset, setUiPreset] = useState<"compact" | "detailed">("detailed");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const itemParam = urlParams.get('item');
    if (itemParam) {
      setInitialItemId(itemParam);
      window.history.replaceState(null, '', '/portfolio');
    }

    async function loadPortfolio() {
      try {
        const response = await fetch("/api/portfolio", { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          setItems(data.items || []);
        } else {
          throw new Error("Failed to load portfolio");
        }
      } catch (err) {
        console.error("Error loading portfolio:", err);
        setError("Failed to load portfolio items");
        setItems([]);
      }
    }
    loadPortfolio();
  }, []);

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Try again
          </button>
        </div>
      </motion.div>
    );
  }

  if (!items) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center py-20"
      >
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gray-100">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
          </div>
          <p className="text-lg text-gray-600 font-medium">Loading portfolio...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we fetch your creative work</p>
        </div>
      </motion.div>
    );
  }

  if (items.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No portfolio items yet</h3>
          <p className="text-gray-600 mb-6">
            Your portfolio is empty. Start by uploading some amazing work through the admin panel.
          </p>
          <div className="flex justify-center space-x-3">
            <a 
              href="/admin"
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Go to Admin
            </a>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      {/* Controls */}
      <div className="mb-6 flex items-center justify-end gap-2 px-1">
        <div className="inline-flex rounded-xl border border-gray-200 overflow-hidden bg-white/70 backdrop-blur-sm">
          <button
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${uiPreset === "compact" ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"}`}
            onClick={() => setUiPreset("compact")}
          >
            Compact
          </button>
          <button
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${uiPreset === "detailed" ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"}`}
            onClick={() => setUiPreset("detailed")}
          >
            Detailed
          </button>
        </div>
      </div>

      <PortfolioGrid items={items} initialItemId={initialItemId} uiPreset={uiPreset} />
      
      {/* Portfolio Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-16 text-center px-4"
      >
        <div className="inline-flex items-center space-x-4 sm:space-x-6 lg:space-x-8 px-4 sm:px-6 lg:px-8 py-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{items.length}</div>
            <div className="text-sm text-gray-600">Total Items</div>
          </div>
          
          <div className="w-px h-8 bg-gray-200"></div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {items.filter(item => item.type === "image").length}
            </div>
            <div className="text-sm text-gray-600">Images</div>
          </div>
          
          <div className="w-px h-8 bg-gray-200"></div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {items.filter(item => item.type === "video").length}
            </div>
            <div className="text-sm text-gray-600">Videos</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

