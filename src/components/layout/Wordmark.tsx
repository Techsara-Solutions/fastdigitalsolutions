import Link from "next/link";
import { siteConfig } from "@/content/site";
import { LogoMark } from "@/components/layout/LogoMark";

type WordmarkProps = {
  className?: string;
  /** Larger lockup for the footer. */
  size?: "default" | "large";
};

/** Logo mark plus brand name, linking home. Inherits the surface text colour. */
export function Wordmark({ className = "", size = "default" }: WordmarkProps) {
  const markSize = size === "large" ? "h-9" : "h-7";
  const textSize = size === "large" ? "text-lg" : "text-[1.0625rem]";
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 font-semibold tracking-tight text-inherit no-underline ${className}`}
      aria-label={`${siteConfig.brandName} home`}
    >
      <LogoMark className={`${markSize} w-auto shrink-0`} />
      <span className={`${textSize} leading-none`}>
        Fast<span className="font-normal">&nbsp;Digital Solutions</span>
      </span>
    </Link>
  );
}
