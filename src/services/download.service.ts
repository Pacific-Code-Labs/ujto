import { getDownload, type DownloadPlatform } from "@/repositories/content.repository";

export type DesktopOs = "mac" | "windows" | "linux";

/** The visitor's OS, from User-Agent Client Hints when available, else the user agent. */
export function detectOs(): DesktopOs | null {
  if (typeof navigator === "undefined") return null;
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const platform = (nav.userAgentData?.platform || navigator.userAgent).toLowerCase();
  if (platform.includes("mac")) return "mac";
  if (platform.includes("win")) return "windows";
  if (platform.includes("linux") || platform.includes("x11")) return "linux";
  return null;
}

export const downloadUrl = (p: DownloadPlatform) => getDownload().releaseBaseUrl + p.file;
export const isDownloadAvailable = () => getDownload().status === "available";

/** The installer to feature for this visitor, and every other platform. */
export function splitPlatforms(): { primary: DownloadPlatform | null; others: DownloadPlatform[] } {
  const os = detectOs();
  const all = getDownload().platforms;
  const primary = all.find((p) => p.os === os) ?? null;
  return { primary, others: all.filter((p) => p !== primary) };
}
