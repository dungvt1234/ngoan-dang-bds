"use client";

import { Check, DateInput, Field, Lines, RowList, Section, Select, TagsInput, Text, TextArea, num, str, strArr } from "./fields";

export type Patch = (p: Record<string, unknown>) => void;

const SEGMENTS = [
  { value: "nghi-duong", label: "Nghỉ dưỡng" },
  { value: "de-o", label: "Để ở" },
  { value: "do-thi", label: "Khu đô thị" },
] as const;

const STATUSES = [
  { value: "sap-mo-ban", label: "Sắp mở bán" },
  { value: "dang-ban", label: "Đang bán" },
  { value: "da-ban-giao", label: "Đã bàn giao" },
] as const;

const TIERS = [
  { value: "A", label: "A — đầy đủ" },
  { value: "B", label: "B — cơ bản" },
  { value: "C", label: "C — nháp" },
] as const;

const LEGALS = [
  { value: "ro-rang", label: "Rõ ràng" },
  { value: "dang-hoan-thien", label: "Đang hoàn thiện" },
  { value: "can-kiem-chung", label: "Cần kiểm chứng" },
] as const;

function CommonMeta({ data, update }: { data: Record<string, unknown>; update: Patch }) {
  return (
    <Section title="Hiển thị & ngày">
      <Field label="Ngày đăng">
        <DateInput value={str(data.published_at)} onChange={(e) => update({ published_at: e.target.value })} />
      </Field>
      <Field label="Ngày cập nhật">
        <DateInput value={str(data.updated_at)} onChange={(e) => update({ updated_at: e.target.value })} />
      </Field>
      <Field label="Ảnh cover" hint="Đường dẫn /images/... trong thư mục public">
        <Text value={str(data.cover)} onChange={(e) => update({ cover: e.target.value })} placeholder="/images/..." />
      </Field>
      <Field label="Mô tả ảnh (SEO)">
        <Text value={str(data.cover_alt)} onChange={(e) => update({ cover_alt: e.target.value })} />
      </Field>
      <Field label="Tags">
        <TagsInput value={strArr(data.tags)} onChange={(v) => update({ tags: v })} />
      </Field>
      <div className="flex flex-col gap-1">
        <Check checked={data.featured === true} onChange={(v) => update({ featured: v })} label="Ghim lên trang chủ" />
        <Check checked={data.noindex !== false} onChange={(v) => update({ noindex: v })} label="Ẩn khỏi Google (bản nháp)" />
      </div>
    </Section>
  );
}

