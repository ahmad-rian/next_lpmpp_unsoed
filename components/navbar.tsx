"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { useEffect, useState } from "react";
import Image from "next/image";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";
import { MenuIcons, IconName } from "@/components/menu-icons";
import { AuthButtons } from "./auth-buttons";

interface SiteConfigData {
  id: string;
  siteName: string;
  logoUnsoed?: string;
  logoApp?: string;
  logoDescription?: string;
  visi?: string;
  misi?: string;
  tugas?: string;
  fungsi?: string;
  alamat?: string;
  email?: string;
  instagramUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// ChevronDown icon from Heroicons
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
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
);

export const Navbar = () => {
  const [configData, setConfigData] = useState<SiteConfigData | null>(null);

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

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-2 max-w-fit">
          <NextLink className="flex justify-start items-center gap-2" href="/">
            {(configData?.logoUnsoed || configData?.logoApp) ? (
              <Image
                src={configData.logoUnsoed || configData.logoApp || ""}
                alt={configData.siteName || "Logo"}
                width={28}
                height={28}
                className="rounded"
              />
            ) : (
              <Logo />
            )}
            <p className="font-bold text-sm text-inherit">{configData?.siteName || "LPMPP UNSOED"}</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden lg:flex gap-1" justify="center">
        <ul className="flex gap-3 justify-center items-center">
          {siteConfig.navItems.map((item, index) => (
            <NavbarItem key={`${item.label}-${index}`} className="relative group">
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                  "flex items-center gap-1 text-sm",
                )}
                color="foreground"
                href={item.href}
              >
                <span className="flex items-center gap-1">
                  {item.label}
                  {item.children && item.children.length > 0 && (
                    <ChevronDownIcon className="w-3 h-3 transition-transform group-hover:rotate-180 duration-300" />
                  )}
                </span>
              </NextLink>
              
              {/* Dropdown Card - muncul saat hover */}
              {item.children && item.children.length > 0 && (
                <div className="absolute top-full left-0 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out z-50">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 min-w-[260px] backdrop-blur-sm">
                    <div className="grid gap-1.5">
                      {item.children.map((child: { label: string; href: string; description?: string; icon?: string }, index: number) => (
                        <NextLink
                          key={index}
                          href={child.href}
                          className="group/item flex items-start gap-2.5 p-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                        >
                          {child.icon && (
                            <div className="flex-shrink-0 w-8 h-8 rounded-md bg-primary/10 dark:bg-primary/20 flex items-center justify-center group-hover/item:bg-primary/20 dark:group-hover/item:bg-primary/30 transition-colors">
                              {MenuIcons[child.icon as IconName]}
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="font-semibold text-xs text-gray-900 dark:text-gray-100 group-hover/item:text-primary transition-colors">
                              {child.label}
                            </div>
                            {child.description && (
                              <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">
                                {child.description}
                              </div>
                            )}
                          </div>
                        </NextLink>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex" justify="end">
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden md:flex">
          <AuthButtons />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-1">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item.label}-${index}`}>
              <NextLink
                className="w-full text-sm py-2 block hover:text-primary transition-colors"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};