import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { generateCalendarPlan, generateHTML, CalendarPlanSettings } from '@/lib/generation/calendar-plan';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings: CalendarPlanSettings = await request.json();

    // Перевірка ліміту для free tier
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier, documents_this_month')
      .eq('id', session.user.id)
      .single();

    if (profile?.subscription_tier === 'free' && (profile.documents_this_month || 0) >= 3) {
      return NextResponse.json(
        { error: 'Ліміт безкоштовних документів вичерпано. Оновіть підписку.' },
        { status: 403 }
      );
    }

    // Створюємо запис документа
    const { data: document, error: docError } = await supabase
      .from('documents')
      .insert({
        user_id: session.user.id,
        title: `Календарний план ${settings.class} клас ${settings.subject}`,
        type: 'calendar_plan',
        settings: settings,
        status: 'generating'
      })
      .select()
      .single();

    if (docError) {
      return NextResponse.json({ error: docError.message }, { status: 500 });
    }

    // Генерація
    const result = await generateCalendarPlan(settings);

    if (!result.success) {
      await supabase
        .from('documents')
        .update({ 
          status: 'error', 
          error_message: result.error 
        })
        .eq('id', document.id);

      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // Генерація HTML
    const html = generateHTML(result.lessons!, settings);

    // Збереження HTML як файл
    const fileName = `${document.id}.html`;
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('documents')
      .upload(`${session.user.id}/${fileName}`, html, {
        contentType: 'text/html',
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Отримання публічного URL
    const { data: urlData } = supabase
      .storage
      .from('documents')
      .getPublicUrl(`${session.user.id}/${fileName}`);

    // Оновлення документа
    await supabase
      .from('documents')
      .update({ 
        status: 'ready',
        file_url: urlData.publicUrl,
        file_size_mb: html.length / (1024 * 1024)
      })
      .eq('id', document.id);

    // Оновлення лічільника
    if (profile?.subscription_tier === 'free') {
      await supabase
        .from('profiles')
        .update({ 
          documents_this_month: (profile.documents_this_month || 0) + 1 
        })
        .eq('id', session.user.id);
    }

    return NextResponse.json({ 
      success: true,
      documentId: document.id,
      fileUrl: urlData.publicUrl
    });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}