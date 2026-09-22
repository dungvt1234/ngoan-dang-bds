import Link from "next/link";

// Tag chủ đề: 1 kiểu duy nhất (pill slate). Màu group chỉ dùng nội bộ,
// không thể hiện ra UI.
export function Tag({
  label,
  href,
}: {
  label: string;
  href?: string;
}) {
  const cls =
    "inline-flex items-center rounded-full bg-dark/5 px-3 py-1 text-[13px] font-medium text-secondary transition-colors hover:bg-dark/10 hover:text-primary";
  if (href) {
    return (
      <Link href={href} className={cls}>
        {label}
      </Link>
    );
  }
  return <span className={cls}>{label}</span>;
}
