import { prisma } from "@/lib/prisma";
import PropertyCard from "@/components/PropertyCard";
import { Search, SlidersHorizontal } from "lucide-react";

export default async function HomePage() {
  const properties = await prisma.property.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const filters = ["All", "For Rent", "For Sale"];

  return (
    <div>
      <form action="/properties" className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
        />
        <input
          name="city"
          placeholder="Search area, e.g. GRA, New Haven..."
          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-10 text-sm"
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg bg-neutral-100"
        >
          <SlidersHorizontal size={14} className="text-neutral-500" />
        </button>
      </form>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {filters.map((f, i) => (
          <span
            key={f}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm ${
              i === 0
                ? "bg-brand-600 text-white"
                : "border border-neutral-200 text-neutral-600"
            }`}
          >
            {f}
          </span>
        ))}
        <span className="whitespace-nowrap rounded-full border border-brand-200 px-4 py-1.5 text-sm text-brand-700">
          🔍 Find for Me
        </span>
      </div>

      <div className="mt-4 space-y-4">
        {properties.length === 0 ? (
          <p className="mt-8 text-center text-sm text-neutral-500">
            No approved listings yet. Check back soon.
          </p>
        ) : (
          properties.map((p) => <PropertyCard key={p.id} property={p} />)
        )}
      </div>
    </div>
  );
}
