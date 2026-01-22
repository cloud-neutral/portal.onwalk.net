"use client";

import { useEffect } from "react";
import { create } from "zustand";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_COOKIE,
  normalizeLanguage,
  type Language,
} from "./language";

type LanguageState = {
  language: Language;
  setLanguage: (lang: Language) => void;
  hydrateLanguage: () => void;
};

const STORAGE_KEY = "cloudnative-suite.language";

// Server-side detection only runs on client to avoid hydration mismatch
function detectPreferredLanguage(): Language {
  // Default to zh to match server-side rendering
  return DEFAULT_LANGUAGE;
}

function syncDocumentLanguage(language: Language) {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.lang = language;
  document.documentElement.dataset.language = language;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: DEFAULT_LANGUAGE,
  setLanguage: (language) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, language);
      document.cookie = `${LANGUAGE_COOKIE}=${language}; Path=/; Max-Age=31536000; SameSite=Lax`;
    }
    syncDocumentLanguage(language);
    set({ language });
  },
  hydrateLanguage: () => {
    // Only run on client to avoid hydration mismatch
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      const normalizedStored = normalizeLanguage(stored);
      if (normalizedStored) {
        syncDocumentLanguage(normalizedStored);
        set({ language: normalizedStored });
        return;
      }

      const cookieValue =
        typeof document !== "undefined" ? document.cookie : "";
      if (cookieValue) {
        const cookieMatch = cookieValue
          .split(";")
          .map((entry) => entry.trim())
          .find((entry) => entry.startsWith(`${LANGUAGE_COOKIE}=`));
        if (cookieMatch) {
          const value = cookieMatch.split("=")[1];
          const normalizedCookie = normalizeLanguage(value);
          if (normalizedCookie) {
            syncDocumentLanguage(normalizedCookie);
            set({ language: normalizedCookie });
            return;
          }
        }
      }

      const [primaryLocale] = window.navigator.languages?.length
        ? window.navigator.languages
        : [window.navigator.language];

      if (typeof primaryLocale === "string") {
        const normalized = primaryLocale.toLowerCase();
        if (normalized.startsWith("en")) {
          syncDocumentLanguage("en");
          set({ language: "en" });
          return;
        }
        if (normalized.startsWith("zh")) {
          syncDocumentLanguage("zh");
          set({ language: "zh" });
          return;
        }
      }
    }
  },
}));

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const { hydrateLanguage } = useLanguageStore.getState();
    hydrateLanguage();
    const unsubscribe = useLanguageStore.subscribe((state, prevState) => {
      if (state.language !== prevState.language) {
        syncDocumentLanguage(state.language);
      }
    });
    return unsubscribe;
  }, []);

  return children;
}

export function useLanguage() {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  return { language, setLanguage };
}
