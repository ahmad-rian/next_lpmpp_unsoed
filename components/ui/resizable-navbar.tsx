"use client";
import { cn } from "@/lib/utils";
import {
    motion,
    AnimatePresence,
    useScroll,
    useMotionValueEvent,
} from "framer-motion";
import Link from "next/link";

import React, { useRef, useState } from "react";

interface NavbarProps {
    children: React.ReactNode;
    className?: string;
}

interface NavBodyProps {
    children: React.ReactNode | ((visible: boolean) => React.ReactNode);
    className?: string;
    visible?: boolean;
}

interface NavItemsProps {
    items: {
        name: string;
        link: string;
        children?: Array<{
            label: string;
            href: string;
            description?: string;
            icon?: React.ReactNode;
        }>;
    }[];
    className?: string;
    onItemClick?: () => void;
}

interface MobileNavProps {
    children: React.ReactNode;
    className?: string;
    visible?: boolean;
}

interface MobileNavHeaderProps {
    children: React.ReactNode;
    className?: string;
}

interface MobileNavMenuProps {
    children: React.ReactNode;
    className?: string;
    isOpen: boolean;
    onClose: () => void;
}

export const Navbar = ({ children, className }: NavbarProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });
    const [visible, setVisible] = useState<boolean>(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 100) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    });

    return (
        <motion.div
            ref={ref}
            className={cn("fixed inset-x-0 top-0 z-50 w-full", className)}
        >
            {React.Children.map(children, (child) =>
                React.isValidElement(child)
                    ? React.cloneElement(
                        child as React.ReactElement<{ visible?: boolean }>,
                        { visible }
                    )
                    : child
            )}
        </motion.div>
    );
};

