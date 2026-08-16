"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"TENANT" | "LANDLORD">("TENANT");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, role }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong.");
      return;
    }

    router.push("/login?registered=true");
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-semibold">Create your account</h1>

      <div className="mb-6 flex rounded-md border border-neutral-300 p-1">
        {(["TENANT", "LANDLORD"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`flex-1 rounded py-2 text-sm ${
              role === r ? "bg-brand-600 text-white" : "text-neutral-600"
            }`}
          >
            {r === "TENANT" ? "I'm a tenant" : "I'm a landlord"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-md border border-neutral-300 px-4 py-2"
        />
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-md border border-neutral-300 px-4 py-2"
        />
        <input
          required
          type="password"
          placeholder="Password (min 8 characters)"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full rounded-md border border-neutral-300 px-4 py-2"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          disabled={loading}
          className="w-full rounded-md bg-brand-600 py-2 text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      {role === "LANDLORD" && (
        <p className="mt-4 text-sm text-neutral-500">
          You'll need to submit an ID for verification before you can list a
          property. This protects tenants from fake listings.
        </p>
      )}
    </div>
  );
}
