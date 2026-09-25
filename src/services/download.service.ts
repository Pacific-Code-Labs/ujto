import { useEffect, useState } from "react";
import { getDownload, type DownloadPlatform } from "@/repositories/content.repository";

export type DesktopOs = "mac" | "windows" | "linux";
export type DesktopArch = "arm64" | "x64";

type UAData = {
  platform?: string;
  getHighEntropyValues?: (hints: string[]) => Promise<{ architecture?: string; bitness?: string }>;
};

/** The visitor's OS, from User-Agent Client Hints when available, else the user agent. */
export function detectOs(): DesktopOs | null {
  if (typeof navigator === "undefined") return null;
  const nav = navigator as Navigator & { userAgentData?: UAData };
  const platform = (nav.userAgentData?.platform || navigator.userAgent).toLowerCase();
  if (/iphone|ipad|android/.test(navigator.userAgent.toLowerCase())) return null; // no desktop build for phones
  if (platform.includes("mac")) return "mac";
  if (platform.includes("win")) return "windows";
  if (platform.includes("linux") || platform.includes("x11")) return "linux";
  return null;
}

/**
 * CPU architecture. Chromium browsers expose it through high-entropy client hints; Safari and
 * Firefox report every Mac as "Intel", so Macs default to Apple silicon (every Mac since 2020)
 * and the Intel build stays listed right below.
 */
export async function detectArch(os: DesktopOs | null): Promise<DesktopArch> {
  const nav = (typeof navigator !== "undefined" ? navigator : undefined) as (Navigator & { userAgentData?: UAData }) | undefined;
  try {
    const hints = await nav?.userAgentData?.getHighEntropyValues?.(["architecture", "bitness"]);
    if (hints?.architecture === "arm") return "arm64";
    if (hints?.architecture === "x86") return "x64";
  } catch {
    /* hints unavailable */
  }
  return os === "mac" ? "arm64" : "x64";
}

/** The visitor's OS + architecture (architecture resolves asynchronously in Chromium). */
export function useVisitorPlatform(): { os: DesktopOs | null; arch: DesktopArch | null } {
  const [os] = useState(detectOs);
  const [arch, setArch] = useState<DesktopArch | null>(null);
  useEffect(() => {
    let alive = true;
    void detectArch(os).then((a) => alive && setArch(a));
    return () => {
      alive = false;
    };
  }, [os]);
  return { os, arch };
}

/** Best installer for this visitor: same OS, and the same architecture when it is known. */
export function pickPlatform<P extends { os: string; arch: string }>(platforms: P[], os: DesktopOs | null, arch: DesktopArch | null): P | null {
  const sameOs = platforms.filter((p) => p.os === os);
  return sameOs.find((p) => p.arch === (arch ?? (os === "mac" ? "arm64" : "x64"))) ?? sameOs[0] ?? null;
}

export const downloadUrl = (p: DownloadPlatform) => getDownload().releaseBaseUrl + p.file;
export const isDownloadAvailable = () => getDownload().status === "available";

/** The installer to feature for this visitor, and every other platform. */
export function usePlatformChoice(): { primary: DownloadPlatform | null; others: DownloadPlatform[] } {
  const { os, arch } = useVisitorPlatform();
  const all = getDownload().platforms;
  const primary = pickPlatform(all, os, arch);
  return { primary, others: all.filter((p) => p !== primary) };
}
