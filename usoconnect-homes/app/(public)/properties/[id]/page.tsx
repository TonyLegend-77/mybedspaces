import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ContactLandlordBox from "@/components/ContactLandlordBox";
import ReportButton from "@/components/ReportButton";

export default async function PropertyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const property = await prisma.property.findUnique({
    where: { id: params.id },
    include: {
      landlord: {
        select: { id: true, name: true, verification: { select: { status: true } } },
      },
    },
  });

  if (!property) notFound();

  const landlordVerified = property.landlord.verification?.status === "APPROVED";

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="grid grid-cols-2 gap-2">
          {property.photos.map((url) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={url}
              src={url}
              alt={property.title}
              className="h-56 w-full rounded-lg object-cover"
            />
          ))}
        </div>

        <div className="mt-6 flex items-center gap-2">
          <h1 className="text-2xl font-semibold">{property.title}</h1>
          {property.verifiedProperty && (
            <span className="rounded bg-brand-50 px-2 py-1 text-xs text-brand-700">
              Verified property
            </span>
          )}
        </div>
        <p className="text-neutral-500">
          {property.city}, {property.state}
        </p>
        <p className="mt-2 text-xl font-semibold">
          ₦{property.rent.toLocaleString()}/yr
        </p>
        <p className="mt-1 text-sm text-neutral-600">
          {property.bedrooms} bed · {property.bathrooms} bath ·{" "}
          {property.furnished ? "Furnished" : "Unfurnished"}
        </p>

        <p className="mt-6 whitespace-pre-wrap text-neutral-700">
          {property.description}
        </p>

        <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-4">
          <p className="text-sm">
            Listed by <span className="font-medium">{property.landlord.name}</span>
            {landlordVerified ? (
              <span className="ml-2 rounded bg-brand-50 px-2 py-0.5 text-xs text-brand-700">
                Verified landlord
              </span>
            ) : (
              <span className="ml-2 rounded bg-yellow-50 px-2 py-0.5 text-xs text-yellow-700">
                Unverified landlord
              </span>
            )}
          </p>
          <div className="mt-2">
            <ReportButton
              propertyId={property.id}
              reportedUserId={property.landlord.id}
            />
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <ContactLandlordBox
          propertyId={property.id}
          landlordId={property.landlord.id}
        />
      </div>
    </div>
  );
}
