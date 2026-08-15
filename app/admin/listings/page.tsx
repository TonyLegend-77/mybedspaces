"use client";

import { useEffect, useState } from "react";

type PendingProperty = {
  id: string;
  title: string;
  description: string;
  rent: number;
  city: string;
  state: string;
  photos: string[];
  ownershipDocUrl: string | null;
  verifiedProperty: boolean;
  landlord: { name: string; email: string; verification: { status: string } | null };
};

export default function AdminListingsPage() {
  const [listings, setListings] = useState<PendingProperty[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/admin/listings?status=PENDING");
    if (res.ok) setListings(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function approve(id: string) {
    await fetch(`/api/admin/listings/${id}/approve`, { method: "PATCH" });
    load();
  }

  async function reject(id: string) {
    await fetch(`/api/admin/listings/${id}/reject`, { method: "PATCH" });
    load();
  }

  if (loading) return <p className="text-neutral-500">Loading listings...</p>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">
        Listings awaiting review ({listings.length})
      </h1>

      {listings.length === 0 ? (
        <p className="text-neutral-500">Nothing pending. Queue is clear.</p>
      ) : (
        <div className="space-y-4">
          {listings.map((p) => (
            <div key={p.id} className="rounded-lg border border-neutral-200 bg-white p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{p.title}</h3>
                  <p className="text-sm text-neutral-500">
                    {p.city}, {p.state} · ₦{p.rent.toLocaleString()}/yr
                  </p>
                  <p className="mt-1 text-sm">
                    Landlord: {p.landlord.name} ({p.landlord.email}) —{" "}
                    <span
                      className={
                        p.landlord.verification?.status === "APPROVED"
                          ? "text-brand-700"
                          : "text-yellow-700"
                      }
                    >
                      {p.landlord.verification?.status || "not verified"}
                    </span>
                  </p>
                  <p className="mt-1 text-sm">
                    Ownership doc:{" "}
                    {p.ownershipDocUrl ? (
                      <a
                        href={p.ownershipDocUrl}
                        target="_blank"
                        className="text-brand-700 underline"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-neutral-400">not provided</span>
                    )}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => approve(p.id)}
                    className="rounded bg-brand-600 px-3 py-1 text-sm text-white"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => reject(p.id)}
                    className="rounded bg-red-600 px-3 py-1 text-sm text-white"
                  >
                    Reject
                  </button>
                </div>
              </div>

              {p.photos.length > 0 && (
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {p.photos.map((url) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={url}
                      src={url}
                      alt={p.title}
                      className="h-24 w-32 flex-shrink-0 rounded object-cover"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
