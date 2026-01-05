'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';
import { Sparkles, ArrowLeft, CreditCard, Lock, CheckCircle } from 'lucide-react';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const packageId = searchParams.get('package');
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const PACKAGES: {
    [key: string]: {
      id: string;
      name: string;
      credits: number;
      price: number;
      savings?: number;
    };
  } = {
    '1': { id: '1', name: '1 кредит', credits: 1, price: 99 },
    '3': { id: '3', name: '3 кредити', credits: 3, price: 249, savings: 48 },
    '10': { id: '10', name: '10 кредитів', credits: 10, price: 599, savings: 391 },
  };

  const selectedPackage = PACKAGES[packageId as keyof typeof PACKAGES];

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/login?redirect=/payment/checkout?package=' + packageId);
      return;
    }
    
    setUser(user);
    setLoading(false);
  };

  const handlePayment = async () => {
    if (!user || !selectedPackage) return;
    
    setProcessing(true);

    try {
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: selectedPackage.id,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (data.success && data.paymentData) {
        // Create form and submit to WayForPay
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.redirectUrl;
        form.style.display = 'none';

        Object.entries(data.paymentData).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = Array.isArray(value) ? value[0] : String(value);
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } else {
        alert('Помилка створення платежу');
        setProcessing(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Помилка створення платежу');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 blur-3xl opacity-50">
            <div className="w-32 h-32 bg-cyan-500 rounded-full animate-pulse"></div>
          </div>
          <div className="relative w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!selectedPackage) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Пакет не знайдено</p>
          <button
            onClick={() => router.push('/dashboard/billing')}
            className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
          >
            Повернутись до вибору пакету
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-20 bg-cyan-500 animate-pulse" style={{animationDuration: '4s'}}></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-10 bg-teal-500 animate-pulse" style={{animationDuration: '6s'}}></div>
      </div>

      {/* Header */}
      <header className="relative border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/50">
              <Sparkles className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">TeacherPlan</h1>
              <p className="text-xs text-slate-400">Безпечна оплата</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-4xl mx-auto px-6 py-12">
        {/* Back Button */}
        <button
          onClick={() => router.push('/dashboard/billing')}
          className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition mb-8"
        >
          <ArrowLeft size={20} />
          <span>Повернутись</span>
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Деталі замовлення</h2>
            
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedPackage.name}</h3>
                  <p className="text-slate-400 text-sm">Кредитів для генерації планів</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-cyan-400">{selectedPackage.price} ₴</div>
                  {selectedPackage.savings && (
                    <div className="text-sm text-green-400">Економія {selectedPackage.savings} ₴</div>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4">
                <div className="flex justify-between text-slate-300 mb-2">
                  <span>Кількість кредитів:</span>
                  <span className="font-bold">{selectedPackage.credits}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Ціна за кредит:</span>
                  <span>{Math.round(selectedPackage.price / selectedPackage.credits)} ₴</span>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-white">Всього до оплати:</span>
                  <span className="text-cyan-400">{selectedPackage.price} ₴</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-slate-300">
                <CheckCircle className="text-green-400 flex-shrink-0" size={20} />
                <span>Миттєве зарахування кредитів</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <CheckCircle className="text-green-400 flex-shrink-0" size={20} />
                <span>Безпечна оплата через WayForPay</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <CheckCircle className="text-green-400 flex-shrink-0" size={20} />
                <span>Підтримка всіх банківських карток</span>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Оплата</h2>
            
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-cyan-500/30 rounded-2xl p-8">
              <div className="flex items-center gap-2 mb-6">
                <Lock className="text-cyan-400" size={20} />
                <span className="text-slate-300 text-sm">Захищене з'єднання</span>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 font-semibold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Обробка...</span>
                  </>
                ) : (
                  <>
                    <CreditCard size={24} />
                    <span>Перейти до оплати</span>
                  </>
                )}
              </button>

              <p className="text-slate-400 text-xs text-center mt-4">
                Після натискання ви будете перенаправлені на безпечну сторінку оплати WayForPay
              </p>

              {/* Payment Methods */}
              <div className="mt-6 pt-6 border-t border-slate-700">
                <p className="text-slate-400 text-sm mb-3 text-center">Приймаємо:</p>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <div className="px-4 py-2 bg-slate-800 rounded-lg text-slate-300 text-sm font-medium">
                    Visa
                  </div>
                  <div className="px-4 py-2 bg-slate-800 rounded-lg text-slate-300 text-sm font-medium">
                    Mastercard
                  </div>
                  <div className="px-4 py-2 bg-slate-800 rounded-lg text-slate-300 text-sm font-medium">
                    Apple Pay
                  </div>
                  <div className="px-4 py-2 bg-slate-800 rounded-lg text-slate-300 text-sm font-medium">
                    Google Pay
                  </div>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
              <p className="text-cyan-400 text-sm">
                <Lock className="inline mr-2" size={16} />
                Всі платежі обробляються через сертифікований PCI DSS платіжний процесор WayForPay
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Suspense wrapper for the page
export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 blur-3xl opacity-50">
            <div className="w-32 h-32 bg-cyan-500 rounded-full animate-pulse"></div>
          </div>
          <div className="relative w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
