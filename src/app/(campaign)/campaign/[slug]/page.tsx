import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllCampaigns, getCampaignBySlug } from "@/lib/content";
import { CampaignTemplate } from "@/components/templates/CampaignTemplate";

export async function generateStaticParams() {
  const campaigns = await getAllCampaigns();
  return campaigns.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);
  return {
    title: campaign ? `${campaign.headline} — Ngoan Đặng` : "Chiến dịch — Ngoan Đặng",
    robots: campaign && !campaign.noindex ? undefined : { index: false, follow: false },
  };
}

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);
  if (!campaign) notFound();
  return <CampaignTemplate campaign={campaign} />;
}
