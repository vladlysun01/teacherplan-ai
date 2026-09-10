// app/api/referrals/me/route.ts
//
// Для блоку "Запросити колег" у "Мій профіль": повертає (і за потреби
// генерує) referral_code користувача, готове посилання й лічильники.
// Автентифікація — через cookies сесії (так само, як app/(auth)/callback),
// сама генерація/запис коду і читання чужих рядків referrals —
// службовим клієнтом (service role), бо RLS на referrals дозволяє
// користувачу бачити лише свої рядки як referrer, а обхід потрібен для
// надійної генерації унікального коду.
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getOrCreateReferralCode, referralLinkFor } from "@/lib/referrals";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // не потрібно ставити куки в GET-роуті лише для читання
        },
      },
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Необхідна авторизація" }, { status: 401 });
    }

    const admin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const code = await getOrCreateReferralCode(admin, user.id);

    const { count: pendingCount } = await admin
      .from("referrals")
      .select("id", { count: "exact", head: true })
      .eq("referrer_id", user.id)
      .eq("status", "pending");

    const { count: rewardedCount } = await admin
      .from("referrals")
      .select("id", { count: "exact", head: true })
      .eq("referrer_id", user.id)
      .eq("status", "rewarded");

    return NextResponse.json({
      success: true,
      code,
      referralLink: referralLinkFor(code),
      pendingCount: pendingCount ?? 0,
      rewardedCount: rewardedCount ?? 0,
    });
  } catch (error: any) {
    console.error("❌ /api/referrals/me error:", error);
    return NextResponse.json({ success: false, error: error.message || "Внутрішня помилка" }, { status: 500 });
  }
}
