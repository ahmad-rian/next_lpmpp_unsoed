"use client";

import React from "react";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/navbar";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";
import { signOut, useSession } from "next-auth/react";

// Heroicons Components
const LayoutDashboardIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);

const CogIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const FileTextIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const LogOutIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
  </svg>
);

const UserCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export function AdminNavbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboardIcon },
    { label: "Konfigurasi Situs", href: "/admin/site-config", icon: CogIcon },
    { label: "User Management", href: "/admin/users", icon: UsersIcon },
  ];

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/signin" });
  };

  return (
    <HeroUINavbar 
      maxWidth="full" 
      position="sticky"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      classNames={{
        base: "bg-background/60 backdrop-blur-md border-b border-divider",
      }}
    >
      {/* Mobile Menu Toggle */}
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
      </NavbarContent>

      {/* Brand */}
      <NavbarContent className="sm:flex-grow-0" justify="start">
        <NavbarBrand as="li" className="gap-2">
          <NextLink className="flex justify-start items-center gap-2" href="/admin">
            <Logo />
            <div>
              <p className="font-bold text-inherit text-sm">Admin Panel</p>
              <p className="text-xs text-default-500 hidden sm:block">LPMPP UNSOED</p>
            </div>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop Navigation */}
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {/* Dashboard */}
        <NavbarItem isActive={pathname === "/admin"}>
          <NextLink
            href="/admin"
            className={clsx(
              "flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
              pathname === "/admin"
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-default-600 hover:text-primary hover:bg-default-100"
            )}
          >
            <LayoutDashboardIcon className="w-4 h-4" />
            Dashboard
          </NextLink>
        </NavbarItem>

        {/* Data Master Dropdown */}
        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <button
                className={clsx(
                  "flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
                  (pathname === "/admin/site-config" || pathname === "/admin/users")
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-default-600 hover:text-primary hover:bg-default-100"
                )}
              >
                <FileTextIcon className="w-4 h-4" />
                Data Master
                <ChevronDownIcon className="w-4 h-4" />
              </button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu aria-label="Data Master Menu">
            <DropdownItem
              key="site-config"
              startContent={<CogIcon className="w-4 h-4" />}
              href="/admin/site-config"
              className={pathname === "/admin/site-config" ? "bg-primary/10" : ""}
            >
              Konfigurasi Situs
            </DropdownItem>
            <DropdownItem
              key="users"
              startContent={<UsersIcon className="w-4 h-4" />}
              href="/admin/users"
              className={pathname === "/admin/users" ? "bg-primary/10" : ""}
            >
              User Management
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      {/* Right Side - Theme + Profile Dropdown */}
      <NavbarContent justify="end">
        <NavbarItem className="hidden sm:flex">
          <ThemeSwitch />
        </NavbarItem>
        
        {/* Profile Dropdown - Avatar + Name yang bisa diklik jadi dropdown */}
        <NavbarItem>
          {session?.user ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <button className="flex items-center gap-2 outline-none transition-transform hover:scale-105">
                  <Avatar
                    src={session.user.image || undefined}
                    name={session.user.name || session.user.email || "Admin"}
                    size="sm"
                    showFallback
                    isBordered
                    color="primary"
                    imgProps={{
                      referrerPolicy: "no-referrer"
                    }}
                  />
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold">{session.user.name || "Admin"}</p>
                    <p className="text-xs text-default-500 uppercase">{session.user.role || "Admin"}</p>
                  </div>
                </button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                {/* Profile Header */}
                <DropdownItem 
                  key="profile" 
                  className="h-14 gap-2" 
                  textValue="Profile"
                  isReadOnly
                  classNames={{
                    base: "cursor-default hover:bg-transparent"
                  }}
                >
                  <p className="font-semibold text-xs text-default-500">Signed in as</p>
                  <p className="font-semibold text-sm truncate max-w-[200px]">{session.user.email}</p>
                </DropdownItem>
                
                {/* User Info */}
                <DropdownItem
                  key="user-info"
                  startContent={<UserCircleIcon className="w-5 h-5 text-default-400" />}
                  textValue="User Info"
                  isReadOnly
                  classNames={{
                    base: "cursor-default hover:bg-transparent"
                  }}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{session.user.name || "No Name"}</span>
                    <span className="text-xs text-default-500 capitalize">{session.user.role || "Admin"}</span>
                  </div>
                </DropdownItem>
                
                {/* Divider */}
                <DropdownItem
                  key="divider"
                  isReadOnly
                  textValue="divider"
                  classNames={{
                    base: "h-px bg-divider my-1 p-0 cursor-default"
                  }}
                />
                
                {/* Logout */}
                <DropdownItem
                  key="logout"
                  color="danger"
                  startContent={<LogOutIcon className="w-5 h-5" />}
                  onPress={handleLogout}
                  classNames={{
                    base: "text-danger data-[hover=true]:text-danger data-[hover=true]:bg-danger-50"
                  }}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Avatar
              size="sm"
              showFallback
              name="?"
            />
          )}
        </NavbarItem>
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu>
        {/* Theme Switch for Mobile */}
        <NavbarMenuItem>
          <div className="flex items-center justify-between w-full px-4 py-3">
            <span className="text-default-600 font-medium">Theme</span>
            <ThemeSwitch />
          </div>
        </NavbarMenuItem>

        {/* Menu Items */}
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <NavbarMenuItem key={`${item.label}-${index}`}>
              <NextLink
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-default-600 hover:bg-default-100"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </NextLink>
            </NavbarMenuItem>
          );
        })}

        {/* User Info in Mobile */}
        {session?.user && (
          <>
            <NavbarMenuItem>
              <div className="border-t border-divider my-2" />
            </NavbarMenuItem>
            
            <NavbarMenuItem>
              <div className="flex items-center gap-3 w-full px-4 py-3">
                <Avatar
                  src={session.user.image || undefined}
                  name={session.user.name || session.user.email || "Admin"}
                  size="sm"
                  showFallback
                  isBordered
                  color="primary"
                  imgProps={{
                    referrerPolicy: "no-referrer"
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{session.user.name || "No Name"}</p>
                  <p className="text-xs text-default-500 truncate">{session.user.email}</p>
                  <p className="text-xs text-default-400 capitalize">{session.user.role || "Admin"}</p>
                </div>
              </div>
            </NavbarMenuItem>
            
            {/* Logout Button for Mobile */}
            <NavbarMenuItem>
              <Button
                color="danger"
                variant="flat"
                className="w-full"
                startContent={<LogOutIcon className="w-5 h-5" />}
                onPress={handleLogout}
              >
                Log Out
              </Button>
            </NavbarMenuItem>
          </>
        )}
      </NavbarMenu>
    </HeroUINavbar>
  );
}