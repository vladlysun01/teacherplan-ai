import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const orderReference = formData.get('orderReference') as string;
    const transactionStatus = formData.get('transactionStatus') as string;
    
    console.log('✅ Success callback from WayForPay');
    console.log('Order:', orderReference);
    console.log('Status:', transactionStatus);

    // Перенаправляємо на сторінку успіху
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success?order=${orderReference}`,
      { status: 303 }
    );
  } catch (error) {
    console.error('❌ Success callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success`,
      { status: 303 }
    );
  }
}

// Також дозволяємо GET для прямого доступу
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const order = searchParams.get('order') || searchParams.get('orderReference');
  
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success${order ? `?order=${order}` : ''}`,  // ✅ Виправлено
    { status: 303 }
  );
}