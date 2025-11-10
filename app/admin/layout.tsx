"use client";

import { AdminNavbar } from "@/components/admin-navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Admin Navbar */}
      <AdminNavbar />

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-divider py-4">
        <div className="container mx-auto max-w-7xl px-6">
          <p className="text-center text-sm text-default-500">
            © 2025 LPMPP UNSOED. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
