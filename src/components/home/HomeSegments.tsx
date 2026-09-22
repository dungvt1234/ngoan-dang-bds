import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

// 3 phân khúc — card sáng, ảnh + icon + mũi tên tròn (theo mẫu).
const SEGMENTS = [
  {
    id: "nghi-duong",
    name: "Căn hộ nghỉ dưỡng",
    description: "Đầu tư giá trị – Trải nghiệm khác biệt",
    image: "/images/stock-bds-villa.jpg",
    alt: "Biệt thự nghỉ dưỡng minh họa (ảnh tạm)",
  },
  {
    id: "de-o",
    name: "Căn hộ để ở",
    description: "Không gian sống – Giá trị bền vững",
    image: "/images/stock-bds-apartment.jpg",
    alt: "Tòa căn hộ minh họa (ảnh tạm)",
  },
  {
    id: "do-thi",
    name: "Khu đô thị",
    description: "Hạ tầng đồng bộ – Tiềm năng dài hạn",
    image: "/images/stock-vungtau-panorama.jpg",
    alt: "Toàn cảnh Vũng Tàu (ảnh tạm)",
  },
];

export function HomeSegments() {
  return (
    <section aria-labelledby="segments-heading" className="bg-page">
      <div className="section-pad">
        <Container>
          <Reveal>
            <p className="type-kicker text-secondary mb-4">Lĩnh vực tập trung</p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
              <h2 id="segments-heading" className="font-display text-primary font-semibold text-[2rem] md:text-[2.75rem] leading-tight">
                Các phân khúc Ngoan đang tư vấn
              </h2>
              <Link href="/du-an" className="type-small font-medium text-primary underline decoration-accent decoration-2 underline-offset-8 hover:text-accent-hover transition-colors shrink-0">
                Xem tất cả lĩnh vực →
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SEGMENTS.map((s, i) => (
              <Reveal key={s.id} delay={i * 120}>
              <Link
                href="/du-an"
                className="group bg-clean rounded-2xl overflow-hidden border border-soft hover:shadow-lg transition-shadow block h-full"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={s.image}
                    alt={s.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center justify-between gap-4 p-5">
                  <div>
                    <h3 className="font-medium text-primary mb-1">{s.name}</h3>
                    <p className="type-small text-secondary">{s.description}</p>
                  </div>
                  <span aria-hidden="true" className="w-10 h-10 shrink-0 grid place-items-center rounded-full border border-accent text-accent-hover group-hover:bg-accent group-hover:text-ink transition-colors">
                    →
                  </span>
                </div>
              </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
