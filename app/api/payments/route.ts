import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const PACKAGES = {
  '1': { id: '1', name: '1 кредит', credits: 1, price: 99 },
  '3': { id: '3', name: '3 кредити', credits: 3, price: 249 },
  '10': { id: '10', name: '10 кредитів', credits: 10, price: 599 },
};

async function generateSignature(fields: string[]): Promise<string> {
  const crypto = await import('crypto');
  const secret = process.env.WAYFORPAY_SECRET_KEY || '';
  const string = fields.join(';');
  
  console.log('🔐 Signature fields:', fields);
  console.log('📝 String to sign:', string);
  
  const signature = crypto.createHmac('md5', secret).update(string).digest('hex');
  
  console.log('✅ Generated signature:', signature);
  
  return signature;
}

export async function POST(req: Request) {
  try {
    const { packageId, userId } = await req.json();
    
    console.log('💳 Payment request:', { packageId, userId });

    if (!packageId || !userId) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    const pkg = PACKAGES[packageId as keyof typeof PACKAGES];
    if (!pkg) {
      return NextResponse.json({ error: 'Invalid package' }, { status: 400 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', userId)
      .single();

    const email = profile?.email || 'user@teacherplan.com';
    const name = profile?.full_name || 'User';

    const orderId = `TP_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const orderDate = Math.floor(Date.now() / 1000);
    const merchant = process.env.WAYFORPAY_MERCHANT_ACCOUNT || 'test_merch_n1';
    const domain = 'www.teacher-plan-ai.site';

    console.log('📦 Package:', pkg);
    console.log('👤 User:', { email, name });
    console.log('🆔 Order:', orderId);
    console.log('🏪 Merchant:', merchant);

    // Save payment
    try {
      await supabase.from('payments').insert({
        user_id: userId,
        order_id: orderId,
        package_id: packageId,
        amount: pkg.price,
        credits: pkg.credits,
        status: 'pending',
        payment_method: 'wayforpay',
        created_at: new Date().toISOString(),
      });
      console.log('✅ Payment saved to DB');
    } catch (e) {
      console.error('⚠️ DB error:', e);
    }

    // ВАЖЛИВО: Порядок полів для підпису!
    const signatureFields = [
      merchant,             // merchantAccount
      domain,               // merchantDomainName  
      orderId,              // orderReference
      orderDate.toString(), // orderDate
      pkg.price.toString(), // amount
      'UAH',                // currency
      pkg.name,             // productName[0]
      '1',                  // productCount[0]
      pkg.price.toString()  // productPrice[0]
    ];

    const signature = await generateSignature(signatureFields);

    const paymentData = {
      merchantAccount: merchant,
      merchantDomainName: domain,
      orderReference: orderId,
      orderDate: orderDate,
      amount: pkg.price,
      currency: 'UAH',
      productName: [pkg.name],
      productCount: [1],
      productPrice: [pkg.price],
      clientEmail: email,
      clientFirstName: name,
      clientLastName: '',
      clientPhone: '380000000000', // Required for Apple Pay
      language: 'UA',
      returnUrl: 'https://www.teacher-plan-ai.site/payment/success',
      serviceUrl: 'https://www.teacher-plan-ai.site/api/payments/callback',
      merchantSignature: signature,
    };

    console.log('✅ Payment data ready');
    console.log('📤 Sending to WayForPay...');

    return NextResponse.json({
      success: true,
      orderId,
      paymentData,
      redirectUrl: 'https://secure.wayforpay.com/pay',
    });

  } catch (error: any) {
    console.error('❌ Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}