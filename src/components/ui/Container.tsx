import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  /** "default" = 1280px content width; "reading" = 760px prose width (PRD §15.5). */
  size?: "default" | "reading";
  className?: string;
};

export function Container({ children, size = "default", className = "" }: ContainerProps) {
  const width = size === "reading" ? "max-w-[760px]" : "max-w-[1280px]";
  return (
    <div className={`mx-auto w-full ${width} px-5 sm:px-8 lg:px-12 ${className}`}>{children}</div>
  );
}
