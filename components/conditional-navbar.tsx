"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";

export function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Jangan tampilkan navbar di halaman auth
  if (pathname?.startsWith("/auth")) {
    return null;
  }
  
  return <Navbar />;
}
