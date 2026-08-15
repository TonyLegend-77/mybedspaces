"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold text-brand-700">
          USOConnect Homes
        </Link>

        <nav className="flex items-center gap-5 text-sm">
          <Link href="/properties">Browse</Link>

          {!session && (
            <>
              <Link href="/login">Log in</Link>
              <Link
                href="/register"
                className="rounded-md bg-brand-600 px-3 py-1.5 text-white hover:bg-brand-700"
              >
                Sign up
              </Link>
            </>
          )}

          {session?.user.role === "TENANT" && (
            <>
              <Link href="/messages">Messages</Link>
              <Link href="/saved">Saved</Link>
              <button onClick={() => signOut()} className="text-neutral-500">
                Log out
              </button>
            </>
          )}

          {session?.user.role === "LANDLORD" && (
            <>
              <Link href="/landlord/dashboard">Dashboard</Link>
              <Link href="/landlord/properties/new">Add property</Link>
              <button onClick={() => signOut()} className="text-neutral-500">
                Log out
              </button>
            </>
          )}

          {session?.user.role === "ADMIN" && (
            <>
              <Link href="/admin/dashboard">Admin</Link>
              <button onClick={() => signOut()} className="text-neutral-500">
                Log out
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
