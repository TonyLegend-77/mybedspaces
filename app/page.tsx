import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const featured = await prisma.property.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <div className="space-y-16">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Find your next home, directly from real landlords.
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-neutral-600">
          No agent fees, no fake listings. Every landlord on USOConnect is
          ID-verified before they can post.
        </p>
        <form action="/properties" className="mx-auto mt-6 flex max-w-lg gap-2">
          <input
            name="city"
            placeholder="Search by city"
            className="flex-1 rounded-md border border-neutral-300 px-4 py-2"
          />
          <button className="rounded-md bg-brand-600 px-5 py-2 text-white hover:bg-brand-700">
            Search
          </button>
        </form>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Featured properties</h2>
        {featured.length === 0 ? (
          <p className="text-neutral-500">
            No approved listings yet. Check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
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
                  {p.city}, {p.state}
                </p>
                <p className="mt-1 font-semibold">₦{p.rent.toLocaleString()}/yr</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">How it works</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            { title: "Search", desc: "Browse verified listings by city, price, and bedrooms." },
            { title: "Connect", desc: "Message landlords directly. Your identity stays private until you choose to share it." },
            { title: "Move in", desc: "Agree on terms and move forward, without a middleman." },
          ].map((step) => (
            <div key={step.title} className="rounded-lg border border-neutral-200 bg-white p-5">
              <h3 className="font-medium">{step.title}</h3>
              <p className="mt-1 text-sm text-neutral-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
