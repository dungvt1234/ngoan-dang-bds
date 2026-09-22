import Link from "next/link";
import { Container } from "@/components/ui/Container";

// Positioning Strip — section 2 homepage: trả lời "Ngoan khác gì web môi giới
// thường?". Tĩnh, editorial, không card/shadow, không animation riêng.
// Props-driven: không biết dữ liệu đến từ Markdown hay CMS.
export interface PositioningPrinciple {
  number: string;
  title: string;
  description: string;
}

export function HomePositioning({
  eyebrow,
  headline,
  supporting,
  principles,
  link,
}: {
  eyebrow: string;
  headline: string;
  supporting: string;
  principles: PositioningPrinciple[];
  link?: { label: string; href: string };
}) {
  return (
    <section aria-labelledby="positioning-heading" className="bg-page">
      <div className="section-pad">
        <Container>
          <div className="max-w-[760px]">
            <p className="type-kicker text-accent mb-6">{eyebrow}</p>
            <h2 id="positioning-heading" className="type-display mb-6">
              {headline}
            </h2>
            <p className="type-body text-secondary mb-16 md:mb-20">{supporting}</p>
          </div>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {principles.map((p) => (
              <li
                key={p.number}
                className="border-t border-soft pt-6"
              >
                <p aria-hidden="true" className="font-display text-lg text-accent mb-3">
                  {p.number}
                </p>
                <h3 className="type-h3 mb-3">{p.title}</h3>
                <p className="type-small text-secondary leading-relaxed">{p.description}</p>
              </li>
            ))}
          </ol>
          {link && (
            <div className="mt-12">
              <Link
                href={link.href}
                className="type-small font-medium text-primary underline decoration-accent decoration-2 underline-offset-8 hover:text-accent-hover transition-colors"
              >
                {link.label} →
              </Link>
            </div>
          )}
        </Container>
      </div>
    </section>
  );
}
