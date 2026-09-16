/**
 * lib/track.ts
 *
 * Fire-and-forget облік лійки — ніколи не чекаємо відповідь, ніколи не
 * кидаємо помилку в код, що викликав. Аналітика не повинна впливати на
 * UX, навіть якщо сама впаде.
 */
import { createClient } from "@/lib/supabase-browser";

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
      body: JSON.stringify({ event, meta }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // тихо ігноруємо — аналітика ніколи не важливіша за сам продукт
  }
}
