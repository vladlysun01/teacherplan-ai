'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  
  const orderId = searchParams.get('order');

  useEffect(() => {
    // Автоматичне перенаправлення через 5 секунд
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-xl border border-green-500/30 rounded-3xl p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-3">
          Оплата успішна!
        </h1>

        {/* Message */}
        <p className="text-slate-400 mb-2">
          Кредити успішно додано на ваш рахунок
        </p>

        {orderId && (
          <p className="text-xs text-slate-500 mb-6">
            Номер замовлення: {orderId}
          </p>
        )}

        {/* Countdown */}
        <div className="mb-6 flex items-center justify-center gap-2 text-slate-400 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Перенаправлення через {countdown} сек...</span>
        </div>

        {/* Button */}
        <button
          onClick={() => router.push('/dashboard')}
          className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300"
        >
          Перейти до Dashboard
        </button>

        {/* Additional link */}
        <a
          href="/dashboard/billing"
          className="block mt-4 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          Переглянути історію платежів →
        </a>
      </div>
    </div>
  );
}
