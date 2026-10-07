// One indexable document per language. Sections are fragment links within it.
export const SECTIONS = ["hero", "features", "pricing", "download", "testimonials", "story"] as const;
export type Section = (typeof SECTIONS)[number];

export const isSection = (slug: string | undefined): slug is Section =>
  !!slug && (SECTIONS as readonly string[]).includes(slug);

/** URL of a section in a language; the hero is the page root. */
export const sectionPath = (lang: string, section: Section) => `/${lang}${section === "hero" ? "" : `#${section}`}`;
