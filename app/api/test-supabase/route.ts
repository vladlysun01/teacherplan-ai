import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('🔍 Testing Supabase connection...');
  console.log('URL:', supabaseUrl);
  console.log('Has Key:', !!supabaseKey);
  console.log('Key length:', supabaseKey?.length);

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({
      success: false,
      error: 'Missing environment variables',
      details: {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey
      }
    });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test connection
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Supabase error:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error
      });
    }

    console.log('✅ Supabase connection successful!');
    
    return NextResponse.json({
      success: true,
      message: 'Supabase connected successfully!',
      config: {
        url: supabaseUrl,
        hasSession: !!data?.session
      }
    });
  } catch (error: any) {
    console.error('💥 Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    });
  }
}
