import { BrandLogo, resolveIcon, useLanguage, useLocalized } from "@pacific-code-labs/ujto-ds";
import { appHref, newTab } from "@/lib/links";
import { sectionPath, type Section } from "@/lib/sections";
import { getBranding, getFooter, type FooterLink } from "@/repositories/content.repository";

export function FooterSection({ onNavigate }: { onNavigate: (section: Section) => void }) {
  const { language } = useLanguage();
  const L = useLocalized();
  const footer = getFooter();
  const branding = getBranding();

  const link = (item: FooterLink) => {
    const cls = "text-brand-sand/70 transition-colors hover:text-brand-sand";
    if (item.kind === "section")
      return (
        <a
          href={sectionPath(language, item.target as Section)}
          onClick={(e) => {
            e.preventDefault();
            onNavigate(item.target as Section);
          }}
          className={cls}
        >
          {L(item.label)}
        </a>
      );
    const href = item.kind === "app" ? appHref(language, item.target) : item.target;
    return (
      <a href={href} {...newTab} className={cls}>
        {L(item.label)}
      </a>
    );
  };

  return (
    <footer id="contact" className="bg-brand-ink py-16 text-brand-sand">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <BrandLogo variant="reverse" className="mb-4 h-9" alt={branding.companyName} />
            <p className="mb-6 text-brand-sand/70">{L(footer.description)}</p>
            <div className="flex gap-4">
              {footer.social.map((s) => {
                const Icon = resolveIcon(s.iconName);
                return (
                  <a key={s.href} href={s.href} {...newTab} aria-label={L(s.label)} className="text-brand-sand/70 hover:text-brand-sand">
                    <Icon className="h-6 w-6" />
                  </a>
                );
              })}
            </div>
          </div>
          {footer.columns.map((col, i) => (
            <div key={i}>
              <h4 className="mb-4 text-lg font-semibold">{L(col.title)}</h4>
              <ul className="space-y-2">
                {col.links.map((item, j) => (
                  <li key={j}>{link(item)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-white/10 pt-8 text-center text-brand-sand/70">{L(footer.copyright)}</div>
      </div>
    </footer>
  );
}
