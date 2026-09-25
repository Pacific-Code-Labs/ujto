import { useState } from "react";
import { BrandLogo, Button, cn, resolveAssetUrl, useLanguage, useLocalized } from "@pacific-code-labs/ujto-ds";
import { Download, Menu, X } from "lucide-react";
import { appHref, newTab } from "@/lib/links";
import { sectionPath, type Section } from "@/lib/sections";
import { getBranding, getNavigation } from "@/repositories/content.repository";
import { LanguageToggle, ThemeToggle } from "./toggles";

interface Props {
  active: Section | null;
  onNavigate: (section: Section) => void;
}

/** Sticky navbar: section links, download, sign in / get started (open the dashboard in a new tab). */
export function Navbar({ active, onNavigate }: Props) {
  const { t, language } = useLanguage();
  const L = useLocalized();
  const [open, setOpen] = useState(false);
  const branding = getBranding();
  const links = getNavigation().links;

  const go = (e: React.MouseEvent, section: Section) => {
    e.preventDefault();
    setOpen(false);
    onNavigate(section);
  };
  const linkCls = (section: string) =>
    cn(
      "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
      active === section ? "text-primary" : "text-muted-foreground",
    );

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <a href={sectionPath(language, "hero")} onClick={(e) => go(e, "hero")} className="shrink-0">
          <BrandLogo
            className="h-9"
            src={resolveAssetUrl(branding.logoUrl) || undefined}
            srcDark={resolveAssetUrl(branding.logoUrlDark) || undefined}
            alt={branding.companyName}
          />
        </a>

        <div className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {links.map((link) => (
            <a
              key={link.section}
              href={sectionPath(language, link.section as Section)}
              onClick={(e) => go(e, link.section as Section)}
              className={linkCls(link.section)}
            >
              {L(link.label)}
            </a>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
            <a href={sectionPath(language, "download")} onClick={(e) => go(e, "download")}>
              <Download className="mr-2 h-4 w-4" />
              {t("download.nav")}
            </a>
          </Button>
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <a href={appHref(language, "/login")} {...newTab}>
              {t("common.signIn")}
              <span className="sr-only"> ({t("common.newTab")})</span>
            </a>
          </Button>
          <Button asChild size="sm">
            <a href={appHref(language, "/register")} {...newTab}>
              {t("common.getStarted")}
              <span className="sr-only"> ({t("common.newTab")})</span>
            </a>
          </Button>
          <ThemeToggle />
          <LanguageToggle />
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? t("common.closeMenu") : t("common.openMenu")}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-card px-4 py-2 lg:hidden">
          {links.map((link) => (
            <a
              key={link.section}
              href={sectionPath(language, link.section as Section)}
              onClick={(e) => go(e, link.section as Section)}
              className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary"
            >
              {L(link.label)}
            </a>
          ))}
          <a
            href={appHref(language, "/login")}
            {...newTab}
            className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary sm:hidden"
          >
            {t("common.signIn")}
          </a>
        </div>
      )}
    </nav>
  );
}
