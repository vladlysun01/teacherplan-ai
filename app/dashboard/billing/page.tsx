'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, Sparkles, TrendingUp, Zap, History, Loader } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { 
  CREDIT_PACKAGES, 
  getUserCredits, 
  getCreditTransactions,
  formatPrice,
  formatDate,
  getTransactionIcon,
  getTransactionColor,
  type CreditTransaction 
} from '@/lib/credits';

export default function BillingPage() {
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState(0);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [user, setUser] = useState<any>(null);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        setLoading(false);
        return;
      }

      setUser(authUser);

      // Завантажити баланс кредитів
      const userCredits = await getUserCredits(authUser.id);
      setCredits(userCredits || 0);

      // Завантажити історію транзакцій
      const userTransactions = await getCreditTransactions(authUser.id, 10);
      setTransactions(userTransactions);

      setLoading(false);
    } catch (error) {
      console.error('Error loading billing data:', error);
      setLoading(false);
    }
  };

  const handlePurchase = async (packageId: string) => {
    if (!user) return;

    setPurchasing(packageId);

    try {
      // TODO: Інтеграція з LiqPay/Stripe
      // Поки що показуємо alert
      const pkg = CREDIT_PACKAGES.find(p => p.id === packageId);
      alert(`Покупка пакету: ${pkg?.name}\nЦіна: ${pkg?.price} грн\n\nІнтеграція платежів буде додана наступним кроком!`);
      
      // Після успішної оплати викликати:
      // await addCredits(user.id, packageId, paymentId);
      // await loadData(); // Оновити баланс
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Помилка при покупці. Спробуйте ще раз.');
    } finally {
      setPurchasing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-3">
          💳 Кредити
        </h1>
        <p className="text-gray-400 text-lg">
          Купуйте кредити для генерації документів
        </p>
      </div>

      {/* Current Balance */}
      <div className="mb-12 bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-3xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-gray-400 text-sm mb-2">Ваш баланс</div>
            <div className="text-6xl font-bold text-white mb-2">
              {credits}
              <span className="text-2xl text-gray-400 ml-3">
                {credits === 1 ? 'кредит' : credits < 5 ? 'кредити' : 'кредитів'}
              </span>
            </div>
            <p className="text-gray-400">
              {credits > 0 
                ? `Ви можете згенерувати ще ${credits} ${credits === 1 ? 'документ' : 'документи'}`
                : 'Купіть кредити щоб продовжити генерацію'
              }
            </p>
          </div>
          <div className="hidden md:block">
            <Sparkles className="w-24 h-24 text-amber-400 opacity-50" />
          </div>
        </div>
      </div>

      {/* Credit Packages */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Пакети кредитів</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CREDIT_PACKAGES.map((pkg, index) => (
            <div
              key={pkg.id}
              className={`
                relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8
                hover:bg-white/10 hover:border-white/20 transition-all duration-300
                ${pkg.popular ? 'ring-2 ring-amber-500 scale-105' : ''}
              `}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    🔥 Популярне
                  </div>
                </div>
              )}

              {/* Icon */}
              <div className="mb-6">
                {index === 0 && <CreditCard className="w-12 h-12 text-gray-400" />}
                {index === 1 && <TrendingUp className="w-12 h-12 text-amber-400" />}
                {index === 2 && <Zap className="w-12 h-12 text-orange-400" />}
              </div>

              {/* Credits */}
              <div className="mb-4">
                <div className="text-5xl font-bold text-white mb-2">
                  {pkg.credits}
                </div>
                <div className="text-gray-400 text-sm">
                  {pkg.credits === 1 ? 'документ' : 'документи'}
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="text-3xl font-bold text-white mb-1">
                  {pkg.price} ₴
                </div>
                {pkg.savings && (
                  <div className="text-green-400 text-sm font-medium">
                    {pkg.savings}
                  </div>
                )}
              </div>

              {/* Price per document */}
              <div className="mb-6 text-gray-400 text-sm">
                {Math.round(pkg.price / pkg.credits)} ₴ за документ
              </div>

              {/* Buy Button */}
              <button
                onClick={() => handlePurchase(pkg.id)}
                disabled={purchasing !== null}
                className={`
                  w-full py-4 rounded-xl font-semibold transition-all duration-300
                  ${pkg.popular 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:shadow-amber-500/50' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                  }
                  ${purchasing === pkg.id ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {purchasing === pkg.id ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader className="w-5 h-5 animate-spin" />
                    Обробка...
                  </span>
                ) : (
                  'Купити'
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      {transactions.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <History className="w-6 h-6 text-gray-400" />
            <h2 className="text-2xl font-bold text-white">Історія транзакцій</h2>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
            <div className="divide-y divide-white/10">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="p-6 hover:bg-white/5 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <div className="text-white font-medium mb-1">
                          {transaction.description || 'Транзакція'}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {formatDate(transaction.created_at)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-xl font-bold ${getTransactionColor(transaction.type)}`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                      </div>
                      {transaction.price && (
                        <div className="text-gray-400 text-sm">
                          {formatPrice(transaction.price)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-12 bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-3">
          ℹ️ Як працюють кредити?
        </h3>
        <ul className="text-gray-300 space-y-2">
          <li>• 1 кредит = 1 згенерований документ (календарний або поурочний план)</li>
          <li>• Кредити не згорають і діють безстроково</li>
          <li>• Нові користувачі отримують 1 безкоштовний кредит</li>
          <li>• Чим більший пакет - тим вигідніша ціна за документ</li>
        </ul>
      </div>
    </div>
  );
}
