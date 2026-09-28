import { NextResponse } from "next/server";

/** POST /api/admin/publish → gọi Vercel Deploy Hook để build lại web (1–2 phút). */
export async function POST() {
  const hook = process.env.VERCEL_DEPLOY_HOOK_URL || "";
  if (!hook) {
    return NextResponse.json(
      { error: "Chưa cấu hình VERCEL_DEPLOY_HOOK_URL — xem hướng dẫn trong .env.example" },
      { status: 500 }
    );
  }
  try {
    const res = await fetch(hook, { method: "POST" });
    if (!res.ok) throw new Error(`Deploy hook trả về ${res.status}`);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Gọi deploy thất bại" }, { status: 500 });
  }
}
