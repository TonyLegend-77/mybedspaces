"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Search, Heart, MessageCircle, User, LayoutDashboard, Coins } from "lucide-react";

export default function BottomTabBar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isLandlord = session?.user.role === "LANDLORD";
  const isAdmin = session?.user.role === "ADMIN";

  const tabs = isAdmin
    ? [
        { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
        { href: "/admin/listings", label: "Listings", icon: Search },
        { href: "/admin/reports", label: "Reports", icon: Heart },
        { href: "/admin/users", label: "Users", icon: User },
      ]
    : isLandlord
    ? [
        { href: "/properties", label: "Search", icon: Search },
        { href: "/landlord/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/messages", label: "Messages", icon: MessageCircle },
        { href: "/landlord/verification", label: "Profile", icon: User },
      ]
    : [
        { href: "/properties", label: "Search", icon: Search },
        { href: "/credits", label: "Credits", icon: Coins },
        { href: "/saved", label: "Saved", icon: Heart },
        { href: session ? "/dashboard" : "/login", label: "Profile", icon: User },
      ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around py-2">
        {tabs.map((tab) => {
          const active = pathname === tab.href || pathname?.startsWith(tab.href + "/");
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center gap-0.5 px-3 py-1"
            >
              <Icon
                size={22}
                className={active ? "text-brand-600" : "text-neutral-400"}
                fill={active && tab.label === "Saved" ? "currentColor" : "none"}
              />
              <span
                className={`text-[11px] ${
                  active ? "font-medium text-brand-600" : "text-neutral-500"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
