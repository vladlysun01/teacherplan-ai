/**
 * app/api/admin/activation-reminders/send/route.ts
 *
 * Реальна відправка нагадувань "маєш 2 безкоштовних кредити" — тільки
 * обраним ID (з прев'ю GET .../activation-reminders), тільки вручну з
 * /admin/activation. Позначає activation_reminder_sent_at одразу після
 * успішної відправки, щоб не надіслати вдруге.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAdminEmail } from "@/lib/admin";

const supabaseAuth = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL = process.env.OUTREACH_FROM_EMAIL ?? "onboarding@resend.dev";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.teacher-plan-ai.site";

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  });
  if (!res.ok) throw new Error((await res.text()) || `Resend помилка ${res.status}`);
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "Необхідна авторизація" }, { status: 401 });

  const { data: userData } = await supabaseAuth.auth.getUser(token);
  if (!userData?.user || !isAdminEmail(userData.user.email)) {
    return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
  }

  const { userIds, subject, bodyHtml } = await request.json();
  if (!Array.isArray(userIds) || userIds.length === 0) {
    return NextResponse.json({ error: "Не обрано жодного користувача" }, { status: 400 });
  }
  if (!subject || !bodyHtml) {
    return NextResponse.json({ error: "Тема й текст листа обов'язкові" }, { status: 400 });
  }

  const { data: users, error } = await supabaseAdmin
    .from("profiles")
    .select("id, email, full_name, credits")
    .in("id", userIds);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let sentCount = 0;
  const failures: { email: string; error: string }[] = [];

  for (const u of users ?? []) {
    const name = u.full_name?.split(" ")[0] || "колего";
    const html = bodyHtml
      .replace(/\{\{first_name\}\}/g, name)
      .replace(/\{\{credits\}\}/g, String(u.credits))
      .replace(/\{\{site_url\}\}/g, SITE_URL);
    try {
      await sendEmail(u.email, subject, html);
      await supabaseAdmin.from("profiles").update({ activation_reminder_sent_at: new Date().toISOString() }).eq("id", u.id);
      sentCount++;
    } catch (err: any) {
      failures.push({ email: u.email, error: err.message });
    }
    await new Promise((r) => setTimeout(r, 150));
  }

  return NextResponse.json({ sentCount, failedCount: failures.length, failures });
}
