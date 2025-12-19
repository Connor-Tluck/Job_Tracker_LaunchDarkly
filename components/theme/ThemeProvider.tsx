"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { applyThemeToDocument, isTheme, THEME_STORAGE_KEY, type Theme } from "./theme";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  hasExplicitPreference: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isTheme(stored) ? stored : null;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [hasExplicitPreference, setHasExplicitPreference] = useState(false);
  const [theme, setThemeState] = useState<Theme>("light");

  // Initialize from (1) stored pref, else (2) default to light.
  useEffect(() => {
    const stored = readStoredTheme();
    if (stored) {
      setHasExplicitPreference(true);
      setThemeState(stored);
      applyThemeToDocument(stored);
      return;
    }

    setHasExplicitPreference(false);
    setThemeState("light");
    applyThemeToDocument("light");
  }, []);

  // Cross-tab sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== THEME_STORAGE_KEY) return;
      const next = isTheme(e.newValue) ? e.newValue : null;
      if (next) {
        setHasExplicitPreference(true);
        setThemeState(next);
        applyThemeToDocument(next);
      } else {
        setHasExplicitPreference(false);
        setThemeState("light");
        applyThemeToDocument("light");
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setHasExplicitPreference(true);
    setThemeState(next);
    applyThemeToDocument(next);
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  const value = useMemo<ThemeContextValue>(() => {
    return { theme, setTheme, toggleTheme, hasExplicitPreference };
  }, [hasExplicitPreference, setTheme, theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}


