import { prisma } from "@/lib/prisma";
import PropertyCard from "@/components/PropertyCard";
import { Search } from "lucide-react";

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { state, city, minPrice, maxPrice, bedrooms, furnished } = searchParams;

  const properties = await prisma.property.findMany({
    where: {
      status: "APPROVED",
      state: state || undefined,
      city: city || undefined,
      bedrooms: bedrooms ? Number(bedrooms) : undefined,
      furnished: furnished ? furnished === "true" : undefined,
      rent: {
        gte: minPrice ? Number(minPrice) : undefined,
        lte: maxPrice ? Number(maxPrice) : undefined,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        <form className="space-y-4 md:col-span-1">
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              name="city"
              defaultValue={city}
              placeholder="Search area..."
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-3 text-sm"
            />
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <h2 className="mb-3 text-sm font-semibold">Filters</h2>
            <div className="space-y-2">
              <input
                name="state"
                defaultValue={state}
                placeholder="State"
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
                <input
                  name="minPrice"
                  defaultValue={minPrice}
                  placeholder="Min ₦"
                  className="w-1/2 rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                />
                <input
                  name="maxPrice"
                  defaultValue={maxPrice}
                  placeholder="Max ₦"
                  className="w-1/2 rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                />
              </div>
              <input
                name="bedrooms"
                defaultValue={bedrooms}
                placeholder="Bedrooms"
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
              />
              <button className="w-full rounded-lg bg-brand-600 py-2 text-sm text-white">
                Apply
              </button>
            </div>
          </div>
        </form>

        <div className="md:col-span-3">
          <p className="mb-4 text-sm text-neutral-500">
            {properties.length} propert{properties.length === 1 ? "y" : "ies"} found
          </p>

          {properties.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-300 py-16 text-center text-sm text-neutral-500">
              No listings match those filters yet. Try widening your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {properties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
