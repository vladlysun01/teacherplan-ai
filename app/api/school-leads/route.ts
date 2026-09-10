// app/api/school-leads/route.ts
//
// POST — публічна форма на /dlya-shkil (без авторизації, директор школи
// не має акаунта TeacherPlan). GET — список заявок для app/admin/schools,
// той самий Bearer-токен + isAdminEmail патерн, що й інші /api/admin/*.
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
    const { schoolName, contactName, phone, email, teachersCount, packageId, comment } = await request.json();

    if (!schoolName?.trim() || !contactName?.trim() || !phone?.trim() || !email?.trim()) {
      return NextResponse.json({ success: false, error: "Заповніть обов'язкові поля" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("school_leads").insert({
      school_name: schoolName.trim(),
      contact_name: contactName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      teachers_count: teachersCount || null,
      package_id: packageId || null,
      comment: comment?.trim() || null,
    });

    if (error) {
      console.error("❌ /api/school-leads insert:", error);
      return NextResponse.json({ success: false, error: "Не вдалося зберегти заявку" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ /api/school-leads POST:", error);
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
    if (userError || !userData?.user) {
      return NextResponse.json({ error: "Недійсна сесія" }, { status: 401 });
    }
    if (!isAdminEmail(userData.user.email)) {
      return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
    }

    const { data, error } = await supabaseAdmin
      .from("school_leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ leads: data || [] });
  } catch (error: any) {
    console.error("❌ /api/school-leads GET:", error);
    return NextResponse.json({ error: error.message || "Внутрішня помилка" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
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

    const { id, status } = await request.json();
    const validStatuses = ["new", "contacted", "invoiced", "paid", "declined"];
    if (!id || !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Некоректні дані" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("school_leads").update({ status }).eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ /api/school-leads PATCH:", error);
    return NextResponse.json({ error: error.message || "Внутрішня помилка" }, { status: 500 });
  }
}
