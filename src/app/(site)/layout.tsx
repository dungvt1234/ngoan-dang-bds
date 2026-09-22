import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { FloatingDock } from "@/components/FloatingDock";

// Layout chung toàn site (trừ campaign): header + main + footer + dock nổi.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <FloatingDock />
    </>
  );
}
