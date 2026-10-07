import { BrandLogo, resolveIcon, useLanguage, useLocalized } from "@pacific-code-labs/ujto-ds";
import { appHref, newTab } from "@/lib/links";
import { sectionPath, type Section } from "@/lib/sections";
import { getBranding, getFooter, type FooterLink } from "@/repositories/content.repository";
import { legalContent } from "@/legal/LegalBody";

const linkCls = "text-muted-foreground transition-colors hover:text-primary";

/**
 * Same layout as the Sokol/Tsuru landings: brand + description, link groups, then the
 * copyright and the studio credit.
 */
export function FooterSection({ onNavigate }: { onNavigate: (section: Section) => void }) {
  const { language } = useLanguage();
  const L = useLocalized();
  const footer = getFooter();
  const branding = getBranding();

  const link = (item: FooterLink) => {
    if (item.kind === "section")
      return (
        <a
          href={sectionPath(language, item.target as Section)}
          onClick={(e) => {
            e.preventDefault();
            onNavigate(item.target as Section);
          }}
          className={linkCls}
        >
          {L(item.label)}
        </a>
      );
    const href = item.kind === "app" ? appHref(language, item.target) : item.target;
    return (
      <a href={href} {...newTab} className={linkCls}>
        {L(item.label)}
      </a>
    );
  };

  return (
    <footer id="contact" className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 pt-8 pb-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2">
            <a
              href={sectionPath(language, "hero")}
              onClick={(e) => {
                e.preventDefault();
                onNavigate("hero");
              }}
              className="mb-4 inline-flex transition-opacity hover:opacity-80"
            >
              <BrandLogo className="h-9" alt={branding.companyName} />
            </a>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">{L(footer.description)}</p>
            {footer.social.length > 0 && (
              <div className="mt-4 flex gap-3">
                {footer.social.map((s) => {
                  const Icon = resolveIcon(s.iconName);
                  return (
                    <a key={s.href} href={s.href} {...newTab} aria-label={L(s.label)} className={linkCls}>
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {footer.columns.map((col, i) => (
            <div key={i}>
              <h3 className="mb-3 text-sm font-semibold text-foreground">{L(col.title)}</h3>
              <ul className="space-y-2 text-sm">
                {col.links.map((item, j) => (
                  <li key={j}>{link(item)}</li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="mb-3 text-sm font-semibold">{L(legalContent.labels.legal)}</h3>
            <ul className="space-y-2 text-sm">
              {Object.entries(legalContent.pages).map(([key, page]) => <li key={key}><a href={`/${language}/${key}`} className={linkCls}>{L(page.title)}</a></li>)}
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-border pt-5 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {branding.companyName}. {L(footer.rights)}
          </p>

          {/* Studio credit — the logo ships with alpha, so it sits on both themes without a plate. */}
          <a href={footer.madeBy.url} {...newTab} className="group flex items-center gap-2 transition-colors hover:text-primary">
            <span>{L(footer.madeBy.label)}</span>
            <img
              src={footer.madeBy.logoUrl}
              alt={footer.madeBy.name}
              className="h-7 w-auto opacity-90 transition-opacity group-hover:opacity-100"
              loading="lazy"
            />
            <span className="font-medium text-foreground/80 transition-colors group-hover:text-primary">{footer.madeBy.name}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
