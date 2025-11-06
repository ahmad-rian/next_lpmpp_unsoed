"use client";

import { useEffect } from "react";

export function SiteMetadata() {
  useEffect(() => {
    const fetchAndUpdateMetadata = async () => {
      try {
        const response = await fetch("/api/site-config");
        if (response.ok) {
          const data = await response.json();
          
          // Update page title
          if (data.siteName) {
            document.title = data.siteName;
          }
          
          // Update favicon (using logoApp as favicon)
          const faviconUrl = data.logoApp || data.logoUnsoed;
          if (faviconUrl) {
            let link = document.querySelector("link[rel='icon']") as HTMLLinkElement;
            if (!link) {
              link = document.createElement("link");
              link.rel = "icon";
              document.head.appendChild(link);
            }
            link.href = faviconUrl;
          }
        }
      } catch (error) {
        console.error("Error updating site metadata:", error);
      }
    };

    fetchAndUpdateMetadata();
  }, []);

  return null;
}
