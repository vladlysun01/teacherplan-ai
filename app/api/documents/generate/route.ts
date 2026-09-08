// Force rebuild - v2
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
    
    // БАГ: для Географії/Правознавства/Хімії/Біології/Фізики/Захисту України
    // (гілки вище, де planSettings = result, а не result.settings || formData)
    // генератор уроків повертає СВІЙ ВЛАСНИЙ обʼєкт полів — і, наприклад,
    // generateBiologyCalendarPlan() не повертає program/programId/weekdays/
    // startDate взагалі. planSettings повністю ЗАМІНЯВ formData, тому ці
    // поля летіли в Apps Script як undefined — введені в дашборді дані
    // (програма, дати, дні тижня) губились у готовому документі, хоча
    // teacherName/schoolName/class/schoolYear там таки були (їх генератори
    // поверталу явно).
    //
    // Фікс: спершу formData (усе, що ввів користувач), зверху — те, що
    // явно повернув генератор (там, де він щось уточнює/дораховує).
    // Жодне поле з форми більше не може мовчки зникнути.
    const finalData = {
      ...formData,
      ...planSettings,
      lessons: lessons
    };

    console.log("📄 Генерую .docx локально (без Google Apps Script)...");

    try {
      const { buildCalendarPlanDocx } = await import("@/lib/document-builder");
      const fileBuffer = await buildCalendarPlanDocx(finalData);

      // Ключ сховища Supabase Storage не приймає кирилицю ("Invalid key") —
      // українська назва предмету лишається окремо в documents.title для
      // показу користувачу, а сам шлях у сховищі — лише безпечні символи.
      const safeClass = String(finalData.class ?? "").replace(/[^a-zA-Z0-9]/g, "") || "0";
      const fileName = `${userId}/${Date.now()}-${safeClass}.docx`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(fileName, fileBuffer, {
          contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          upsert: false,
        });

      if (uploadError) throw new Error("Не вдалось завантажити файл: " + uploadError.message);

      const { data: publicUrlData } = supabase.storage.from("documents").getPublicUrl(fileName);
      const documentUrl = publicUrlData.publicUrl;

      const { data: document, error: insertError } = await supabase
        .from("documents")
        .insert({
          user_id: userId,
          title: `Календарний план: ${formData.subject} ${formData.class} клас`,
          type: "calendar_plan",
          status: "ready",
          file_url: documentUrl,
          generation_params: formData,
          metadata: { storagePath: fileName },
          credits_used: 1
        })
        .select()
        .single();

      if (insertError) {
        console.error("❌ Помилка збереження в БД:", insertError);
        return NextResponse.json({
          success: true,
          documentUrl,
          creditsRemaining: profile.credits - 1,
          message: "Документ успішно згенеровано!"
        });
      }

      console.log("✅ Документ збережено в БД:", document?.id);

      return NextResponse.json({
        success: true,
        documentId: document?.id,
        documentUrl,
        creditsRemaining: profile.credits - 1,
        message: "Документ успішно згенеровано!"
      });

    } catch (genError: any) {
      console.error("❌ Помилка генерації .docx:", genError);

      await supabase.rpc('add_credits', {
        p_user_id: userId,
        p_amount: 1,
        p_package: 'refund',
        p_price: 0,
        p_description: 'Повернення кредиту через помилку генерації документа'
      });

      console.log("↩️ Кредит повернуто через помилку генерації документа");
      throw genError;
    }

  } catch (error: any) {
    console.error("❌ Загальна помилка генерації:", error);
    return NextResponse.json({ 
      success: false,
      error: error.message || "Невідома помилка генерації"
    }, { status: 500 });
  }
}