export const NavBody = ({ children, className, visible = false }: NavBodyProps) => {
    return (
        <motion.div
            animate={{
                backdropFilter: visible ? "blur(10px)" : "none",
                boxShadow: visible
                    ? "0 0 24px rgba(220, 38, 38, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(220, 38, 38, 0.04), 0 0 4px rgba(220, 38, 38, 0.08), 0 16px 68px rgba(220, 38, 38, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
                    : "none",
                width: visible ? "60%" : "100%",
                y: visible ? 20 : 0,
            }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 50,
            }}
            style={{
                minWidth: "800px",
            }}
            className={cn(
                "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full bg-transparent px-6 py-3 lg:flex dark:bg-transparent",
                visible && "bg-white/80 dark:bg-zinc-900/80",
                className
            )}
            suppressHydrationWarning
        >
            {typeof children === "function" ? children(visible) : children}
        </motion.div>
    );
};

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
    const [hovered, setHovered] = useState<number | null>(null);

    return (
        <motion.div
            onMouseLeave={() => setHovered(null)}
            className={cn(
                "absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium text-zinc-600 transition duration-200 hover:text-zinc-800 lg:flex lg:space-x-2",
                className
            )}
        >
            {items.map((item, idx) => (
                <div key={`nav-item-${idx}`} className="relative group">
                    <Link
                        onMouseEnter={() => setHovered(idx)}
                        onClick={onItemClick}
                        className="relative px-4 py-2 text-neutral-600 dark:text-neutral-300 flex items-center gap-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors"
                        href={item.link}
                    >
                        {hovered === idx && (
                            <motion.div
                                layoutId="hovered"
                                className="absolute inset-0 h-full w-full rounded-full bg-red-50 dark:bg-red-950/30"
                            />
                        )}
                        <span className="relative z-20">{item.name}</span>
                        {item.children && item.children.length > 0 && (
                            <svg
                                className="relative z-20 w-3 h-3 transition-transform group-hover:rotate-180 duration-300"
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
                        )}
                    </Link>

                    {/* Dropdown Menu */}
                    {item.children && item.children.length > 0 && (
                        <div className="absolute top-full left-0 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out z-[70]">
                            <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-red-200 dark:border-red-900/50 p-4 min-w-[280px] backdrop-blur-sm">
                                <div className="grid gap-2">
                                    {item.children.map((child, childIdx) => (
                                        <Link
                                            key={`child-${idx}-${childIdx}`}
                                            href={child.href}
                                            className="group/item flex items-start gap-3 p-3 rounded-lg transition-all duration-200 border border-transparent hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-900/50"
                                        >
                                            {child.icon && (
                                                <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all bg-red-50 dark:bg-red-950/30 group-hover/item:bg-red-100 dark:group-hover/item:bg-red-900/40 group-hover/item:scale-105">
                                                    <span className="text-red-600 dark:text-red-400">
                                                        {child.icon}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <div className="font-semibold text-sm transition-colors text-gray-900 dark:text-gray-100 group-hover/item:text-red-600 dark:group-hover/item:text-red-400">
                                                    {child.label}
                                                </div>
                                                {child.description && (
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                                        {child.description}
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </motion.div>
    );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
    return (
        <motion.div
            animate={{
                backdropFilter: visible ? "blur(10px)" : "none",
                boxShadow: visible
                    ? "0 0 24px rgba(220, 38, 38, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(220, 38, 38, 0.04), 0 0 4px rgba(220, 38, 38, 0.08), 0 16px 68px rgba(220, 38, 38, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
                    : "none",
                width: visible ? "90%" : "100%",
                paddingRight: visible ? "12px" : "0px",
                paddingLeft: visible ? "12px" : "0px",
                borderRadius: visible ? "16px" : "2rem",
                y: visible ? 8 : 0,
            }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 50,
            }}
            className={cn(
                "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-0 py-3 lg:hidden",
                visible && "bg-white/80 dark:bg-zinc-900/80",
                className
            )}
            suppressHydrationWarning
        >
            {children}
        </motion.div>
    );
};

export const MobileNavHeader = ({
    children,
    className,
}: MobileNavHeaderProps) => {
    return (
        <div
            className={cn(
                "flex w-full flex-row items-center justify-between px-4",
                className
            )}
        >
            {children}
        </div>
    );
};

export const MobileNavMenu = ({
    children,
    className,
    isOpen,
    onClose,
}: MobileNavMenuProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={cn(
                        "w-full flex flex-col items-start justify-start gap-4 rounded-lg bg-white px-4 py-8 shadow-[0_0_24px_rgba(220,38,38,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(220,38,38,0.04),0_0_4px_rgba(220,38,38,0.08),0_16px_68px_rgba(220,38,38,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] dark:bg-zinc-950",
                        className
                    )}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export const MobileNavToggle = ({
    isOpen,
    onClick,
}: {
    isOpen: boolean;
    onClick: () => void;
}) => {
    return (
        <button
            onClick={onClick}
            className="p-2 text-black dark:text-white transition-colors hover:opacity-70"
            aria-label="Toggle menu"
        >
            {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            )}
        </button>
    );
};

export const NavbarLogo = ({
    logoSrc,
    logoAlt,
    siteName,
    visible,
}: {
    logoSrc?: string;
    logoAlt?: string;
    siteName?: string;
    visible?: boolean;
}) => {
    return (
        <Link
            href="/"
            className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black"
        >
            {logoSrc ? (
                <img src={logoSrc} alt={logoAlt || "Logo"} width={32} height={32} className="rounded" />
            ) : (
                <div className="w-8 h-8 bg-red-600 rounded" />
            )}
            {!visible && (
                <span
                    className="font-bold text-black dark:text-white transition-opacity duration-300"
                    suppressHydrationWarning
                >
                    {siteName || "LPMPP UNSOED"}
                </span>
            )}
        </Link>
    );
};

export const NavbarButton = ({
    href,
    as: Tag = "a",
    children,
    className,
    variant = "primary",
    ...props
}: {
    href?: string;
    as?: React.ElementType;
    children: React.ReactNode;
    className?: string;
    variant?: "primary" | "secondary" | "dark" | "gradient";
} & (
        | React.ComponentPropsWithoutRef<"a">
        | React.ComponentPropsWithoutRef<"button">
    )) => {
    const baseStyles =
        "px-4 py-2 rounded-md text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center";

    const variantStyles = {
        primary:
            "bg-red-600 text-white shadow-[0_0_24px_rgba(220,38,38,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(220,38,38,0.04),0_0_4px_rgba(220,38,38,0.08),0_16px_68px_rgba(220,38,38,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] hover:bg-red-700",
        secondary: "bg-transparent shadow-none text-black dark:text-white hover:bg-red-50 dark:hover:bg-red-950/30",
        dark: "bg-black text-white shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset]",
        gradient:
            "bg-gradient-to-b from-red-500 to-red-700 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset]",
    };

    return (
        <Tag
            href={href || undefined}
            className={cn(baseStyles, variantStyles[variant], className)}
            {...props}
        >
            {children}
        </Tag>
    );
};
