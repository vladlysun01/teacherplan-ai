import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const LIQPAY_PRIVATE_KEY = process.env.LIQPAY_PRIVATE_KEY || '';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const data = formData.get('data') as string;
    const signature = formData.get('signature') as string;

    if (!data || !signature) {
      console.error('Missing data or signature');
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Перевіряємо підпис
    const signString = LIQPAY_PRIVATE_KEY + data + LIQPAY_PRIVATE_KEY;
    const expectedSignature = crypto
      .createHash('sha1')
      .update(signString)
      .digest('base64');

    if (signature !== expectedSignature) {
      console.error('Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Декодуємо дані
    const decodedData = JSON.parse(
      Buffer.from(data, 'base64').toString('utf-8')
    );

    console.log('LiqPay callback data:', decodedData);

    // Перевіряємо статус платежу
    if (decodedData.status === 'success' || decodedData.status === 'sandbox') {
      // Отримуємо інформацію про замовлення
      const info = JSON.parse(decodedData.info);
      const { userId, packageId, credits } = info;

      // Додаємо кредити користувачу
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      const { data: result, error } = await supabase.rpc('add_credits', {
        p_user_id: userId,
        p_amount: credits,
        p_package: packageId,
        p_price: decodedData.amount,
        p_description: `Покупка пакету: ${credits} кредитів`,
      });

      if (error) {
        console.error('Error adding credits:', error);
        return NextResponse.json({ error: 'Failed to add credits' }, { status: 500 });
      }

      console.log('✅ Credits added successfully:', result);

      // Зберігаємо інформацію про платіж в окрему таблицю (опціонально)
      await supabase.from('payments').insert({
        user_id: userId,
        order_id: decodedData.order_id,
        amount: decodedData.amount,
        currency: decodedData.currency,
        status: decodedData.status,
        payment_id: decodedData.payment_id,
        credits_added: credits,
        package_id: packageId,
        liqpay_data: decodedData,
      });

      return NextResponse.json({ status: 'ok' });
    } else {
      console.log('Payment not successful. Status:', decodedData.status);
      return NextResponse.json({ status: 'payment_not_successful' });
    }
  } catch (error) {
    console.error('Callback processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
