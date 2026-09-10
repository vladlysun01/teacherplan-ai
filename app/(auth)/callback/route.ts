import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { attributeReferral } from '@/lib/referrals';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/dashboard';

  if (code) {
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
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            } catch (error) {
              // Ignore errors from setting cookies in Server Component
              console.log('Cookie setting error (safe to ignore):', error);
            }
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('❌ Error exchanging code for session:', error);
      return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
    }

    if (data.session) {
      console.log('✅ Session created successfully for user:', data.session.user.email);

      // Реферальна атрибуція для Google-входу. На відміну від
      // email/password реєстрації (яка йде через окремий HTTP-виклик
      // /api/referrals/attribute), тут уже є серверний доступ до cookies —
      // читаємо tp_ref напряму й пишемо service-role клієнтом. Спрацьовує
      // так само і для нового, і для повторного Google-входу: якщо
      // referred_by вже проставлено, attributeReferral() просто нічого
      // не змінить (перша атрибуція виграє).
      const refCode = cookieStore.get('tp_ref')?.value;
      if (refCode) {
        try {
          const admin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            { auth: { autoRefreshToken: false, persistSession: false } }
          );
          await attributeReferral(admin, data.session.user.id, refCode);
        } catch (err) {
          console.error('Referral attribution failed:', err);
        }
      }

      // Redirect to dashboard with success
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // No code or session - redirect to login
  return NextResponse.redirect(new URL('/login', request.url));
}
