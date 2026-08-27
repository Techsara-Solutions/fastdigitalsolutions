import Link from "next/link";
import { siteConfig } from "@/content/site";

/**
 * Restrained text wordmark (PRD Document Control: logo pending).
 * Replace with the approved logo before production launch; the slot is
 * deliberately flexible so swapping assets does not disturb the header.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-baseline gap-1.5 font-semibold tracking-tight text-inherit no-underline ${className}`}
      aria-label={`${siteConfig.brandName} — home`}
    >
      <span
        aria-hidden="true"
        className="inline-block h-2.5 w-2.5 translate-y-[-1px] rounded-[2px] bg-accent"
      />
      <span className="text-[1.0625rem] leading-none">
        Fast<span className="font-normal">&nbsp;Digital Solutions</span>
      </span>
    </Link>
  );
}
