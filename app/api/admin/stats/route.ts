import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAdminEmail, isTestEmail } from "@/lib/admin";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Клієнт з anon-ключем — лише щоб перевірити токен користувача
// (auth.getUser сам звертається до Supabase Auth і повертає власника
// токена; ключ тут не дає доступу до чужих даних, він потрібен лише
// для розпізнавання JWT).
const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);

// Сервісний ключ — тільки для читання агрегованих даних ПІСЛЯ того, як
// адмінство підтверджено нижче. Ніколи не йде в відповідь клієнту.
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    // Захист: сам факт заходу на /admin у браузері нічого не гарантує —
    // клієнтський UI можна обійти прямим запитом до цього роуту. Тому
    // справжня перевірка прав — тут, на сервері, за реальним JWT
    // користувача, а не за тим, що прислав клієнт про себе.
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) {
      return NextResponse.json({ error: "Необхідна авторизація" }, { status: 401 });
    }

    const { data: userData, error: userError } = await supabaseAuth.auth.getUser(token);
    if (userError || !userData?.user) {
      return NextResponse.json({ error: "Недійсна сесія" }, { status: 401 });
    }

    if (!isAdminEmail(userData.user.email)) {
      return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
    }

    const [profilesRes, documentsRes, purchasesRes, paymentsRes] = await Promise.all([
      supabaseAdmin
        .from("profiles")
        .select("id, email, full_name, school_name, created_at, credits, total_generations")
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("documents")
        .select("id, user_id, title, type, status, created_at, credits_used, generation_params"),
      supabaseAdmin
        .from("credit_transactions")
        .select("user_id, price, created_at")
        .eq("type", "purchase"),
      supabaseAdmin
        .from("payments")
        .select("id, user_id, order_id, amount, credits, status, created_at")
        .order("created_at", { ascending: false }),
    ]);

    if (profilesRes.error) throw profilesRes.error;
    if (documentsRes.error) throw documentsRes.error;
    if (purchasesRes.error) throw purchasesRes.error;
    if (paymentsRes.error) throw paymentsRes.error;

    // Власні тестові акаунти (власник + друг, що тестує "Фізичну
    // культуру") прибираємо звідусіль — інакше вони спотворюють і
    // кількість користувачів, і розбивку по предметах, і графік
    // реєстрацій.
    const testIds = new Set(
      (profilesRes.data || []).filter((p) => isTestEmail(p.email)).map((p) => p.id)
    );
    const profiles = (profilesRes.data || []).filter((p) => !testIds.has(p.id));
    const documents = (documentsRes.data || []).filter((d) => !testIds.has(d.user_id));
    const purchases = (purchasesRes.data || []).filter((p) => !testIds.has(p.user_id));

    // Наскрізний порядковий номер — "хто який по рахунку" — рахуємо за
    // хронологією реєстрації (найперший користувач = №1), незалежно від
    // того, в якому порядку рядки показуються в таблиці.
    const byCreatedAsc = [...profiles].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    const signupNumberById = new Map<string, number>();
    byCreatedAsc.forEach((p, i) => signupNumberById.set(p.id, i + 1));

    const docsByUser = new Map<string, typeof documents>();
    for (const doc of documents) {
      const list = docsByUser.get(doc.user_id) || [];
      list.push(doc);
      docsByUser.set(doc.user_id, list);
    }

    const paidTotalsByUser = new Map<string, number>();
    for (const p of purchases) {
      paidTotalsByUser.set(p.user_id, (paidTotalsByUser.get(p.user_id) || 0) + (p.price || 0));
    }

    const users = profiles.map((p) => {
      const userDocs = (docsByUser.get(p.id) || []).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      const totalSpentUAH = paidTotalsByUser.get(p.id) || 0;
      return {
        id: p.id,
        signupNumber: signupNumberById.get(p.id)!,
        email: p.email,
        fullName: p.full_name,
        schoolName: p.school_name,
        createdAt: p.created_at,
        credits: p.credits,
        totalGenerations: p.total_generations,
        documentsCount: userDocs.length,
        paid: totalSpentUAH > 0,
        totalSpentUAH,
        documents: userDocs.map((d) => ({
          id: d.id,
          title: d.title,
          subject: (d.generation_params as any)?.subject || null,
          class: (d.generation_params as any)?.class || null,
          status: d.status,
          createdAt: d.created_at,
          creditsUsed: d.credits_used,
        })),
      };
    });

    const docsBySubject: Record<string, number> = {};
    const docsByStatus: Record<string, number> = {};
    for (const d of documents) {
      const subject = (d.generation_params as any)?.subject || "Невідомо";
      docsBySubject[subject] = (docsBySubject[subject] || 0) + 1;
      docsByStatus[d.status] = (docsByStatus[d.status] || 0) + 1;
    }

    // Реєстрації по днях за ВЕСЬ час (від першого користувача до
    // сьогодні) — клієнт сам згортає це у тижні/місяці і дає тягати
    // повзунок вибору діапазону (Brush), тож тут краще віддати найдрібнішу
    // гранулярність один раз, ніж повторно смикати API на кожен зум.
    const signupsByDay: { date: string; count: number }[] = [];
    const dayMs = 24 * 60 * 60 * 1000;
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const countsByDate = new Map<string, number>();
    for (const p of profiles) {
      const d = new Date(p.created_at);
      d.setUTCHours(0, 0, 0, 0);
      const key = d.toISOString().slice(0, 10);
      countsByDate.set(key, (countsByDate.get(key) || 0) + 1);
    }
    const firstSignup =
      byCreatedAsc.length > 0
        ? (() => {
            const d = new Date(byCreatedAsc[0].created_at);
            d.setUTCHours(0, 0, 0, 0);
            return d;
          })()
        : today;
    for (let t = firstSignup.getTime(); t <= today.getTime(); t += dayMs) {
      const key = new Date(t).toISOString().slice(0, 10);
      signupsByDay.push({ date: key, count: countsByDate.get(key) || 0 });
    }

    const totalPaidUsers = users.filter((u) => u.paid).length;
    const totalRevenueUAH = purchases.reduce((sum, p) => sum + (p.price || 0), 0);

    // Фінанси — реальний журнал оплат (таблиця payments, а не
    // credit_transactions) для звітності: скільки й коли реально
    // надійшло. status='completed' — це підтверджений вебхуком платіж,
    // тільки такі йдуть у підсумки по місяцях/кварталах.
    const emailById = new Map((profilesRes.data || []).map((p) => [p.id, p.email] as const));
    const payments = (paymentsRes.data || [])
      .filter((p) => !testIds.has(p.user_id))
      .map((p) => ({
        id: p.id,
        createdAt: p.created_at,
        userEmail: emailById.get(p.user_id) || null,
        orderId: p.order_id,
        amountUAH: p.amount,
        credits: p.credits,
        status: p.status as string,
      }));

    const completedPayments = payments.filter((p) => p.status === "completed");

    function periodKey(dateStr: string, kind: "month" | "quarter"): string {
      const d = new Date(dateStr);
      const y = d.getUTCFullYear();
      if (kind === "month") return `${y}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
      const q = Math.floor(d.getUTCMonth() / 3) + 1;
      return `${y}-Q${q}`;
    }

    function aggregateByPeriod(kind: "month" | "quarter") {
      const map = new Map<string, { totalUAH: number; count: number }>();
      for (const p of completedPayments) {
        const key = periodKey(p.createdAt, kind);
        const entry = map.get(key) || { totalUAH: 0, count: 0 };
        entry.totalUAH += p.amountUAH || 0;
        entry.count += 1;
        map.set(key, entry);
      }
      return Array.from(map.entries())
        .sort((a, b) => (a[0] < b[0] ? -1 : 1))
        .map(([period, v]) => ({ period, ...v }));
    }

    return NextResponse.json({
      summary: {
        totalUsers: profiles.length,
        totalDocuments: documents.length,
        totalPaidUsers,
        totalTrialUsers: profiles.length - totalPaidUsers,
        totalRevenueUAH,
        docsBySubject,
        docsByStatus,
        signupsByDay,
      },
      users,
      finance: {
        payments,
        totalCompletedUAH: completedPayments.reduce((sum, p) => sum + (p.amountUAH || 0), 0),
        byMonth: aggregateByPeriod("month"),
        byQuarter: aggregateByPeriod("quarter"),
      },
    });
  } catch (error: any) {
    console.error("❌ /api/admin/stats:", error);
    return NextResponse.json({ error: error.message || "Помилка сервера" }, { status: 500 });
  }
}
