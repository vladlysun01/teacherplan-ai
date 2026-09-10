import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAdminEmail } from "@/lib/admin";
import { buildInvoiceDocx, generateInvoiceNumber } from "@/lib/invoice-builder";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: NextRequest) {
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

    const { buyerName, buyerCode, description, quantity, unit, unitPrice } = await request.json();

    if (!buyerName?.trim() || !description?.trim()) {
      return NextResponse.json({ error: "Вкажіть назву закладу й опис послуги" }, { status: 400 });
    }
    const qty = Number(quantity);
    const price = Number(unitPrice);
    if (!Number.isFinite(qty) || qty <= 0 || !Number.isFinite(price) || price <= 0) {
      return NextResponse.json({ error: "Кількість і ціна мають бути додатними числами" }, { status: 400 });
    }

    const now = new Date();
    const invoiceNumber = generateInvoiceNumber(now);
    const invoiceDate = now.toLocaleDateString("uk-UA", { day: "2-digit", month: "2-digit", year: "numeric" });

    const buffer = await buildInvoiceDocx({
      invoiceNumber,
      invoiceDate,
      buyerName: buyerName.trim(),
      buyerCode: buyerCode?.trim() || undefined,
      description: description.trim(),
      quantity: qty,
      unit: unit?.trim() || "пакет",
      unitPrice: price,
    });

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="rahunok-${invoiceNumber}.docx"`,
      },
    });
  } catch (error: any) {
    console.error("❌ /api/admin/invoice:", error);
    return NextResponse.json({ error: error.message || "Помилка сервера" }, { status: 500 });
  }
}
