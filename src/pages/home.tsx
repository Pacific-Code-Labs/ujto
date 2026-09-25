import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@pacific-code-labs/ujto-ds";
import { useLocation, useParams } from "wouter";
import { DownloadSection } from "@/components/public/DownloadSection";
import { FeaturesSection } from "@/components/public/FeaturesSection";
import { FooterSection } from "@/components/public/FooterSection";
import { HeroSection } from "@/components/public/HeroSection";
import { Navbar } from "@/components/public/Navbar";
import { PricingSection } from "@/components/public/PricingSection";
import { StorySection } from "@/components/public/StorySection";
import { TestimonialsSection } from "@/components/public/TestimonialsSection";
import { isSection, sectionPath, SECTIONS, type Section } from "@/lib/sections";
import { applyHeadTags } from "@/services/seo.service";

/**
 * The landing: one scrollable document. /<lang>/<section> scrolls to that section; a
 * scroll-spy keeps the URL on the section in view (replace, so history stays clean).
 */
export default function Home() {
  const { section } = useParams<{ section?: string }>();
  const { language, languages } = useLanguage();
  const [, navigate] = useLocation();
  const [active, setActive] = useState<Section | null>(isSection(section) ? section : null);
  const programmatic = useRef(false);

  const scrollTo = useCallback((target: Section, smooth = true) => {
    const el = document.getElementById(target);
    if (!el) return;
    programmatic.current = true;
    el.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
    window.setTimeout(() => (programmatic.current = false), 800);
  }, []);

  // Deep links and back/forward.
  useEffect(() => {
    if (isSection(section)) scrollTo(section, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const path = `/${language}${isSection(section) && section !== "hero" ? `/${section}` : ""}`;
  useEffect(() => applyHeadTags(language as "en" | "es", path, languages), [language, path, languages]);

  // Scroll-spy: the section crossing the middle of the viewport owns the URL.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (programmatic.current) return;
        const visible = entries.find((e) => e.isIntersecting);
        if (!visible) return;
        const id = visible.target.id as Section;
        setActive(id);
        const next = sectionPath(language, id);
        if (window.location.pathname !== next) window.history.replaceState(null, "", next + window.location.search);
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [language]);

  const go = (target: Section) => {
    setActive(target);
    navigate(sectionPath(language, target));
    scrollTo(target);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar active={active} onNavigate={go} />
      <div id="page-content">
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <DownloadSection />
        <TestimonialsSection />
        <StorySection />
        <FooterSection onNavigate={go} />
      </div>
    </div>
  );
}
