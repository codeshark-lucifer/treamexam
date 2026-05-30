"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { en } from "./dictionaries/en";
import { kh } from "./dictionaries/kh";

type Language = "en" | "kh";
type Dictionary = typeof en;

interface TranslationContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Dictionary;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Language;
    if (savedLang && (savedLang === "en" || savedLang === "kh")) {
      setLangState(savedLang);
    }
    setMounted(true);
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("lang", newLang);
  };

  const t = lang === "en" ? en : kh;

  return (
    <TranslationContext.Provider value={{ lang, setLang, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
}

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useTranslation();

  return (
    <div className={`flex items-center gap-1 bg-[var(--line)]/30 p-1 rounded-lg border border-[var(--line)] ${className}`}>
      <button
        onClick={() => setLang("en")}
        className={`px-3 py-1.5 rounded text-[10px] font-black tracking-widest transition-all ${
          lang === "en" ? "bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20" : "text-[var(--muted)] hover:text-[var(--primary)]"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang("kh")}
        className={`px-3 py-1.5 rounded text-[10px] font-black tracking-widest transition-all ${
          lang === "kh" ? "bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20" : "text-[var(--muted)] hover:text-[var(--primary)]"
        }`}
      >
        KH
      </button>
    </div>
  );
}
