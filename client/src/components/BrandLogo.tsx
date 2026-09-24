import wordmarkLight from "@/assets/brand/wordmark-light.png";
import wordmarkDark from "@/assets/brand/wordmark-dark.png";
import { cn } from "@/lib/utils";

// Approved Ujtö̀ wordmark (L1 on light surfaces, L2 reverse on dark).
// The ö̀ is part of the wordmark: never place the standalone symbol next to it.
type Props = {
  className?: string;
  /** "auto" follows the theme; "reverse" always uses the light-on-dark version. */
  variant?: "auto" | "reverse";
};

const BRAND = "Ujtö̀";

export function BrandLogo({ className, variant = "auto" }: Props) {
  if (variant === "reverse") {
    return <img src={wordmarkDark} alt={BRAND} className={cn("h-8 w-auto", className)} />;
  }
  return (
    <>
      <img src={wordmarkLight} alt={BRAND} className={cn("h-8 w-auto dark:hidden", className)} />
      <img src={wordmarkDark} alt={BRAND} className={cn("hidden h-8 w-auto dark:block", className)} />
    </>
  );
}
