import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { 
  createPaymentData, 
  getPackageById, 
  generateOrderId,
  CreatePaymentParams 
} from '@/lib/wayforpay';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { packageId, userId } = body;

    // Validate input
    if (!packageId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: packageId or userId' },
        { status: 400 }
      );
    }

    // Get package details
    const pkg = getPackageById(packageId);
    if (!pkg) {
      return NextResponse.json(
        { error: 'Invalid package ID' },
        { status: 400 }
      );
    }

    // Get user details from Supabase
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate unique order ID
    const orderId = generateOrderId(userId, packageId);

    // Create payment record in database
    const { error: dbError } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        order_id: orderId,
        package_id: packageId,
        amount: pkg.price,
        credits: pkg.credits,
        status: 'pending',
        payment_method: 'wayforpay',
        created_at: new Date().toISOString(),
      });

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to create payment record' },
        { status: 500 }
      );
    }

    // Create payment data for WayForPay
    const paymentParams: CreatePaymentParams = {
      orderId,
      amount: pkg.price,
      productName: pkg.name,
      productCount: 1,
      clientEmail: profile.email || 'user@teacherplan.com',
      clientName: profile.full_name || 'Користувач',
    };

    const paymentData = createPaymentData(paymentParams);

    // Return payment data
    return NextResponse.json({
      success: true,
      orderId,
      paymentData,
      redirectUrl: 'https://secure.wayforpay.com/pay',
    });

  } catch (error: any) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
