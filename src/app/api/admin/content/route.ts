import { NextResponse } from "next/server";
import {
  KIND_GROUPS,
  listSlugs,
  readDoc,
  slugOk,
  storageMode,
  writeDoc,
  type ContentKind,
} from "@/lib/admin-store";

const ALL_KINDS: ContentKind[] = ["projects", "knowledge", "analysis", "case-study", "tin-tuc", "comparison", "campaigns"];

function titleOf(data: Record<string, unknown>): string {
  return String(data.name || data.title || data.headline || data.slug || "(chưa đặt tên)");
}

/** GET /api/admin/content → danh sách tóm tắt toàn kho.
 *  GET /api/admin/content?kind=projects&slug=x → 1 tài liệu {data, body, sha}. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const kind = url.searchParams.get("kind") as ContentKind | null;
  const slug = url.searchParams.get("slug");

  if (kind && slug) {
    if (!ALL_KINDS.includes(kind)) return NextResponse.json({ error: "Loại không hợp lệ" }, { status: 400 });
    try {
      const doc = await readDoc(kind, slug);
      return NextResponse.json({ kind, slug, ...doc });
    } catch {
      return NextResponse.json({ error: "Không đọc được bài này" }, { status: 404 });
    }
  }

  const groups = await Promise.all(
    KIND_GROUPS.map(async (g) => ({
      ...g,
      items: (
        await Promise.all(
          g.kinds.flatMap(async (k) => {
            const slugs = await listSlugs(k).catch(() => [] as string[]);
            const rows = await Promise.all(
              slugs.map(async (s) => {
                try {
                  const d = await readDoc(k, s);
                  return {
                    kind: k,
                    slug: s,
                    title: titleOf({ ...d.data, slug: s }),
                    updated: String(d.data.updated_at || ""),
                    noindex: d.data.noindex === true,
                  };
                } catch {
                  return { kind: k, slug: s, title: s, updated: "", noindex: false };
                }
              })
            );
            return rows;
          })
        )
      ).flat(),
    }))
  );
  return NextResponse.json({
    mode: storageMode(),
    github: !!(process.env.GITHUB_OWNER && process.env.GITHUB_REPO && process.env.GITHUB_TOKEN),
    groups,
  });
}

/** PUT /api/admin/content {kind, slug, data, body, sha?, isNew?} → commit lên GitHub (hoặc ghi local ở dev). */
export async function PUT(req: Request) {
  const { kind, slug, data, body, sha, isNew } = (await req.json().catch(() => ({}))) as {
    kind?: ContentKind;
    slug?: string;
    data?: Record<string, unknown>;
    body?: string;
    sha?: string | null;
    isNew?: boolean;
  };
  if (!kind || !ALL_KINDS.includes(kind) || !slug || !slugOk(slug) || typeof data !== "object" || !data) {
    return NextResponse.json({ error: "Dữ liệu gửi lên chưa hợp lệ" }, { status: 400 });
  }
  // Giữ slug/type đồng bộ với vị trí file.
  const clean: Record<string, unknown> = { ...data, slug };
  if (kind !== "projects" && kind !== "campaigns" && kind !== "comparison") clean.type = kind;
  try {
    await writeDoc(kind, slug, clean, body || "", sha || null, !!isNew);
    return NextResponse.json({ ok: true, mode: storageMode() });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Lưu thất bại" }, { status: 500 });
  }
}
