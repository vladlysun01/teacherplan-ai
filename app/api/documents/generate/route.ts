// Force rebuild - v2
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL || "";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    const userId = formData.userId;
    
    console.log("📝 Генерація документа:", formData.subject, formData.class);
    console.log("👤 User ID:", userId);
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Необхідна авторизація" },
        { status: 401 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

    if (profile.credits < 1) {
      console.log("⚠️ Недостатньо кредитів. Поточний баланс:", profile.credits);
      return NextResponse.json(
        { 
          success: false, 
          error: "Недостатньо кредитів",
          errorCode: "INSUFFICIENT_CREDITS",
          currentCredits: profile.credits
        },
        { status: 402 }
      );
    }

    console.log("✅ Кредитів достатньо. Поточний баланс:", profile.credits);

    const { data: spendResult, error: spendError } = await supabase.rpc('spend_credit', {
      p_user_id: userId,
      p_description: `Генерація: ${formData.subject} ${formData.class} клас`
    });

    if (spendError || !spendResult) {
      console.error("❌ Помилка витрати кредиту:", spendError);
      return NextResponse.json(
        { success: false, error: "Помилка витрати кредиту" },
        { status: 500 }
      );
    }

    console.log("💳 Кредит витрачено успішно! Новий баланс:", profile.credits - 1);
    
    let lessons = [];
    let planSettings = formData;
    
    try {
      if (formData.subject === "Українська мова") {
        const { generateUkrainianCalendarPlan } = await import("@/lib/generation/ukrainian-plan");
        const result = await generateUkrainianCalendarPlan(formData);
        if (!result.success) throw new Error(result.error || "Помилка генерації плану");
        lessons = result.lessons || [];
        planSettings = result.settings || formData;

      } else if (formData.subject === "Фізична культура") {
        const { generateCalendarPlan } = await import("@/lib/generation/calendar-plan");
        const result = await generateCalendarPlan(formData);
        if (!result.success) throw new Error(result.error || "Помилка генерації плану");
        lessons = result.lessons || [];
        planSettings = result.settings || formData;

      } else if (formData.subject === "Українська література") {
        const { generateUkrainianLiteratureCalendarPlan } = await import("@/lib/generation/ukrainian-literature-plan");
        const result = await generateUkrainianLiteratureCalendarPlan(formData);
        if (!result.success) throw new Error(result.error || "Помилка генерації плану");
        lessons = result.lessons || [];
        planSettings = (result as any).settings || formData;

      } else if (formData.subject === "Математика") {
        const { generateMathematicsCalendarPlan } = await import("@/lib/generation/mathematics-plan");
        const result = await generateMathematicsCalendarPlan(formData);
        if (!result.success) throw new Error(result.error || "Помилка генерації плану");
        lessons = result.lessons || [];
        planSettings = (result as any).settings || formData;

      } else if (formData.subject === "Інформатика") {
        const { generateInformaticsCalendarPlan } = await import("@/lib/generation/informatics-plan");
        const result = await generateInformaticsCalendarPlan(formData);
        if (!result.success) throw new Error(result.error || "Помилка генерації плану");
        lessons = result.lessons || [];
        planSettings = (result as any).settings || formData;

      } else if (formData.subject === "Історія України") {
        const { generateHistoryCalendarPlan } = await import("@/lib/generation/history-plan");
        const result = await generateHistoryCalendarPlan(formData);
        if (!result.success) throw new Error(result.error || "Помилка генерації плану");
        lessons = result.lessons || [];
        planSettings = result.settings || formData;

      } else if (formData.subject === "Всесвітня історія") {
        const { generateWorldHistoryCalendarPlan } = await import("@/lib/generation/world-history-plan");
        const result = await generateWorldHistoryCalendarPlan(formData);
        if (!result.success) throw new Error(result.error || "Помилка генерації плану");
        lessons = result.lessons || [];
        planSettings = result.settings || formData;

      } else if (formData.subject === "Мистецтво") {
        const { generateArtCalendarPlan } = await import("@/lib/generation/art-plan");
        const result = await generateArtCalendarPlan(formData);
        if (!result.success) throw new Error(result.error || "Помилка генерації плану");
        lessons = result.lessons || [];
        planSettings = (result as any).settings || formData;

      } else if (formData.subject === "Географія") {
        const { generateGeographyCalendarPlan } = await import("@/lib/generation/geography-plan");
        const result = generateGeographyCalendarPlan(formData);
        lessons = result.lessons || [];
        planSettings = result;

      } else if (formData.subject === "Основи правознавства") {
        const { generateLawCalendarPlan } = await import("@/lib/generation/law-plan");
        const result = generateLawCalendarPlan(formData);
        lessons = result.lessons || [];
        planSettings = result;

      } else if (formData.subject === "Хімія") {
        const { generateChemistryCalendarPlan } = await import("@/lib/generation/chemistry-plan");
        const result = generateChemistryCalendarPlan(formData);
        lessons = result.lessons || [];
        planSettings = result;

      } else if (formData.subject === "Біологія") {
        const { generateBiologyCalendarPlan } = await import("@/lib/generation/biology-plan");
        const result = generateBiologyCalendarPlan(formData);
        lessons = result.lessons || [];
        planSettings = result;

      } else if (formData.subject === "Фізика") {
        const { generatePhysicsCalendarPlan } = await import("@/lib/generation/physics-plan");
        const result = generatePhysicsCalendarPlan(formData);
        lessons = result.lessons || [];
        planSettings = result;

      } else if (formData.subject === "Захист України") {
        const { generateDefenseOfUkraineCalendarPlan } = await import("@/lib/generation/defense-ukraine-plan");
        const result = generateDefenseOfUkraineCalendarPlan(formData);
        lessons = result.lessons || [];
        planSettings = result;

      } else {
        throw new Error(`Предмет "${formData.subject}" ще не підтримується`);
      }

    } catch (generationError: any) {
      console.error("❌ Помилка генерації уроків:", generationError);
      
      await supabase.rpc('add_credits', {
        p_user_id: userId,
        p_amount: 1,
        p_package: 'refund',
        p_price: 0,
        p_description: 'Повернення кредиту через помилку генерації'
      });
      
      console.log("↩️ Кредит повернуто через помилку генерації");
      throw generationError;
    }
    
    const dataForAppsScript = {
      ...planSettings,
      lessons: lessons
    };
    
    console.log("🚀 Calling Apps Script:", APPS_SCRIPT_URL);
    
    try {
      const appsScriptResponse = await fetch(APPS_SCRIPT_URL, { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(dataForAppsScript), 
        redirect: "follow" 
      });
      
      const responseText = await appsScriptResponse.text();
      console.log("📄 Apps Script response:", responseText);
      const result = JSON.parse(responseText);
      
      if (!result.success) {
        throw new Error(result.error || "Apps Script помилка");
      }
      
      const { data: document, error: insertError } = await supabase
        .from("documents")
        .insert({ 
          user_id: userId,
          title: `Календарний план: ${formData.subject} ${formData.class} клас`, 
          type: "calendar_plan", 
          status: "ready",
          file_url: result.documentUrl,
          generation_params: formData,
          metadata: { documentUrl: result.documentUrl },
          credits_used: 1
        })
        .select()
        .single();
      
      if (insertError) {
        console.error("❌ Помилка збереження в БД:", insertError);
        return NextResponse.json({ 
          success: true, 
          documentUrl: result.documentUrl,
          creditsRemaining: profile.credits - 1,
          message: "Документ успішно згенеровано!" 
        });
      }
      
      console.log("✅ Документ збережено в БД:", document?.id);
      
      return NextResponse.json({ 
        success: true, 
        documentId: document?.id,
        documentUrl: result.documentUrl,
        creditsRemaining: profile.credits - 1,
        message: "Документ успішно згенеровано!" 
      });
      
    } catch (appsScriptError: any) {
      console.error("❌ Помилка Apps Script:", appsScriptError);
      
      await supabase.rpc('add_credits', {
        p_user_id: userId,
        p_amount: 1,
        p_package: 'refund',
        p_price: 0,
        p_description: 'Повернення кредиту через помилку Apps Script'
      });
      
      console.log("↩️ Кредит повернуто через помилку Apps Script");
      throw appsScriptError;
    }
    
  } catch (error: any) {
    console.error("❌ Загальна помилка генерації:", error);
    return NextResponse.json({ 
      success: false,
      error: error.message || "Невідома помилка генерації"
    }, { status: 500 });
  }
}
