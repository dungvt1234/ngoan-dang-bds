import { NextResponse, type NextRequest } from "next/server";

// Bảo vệ /admin và /api/admin bằng cookie phiên (xem src/lib/admin-auth.ts).
// Middleware chạy Edge runtime nên verify bằng Web Crypto (SHA-256 hex của
// `${ADMIN_PASSWORD}.${expHex}` — cùng công thức với phía Node).
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }
  const ok = await verifyTicket(req.cookies.get("admin_session")?.value);
  if (ok) return NextResponse.next();
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  return NextResponse.redirect(url);
}

async function verifyTicket(ticket: string | undefined): Promise<boolean> {
  const secret = process.env.ADMIN_PASSWORD || "";
  if (!ticket || !secret) return false;
  const [exp, sig] = ticket.split(".");
  if (!exp || !sig) return false;
  const expMs = parseInt(exp, 16);
  if (!Number.isFinite(expMs) || expMs < Date.now()) return false;
  const data = new TextEncoder().encode(`${secret}.${exp}`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  const expect = [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return sig.length === expect.length && sig === expect;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
