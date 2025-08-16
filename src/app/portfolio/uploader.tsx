"use client";
import { useState } from "react";

export default function Uploader({ onUploaded }: { onUploaded: (url: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/uploads", { method: "POST", body: form });
      const json = await res.json();
      if (!json.ok) throw new Error("Upload failed");
      onUploaded(json.url as string);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setError(msg);
    } finally {
      setBusy(false);
      e.currentTarget.value = "";
    }
  }

  return (
    <div className="rounded-lg border border-black/10 p-3">
      <div className="text-sm mb-2">Upload media to public/uploads</div>
      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleChange}
        disabled={busy}
        className="text-sm"
      />
      {busy && <div className="text-xs text-foreground/60 mt-1">Uploading…</div>}
      {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
    </div>
  );
}

