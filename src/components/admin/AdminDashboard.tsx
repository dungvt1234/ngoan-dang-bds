"use client";

import { useCallback, useEffect, useState } from "react";
import { ArticleForm, CampaignForm, ComparisonForm, ProjectForm, defaultsFor } from "./forms";

interface Item { kind: string; slug: string; title: string; updated: string; noindex: boolean }
interface Group { id: string; label: string; kinds: string[]; items: Item[] }

const KIND_LABEL: Record<string, string> = {
  projects: "Dự án", knowledge: "Kiến thức", analysis: "Phân tích",
  "case-study": "Case study", "tin-tuc": "Tin tức", comparison: "So sánh", campaigns: "Chiến dịch",
};

export function AdminDashboard() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [hasGithub, setHasGithub] = useState(true);
  const [tab, setTab] = useState("projects");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<{ kind: string; slug: string; isNew: boolean } | null>(null);
  const [data, setData] = useState<Record<string, unknown>>({});
  const [body, setBody] = useState("");
  const [sha, setSha] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [newSlug, setNewSlug] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content");
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Tải thất bại");
      setGroups(j.groups);
      setHasGithub(j.github !== false);
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "Tải thất bại" });
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openDoc = async (kind: string, slug: string, isNew = false) => {
    setMsg(null);
    if (isNew) {
      setEditing({ kind, slug: "", isNew: true });
      setData(defaultsFor(kind));
      setBody("");
      setSha(null);
      setNewSlug("");
      return;
    }
    try {
      const res = await fetch(`/api/admin/content?kind=${kind}&slug=${slug}`);
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Mở thất bại");
      setEditing({ kind, slug, isNew: false });
      setData(j.data);
      setBody(j.body || "");
      setSha(j.sha || null);
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "Mở thất bại" });
    }
  };

  const update = (patch: Record<string, unknown>) => setData((d) => ({ ...d, ...patch }));

  const save = async () => {
    if (!editing) return;
    const slug = editing.isNew ? newSlug.trim().toLowerCase() : editing.slug;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      setMsg({ ok: false, text: "Slug chỉ gồm chữ thường, số và gạch ngang (VD: ten-du-an)" });
      return;
    }
    const name = String(data.name || data.title || data.headline || "").trim();
    if (!name) {
      setMsg({ ok: false, text: "Chưa nhập tên/tiêu đề" });
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: editing.kind, slug, data: { ...data, updated_at: new Date().toISOString().slice(0, 10) }, body, sha, isNew: editing.isNew }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Lưu thất bại");
      setMsg({ ok: true, text: `Đã lưu “${name}”. Bấm “Đăng lên web” để lên sóng.` });
      setEditing({ kind: editing.kind, slug, isNew: false });
      load();
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "Lưu thất bại" });
    }
    setSaving(false);
  };

  const publish = async () => {
    if (!confirm("Đăng toàn bộ thay đổi lên web? Web sẽ cập nhật sau 1–2 phút.")) return;
    setPublishing(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/publish", { method: "POST" });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Đăng thất bại");
      setMsg({ ok: true, text: "Đã gửi lệnh đăng. Web cập nhật sau 1–2 phút — tải lại trang web để xem." });
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "Đăng thất bại" });
    }
    setPublishing(false);
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  const group = groups.find((g) => g.id === tab);
  const items = group ? group.items : [];

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-6 md:px-8">
      <header className="mb-6 flex flex-wrap items-center gap-3">
        <div className="mr-auto">
          <p className="type-kicker text-secondary">Quản trị nội dung</p>
          <h1 className="font-display text-2xl font-semibold text-primary">Ngoan Đặng</h1>
        </div>
        <button
          type="button"
          onClick={publish}
          disabled={publishing}
          className="inline-flex min-h-[48px] items-center rounded-full bg-ink px-6 font-medium text-ondark disabled:opacity-50"
        >
          {publishing ? "Đang đăng..." : "Đăng lên web"}
        </button>
        <button
          type="button"
          onClick={logout}
          className="inline-flex min-h-[48px] items-center rounded-full border border-soft px-5 text-sm font-medium text-secondary"
        >
          Thoát
        </button>
      </header>

      {msg && (
        <p role={msg.ok ? "status" : "alert"} className={`mb-4 rounded-xl border p-4 type-small font-medium ${msg.ok ? "border-ok/30 bg-ok/5 text-ok" : "border-risk/30 bg-risk/5 text-risk"}`}>
          {msg.text}
        </p>
      )}

      {!hasGithub && (
        <p role="alert" className="mb-4 rounded-xl border border-warn/30 bg-warn/5 p-4 type-small font-medium text-warn">
          Chưa kết nối GitHub (thiếu GITHUB_OWNER/GITHUB_REPO/GITHUB_TOKEN trong env) — danh sách trống và không lưu được. Xem .env.example để cấu hình.
        </p>
      )}

      {!editing ? (
        <>
          <nav className="mb-4 flex gap-2 overflow-x-auto" aria-label="Nhóm nội dung">
            {groups.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setTab(g.id)}
                aria-pressed={tab === g.id}
                className={`min-h-[44px] whitespace-nowrap rounded-full border px-5 text-sm font-medium ${tab === g.id ? "border-ink bg-ink text-ondark" : "border-soft bg-clean text-secondary"}`}
              >
                {g.label} ({g.items.length})
              </button>
            ))}
          </nav>
          {loading ? (
            <p className="type-small text-secondary">Đang tải...</p>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => openDoc(group?.kinds[0] || "knowledge", "", true)}
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-dashed border-soft text-sm font-medium text-secondary"
              >
                + Thêm mới ({KIND_LABEL[group?.kinds[0] || ""] || ""})
              </button>
              {items.map((it) => (
                <button
                  key={`${it.kind}-${it.slug}`}
                  type="button"
                  onClick={() => openDoc(it.kind, it.slug)}
                  className="flex items-center gap-3 rounded-xl border border-soft bg-clean p-4 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-primary">{it.title}</p>
                    <p className="type-caption text-muted">
                      {KIND_LABEL[it.kind] || it.kind} · {it.slug}{it.updated ? ` · ${it.updated}` : ""}{it.noindex ? " · nháp" : ""}
                    </p>
                  </div>
                  <span className="type-small shrink-0 font-medium text-accent-hover">Sửa →</span>
                </button>
              ))}
              {items.length === 0 && <p className="type-small text-secondary">Chưa có mục nào.</p>}
            </div>
          )}
        </>
      ) : (
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => setEditing(null)} className="type-small min-h-[44px] font-medium text-secondary">
              ← Danh sách
            </button>
            <span className="type-small font-semibold text-primary">
              {editing.isNew ? `Thêm ${KIND_LABEL[editing.kind] || ""} mới` : `Sửa: ${String(data.name || data.title || data.headline || editing.slug)}`}
            </span>
          </div>

          {editing.isNew && (group?.kinds.length || 0) > 1 && (
            <div className="mb-4 rounded-2xl border border-soft bg-clean p-4">
              <label className="block">
                <span className="type-small mb-1.5 block font-medium text-primary">Loại nội dung</span>
                <select
                  value={editing.kind}
                  onChange={(e) => {
                    setEditing({ kind: e.target.value, slug: "", isNew: true });
                    setData(defaultsFor(e.target.value));
                    setBody("");
                  }}
                  className="w-full min-h-[44px] rounded-xl border border-soft bg-page px-3 text-base text-primary focus:outline-none"
                >
                  {group!.kinds.map((k) => (
                    <option key={k} value={k}>{KIND_LABEL[k] || k}</option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {editing.isNew && (
            <div className="mb-4 rounded-2xl border border-soft bg-clean p-4">
              <label className="block">
                <span className="type-small mb-1.5 block font-medium text-primary">Đường dẫn (slug)</span>
                <input
                  type="text"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                  placeholder="vd: ten-du-an-moi"
                  className="w-full min-h-[44px] rounded-xl border border-soft bg-page px-3 text-base text-primary focus:outline-none"
                />
              </label>
            </div>
          )}

          {editing.kind === "projects" && <ProjectForm data={data} update={update} />}
          {["knowledge", "analysis", "case-study", "tin-tuc"].includes(editing.kind) && (
            <ArticleForm data={data} update={update} body={body} setBody={setBody} />
          )}
          {editing.kind === "comparison" && <ComparisonForm data={data} update={update} />}
          {editing.kind === "campaigns" && <CampaignForm data={data} update={update} body={body} setBody={setBody} />}

          <div className="sticky bottom-4 mt-6 flex gap-3 rounded-2xl border border-soft bg-clean/95 p-3 shadow-xl backdrop-blur">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-xl bg-accent px-6 font-semibold text-ink disabled:opacity-50"
            >
              {saving ? "Đang lưu..." : "Lưu lại"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="inline-flex min-h-[52px] items-center rounded-xl border border-soft px-6 text-sm font-medium text-secondary"
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