export function ProjectForm({ data, update }: { data: Record<string, unknown>; update: Patch }) {
  return (
    <div className="flex flex-col gap-4">
      <Section title="Cơ bản">
        <Field label="Tên dự án"><Text value={str(data.name)} onChange={(e) => update({ name: e.target.value })} /></Field>
        <Field label="Địa chỉ hiển thị"><Text value={str(data.location_label)} onChange={(e) => update({ location_label: e.target.value })} /></Field>
        <Field label="Phân khúc">
          <Select value={str(data.segment, "de-o")} options={SEGMENTS} onChange={(v) => update({ segment: v })} />
        </Field>
        <Field label="Trạng thái">
          <Select value={str(data.status, "sap-mo-ban")} options={STATUSES} onChange={(v) => update({ status: v })} />
        </Field>
        <Field label="Mức độ đầy đủ">
          <Select value={str(data.tier, "C")} options={TIERS} onChange={(v) => update({ tier: v })} />
        </Field>
        <Field label="Khoảng giá" hint="VD: Từ 8,5 tỷ/căn">
          <Text value={str(data.price_range_text)} onChange={(e) => update({ price_range_text: e.target.value })} />
        </Field>
      </Section>

      <Section title="Tổng quan">
        <div className="md:col-span-2">
          <Field label="Đoạn giới thiệu">
            <TextArea rows={5} value={str(data.overview)} onChange={(e) => update({ overview: e.target.value })} />
          </Field>
        </div>
      </Section>

      <Section title="Vị trí & chủ đầu tư">
        <div className="md:col-span-2">
          <Field label="Mô tả vị trí"><TextArea value={str(data.location_text)} onChange={(e) => update({ location_text: e.target.value })} /></Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Địa danh lân cận (tên + số phút)">
            <RowList
              items={(Array.isArray(data.location_landmarks) ? data.location_landmarks : []) as Record<string, unknown>[]}
              onChange={(v) => update({ location_landmarks: v })}
              fields={[{ key: "name", label: "Tên địa danh" }, { key: "minutes", label: "Số phút" }]}
              addLabel="Thêm địa danh"
            />
          </Field>
        </div>
        <Field label="Chủ đầu tư"><Text value={str(data.developer_name)} onChange={(e) => update({ developer_name: e.target.value })} /></Field>
        <Field label="Hồ sơ chủ đầu tư"><TextArea value={str(data.developer_track_record)} onChange={(e) => update({ developer_track_record: e.target.value })} /></Field>
      </Section>

      <Section title="Giá & thanh toán">
        <div className="md:col-span-2">
          <Field label="Bảng giá (từng dòng: tên + giá)">
            <RowList
              items={(Array.isArray(data.price_table) ? data.price_table : []) as Record<string, unknown>[]}
              onChange={(v) => update({ price_table: v })}
              fields={[{ key: "label", label: "Tên loại" }, { key: "value", label: "Giá" }]}
              addLabel="Thêm dòng giá"
            />
          </Field>
        </div>
        <Field label="Ghi chú giá"><Text value={str(data.price_note)} onChange={(e) => update({ price_note: e.target.value })} /></Field>
        <Field label="Chính sách thanh toán"><TextArea value={str(data.payment_text)} onChange={(e) => update({ payment_text: e.target.value })} /></Field>
        <div className="md:col-span-2">
          <Field label="Tiến độ đóng tiền (từng đợt)">
            <RowList
              items={(Array.isArray(data.payment_schedule) ? data.payment_schedule : []) as Record<string, unknown>[]}
              onChange={(v) => update({ payment_schedule: v })}
              fields={[{ key: "dot", label: "Đợt" }, { key: "note", label: "Ghi chú", type: "textarea" }]}
              addLabel="Thêm đợt"
            />
          </Field>
        </div>
      </Section>

      <Section title="Pháp lý & tiến độ">
        <Field label="Tình trạng pháp lý">
          <Select
            value={str(data.legal_status)}
            options={LEGALS}
            allowEmpty
            emptyLabel="— Chưa rõ —"
            onChange={(v) => update({ legal_status: v || undefined })}
          />
        </Field>
        <Field label="Chi tiết pháp lý"><TextArea value={str(data.legal)} onChange={(e) => update({ legal: e.target.value })} /></Field>
        <div className="md:col-span-2">
          <Field label="Tiến độ thi công"><TextArea value={str(data.progress_text)} onChange={(e) => update({ progress_text: e.target.value })} /></Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Các mốc (ngày + việc + đã xong?)">
            <RowList
              items={(Array.isArray(data.progress_milestones) ? data.progress_milestones : []) as Record<string, unknown>[]}
              onChange={(v) => update({ progress_milestones: v })}
              fields={[{ key: "date", label: "Ngày", type: "date" }, { key: "label", label: "Việc" }, { key: "done", label: "Đã xong", type: "check" }]}
              addLabel="Thêm mốc"
            />
          </Field>
        </div>
      </Section>

      <Section title="Sản phẩm">
        <div className="md:col-span-2">
          <Field label="Mô tả sản phẩm"><TextArea value={str(data.product_text)} onChange={(e) => update({ product_text: e.target.value })} /></Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Loại căn (tên + diện tích + giá từ)">
            <RowList
              items={(Array.isArray(data.unit_types) ? data.unit_types : []) as Record<string, unknown>[]}
              onChange={(v) => update({ unit_types: v })}
              fields={[{ key: "name", label: "Tên" }, { key: "area", label: "Diện tích" }, { key: "price_from", label: "Giá từ" }]}
              addLabel="Thêm loại căn"
            />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Ảnh gallery (mỗi dòng 1 đường dẫn)">
            <Lines value={strArr(data.gallery)} onChange={(v) => update({ gallery: v })} placeholder="/images/..." />
          </Field>
        </div>
      </Section>

      <Section title="Góc nhìn của Ngoan">
        <div className="md:col-span-2">
          <Field label="Nhận định chốt (1 câu)"><TextArea rows={2} value={str(data.ngoan_view_verdict)} onChange={(e) => update({ ngoan_view_verdict: e.target.value })} /></Field>
        </div>
        <Field label="Điểm cộng (mỗi dòng 1 ý)">
          <Lines value={strArr(data.ngoan_view_pros)} onChange={(v) => update({ ngoan_view_pros: v })} />
        </Field>
        <Field label="Điểm trừ (mỗi dòng 1 ý)">
          <Lines value={strArr(data.ngoan_view_cons)} onChange={(v) => update({ ngoan_view_cons: v })} />
        </Field>
        <Field label="Phù hợp với ai (mỗi dòng 1 nhóm)">
          <Lines value={strArr(data.ngoan_view_suitable_for)} onChange={(v) => update({ ngoan_view_suitable_for: v })} />
        </Field>
        <Field label="Diễn giải chi tiết"><TextArea value={str(data.ngoan_view_body)} onChange={(e) => update({ ngoan_view_body: e.target.value })} /></Field>
        <div className="md:col-span-2">
          <Field label="Góc đầu tư"><TextArea value={str(data.investment)} onChange={(e) => update({ investment: e.target.value })} /></Field>
        </div>
      </Section>

      <Section title="Hỏi đáp & nguồn">
        <div className="md:col-span-2">
          <Field label="Câu hỏi thường gặp">
            <RowList
              items={(Array.isArray(data.faq) ? data.faq : []) as Record<string, unknown>[]}
              onChange={(v) => update({ faq: v })}
              fields={[{ key: "q", label: "Câu hỏi" }, { key: "a", label: "Trả lời", type: "textarea" }]}
              addLabel="Thêm câu hỏi"
            />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Nguồn tham khảo">
            <RowList
              items={(Array.isArray(data.sources) ? data.sources : []) as Record<string, unknown>[]}
              onChange={(v) => update({ sources: v })}
              fields={[{ key: "label", label: "Tên nguồn" }, { key: "url", label: "Link (nếu có)" }, { key: "noted_at", label: "Ngày ghi nhận", type: "date" }]}
              addLabel="Thêm nguồn"
            />
          </Field>
        </div>
      </Section>

      <CommonMeta data={data} update={update} />
    </div>
  );
}

