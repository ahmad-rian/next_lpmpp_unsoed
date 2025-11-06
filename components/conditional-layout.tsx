"use client";

import { usePathname } from "next/navigation";
import { Link } from "@heroui/link";
import { Navbar } from "@/components/navbar";
import { PageTransition } from "@/components/page-transition";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");
  const isAdminPage = pathname?.startsWith("/admin");

  // Layout untuk auth pages & admin pages (tanpa navbar & footer user)
  if (isAuthPage || isAdminPage) {
    return <PageTransition>{children}</PageTransition>;
  }

  // Layout normal dengan navbar & footer untuk user
  return (
    <PageTransition>
      <div className="relative flex flex-col h-screen">
        <Navbar />
        <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
          {children}
        </main>
        <footer className="w-full flex items-center justify-center py-3">
          <Link
            isExternal
            className="flex items-center gap-1 text-current"
            href="https://heroui.com?utm_source=next-app-template"
            title="heroui.com homepage"
          >
            <span className="text-default-600">Powered by</span>
            <p className="text-primary">HeroUI</p>
          </Link>
        </footer>
      </div>
    </PageTransition>
  );
}
