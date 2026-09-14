/**
 * app/api/admin/activation-reminders/route.ts
 *
 * Знайдено автономним аудитом 2026-09-15 (мандат "ціль прибуток"): 75%
 * зареєстрованих користувачів (63 з 84 на момент знахідки) жодного разу
 * не скористались своїми 2 безкоштовними кредитами. GET — прев'ю списку
 * (хто отримає лист), НІЧОГО не надсилає. Реальна відправка — окремий
 * POST на .../send, і тільки після ручного перегляду тексту в
 * /admin/activation.
 *
 * Критерії: signup 24-72 год тому (досить часу спробувати, не занадто
 * старий сигнал), total_generations = 0 (жодного разу не активувались),
 * activation_reminder_sent_at IS NULL (ще не слали).
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

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "Необхідна авторизація" }, { status: 401 });

  const { data: userData } = await supabaseAuth.auth.getUser(token);
  if (!userData?.user || !isAdminEmail(userData.user.email)) {
    return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
  }

  const now = Date.now();
  const from = new Date(now - 72 * 60 * 60 * 1000).toISOString();
  const to = new Date(now - 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id, email, full_name, created_at, credits, total_generations")
    .eq("total_generations", 0)
    .is("activation_reminder_sent_at", null)
    .gte("created_at", from)
    .lte("created_at", to)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ candidates: data ?? [], count: data?.length ?? 0 });
}
