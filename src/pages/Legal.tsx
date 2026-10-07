import { useEffect } from "react";
import { useLanguage } from "@pacific-code-labs/ujto-ds";
import { LegalBody, legalContent, type LegalKey } from "@/legal/LegalBody";
import { Navbar } from "@/components/public/Navbar";
import { FooterSection } from "@/components/public/FooterSection";
import { sectionPath, type Section } from "@/lib/sections";
import { applyHeadTags } from "@/services/seo.service";

export default function Legal({ pageKey }: { pageKey: LegalKey }) {
  const { language, languages } = useLanguage<"en" | "es">();
  const page = legalContent.pages[pageKey];
  useEffect(() => applyHeadTags(language, `/${language}/${pageKey}`, languages, {
    title: `${page.title[language]} — Ujtö̀`, description: page.description[language],
  }), [language, languages, pageKey, page]);
  const go = (section: Section) => window.location.assign(sectionPath(language, section));
  return <><Navbar active={null} onNavigate={go} /><main><LegalBody pageKey={pageKey} lang={language} /></main><FooterSection onNavigate={go} /></>;
}
