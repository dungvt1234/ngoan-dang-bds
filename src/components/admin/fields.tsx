"use client";

// Khối field dùng chung cho form admin — tiếng Việt, target ≥44px.
export function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

export function strArr(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

export function num(v: unknown, fb = 0): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fb;
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="type-small block mb-1.5 font-medium text-primary">{label}</span>
      {children}
      {hint && <span className="type-caption block mt-1 text-muted">{hint}</span>}
    </label>
  );
}

const inputCls =
  "w-full min-h-[44px] rounded-xl border border-soft bg-page px-3 text-base text-primary placeholder:text-muted focus:outline-none";

export function Text(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type="text" {...props} className={inputCls} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={4} {...props} className={`${inputCls} py-2.5`} />;
}

export function DateInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type="date" {...props} className={inputCls} />;
}

export function Select({
  value,
  options,
  onChange,
  allowEmpty,
  emptyLabel,
}: {
  value: string;
  options: readonly { value: string; label: string }[];
  onChange: (v: string) => void;
  allowEmpty?: boolean;
  emptyLabel?: string;
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
      {allowEmpty && <option value="">{emptyLabel || "— Không —"}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Check({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex min-h-[44px] cursor-pointer items-center gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 accent-[#17202A]"
      />
      <span className="type-small font-medium text-primary">{label}</span>
    </label>
  );
}

/** Textarea mỗi dòng = 1 mục (tags nhiều dòng, ưu/nhược điểm...). */
export function Lines({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  return (
    <textarea
      rows={Math.max(2, Math.min(8, value.length + 1))}
      value={value.join("\n")}
      onChange={(e) => onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
      placeholder={placeholder}
      className={`${inputCls} py-2.5`}
    />
  );
}

/** Tags nhập cách nhau bởi dấu phẩy. */
export function TagsInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  return (
    <input
      type="text"
      value={value.join(", ")}
      onChange={(e) =>
        onChange(e.target.value.split(",").map((s) => s.trim().toLowerCase().replace(/\s+/g, "-")).filter(Boolean))
      }
      placeholder="vung-tau, gia, phap-ly"
      className={inputCls}
    />
  );
}

export interface RowField {
  key: string;
  label: string;
  type?: "text" | "textarea" | "date" | "check";
  placeholder?: string;
}

/** Danh sách dòng thêm/xóa được (FAQ, bảng giá, mốc tiến độ...). */
export function RowList({
  items,
  onChange,
  fields,
  addLabel,
}: {
  items: Record<string, unknown>[];
  onChange: (v: Record<string, unknown>[]) => void;
  fields: RowField[];
  addLabel: string;
}) {
  const set = (i: number, key: string, v: unknown) => {
    const next = items.map((r, j) => (j === i ? { ...r, [key]: v } : r));
    onChange(next);
  };
  return (
    <div className="flex flex-col gap-3">
      {items.map((row, i) => (
        <div key={i} className="rounded-xl border border-soft bg-page p-3">
          <div className="grid grid-cols-1 gap-2">
            {fields.map((f) =>
              f.type === "check" ? (
                <label key={f.key} className="flex min-h-[44px] items-center gap-2">
                  <input
                    type="checkbox"
                    checked={row[f.key] === true}
                    onChange={(e) => set(i, f.key, e.target.checked)}
                    className="h-5 w-5 accent-[#17202A]"
                  />
                  <span className="type-small text-secondary">{f.label}</span>
                </label>
              ) : f.type === "textarea" ? (
                <textarea
                  key={f.key}
                  rows={2}
                  value={str(row[f.key])}
                  onChange={(e) => set(i, f.key, e.target.value)}
                  placeholder={f.placeholder || f.label}
                  aria-label={f.label}
                  className={`${inputCls} py-2`}
                />
              ) : (
                <input
                  key={f.key}
                  type={f.type === "date" ? "date" : "text"}
                  value={str(row[f.key])}
                  onChange={(e) => set(i, f.key, e.target.value)}
                  placeholder={f.placeholder || f.label}
                  aria-label={f.label}
                  className={inputCls}
                />
              )
            )}
          </div>
          <button
            type="button"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="type-small mt-2 min-h-[44px] font-medium text-risk"
          >
            Xóa dòng này
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, Object.fromEntries(fields.map((f) => [f.key, f.type === "check" ? false : ""]))])}
        className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-dashed border-soft px-4 text-sm font-medium text-secondary"
      >
        + {addLabel}
      </button>
    </div>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-soft bg-clean p-4 md:p-5">
      <h3 className="type-small mb-3 font-semibold uppercase tracking-[0.08em] text-secondary">{title}</h3>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {children}
      </div>
    </section>
  );
}
