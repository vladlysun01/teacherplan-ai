// lib/referrals.ts
//
// Реферальна програма. Усі функції тут очікують клієнт Supabase зі
// service role (обхід RLS) — так само, як payments/callback вже працює
// з профілями та кредитами. Не імпортувати сюди звичайний anon-клієнт:
// генерація коду і нарахування бонусів мають лишатися виключно серверною
// операцією.

import type { SupabaseClient } from "@supabase/supabase-js";

// Без символів, які легко сплутати голосом/на письмі: 0/O, 1/I.
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 7;

// Скільки кредитів отримує КОЖНА сторона (і реферер, і реферал) після
// першої успішної оплати реферала. Значення однакове для обох — "подвійна
// вигода", як і зазначено в роадмапі.
export const REFERRAL_REWARD_CREDITS = 2;

function randomCode(): string {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return code;
}

export function referralLinkFor(code: string): string {
  return `https://teacher-plan-ai.site/?ref=${code}`;
}

/**
 * Повертає referral_code користувача, генеруючи й зберігаючи його при
 * першому зверненні (лениво — без окремої міграції-тригера). Ретраї на
 * випадок колізії коду (малоймовірно при 33^7 варіантах, але дешево
 * перевірити).
 */
export async function getOrCreateReferralCode(
  admin: SupabaseClient,
  userId: string
): Promise<string> {
  const { data: existing } = await admin
    .from("profiles")
    .select("referral_code")
    .eq("id", userId)
    .single();

  if (existing?.referral_code) return existing.referral_code;

  for (let attempt = 0; attempt < 5; attempt++) {
    const code = randomCode();
    const { data, error } = await admin
      .from("profiles")
      .update({ referral_code: code })
      .eq("id", userId)
      .is("referral_code", null) // не перезаписати, якщо хтось встиг паралельно
      .select("referral_code")
      .single();

    if (!error && data?.referral_code) return data.referral_code;

    // Або код зайнятий (unique violation), або паралельний виклик уже
    // встановив код — перечитуємо перед наступною спробою.
    const { data: recheck } = await admin
      .from("profiles")
      .select("referral_code")
      .eq("id", userId)
      .single();
    if (recheck?.referral_code) return recheck.referral_code;
  }

  throw new Error("Не вдалося згенерувати реферальний код");
}

/**
 * Фіксує, хто кого запросив. Викликається одноразово — при реєстрації
 * (email/password у register/page.tsx через /api/referrals/attribute,
 * Google OAuth напряму з app/(auth)/callback/route.ts). Без ефекту, якщо:
 * - коду не існує;
 * - користувач намагається "запросити сам себе";
 * - у користувача вже є referred_by (перша атрибуція виграє, повторні
 *   заходи за іншим реферальним посиланням нічого не змінюють).
 */
export async function attributeReferral(
  admin: SupabaseClient,
  newUserId: string,
  refCode: string
): Promise<{ attributed: boolean; reason?: string }> {
  if (!refCode) return { attributed: false, reason: "no_code" };

  const { data: referrer } = await admin
    .from("profiles")
    .select("id")
    .eq("referral_code", refCode)
    .single();

  if (!referrer) return { attributed: false, reason: "code_not_found" };
  if (referrer.id === newUserId) return { attributed: false, reason: "self_referral" };

  const { data: updated, error } = await admin
    .from("profiles")
    .update({ referred_by: referrer.id })
    .eq("id", newUserId)
    .is("referred_by", null) // перша атрибуція виграє
    .select("id")
    .single();

  if (error || !updated) return { attributed: false, reason: "already_attributed" };

  const { error: insertError } = await admin.from("referrals").insert({
    referrer_id: referrer.id,
    referred_id: newUserId,
    status: "pending",
    reward_credits: REFERRAL_REWARD_CREDITS,
  });

  if (insertError) {
    console.error("❌ Не вдалося створити рядок referrals:", insertError);
  }

  return { attributed: true };
}

/**
 * Викликається з payments/callback ПІСЛЯ того, як платіж уже позначено
 * 'completed' і кредити нараховані покупцю. Нагороджує реферера й
 * реферала бонусними кредитами, якщо це справді перша успішна оплата
 * реферала і бонус ще не видавався.
 */
export async function maybeRewardReferral(
  admin: SupabaseClient,
  paidUserId: string
): Promise<void> {
  const { count: completedPayments } = await admin
    .from("payments")
    .select("id", { count: "exact", head: true })
    .eq("user_id", paidUserId)
    .eq("status", "completed");

  if ((completedPayments ?? 0) !== 1) return; // не перша оплата — бонус уже або видано, або не належить

  const { data: referral } = await admin
    .from("referrals")
    .select("id, referrer_id, referred_id, status, reward_credits")
    .eq("referred_id", paidUserId)
    .eq("status", "pending")
    .single();

  if (!referral) return; // немає реферера або бонус уже видано

  // Атомарний "захват" рядка referrals — той самий патерн, що й у
  // payments/callback: UPDATE з умовою status='pending' гарантує, що
  // нагородити зможе лише один виклик, навіть при паралельних вебхуках.
  const { data: claimed } = await admin
    .from("referrals")
    .update({ status: "rewarded", rewarded_at: new Date().toISOString() })
    .eq("id", referral.id)
    .eq("status", "pending")
    .select("id")
    .single();

  if (!claimed) return; // хтось інший вже забрав цю нагороду

  const reward = referral.reward_credits ?? REFERRAL_REWARD_CREDITS;

  for (const [userId, description] of [
    [referral.referrer_id, `Бонус за запрошення колеги (${reward} ${reward === 1 ? "кредит" : "кредити"})`],
    [referral.referred_id, `Бонус за реєстрацію за запрошенням (${reward} ${reward === 1 ? "кредит" : "кредити"})`],
  ] as const) {
    const { data: profile } = await admin.from("profiles").select("credits").eq("id", userId).single();
    const newCredits = (profile?.credits ?? 0) + reward;

    await admin.from("profiles").update({ credits: newCredits }).eq("id", userId);
    await admin.from("credit_transactions").insert({
      user_id: userId,
      amount: reward,
      type: "bonus",
      description,
      created_at: new Date().toISOString(),
    });
  }

  console.log(`🎁 Реферальний бонус нараховано: реферер ${referral.referrer_id}, реферал ${referral.referred_id}, по ${reward} кредитів`);
}
