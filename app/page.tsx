"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, FileText, Zap, Clock, CheckCircle, ArrowRight, Stars, BookOpen, Calendar, Download } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    setLoading(false);
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
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full blur-3xl opacity-5 bg-blue-500 animate-pulse" style={{animationDuration: '8s'}}></div>
      </div>

      {/* Header - MOBILE FIXED */}
      <header className="relative border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/50">
                <Sparkles className="text-white" size={16} />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">TeacherPlan</h1>
                <p className="text-xs text-slate-400 hidden sm:block">AI Platform</p>
              </div>
            </div>

            {/* Auth Buttons - MOBILE OPTIMIZED */}
            <div className="flex items-center gap-2 sm:gap-4">
              {user ? (
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 font-medium text-sm sm:text-base"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => router.push('/login')}
                    className="px-3 sm:px-6 py-2 text-slate-300 hover:text-white transition-colors text-sm sm:text-base"
                  >
                    Увійти
                  </button>
                  <button
                    onClick={() => router.push('/register')}
                    className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 font-medium text-sm sm:text-base whitespace-nowrap"
                  >
                    Реєстрація
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="relative">
        {/* Hero Section - MOBILE OPTIMIZED */}
        <section className="pt-10 sm:pt-20 pb-16 sm:pb-32 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-6 sm:mb-8">
                <Stars className="text-cyan-400" size={14} />
                <span className="text-cyan-400 text-xs sm:text-sm font-medium">AI-платформа для вчителів</span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
                <span className="text-white">Генеруйте</span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  календарні плани
                </span>
                <br />
                <span className="text-white">за 10 секунд</span>
              </h1>

              <p className="text-base sm:text-xl text-slate-400 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4">
                Забудьте про години рутинної роботи. TeacherPlan автоматично створює плани відповідно до програми МОН України.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
                <button
                  onClick={() => router.push('/register')}
                  className="w-full sm:w-auto group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 font-semibold text-base sm:text-lg flex items-center justify-center gap-2"
                >
                  Спробувати безкоштовно
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                </button>
                <button
                  onClick={() => router.push('/login')}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-slate-800/50 border border-slate-700 text-white rounded-xl hover:bg-slate-700/50 transition-all duration-300 font-semibold text-base sm:text-lg"
                >
                  Вже є акаунт
                </button>
              </div>

              <p className="mt-4 sm:mt-6 text-slate-500 text-sm">
                🎁 1 безкоштовний кредит при реєстрації
              </p>
            </div>

            {/* Demo Preview - HIDDEN ON MOBILE */}
            <div className="mt-12 sm:mt-20 max-w-5xl mx-auto hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 blur-3xl"></div>
                <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl overflow-hidden">
                  {/* Window Controls */}
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="ml-4 text-slate-400 text-sm font-mono">TeacherPlan AI Generator</div>
                  </div>

                  {/* AI Generation Animation */}
                  <div className="space-y-4">
                    {/* Status Bar */}
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-cyan-500/10 to-transparent rounded-lg border border-cyan-500/20">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                      <span className="text-cyan-400 text-sm font-mono">Генерується план...</span>
                    </div>

                    {/* Form Fields Animation */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-700/50 rounded w-20 animate-pulse"></div>
                        <div className="h-10 bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-center px-3">
                          <span className="text-slate-500 text-sm">Українська мова</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-700/50 rounded w-16 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="h-10 bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-center px-3">
                          <span className="text-slate-500 text-sm">5 клас</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-700/50 rounded w-24 animate-pulse" style={{animationDelay: '0.4s'}}></div>
                        <div className="h-10 bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-center px-3">
                          <span className="text-slate-500 text-sm">I семестр</span>
                        </div>
                      </div>
                    </div>

                    {/* Generated Content Preview */}
                    <div className="space-y-2 p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-4 bg-cyan-400 rounded"></div>
                        <span className="text-white font-semibold text-sm">Календарно-тематичний план</span>
                      </div>
                      {/* Table Preview */}
                      <div className="space-y-2">
                        <div className="grid grid-cols-5 gap-2 text-xs">
                          <div className="text-slate-300 font-mono">1</div>
                          <div className="col-span-2 text-slate-300">Мова як суспільне явище</div>
                          <div className="text-slate-400 font-mono">03.09</div>
                          <div className="text-slate-300 font-mono">1</div>
                        </div>
                      </div>
                    </div>

                    {/* Success Message */}
                    <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <CheckCircle className="text-green-400" size={20} />
                      <span className="text-green-400 text-sm font-medium">План успішно згенеровано</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Time & Cost Comparison - MOBILE OPTIMIZED */}
        <section className="py-12 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-slate-900/50 to-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
              {/* Time Saving */}
              <div className="relative group">
                <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 hover:border-red-500/50 transition-all duration-300">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl flex items-center justify-center">
                      <Clock className="text-red-400" size={24} />
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-bold text-white">4-6 годин</div>
                      <div className="text-slate-400 text-sm">вручну</div>
                    </div>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                    Зазвичай вчитель витрачає <span className="text-red-400 font-semibold">4-6 годин</span> на написання плану.
                  </p>
                </div>
              </div>

              {/* AI Speed */}
              <div className="relative group">
                <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-cyan-500 rounded-2xl p-6 sm:p-8">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-cyan-500/30 to-teal-500/30 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/50">
                      <Zap className="text-cyan-400" size={24} />
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">10 секунд</div>
                      <div className="text-slate-400 text-sm">з AI</div>
                    </div>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                    TeacherPlan створює повний план всього за <span className="text-cyan-400 font-semibold">10 секунд</span>.
                  </p>
                </div>
              </div>
            </div>

            {/* Coffee Price - MOBILE COMPACT */}
            <div className="mt-8 sm:mt-12 max-w-3xl mx-auto">
              <div className="relative bg-slate-900/50 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-6 sm:p-10">
                <div className="text-center">
                  <div className="text-4xl sm:text-7xl mb-4 sm:mb-6">☕</div>
                  <h3 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
                    План за ціною чашки кави
                  </h3>
                  <p className="text-lg sm:text-xl text-slate-300">
                    А заощаджений час? <span className="text-cyan-400 font-bold">Безцінний</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features - MOBILE OPTIMIZED */}
        <section className="py-12 sm:py-20 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
                Чому обирають TeacherPlan?
              </h2>
              <p className="text-lg sm:text-xl text-slate-400">
                Все для швидкої підготовки
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Feature Cards */}
              {[
                { icon: Zap, title: "Швидкість", desc: "Генерація займає 5-15 секунд" },
                { icon: CheckCircle, title: "Відповідність МОН", desc: "100% відповідність програмам МОН" },
                { icon: Download, title: "Google Docs", desc: "Автоматичний експорт" },
                { icon: BookOpen, title: "8 предметів", desc: "Всі основні предмети" },
                { icon: Calendar, title: "Гнучкість", desc: "Налаштуйте під себе" },
                { icon: FileText, title: "Історія", desc: "Всі документи збережені" },
              ].map((feature, i) => (
                <div key={i} className="relative group">
                  <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 hover:border-cyan-500/50 transition-all">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                      <feature.icon className="text-cyan-400" size={24} />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{feature.title}</h3>
                    <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works - MOBILE OPTIMIZED */}
        <section className="py-12 sm:py-20 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
                Як це працює?
              </h2>
              <p className="text-lg sm:text-xl text-slate-400">
                3 кроки до готового плану
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
              {[
                { num: "1", title: "Заповніть форму", desc: "Оберіть предмет, клас, програму" },
                { num: "2", title: "Згенеруйте", desc: "Зачекайте 5-15 секунд" },
                { num: "3", title: "Використовуйте", desc: "Документ у Google Drive" },
              ].map((step, i) => (
                <div key={i} className="relative">
                  <div className="absolute -top-4 left-6 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg shadow-cyan-500/50">
                    {step.num}
                  </div>
                  <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 pt-10 sm:pt-12">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{step.title}</h3>
                    <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing - MOBILE OPTIMIZED */}
        <section className="py-12 sm:py-20 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
                Доступні ціни
              </h2>
              <p className="text-lg sm:text-xl text-slate-400">
                Обирайте пакет
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
              {[
                { docs: "1", price: "99", credits: "1 кредит", popular: false },
                { docs: "3", price: "249", credits: "3 кредити", popular: true, save: "Економія 48 грн" },
                { docs: "10", price: "599", credits: "10 кредитів", popular: false, save: "Економія 391 грн" },
              ].map((pkg, i) => (
                <div key={i} className={`relative ${pkg.popular ? 'scale-100 sm:scale-105' : ''}`}>
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xs sm:text-sm font-bold rounded-full">
                      Популярне
                    </div>
                  )}
                  <div className={`${pkg.popular ? 'bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-cyan-500' : 'bg-slate-900/50 border border-slate-800'} backdrop-blur-xl rounded-2xl p-6 sm:p-8`}>
                    <div className="text-center mb-6 sm:mb-8">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{pkg.docs} документ{pkg.docs !== "1" ? "и" : ""}</h3>
                      <div className="text-3xl sm:text-4xl font-bold text-white mb-2">{pkg.price} ₴</div>
                      <p className="text-slate-400 text-sm">{pkg.credits}</p>
                      {pkg.save && <p className="text-green-400 text-xs sm:text-sm mt-2">{pkg.save}</p>}
                    </div>
                    <ul className="space-y-2 sm:space-y-3">
                      <li className="flex items-center gap-2 text-slate-300 text-sm sm:text-base">
                        <CheckCircle className="text-cyan-400 flex-shrink-0" size={18} />
                        <span>Всі предмети</span>
                      </li>
                      <li className="flex items-center gap-2 text-slate-300 text-sm sm:text-base">
                        <CheckCircle className="text-cyan-400 flex-shrink-0" size={18} />
                        <span>Google Docs експорт</span>
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA - MOBILE OPTIMIZED */}
        <section className="py-12 sm:py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-slate-900/50 backdrop-blur-xl border border-cyan-500/30 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
                Готові спробувати?
              </h2>
              <p className="text-lg sm:text-xl text-slate-400 mb-6 sm:mb-8">
                1 безкоштовний кредит при реєстрації
              </p>
              <button
                onClick={() => router.push('/register')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl hover:shadow-2xl hover:shadow-cyan-500/50 transition-all font-semibold text-base sm:text-lg"
              >
                Почати безкоштовно
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - MOBILE OPTIMIZED */}
      <footer className="relative border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-xl mt-12 sm:mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 mb-6">
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-3 mb-2 justify-center sm:justify-start">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="text-white" size={18} />
                </div>
                <span className="text-white font-bold text-lg">TeacherPlan</span>
              </div>
              <p className="text-slate-400 text-sm">
                AI-платформа для вчителів
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:flex gap-6 sm:gap-8 text-center sm:text-left">
              <div>
                <h4 className="text-white font-semibold mb-3 text-sm">Компанія</h4>
                <div className="space-y-2">
                  <Link href="/about" className="block text-slate-400 hover:text-cyan-400 transition-colors text-xs sm:text-sm">
                    Про нас
                  </Link>
                  <Link href="/terms" className="block text-slate-400 hover:text-cyan-400 transition-colors text-xs sm:text-sm">
                    Умови
                  </Link>
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-3 text-sm">Юридичне</h4>
                <div className="space-y-2">
                  <Link href="/privacy" className="block text-slate-400 hover:text-cyan-400 transition-colors text-xs sm:text-sm">
                    Конфіденційність
                  </Link>
                  <Link href="/refund" className="block text-slate-400 hover:text-cyan-400 transition-colors text-xs sm:text-sm">
                    Повернення
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-slate-800">
            <p className="text-slate-400 text-xs sm:text-sm text-center">
              © 2024 TeacherPlan. Всі права захищені.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
