"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Phone } from "lucide-react";

export default function TopHeader() {
  const { data: session } = useSession();

  return (
    <>
      <div className="hidden items-center justify-between bg-brand-700 px-6 py-1.5 text-xs text-white md:flex">
        <a href="tel:+2340000000000" className="flex items-center gap-1.5">
          <Phone size={12} /> +234 000 000 0000
        </a>
        <span>Support: support@mybedspace.com.ng</span>
      </div>

      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              🏠
            </span>
            <span className="text-lg font-semibold">
              My<span className="text-brand-600">BedSpace</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-neutral-700 md:flex">
            <Link href="/properties">Browse</Link>
            <Link href="/credits">Credits</Link>
            {session?.user.role === "LANDLORD" && (
              <Link href="/landlord/dashboard">Dashboard</Link>
            )}
            {session?.user.role === "ADMIN" && (
              <Link href="/admin/dashboard">Admin</Link>
            )}
          </nav>

          {!session ? (
            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden text-sm text-neutral-600 md:inline">
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-brand-600 px-4 py-1.5 text-sm text-white"
              >
                Sign up
              </Link>
            </div>
          ) : (
            <button onClick={() => signOut()} className="text-sm text-neutral-500">
              Log out
            </button>
          )}
        </div>
      </header>
    </>
  );
}
