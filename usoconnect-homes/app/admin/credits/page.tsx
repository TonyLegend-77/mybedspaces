"use client";

import { useEffect, useState } from "react";

type PendingTx = {
  id: string;
  amountNaira: number;
  creditsBought: number;
  bankReference: string;
  createdAt: string;
  user: { name: string; email: string };
};

export default function AdminCreditsPage() {
  const [transactions, setTransactions] = useState<PendingTx[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/admin/credits?status=PENDING");
    if (res.ok) setTransactions(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function decide(id: string, decision: "APPROVED" | "REJECTED") {
    await fetch("/api/admin/credits", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, decision }),
    });
    load();
  }

  if (loading) return <p className="text-neutral-500">Loading...</p>;

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold">
        Pending credit claims ({transactions.length})
      </h1>
      <p className="mb-4 text-xs text-neutral-500">
        Confirm each transfer actually landed in the bank account before
        approving. Approving credits the user's balance immediately.
      </p>

      {transactions.length === 0 ? (
        <p className="text-neutral-500">Nothing pending.</p>
      ) : (
        <div className="space-y-3">
          {transactions.map((t) => (
            <div key={t.id} className="rounded-lg border border-neutral-200 bg-white p-4">
              <p className="font-medium">
                ₦{t.amountNaira.toLocaleString()} → {t.creditsBought} credits
              </p>
              <p className="mt-1 text-sm text-neutral-600">
                {t.user.name} ({t.user.email})
              </p>
              <p className="mt-1 text-sm text-neutral-500">
                Reference: <span className="font-mono">{t.bankReference}</span>
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => decide(t.id, "APPROVED")}
                  className="rounded bg-brand-600 px-3 py-1 text-sm text-white"
                >
                  Confirmed, approve
                </button>
                <button
                  onClick={() => decide(t.id, "REJECTED")}
                  className="rounded bg-red-600 px-3 py-1 text-sm text-white"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
