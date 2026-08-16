import { prisma } from "@/lib/prisma";
import PropertyCard from "@/components/PropertyCard";
import Link from "next/link";
import { Search, ShieldCheck, MessageCircle, Coins } from "lucide-react";

export default async function HomePage() {
  const properties = await prisma.property.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  return (
    <div>
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-neutral-900 md:min-h-[85vh]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1600')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center text-white">
          <h1 className="text-3xl font-bold leading-tight md:text-6xl">
            Find your next home,
            <br className="hidden md:block" /> directly from real landlords.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/90 md:mt-6 md:text-lg">
            No agent fees, no fake listings. Every landlord on My BedSpace is
            ID-verified before they can post.
          </p>

          <form
            action="/properties"
            className="mx-auto mt-8 flex max-w-xl overflow-hidden rounded-full bg-white shadow-lg"
          >
            <div className="flex flex-1 items-center px-5">
              <Search size={18} className="text-neutral-400" />
              <input
                name="city"
                placeholder="Search by city, e.g. Enugu, Lagos..."
                className="w-full px-3 py-3.5 text-sm text-neutral-900 outline-none md:py-4"
              />
            </div>
            <button className="bg-brand-600 px-6 text-sm font-medium text-white hover:bg-brand-700 md:px-10">
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Verified landlords", desc: "Every landlord submits ID for review before they can list a property." },
            { icon: MessageCircle, title: "Message directly", desc: "No agents. Your identity stays private until you choose to share it." },
            { icon: Coins, title: "Unlock full details", desc: "See exact location, photos, video, and landlord contact with credits, no subscriptions." },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-neutral-200 bg-white p-6">
              <f.icon size={24} className="text-brand-600" />
              <h3 className="mt-3 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-neutral-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold md:text-2xl">Featured properties</h2>
          <Link href="/properties" className="text-sm font-medium text-brand-600">
            View all →
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 py-16 text-center text-sm text-neutral-500">
            No approved listings yet. Check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
