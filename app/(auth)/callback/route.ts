import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

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
      
      // Redirect to dashboard with success
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // No code or session - redirect to login
  return NextResponse.redirect(new URL('/login', request.url));
}
