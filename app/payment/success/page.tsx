'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';
import { Sparkles, CheckCircle, ArrowRight, PartyPopper } from 'lucide-react';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    checkUserAndCredits();
    startConfetti();
    
    // Auto-redirect countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const checkUserAndCredits = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/login');
      return;
    }

    setUser(user);

    // Get updated credits
    const { data: profileData } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single();

    setProfile(profileData);
    setLoading(false);
  };

  const startConfetti = () => {
    // Create confetti particles
    const colors = ['#06b6d4', '#14b8a6', '#22d3ee', '#2dd4bf', '#5eead4'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        createConfettiParticle(colors[Math.floor(Math.random() * colors.length)]);
      }, i * 30);
    }
  };

  const createConfettiParticle = (color: string) => {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = color;
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = '-10px';
    confetti.style.opacity = '1';
    confetti.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
    confetti.style.transition = 'all 3s ease-out';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '9999';
    confetti.style.borderRadius = '2px';

    document.body.appendChild(confetti);

    setTimeout(() => {
      confetti.style.top = window.innerHeight + 'px';
      confetti.style.left = (parseFloat(confetti.style.left) + (Math.random() - 0.5) * 200) + 'px';
      confetti.style.opacity = '0';
      confetti.style.transform = 'rotate(' + (Math.random() * 720) + 'deg)';
    }, 10);

    setTimeout(() => {
      document.body.removeChild(confetti);
    }, 3000);
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
              <p className="text-xs text-slate-400">Оплата успішна</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-2xl mx-auto px-6 py-16">
        <div className="text-center">
          {/* Success Icon */}
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-cyan-500/20 blur-3xl rounded-full"></div>
            <div className="relative w-32 h-32 bg-gradient-to-br from-green-500 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/50 animate-bounce" style={{animationDuration: '2s'}}>
              <CheckCircle className="text-white" size={64} />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Оплата успішна!
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            <PartyPopper className="inline mr-2" size={24} />
            Кредити успішно додано до вашого балансу
          </p>

          {/* Credits Display */}
          <div className="inline-block bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-cyan-500 rounded-2xl p-8 mb-12">
            <div className="text-slate-400 text-sm mb-2">Ваш новий баланс</div>
            <div className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              {profile?.credits || 0}
            </div>
            <div className="text-slate-400 text-sm mt-2">
              {profile?.credits === 1 ? 'кредит' : profile?.credits < 5 ? 'кредити' : 'кредитів'}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full max-w-md px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 font-semibold text-lg flex items-center justify-center gap-3 mx-auto"
            >
              <span>Почати генерацію</span>
              <ArrowRight size={24} />
            </button>

            <button
              onClick={() => router.push('/dashboard/billing')}
              className="w-full max-w-md px-8 py-3 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition-all duration-300 font-medium mx-auto block"
            >
              Переглянути баланс
            </button>
          </div>

          {/* Auto-redirect Notice */}
          <p className="mt-8 text-slate-400 text-sm">
            Автоматичне перенаправлення через {countdown} {countdown === 1 ? 'секунду' : 'секунд'}...
          </p>
        </div>

        {/* Info Box */}
        <div className="mt-12 p-6 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <h3 className="text-white font-semibold mb-2">Що далі?</h3>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="text-cyan-400 flex-shrink-0 mt-0.5" size={16} />
              <span>Перейдіть до Dashboard та оберіть предмет і клас</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-cyan-400 flex-shrink-0 mt-0.5" size={16} />
              <span>Заповніть параметри календарного плану</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-cyan-400 flex-shrink-0 mt-0.5" size={16} />
              <span>Натисніть "Генерувати" та отримайте готовий документ за 10 секунд!</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
