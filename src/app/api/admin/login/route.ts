import { NextResponse } from "next/server";
import { createSession, passwordOk, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/admin-auth";

export async function POST(req: Request) {
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  if (!passwordOk(password || "")) {
    return NextResponse.json({ error: "Mật khẩu chưa đúng" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, createSession(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
