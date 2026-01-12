"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

interface Language {
  code: string;
  name: string;
  flag: string;
}

const LANGUAGES: Language[] = [
  { code: "id", name: "Indonesia", flag: "🇮🇩" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "zh-CN", name: "中文", flag: "🇨🇳" },
];

export function GoogleTranslateWidget() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>(LANGUAGES[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Avoid loading multiple times
    if (window.google?.translate) {
      setIsLoaded(true);
      return;
    }

    // Define the init function
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "id",
          includedLanguages: "id,en,zh-CN",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element_hidden"
      );
      setIsLoaded(true);
    };

    // Load the script
    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src*="translate.google.com"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  // Detect current language from cookie
  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
    };

    const googleCookie = getCookie("googtrans");
    if (googleCookie) {
      const langCode = googleCookie.split("/").pop();
      const found = LANGUAGES.find((l) => l.code === langCode);
      if (found) setCurrentLang(found);
    }
  }, [isLoaded]);

  const changeLanguage = useCallback((lang: Language) => {
    if (lang.code === currentLang.code) {
      setIsOpen(false);
      return;
    }

    setIsOpen(false);

    // Set cookie for Google Translate
    const domain = window.location.hostname;
    document.cookie = `googtrans=/id/${lang.code}; path=/; domain=${domain}`;
    document.cookie = `googtrans=/id/${lang.code}; path=/`;

    // Reload page langsung untuk translate seluruh halaman
    window.location.reload();
  }, [currentLang.code]);

  return (
    <>
      <style jsx global>{`
        /* Completely hide Google Translate UI */
        #google_translate_element_hidden {
          position: absolute !important;
          left: -9999px !important;
          top: -9999px !important;
          visibility: hidden !important;
          width: 0 !important;
          height: 0 !important;
          overflow: hidden !important;
        }
        
        /* Hide Google top bar completely */
        .goog-te-banner-frame,
        .skiptranslate iframe,
        #goog-gt-tt,
        .goog-te-balloon-frame,
        .goog-te-menu-frame,
        .goog-te-spinner-pos,
        .goog-te-spinner,
        .skiptranslate,
        .goog-te-gadget {
          display: none !important;
          visibility: hidden !important;
        }
        
        body {
          top: 0 !important;
          position: static !important;
        }
        
        /* Hide the skiptranslate at top left */
        body > .skiptranslate {
          display: none !important;
          height: 0 !important;
          width: 0 !important;
          overflow: hidden !important;
        }
        
        /* Remove highlight from translated text */
        .goog-text-highlight {
          background: none !important;
          box-shadow: none !important;
        }
        
        font[style*="vertical-align: inherit"] {
          vertical-align: baseline !important;
        }
        
        /* Hide any Google loading indicator */
        .goog-te-ftab-link,
        .goog-te-ftab-link-text,
        #\\:0\\.container,
        .goog-logo-link,
        .goog-te-gadget-icon {
          display: none !important;
        }
      `}</style>

      {/* Hidden Google Translate element */}
      <div id="google_translate_element_hidden" aria-hidden="true" />

      {/* Custom Language Switcher UI - Simple Flag Only */}
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          title={currentLang.name}
        >
          <span className="text-xl leading-none">{currentLang.flag}</span>
          <svg
            className={`w-3 h-3 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-44 rounded-xl bg-white dark:bg-zinc-800 shadow-xl border border-red-100 dark:border-red-900/50 overflow-hidden z-[100]"
            >
              <div className="py-1">
                {LANGUAGES.map((lang) => (
                  <motion.button
                    key={lang.code}
                    whileHover={{ x: 4 }}
                    onClick={() => changeLanguage(lang)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      currentLang.code === lang.code
                        ? "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400"
                        : "hover:bg-gray-50 dark:hover:bg-zinc-700/50 text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <span className="font-medium">{lang.name}</span>
                    {currentLang.code === lang.code && (
                      <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-4 h-4 ml-auto text-red-600 dark:text-red-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </motion.svg>
                    )}
                  </motion.button>
                ))}
              </div>
              
              {/* Powered by indicator - subtle */}
              <div className="px-4 py-2 border-t border-gray-100 dark:border-zinc-700">
                <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center">
                  Powered by Google Translate
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
