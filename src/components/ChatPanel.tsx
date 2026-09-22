"use client";

import { useState } from "react";
import Link from "next/link";
import { contactChannels } from "@/lib/contact";

// Trợ lý demo chạy 100% client (không backend/AI): khớp từ khóa → câu trả lời
// có sẵn + link nội bộ. Không bịa thông tin dự án/giá.
const RULES: { keys: string[]; reply: string; link?: { label: string; href: string } }[] = [
  {
    keys: ["dự án", "du an", "mua", "căn hộ", "can ho"],
    reply: "Bạn có thể xem các dự án Ngoan đang theo dõi tại trang Dự án.",
    link: { label: "Xem dự án", href: "/du-an" },
  },
  {
    keys: ["giá", "gia", "bao nhiêu", "tiền"],
    reply: "Giá từng dự án nằm trong trang chi tiết, kèm bảng giá và phân tích. Bạn mở dự án cần xem nhé.",
    link: { label: "Xem dự án", href: "/du-an" },
  },
  {
    keys: ["pháp lý", "phap ly", "sổ", "so hong"],
    reply: "Mỗi dự án có mục Pháp lý riêng với trạng thái kiểm chứng. Bạn xem bài kiến thức pháp lý trước cũng được.",
    link: { label: "Đọc kiến thức", href: "/kien-thuc" },
  },
  {
    keys: ["liên hệ", "lien he", "tư vấn", "tu van", "gặp", "gap", "zalo", "phone", "sđt", "sdt"],
    reply: "Để lại thông tin tại trang Liên hệ, Ngoan phản hồi trong 24 giờ.",
    link: { label: "Tới trang liên hệ", href: "/lien-he" },
  },
  {
    keys: ["chào", "chao", "hi", "hello", "xin chào"],
    reply: "Chào bạn! Tôi có thể chỉ đường tới trang dự án, kiến thức hoặc liên hệ. Bạn cần gì?",
  },
];

const FALLBACK =
  "Tôi chưa hiểu ý này (bản demo). Bạn thử hỏi về: dự án, giá, pháp lý, liên hệ — hoặc vào trang Liên hệ để gặp trực tiếp Ngoan.";

function answer(input: string): { text: string; link?: { label: string; href: string } } {
  const t = input.toLowerCase();
  for (const r of RULES) {
    if (r.keys.some((k) => t.includes(k))) return { text: r.reply, link: r.link };
  }
  return { text: FALLBACK, link: { label: "Tới trang liên hệ", href: "/lien-he" } };
}

export function ChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<
    { from: "bot" | "user"; text: string; link?: { label: string; href: string } }[]
  >([{ from: "bot", text: "Chào bạn, tôi là trợ lý của Ngoan Đặng (bản demo). Bạn cần tìm gì?" }]);
  const [value, setValue] = useState("");

  const send = () => {
    const text = value.trim();
    if (!text) return;
    const a = answer(text);
    setMessages((m) => [...m, { from: "user", text }, { from: "bot", text: a.text, link: a.link }]);
    setValue("");
  };

  return (
    <div className="w-[320px] max-w-[calc(100vw-3rem)] rounded-2xl border border-soft bg-clean shadow-xl overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-ink text-ondark">
        <p className="font-medium text-sm">Trợ lý Ngoan Đặng <span className="text-ondark/50 text-xs">(demo)</span></p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng chat"
          className="w-9 h-9 grid place-items-center rounded-full hover:bg-white/10 transition-colors"
        >
          ✕
        </button>
      </div>
      <div className="h-64 overflow-y-auto p-4 space-y-3 bg-page" aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-xl px-3 py-2 type-small ${
                m.from === "user" ? "bg-accent text-ink" : "bg-clean border border-soft text-primary"
              }`}
            >
              <p>{m.text}</p>
              {m.link && (
                <Link
                  href={m.link.href}
                  className="block mt-1 font-medium underline decoration-accent decoration-2 underline-offset-4"
                >
                  {m.link.label} →
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 p-3 border-t border-soft bg-clean">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Nhập câu hỏi..."
          aria-label="Nhập câu hỏi cho trợ lý"
          className="flex-1 min-h-[44px] rounded-xl border border-soft bg-page px-3 type-small focus:outline-none"
        />
        <button
          type="button"
          onClick={send}
          className="min-w-[44px] min-h-[44px] rounded-xl bg-accent text-ink font-medium px-4 hover:bg-accent-hover transition-colors"
        >
          Gửi
        </button>
      </div>
    </div>
  );
}
