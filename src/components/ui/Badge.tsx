import type { ReactNode } from "react";

// Badge trạng thái/huân chương nhanh: pháp lý, segment, tier.
// Không dùng badge trang trí.
type BadgeTone = "ok" | "warn" | "risk" | "info" | "neutral";

const tones: Record<BadgeTone, string> = {
  ok: "bg-ok/10 text-ok border-ok/30",
  warn: "bg-warn/10 text-warn border-warn/30",
  risk: "bg-risk/10 text-risk border-risk/30",
  info: "bg-dark/5 text-primary border-dark/20",
  neutral: "bg-dark/5 text-secondary border-soft",
};

export function Badge({
  tone = "neutral",
  children,
  className = "",
}: {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
