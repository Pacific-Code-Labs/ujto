import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'wouter';

import { translations, type Language } from "@/i18n";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}


const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      // Always check URL first to determine language from route
      const pathname = window.location.pathname;
      if (pathname.includes('/es')) return 'es';
      if (pathname.includes('/en')) return 'en';
      
      // For GitHub Pages base URL access, default to English to prevent redirect loops
      const isGitHubPages = pathname.includes('/video-transcript');
      if (isGitHubPages && (pathname === '/video-transcript' || pathname === '/video-transcript/')) {
        return 'en';
      }
      
      // For base URL access (without language), use stored preference or browser language
      const saved = localStorage.getItem('language') as Language;
      if (saved) return saved;
      const browserLang = navigator.language.toLowerCase();
      return browserLang.startsWith('es') ? 'es' : 'en';
    }
    return 'en';
  });

  const handleSetLanguage = (lang: Language) => {
    if (lang === language) {
      console.log(`Language already set to ${lang}, skipping update`);
      return;
    }
    console.log(`Language context: changing from ${language} to ${lang}`);
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  // Keep <html lang> in sync for screen readers, hyphenation and browser translation
  useEffect(() => {
    document.documentElement.lang = language;
    document.title = translations[language]["meta.title"] ?? document.title;
    const description = translations[language]["meta.description"];
    if (description) {
      let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!tag) {
        tag = document.createElement("meta");
        tag.name = "description";
        document.head.appendChild(tag);
      }
      tag.content = description;
    }
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}