import { cache } from "react";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import type {
  Article,
  ArticleType,
  Campaign,
  Comparison,
  ContentType,
  Project,
  ProjectTier,
  Source,
} from "@/types/content";
import { tagBySlug } from "@/content/tags";

// =====================================================================
// CONTENT PIPELINE V1 — lớp duy nhất được đọc filesystem.
// Page/component KHÔNG đọc file, KHÔNG parse markdown trực tiếp.
// File này chỉ chạy server-side (dùng node:fs).
// =====================================================================

const CONTENT_DIR = path.join(process.cwd(), "src", "content");

export class ContentError extends Error {
  file: string;
  field: string;
  reason: string;
  constructor(file: string, field: string, reason: string) {
    super(`[content] ${file} | field "${field}": ${reason}`);
    this.name = "ContentError";
    this.file = file;
    this.field = field;
    this.reason = reason;
  }
}

// ---------------- primitives ----------------
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function isValidSlug(v: unknown): v is string {
  return isNonEmptyString(v) && SLUG_RE.test(v.trim());
}

// YAML tự parse date thành object Date — chuẩn hóa về yyyy-mm-dd.
function normalizeDate(v: unknown): string | null {
  if (v instanceof Date && !isNaN(v.getTime())) {
    return v.toISOString().slice(0, 10);
  }
  if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v.trim())) {
    const d = new Date(v);
    if (!isNaN(d.getTime())) return v.trim().slice(0, 10);
  }
  return null;
}

function assertEnum<T extends string>(
  file: string,
  field: string,
  v: unknown,
  allowed: readonly T[]
): T {
  if (typeof v !== "string" || !(allowed as readonly string[]).includes(v)) {
    throw new ContentError(file, field, `phải là một trong: ${allowed.join(", ")}`);
  }
  return v as T;
}

function requireString(file: string, field: string, v: unknown): string {
  if (!isNonEmptyString(v)) throw new ContentError(file, field, "bắt buộc, chuỗi không rỗng");
  return v.trim();
}

function optionalString(v: unknown): string | undefined {
  return isNonEmptyString(v) ? v.trim() : undefined;
}

function requireStringArray(file: string, field: string, v: unknown): string[] {
  if (!Array.isArray(v) || v.length === 0 || !v.every(isNonEmptyString)) {
    throw new ContentError(file, field, "bắt buộc, mảng chuỗi không rỗng");
  }
  return v.map((s) => String(s).trim());
}

// ---------------- shared: tags / sources / version ----------------
function parseTags(file: string, v: unknown): string[] {
  const tags = requireStringArray(file, "tags", v).map((t) => t.toLowerCase());
  for (const t of tags) {
    if (!tagBySlug.has(t)) {
      throw new ContentError(file, "tags", `tag "${t}" chưa có trong registry (src/content/tags.ts)`);
    }
  }
  if (new Set(tags).size !== tags.length) {
    throw new ContentError(file, "tags", "không được duplicate");
  }
  const hasChuDe = tags.some((t) => tagBySlug.get(t)?.group === "chu-de");
  if (!hasChuDe) {
    throw new ContentError(file, "tags", "mỗi content phải có ít nhất 1 tag nhóm chu-de");
  }
  return tags;
}

function parseSources(file: string, v: unknown, min: number): Source[] {
  const arr = v ?? [];
  if (!Array.isArray(arr)) throw new ContentError(file, "sources", "phải là mảng");
  if (arr.length < min) {
    throw new ContentError(file, "sources", `cần ít nhất ${min} nguồn (analysis/comparison bắt buộc có căn cứ)`);
  }
  return arr.map((s, i) => {
    if (typeof s !== "object" || s === null || !isNonEmptyString((s as { label?: unknown }).label)) {
      throw new ContentError(file, `sources[${i}]`, "mỗi source cần label không rỗng");
    }
    const src = s as { label: string; url?: unknown; noted_at?: unknown };
    let url: string | undefined;
    if (src.url !== undefined) {
      if (!isNonEmptyString(src.url)) throw new ContentError(file, `sources[${i}].url`, "url rỗng thì bỏ field");
      try {
        new URL(src.url.trim());
        url = src.url.trim();
      } catch {
        throw new ContentError(file, `sources[${i}].url`, "url không hợp lệ");
      }
    }
    const noted = normalizeDate(src.noted_at);
    if (!noted) throw new ContentError(file, `sources[${i}].noted_at`, "ngày không hợp lệ (yyyy-mm-dd)");
    return { label: src.label.trim(), url, noted_at: noted };
  });
}

