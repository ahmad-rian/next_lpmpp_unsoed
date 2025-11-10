"use client";

import { useEffect, useState } from "react";
import { Link } from "@heroui/link";
import { Image } from "@heroui/image";
import { Divider } from "@heroui/divider";
import NextLink from "next/link";

interface SiteConfig {
  id: string;
  logoUnsoed: string | null;
  logoApp: string | null;
  siteName: string;
  alamat: string | null;
  email: string | null;
  instagramUrl: string | null;
}

export const Footer = () => {
  const [config, setConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    fetchSiteConfig();
  }, []);

  const fetchSiteConfig = async () => {
    try {
      const response = await fetch("/api/site-config");
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (error) {
      console.error("Error fetching site config:", error);
    }
  };

  const currentYear = new Date().getFullYear();

  const navigationLinks = [
    { label: "Beranda", href: "/" },
    { label: "Tentang Kami", href: "/tentang-kami" },
    { label: "Program Unggulan", href: "/program-unggulan" },
    { label: "Berita", href: "/berita" },
    { label: "Unduhan", href: "/unduhan" },
  ];

  const serviceLinks = [
    { label: "SPMI", href: "/spmi/gugus-penjamin-mutu-fakultas" },
    { label: "Akreditasi", href: "/akreditasi/pt" },
    { label: "Kepakaran", href: "/kepakaran/mbkm" },
    { label: "Pimpinan", href: "/pimpinan" },
    { label: "Tata Usaha", href: "/tata-usaha" },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-black px-4 py-8 transition-colors">
      <div className="max-w-7xl mx-auto bg-gradient-to-br from-red-600 via-red-700 to-rose-700 dark:from-gray-900 dark:via-black dark:to-gray-950 rounded-2xl px-8 py-12 shadow-xl text-white">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

          {/* Brand Section */}
          <div className="space-y-5">
            <div className="flex items-center space-x-3">
              {config?.logoApp && (
                <Image
                  src={config.logoApp}
                  alt="Logo LPMPP"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              )}
              <h3 className="text-base font-semibold text-white">
                {config?.siteName || "LPMPP UNSOED"}
              </h3>
            </div>
            <p className="text-sm text-red-50 dark:text-red-100 leading-relaxed">
              Lembaga Pengembangan Pembelajaran dan Penjaminan Mutu
            </p>

            {/* University Logo */}
            {config?.logoUnsoed && (
              <div className="flex items-center space-x-2">
                <Image
                  src={config.logoUnsoed}
                  alt="Logo Universitas Jenderal Soedirman"
                  width={28}
                  height={28}
                  className="object-contain opacity-80 dark:opacity-70"
                />
                <span className="text-xs text-red-100 dark:text-red-200">
                  Universitas Jenderal Soedirman
                </span>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-white">Navigasi</h4>
            <ul className="space-y-2.5">
              {navigationLinks.map((link, index) => (
                <li key={index}>
                  <NextLink
                    href={link.href}
                    className="text-sm text-red-50 dark:text-red-100 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </NextLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-white">Layanan</h4>
            <ul className="space-y-2.5">
              {serviceLinks.map((link, index) => (
                <li key={index}>
                  <NextLink
                    href={link.href}
                    className="text-sm text-red-50 dark:text-red-100 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </NextLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-white">Hubungi Kami</h4>
            <div className="space-y-3">
              {config?.email && (
                <Link
                  href={`mailto:${config.email}`}
                  className="text-sm text-red-50 dark:text-red-100 hover:text-white transition-colors block"
                >
                  {config.email}
                </Link>
              )}

              {config?.alamat && (
                <p className="text-sm text-red-50 dark:text-red-100 leading-relaxed">
                  {config.alamat}
                </p>
              )}
            </div>

            {/* Social Media */}
            {config?.instagramUrl && (
              <div className="pt-2">
                <p className="text-xs text-red-100 dark:text-red-200 mb-2">Ikuti Kami</p>
                <div className="flex items-center space-x-3">
                  <Link
                    href={config.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-50 dark:text-red-100 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <Divider className="bg-red-400 dark:bg-gray-700 opacity-20 dark:opacity-40" />

        {/* Bottom Footer */}
        <div className="pt-8 text-center">
          <p className="text-sm text-red-50 dark:text-red-100">
            © {currentYear} {config?.siteName || "LPMPP UNSOED"}™. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};