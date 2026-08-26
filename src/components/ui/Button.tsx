import Link from "next/link";
import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from "react";

type Variant = "primary" | "secondary" | "onDark";

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
};

type LinkButtonProps = CommonProps & {
  href: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};
type RealButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

export type ButtonProps = LinkButtonProps | RealButtonProps;

/**
 * Primary/secondary actions (PRD §13.3, §16.5). Renders a Link when `href` is
 * given (navigation) and a real button otherwise (actions) — PRD §19.1.
 * Minimum target size is met via padding (PRD §18.2).
 */
const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] px-6 py-2.5 text-[0.9375rem] font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-clay-dark text-white hover:bg-clay focus-visible:bg-clay",
  secondary: "border border-ink/25 bg-transparent text-ink hover:border-ink hover:bg-canvas",
  onDark: "bg-paper text-espresso hover:bg-stone",
};

export function Button(props: ButtonProps) {
  const { children, variant = "primary", className = "" } = props;
  const classes = `${base} ${variants[variant]} ${className}`;

  if ("href" in props && typeof props.href === "string") {
    return (
      <Link href={props.href} onClick={props.onClick} className={classes}>
        {children}
      </Link>
    );
  }

  const { children: _c, variant: _v, className: _cl, ...buttonProps } = props as RealButtonProps;
  return (
    <button {...buttonProps} className={classes}>
      {children}
    </button>
  );
}
