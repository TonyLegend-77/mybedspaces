"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function TopHeader() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            🏠
          </span>
          <span className="text-lg font-semibold">
            My<span className="text-brand-600">BedSpace</span>
          </span>
        </Link>

        {!session ? (
          <Link
            href="/login"
            className="rounded-full bg-brand-600 px-4 py-1.5 text-sm text-white"
          >
            Log in
          </Link>
        ) : (
          <button
            onClick={() => signOut()}
            className="text-sm text-neutral-500"
          >
            Log out
          </button>
        )}
      </div>
    </header>
  );
}
