import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');

  // Якщо є помилка від Google
  if (error) {
    console.error('OAuth error:', error);
    return NextResponse.redirect(new URL(`/login?error=${error}`, request.url));
  }

  // Обмін коду на сесію
  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (exchangeError) {
      console.error('Exchange error:', exchangeError);
      return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
    }
  }

  // Успішна автентифікація - перенаправляємо на dashboard
  return NextResponse.redirect(new URL('/dashboard', request.url));
}
