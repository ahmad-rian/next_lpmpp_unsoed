"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";
import { AuthButtons } from "./auth-buttons";

interface SiteConfigData {
    id: string;
    siteName: string;
    logoUnsoed?: string;
    logoApp?: string;
    logoDescription?: string;
}

export const NavbarModern = () => {
    const [configData, setConfigData] = useState<SiteConfigData | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
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

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Auto-close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    const isActive = (href: string) => {
        if (href === "/") {
            return pathname === "/";
        }
        return pathname.startsWith(href);
    };

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
                {/* Desktop Navigation */}
                <div
                    className={clsx(
                        "hidden lg:flex mx-auto transition-all duration-300 ease-out",
                        scrolled
                            ? "max-w-3xl mt-5 rounded-full shadow-[0_0_24px_rgba(220,38,38,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(220,38,38,0.04),0_0_4px_rgba(220,38,38,0.08),0_16px_68px_rgba(220,38,38,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl"
                            : "max-w-7xl bg-transparent"
                    )}
                >
                    <div className="w-full px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            {/* Logo */}
                            <div className="flex items-center space-x-3">
                                <NextLink href="/" className="flex items-center space-x-3 group">
                                    {configData?.logoApp || configData?.logoUnsoed ? (
                                        <Image
                                            src={configData.logoApp || configData.logoUnsoed || ""}
                                            alt={configData.siteName || "Logo LPMPP"}
                                            width={32}
                                            height={32}
                                            className="rounded"
                                        />
                                    ) : (
                                        <Logo />
                                    )}
                                    <span className="font-bold text-sm text-inherit">
                                        {configData?.siteName || "LPMPP UNSOED"}
                                    </span>
                                </NextLink>
                            </div>

                            {/* Center Navigation Links */}
                            <div
                                className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-1"
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                {siteConfig.navItems.slice(0, 6).map((item, index) => (
                                    <NextLink
                                        key={index}
                                        href={item.href}
                                        className="relative px-5 py-2 text-sm font-semibold text-black dark:text-white transition-colors"
                                        onMouseEnter={() => setHoveredIndex(index)}
                                    >
                                        <span className="relative z-10">{item.label}</span>
                                        {hoveredIndex === index && (
                                            <div className="absolute inset-0 rounded-full bg-red-50 dark:bg-red-950/30 transition-all duration-200" />
                                        )}
                                        {isActive(item.href) && hoveredIndex !== index && (
                                            <div className="absolute inset-0 rounded-full bg-red-100 dark:bg-red-950/50" />
                                        )}
                                    </NextLink>
                                ))}
                            </div>

                            {/* Right Actions */}
                            <div className="flex items-center space-x-3">
                                <ThemeSwitch />
                                <AuthButtons />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div
                    className={clsx(
                        "lg:hidden mx-auto transition-all duration-300 ease-out",
                        scrolled
                            ? "max-w-[calc(100vw-2rem)] mt-2 mx-4 px-3 rounded-2xl shadow-[0_0_24px_rgba(220,38,38,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(220,38,38,0.04),0_0_4px_rgba(220,38,38,0.08),0_16px_68px_rgba(220,38,38,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl"
                            : "bg-transparent"
                    )}
                >
                    <div className="px-4 sm:px-6">
                        <div className="flex h-16 items-center justify-between">
                            {/* Logo */}
                            <NextLink href="/" className="flex items-center space-x-3">
                                {configData?.logoApp || configData?.logoUnsoed ? (
                                    <Image
                                        src={configData.logoApp || configData.logoUnsoed || ""}
                                        alt={configData.siteName || "Logo LPMPP"}
                                        width={28}
                                        height={28}
                                        className="rounded"
                                    />
                                ) : (
                                    <Logo />
                                )}
                                <span className="font-bold text-xs text-inherit">
                                    {configData?.siteName || "LPMPP UNSOED"}
                                </span>
                            </NextLink>

                            {/* Mobile Menu Toggle & Theme Toggle */}
                            <div className="flex items-center space-x-3">
                                <ThemeSwitch />

                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className="p-2 text-black dark:text-white transition-colors hover:opacity-70"
                                    aria-label="Toggle menu"
                                >
                                    {!mobileMenuOpen ? (
                                        <svg
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 6h16M4 12h16M4 18h16"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div
                            className="absolute left-4 right-4 mt-2 z-50 flex flex-col gap-4 rounded-2xl bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl px-6 py-8 shadow-[0_0_24px_rgba(220,38,38,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(220,38,38,0.04),0_0_4px_rgba(220,38,38,0.08),0_16px_68px_rgba(220,38,38,0.05),0_1px_0_rgba(255,255,255,0.1)_inset]"
                            onClick={(e) => {
                                if (e.target === e.currentTarget) {
                                    setMobileMenuOpen(false);
                                }
                            }}
                        >
                            {siteConfig.navItems.map((item, index) => (
                                <NextLink
                                    key={index}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={clsx(
                                        "block font-semibold transition-colors hover:opacity-70",
                                        isActive(item.href)
                                            ? "text-red-600 dark:text-red-400"
                                            : "text-black dark:text-white"
                                    )}
                                >
                                    {item.label}
                                </NextLink>
                            ))}

                            <div className="mt-4 flex flex-col gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-700">
                                <AuthButtons />
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Spacer to prevent content from going under fixed navbar */}
            <div className="h-16" />
        </>
    );
};
