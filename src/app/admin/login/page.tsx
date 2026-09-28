"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  return <LoginForm />;
}

function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || "Đăng nhập thất bại");
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại");
    }
    setBusy(false);
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[420px] flex-col justify-center px-5">
      <p className="type-kicker text-secondary mb-2">Quản trị nội dung</p>
      <h1 className="font-display text-3xl font-semibold text-primary mb-6">Đăng nhập</h1>
      <form onSubmit={submit} className="rounded-2xl border border-soft bg-clean p-6">
        <label className="block">
          <span className="type-small mb-2 block font-medium text-primary">Mật khẩu quản trị</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full min-h-[52px] rounded-xl border border-soft bg-page px-4 text-base text-primary focus:outline-none"
          />
        </label>
        {error && (
          <p role="alert" className="type-small mt-3 font-medium text-risk">{error}</p>
        )}
        <button
          type="submit"
          disabled={busy || !password}
          className="mt-4 inline-flex min-h-[52px] w-full items-center justify-center rounded-xl bg-ink font-medium text-ondark disabled:opacity-50"
        >
          {busy ? "Đang vào..." : "Vào trang quản trị"}
        </button>
      </form>
    </div>
  );
}
