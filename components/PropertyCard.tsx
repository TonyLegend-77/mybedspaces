import Link from "next/link";
import { BedDouble, Bath, MapPin } from "lucide-react";
import SaveToggle from "./SaveToggle";

type CardProperty = {
  id: string;
  title: string;
  city: string;
  state: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  photos: string[];
  verifiedProperty: boolean;
};

export default function PropertyCard({
  property,
  saved = false,
}: {
  property: CardProperty;
  saved?: boolean;
}) {
  return (
    <Link
      href={`/properties/${property.id}`}
      className="block overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
    >
      <div className="relative h-44 w-full bg-neutral-100">
        {property.photos[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={property.photos[0]}
            alt={property.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-neutral-400">
            No photo
          </div>
        )}

        <span className="absolute left-3 top-3 rounded-full bg-brand-600 px-2.5 py-1 text-xs font-medium text-white">
          For Rent
        </span>

        <SaveToggle propertyId={property.id} initiallySaved={saved} />

        {property.verifiedProperty && (
          <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium text-brand-700">
            ✓ Verified
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-lg font-semibold">
          ₦{property.rent.toLocaleString()}
          <span className="text-sm font-normal text-neutral-500">/yr</span>
        </p>
        <p className="mt-0.5 text-sm text-neutral-700">{property.title}</p>
        <p className="mt-1 flex items-center gap-1 text-xs text-neutral-500">
          <MapPin size={12} />
          {property.city}, {property.state}
        </p>
        <div className="mt-2 flex items-center gap-3 text-xs text-neutral-500">
          <span className="flex items-center gap-1">
            <BedDouble size={14} /> {property.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <Bath size={14} /> {property.bathrooms}
          </span>
        </div>
      </div>
    </Link>
  );
}
