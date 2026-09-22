import type { Campaign } from "@/types/content";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

// CampaignTemplate V1 — layout riêng, 1 CTA duy nhất, không nav/footer đầy đủ.
// noindex cấu hình từng page ở route (metadata).
export function CampaignTemplate({ campaign }: { campaign: Campaign }) {
  return (
    <div className="section-pad">
      <Container width="prose">
        <Reveal>
        <p className="type-kicker text-accent mb-4">Ngoan Đặng</p>
        <h1 className="type-h1 mb-4">{campaign.headline}</h1>
        {campaign.offer && <p className="type-body text-secondary mb-8">{campaign.offer}</p>}
        </Reveal>
        <Reveal delay={120}>
        <div
          className="type-body space-y-4 mb-10"
          dangerouslySetInnerHTML={{ __html: campaign.bodyHtml }}
        />
        </Reveal>
        <Button href="/lien-he" className="w-full">
          Liên hệ ngay
        </Button>
        <p className="type-caption text-muted text-center mt-4">
          Form {campaign.form_variant} (placeholder — wiring ở phase sau)
        </p>
      </Container>
    </div>
  );
}