export function ArticleForm({ data, update, body, setBody }: { data: Record<string, unknown>; update: Patch; body: string; setBody: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <Section title="Bài viết">
        <div className="md:col-span-2">
          <Field label="Tiêu đề"><Text value={str(data.title)} onChange={(e) => update({ title: e.target.value })} /></Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Tóm tắt"><TextArea rows={2} value={str(data.excerpt)} onChange={(e) => update({ excerpt: e.target.value })} /></Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Nội dung (Markdown)" hint="Xuống dòng = đoạn mới. **chữ** = in đậm. ## = tiêu đề nhỏ. - = gạch đầu dòng.">
            <TextArea rows={14} value={body} onChange={(e) => setBody(e.target.value)} />
          </Field>
        </div>
        <Field label="Dự án liên quan" hint="slug cách nhau bởi dấu phẩy">
          <TagsInput value={strArr(data.projects)} onChange={(v) => update({ projects: v })} />
        </Field>
        <Field label="Số phút đọc">
          <input
            type="number"
            min={1}
            value={num(data.reading_minutes, 3)}
            onChange={(e) => update({ reading_minutes: Number(e.target.value) || 3 })}
            className="w-full min-h-[44px] rounded-xl border border-soft bg-page px-3 text-base text-primary focus:outline-none"
          />
        </Field>
      </Section>
      <CommonMeta data={data} update={update} />
    </div>
  );
}

interface CmpRow { criterion: string; options: string[] }
interface CmpVerdict { persona: string; text: string }

