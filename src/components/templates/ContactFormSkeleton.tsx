"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

// Form liên hệ V1 (thật, không backend): validate → mở Zalo Ngoan với
// tin nhắn điền sẵn (tên + SĐT + nhu cầu). Khách bấm Gửi trong Zalo là xong.
// Không claim "đã lưu hệ thống" — delivery = Zalo thật tới máy Ngoan.
const ZALO_NUMBER = "0906477923";

function isValidVNPhone(v: string): boolean {
  const digits = v.replace(/[\s.]/g, "");
  return /^(0|\+84)(3|5|7|8|9)\d{8}$/.test(digits);
}

const NEEDS = ["Mua để ở", "Đầu tư", "Nghỉ dưỡng", "Cho thuê", "Tìm hiểu trước"];

export function ContactFormSkeleton() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [need, setNeed] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (name.trim().length < 2) {
      setError("Vui lòng nhập họ tên.");
      return;
    }
    if (!isValidVNPhone(phone)) {
      setError("Số điện thoại chưa đúng (10 số, đầu 03/05/07/08/09).");
      return;
    }
    const text = `Chào Ngoan Đặng, tôi là ${name.trim()} (SĐT ${phone.trim()}). Nhu cầu: ${
      need.trim() || "tư vấn BĐS Vũng Tàu"
    }`;
    window.open(
      `https://zalo.me/${ZALO_NUMBER}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener"
    );
    setSent(true);
  };

  if (sent) {
    return (
      <div className="bg-clean border border-soft rounded-2xl p-6 md:p-8 text-center">
        <p className="type-h3 mb-3">Đã mở Zalo với tin nhắn soạn sẵn</p>
        <p className="type-small text-secondary mb-6">
          Bạn bấm Gửi trong Zalo để Ngoan nhận được. Ngoan phản hồi trong 24 giờ.
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setName("");
            setPhone("");
            setNeed("");
          }}
          className="type-small font-medium text-primary underline decoration-accent decoration-2 underline-offset-8"
        >
          Gửi thêm nhu cầu khác
        </button>
      </div>
    );
  }

  return (
    <form
      className="bg-clean border border-soft rounded-2xl p-6 md:p-8"
      onSubmit={submit}
      noValidate
    >
      <h2 className="type-h3 text-primary mb-5">Để lại thông tin — 30 giây</h2>
      <div className="space-y-4 mb-6">
        <label className="block">
          <span className="type-small text-secondary block mb-2">Họ tên *</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên của bạn"
            autoComplete="name"
            className="w-full min-h-[48px] bg-page border border-soft rounded-xl px-4 text-base text-primary placeholder:text-muted focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="type-small text-secondary block mb-2">Số điện thoại *</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="VD: 0901234567"
            autoComplete="tel"
            className="w-full min-h-[48px] bg-page border border-soft rounded-xl px-4 text-base text-primary placeholder:text-muted focus:outline-none"
          />
        </label>
        <div>
          <span id="need-label" className="type-small text-secondary block mb-2">
            Nhu cầu của bạn
          </span>
          <div role="group" aria-labelledby="need-label" className="flex flex-wrap gap-2 mb-3">
            {NEEDS.map((n) => {
              const active = need === n;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setNeed(n)}
                  aria-pressed={active}
                  className={`min-h-[44px] rounded-full border px-4 text-sm font-medium transition-colors ${
                    active
                      ? "border-ink bg-ink text-ondark"
                      : "border-soft bg-page text-secondary hover:border-primary"
                  }`}
                >
                  {n}
                </button>
              );
            })}
          </div>
          <input
            type="text"
            value={need}
            onChange={(e) => setNeed(e.target.value)}
            placeholder="Chi tiết thêm (VD: căn 2PN tầm 3 tỷ)"
            aria-label="Chi tiết nhu cầu"
            className="w-full min-h-[48px] bg-page border border-soft rounded-xl px-4 text-base text-primary placeholder:text-muted focus:outline-none"
          />
        </div>
      </div>
      {error && (
        <p role="alert" className="type-small font-medium text-risk mb-4">
          {error}
        </p>
      )}
      <Button type="submit" className="w-full">
        Gửi qua Zalo cho Ngoan
      </Button>
      <p className="type-caption text-muted text-center mt-4">
        Mở Zalo với tin nhắn soạn sẵn — không lưu gì trên web.
      </p>
    </form>
  );
}