function parseVersion(file: string, data: Record<string, unknown>) {
  const author = data.author ?? "ngoan-dang";
  if (author !== "ngoan-dang") {
    throw new ContentError(file, "author", 'V1 chỉ chấp nhận author "ngoan-dang"');
  }
  const published_at = normalizeDate(data.published_at);
  if (!published_at) throw new ContentError(file, "published_at", "ngày không hợp lệ (yyyy-mm-dd)");
  const updated_at = normalizeDate(data.updated_at);
  if (!updated_at) throw new ContentError(file, "updated_at", "ngày không hợp lệ (yyyy-mm-dd)");
  return { author, published_at, updated_at } as const;
}

// ---------------- markdown ----------------
async function markdownToHtml(md: string): Promise<string> {
  const out = await remark().use(remarkHtml).process(md);
  return String(out);
}

function readMarkdownFiles(dir: string): { file: string; raw: string }[] {
  const abs = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(abs)) return [];
  return fs
    .readdirSync(abs)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => ({ file: `${dir}/${f}`, raw: fs.readFileSync(path.join(abs, f), "utf8") }));
}

// ---------------- project ----------------
const TIER_B_FIELDS = [
  "overview",
  "location_text",
  "price_range_text",
  "legal",
  "legal_status",
  "ngoan_view_verdict",
  "ngoan_view_pros",
  "ngoan_view_cons",
] as const;

const TIER_A_FIELDS = [
  "developer_name",
  "price_table",
  "payment_text",
  "product_text",
  "progress_text",
  "investment",
  "faq",
] as const;

function hasValue(v: unknown): boolean {
  if (v === undefined || v === null) return false;
  if (typeof v === "string") return v.trim().length > 0;
  if (Array.isArray(v)) return v.length > 0;
  return true;
}

