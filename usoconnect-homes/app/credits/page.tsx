"use client";

import { useEffect, useState } from "react";

type Transaction = {
  id: string;
  amountNaira: number;
  creditsBought: number;
  status: string;
  createdAt: string;
};

export default function CreditsPage() {
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState("1000");
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function load() {
    const res = await fetch("/api/credits");
    if (res.ok) {
      const data = await res.json();
      setBalance(data.balance);
      setTransactions(data.transactions);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function submitClaim() {
    setError("");
    const res = await fetch("/api/credits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amountNaira: Number(amount), bankReference: reference }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong.");
      return;
    }

    setSubmitted(true);
    setReference("");
    load();
  }

  const statusColor: Record<string, string> = {
    PENDING: "text-yellow-700 bg-yellow-50",
    APPROVED: "text-brand-700 bg-brand-50",
    REJECTED: "text-red-700 bg-red-50",
  };

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold">Credits</h1>
      <p className="mb-4 text-sm text-neutral-500">
        {balance === null ? "Loading..." : `${balance} credits available`}
      </p>

      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <h2 className="font-medium">Buy credits</h2>
        <p className="mt-1 text-sm text-neutral-600">
          ₦1,000 = 100 credits. Unlocking a property's full details (photos,
          video, exact location, and landlord contact) costs 50 credits and
          lasts 48 hours.
        </p>

        <div className="mt-4 rounded-lg bg-neutral-50 p-3 text-sm">
          <p className="font-medium">Bank transfer details</p>
          <p className="mt-1 text-neutral-600">
            Account name: My BedSpace Ltd
            <br />
            Account number: 0123456789
            <br />
            Bank: [Your bank name]
          </p>
          <p className="mt-2 text-xs text-neutral-500">
            Transfer any amount, then submit the reference below. An admin
            confirms the transfer and credits your account, usually within a
            few hours.
          </p>
        </div>

        {submitted ? (
          <p className="mt-4 rounded-lg bg-brand-50 p-3 text-sm text-brand-700">
            Claim submitted. Your credits will appear once an admin confirms
            the transfer.
          </p>
        ) : (
          <div className="mt-4 space-y-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount sent (₦)"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            />
            <input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Transfer reference / narration"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              onClick={submitClaim}
              className="w-full rounded-lg bg-brand-600 py-2 text-sm text-white"
            >
              I've sent the transfer
            </button>
          </div>
        )}
      </div>

      <h2 className="mb-2 mt-6 font-medium">History</h2>
      {transactions.length === 0 ? (
        <p className="text-sm text-neutral-500">No transactions yet.</p>
      ) : (
        <div className="space-y-2">
          {transactions.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-3 text-sm"
            >
              <div>
                <p>₦{t.amountNaira.toLocaleString()} → {t.creditsBought} credits</p>
                <p className="text-xs text-neutral-400">
                  {new Date(t.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className={`rounded px-2 py-1 text-xs ${statusColor[t.status]}`}>
                {t.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
