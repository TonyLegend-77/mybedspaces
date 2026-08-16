"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FileUploadInput from "@/components/FileUploadInput";

export default function NewPropertyPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    rent: "",
    state: "",
    city: "",
    bedrooms: "",
    bathrooms: "",
    furnished: false,
  });
  const [photos, setPhotos] = useState<string[]>([]);
  const [ownershipDocUrl, setOwnershipDocUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (photos.length === 0) {
      setError("Add at least one photo.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        rent: Number(form.rent),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        photos,
        ownershipDocUrl: ownershipDocUrl || undefined,
      }),
    });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong.");
      return;
    }

    router.push("/landlord/dashboard");
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-semibold">List a property</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full rounded-md border border-neutral-300 px-3 py-2"
        />
        <textarea
          required
          placeholder="Description"
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full rounded-md border border-neutral-300 px-3 py-2"
        />
        <input
          required
          type="number"
          placeholder="Annual rent (₦)"
          value={form.rent}
          onChange={(e) => setForm({ ...form, rent: e.target.value })}
          className="w-full rounded-md border border-neutral-300 px-3 py-2"
        />
        <div className="flex gap-2">
          <input
            required
            placeholder="State"
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
            className="w-1/2 rounded-md border border-neutral-300 px-3 py-2"
          />
          <input
            required
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="w-1/2 rounded-md border border-neutral-300 px-3 py-2"
          />
        </div>
        <div className="flex gap-2">
          <input
            required
            type="number"
            placeholder="Bedrooms"
            value={form.bedrooms}
            onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
            className="w-1/2 rounded-md border border-neutral-300 px-3 py-2"
          />
          <input
            required
            type="number"
            placeholder="Bathrooms"
            value={form.bathrooms}
            onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
            className="w-1/2 rounded-md border border-neutral-300 px-3 py-2"
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.furnished}
            onChange={(e) => setForm({ ...form, furnished: e.target.checked })}
          />
          Furnished
        </label>

        <FileUploadInput
          label="Property photos"
          kind="photo"
          multiple
          onUploaded={setPhotos}
        />

        <FileUploadInput
          label="Proof of ownership (title deed, lease, or utility bill matching the address) — optional but strongly recommended"
          kind="photo"
          onUploaded={(urls) => setOwnershipDocUrl(urls[0])}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          disabled={loading}
          className="w-full rounded-md bg-brand-600 py-2 text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit for review"}
        </button>
        <p className="text-xs text-neutral-500">
          Listings are reviewed by an admin before going live, usually within
          24 hours.
        </p>
      </form>
    </div>
  );
}
