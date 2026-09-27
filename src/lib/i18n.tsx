import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Locale = "en" | "vi";

const STORAGE_KEY = "fun-cosmos-language";
type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (english: string, vietnamese: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Keep the first server and client render identical. English is the default.
  const [locale, setLocale] = useState<Locale>("en");
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "vi") setLocale("vi");
    } catch {
      // Private browsing may disable local storage; the selector still works.
    }
    setRestored(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    try {
      if (restored) localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // Language remains usable for the current visit.
    }
  }, [locale, restored]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale,
      t: (english, vietnamese) => (locale === "en" ? english : vietnamese),
    }),
    [locale],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

// The context hook is intentionally colocated with its provider.
// eslint-disable-next-line react-refresh/only-export-components
export function useI18n() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("LanguageProvider is required");
  return value;
}
