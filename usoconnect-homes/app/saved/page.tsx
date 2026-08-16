import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PropertyCard from "@/components/PropertyCard";

export default async function SavedPropertiesPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const saved = await prisma.savedProperty.findMany({
    where: { userId: session.user.id },
    include: { property: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Saved properties</h1>
      {saved.length === 0 ? (
        <p className="mt-8 text-center text-sm text-neutral-500">
          Nothing saved yet. Tap the heart on a property to keep it here.
        </p>
      ) : (
        <div className="space-y-4">
          {saved.map((s) => (
            <PropertyCard key={s.id} property={s.property} saved />
          ))}
        </div>
      )}
    </div>
  );
}
