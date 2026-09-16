/**
 * app/api/track/route.ts
 *
 * Мінімальний first-party облік лійки (funnel_events) — без стороннього
 * аналітичного сервісу. Fire-and-forget з клієнта (lib/track.ts),
 * ніколи не блокує UI навіть якщо запит впаде.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const supabaseAuth = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { event, meta } = await req.json();
    if (!event || typeof event !== "string") {
      return NextResponse.json({ error: "Відсутній event" }, { status: 400 });
    }

    let userId: string | null = null;
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const { data } = await supabaseAuth.auth.getUser(authHeader.slice("Bearer ".length));
      userId = data?.user?.id ?? null;
    }

    await supabaseAdmin.from("funnel_events").insert({ user_id: userId, event, meta: meta ?? null });
    return NextResponse.json({ success: true });
  } catch {
    // Аналітика ніколи не повинна ламати основний функціонал
    return NextResponse.json({ success: false });
  }
}
