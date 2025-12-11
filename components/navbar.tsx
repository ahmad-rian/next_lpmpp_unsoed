"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

import {
  Navbar as ResizableNavbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { AuthButtons } from "./auth-buttons";
import { MenuIcons, IconName } from "@/components/menu-icons";

interface SiteConfigData {
  id: string;
  siteName: string;
  logoUnsoed?: string;
  logoApp?: string;
  logoDescription?: string;
}

export const Navbar = () => {
  const [configData, setConfigData] = useState<SiteConfigData | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: number]: boolean }>({});
  const pathname = usePathname();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("/api/site-config");
        if (response.ok) {
          const data = await response.json();
          setConfigData(data);
        }
      } catch (error) {
        console.error("Error fetching site config:", error);
      }
    };

    fetchConfig();
  }, []);

  // Auto-close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  // Transform siteConfig.navItems to match NavItems format
  const navItems: {
    name: string;
    link: string;
    children?: Array<{
      label: string;
      href: string;
      description?: string;
      icon?: React.ReactNode;
    }>;
  }[] = siteConfig.navItems.slice(0, 6).map((item) => ({
    name: item.label,
    link: item.href,
    children: item.children?.map((child) => ({
      label: child.label,
      href: child.href,
      description: child.description,
      icon: child.icon ? MenuIcons[child.icon as IconName] : undefined,
    })),
  }));

  return (
    <div className="relative w-full">
      <ResizableNavbar>
        {/* Desktop Navigation */}
        <NavBody>
          {(visible) => (
            <>
              <NavbarLogo
                logoSrc={configData?.logoApp || configData?.logoUnsoed}
                logoAlt={configData?.siteName || "Logo LPMPP"}
                siteName={configData?.siteName || "LPMPP UNSOED"}
                visible={visible}
              />
              <NavItems items={navItems} />
              <div className="flex items-center gap-4">
                <ThemeSwitch />
                <AuthButtons />
              </div>
            </>
          )}
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo
              logoSrc={configData?.logoApp || configData?.logoUnsoed}
              logoAlt={configData?.siteName || "Logo LPMPP"}
              siteName={configData?.siteName || "LPMPP UNSOED"}
            />
            <div className="flex items-center gap-3">
              <ThemeSwitch />
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </div>
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <div key={`mobile-item-${idx}`} className="w-full">
                {item.children && item.children.length > 0 ? (
                  <div>
                    <button
                      onClick={() => {
                        const newOpen = { ...openDropdowns };
                        newOpen[idx] = !newOpen[idx];
                        setOpenDropdowns(newOpen);
                      }}
                      className={`w-full flex items-center justify-between font-semibold transition-colors py-2 ${isActive(item.link)
                        ? "text-red-600 dark:text-red-400"
                        : "text-neutral-600 dark:text-neutral-300"
                        }`}
                    >
                      <span>{item.name}</span>
                      <svg
                        className={`w-4 h-4 transition-transform ${openDropdowns[idx] ? "rotate-180" : ""
                          }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </button>
                    {openDropdowns[idx] && (
                      <div className="ml-4 mt-2 flex flex-col gap-2">
                        {item.children.map((child, childIdx) => (
                          <a
                            key={`mobile-child-${idx}-${childIdx}`}
                            href={child.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-2 text-sm py-2 transition-colors ${isActive(child.href)
                              ? "text-red-600 dark:text-red-400 font-semibold"
                              : "text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                              }`}
                          >
                            {child.icon && (
                              <span className="text-red-600 dark:text-red-400">
                                {child.icon}
                              </span>
                            )}
                            {child.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    href={item.link}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block font-semibold transition-colors py-2 ${isActive(item.link)
                      ? "text-red-600 dark:text-red-400"
                      : "text-neutral-600 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400"
                      }`}
                  >
                    {item.name}
                  </a>
                )}
              </div>
            ))}
            <div className="flex w-full flex-col gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-700">
              <AuthButtons />
            </div>
          </MobileNavMenu>
        </MobileNav>
      </ResizableNavbar>

      {/* Spacer to prevent content from going under fixed navbar - Minimal */}
      <div className="h-14 md:h-16" />
    </div>
  );
};