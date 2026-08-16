"use client";

import { useState } from "react";

export default function FileUploadInput({
  label,
  kind,
  multiple = false,
  onUploaded,
}: {
  label: string;
  kind: "photo" | "id_document";
  multiple?: boolean;
  onUploaded: (urls: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [previewCount, setPreviewCount] = useState(0);

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setError("");
    const urls: string[] = [];

    try {
      for (const file of files) {
        const base64 = await fileToBase64(file);
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64, kind }),
        });
        if (!res.ok) throw new Error("Upload failed.");
        const data = await res.json();
        urls.push(data.url);
      }
      setPreviewCount(urls.length);
      onUploaded(urls);
    } catch (err) {
      setError("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleChange}
        className="w-full text-sm"
      />
      {uploading && <p className="mt-1 text-xs text-neutral-500">Uploading...</p>}
      {previewCount > 0 && !uploading && (
        <p className="mt-1 text-xs text-brand-700">{previewCount} file(s) uploaded.</p>
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
