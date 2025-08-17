"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface PortfolioItem {
  id: string;
  type: "image" | "video";
  src: string;
  thumb?: string;
  createdAt: string;
  likeCount?: number;
}

interface LikeRecord {
  timestamp: string;
  itemId: string;
  action: "like" | "unlike";
  ipAddress: string;
  userAgent: string;
  location?: string;
  country?: string;
  city?: string;
  timezone?: string;
  referrer?: string;
}

export default function AdminUploader() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [likesData, setLikesData] = useState<LikeRecord[]>([]);
  const [likesSummary, setLikesSummary] = useState<{ likesActive: number; likesForDeletedItems: number } | null>(null);
  const [topItems, setTopItems] = useState<Array<{ item_id: string; count: number; item_deleted: boolean }>>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "analytics">("upload");
  const [pastedUrl, setPastedUrl] = useState("");
  const [pastedType, setPastedType] = useState<"image" | "video">("video");
  const [isAddingUrl, setIsAddingUrl] = useState(false);

  useEffect(() => {
    loadPortfolioItems();
    loadLikesData();
  }, []);

  const loadPortfolioItems = async () => {
    try {
      const response = await fetch("/api/portfolio");
      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
      }
    } catch (error) {
      console.error("Failed to load portfolio items:", error);
    }
  };

  const loadLikesData = async () => {
    try {
      const response = await fetch("/api/admin/likes");
      if (response.ok) {
        type ApiRecent = { id: number; itemId: string; ipAddress: string; userAgent: string; createdAt: string; itemDeleted: boolean };
        type ApiSummary = { likesActive: number; likesForDeletedItems: number };
        type ApiTop = { item_id: string; count: number; item_deleted: boolean };
        const data: { summary: ApiSummary; topItems: ApiTop[]; recent: ApiRecent[] } = await response.json();
        setLikesSummary(data.summary);
        setTopItems(data.topItems || []);
        setLikesData((data.recent || []).map((r) => ({
          timestamp: r.createdAt,
          itemId: r.itemId,
          action: "like",
          ipAddress: r.ipAddress,
          userAgent: r.userAgent,
          location: "",
          country: "",
          city: "",
          timezone: "",
          referrer: "",
        })));
      }
    } catch (error) {
      console.error("Failed to load likes data:", error);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/portfolio/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        setUploadProgress(((i + 1) / selectedFiles.length) * 100);
      }

      // Reload portfolio items
      await loadPortfolioItems();
      setSelectedFiles([]);
      alert("Files uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await loadPortfolioItems();
        alert("Item deleted successfully!");
      } else {
        throw new Error("Failed to delete item");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Delete failed. Please try again.");
    }
  };

  const downloadLikesCSV = () => {
    const headers = "timestamp,itemId,action,ipAddress,userAgent,location,country,city,timezone,referrer\n";
    const csvContent = headers + likesData.map(like => 
      `${like.timestamp},${like.itemId},${like.action},${like.ipAddress},"${like.userAgent.replace(/"/g, '""')}",${like.location || ""},${like.country || ""},${like.city || ""},${like.timezone || ""},${like.referrer || ""}`
    ).join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "likes_analytics.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const addByUrl = async () => {
    if (!pastedUrl) return;
    setIsAddingUrl(true);
    try {
      const cleanUrl = pastedUrl.trim().replace(/^@+/, "");
      if (!/^https?:\/\//i.test(cleanUrl)) {
        throw new Error("Please paste a valid https URL");
      }
      const guessType: "image" | "video" = pastedType ?? (cleanUrl.match(/\.(mp4|webm|mov|m4v)(\?|$)/i) ? "video" : "image");
      const res = await fetch("/api/portfolio/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: cleanUrl, type: guessType })
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to save URL");
      }
      setPastedUrl("");
      await loadPortfolioItems();
      alert("Item added by URL!");
    } catch (e: unknown) {
      console.error(e);
      const message = e instanceof Error ? e.message : "Failed to add URL. Check it and try again.";
      alert(message);
    } finally {
      setIsAddingUrl(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl p-6 mb-6">
          <h1 className="text-2xl font-bold text-white mb-6">Portfolio Manager</h1>
          
          {/* Tab Navigation */}
          <div className="border-b border-gray-600 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("upload")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === "upload"
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-500"
                }`}
              >
                Upload Media
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === "analytics"
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-500"
                }`}
              >
                Likes Analytics
              </button>
            </nav>
          </div>

          {/* Upload Tab */}
          {activeTab === "upload" && (
            <>
              {/* Upload Section */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-200 mb-4">Upload Media</h2>
                
                {/* Drag & Drop Zone */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? "border-blue-400 bg-blue-500/10" : "border-gray-600"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="space-y-4">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div>
                      <p className="text-lg text-gray-300">
                        Drag and drop files here, or{" "}
                        <label className="text-blue-400 hover:text-blue-300 cursor-pointer transition-colors duration-200">
                          browse
                          <input
                            type="file"
                            multiple
                            accept="image/*,video/*"
                            className="hidden"
                            onChange={handleFileSelect}
                          />
                        </label>
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Supports images (JPG, PNG, GIF) and videos (MP4, WebM)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Paste Cloudinary URL */}
                <div className="mt-6 space-y-3">
                  <h3 className="text-md font-medium text-gray-200">Or add by Cloudinary URL</h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="url"
                      placeholder="https://res.cloudinary.com/.../upload/.../file.mp4"
                      value={pastedUrl}
                      onChange={(e) => setPastedUrl(e.target.value)}
                      className="flex-1 h-10 rounded-md border border-white/20 bg-transparent px-3 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
                    />
                    <select
                      value={pastedType}
                      onChange={(e) => setPastedType(e.target.value as "image" | "video")}
                      className="h-10 rounded-md border border-white/20 bg-transparent px-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-white/30"
                    >
                      <option value="video">video</option>
                      <option value="image">image</option>
                    </select>
                    <button
                      onClick={addByUrl}
                      disabled={isAddingUrl || !pastedUrl}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAddingUrl ? "Adding..." : "Add by URL"}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400">Use the secure Cloudinary URL (https://res.cloudinary.com/...). Large files should be uploaded to Cloudinary first, then pasted here.</p>
                </div>

                {/* Selected Files */}
                {selectedFiles.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-md font-medium text-gray-200 mb-3">Selected Files:</h3>
                    <div className="space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-700/50 p-3 rounded border border-gray-600">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-300">{file.name}</span>
                            <span className="text-xs text-gray-400">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-red-400 hover:text-red-300 text-sm transition-colors duration-200"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4">
                      <button
                        onClick={uploadFiles}
                        disabled={isUploading}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {isUploading ? "Uploading..." : `Upload ${selectedFiles.length} File${selectedFiles.length > 1 ? 's' : ''}`}
                      </button>
                    </div>

                    {/* Upload Progress */}
                    {isUploading && (
                      <div className="mt-4">
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-300 mt-2">
                          {Math.round(uploadProgress)}% Complete
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Portfolio Items */}
              <div>
                <h2 className="text-lg font-semibold text-gray-200 mb-4">Current Portfolio Items</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-gray-700/50 rounded-lg overflow-hidden border border-gray-600"
                      >
                        <div className="relative aspect-[4/5] bg-gray-600">
                          {item.type === "image" ? (
                            <Image
                              src={item.src}
                              alt="Portfolio item"
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          ) : (
                            <video
                              src={item.src}
                              className="w-full h-full object-cover"
                              muted
                              loop
                              onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                              onMouseLeave={(e) => (e.target as HTMLVideoElement).pause()}
                            />
                          )}
                          <div className="absolute top-2 right-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.type === "image" ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            }`}>
                              {item.type}
                            </span>
                          </div>
                        </div>
                        <div className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-400">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                            <button
                              onClick={() => deleteItem(item.id)}
                              className="text-red-400 hover:text-red-300 text-sm transition-colors duration-200"
                            >
                              Delete
                            </button>
                          </div>
                          {item.likeCount !== undefined && (
                            <div className="text-xs text-gray-300">
                              ❤️ {item.likeCount} likes
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                
                {items.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    No portfolio items yet. Upload some files to get started!
                  </div>
                )}
              </div>
            </>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
                  <div className="text-sm text-gray-400">Active Likes</div>
                  <div className="text-2xl text-gray-200 font-semibold">{likesSummary?.likesActive ?? 0}</div>
                </div>
                <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
                  <div className="text-sm text-gray-400">Likes For Deleted Items</div>
                  <div className="text-2xl text-gray-200 font-semibold">{likesSummary?.likesForDeletedItems ?? 0}</div>
                </div>
                <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
                  <div className="text-sm text-gray-400">Recent Likes (last 100)</div>
                  <div className="text-2xl text-gray-200 font-semibold">{likesData.length}</div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-200 mb-3">Top Items by Likes</h3>
              <div className="overflow-x-auto mb-8">
                <table className="min-w-full divide-y divide-gray-600">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Item ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Likes</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800/30 divide-y divide-gray-600">
                    {topItems.map((t) => (
                      <tr key={t.item_id}>
                        <td className="px-4 py-3 text-sm text-gray-200">{t.item_id}</td>
                        <td className="px-4 py-3 text-sm text-gray-200">{t.count}</td>
                        <td className="px-4 py-3 text-sm">
                          {t.item_deleted ? (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-500/20 text-red-300 border border-red-500/30">Deleted</span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-300 border border-green-500/30">Active</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-200">Recent Likes</h2>
                <button
                  onClick={downloadLikesCSV}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg hover:scale-[1.02] transition-all duration-200"
                >
                  Download CSV
                </button>
              </div>

              {likesData.length === 0 ? (
                <div className="text-center py-8 text-gray-400">No likes data available yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-600">
                    <thead className="bg-gray-700/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Timestamp</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Item ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">IP Address</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800/30 divide-y divide-gray-600">
                      {likesData.slice(0, 100).map((like, index) => (
                        <tr key={index} className="hover:bg-gray-700/50 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{new Date(like.timestamp).toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{like.itemId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{like.ipAddress}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {/* We don't have per-row deleted marker here; top table shows aggregated status */}
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">Recorded</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 