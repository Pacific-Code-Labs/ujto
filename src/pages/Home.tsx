import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@pacific-code-labs/ujto-ds";
import { DownloadSection } from "@/components/public/DownloadSection";
import { FeaturesSection } from "@/components/public/FeaturesSection";
import { FooterSection } from "@/components/public/FooterSection";
import { HeroSection } from "@/components/public/HeroSection";
import { Navbar } from "@/components/public/Navbar";
import { PricingSection } from "@/components/public/PricingSection";
import { StorySection } from "@/components/public/StorySection";
import { TestimonialsSection } from "@/components/public/TestimonialsSection";
import { isSection, SECTIONS, type Section } from "@/lib/sections";
import { applyHeadTags } from "@/services/seo.service";

/**
 * One scrollable document per language; fragments preserve shareable sections.
 */
export default function Home() {
  const section = window.location.hash.slice(1);
  const { language, languages } = useLanguage();
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
    const sync = () => {
      const target = window.location.hash.slice(1);
      if (isSection(target)) { setActive(target); scrollTo(target, false); }
      else { setActive("hero"); scrollTo("hero", false); }
    };
    sync();
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, [language, scrollTo]);

  const path = `/${language}`;
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
        const hash = id === "hero" ? "" : `#${id}`;
        if (window.location.hash !== hash) window.history.replaceState(null, "", `/${language}${window.location.search}${hash}`);
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
    const hash = target === "hero" ? "" : `#${target}`;
    window.history.pushState(null, "", `/${language}${window.location.search}${hash}`);
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
