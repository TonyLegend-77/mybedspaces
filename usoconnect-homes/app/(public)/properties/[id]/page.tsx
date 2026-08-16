import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ContactLandlordBox from "@/components/ContactLandlordBox";
import ReportButton from "@/components/ReportButton";
import UnlockGate from "@/components/UnlockGate";
import PropertyTabs from "@/components/PropertyTabs";
import { Snowflake, Sofa, ShieldCheck, Users } from "lucide-react";

const FREE_PHOTO_COUNT = 1;

export default async function PropertyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  const property = await prisma.property.findUnique({
    where: { id: params.id },
    include: {
      landlord: {
        select: {
          id: true,
          name: true,
          phone: true,
          verification: { select: { status: true } },
        },
      },
      _count: { select: { messages: true } },
    },
  });

  if (!property) notFound();

  const landlordVerified = property.landlord.verification?.status === "APPROVED";

  let unlocked = false;
  if (session) {
    const unlock = await prisma.propertyUnlock.findUnique({
      where: {
        userId_propertyId: { userId: session.user.id, propertyId: property.id },
      },
    });
    unlocked = !!unlock && unlock.expiresAt > new Date();
  }

  const freePhotos = property.photos.slice(0, FREE_PHOTO_COUNT);
  const lockedPhotos = unlocked ? property.photos.slice(FREE_PHOTO_COUNT) : [];

  const photosSection = (
    <div>
      <div className="grid grid-cols-2 gap-2">
        {freePhotos.map((url) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={url}
            src={url}
            alt={property.title}
            className="h-40 w-full rounded-lg object-cover"
          />
        ))}
      </div>
      {!unlocked && property.photos.length > FREE_PHOTO_COUNT && (
        <p className="mt-2 text-xs text-neutral-500">
          {property.photos.length - FREE_PHOTO_COUNT} more photo(s) available
          after unlocking, see the Booking tab.
        </p>
      )}
      {unlocked && lockedPhotos.length > 0 && (
        <div className="mt-2 grid grid-cols-2 gap-2">
          {lockedPhotos.map((url) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={url} src={url} alt="" className="h-40 w-full rounded-lg object-cover" />
          ))}
        </div>
      )}
    </div>
  );

  const aboutSection = (
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold">{property.title}</h1>
        {property.verifiedProperty && (
          <span className="rounded bg-brand-50 px-2 py-1 text-xs text-brand-700">
            Verified
          </span>
        )}
      </div>
      <p className="text-sm text-neutral-500">
        {property.city}, {property.state}
      </p>
      <p className="mt-2 text-lg font-semibold">₦{property.rent.toLocaleString()}/yr</p>
      <p className="mt-1 text-sm text-neutral-600">
        {property.bedrooms} bed · {property.bathrooms} bath ·{" "}
        {property.furnished ? "Furnished" : "Unfurnished"}
      </p>
      <p className="mt-4 whitespace-pre-wrap text-sm text-neutral-700">
        {property.description}
      </p>
    </div>
  );

  const amenities = [
    { label: property.furnished ? "Furnished" : "Unfurnished", icon: Sofa },
    { label: `${property.bedrooms} bedroom(s)`, icon: Users },
    { label: property.verifiedProperty ? "Ownership verified" : "Ownership not verified", icon: ShieldCheck },
    { label: "Cooling / ventilation varies", icon: Snowflake },
  ];

  const amenitiesSection = (
    <div className="space-y-3">
      {amenities.map((a) => (
        <div key={a.label} className="flex items-center gap-3 text-sm text-neutral-700">
          <a.icon size={18} className="text-neutral-400" />
          {a.label}
        </div>
      ))}
      <p className="pt-2 text-xs text-neutral-500">
        Full amenity list depends on what the landlord provided. Confirm
        specifics directly with the landlord after unlocking.
      </p>
    </div>
  );

  const neighborhoodSection = (
    <div>
      <p className="text-sm text-neutral-700">
        This property is located in {property.city}, {property.state}.
      </p>
      {unlocked && property.latitude && property.longitude ? (
        <a
          href={`https://www.google.com/maps?q=${property.latitude},${property.longitude}`}
          target="_blank"
          className="mt-3 block rounded-lg border border-neutral-200 p-3 text-sm text-brand-700"
        >
          📍 View exact location on Google Maps
        </a>
      ) : (
        <div className="mt-3 rounded-lg border border-dashed border-neutral-300 p-4 text-center text-sm text-neutral-500">
          Exact location is hidden until unlocked. See the Booking tab.
        </div>
      )}
    </div>
  );

  const bookingSection = (
    <div className="space-y-4">
      <div className="rounded-lg border border-neutral-200 bg-white p-4">
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
          <ReportButton propertyId={property.id} reportedUserId={property.landlord.id} />
        </div>
      </div>

      <UnlockGate
        propertyId={property.id}
        landlordName={property.landlord.name}
        landlordPhone={unlocked ? property.landlord.phone : null}
        latitude={null}
        longitude={null}
        videoUrl={unlocked ? property.videoUrl : null}
        extraPhotos={[]}
      />

      <ContactLandlordBox propertyId={property.id} landlordId={property.landlord.id} />
    </div>
  );

  return (
    <PropertyTabs
      photosSection={photosSection}
      aboutSection={aboutSection}
      amenitiesSection={amenitiesSection}
      neighborhoodSection={neighborhoodSection}
      bookingSection={bookingSection}
      interestCount={property._count.messages}
      rent={property.rent}
      unlocked={unlocked}
    />
  );
}
