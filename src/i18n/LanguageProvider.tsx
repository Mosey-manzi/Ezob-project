import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { en } from "./en";
import { rw } from "./rw";
import { LangContext, type Lang } from "./context";

const STORAGE_KEY = "ezob-lang";

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "rw") return saved;
  } catch {
    /* storage unavailable (private mode etc.) - fall back to English */
  }
  return "en";
}

export default function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang; // "en" or "rw" (Kinyarwanda)
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({ lang, setLang, t: lang === "rw" ? rw : en }),
    [lang, setLang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}
