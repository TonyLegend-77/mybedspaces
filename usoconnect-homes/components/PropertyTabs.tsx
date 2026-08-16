"use client";

import { useState } from "react";
import { Flame } from "lucide-react";

const TABS = ["Photos", "About", "Amenities", "Neighborhood", "Booking"] as const;
type Tab = (typeof TABS)[number];

export default function PropertyTabs({
  photosSection,
  aboutSection,
  amenitiesSection,
  neighborhoodSection,
  bookingSection,
  interestCount,
  rent,
  unlocked,
}: {
  photosSection: React.ReactNode;
  aboutSection: React.ReactNode;
  amenitiesSection: React.ReactNode;
  neighborhoodSection: React.ReactNode;
  bookingSection: React.ReactNode;
  interestCount: number;
  rent: number;
  unlocked: boolean;
}) {
  const [active, setActive] = useState<Tab>("Photos");

  const panels: Record<Tab, React.ReactNode> = {
    Photos: photosSection,
    About: aboutSection,
    Amenities: amenitiesSection,
    Neighborhood: neighborhoodSection,
    Booking: bookingSection,
  };

  return (
    <div>
      <div className="sticky top-[57px] z-20 -mx-4 flex gap-5 overflow-x-auto border-b border-neutral-200 bg-white px-4 py-2 text-sm">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`whitespace-nowrap pb-1 ${
              active === tab
                ? "border-b-2 border-brand-600 font-medium text-brand-700"
                : "text-neutral-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {interestCount >= 3 && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-orange-50 px-3 py-2 text-xs text-orange-700">
          <Flame size={14} />
          <span>
            This home is popular — {interestCount} people have messaged about
            it. Act fast.
          </span>
        </div>
      )}

      <div className="mt-4 pb-28">{panels[active]}</div>

      <div className="fixed bottom-16 left-0 right-0 z-30 border-t border-neutral-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3">
          <div>
            <p className="text-xs text-neutral-500">
              {unlocked ? "Full details unlocked" : "Annual rent"}
            </p>
            <p className="font-semibold">₦{rent.toLocaleString()}/yr</p>
          </div>
          <button
            onClick={() => setActive("Booking")}
            className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white"
          >
            {unlocked ? "Contact landlord" : "Unlock & contact"}
          </button>
        </div>
      </div>
    </div>
  );
}