async function parseProjectFile(file: string, raw: string): Promise<Project> {
  const { data, content } = matter(raw);
  const d = data as Record<string, unknown>;

  const slug = requireString(file, "slug", d.slug);
  if (!isValidSlug(slug)) throw new ContentError(file, "slug", "slug sai format (lowercase, không dấu, nối gạch)");
  // File mẫu quy ước prefix "_" được miễn trùng tên file == slug.
  const base = path.basename(file, ".md");
  if (!base.startsWith("_") && base !== slug) {
    throw new ContentError(file, "slug", `tên file "${base}.md" phải trùng slug "${slug}"`);
  }

  const tier = assertEnum(file, "tier", d.tier, ["A", "B", "C"] as const);
  const required: string[] =
    tier === "A"
      ? [...TIER_B_FIELDS, ...TIER_A_FIELDS]
      : tier === "B"
        ? [...TIER_B_FIELDS]
        : [];
  for (const f of required) {
    if (!hasValue(d[f])) {
      throw new ContentError(file, f, `Tier ${tier} bắt buộc field này (thiếu → BUILD ERROR)`);
    }
  }

  const tags = parseTags(file, d.tags);
  const version = parseVersion(file, d);
  const sources = parseSources(file, d.sources, 0);

  const project: Project = {
    ...version,
    sources,
    change_note: optionalString(d.change_note),
    slug,
    name: requireString(file, "name", d.name),
    segment: assertEnum(file, "segment", d.segment, ["nghi-duong", "de-o", "do-thi"] as const),
    status: assertEnum(file, "status", d.status, ["sap-mo-ban", "dang-ban", "da-ban-giao"] as const),
    tier,
    location_label: requireString(file, "location_label", d.location_label),
    cover: requireString(file, "cover", d.cover),
    cover_alt: requireString(file, "cover_alt", d.cover_alt),
    tags,
    // noindex là SEO decision riêng — Tier KHÔNG tự quyết định (spec H).
    noindex: d.noindex === true,
    featured: d.featured === true,
    overview: optionalString(d.overview),
    location_text: optionalString(d.location_text),
    location_landmarks: Array.isArray(d.location_landmarks)
      ? (d.location_landmarks as { name: string; minutes: number }[])
      : undefined,
    map_embed_url: optionalString(d.map_embed_url),
    developer_name: optionalString(d.developer_name),
    developer_track_record: optionalString(d.developer_track_record),
    price_range_text: optionalString(d.price_range_text),
    price_note: optionalString(d.price_note),
    price_table: Array.isArray(d.price_table) ? (d.price_table as Project["price_table"]) : undefined,
    payment_text: optionalString(d.payment_text),
    payment_schedule: Array.isArray(d.payment_schedule)
      ? (d.payment_schedule as Project["payment_schedule"])
      : undefined,
    legal: optionalString(d.legal),
    legal_status: d.legal_status
      ? assertEnum(file, "legal_status", d.legal_status, ["ro-rang", "dang-hoan-thien", "can-kiem-chung"] as const)
      : undefined,
    product_text: optionalString(d.product_text),
    unit_types: Array.isArray(d.unit_types) ? (d.unit_types as Project["unit_types"]) : undefined,
    progress_text: optionalString(d.progress_text),
    progress_milestones: Array.isArray(d.progress_milestones)
      ? (d.progress_milestones as Project["progress_milestones"])
      : undefined,
    investment: optionalString(d.investment),
    ngoan_view_body: optionalString(d.ngoan_view_body),
    ngoan_view_verdict: optionalString(d.ngoan_view_verdict),
    ngoan_view_pros: Array.isArray(d.ngoan_view_pros) ? (d.ngoan_view_pros as string[]) : undefined,
    ngoan_view_cons: Array.isArray(d.ngoan_view_cons) ? (d.ngoan_view_cons as string[]) : undefined,
    ngoan_view_suitable_for: Array.isArray(d.ngoan_view_suitable_for)
      ? (d.ngoan_view_suitable_for as string[])
      : undefined,
    faq: Array.isArray(d.faq) ? (d.faq as Project["faq"]) : undefined,
    gallery: Array.isArray(d.gallery) ? (d.gallery as string[]) : undefined,
    notes: content.trim() ? content.trim() : undefined,
  };
  return project;
}

// ---------------- article / comparison ----------------
type ArticleFolder = "knowledge" | "analysis" | "case-study" | "tin-tuc";

function parseProjectRefs(file: string, v: unknown, knownSlugs: Set<string>, min: number): string[] {
  const arr = v ?? [];
  if (!Array.isArray(arr)) throw new ContentError(file, "projects", "phải là mảng slug");
  if (arr.length < min) {
    throw new ContentError(file, "projects", `cần ít nhất ${min} project reference`);
  }
  for (const s of arr) {
    if (!isValidSlug(s)) throw new ContentError(file, "projects", `slug "${s}" sai format`);
    if (!knownSlugs.has(String(s))) {
      throw new ContentError(file, "projects", `project "${s}" không tồn tại trong src/content/projects/`);
    }
  }
  return arr.map(String);
}

