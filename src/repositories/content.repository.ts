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
import type { BrandTheme, MediaLibrary } from "@pacific-code-labs/ujto-ds";

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

export const getHero = (): Hero => hero;
export const getFeatures = (): Features => features;
export const getPricing = (): Pricing => pricing;
export const getTestimonials = (): Testimonials => testimonials;
export const getStory = (): Story => story;
export const getDownload = (): Download => download;
export const getNavigation = (): Navigation => navigation;
export const getFooter = (): Footer => footer;
export const getSeo = (): Seo => seo;
export const getBranding = (): Branding => branding;
export const getThemes = (): BrandTheme[] => themes as BrandTheme[];
export const getMedia = (): MediaLibrary => media as MediaLibrary;
