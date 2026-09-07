'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CreditCard, Sparkles, TrendingUp, Zap, History, Loader } from 'lucide-react';
import { createClient } from '@/lib/supabase-browser';
import { pluralUk } from '@/lib/credits';

// Updated credit packages with correct prices
const CREDIT_PACKAGES = [
  {
    id: '1',
    name: '1 кредит',
    credits: 1,
    price: 99,
    icon: CreditCard,
    popular: false,
  },
  {
    id: '3',
    name: '3 кредити',
    credits: 3,
    price: 249,
    savings: 'Економія 48 ₴',
    icon: TrendingUp,
    popular: true,
  },
  {
    id: '10',
    name: '10 кредитів',
    credits: 10,
    price: 599,
    savings: 'Економія 391 ₴',
    icon: Zap,
    popular: false,
  },
];

export default function BillingPage() {
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        setLoading(false);
        return;
      }

      setUser(authUser);

      // Load user credits
      const { data: profile } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', authUser.id)
        .single();

      setCredits(profile?.credits || 0);
      setLoading(false);
    } catch (error) {
      console.error('Error loading billing data:', error);
      setLoading(false);
    }
  };

  const handlePurchase = async (packageId: string) => {
    if (!user) {
      alert('Будь ласка, увійдіть в систему');
      return;
    }

    // Redirect to checkout page
    window.location.href = `/payment/checkout?package=${packageId}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      {/* Hidden form for WayForPay redirect */}
      <form ref={formRef} method="POST" style={{ display: 'none' }} />

      {/* Header */}
      <div className="mb-4 sm:mb-8">
        <h1 className="text-xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
          💳 Кредити
        </h1>
        <p className="text-xs sm:text-base text-gray-400">
          Купуйте кредити для генерації документів
        </p>
      </div>

      {/* Current Balance */}
      <div className="mb-4 sm:mb-8 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-gray-400 text-xs mb-1">Ваш баланс</div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl sm:text-5xl font-bold text-white">{credits}</span>
              <span className="text-sm sm:text-lg text-gray-400">
                {pluralUk(credits, 'кредит', 'кредити', 'кредитів')}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400">
              {credits > 0 ? `${credits} ${pluralUk(credits, 'документ', 'документи', 'документів')}` : 'Купіть кредити'}
            </p>
          </div>
          <Sparkles className="w-12 sm:w-16 h-12 sm:h-16 text-cyan-400 opacity-30 flex-shrink-0" />
        </div>
      </div>

      {/* Credit Packages */}
      <div className="mb-6 sm:mb-10">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Пакети кредитів</h2>
        
        <div className="space-y-2 sm:space-y-3">
          {CREDIT_PACKAGES.map((pkg, index) => {
            const IconComponent = pkg.icon;
            
            return (
              <div
                key={pkg.id}
                className={`
                  relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4
                  hover:bg-white/10 hover:border-white/20 transition-all duration-300
                  ${pkg.popular ? 'ring-1 sm:ring-2 ring-cyan-500' : ''}
                `}
              >
                {pkg.popular && (
                  <div className="absolute -top-2 left-3 sm:left-4">
                    <div className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      🔥 Популярне
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" />
                  </div>

                  {/* Credits */}
                  <div className="flex-shrink-0">
                    <div className="text-2xl sm:text-3xl font-bold text-white leading-none">
                      {pkg.credits}
                    </div>
                    <div className="text-gray-400 text-xs mt-0.5">
                      {pluralUk(pkg.credits, 'документ', 'документи', 'документів')}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="hidden sm:block w-px h-12 bg-white/10"></div>

                  {/* Price Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-xl sm:text-2xl font-bold text-white leading-none mb-0.5">
                      {pkg.price} ₴
                    </div>
                    <div className="text-xs text-gray-400">
                      {Math.round(pkg.price / pkg.credits)} ₴ за документ
                    </div>
                    {pkg.savings && (
                      <div className="text-xs text-green-400 font-medium mt-0.5">
                        {pkg.savings}
                      </div>
                    )}
                  </div>

                  {/* Buy Button */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handlePurchase(pkg.id)}
                      disabled={purchasing !== null}
                      className={`
                        px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold transition-all duration-300 text-xs sm:text-sm whitespace-nowrap
                        ${pkg.popular 
                          ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:shadow-lg hover:shadow-cyan-500/50' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                        }
                        ${purchasing === pkg.id ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      {purchasing === pkg.id ? (
                        <span className="flex items-center gap-1.5">
                          <Loader className="w-3 h-3 animate-spin" />
                          <span className="hidden sm:inline">Обробка...</span>
                        </span>
                      ) : (
                        'Купити'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-6 sm:mt-8 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 sm:p-4">
        <h3 className="text-sm sm:text-base font-semibold text-white mb-2">
          ℹ️ Як працюють кредити?
        </h3>
        <ul className="text-xs sm:text-sm text-gray-300 space-y-1">
          <li>• 1 кредит = 1 документ</li>
          <li>• Кредити не згорають</li>
          <li>• Новим 1 кредит безкоштовно</li>
          <li>• Безпечна оплата через WayForPay</li>
        </ul>
      </div>
    </div>
  );
}
