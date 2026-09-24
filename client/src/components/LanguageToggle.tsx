import { Button } from "@/components/ui/button";
import { CrFlag, UsFlag } from "@/components/flags";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";

const FADE_MS = 180;

// One-click toggle between English and Spanish (same pattern as ThemeToggle).
// The page fades out, switches language and fades back in; reduced-motion users switch instantly.
export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();
  const [, setLocation] = useLocation();
  const next = language === "es" ? "en" : "es";

  const applyLanguage = () => {
    setLanguage(next);
    // Swap the /en|/es prefix in the current URL, keeping path and query string
    const { pathname, search } = window.location;
    const path = pathname.replace(/^\/(en|es)(?=\/|$)/, "") || "/";
    const newUrl = (path === "/" ? `/${next}` : `/${next}${path}`) + search;
    window.history.pushState({}, "", newUrl);
    setLocation(newUrl);
  };

  const toggleLanguage = () => {
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || root.classList.contains("lang-switching")) {
      applyLanguage();
      return;
    }
    root.classList.add("lang-switching");
    window.setTimeout(() => {
      applyLanguage();
      // Plain timers, not requestAnimationFrame: rAF is paused in background tabs, which
      // would leave the page faded out. The short delay lets React paint the new language.
      window.setTimeout(() => root.classList.remove("lang-switching"), 30);
    }, FADE_MS);
    // Safety net: never leave the page hidden, whatever happens during the switch.
    window.setTimeout(() => root.classList.remove("lang-switching"), FADE_MS * 4);
  };

  const flagClass = "absolute h-[14px] w-[21px] rounded-[2px] shadow-sm ring-1 ring-black/10 transition-all duration-300";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="relative w-9 h-9 rounded-md"
      title={t("language.switchTo")}
      aria-label={t("language.switchTo")}
    >
      {/* Current language's flag; the other rotates in on switch, like the theme sun/moon */}
      <UsFlag className={`${flagClass} ${language === "en" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`} />
      <CrFlag className={`${flagClass} ${language === "es" ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"}`} />
      <span className="sr-only">{t("language.switchTo")}</span>
    </Button>
  );
}
