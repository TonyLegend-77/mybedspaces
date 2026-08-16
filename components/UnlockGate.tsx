"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Phone, MapPin } from "lucide-react";

export default function UnlockGate({
  propertyId,
  landlordName,
  landlordPhone,
  latitude,
  longitude,
  videoUrl,
  extraPhotos,
}: {
  propertyId: string;
  landlordName: string;
  landlordPhone: string | null;
  latitude: number | null;
  longitude: number | null;
  videoUrl: string | null;
  extraPhotos: string[];
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [unlocked, setUnlocked] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unlocking, setUnlocking] = useState(false);

  async function checkStatus() {
    const res = await fetch(`/api/properties/${propertyId}/unlock`);
    if (res.ok) {
      const data = await res.json();
      setUnlocked(data.unlocked);
      setExpiresAt(data.expiresAt);
    }
    setLoading(false);
  }

  useEffect(() => {
    checkStatus();
  }, [propertyId]);

  async function handleUnlock() {
    if (!session) {
      router.push("/login");
      return;
    }
    setError("");
    setUnlocking(true);

    const res = await fetch(`/api/properties/${propertyId}/unlock`, { method: "POST" });
    setUnlocking(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Could not unlock.");
      return;
    }

    checkStatus();
  }

  if (loading) return null;

  if (!unlocked) {
    return (
      <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-center">
        <Lock size={20} className="mx-auto text-neutral-400" />
        <p className="mt-2 text-sm font-medium">
          Full photos, video, exact location, and landlord contact are locked
        </p>
        <p className="mt-1 text-xs text-neutral-500">
          Unlock for 50 credits, valid for 48 hours
        </p>
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        <button
          onClick={handleUnlock}
          disabled={unlocking}
          className="mt-3 rounded-lg bg-brand-600 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {unlocking ? "Unlocking..." : "Unlock for 50 credits"}
        </button>
        <a href="/credits" className="mt-2 block text-xs text-brand-700 underline">
          Need credits? Buy here
        </a>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-700">
        Unlocked{expiresAt && ` · access until ${new Date(expiresAt).toLocaleString()}`}
      </div>

      {extraPhotos.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {extraPhotos.map((url) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={url} src={url} alt="" className="h-32 w-full rounded-lg object-cover" />
          ))}
        </div>
      )}

      {videoUrl && (
        <video controls className="w-full rounded-lg">
          <source src={videoUrl} />
        </video>
      )}

      {latitude && longitude && (
        <a
          href={`https://www.google.com/maps?q=${latitude},${longitude}`}
          target="_blank"
          className="flex items-center gap-2 rounded-lg border border-neutral-200 p-3 text-sm text-brand-700"
        >
          <MapPin size={16} /> View exact location on Google Maps
        </a>
      )}

      <div className="rounded-lg border border-neutral-200 p-3 text-sm">
        <p className="font-medium">{landlordName}</p>
        {landlordPhone && (
          <a
            href={`tel:${landlordPhone}`}
            className="mt-1 flex items-center gap-2 text-brand-700"
          >
            <Phone size={14} /> {landlordPhone}
          </a>
        )}
      </div>
    </div>
  );
}
