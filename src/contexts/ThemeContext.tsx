"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  ReactNode,
} from "react";

type Theme = "light" | "dark" | "auto";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}): React.ReactNode {
  const [theme, setThemeState] = useState<Theme>("auto");
  const [isDark, setIsDark] = useState(false);

  // Apply theme to DOM
  const applyTheme = (dark: boolean) => {
    const html = document.documentElement;
    if (dark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  };

  // Initialize theme from localStorage and apply it
  useLayoutEffect(() => {
    // Get saved theme preference
    const savedTheme = (localStorage.getItem("theme") as Theme) || "auto";

    // Determine if should be dark
    const shouldBeDark =
      savedTheme === "dark" ||
      (savedTheme === "auto" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    // Apply theme synchronously to prevent flash
    applyTheme(shouldBeDark);

    // Update state after applying theme
    queueMicrotask(() => {
      setThemeState(savedTheme);
      setIsDark(shouldBeDark);
    });
  }, []);

  // Listen for system theme changes when in auto mode
  useEffect(() => {
    if (theme !== "auto") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
      applyTheme(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);

    // Apply the theme
    if (newTheme === "dark") {
      setIsDark(true);
      applyTheme(true);
    } else if (newTheme === "light") {
      setIsDark(false);
      applyTheme(false);
    } else {
      // auto mode - check system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDark(prefersDark);
      applyTheme(prefersDark);
    }
  };

  // Always wrap with provider - provide default values during hydration
  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
