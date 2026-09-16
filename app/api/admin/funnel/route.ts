/**
 * app/api/admin/funnel/route.ts
 *
 * Агрегація funnel_events для /admin/funnel — скільки унікальних
 * користувачів дійшло до кожного кроку (dashboard_view → generate_click
 * → generate_success), за останні N днів. Рахуємо DISTINCT user_id, а не
 * рядки — один і той самий вчитель може відкрити дашборд і натиснути
 * кнопку кілька разів, нас цікавить "скільки людей", не "скільки подій".
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

const STEPS = ["dashboard_view", "generate_click", "generate_success", "generate_error"];

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "Необхідна авторизація" }, { status: 401 });

  const { data: userData } = await supabaseAuth.auth.getUser(token);
  if (!userData?.user || !isAdminEmail(userData.user.email)) {
    return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
  }

  const days = parseInt(request.nextUrl.searchParams.get("days") ?? "14", 10);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const { data: events, error } = await supabaseAdmin
    .from("funnel_events")
    .select("event, user_id, meta, created_at")
    .gte("created_at", since)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const uniqueByStep: Record<string, Set<string>> = {};
  for (const step of STEPS) uniqueByStep[step] = new Set();
  let anonymousCounts: Record<string, number> = {};

  for (const e of events ?? []) {
    if (!STEPS.includes(e.event)) continue;
    if (e.user_id) uniqueByStep[e.event].add(e.user_id);
    else anonymousCounts[e.event] = (anonymousCounts[e.event] ?? 0) + 1;
  }

  const steps = STEPS.map((step) => ({
    event: step,
    uniqueUsers: uniqueByStep[step].size,
    anonymousEvents: anonymousCounts[step] ?? 0,
  }));

  // Помилки генерації — з текстом, щоб бачити, ЩО саме йде не так, коли
  // з'являться перші реальні (зараз, за фактом, їх нуль).
  const recentErrors = (events ?? [])
    .filter((e) => e.event === "generate_error")
    .slice(0, 20)
    .map((e) => ({ createdAt: e.created_at, message: (e.meta as any)?.message ?? null }));

  return NextResponse.json({ days, steps, recentErrors, totalEvents: events?.length ?? 0 });
}
