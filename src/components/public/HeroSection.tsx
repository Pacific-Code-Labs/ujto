import { useState } from "react";
import { Button, Input, RichText, useLanguage, useLocalized } from "@pacific-code-labs/ujto-ds";
import { Upload } from "lucide-react";
import { appHref, newTab } from "@/lib/links";
import { getHero } from "@/repositories/content.repository";

/**
 * Hero. Transcribing happens in the dashboard, so both actions open it in a new tab:
 * "Upload a file" → /new, a pasted link → /new?url=… (prefilled there).
 */
export function HeroSection() {
  const { t, language } = useLanguage();
  const L = useLocalized();
  const hero = getHero();
  const [url, setUrl] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = url.trim();
    const target = appHref(language, value ? `/new?url=${encodeURIComponent(value)}` : "/new");
    window.open(target, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="hero" className="gradient-hero">
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/80">{L(hero.eyebrow)}</p>
        <h1 className="mb-6 text-4xl font-bold text-white md:text-6xl">
          <RichText>{L(hero.title)}</RichText>
          <span className="block text-white/80">
            <RichText>{L(hero.highlight)}</RichText>
          </span>
        </h1>
        <p className="mx-auto mb-10 max-w-3xl text-lg text-white/90 md:text-xl">
          <RichText>{L(hero.description)}</RichText>
        </p>

        <div className="mx-auto max-w-2xl space-y-4">
          <Button asChild size="lg" className="h-14 w-full bg-white text-lg text-brand-river shadow-lg hover:bg-white/90">
            <a href={appHref(language, "/new")} {...newTab}>
              <Upload className="mr-2 h-5 w-5" />
              {L(hero.uploadLabel)}
              <span className="sr-only"> ({t("common.newTab")})</span>
            </a>
          </Button>
          <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
            <Input
              type="url"
              inputMode="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={L(hero.linkPlaceholder)}
              aria-label={t("hero.linkLabel")}
              className="h-12 flex-1 border-white/30 bg-white/10 text-white placeholder:text-white/70"
            />
            <Button type="submit" size="lg" variant="secondary" className="h-12">
              {L(hero.linkLabel)}
            </Button>
          </form>
          <p className="text-sm text-white/80">{L(hero.note)}</p>
        </div>
      </div>
    </section>
  );
}