async function parseArticleFile(
  file: string,
  raw: string,
  expectedFolder: ArticleFolder | "comparison",
  knownSlugs: Set<string>
): Promise<Article | Comparison> {
  const { data, content } = matter(raw);
  const d = data as Record<string, unknown>;

  const type = assertEnum(file, "type", d.type, ["knowledge", "analysis", "case-study", "tin-tuc", "comparison"] as const);
  const folderType: ContentType =
    expectedFolder === "comparison" ? "comparison" : (expectedFolder as ArticleType);
  if (type !== folderType) {
    throw new ContentError(file, "type", `file trong folder "${expectedFolder}" phải có type "${folderType}"`);
  }

  const slug = requireString(file, "slug", d.slug);
  if (!isValidSlug(slug)) throw new ContentError(file, "slug", "slug sai format (lowercase, không dấu, nối gạch)");
  const base = path.basename(file, ".md");
  if (!base.startsWith("_") && base !== slug) {
    throw new ContentError(file, "slug", `tên file "${base}.md" phải trùng slug "${slug}"`);
  }
  if (!isNonEmptyString(content)) throw new ContentError(file, "body", "body markdown không được rỗng");

  const tags = parseTags(file, d.tags);
  const version = parseVersion(file, d);
  const minSources = type === "analysis" || type === "comparison" ? 1 : 0;
  const sources = parseSources(file, d.sources, minSources);
  const projects = parseProjectRefs(file, d.projects, knownSlugs, type === "comparison" ? 2 : 0);

  const base_ = {
    ...version,
    sources,
    change_note: optionalString(d.change_note),
    type,
    title: requireString(file, "title", d.title),
    slug,
    excerpt: requireString(file, "excerpt", d.excerpt),
    body: content.trim(),
    bodyHtml: await markdownToHtml(content),
    tags,
    projects,
    reading_minutes: typeof d.reading_minutes === "number" ? d.reading_minutes : undefined,
    featured: d.featured === true,
    noindex: d.noindex === true,
    cover: optionalString(d.cover),
    cover_alt: optionalString(d.cover_alt),
  };

  if (type === "case-study") {
    const c = d.case as { problem?: unknown; solution?: unknown; result?: unknown } | undefined;
    if (!c || typeof c !== "object") throw new ContentError(file, "case", "case-study bắt buộc block case");
    for (const k of ["problem", "solution", "result"] as const) {
      if (!isNonEmptyString(c[k])) throw new ContentError(file, `case.${k}`, "bắt buộc, không rỗng");
    }
    return {
      ...base_,
      type: "case-study",
      case: {
        problem: String(c.problem).trim(),
        solution: String(c.solution).trim(),
        result: String(c.result).trim(),
      },
    };
  }

  if (type === "comparison") {
    const c = d.comparison as
      | { criteria?: unknown; rows?: unknown; verdicts?: unknown }
      | undefined;
    if (!c || typeof c !== "object") throw new ContentError(file, "comparison", "comparison bắt buộc block comparison");
    if (!Array.isArray(c.criteria) || c.criteria.length === 0 || !c.criteria.every(isNonEmptyString)) {
      throw new ContentError(file, "comparison.criteria", "cần ít nhất 1 tiêu chí");
    }
    if (!Array.isArray(c.rows) || c.rows.length === 0) {
      throw new ContentError(file, "comparison.rows", "cần ít nhất 1 hàng so sánh");
    }
    c.rows.forEach((r, i) => {
      const row = r as { criterion?: unknown; options?: unknown };
      if (!isNonEmptyString(row?.criterion)) {
        throw new ContentError(file, `comparison.rows[${i}].criterion`, "bắt buộc");
      }
      if (!Array.isArray(row?.options) || (row.options as unknown[]).length !== projects.length) {
        throw new ContentError(
          file,
          `comparison.rows[${i}].options`,
          `số options phải bằng số projects (${projects.length})`
        );
      }
    });
    if (!Array.isArray(c.verdicts) || c.verdicts.length === 0) {
      throw new ContentError(file, "comparison.verdicts", "cần ít nhất 1 verdict theo persona (không score)");
    }
    return {
      ...base_,
      type: "comparison",
      comparison: c as Comparison["comparison"],
    };
  }

  return { ...base_, type: type as ArticleType } as Article;
}

