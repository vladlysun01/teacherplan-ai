import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAdminEmail, isTestEmail } from "@/lib/admin";

// TeacherPlan — той самий проєкт, що й решта адмінки.
const tpUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const tpAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const tpServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAuth = createClient(tpUrl, tpAnonKey);
const tpAdmin = createClient(tpUrl, tpServiceKey);

// TenderIntel — інший проєкт/база. Ключ отримано напряму від власника
// (не через будь-яку автоматизовану міжпроєктну передачу) і збережено
// лише як env var на сервері — ніколи не йде в відповідь клієнту.
const tiUrl = process.env.TENDERINTEL_SUPABASE_URL;
const tiServiceKey = process.env.TENDERINTEL_SUPABASE_SERVICE_ROLE_KEY;
const tiAdmin = tiUrl && tiServiceKey ? createClient(tiUrl, tiServiceKey) : null;

type UnifiedPayment = {
  project: "teacherplan" | "tenderintel";
  id: string;
  createdAt: string;
  userEmail: string | null;
  amountUAH: number;
  status: string;
  note: string | null;
};

function periodKey(dateStr: string, kind: "month" | "quarter"): string {
  const d = new Date(dateStr);
  const y = d.getUTCFullYear();
  if (kind === "month") return `${y}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
  const q = Math.floor(d.getUTCMonth() / 3) + 1;
  return `${y}-Q${q}`;
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) return NextResponse.json({ error: "Необхідна авторизація" }, { status: 401 });

    const { data: userData, error: userError } = await supabaseAuth.auth.getUser(token);
    if (userError || !userData?.user) return NextResponse.json({ error: "Недійсна сесія" }, { status: 401 });
    if (!isAdminEmail(userData.user.email)) return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });

    const payments: UnifiedPayment[] = [];

    // --- TeacherPlan ---
    const [tpProfilesRes, tpPaymentsRes] = await Promise.all([
      tpAdmin.from("profiles").select("id, email"),
      tpAdmin.from("payments").select("id, user_id, amount, status, created_at, package_id"),
    ]);
    if (tpProfilesRes.error) throw tpProfilesRes.error;
    if (tpPaymentsRes.error) throw tpPaymentsRes.error;

    const tpEmailById = new Map((tpProfilesRes.data || []).map((p) => [p.id, p.email] as const));
    for (const p of tpPaymentsRes.data || []) {
      const email = tpEmailById.get(p.user_id) || null;
      if (isTestEmail(email)) continue; // ті самі тестові акаунти, що й в /api/admin/stats
      payments.push({
        project: "teacherplan",
        id: p.id,
        createdAt: p.created_at,
        userEmail: email,
        amountUAH: p.amount,
        status: p.status === "completed" ? "completed" : p.status,
        note: p.package_id ? `Пакет: ${p.package_id}` : null,
      });
    }

    // --- TenderIntel ---
    let tenderIntelError: string | null = null;
    if (tiAdmin) {
      try {
        const [tiEventsRes, tiUsersRes] = await Promise.all([
          tiAdmin.from("payment_events").select("id, user_id, amount, currency, transaction_status, created_at"),
          tiAdmin.auth.admin.listUsers({ perPage: 1000 }),
        ]);
        if (tiEventsRes.error) throw tiEventsRes.error;

        const tiEmailById = new Map((tiUsersRes.data?.users || []).map((u) => [u.id, u.email ?? null] as const));
        for (const e of tiEventsRes.data || []) {
          const email = tiEmailById.get(e.user_id) || null;
          if (isTestEmail(email)) continue;
          payments.push({
            project: "tenderintel",
            id: e.id,
            createdAt: e.created_at,
            userEmail: email,
            amountUAH: e.currency === "UAH" ? e.amount : e.amount, // обидва проєкти в UAH
            status: e.transaction_status === "Approved" ? "completed" : e.transaction_status.toLowerCase(),
            note: "TenderIntel Pro",
          });
        }
      } catch (e: any) {
        // TenderIntel — другорядне джерело для цієї сторінки: якщо його
        // тимчасово не видно (ключ ще не підʼїхав, мережа), фінанси
        // TeacherPlan все одно мають показатись, а не впасти в 500.
        tenderIntelError = e.message || "Не вдалось отримати дані TenderIntel";
        console.error("❌ /api/admin/finance (tenderintel):", e);
      }
    } else {
      tenderIntelError = "TENDERINTEL_SUPABASE_URL / SERVICE_ROLE_KEY не задані";
    }

    payments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const completed = payments.filter((p) => p.status === "completed");

    const byMonthMap = new Map<string, { teacherplan: number; tenderintel: number }>();
    for (const p of completed) {
      const key = periodKey(p.createdAt, "month");
      const entry = byMonthMap.get(key) || { teacherplan: 0, tenderintel: 0 };
      entry[p.project] += p.amountUAH || 0;
      byMonthMap.set(key, entry);
    }
    const byMonth = Array.from(byMonthMap.entries())
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .map(([period, v]) => ({ period, teacherplanUAH: v.teacherplan, tenderintelUAH: v.tenderintel, totalUAH: v.teacherplan + v.tenderintel }));

    const byQuarterMap = new Map<string, { teacherplan: number; tenderintel: number }>();
    for (const p of completed) {
      const key = periodKey(p.createdAt, "quarter");
      const entry = byQuarterMap.get(key) || { teacherplan: 0, tenderintel: 0 };
      entry[p.project] += p.amountUAH || 0;
      byQuarterMap.set(key, entry);
    }
    const byQuarter = Array.from(byQuarterMap.entries())
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .map(([period, v]) => ({ period, teacherplanUAH: v.teacherplan, tenderintelUAH: v.tenderintel, totalUAH: v.teacherplan + v.tenderintel }));

    const totalTeacherplanUAH = completed.filter((p) => p.project === "teacherplan").reduce((s, p) => s + p.amountUAH, 0);
    const totalTenderintelUAH = completed.filter((p) => p.project === "tenderintel").reduce((s, p) => s + p.amountUAH, 0);

    return NextResponse.json({
      summary: {
        totalUAH: totalTeacherplanUAH + totalTenderintelUAH,
        totalTeacherplanUAH,
        totalTenderintelUAH,
        byMonth,
        byQuarter,
      },
      payments,
      tenderIntelError,
    });
  } catch (error: any) {
    console.error("❌ /api/admin/finance:", error);
    return NextResponse.json({ error: error.message || "Помилка сервера" }, { status: 500 });
  }
}
