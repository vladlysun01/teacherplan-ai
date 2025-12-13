import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL || '';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
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

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Не авторизовано' }, { status: 401 });
    }

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

    if (profile) {
      if (!formData.teacherName) formData.teacherName = profile.full_name || '';
      if (!formData.teacherCategory) formData.teacherCategory = profile.teacher_category || '';
      if (!formData.schoolName) formData.schoolName = profile.school_name || '';
    }

    const { data: document, error: insertError } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        title: `Календарний план: ${formData.subject} ${formData.class} клас`,
        type: 'calendar_plan',
        status: 'generating',
        generation_params: formData,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting document:', insertError);
      return NextResponse.json({ error: 'Помилка створення документа' }, { status: 500 });
    }

    try {
      console.log('Calling Apps Script:', APPS_SCRIPT_URL);
      console.log('With data:', formData);

      const appsScriptResponse = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        redirect: 'follow',
      });

      console.log('Apps Script response status:', appsScriptResponse.status);

      const responseText = await appsScriptResponse.text();
      console.log('Apps Script raw response:', responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse:', parseError);
        throw new Error('Apps Script повернув неправильну відповідь');
      }

      if (!result.success) {
        throw new Error(result.error || 'Помилка генерації');
      }

      await supabase
        .from('documents')
        .update({
          status: 'ready',
          file_url: result.documentUrl,
          metadata: { documentUrl: result.documentUrl, generatedAt: new Date().toISOString() },
        })
        .eq('id', document.id);

      return NextResponse.json({
        success: true,
        documentId: document.id,
        documentUrl: result.documentUrl,
        message: 'Документ успішно згенеровано!',
      });
    } catch (appsScriptError) {
      console.error('Apps Script error:', appsScriptError);

      await supabase
        .from('documents')
        .update({ 
          status: 'error',
          metadata: { error: appsScriptError instanceof Error ? appsScriptError.message : 'Unknown' }
        })
        .eq('id', document.id);

      return NextResponse.json(
        { error: appsScriptError instanceof Error ? appsScriptError.message : 'Помилка' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Невідома помилка' },
      { status: 500 }
    );
  }
}