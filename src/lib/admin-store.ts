import matter from "gray-matter";
import { promises as fs } from "node:fs";
import path from "node:path";

// Đọc/ghi Markdown content.
// Production: qua GitHub API (Vercel filesystem chỉ đọc, không ghi lâu dài).
// Dev (không có GITHUB_* env): đọc/ghi file local cho tiện test.
export type ContentKind = "projects" | "knowledge" | "analysis" | "case-study" | "tin-tuc" | "comparison" | "campaigns";

export const KIND_DIRS: Record<ContentKind, string> = {
  projects: "src/content/projects",
  knowledge: "src/content/knowledge",
  analysis: "src/content/analysis",
  "case-study": "src/content/case-study",
  "tin-tuc": "src/content/tin-tuc",
  comparison: "src/content/comparison",
  campaigns: "src/content/campaigns",
};

export const KIND_LABELS: Record<ContentKind, string> = {
  projects: "Dự án",
  knowledge: "Kiến thức",
  analysis: "Phân tích",
  "case-study": "Case study",
  "tin-tuc": "Tin tức",
  comparison: "So sánh",
  campaigns: "Chiến dịch",
};

const GROUP_ORDER: ContentKind[] = ["projects", "knowledge", "analysis", "case-study", "tin-tuc", "comparison", "campaigns"];
export const KIND_GROUPS: { id: string; label: string; kinds: ContentKind[] }[] = [
  { id: "projects", label: "Dự án", kinds: ["projects"] },
  { id: "articles", label: "Bài viết", kinds: ["knowledge", "analysis", "case-study", "tin-tuc"] },
  { id: "extra", label: "So sánh & chiến dịch", kinds: ["comparison", "campaigns"] },
];
export { GROUP_ORDER };

function gh(): { owner: string; repo: string; token: string } | null {
  const owner = process.env.GITHUB_OWNER || "";
  const repo = process.env.GITHUB_REPO || "";
  const token = process.env.GITHUB_TOKEN || "";
  if (!owner || !repo || !token) return null;
  return { owner, repo, token };
}

async function ghFetch(apiPath: string, init?: RequestInit) {
  const c = gh()!;
  const res = await fetch(`https://api.github.com${apiPath}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${c.token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GitHub API ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

const BRANCH = "master";
const b64e = (s: string) => Buffer.from(s, "utf8").toString("base64");
const b64d = (s: string) => Buffer.from(s.replace(/\n/g, ""), "base64").toString("utf8");

/** Date (YAML tự parse) → "YYYY-MM-DD" để form date dùng được và file gọn. */
export function normalizeDates<T>(v: T): T {
  if (v instanceof Date) return v.toISOString().slice(0, 10) as unknown as T;
  if (Array.isArray(v)) return v.map(normalizeDates) as unknown as T;
  if (v && typeof v === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(v)) out[k] = normalizeDates(val);
    return out as T;
  }
  return v;
}

export async function listSlugs(kind: ContentKind): Promise<string[]> {
  const dir = KIND_DIRS[kind];
  const c = gh();
  if (c) {
    const items = (await ghFetch(`/repos/${c.owner}/${c.repo}/contents/${dir}?ref=${BRANCH}`)) as {
      name: string;
      type: string;
    }[];
    return items.filter((i) => i.type === "file" && i.name.endsWith(".md")).map((i) => i.name.replace(/\.md$/, ""));
  }
  // Dev-only: đọc file local cho tiện test. Production bắt buộc GitHub
  // (filesystem Vercel không ghi lâu dài được).
  if (process.env.NODE_ENV === "production") throw new Error("Chưa cấu hình GITHUB_OWNER/GITHUB_REPO/GITHUB_TOKEN");
  const abs = path.join(/*turbopackIgnore: true*/ process.cwd(), dir);
  const files = await fs.readdir(/*turbopackIgnore: true*/ abs);
  return files.filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}

export async function readDoc(
  kind: ContentKind,
  slug: string
): Promise<{ data: Record<string, unknown>; body: string; sha: string | null }> {
  const filePath = `${KIND_DIRS[kind]}/${slug}.md`;
  const c = gh();
  if (c) {
    const file = (await ghFetch(`/repos/${c.owner}/${c.repo}/contents/${filePath}?ref=${BRANCH}`)) as {
      content: string;
      sha: string;
    };
    const parsed = matter(b64d(file.content));
    return { data: normalizeDates(parsed.data), body: parsed.content.trim(), sha: file.sha };
  }
  if (process.env.NODE_ENV === "production") throw new Error("Chưa cấu hình GITHUB_OWNER/GITHUB_REPO/GITHUB_TOKEN");
  const abs = path.join(/*turbopackIgnore: true*/ process.cwd(), filePath);
  const raw = await fs.readFile(/*turbopackIgnore: true*/ abs, "utf8");
  const parsed = matter(raw);
  return { data: normalizeDates(parsed.data), body: parsed.content.trim(), sha: null };
}

export async function writeDoc(
  kind: ContentKind,
  slug: string,
  data: Record<string, unknown>,
  body: string,
  sha: string | null,
  isNew: boolean
): Promise<void> {
  const filePath = `${KIND_DIRS[kind]}/${slug}.md`;
  const content = matter.stringify(body ? `${body.trim()}\n` : "", data);
  const c = gh();
  if (c) {
    await ghFetch(`/repos/${c.owner}/${c.repo}/contents/${filePath}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `admin: ${isNew ? "thêm" : "sửa"} ${KIND_LABELS[kind]} ${slug}`,
        content: b64e(content),
        branch: BRANCH,
        ...(!isNew && sha ? { sha } : {}),
      }),
    });
    return;
  }
  if (process.env.NODE_ENV === "production") throw new Error("Chưa cấu hình GITHUB_OWNER/GITHUB_REPO/GITHUB_TOKEN");
  const abs = path.join(/*turbopackIgnore: true*/ process.cwd(), filePath);
  await fs.writeFile(/*turbopackIgnore: true*/ abs, content, "utf8");
}

export function storageMode(): "github" | "local" {
  return gh() ? "github" : "local";
}

export function slugOk(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 80;
}
