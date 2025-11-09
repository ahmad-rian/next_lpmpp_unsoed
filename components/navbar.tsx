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
import { Accordion, AccordionItem } from "@heroui/accordion";
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
  visiUnsoed?: string;
  misiUnsoed?: string;
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

// Additional HeroIcons for mobile menu
const HomeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

const UserGroupIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
  </svg>
);

const BuildingOfficeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
  </svg>
);

const ClipboardDocumentListIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h4.125M8.25 8.25h5.25a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-.75.75h-5.25a.75.75 0 0 1-.75-.75V9a.75.75 0 0 1 .75-.75Z" />
  </svg>
);

const TrophyIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M15.5 4.148c.618.847.994 1.847 1.007 2.852-.01.001-.02.002-.03.003a6.72 6.72 0 0 1-3.977-.503m-9 0A9.97 9.97 0 0 0 12 2.25c3.522 0 6.775 1.824 8.6 4.8a1.5 1.5 0 0 1-2.95 1.9 6.47 6.47 0 0 0-12.9 0 1.5 1.5 0 0 1-2.95-1.9Z" />
  </svg>
);

const AcademicCapIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443a55.381 55.381 0 0 1 5.25 2.882V15" />
  </svg>
);

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
  </svg>
);

const NewspaperIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5M5.25 4.5h13.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25H5.25a2.25 2.25 0 0 1-2.25-2.25V6.75a2.25 2.25 0 0 1 2.25-2.25Z" />
  </svg>
);

const FolderIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25H11.69Z" />
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
      <NavbarContent className="basis-1/4 lg:basis-1/4" justify="start">
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
            <p className="font-bold text-xs text-inherit">{configData?.siteName || "LPMPP UNSOED"}</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden lg:flex basis-3/5 lg:basis-1/2" justify="center">
        <ul className="flex gap-1 justify-center items-center">
          {siteConfig.navItems.map((item, index) => (
            <NavbarItem key={`${item.label}-${index}`} className="relative group">
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                  "flex items-center gap-1 text-sm px-2 py-2 rounded-lg hover:bg-default-100 transition-all duration-200",
                )}
                color="foreground"
                href={item.href}
              >
                <span className="flex items-center gap-1 whitespace-nowrap">
                  {item.label}
                  {item.children && item.children.length > 0 && (
                    <ChevronDownIcon className="w-3 h-3 transition-transform group-hover:rotate-180 duration-300" />
                  )}
                </span>
              </NextLink>
              
              {/* Dropdown Card - muncul saat hover */}
              {item.children && item.children.length > 0 && (
                <div className="absolute top-full left-0 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out z-50">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 min-w-[280px] backdrop-blur-sm">
                    <div className="grid gap-2">
                      {item.children.map((child: { label: string; href: string; description?: string; icon?: string }, index: number) => (
                        <NextLink
                          key={index}
                          href={child.href}
                          className="group/item flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                        >
                          {child.icon && (
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center group-hover/item:bg-primary/20 dark:group-hover/item:bg-primary/30 transition-colors group-hover/item:scale-105">
                              {MenuIcons[child.icon as IconName]}
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 group-hover/item:text-primary transition-colors">
                              {child.label}
                            </div>
                            {child.description && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
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

      <NavbarContent className="hidden sm:flex gap-2 basis-1/4 lg:basis-1/4" justify="end">
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem>
          <AuthButtons />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {/* Beranda */}
          <NavbarMenuItem>
            <NextLink
              className="w-full text-sm py-3 px-4 block hover:bg-default-100 rounded-lg transition-all duration-200 font-medium text-foreground hover:text-primary flex items-center gap-3"
              href="/"
            >
              <HomeIcon className="w-5 h-5 text-primary" />
              Beranda
            </NextLink>
          </NavbarMenuItem>
          
          {/* Accordion untuk menu dengan children */}
          <NavbarMenuItem>
            <Accordion 
              variant="light" 
              className="px-0"
              itemClasses={{
                base: "py-0",
                title: "font-medium text-sm text-foreground",
                trigger: "px-4 py-3 data-[hover=true]:bg-default-100 rounded-lg",
                content: "text-small px-0 pb-2",
              }}
            >
              {/* Profil LPMPP */}
              <AccordionItem
                key="profil"
                aria-label="Profil LPMPP"
                title={
                  <div className="flex items-center gap-3">
                    <UserGroupIcon className="w-5 h-5 text-primary" />
                    <span>Profil LPMPP</span>
                  </div>
                }
              >
                <div className="flex flex-col gap-1 ml-8">
                  <NextLink
                    href="/about"
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-default-100 transition-colors text-sm text-default-600 hover:text-primary"
                  >
                    {MenuIcons.information}
                    <div>
                      <div className="font-medium">Tentang Kami</div>
                      <div className="text-xs text-default-400">Informasi umum LPMPP UNSOED</div>
                    </div>
                  </NextLink>
                  <NextLink
                    href="/pimpinan"
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-default-100 transition-colors text-sm text-default-600 hover:text-primary"
                  >
                    {MenuIcons.users}
                    <div>
                      <div className="font-medium">Pimpinan Lembaga</div>
                      <div className="text-xs text-default-400">Struktur kepemimpinan</div>
                    </div>
                  </NextLink>
                  <NextLink
                    href="/tata-usaha"
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-default-100 transition-colors text-sm text-default-600 hover:text-primary"
                  >
                    {MenuIcons.briefcase}
                    <div>
                      <div className="font-medium">Tata Usaha</div>
                      <div className="text-xs text-default-400">Staff dan kepegawaian</div>
                    </div>
                  </NextLink>
                </div>
              </AccordionItem>

              {/* Unit Kerja */}
              <AccordionItem
                key="unit-kerja"
                aria-label="Unit Kerja"
                title={
                  <div className="flex items-center gap-3">
                    <BuildingOfficeIcon className="w-5 h-5 text-primary" />
                    <span>Unit Kerja</span>
                  </div>
                }
              >
                <div className="flex flex-col gap-1 ml-8">
                  <NextLink
                    href="/pusat-unit"
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-default-100 transition-colors text-sm text-default-600 hover:text-primary"
                  >
                    {MenuIcons.building}
                    <div>
                      <div className="font-medium">Pusat & Unit</div>
                      <div className="text-xs text-default-400">Daftar pusat dan unit kerja</div>
                    </div>
                  </NextLink>
                  <NextLink
                    href="/fakultas"
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-default-100 transition-colors text-sm text-default-600 hover:text-primary"
                  >
                    {MenuIcons.academic}
                    <div>
                      <div className="font-medium">Fakultas</div>
                      <div className="text-xs text-default-400">Informasi fakultas</div>
                    </div>
                  </NextLink>
                </div>
              </AccordionItem>

              {/* SPMI */}
              <AccordionItem
                key="spmi"
                aria-label="SPMI"
                title={
                  <div className="flex items-center gap-3">
                    <ClipboardDocumentListIcon className="w-5 h-5 text-primary" />
                    <span>SPMI</span>
                  </div>
                }
              >
                <div className="flex flex-col gap-1 ml-8">
                  <NextLink
                    href="/spmi/gpm"
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-default-100 transition-colors text-sm text-default-600 hover:text-primary"
                  >
                    {MenuIcons.clipboard}
                    <div>
                      <div className="font-medium">Dokumen GPM</div>
                      <div className="text-xs text-default-400">Dokumen Gugus Penjaminan Mutu</div>
                    </div>
                  </NextLink>
                  <NextLink
                    href="/spmi/dokumen"
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-default-100 transition-colors text-sm text-default-600 hover:text-primary"
                  >
                    {MenuIcons.document}
                    <div>
                      <div className="font-medium">Dokumen SPMI</div>
                      <div className="text-xs text-default-400">Sistem Penjaminan Mutu Internal</div>
                    </div>
                  </NextLink>
                </div>
              </AccordionItem>

              {/* Akreditasi */}
              <AccordionItem
                key="akreditasi"
                aria-label="Akreditasi"
                title={
                  <div className="flex items-center gap-3">
                    <TrophyIcon className="w-5 h-5 text-primary" />
                    <span>Akreditasi</span>
                  </div>
                }
              >
                <div className="flex flex-col gap-1 ml-8">
                  <NextLink
                    href="/akreditasi/pt"
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-default-100 transition-colors text-sm text-default-600 hover:text-primary"
                  >
                    {MenuIcons.certificate}
                    <div>
                      <div className="font-medium">Akreditasi PT</div>
                      <div className="text-xs text-default-400">Akreditasi Perguruan Tinggi</div>
                    </div>
                  </NextLink>
                  <NextLink
                    href="/akreditasi/prodi"
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-default-100 transition-colors text-sm text-default-600 hover:text-primary"
                  >
                    {MenuIcons.award}
                    <div>
                      <div className="font-medium">Akreditasi Prodi</div>
                      <div className="text-xs text-default-400">Akreditasi Program Studi</div>
                    </div>
                  </NextLink>
                  <NextLink
                    href="/akreditasi/internasional"
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-default-100 transition-colors text-sm text-default-600 hover:text-primary"
                  >
                    {MenuIcons.globe}
                    <div>
                      <div className="font-medium">Akreditasi Internasional</div>
                      <div className="text-xs text-default-400">Akreditasi tingkat internasional</div>
                    </div>
                  </NextLink>
                </div>
              </AccordionItem>

              {/* Kepakaran */}
              <AccordionItem
                key="kepakaran"
                aria-label="Kepakaran"
                title={
                  <div className="flex items-center gap-3">
                    <AcademicCapIcon className="w-5 h-5 text-primary" />
                    <span>Kepakaran</span>
                  </div>
                }
              >
                <div className="flex flex-col gap-1 ml-8">
                  <NextLink
                    href="/kepakaran/mbkm"
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-default-100 transition-colors text-sm text-default-600 hover:text-primary"
                  >
                    {MenuIcons.book}
                    <div>
                      <div className="font-medium">MBKM</div>
                      <div className="text-xs text-default-400">Merdeka Belajar Kampus Merdeka</div>
                    </div>
                  </NextLink>
                  <NextLink
                    href="/kepakaran/asesor"
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-default-100 transition-colors text-sm text-default-600 hover:text-primary"
                  >
                    {MenuIcons.usercheck}
                    <div>
                      <div className="font-medium">Asesor</div>
                      <div className="text-xs text-default-400">Daftar asesor</div>
                    </div>
                  </NextLink>
                  <NextLink
                    href="/kepakaran/auditor"
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-default-100 transition-colors text-sm text-default-600 hover:text-primary"
                  >
                    {MenuIcons.shield}
                    <div>
                      <div className="font-medium">Auditor</div>
                      <div className="text-xs text-default-400">Daftar auditor</div>
                    </div>
                  </NextLink>
                </div>
              </AccordionItem>
            </Accordion>
          </NavbarMenuItem>

          {/* Menu tunggal */}
          <NavbarMenuItem>
            <NextLink
              className="w-full text-sm py-3 px-4 block hover:bg-default-100 rounded-lg transition-all duration-200 font-medium text-foreground hover:text-primary flex items-center gap-3"
              href="/program-unggulan"
            >
              <StarIcon className="w-5 h-5 text-primary" />
              Program Unggulan
            </NextLink>
          </NavbarMenuItem>

          <NavbarMenuItem>
            <NextLink
              className="w-full text-sm py-3 px-4 block hover:bg-default-100 rounded-lg transition-all duration-200 font-medium text-foreground hover:text-primary flex items-center gap-3"
              href="/berita"
            >
              <NewspaperIcon className="w-5 h-5 text-primary" />
              Berita
            </NextLink>
          </NavbarMenuItem>

          <NavbarMenuItem>
            <NextLink
              className="w-full text-sm py-3 px-4 block hover:bg-default-100 rounded-lg transition-all duration-200 font-medium text-foreground hover:text-primary flex items-center gap-3"
              href="/unduhan"
            >
              <FolderIcon className="w-5 h-5 text-primary" />
              Unduhan
            </NextLink>
          </NavbarMenuItem>

          {/* Auth Buttons untuk Mobile */}
          <NavbarMenuItem className="mt-4 border-t border-divider pt-4">
            <AuthButtons />
          </NavbarMenuItem>
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};