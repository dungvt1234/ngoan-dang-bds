import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

// Banner CTA cuối trang (theo mẫu): ảnh tối full-bleed + copy trắng + nút gold.
export function CTA() {
  return (
    <section aria-labelledby="cta-heading" className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/stock-vungtau-panorama.jpg"
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/85" />
      </div>
      <div className="relative z-10 section-pad">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <Reveal>
            <div>
              <p className="type-kicker text-accent mb-4">Cần trao đổi về một dự án?</p>
              <h2 id="cta-heading" className="font-display text-ondark font-semibold text-[1.75rem] md:text-[2.5rem] leading-tight">
                Tôi sẵn sàng lắng nghe và hỗ trợ bạn.
              </h2>
            </div>
            </Reveal>
            <Reveal delay={150}>
            <Link
              href="/lien-he"
              className="inline-flex min-h-[48px] items-center justify-center px-7 rounded-md bg-accent text-ink font-medium hover:bg-accent-hover transition-colors shrink-0"
            >
              Liên hệ tư vấn →
            </Link>
            </Reveal>
          </div>
        </Container>
      </div>
    </section>
  );
}
