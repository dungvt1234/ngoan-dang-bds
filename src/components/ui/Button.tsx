import Link from "next/link";
import type { ReactNode } from "react";

// CTA duy nhất toàn site. Có href → render link, không → render <button>.
// 3 variant đúng spec, không thêm success/danger/info.
type ButtonVariant = "primary" | "secondary" | "ghostDark";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-ink hover:bg-accent-hover",
  secondary:
    "border border-dark/25 text-primary hover:border-dark hover:bg-dark hover:text-ondark",
  ghostDark:
    "border border-white/30 text-ondark hover:border-accent hover:text-accent",
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  type = "button",
  children,
  className = "",
}: {
  variant?: ButtonVariant;
  size?: "md" | "sm";
  href?: string;
  type?: "button" | "submit";
  children: ReactNode;
  className?: string;
}) {
  const sizeCls =
    size === "md"
      ? "min-h-[48px] px-7 text-[15px]"
      : "min-h-[44px] px-5 text-sm";
  const cls = `inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-300 ${variants[variant]} ${sizeCls} ${className}`;

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={cls}>
      {children}
    </button>
  );
}
