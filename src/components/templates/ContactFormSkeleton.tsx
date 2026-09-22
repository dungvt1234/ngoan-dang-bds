"use client";

import { Button } from "@/components/ui/Button";

// Form placeholder — KHÔNG handler/webhook. preventDefault để tránh reload
// khi bấm thử. Wiring thật ở phase sau. Tách client riêng để template
// server không chứa event handler.
export function ContactFormSkeleton() {
  return (
    <form
      className="bg-clean border border-soft rounded-2xl p-6 md:p-8"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="space-y-4 mb-6">
        <label className="block">
          <span className="type-small text-secondary block mb-2">Họ tên</span>
          <input
            type="text"
            name="name"
            placeholder="Tên của bạn"
            className="w-full min-h-[48px] bg-page border border-soft rounded-xl px-4 type-small focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="type-small text-secondary block mb-2">Số điện thoại</span>
          <input
            type="tel"
            name="phone"
            placeholder="SĐT liên hệ"
            className="w-full min-h-[48px] bg-page border border-soft rounded-xl px-4 type-small focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="type-small text-secondary block mb-2">Nhu cầu</span>
          <input
            type="text"
            name="need"
            placeholder="VD: tìm căn hộ để ở tại Vũng Tàu"
            className="w-full min-h-[48px] bg-page border border-soft rounded-xl px-4 type-small focus:outline-none"
          />
        </label>
      </div>
      <Button type="submit" className="w-full">
        Gửi (chưa hoạt động — phase sau)
      </Button>
    </form>
  );
}
