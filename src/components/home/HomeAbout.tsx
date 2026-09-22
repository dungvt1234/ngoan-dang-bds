import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

// Về Ngoan — 2 cột text + quote (theo mẫu) nhưng KHÔNG bịa bio, ảnh portrait,
// quote hay chữ ký. Nội dung thật do Ngoan cung cấp ở phase content.
export function HomeAbout() {
  return (
    <section aria-labelledby="home-about-heading" className="bg-clean">
      <div className="section-pad">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <Reveal>
            <div className="relative aspect-[4/5] max-w-[360px] overflow-hidden rounded-2xl">
              <Image
                src="/images/ngoandang.jmg.jpg"
                alt="Ngoan Đặng — BĐS dự án Vũng Tàu"
                fill
                sizes="(max-width: 1024px) 100vw, 360px"
                className="object-cover"
              />
            </div>
            </Reveal>
            <Reveal className="lg:col-span-1" delay={100}>
            <div>
              <p className="type-kicker text-secondary mb-4">Về Ngoan</p>
              <h2 id="home-about-heading" className="font-display text-primary font-semibold text-[2rem] md:text-[2.75rem] leading-tight mb-6">
                Đồng hành cùng bạn trên hành trình sở hữu giá trị thật
              </h2>
              <p className="type-body text-secondary mb-8 max-w-[560px]">
                Ngoan Đặng đồng hành cùng khách hàng trong việc tìm hiểu, phân
                tích và lựa chọn các dự án bất động sản tại Vũng Tàu. Mục tiêu
                là mang đến thông tin trung thực, góc nhìn chuyên sâu và tư vấn
                phù hợp với nhu cầu thực tế của mỗi khách hàng.
                (Thông tin chi tiết đang được cập nhật.)
              </p>
              <Link
                href="/ve-ngoan"
                className="inline-flex min-h-[48px] items-center px-7 rounded-md bg-accent text-ink font-medium hover:bg-accent-hover transition-colors"
              >
                Tìm hiểu thêm về Ngoan →
              </Link>
            </div>
            </Reveal>
            <Reveal delay={150}>
            <figure className="border-l border-soft pl-8 flex flex-col justify-center h-full">
              <span aria-hidden="true" className="font-display text-6xl text-accent leading-none mb-4">
                &ldquo;
              </span>
              <blockquote className="type-body text-primary mb-6">
                Một quyết định đúng hôm nay có thể tạo ra giá trị lớn cho nhiều
                năm sau.
              </blockquote>
              <figcaption className="font-script text-3xl text-secondary">Ngoan Đặng</figcaption>
            </figure>
            </Reveal>
          </div>
        </Container>
      </div>
    </section>
  );
}
