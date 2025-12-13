import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const LIQPAY_PUBLIC_KEY = process.env.LIQPAY_PUBLIC_KEY || '';
const LIQPAY_PRIVATE_KEY = process.env.LIQPAY_PRIVATE_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const { userId, packageId, amount, credits } = await request.json();

    if (!userId || !packageId || !amount || !credits) {
      return NextResponse.json(
        { success: false, error: 'Відсутні обов\'язкові параметри' },
        { status: 400 }
      );
    }

    // Генеруємо унікальний ID замовлення
    const orderId = `order_${Date.now()}_${userId.substring(0, 8)}`;

    // Дані для LiqPay
    const paymentData = {
      version: 3,
      public_key: LIQPAY_PUBLIC_KEY,
      action: 'pay',
      amount: amount,
      currency: 'UAH',
      description: `Поповнення кредитів TeacherPlan: ${credits} кредитів`,
      order_id: orderId,
      result_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
      server_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback`,
      language: 'uk',
      // Додаткові дані для callback
      info: JSON.stringify({
        userId,
        packageId,
        credits,
      }),
    };

    // Кодуємо дані в base64
    const dataBase64 = Buffer.from(JSON.stringify(paymentData)).toString('base64');

    // Генеруємо підпис
    const signString = LIQPAY_PRIVATE_KEY + dataBase64 + LIQPAY_PRIVATE_KEY;
    const signature = crypto
      .createHash('sha1')
      .update(signString)
      .digest('base64');

    return NextResponse.json({
      success: true,
      paymentData: dataBase64,
      signature: signature,
      orderId: orderId,
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Помилка створення платежу' },
      { status: 500 }
    );
  }
}
