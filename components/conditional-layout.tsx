"use client";

import { usePathname } from "next/navigation";
import { Link } from "@heroui/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageTransition } from "@/components/page-transition";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");
  const isAdminPage = pathname?.startsWith("/admin");
  const isBerandaPage = pathname === "/beranda";

  // Layout untuk auth pages & admin pages (tanpa navbar & footer user)
  if (isAuthPage || isAdminPage) {
    return <PageTransition>{children}</PageTransition>;
  }

  // Layout untuk beranda (tanpa padding, full screen hero)
  if (isBerandaPage) {
    return (
      <PageTransition>
        <div className="relative flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  // Layout normal dengan navbar & footer untuk user
  return (
    <PageTransition>
      <div className="relative flex flex-col min-h-screen">
        <Navbar />
        <main className="container mx-auto max-w-7xl pt-6 md:pt-8 lg:pt-10 px-6 flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
}
