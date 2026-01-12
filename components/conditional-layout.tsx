"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageTransition } from "@/components/page-transition";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");
  const isAdminPage = pathname?.startsWith("/admin");
  const isHomePage = pathname === "/";
  const isBerandaPage = pathname === "/beranda";

  // Layout untuk auth pages & admin pages (tanpa navbar/footer)
  if (isAuthPage || isAdminPage) {
    return <PageTransition>{children}</PageTransition>;
  }

  // Layout untuk homepage dan beranda (full width)
  if (isHomePage || isBerandaPage) {
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

  // Layout normal dengan container
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
