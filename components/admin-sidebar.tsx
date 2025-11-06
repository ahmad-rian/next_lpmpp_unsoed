"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@heroui/button";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { signOut, useSession } from "next-auth/react";
import {
  HomeIcon,
  UsersIcon,
  DocumentIcon,
  CogIcon,
  ChartBarIcon,
  LogoutIcon,
} from "@/components/admin-icons";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: HomeIcon,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: UsersIcon,
  },
  {
    title: "Content",
    href: "/admin/content",
    icon: DocumentIcon,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: ChartBarIcon,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: CogIcon,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="w-64 min-h-screen border-r border-divider bg-background">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-primary">Admin Panel</h2>
        <p className="text-sm text-default-500 mt-1">LPMPP UNSOED</p>
      </div>

      <Divider />

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-default-100 text-default-700"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.title}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <Divider className="my-4" />

      <div className="p-4">
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                {session?.user?.name?.[0] || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {session?.user?.name || "Admin"}
                </p>
                <p className="text-xs text-default-500 truncate">
                  {session?.user?.email}
                </p>
              </div>
            </div>
            <Button
              color="danger"
              variant="flat"
              size="sm"
              className="w-full"
              startContent={<LogoutIcon className="w-4 h-4" />}
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Logout
            </Button>
          </CardBody>
        </Card>
      </div>
    </aside>
  );
}
