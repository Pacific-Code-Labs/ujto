import { useEffect } from "react";
import { Redirect, Route, Switch, useLocation, useParams } from "wouter";
import { LanguageProvider, ThemeProvider, TooltipProvider, useLanguage } from "@pacific-code-labs/ujto-ds";
import { appHref, LEGACY_APP_PATHS } from "@/lib/links";
import { isSection } from "@/lib/sections";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import en from "@/translations/en.json";
import es from "@/translations/es.json";

export const LANGUAGES = ["en", "es"] as const;
const TRANSLATIONS = { en, es };

/** Old single-site URLs (/<lang>/login, /<lang>/dashboard, …) now live in the dashboard app. */
function LegacyRedirect({ lang }: { lang: string }) {
  const [location] = useLocation();
  useEffect(() => {
    const rest = location.replace(/^\/[a-z]{2}/, "") || "/";
    window.location.replace(appHref(lang, (rest === "/dashboard" ? "/" : rest) + window.location.search));
  }, [lang, location]);
  return null;
}

function LocalizedRoutes() {
  const { lang, section } = useParams<{ lang: string; section?: string }>();
  const { language } = useLanguage();
  if (!(LANGUAGES as readonly string[]).includes(lang)) {
    return LEGACY_APP_PATHS.includes(lang) ? <LegacyRedirect lang={language} /> : <NotFound />;
  }
  if (section && LEGACY_APP_PATHS.includes(section)) return <LegacyRedirect lang={lang} />;
  if (section && !isSection(section)) return <NotFound />;
  return <Home />;
}

function RootRedirect() {
  const { language } = useLanguage();
  return <Redirect to={`/${language}`} replace />;
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider translations={TRANSLATIONS} languages={LANGUAGES} defaultLanguage="en">
        <TooltipProvider>
          <Switch>
            <Route path="/" component={RootRedirect} />
            <Route path="/:lang/:section" component={LocalizedRoutes} />
            <Route path="/:lang" component={LocalizedRoutes} />
            <Route component={NotFound} />
          </Switch>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
