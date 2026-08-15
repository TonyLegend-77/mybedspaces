import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role;

    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (pathname.startsWith("/landlord") && role !== "LANDLORD") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (pathname.startsWith("/dashboard") && !role) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/landlord/:path*",
    "/dashboard/:path*",
    "/messages/:path*",
    "/saved/:path*",
  ],
};