// ---------------- campaign (minimal V1) ----------------
async function parseCampaignFile(file: string, raw: string): Promise<Campaign> {
  const { data, content } = matter(raw);
  const d = data as Record<string, unknown>;

  const slug = requireString(file, "slug", d.slug);
  if (!isValidSlug(slug)) throw new ContentError(file, "slug", "slug sai format (lowercase, không dấu, nối gạch)");
  const base = path.basename(file, ".md");
  if (!base.startsWith("_") && base !== slug) {
    throw new ContentError(file, "slug", `tên file "${base}.md" phải trùng slug "${slug}"`);
  }
  if (!isNonEmptyString(content)) throw new ContentError(file, "body", "body markdown không được rỗng");
  const published_at = normalizeDate(d.published_at);
  if (!published_at) throw new ContentError(file, "published_at", "ngày không hợp lệ (yyyy-mm-dd)");
  const updated_at = normalizeDate(d.updated_at);
  if (!updated_at) throw new ContentError(file, "updated_at", "ngày không hợp lệ (yyyy-mm-dd)");

  return {
    slug,
    headline: requireString(file, "headline", d.headline),
    offer: optionalString(d.offer),
    excerpt: requireString(file, "excerpt", d.excerpt),
    body: content.trim(),
    bodyHtml: await markdownToHtml(content),
    form_variant: d.form_variant
      ? assertEnum(file, "form_variant", d.form_variant, ["short", "full"] as const)
      : "short",
    // Default noindex cho campaign (landing ads) — mở index thủ công từng page khi cần SEO.
    noindex: d.noindex === false ? false : true,
    published_at,
    updated_at,
  };
}

// ---------------- store ----------------
interface Store {
  projects: Project[];
  articles: Article[];
  comparisons: Comparison[];
  campaigns: Campaign[];
}

let storeCache: Store | null = null;

export async function loadStore(): Promise<Store> {
  // Dev: đọc lại file mỗi lần để sửa .md thấy ngay không cần restart.
  // Production: cache trong module (1 lần/build).
  if (storeCache && process.env.NODE_ENV === "production") return storeCache;

  const projectFiles = readMarkdownFiles("projects");
  const projects = await Promise.all(projectFiles.map((f) => parseProjectFile(f.file, f.raw)));
  const seenProject = new Set<string>();
  for (const p of projects) {
    if (seenProject.has(p.slug)) throw new ContentError(`projects/${p.slug}.md`, "slug", "duplicate slug");
    seenProject.add(p.slug);
  }

  const articles: Article[] = [];
  const comparisons: Comparison[] = [];
  for (const folder of ["knowledge", "analysis", "case-study", "tin-tuc", "comparison"] as const) {
    const seen = new Set<string>();
    for (const f of readMarkdownFiles(folder)) {
      const parsed = await parseArticleFile(f.file, f.raw, folder, seenProject);
      if (seen.has(parsed.slug)) throw new ContentError(f.file, "slug", "duplicate slug trong folder");
      seen.add(parsed.slug);
      if (parsed.type === "comparison") comparisons.push(parsed);
      else articles.push(parsed as Article);
    }
  }

  const campaigns: Campaign[] = [];
  {
    const seen = new Set<string>();
    for (const f of readMarkdownFiles("campaigns")) {
      const parsed = await parseCampaignFile(f.file, f.raw);
      if (seen.has(parsed.slug)) throw new ContentError(f.file, "slug", "duplicate slug trong folder");
      seen.add(parsed.slug);
      campaigns.push(parsed);
    }
  }

  const tierRank: Record<ProjectTier, number> = { A: 0, B: 1, C: 2 };
  projects.sort(
    (a, b) => tierRank[a.tier] - tierRank[b.tier] || b.updated_at.localeCompare(a.updated_at)
  );
  const byDate = <T extends { updated_at: string }>(arr: T[]) =>
    arr.sort((a, b) => b.updated_at.localeCompare(a.updated_at));
  byDate(articles);
  byDate(comparisons);
  byDate(campaigns);

  storeCache = { projects, articles, comparisons, campaigns };
  return storeCache;
}

// Test hooks — CHỈ verify script dùng. Page/component không được gọi.
export async function __parseProjectForTest(file: string, raw: string): Promise<Project> {
  return parseProjectFile(file, raw);
}
export async function __parseArticleForTest(
  file: string,
  raw: string,
  folder: "knowledge" | "analysis" | "case-study" | "tin-tuc" | "comparison",
  knownSlugs: Set<string>
): Promise<Article | Comparison> {
  return parseArticleFile(file, raw, folder, knownSlugs);
}

