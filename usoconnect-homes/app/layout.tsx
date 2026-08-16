import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import TopHeader from "@/components/TopHeader";
import BottomTabBar from "@/components/BottomTabBar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "My BedSpace",
  description: "Connect tenants and landlords directly, without the scams.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <TopHeader />
          <main className="mx-auto max-w-md px-4 pb-24 pt-4">{children}</main>
          <Footer />
          <BottomTabBar />
        </SessionProvider>
      </body>
    </html>
  );
}