export function ComparisonForm({ data, update }: { data: Record<string, unknown>; update: Patch }) {
  const cmp = (data.comparison && typeof data.comparison === "object" ? data.comparison : {}) as {
    criteria?: string[]; rows?: CmpRow[]; verdicts?: CmpVerdict[];
  };
  const setCmp = (patch: Partial<typeof cmp>) => update({ comparison: { criteria: [], rows: [], verdicts: [], ...cmp, ...patch } });
  const rows = Array.isArray(cmp.rows) ? cmp.rows : [];
  return (
    <div className="flex flex-col gap-4">
      <Section title="Bài so sánh">
        <div className="md:col-span-2">
          <Field label="Tiêu đề"><Text value={str(data.title)} onChange={(e) => update({ title: e.target.value })} /></Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Tóm tắt"><TextArea rows={2} value={str(data.excerpt)} onChange={(e) => update({ excerpt: e.target.value })} /></Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Dự án đem so (slug, cách nhau bởi dấu phẩy — thứ tự này dùng cho bảng)">
            <TagsInput value={strArr(data.projects)} onChange={(v) => update({ projects: v })} />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Tiêu chí (mỗi dòng 1 tiêu chí)">
            <Lines value={strArr(cmp.criteria)} onChange={(v) => setCmp({ criteria: v })} />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Từng hàng so sánh" hint="Ô nhận xét: các ý cách nhau bởi dấu | theo đúng thứ tự dự án ở trên.">
            <div className="flex flex-col gap-3">
              {rows.map((r, i) => (
                <div key={i} className="rounded-xl border border-soft bg-page p-3">
                  <input
                    type="text"
                    value={r.criterion || ""}
                    onChange={(e) => setCmp({ rows: rows.map((x, j) => (j === i ? { ...x, criterion: e.target.value } : x)) })}
                    placeholder="Tiêu chí (VD: Giá/m²)"
                    aria-label="Tiêu chí"
                    className="w-full min-h-[44px] rounded-xl border border-soft bg-clean px-3 text-base text-primary focus:outline-none mb-2"
                  />
                  <textarea
                    rows={2}
                    value={(r.options || []).join(" | ")}
                    onChange={(e) =>
                      setCmp({ rows: rows.map((x, j) => (j === i ? { ...x, options: e.target.value.split("|").map((s) => s.trim()) } : x)) })
                    }
                    placeholder="Nhận xét từng dự án, cách nhau bởi |"
                    aria-label="Nhận xét từng dự án"
                    className="w-full rounded-xl border border-soft bg-clean px-3 py-2 text-base text-primary focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setCmp({ rows: rows.filter((_, j) => j !== i) })}
                    className="type-small mt-1 min-h-[44px] font-medium text-risk"
                  >
                    Xóa hàng này
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setCmp({ rows: [...rows, { criterion: "", options: [] }] })}
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-dashed border-soft px-4 text-sm font-medium text-secondary"
              >
                + Thêm hàng so sánh
              </button>
            </div>
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Kết luận cho từng đối tượng">
            <RowList
              items={((Array.isArray(cmp.verdicts) ? cmp.verdicts : []) as unknown) as Record<string, unknown>[]}
              onChange={(v) => setCmp({ verdicts: v as unknown as CmpVerdict[] })}
              fields={[{ key: "persona", label: "Đối tượng (VD: Người mua để ở)" }, { key: "text", label: "Kết luận", type: "textarea" }]}
              addLabel="Thêm kết luận"
            />
          </Field>
        </div>
      </Section>
      <CommonMeta data={data} update={update} />
    </div>
  );
}

export function CampaignForm({ data, update, body, setBody }: { data: Record<string, unknown>; update: Patch; body: string; setBody: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <Section title="Chiến dịch">
        <div className="md:col-span-2">
          <Field label="Tiêu đề lớn"><Text value={str(data.headline)} onChange={(e) => update({ headline: e.target.value })} /></Field>
        </div>
        <Field label="Ưu đãi"><Text value={str(data.offer)} onChange={(e) => update({ offer: e.target.value })} /></Field>
        <Field label="Kiểu form">
          <Select
            value={str(data.form_variant, "short")}
            options={[{ value: "short", label: "Ngắn" }, { value: "full", label: "Đầy đủ" }]}
            onChange={(v) => update({ form_variant: v })}
          />
        </Field>
        <div className="md:col-span-2">
          <Field label="Tóm tắt"><TextArea rows={2} value={str(data.excerpt)} onChange={(e) => update({ excerpt: e.target.value })} /></Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Nội dung (Markdown)">
            <TextArea rows={10} value={body} onChange={(e) => setBody(e.target.value)} />
          </Field>
        </div>
      </Section>
      <CommonMeta data={data} update={update} />
    </div>
  );
}

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function defaultsFor(kind: string): Record<string, unknown> {
  const t = today();
  const base = { tags: [], noindex: true, author: "ngoan-dang", published_at: t, updated_at: t, sources: [] };
  if (kind === "projects")
    return { ...base, name: "", segment: "de-o", status: "sap-mo-ban", tier: "C", location_label: "", cover: "", featured: false };
  if (kind === "comparison")
    return { ...base, type: "comparison", title: "", excerpt: "", projects: [], reading_minutes: 5, comparison: { criteria: [], rows: [], verdicts: [] } };
  if (kind === "campaigns")
    return { headline: "", excerpt: "", form_variant: "short", noindex: true, published_at: t, updated_at: t };
  return { ...base, type: kind, title: "", excerpt: "", projects: [], reading_minutes: 3, featured: false };
}
