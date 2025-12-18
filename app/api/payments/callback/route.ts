import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifySignature, TRANSACTION_STATUS } from '@/lib/wayforpay';

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
      console.error('❌ Payment not found:', orderReference);
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
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

    const { error: updateError } = await supabase
      .from('payments')
      .update(updateData)
      .eq('order_id', orderReference);

    if (updateError) {
      console.error('❌ Failed to update payment:', updateError);
      return NextResponse.json(
        { error: 'Failed to update payment' },
        { status: 500 }
      );
    }

    // If payment approved - add credits to user
    if (transactionStatus === TRANSACTION_STATUS.APPROVED) {
      console.log('💰 Payment approved, adding credits...');

      // Get current credits
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', payment.user_id)
        .single();

      if (profileError) {
        console.error('❌ Failed to get user profile:', profileError);
        return NextResponse.json(
          { error: 'Failed to get user profile' },
          { status: 500 }
        );
      }

      const currentCredits = profile?.credits || 0;
      const newCredits = currentCredits + payment.credits;

      // Update user credits
      const { error: creditsError } = await supabase
        .from('profiles')
        .update({ credits: newCredits })
        .eq('id', payment.user_id);

      if (creditsError) {
        console.error('❌ Failed to add credits:', creditsError);
        return NextResponse.json(
          { error: 'Failed to add credits' },
          { status: 500 }
        );
      }

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
export const runtime = 'edge';
