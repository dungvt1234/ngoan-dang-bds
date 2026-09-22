import Link from "next/link";
import type { ReactNode } from "react";

// Link inline trong body text: underline gold. Link điều hướng (nav/footer)
// dùng next/link trực tiếp, không qua primitive này.
export function TextLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const cls = `text-primary underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-hover transition-colors ${className}`;
  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
