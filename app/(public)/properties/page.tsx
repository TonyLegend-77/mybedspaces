import Link from "next/link";
import { prisma } from "@/lib/prisma";

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
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
      <form className="space-y-4 lg:col-span-1">
        <h2 className="font-semibold">Filters</h2>
        <input
          name="state"
          defaultValue={state}
          placeholder="State"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        <input
          name="city"
          defaultValue={city}
          placeholder="City"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        <div className="flex gap-2">
          <input
            name="minPrice"
            defaultValue={minPrice}
            placeholder="Min ₦"
            className="w-1/2 rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
          <input
            name="maxPrice"
            defaultValue={maxPrice}
            placeholder="Max ₦"
            className="w-1/2 rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <input
          name="bedrooms"
          defaultValue={bedrooms}
          placeholder="Bedrooms"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        <select
          name="furnished"
          defaultValue={furnished || ""}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        >
          <option value="">Furnished / Unfurnished</option>
          <option value="true">Furnished</option>
          <option value="false">Unfurnished</option>
        </select>
        <button className="w-full rounded-md bg-brand-600 py-2 text-sm text-white hover:bg-brand-700">
          Apply filters
        </button>
      </form>

      <div className="lg:col-span-3">
        <h1 className="mb-4 text-xl font-semibold">
          {properties.length} propert{properties.length === 1 ? "y" : "ies"} found
        </h1>

        {properties.length === 0 ? (
          <p className="text-neutral-500">
            No listings match those filters yet. Try widening your search.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {properties.map((p) => (
              <Link
                key={p.id}
                href={`/properties/${p.id}`}
                className="block rounded-lg border border-neutral-200 bg-white p-4 hover:shadow-md"
              >
                {p.photos[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.photos[0]}
                    alt={p.title}
                    className="mb-3 h-40 w-full rounded-md object-cover"
                  />
                )}
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{p.title}</h3>
                  {p.verifiedProperty && (
                    <span className="rounded bg-brand-50 px-2 py-0.5 text-xs text-brand-700">
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-sm text-neutral-500">
                  {p.city}, {p.state} · {p.bedrooms} bed · {p.bathrooms} bath
                </p>
                <p className="mt-1 font-semibold">₦{p.rent.toLocaleString()}/yr</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
