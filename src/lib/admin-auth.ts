import { createHash, timingSafeEqual } from "node:crypto";

const COOKIE = "admin_session";
const SESSION_DAYS = 7;

function secret(): string {
  return process.env.ADMIN_PASSWORD || "";
}

export function passwordOk(input: string): boolean {
  const s = secret();
  if (!s || !input) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(s);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function sig(exp: string): string {
  return createHash("sha256").update(`${secret()}.${exp}`).digest("hex");
}

/** Tạo ticket `expHex.sigHex`, hết hạn sau SESSION_DAYS. */
export function createSession(): string {
  if (!secret()) throw new Error("ADMIN_PASSWORD chưa cấu hình");
  const exp = (Date.now() + SESSION_DAYS * 86400_000).toString(16);
  return `${exp}.${sig(exp)}`;
}

export function verifySessionTicket(ticket: string | undefined): boolean {
  if (!ticket || !secret()) return false;
  const [exp, s] = ticket.split(".");
  if (!exp || !s) return false;
  const expMs = parseInt(exp, 16);
  if (!Number.isFinite(expMs) || expMs < Date.now()) return false;
  const expect = sig(exp);
  const a = Buffer.from(s);
  const b = Buffer.from(expect);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export const SESSION_COOKIE = COOKIE;
export const SESSION_MAX_AGE = SESSION_DAYS * 86400;
