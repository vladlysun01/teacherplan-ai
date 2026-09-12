/**
 * app/api/admin/schools-outreach/route.ts
 *
 * Список шкіл для холодного аутріча пропозиції TeacherPlan AI —
 * ПЕРЕНЕСЕНО з tender-intel (2026-09-12): школи логічно належать тут
 * (продукт продається саме тут), але самі дані (buyers, school_outreach_log)
 * фізично лишаються в базі tender-intel — окремий Supabase-проєкт,
 * джерело даних Prozorro. Звертаємось туди напряму сервісним ключем.
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

const PAGE_SIZE = 50;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "Необхідна авторизація" }, { status: 401 });

  const { data: userData } = await supabaseAuth.auth.getUser(token);
  if (!userData?.user || !isAdminEmail(userData.user.email)) {
    return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
  }

  const { searchParams } = request.nextUrl;
  const region = searchParams.get("region");
  const search = searchParams.get("search");
  const onlyNotSent = searchParams.get("onlyNotSent") === "true";
  const page = parseInt(searchParams.get("page") ?? "0", 10);

  let query = tenderIntelDb
    .from("buyers")
    .select("id, name, region, locality, street_address, contact_name, contact_email, contact_phone", {
      count: "exact",
    })
    .eq("buyer_type", "школа")
    .not("contact_email", "is", null);

  if (region) query = query.eq("region", region);
  if (search) query = query.ilike("name", `%${search}%`);

  query = query.order("name").range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

  const { data: schools, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const ids = (schools ?? []).map((s) => s.id);
  let sentSet = new Set<string>();
  if (ids.length > 0) {
    const { data: sent } = await tenderIntelDb
      .from("school_outreach_log")
      .select("buyer_id")
      .in("buyer_id", ids)
      .eq("status", "sent");
    sentSet = new Set((sent ?? []).map((s) => s.buyer_id));
  }

  let result = (schools ?? []).map((s) => ({ ...s, alreadySent: sentSet.has(s.id) }));
  if (onlyNotSent) result = result.filter((s) => !s.alreadySent);

  const { data: regionsRaw } = await tenderIntelDb
    .from("buyers")
    .select("region")
    .eq("buyer_type", "школа")
    .not("region", "is", null)
    .not("contact_email", "is", null);
  const regions = Array.from(new Set((regionsRaw ?? []).map((r) => r.region))).sort();

  return NextResponse.json({
    schools: result,
    total: count ?? 0,
    page,
    pageSize: PAGE_SIZE,
    regions,
  });
}
