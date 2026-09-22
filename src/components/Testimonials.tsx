import { testimonials } from "@/lib/data";

export function Testimonials() {
  return (
    <section className="py-28 md:py-40 px-6 md:px-12 lg:px-16 bg-muted">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="mb-16 md:mb-24">
          <p className="text-kicker text-accent mb-5">Testimonials</p>
          <h2 className="text-display font-editorial text-primary leading-[1.08]">
            Voices of Trust
          </h2>
        </div>

        {/* Testimonial Grid — featured center */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 items-start">
          {/* Left card — smaller */}
          {testimonials[0] && (
            <blockquote className="md:col-span-4 p-7 md:p-8 rounded-[24px] bg-white card-spatial">
              <div className="text-5xl font-serif leading-none mb-3 text-accent/20">&ldquo;</div>
              <p className="text-base leading-relaxed mb-8 text-primary">
                {testimonials[0].text}
              </p>
              <footer>
                <div className="w-10 h-10 rounded-full bg-forest/10 mb-3" />
                <cite className="not-italic font-medium text-primary text-sm">
                  {testimonials[0].author}
                </cite>
                {testimonials[0].role && (
                  <p className="text-xs text-secondary mt-1">{testimonials[0].role}</p>
                )}
              </footer>
            </blockquote>
          )}

          {/* Center card — featured */}
          {testimonials[1] && (
            <blockquote className="md:col-span-4 p-8 md:p-10 rounded-[28px] bg-ink text-white card-spatial md:-translate-y-4">
              <div className="text-6xl font-serif leading-none mb-4 text-amber">&ldquo;</div>
              <p className="text-lg leading-relaxed mb-10 text-white/90">
                {testimonials[1].text}
              </p>
              <footer>
                <div className="w-12 h-12 rounded-full bg-white/10 mb-4" />
                <cite className="not-italic font-medium text-white">
                  {testimonials[1].author}
                </cite>
                {testimonials[1].role && (
                  <p className="text-sm text-white/55 mt-1">{testimonials[1].role}</p>
                )}
              </footer>
            </blockquote>
          )}

          {/* Right card — smaller */}
          {testimonials[2] && (
            <blockquote className="md:col-span-4 p-7 md:p-8 rounded-[24px] bg-white card-spatial">
              <div className="text-5xl font-serif leading-none mb-3 text-accent/20">&ldquo;</div>
              <p className="text-base leading-relaxed mb-8 text-primary">
                {testimonials[2].text}
              </p>
              <footer>
                <div className="w-10 h-10 rounded-full bg-forest/10 mb-3" />
                <cite className="not-italic font-medium text-primary text-sm">
                  {testimonials[2].author}
                </cite>
                {testimonials[2].role && (
                  <p className="text-xs text-secondary mt-1">{testimonials[2].role}</p>
                )}
              </footer>
            </blockquote>
          )}
        </div>
      </div>
    </section>
  );
}
