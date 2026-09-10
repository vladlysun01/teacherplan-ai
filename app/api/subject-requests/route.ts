// app/api/subject-requests/route.ts
//
// POST — публічна форма "Не знайшли свій предмет?" на головній сторінці
// (без авторизації). GET — для майбутньої адмін-панелі (той самий
// Bearer + isAdminEmail патерн, що й /api/school-leads).
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
    const { requestText, email } = await request.json();

    if (!requestText?.trim()) {
      return NextResponse.json({ success: false, error: "Опишіть, який предмет очікуєте" }, { status: 400 });
    }
    if (requestText.length > 500) {
      return NextResponse.json({ success: false, error: "Занадто довгий текст (макс. 500 символів)" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("subject_requests").insert({
      request_text: requestText.trim(),
      email: email?.trim() || null,
    });

    if (error) {
      console.error("❌ /api/subject-requests insert:", error);
      return NextResponse.json({ success: false, error: "Не вдалося зберегти запит" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ /api/subject-requests POST:", error);
    return NextResponse.json({ success: false, error: error.message || "Внутрішня помилка" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) {
      return NextResponse.json({ error: "Необхідна авторизація" }, { status: 401 });
    }
    const { data: userData, error: userError } = await supabaseAuth.auth.getUser(token);
    if (userError || !userData?.user || !isAdminEmail(userData.user.email)) {
      return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
    }

    const { data, error } = await supabaseAdmin
      .from("subject_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ requests: data || [] });
  } catch (error: any) {
    console.error("❌ /api/subject-requests GET:", error);
    return NextResponse.json({ error: error.message || "Внутрішня помилка" }, { status: 500 });
  }
}
