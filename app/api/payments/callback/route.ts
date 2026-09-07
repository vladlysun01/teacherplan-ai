import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifySignature, TRANSACTION_STATUS } from '@/lib/wayforpay';

// Server-side Supabase client with SERVICE_ROLE_KEY for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    console.log('📥 WayForPay Callback received:', body);

    // Verify signature
    const isValid = verifySignature(body);
    
    if (!isValid) {
      console.error('❌ Invalid signature from WayForPay');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    console.log('✅ Signature verified');

    const {
      orderReference,
      transactionStatus,
      amount,
      cardPan,
      authCode,
      reasonCode,
      reason,
    } = body;

    // Find payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', orderReference)
      .single();

    if (paymentError || !payment) {
      console.error('❌ Payment not found:', orderReference, paymentError);
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    console.log('💳 Payment found:', {
      user_id: payment.user_id,
      credits: payment.credits,
      amount: payment.amount,
      current_status: payment.status
    });

    // ⚠️ ЗАХИСТ ВІД ПОДВІЙНОГО НАРАХУВАННЯ: WayForPay може надіслати цей
    // callback повторно (мережеві збої, повільна відповідь з нашого боку,
    // або хтось просто повторно надішле раніше перехоплений валідний
    // підписаний запит — сигнатура сама по собі не захищає від replay).
    // Раніше тут кредити нараховувались БЕЗУМОВНО на кожен Approved-виклик:
    // другий виклик з тим самим orderReference додавав ще +N кредитів,
    // хоча оплата була рівно одна. Умовний UPDATE (тільки з 'pending')
    // гарантує, що обробити платіж до 'completed'/'failed' може лише
    // ОДИН виклик — усі наступні побачать affected rows = 0 і вийдуть,
    // не чіпаючи кредити вдруге.
    if (payment.status !== 'pending') {
      console.log('⏭️ Payment already processed, skipping (status:', payment.status, ') — acking anyway so WayForPay stops retrying');
      return NextResponse.json({
        orderReference,
        status: 'accept',
        time: Math.floor(Date.now() / 1000),
      });
    }

    // Update payment status
    const updateData: any = {
      status: transactionStatus === TRANSACTION_STATUS.APPROVED ? 'completed' : 'failed',
      transaction_status: transactionStatus,
      card_pan: cardPan,
      auth_code: authCode,
      reason_code: reasonCode,
      reason: reason,
      updated_at: new Date().toISOString(),
    };

    const { data: updatedRows, error: updateError } = await supabase
      .from('payments')
      .update(updateData)
      .eq('order_id', orderReference)
      .eq('status', 'pending') // атомарна умова — див. коментар вище
      .select('id');

    if (updateError) {
      console.error('❌ Failed to update payment:', updateError);
      return NextResponse.json(
        { error: 'Failed to update payment' },
        { status: 500 }
      );
    }

    if (!updatedRows || updatedRows.length === 0) {
      // Хтось інший (паралельний виклик цього ж вебхука) щойно забрав
      // цей платіж собі між нашим SELECT і цим UPDATE — не наш випадок,
      // кредити вже нараховує той, інший запит.
      console.log('⏭️ Lost the race to process this payment, skipping credit — acking anyway');
      return NextResponse.json({
        orderReference,
        status: 'accept',
        time: Math.floor(Date.now() / 1000),
      });
    }

    console.log('✅ Payment status updated to:', updateData.status);

    // If payment approved - add credits to user
    if (transactionStatus === TRANSACTION_STATUS.APPROVED) {
      console.log('💰 Payment approved, adding credits...');

      // Get current credits
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('credits, id')
        .eq('id', payment.user_id)
        .single();

      if (profileError) {
        console.error('❌ Failed to get user profile:', profileError);
        return NextResponse.json(
          { error: 'Failed to get user profile' },
          { status: 500 }
        );
      }

      console.log('👤 Current user profile:', {
        id: profile?.id,
        current_credits: profile?.credits || 0
      });

      const currentCredits = profile?.credits || 0;
      const newCredits = currentCredits + payment.credits;

      console.log('💎 Credits calculation:', {
        current: currentCredits,
        adding: payment.credits,
        new_total: newCredits
      });

      // Update user credits
      const { data: updatedProfile, error: creditsError } = await supabase
        .from('profiles')
        .update({ credits: newCredits })
        .eq('id', payment.user_id)
        .select('credits')
        .single();

      if (creditsError) {
        console.error('❌ Failed to add credits:', creditsError);
        return NextResponse.json(
          { error: 'Failed to add credits' },
          { status: 500 }
        );
      }

      console.log('✅ Credits updated successfully!', {
        old: currentCredits,
        new: updatedProfile?.credits,
        expected: newCredits
      });

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: payment.user_id,
          amount: payment.credits,
          type: 'purchase',
          description: `Покупка ${payment.credits} ${payment.credits === 1 ? 'кредиту' : 'кредитів'}`,
          price: payment.amount,
          payment_id: payment.id,
          created_at: new Date().toISOString(),
        });

      if (transactionError) {
        console.error('❌ Failed to create transaction:', transactionError);
        // Don't return error - credits already added
      }

      console.log(`✅ Added ${payment.credits} credits to user ${payment.user_id}`);
      console.log(`💳 New balance: ${newCredits} credits`);
    } else {
      console.log(`❌ Payment declined: ${reason} (${reasonCode})`);
    }

    // Return success response to WayForPay
    return NextResponse.json({
      orderReference,
      status: 'accept',
      time: Math.floor(Date.now() / 1000),
    });

  } catch (error: any) {
    console.error('❌ Callback error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Allow WayForPay to send POST requests

