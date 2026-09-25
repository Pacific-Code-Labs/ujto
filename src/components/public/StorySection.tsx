import { RichText, useLanguage, useLocalized } from "@pacific-code-labs/ujto-ds";
import { BookOpen } from "lucide-react";
import { getStory } from "@/repositories/content.repository";

/** Where the name comes from (Bribri "word"). Tier 0 only: meaning, credit and source. */
export function StorySection() {
  const { t } = useLanguage();
  const L = useLocalized();
  const story = getStory();
  return (
    <section id="story" className="bg-brand-river py-20 text-brand-sand">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
          <BookOpen className="h-5 w-5" aria-hidden />
        </span>
        <h2 className="mb-6 text-3xl font-bold">{L(story.title)}</h2>
        <div className="space-y-4 text-lg leading-relaxed">
          {story.paragraphs.map((p, i) => (
            <p key={i}>
              <RichText>{L(p)}</RichText>
            </p>
          ))}
        </div>
        <p className="mt-8 text-sm opacity-80">{L(story.attribution)}</p>
        <p className="mt-1 text-sm opacity-80">
          {t("story.source")}:{" "}
          <a href={story.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-100">
            {L(story.source)}
          </a>
        </p>
      </div>
    </section>
  );
}
