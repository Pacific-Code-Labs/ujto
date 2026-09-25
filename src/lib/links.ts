// The dashboard lives on its own domain; the landing only links to it (new tab).
// URL from SSM /ujto/<env>/web/site/app-url (VITE_APP_URL), prod domain by default.
export const APP_URL = ((import.meta.env.VITE_APP_URL as string | undefined) || "https://app.ujto.jcampos.dev").replace(/\/$/, "");

/** Dashboard URL for a path in the visitor's language, e.g. appHref("es", "/login"). */
export const appHref = (lang: string, path = "/") => `${APP_URL}/${lang}${path === "/" ? "" : path}`;

/** Props for links that open the dashboard in a new tab. */
export const newTab = { target: "_blank", rel: "noopener noreferrer" } as const;

/** Paths of the old single-site app; visits (e.g. from old emails) go to the dashboard. */
export const LEGACY_APP_PATHS = [
  "login",
  "register",
  "verify-email",
  "forgot-password",
  "reset-password",
  "dashboard",
  "profile",
  "checkout",
  "subscribe",
];
