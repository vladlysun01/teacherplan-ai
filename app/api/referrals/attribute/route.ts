// app/api/referrals/attribute/route.ts
//
// Викликається клієнтським кодом одразу після успішної реєстрації
// email/password (app/(auth)/register/page.tsx) — передає userId
// щойно створеного акаунта й реферальний код з cookie tp_ref.
// Google OAuth йде іншим шляхом: атрибуція там відбувається напряму
// в app/(auth)/callback/route.ts, бо там уже є серверний доступ до
// cookies без додаткового HTTP-виклику.
//
// userId у тілі запиту навмисно НЕ перевіряється проти сесії — на
// момент виклику клієнт міг ще не отримати сесію (якщо ввімкнене
// підтвердження email). Це безпечно: attributeReferral() у lib/referrals.ts
// й так гарантує, що реферала можна прив'язати лише один раз
// (referred_by IS NULL), тож повторний/підроблений виклик з чужим
// userId просто ні на що не вплине, якщо той профіль уже атрибутований
// або не існує.
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { attributeReferral } from "@/lib/referrals";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { userId, refCode } = await request.json();

    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ success: false, error: "userId обов'язковий" }, { status: 400 });
    }
    if (!refCode || typeof refCode !== "string" || !/^[A-Za-z0-9]{4,16}$/.test(refCode)) {
      return NextResponse.json({ success: false, error: "Некоректний реферальний код" }, { status: 400 });
    }

    const admin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const result = await attributeReferral(admin, userId, refCode);
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error("❌ /api/referrals/attribute error:", error);
    return NextResponse.json({ success: false, error: error.message || "Внутрішня помилка" }, { status: 500 });
  }
}
