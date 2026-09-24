import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";

// Single-click toggle between English and Spanish (same pattern as ThemeToggle).
export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();
  const [, setLocation] = useLocation();
  const next = language === "es" ? "en" : "es";

  const toggleLanguage = () => {
    setLanguage(next);
    // Swap the /en|/es prefix in the current URL, keeping path and query string
    const { pathname, search } = window.location;
    const path = pathname.replace(/^\/(en|es)(?=\/|$)/, "") || "/";
    const newUrl = (path === "/" ? `/${next}` : `/${next}${path}`) + search;
    window.history.pushState({}, "", newUrl);
    setLocation(newUrl);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="h-9 min-w-9 px-2 rounded-md font-semibold text-xs tracking-wide"
      title={t("language.switchTo")}
      aria-label={t("language.switchTo")}
    >
      <span aria-hidden="true">{language === "es" ? "ES" : "EN"}</span>
    </Button>
  );
}
