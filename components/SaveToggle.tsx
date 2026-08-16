"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";

export default function SaveToggle({
  propertyId,
  initiallySaved = false,
}: {
  propertyId: string;
  initiallySaved?: boolean;
}) {
  const { data: session } = useSession();
  const [saved, setSaved] = useState(initiallySaved);
  const [loading, setLoading] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!session) return;

    setLoading(true);
    await fetch("/api/saved", {
      method: saved ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId }),
    });
    setSaved(!saved);
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm"
      aria-label={saved ? "Remove from saved" : "Save property"}
    >
      <Heart
        size={16}
        className={saved ? "text-red-500" : "text-neutral-400"}
        fill={saved ? "currentColor" : "none"}
      />
    </button>
  );
}
