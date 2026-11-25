import { createContext, useContext } from "react";
import type { Dictionary } from "./en";

export type Lang = "en" | "rw";

export type LangContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dictionary;
};

export const LangContext = createContext<LangContextValue | null>(null);

export function useLang(): LangContextValue {
  const value = useContext(LangContext);
  if (!value) throw new Error("useLang must be used inside <LanguageProvider>");
  return value;
}
