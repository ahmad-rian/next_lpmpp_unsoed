import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import NextTopLoader from "nextjs-toploader";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { ConditionalLayout } from "@/components/conditional-layout";
import { SiteMetadata } from "@/components/site-metadata";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <NextTopLoader
          color="#FF0000"
          initialPosition={0.1}
          crawlSpeed={100}
          height={4}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={100}
          shadow="0 0 15px #FF0000,0 0 8px #FF0000"
          zIndex={9999}
          showAtBottom={false}
        />
        <SiteMetadata />
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <ConditionalLayout>{children}</ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
