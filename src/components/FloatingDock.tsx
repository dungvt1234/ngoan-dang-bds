"use client";

import { useEffect, useState } from "react";
import { contactChannels } from "@/lib/contact";
import { ChatPanel } from "./ChatPanel";

// Dock nổi góc phải dưới: Zalo / Messenger / TikTok / Chat.
// Icon SVG vẽ tay gọn nhẹ (không cài lib icon). Kênh chưa có link thật →
// nút disabled "sắp có". Nút chính pulse thu hút đến khi mở lần đầu.
function ZaloIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.02 2 11c0 2.65 1.16 5.05 3.05 6.72L4 22l4.5-1.2c1.1.3 2.27.47 3.5.47 5.52 0 10-4.02 10-9S17.52 2 12 2zm-1.2 12.5l-2.6-2.6 1-1 1.6 1.6 3.8-3.8 1 1-4.8 4.8z" />
    </svg>
  );
}

function MessengerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.14.25.35.25.57l-.05 1.78c-.02.5.52.82.95.57l2.1-1.23c.17-.1.38-.12.57-.06 1.06.3 2.2.47 3.04.47 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm1.1 13.1l-2.6-2.77-5.07 2.77L11 9.6l2.6 2.77 4.93-2.77-5.43 5.5z" />
    </svg>
  );
}

function TiktokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden="true">
      <path d="M16.6 3c.4 2.2 1.9 3.6 4.2 3.8v3c-1.6 0-3-.5-4.2-1.4v6.3c0 3.5-2.6 6.1-6 6.1-3.3 0-6-2.7-6-6s2.7-6 6-6c.3 0 .7 0 1 .1v3.1c-.3-.1-.7-.2-1-.2-1.7 0-3 1.3-3 3s1.3 3 3 3c1.8 0 3-1.4 3-3.1V3h2z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M21 12a8 8 0 01-8 8H4l2.3-2.9A8 8 0 1121 12z" strokeLinejoin="round" />
      <circle cx="9" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="13" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="17" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

function ChannelButton({
  label,
  href,
  bg,
  icon,
}: {
  label: string;
  href: string;
  bg: string;
  icon: React.ReactNode;
}) {
  const ready = href.length > 0;
  const cls = `flex items-center gap-3 w-full min-h-[52px] px-3 rounded-xl text-sm font-medium transition-all hover:-translate-y-px hover:shadow-md ${bg}`;
  const inner = (
    <>
      <span className="w-9 h-9 shrink-0 grid place-items-center rounded-full bg-white/20">
        {icon}
      </span>
      <span>{label}</span>
      {!ready && (
        <span className="ml-auto text-[11px] uppercase tracking-wider opacity-70">sắp có</span>
      )}
    </>
  );
  if (!ready) {
    return (
      <button type="button" disabled aria-disabled="true" title={`${label} — đang cập nhật`} className={`${cls} opacity-60 cursor-not-allowed`}>
        {inner}
      </button>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  );
}

export function FloatingDock() {
  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState(false);
  const [seen, setSeen] = useState(false);
  const active = open || chat;

  // Tự mở chat chào khách 1 lần/phiên sau 6s (không hiện lại khi đã chào
  // hoặc user đã tự mở). Reduced-motion: vẫn mở (nội dung, không animation).
  useEffect(() => {
    let timer: number | undefined;
    try {
      if (!sessionStorage.getItem("dock-greeted")) {
        timer = window.setTimeout(() => {
          setChat(true);
          setSeen(true);
          sessionStorage.setItem("dock-greeted", "1");
        }, 6000);
      } else {
        setSeen(true);
      }
    } catch {
      // sessionStorage bị chặn: chào luôn sau 6s, không nhớ phiên.
      timer = window.setTimeout(() => {
        setChat(true);
        setSeen(true);
      }, 6000);
    }
    return () => window.clearTimeout(timer);
  }, []);

  const toggle = () => {
    if (chat) setChat(false);
    else {
      setOpen(!open);
      setSeen(true);
      try {
        sessionStorage.setItem("dock-greeted", "1");
      } catch {
        // bỏ qua khi storage bị chặn
      }
    }
  };

  return (
    <div className="fixed right-5 z-[90] flex flex-col items-end gap-3 bottom-[max(1.25rem,env(safe-area-inset-bottom))]">
      {chat && <ChatPanel onClose={() => setChat(false)} />}

      {open && !chat && (
        <div className="w-[248px] rounded-2xl border border-soft bg-clean/95 backdrop-blur-md shadow-2xl p-2 space-y-1">
          <p className="type-caption text-muted px-3 pt-2 pb-1">Liên hệ Ngoan Đặng</p>
          <ChannelButton label="Zalo" href={contactChannels.zalo} bg="bg-[#0068FF] text-white" icon={<ZaloIcon />} />
          <ChannelButton label="Messenger" href={contactChannels.messenger} bg="bg-[#0084FF] text-white" icon={<MessengerIcon />} />
          <ChannelButton label="TikTok" href={contactChannels.tiktok} bg="bg-ink text-ondark" icon={<TiktokIcon />} />
          <button
            type="button"
            onClick={() => setChat(true)}
            className="flex items-center gap-3 w-full min-h-[52px] px-3 rounded-xl text-sm font-medium bg-accent text-ink hover:bg-accent-hover transition-all hover:-translate-y-px hover:shadow-md"
          >
            <span className="w-9 h-9 shrink-0 grid place-items-center rounded-full bg-ink/10">
              <ChatIcon />
            </span>
            <span>Trợ lý chat</span>
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={toggle}
        aria-expanded={active}
        aria-label={active ? "Đóng liên hệ" : "Mở liên hệ — Zalo, Messenger, TikTok, chat"}
        className={`relative isolate w-14 h-14 rounded-full bg-accent text-ink shadow-xl hover:bg-accent-hover transition-colors grid place-items-center ${!seen && !active ? "dock-ping" : ""}`}
      >
        <span className="relative z-10">{active ? <CloseIcon /> : <ChatIcon />}</span>
      </button>
    </div>
  );
}
