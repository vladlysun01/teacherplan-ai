import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAdminEmail } from "@/lib/admin";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    // Той самий захист, що й /api/admin/stats: справжня перевірка — тут,
    // на сервері, за реальним JWT, а не за тим, що каже клієнт.
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

    const { userId, amount, note } = await request.json();

    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ error: "Не вказано користувача" }, { status: 400 });
    }
    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount === 0 || !Number.isInteger(parsedAmount)) {
      return NextResponse.json({ error: "Кількість кредитів має бути цілим числом, не 0" }, { status: 400 });
    }
    // Запобіжник від випадкової фатальної помилки (зайвий нуль тощо) —
    // адмінка для ручних бонусів/компенсацій, не для тисяч кредитів за раз.
    if (Math.abs(parsedAmount) > 1000) {
      return NextResponse.json({ error: "Забагато за один раз (максимум 1000). Повтори кілька разів, якщо треба більше." }, { status: 400 });
    }

    const description =
      (note && String(note).trim()) ||
      (parsedAmount > 0 ? `Бонус від адміністратора: +${parsedAmount}` : `Списання адміністратором: ${parsedAmount}`);

    // Свідомо НЕ через RPC add_credits: та функція завжди записує
    // type='purchase' (окрім package='refund') — ручний бонус через неї
    // помилково позначив би людину "платною" у статистиці адмінки
    // (/api/admin/stats рахує "платних" за credit_transactions.type =
    // 'purchase'). Тому робимо ті самі два кроки напряму, з type='bonus',
    // не чіпаючи саму функцію в базі.
    const { data: profile, error: fetchError } = await supabaseAdmin
      .from("profiles")
      .select("credits")
      .eq("id", userId)
      .single();

    if (fetchError || !profile) {
      return NextResponse.json({ error: "Користувача не знайдено" }, { status: 404 });
    }

    const newBalance = profile.credits + parsedAmount;
    if (newBalance < 0) {
      return NextResponse.json({ error: `Недостатньо кредитів для списання (зараз: ${profile.credits})` }, { status: 400 });
    }

    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ credits: newBalance })
      .eq("id", userId);

    if (updateError) {
      console.error("❌ /api/admin/add-credits update:", updateError);
      return NextResponse.json({ error: updateError.message || "Помилка нарахування" }, { status: 500 });
    }

    const { error: logError } = await supabaseAdmin.from("credit_transactions").insert({
      user_id: userId,
      amount: parsedAmount,
      type: "bonus",
      package: "admin_grant",
      price: 0,
      description,
    });
    if (logError) {
      // Кредити вже нараховано — не провалюємо запит через збій логування,
      // просто лишаємо слід в консолі.
      console.error("⚠️ /api/admin/add-credits: не вдалось залогувати транзакцію:", logError);
    }

    console.log(`💳 Адмін ${userData.user.email} змінив баланс ${userId} на ${parsedAmount} (${description}). Новий баланс: ${newBalance}`);

    return NextResponse.json({ success: true, newBalance });
  } catch (error: any) {
    console.error("❌ /api/admin/add-credits:", error);
    return NextResponse.json({ error: error.message || "Помилка сервера" }, { status: 500 });
  }
}