// Dùng trong verify script / test để reset giữa các lần chạy.
export function __resetStore() {
  storeCache = null;
}

// ---------------- queries (mục I) — luôn qua store, không đọc file lẻ ----------------
export const getAllProjects = cache(async (): Promise<Project[]> => (await loadStore()).projects);

export const getProjectBySlug = cache(async (slug: string): Promise<Project | undefined> =>
  (await loadStore()).projects.find((p) => p.slug === slug)
);

// Featured cho homepage: ưu tiên featured=true, rồi Tier, rồi mới nhất.
// Bỏ qua slug demo- khi đã có dự án thật; chỉ dùng demo khi chưa có gì.
export const getFeaturedProjects = cache(async (limit = 4): Promise<Project[]> => {
  const { projects } = await loadStore();
  const real = projects.filter((p) => !p.slug.startsWith("demo-"));
  const pool = real.length > 0 ? real : projects;
  const tierRank: Record<ProjectTier, number> = { A: 0, B: 1, C: 2 };
  return [...pool]
    .sort(
      (a, b) =>
        Number(b.featured ?? false) - Number(a.featured ?? false) ||
        tierRank[a.tier] - tierRank[b.tier] ||
        b.updated_at.localeCompare(a.updated_at)
    )
    .slice(0, limit);
});

export const getAllArticles = cache(async (): Promise<Article[]> => (await loadStore()).articles);

export const getArticlesByType = cache(async (type: ArticleType): Promise<Article[]> =>
  (await loadStore()).articles.filter((a) => a.type === type)
);

export const getArticleBySlug = cache(
  async (type: ArticleType, slug: string): Promise<Article | undefined> =>
    (await loadStore()).articles.find((a) => a.type === type && a.slug === slug)
);

export const getAllComparisons = cache(async (): Promise<Comparison[]> => (await loadStore()).comparisons);

export const getComparisonBySlug = cache(async (slug: string): Promise<Comparison | undefined> =>
  (await loadStore()).comparisons.find((c) => c.slug === slug)
);

export const getAllCampaigns = cache(async (): Promise<Campaign[]> => (await loadStore()).campaigns);

export const getCampaignBySlug = cache(async (slug: string): Promise<Campaign | undefined> =>
  (await loadStore()).campaigns.find((c) => c.slug === slug)
);

// Project → content có projects[] chứa slug, rồi cùng tags.
export const getRelatedContent = cache(
  async (projectSlug: string, limit = 6): Promise<(Article | Comparison)[]> => {
    const { articles, comparisons } = await loadStore();
    const all = [...articles, ...comparisons];
    const project = await getProjectBySlug(projectSlug);
    const direct = all.filter((a) => a.projects.includes(projectSlug));
    const byTag = project
      ? all.filter(
          (a) => !a.projects.includes(projectSlug) && a.tags.some((t) => project.tags.includes(t))
        )
      : [];
    // Ưu tiên: cùng project → cùng tags → cùng type nhóm lại không cần ở V1.
    return [...direct, ...byTag].filter((a, i, arr) => arr.indexOf(a) === i).slice(0, limit);
  }
);

// Article → projects trong projects[] + project cùng tags.
export const getRelatedProjects = cache(async (slug: string, limit = 4): Promise<Project[]> => {
  const { articles, comparisons, projects } = await loadStore();
  const article = [...articles, ...comparisons].find((a) => a.slug === slug);
  if (!article) return [];
  const direct = projects.filter((p) => article.projects.includes(p.slug));
  const byTag = projects.filter(
    (p) => !article.projects.includes(p.slug) && p.tags.some((t) => article.tags.includes(t))
  );
  return [...direct, ...byTag].slice(0, limit);
});

export const getByTag = cache(
  async (tag: string): Promise<{ projects: Project[]; articles: Article[]; comparisons: Comparison[] }> => {
    const { projects, articles, comparisons } = await loadStore();
    const has = <T extends { tags: string[] }>(x: T) => x.tags.includes(tag);
    return {
      projects: projects.filter(has),
      articles: articles.filter(has),
      comparisons: comparisons.filter(has),
    };
  }
);

export type { Source };
