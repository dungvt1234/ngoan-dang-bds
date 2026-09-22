import type { ReactNode } from "react";

// Pattern tiêu đề section duy nhất: kicker + H2 + dẫn ngắn (optional).
export function SectionHeading({
  kicker,
  title,
  lede,
  align = "left",
  tone = "light",
}: {
  kicker?: string;
  title: ReactNode;
  lede?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
}) {
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";
  const titleCls = tone === "dark" ? "text-ondark" : "text-primary";
  const ledeCls = tone === "dark" ? "text-ondark/70" : "text-secondary";

  return (
    <div className={`max-w-[720px] ${alignCls}`}>
      {kicker ? (
        <p className="type-kicker text-secondary mb-4">{kicker}</p>
      ) : null}
      <h2 className={`type-h2 ${titleCls}`}>{title}</h2>
      {lede ? <p className={`type-body ${ledeCls} mt-4`}>{lede}</p> : null}
    </div>
  );
}
