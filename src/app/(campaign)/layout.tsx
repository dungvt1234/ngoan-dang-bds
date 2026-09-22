import Link from "next/link";

// Campaign layout riêng: wordmark tối giản + không nav/footer đầy đủ.
// Không dùng SiteHeader/SiteFooter để tránh rò chuyển đổi trên landing ads.
export default function CampaignLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="py-5">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8">
          <Link href="/" className="font-display text-lg font-semibold tracking-tight text-primary">
            Ngoan Đặng
          </Link>
        </div>
      </header>
      <main>{children}</main>
    </>
  );
}
