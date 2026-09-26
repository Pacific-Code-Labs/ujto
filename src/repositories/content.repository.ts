// The ONLY place the landing's content JSON is imported. Editors change these files with the
// ujto-admin CMS (fe/admin); components read them through this module.
import hero from "@/content/hero.json";
import features from "@/content/features.json";
import pricing from "@/content/pricing.json";
import testimonials from "@/content/testimonials.json";
import story from "@/content/story.json";
import download from "@/content/download.json";
import navigation from "@/content/navigation.json";
import footer from "@/content/footer.json";
import seo from "@/content/seo.json";
import branding from "@/content/branding.json";
import themes from "@/content/themes.json";
import media from "@/content/media.json";
import { loadPublishedContent, type BrandTheme, type MediaLibrary } from "@pacific-code-labs/ujto-ds";

// Published documents (edited online in the admin console, public API) override the bundled
// JSON. Loaded once before the first render (initContent); on any failure the bundle is used.
const env = import.meta.env;
const PUBLIC_API =
  env.VITE_PUBLIC_API_URL && env.VITE_PUBLIC_IDENTITY_POOL_ID
    ? { url: env.VITE_PUBLIC_API_URL as string, identityPoolId: env.VITE_PUBLIC_IDENTITY_POOL_ID as string }
    : null;
let published: Record<string, unknown> = {};
const doc = <T>(key: string, bundled: T): T => (published[key] as T | undefined) ?? bundled;

export async function initContent() {
  published = (await loadPublishedContent(PUBLIC_API, "landing")) ?? {};
}

export type Hero = typeof hero;
export type Features = typeof features;
export type Pricing = typeof pricing;
export type Plan = Pricing["plans"][number];
export type Testimonials = typeof testimonials;
export type Story = typeof story;
export type Download = typeof download;
export type DownloadPlatform = Download["platforms"][number];
export type Navigation = typeof navigation;
export type Footer = typeof footer;
export type FooterLink = Footer["columns"][number]["links"][number];
export type Seo = typeof seo;
export type Branding = typeof branding;

export const getHero = (): Hero => doc("hero", hero);
export const getFeatures = (): Features => doc("features", features);
export const getPricing = (): Pricing => doc("pricing", pricing);
export const getTestimonials = (): Testimonials => doc("testimonials", testimonials);
export const getStory = (): Story => doc("story", story);
export const getDownload = (): Download => doc("download", download);
export const getNavigation = (): Navigation => doc("navigation", navigation);
export const getFooter = (): Footer => doc("footer", footer);
export const getSeo = (): Seo => doc("seo", seo);
export const getBranding = (): Branding => doc("branding", branding);
export const getThemes = (): BrandTheme[] => doc("themes", themes as BrandTheme[]);
export const getMedia = (): MediaLibrary => doc("media", media as MediaLibrary);
