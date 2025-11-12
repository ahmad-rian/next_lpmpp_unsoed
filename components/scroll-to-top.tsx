"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { ArrowUpIcon } from "@heroicons/react/24/solid";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 300px
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", toggleVisibility);

    // Clean up
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <Button
          isIconOnly
          className="fixed bottom-8 right-8 z-50 shadow-lg transition-all duration-300 hover:scale-110"
          color="primary"
          size="lg"
          onPress={scrollToTop}
          aria-label="Scroll to top"
        >
          <ArrowUpIcon className="h-5 w-5" />
        </Button>
      )}
    </>
  );
}
