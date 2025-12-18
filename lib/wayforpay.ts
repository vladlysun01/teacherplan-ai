// ⚠️ ВАЖЛИВО: Цей файл ТІЛЬКИ для server-side!
// Next.js автоматично виключить його з client bundle
import 'server-only';
import crypto from 'crypto';

// WayForPay Configuration
export const WAYFORPAY_CONFIG = {
  merchantAccount: process.env.WAYFORPAY_MERCHANT_ACCOUNT || '',
  secretKey: process.env.WAYFORPAY_SECRET_KEY || '',
  serviceUrl: 'https://secure.wayforpay.com/pay',
};

// Credit Packages
export const CREDIT_PACKAGES = {
  '1': {
    id: '1',
    name: '1 кредит',
    credits: 1,
    price: 99,
  },
  '3': {
    id: '3',
    name: '3 кредити',
    credits: 3,
    price: 249,
    savings: 'Економія 48 ₴',
    popular: true,
  },
  '10': {
    id: '10',
    name: '10 кредитів',
    credits: 10,
    price: 599,
    savings: 'Економія 391 ₴',
  },
};

// Generate WayForPay signature (SERVER ONLY)
export function generateSignature(data: string[]): string {
  const { secretKey } = WAYFORPAY_CONFIG;
  const signatureString = data.join(';');
  
  return crypto
    .createHmac('md5', secretKey)
    .update(signatureString)
    .digest('hex');
}

// Verify WayForPay signature (SERVER ONLY)
export function verifySignature(responseData: any): boolean {
  const { secretKey } = WAYFORPAY_CONFIG;
  
  const signatureFields = [
    responseData.merchantAccount,
    responseData.orderReference,
    responseData.amount,
    responseData.currency,
    responseData.authCode,
    responseData.cardPan,
    responseData.transactionStatus,
    responseData.reasonCode,
  ];
  
  const signatureString = signatureFields.join(';');
  const calculatedSignature = crypto
    .createHmac('md5', secretKey)
    .update(signatureString)
    .digest('hex');
  
  return calculatedSignature === responseData.merchantSignature;
}

// Create payment data for WayForPay (SERVER ONLY)
export interface CreatePaymentParams {
  orderId: string;
  amount: number;
  productName: string;
  productCount: number;
  clientEmail: string;
  clientName?: string;
}

export function createPaymentData(params: CreatePaymentParams) {
  const {
    orderId,
    amount,
    productName,
    productCount,
    clientEmail,
    clientName = 'Користувач',
  } = params;

  const { merchantAccount } = WAYFORPAY_CONFIG;
  const orderDate = Math.floor(Date.now() / 1000);
  
  const paymentData = {
    merchantAccount,
    merchantDomainName: 'teacher-plan-ai.site',
    orderReference: orderId,
    orderDate: orderDate,
    amount: amount,
    currency: 'UAH',
    productName: [productName],
    productCount: [productCount],
    productPrice: [amount],
    clientAccountId: clientEmail,
    clientEmail: clientEmail,
    clientFirstName: clientName,
    clientLastName: '',
    language: 'UA',
    serviceUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://teacher-plan-ai.site'}/api/payments/callback`,
    returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://teacher-plan-ai.site'}/payment/success`,
  };

  // Generate signature
  const signatureFields = [
    merchantAccount,
    'teacher-plan-ai.site',
    orderId,
    orderDate.toString(),
    amount.toString(),
    'UAH',
    productName,
    productCount.toString(),
    amount.toString(),
  ];

  const merchantSignature = generateSignature(signatureFields);

  return {
    merchantAccount: paymentData.merchantAccount,
    merchantDomainName: paymentData.merchantDomainName,
    orderReference: paymentData.orderReference,
    orderDate: paymentData.orderDate,
    amount: paymentData.amount,
    currency: paymentData.currency,
    productName: paymentData.productName,
    productCount: paymentData.productCount,
    productPrice: paymentData.productPrice,
    clientAccountId: paymentData.clientAccountId,
    clientEmail: paymentData.clientEmail,
    clientFirstName: paymentData.clientFirstName,
    clientLastName: paymentData.clientLastName,
    language: paymentData.language,
    serviceUrl: paymentData.serviceUrl,
    returnUrl: paymentData.returnUrl,
    merchantSignature,
  };
}

// Get package by ID (SAFE FOR CLIENT)
export function getPackageById(packageId: string) {
  return CREDIT_PACKAGES[packageId as keyof typeof CREDIT_PACKAGES];
}

// Generate unique order ID (SAFE FOR CLIENT)
export function generateOrderId(userId: string, packageId: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `TP_${userId.substring(0, 8)}_${packageId}K_${timestamp}_${random}`;
}

// WayForPay Transaction Statuses
export const TRANSACTION_STATUS = {
  APPROVED: 'Approved',
  DECLINED: 'Declined',
  EXPIRED: 'Expired',
  PENDING: 'Pending',
  REFUNDED: 'Refunded',
} as const;

export type TransactionStatus = typeof TRANSACTION_STATUS[keyof typeof TRANSACTION_STATUS];
