// ===== Content & Data Model V1 (Phase 2 đã duyệt, Phase 5.2 implement) =====
// Quy ước: snake_case cho frontmatter (khớp file .md). Long-form = markdown string.
// Structured (S) render ra component/bảng/JSON-LD; Long-form (L) là prose tự do.

// --- Enums ---
export type Segment = "nghi-duong" | "de-o" | "do-thi";
export type ProjectStatus = "sap-mo-ban" | "dang-ban" | "da-ban-giao";
export type ProjectTier = "A" | "B" | "C";
export type LegalStatus = "ro-rang" | "dang-hoan-thien" | "can-kiem-chung";
export type ArticleType = "knowledge" | "analysis" | "case-study" | "tin-tuc";
export type ContentType = ArticleType | "comparison";
export type TagGroup = "chu-de" | "khu-vuc" | "doi-tuong";

// --- Tag registry ---
export interface Tag {
  slug: string;
  label: string;
  group: TagGroup;
}

// --- Source & Version (mục E) ---
export interface Source {
  label: string;
  url?: string;
  noted_at: string; // ISO date
}

export interface VersionInfo {
  author: "ngoan-dang";
  published_at: string; // ISO date
  updated_at: string; // ISO date
  sources: Source[];
  change_note?: string;
}

// --- Project sub-structures (S) ---
export interface Landmark {
  name: string;
  minutes: number;
}
export interface PriceRow {
  label: string;
  value: string;
}
export interface PaymentDot {
  dot: string;
  note: string;
}
export interface UnitType {
  name: string;
  area: string;
  price_from: string;
}
export interface Milestone {
  date: string;
  label: string;
  done: boolean;
}
export interface Faq {
  q: string;
  a: string;
}

// --- Project (mục B). Tier-completeness do validator kiểm tra, không do TS. ---
export interface Project extends VersionInfo {
  slug: string;
  name: string;
  segment: Segment;
  status: ProjectStatus;
  tier: ProjectTier;
  location_label: string;
  cover: string;
  cover_alt: string;
  tags: string[];
  noindex: boolean;

  // Location (overview L, còn lại S trừ location_text/developer_track_record)
  overview?: string;
  location_text?: string;
  location_landmarks?: Landmark[];
  map_embed_url?: string;
  developer_name?: string;
  developer_track_record?: string;

  // Commercial
  price_range_text?: string;
  price_note?: string;
  price_table?: PriceRow[];
  payment_text?: string;
  payment_schedule?: PaymentDot[];

  // Legal
  legal?: string;
  legal_status?: LegalStatus;

  // Product / Progress
  product_text?: string;
  unit_types?: UnitType[];
  progress_text?: string;
  progress_milestones?: Milestone[];

  // Analysis
  investment?: string;
  ngoan_view_body?: string;
  ngoan_view_verdict?: string;
  ngoan_view_pros?: string[];
  ngoan_view_cons?: string[];
  ngoan_view_suitable_for?: string[];

  // FAQ + Media
  faq?: Faq[];
  gallery?: string[];

  // Ghi chú nội bộ trong body .md (không render). Giữ raw.
  notes?: string;
}

// --- Article base (mục C). body → bodyHtml khi load. ---
export interface ArticleBase extends VersionInfo {
  type: ContentType;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  bodyHtml: string;
  tags: string[];
  projects: string[];
  reading_minutes?: number;
  featured?: boolean;
  noindex: boolean;
  cover?: string;
  cover_alt?: string;
}

export interface CaseBlock {
  problem: string;
  solution: string;
  result: string;
}

export interface KnowledgeArticle extends ArticleBase {
  type: "knowledge";
}
export interface AnalysisArticle extends ArticleBase {
  type: "analysis";
}
export interface CaseStudyArticle extends ArticleBase {
  type: "case-study";
  case: CaseBlock;
}
export type Article = KnowledgeArticle | AnalysisArticle | CaseStudyArticle;

// --- Campaign (minimal V1 — chỉ đủ test route skeleton, mở rộng ở phase campaign) ---
export interface Campaign {
  slug: string;
  headline: string;
  offer?: string;
  excerpt: string;
  body: string;
  bodyHtml: string;
  form_variant: "short" | "full";
  noindex: boolean;
  published_at: string;
  updated_at: string;
}

// --- Comparison: ArticleBase với type riêng + block so sánh bắt buộc ---
export interface ComparisonRow {
  criterion: string;
  options: string[]; // cùng thứ tự với projects[]
}
export interface PersonaVerdict {
  persona: string;
  text: string;
}
export interface ComparisonBlock {
  criteria: string[];
  rows: ComparisonRow[];
  verdicts: PersonaVerdict[];
}

export interface Comparison extends ArticleBase {
  type: "comparison";
  comparison: ComparisonBlock;
}
