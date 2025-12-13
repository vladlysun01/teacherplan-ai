import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    const userId = formData.userId;
    
    console.log("🧪 ТЕСТ генерації документа:", formData.subject, formData.class);
    console.log("👤 User ID:", userId);
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Необхідна авторизація" },
        { status: 401 }
      );
    }

    // ==========================================
    // ПЕРЕВІРКА КРЕДИТІВ
    // ==========================================
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Отримати поточний баланс
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      console.error("❌ Помилка отримання профілю:", profileError);
      return NextResponse.json(
        { success: false, error: "Помилка перевірки балансу" },
        { status: 500 }
      );
    }

    // 2. Перевірити чи достатньо кредитів
    if (profile.credits < 1) {
      console.log("⚠️ Недостатньо кредитів. Поточний баланс:", profile.credits);
      return NextResponse.json(
        { 
          success: false, 
          error: "Недостатньо кредитів",
          errorCode: "INSUFFICIENT_CREDITS",
          currentCredits: profile.credits,
          message: "Купіть кредити щоб продовжити генерацію"
        },
        { status: 402 } // 402 Payment Required
      );
    }

    console.log("✅ Кредитів достатньо. Поточний баланс:", profile.credits);

    // 3. Витратити кредит (викликаємо SQL функцію)
    const { data: spendResult, error: spendError } = await supabase.rpc('spend_credit', {
      p_user_id: userId,
      p_description: `[ТЕСТ] Генерація: ${formData.subject} ${formData.class} клас`
    });

    if (spendError || !spendResult) {
      console.error("❌ Помилка витрати кредиту:", spendError);
      return NextResponse.json(
        { success: false, error: "Помилка витрати кредиту: " + spendError?.message },
        { status: 500 }
      );
    }

    console.log("💳 Кредит витрачено успішно! Новий баланс:", profile.credits - 1);
    
    // ==========================================
    // MOCK ГЕНЕРАЦІЯ ДОКУМЕНТУ
    // ==========================================
    
    console.log("🚀 Почата mock генерація...");
    
    // Імітуємо затримку генерації (2 секунди)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock URL документу
    const mockDocumentUrl = "https://docs.google.com/document/d/1234567890MOCK_TEST_DOCUMENT/edit";
    
    console.log("📄 Mock документ створено:", mockDocumentUrl);
    
    // Зберігаємо в БД
    const { data: document, error: insertError } = await supabase
      .from("documents")
      .insert({ 
        user_id: userId,
        title: `[ТЕСТ] Календарний план: ${formData.subject} ${formData.class} клас`, 
        type: "calendar_plan", 
        status: "ready",
        file_url: mockDocumentUrl,
        generation_params: formData,
        metadata: { 
          documentUrl: mockDocumentUrl,
          isMockTest: true,
          testTimestamp: new Date().toISOString()
        },
        credits_used: 1 // Зберігаємо скільки кредитів витрачено
      })
      .select()
      .single();
    
    if (insertError) {
      console.error("❌ Помилка збереження в БД:", insertError);
      // Не повертаємо кредит тут, бо генерація все одно відбулась
    } else {
      console.log("✅ Документ збережено в БД:", document.id);
    }
    
    return NextResponse.json({ 
      success: true, 
      documentUrl: mockDocumentUrl,
      document: document,
      creditsRemaining: profile.credits - 1,
      isMockTest: true,
      message: `✅ ТЕСТ УСПІШНИЙ!\n\nКредит витрачено!\nЗалишилось: ${profile.credits - 1} кредитів\n\nЦе тестова генерація без реального документу.`
    });
    
  } catch (error: any) {
    console.error("❌ Помилка генерації:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Невідома помилка" },
      { status: 500 }
    );
  }
}