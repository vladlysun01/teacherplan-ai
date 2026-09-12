/**
 * app/api/admin/schools-outreach/send/route.ts
 *
 * Ручна відправка пропозиції TeacherPlan AI обраній пачці шкіл через
 * Resend. Дані школи (buyers) і журнал відправок (school_outreach_log)
 * читаються/пишуться напряму в базу tender-intel (окремий Supabase-проєкт,
 * дані там і лишаються).
 *
 * Свідомо БЕЗ автоматичного/масового режиму без огляду — адмін щоразу
 * сам бачить список і сам тисне "Відправити".
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAdminEmail } from "@/lib/admin";

const supabaseAuth = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const tenderIntelDb = createClient(
  process.env.TENDER_INTEL_SUPABASE_URL!,
  process.env.TENDER_INTEL_SUPABASE_SERVICE_ROLE_KEY!
);

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL = process.env.OUTREACH_FROM_EMAIL ?? "onboarding@resend.dev";

function fillTemplate(text: string, vars: Record<string, string>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? "");
}

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Resend помилка ${res.status}`);
  }
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "Необхідна авторизація" }, { status: 401 });

  const { data: userData } = await supabaseAuth.auth.getUser(token);
  if (!userData?.user || !isAdminEmail(userData.user.email)) {
    return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
  }

  const { buyerIds, subject, bodyHtml } = await request.json();
  if (!Array.isArray(buyerIds) || buyerIds.length === 0) {
    return NextResponse.json({ error: "Не обрано жодної школи" }, { status: 400 });
  }
  if (!subject || !bodyHtml) {
    return NextResponse.json({ error: "Тема й текст листа обов'язкові" }, { status: 400 });
  }
  if (buyerIds.length > 250) {
    return NextResponse.json({ error: "За раз можна не більше 250 — розбий на кілька пачок" }, { status: 400 });
  }

  const { data: schools, error } = await tenderIntelDb
    .from("buyers")
    .select("id, name, contact_name, contact_email")
    .in("id", buyerIds);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const results: { buyerId: string; email: string; status: "sent" | "failed"; error?: string }[] = [];

  for (const school of schools ?? []) {
    if (!school.contact_email) {
      results.push({ buyerId: school.id, email: "", status: "failed", error: "Немає email" });
      continue;
    }
    const vars = { contact_name: school.contact_name ?? "Пані/Пане", school_name: school.name };
    try {
      await sendEmail(school.contact_email, fillTemplate(subject, vars), fillTemplate(bodyHtml, vars));
      results.push({ buyerId: school.id, email: school.contact_email, status: "sent" });
    } catch (err: any) {
      results.push({ buyerId: school.id, email: school.contact_email, status: "failed", error: err.message });
    }
    await new Promise((r) => setTimeout(r, 150));
  }

  await tenderIntelDb.from("school_outreach_log").insert(
    results.map((r) => ({ buyer_id: r.buyerId, email: r.email, status: r.status, error: r.error ?? null }))
  );

  const sentCount = results.filter((r) => r.status === "sent").length;
  return NextResponse.json({ sentCount, failedCount: results.length - sentCount, results });
}
