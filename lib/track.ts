/**
 * lib/track.ts
 *
 * Fire-and-forget облік лійки — ніколи не чекаємо відповідь, ніколи не
 * кидаємо помилку в код, що викликав. Аналітика не повинна впливати на
 * UX, навіть якщо сама впаде.
 */
import { createClient } from "@/lib/supabase-browser";

// Той самий підхід, що й у tender-intel (2026-09-24): "трекінг з якої
// версії заходили — моб. чи десктоп" підмішується сюди раз, для ВСІХ
// подій одразу, а не вимагає від кожного виклику передавати це вручну.
function deviceType(): "mobile" | "desktop" | "unknown" {
  if (typeof window === "undefined") return "unknown";
  return window.innerWidth <= 860 ? "mobile" : "desktop";
}

export async function track(event: string, meta?: Record<string, unknown>) {
  try {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    fetch("/api/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
      },
      body: JSON.stringify({ event, meta: { ...meta, device: deviceType() } }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // тихо ігноруємо — аналітика ніколи не важливіша за сам продукт
  }
}
