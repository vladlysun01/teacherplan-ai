import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, FileText, Zap, Clock, CheckCircle, ArrowRight, Stars, BookOpen, Calendar, Download } from "lucide-react";
import AuthHeaderButtons from "@/components/landing/AuthHeaderButtons";

export const metadata: Metadata = {
  title: "TeacherPlan AI — календарно-тематичні плани за 10 секунд",
  description:
    "Генеруйте календарно-тематичні та поурочні плани для 8+ предметів відповідно до програм МОН України за 10 секунд замість 4-6 годин. Автоматичний експорт у Google Docs.",
  alternates: { canonical: "/" },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-20 bg-cyan-500 animate-pulse" style={{animationDuration: '4s'}}></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-10 bg-teal-500 animate-pulse" style={{animationDuration: '6s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full blur-3xl opacity-5 bg-blue-500 animate-pulse" style={{animationDuration: '8s'}}></div>
      </div>

      {/* Header */}
      <header className="relative border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/50">
                <Sparkles className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">TeacherPlan</h1>
                <p className="text-xs text-slate-400">AI Platform</p>
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              <AuthHeaderButtons />
            </div>
          </div>
        </div>
      </header>

      <main className="relative">
        {/* Hero Section */}
        <section className="pt-20 pb-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-8">
                <Stars className="text-cyan-400" size={16} />
                <span className="text-cyan-400 text-sm font-medium">AI-платформа для вчителів України</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="text-white">Генеруйте</span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  календарні плани
                </span>
                <br />
                <span className="text-white">за 10 секунд</span>
              </h1>

              <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                Забудьте про години рутинної роботи. TeacherPlan автоматично створює календарно-тематичні 
                та поурочні плани відповідно до програми МОН України.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 font-semibold text-lg flex items-center gap-2"
                >
                  Спробувати безкоштовно
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-4 bg-slate-800/50 border border-slate-700 text-white rounded-xl hover:bg-slate-700/50 transition-all duration-300 font-semibold text-lg"
                >
                  Вже є акаунт
                </Link>
              </div>

              <p className="mt-6 text-slate-500 text-sm">
                🎁 1 безкоштовний кредит при реєстрації
              </p>
            </div>

            {/* Demo Preview - Анімація генерації */}
            <div className="mt-20 max-w-5xl mx-auto">
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
                      <span className="text-cyan-400 text-sm font-mono">Генерується календарно-тематичний план...</span>
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

                    {/* AI Processing Indicator */}
                    <div className="flex items-center gap-2 p-3 bg-cyan-500/5 rounded-lg">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-slate-400 text-xs font-mono">AI аналізує програму МОН...</span>
                    </div>

                    {/* Generated Content Preview */}
                    <div className="space-y-2 p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-4 bg-cyan-400 rounded"></div>
                        <span className="text-white font-semibold text-sm">Календарно-тематичний план</span>
                      </div>
                      {/* Table Header */}
                      <div className="grid grid-cols-5 gap-2 text-xs text-slate-400 font-mono mb-2">
                        <div>№</div>
                        <div className="col-span-2">Тема уроку</div>
                        <div>Дата</div>
                        <div>Годин</div>
                      </div>
                      {/* Table Rows with Content */}
                      <div className="space-y-2">
                        {/* Row 1 */}
                        <div className="grid grid-cols-5 gap-2 text-xs items-center">
                          <div className="text-slate-300 font-mono">1</div>
                          <div className="col-span-2 text-slate-300">Мова як суспільне явище</div>
                          <div className="text-slate-400 font-mono">03.09</div>
                          <div className="text-slate-300 font-mono">1</div>
                        </div>
                        {/* Row 2 */}
                        <div className="grid grid-cols-5 gap-2 text-xs items-center">
                          <div className="text-slate-300 font-mono">2</div>
                          <div className="col-span-2 text-slate-300">Спілкування і мовлення</div>
                          <div className="text-slate-400 font-mono">05.09</div>
                          <div className="text-slate-300 font-mono">1</div>
                        </div>
                        {/* Row 3 */}
                        <div className="grid grid-cols-5 gap-2 text-xs items-center">
                          <div className="text-slate-300 font-mono">3</div>
                          <div className="col-span-2 text-slate-300">Текст. Типи мовлення</div>
                          <div className="text-slate-400 font-mono">10.09</div>
                          <div className="text-slate-300 font-mono">2</div>
                        </div>
                        {/* Row 4 - subtle animation */}
                        <div className="grid grid-cols-5 gap-2 text-xs items-center animate-pulse" style={{animationDuration: '3s'}}>
                          <div className="h-5 bg-slate-700/30 rounded"></div>
                          <div className="col-span-2 h-5 bg-gradient-to-r from-slate-700/30 to-transparent rounded"></div>
                          <div className="h-5 bg-slate-700/30 rounded"></div>
                          <div className="h-5 bg-slate-700/30 rounded"></div>
                        </div>
                        {/* Row 5 - subtle animation */}
                        <div className="grid grid-cols-5 gap-2 text-xs items-center animate-pulse" style={{animationDuration: '3s', animationDelay: '0.5s'}}>
                          <div className="h-5 bg-slate-700/30 rounded"></div>
                          <div className="col-span-2 h-5 bg-gradient-to-r from-slate-700/30 to-transparent rounded"></div>
                          <div className="h-5 bg-slate-700/30 rounded"></div>
                          <div className="h-5 bg-slate-700/30 rounded"></div>
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="flex gap-4 mt-4 pt-3 border-t border-slate-700/30">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-slate-400 text-xs">Всього тем: 16</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span className="text-slate-400 text-xs">Годин: 35</span>
                        </div>
                      </div>
                    </div>

                    {/* Success Message */}
                    <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-green-400 text-sm font-medium">План успішно згенеровано за 8 секунд</span>
                    </div>
                  </div>

                  {/* Floating Code Elements */}
                  <div className="absolute top-20 right-8 text-cyan-400/20 font-mono text-xs animate-pulse">
                    {'{ ai: "processing" }'}
                  </div>
                  <div className="absolute bottom-20 left-8 text-teal-400/20 font-mono text-xs animate-pulse" style={{animationDelay: '1s'}}>
                    {'<TeacherPlan />'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Time & Cost Comparison */}
        <section className="py-20 px-6 bg-gradient-to-b from-slate-900/50 to-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Time Saving */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 hover:border-red-500/50 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl flex items-center justify-center">
                      <Clock className="text-red-400" size={32} />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-white">4-6 годин</div>
                      <div className="text-slate-400 text-sm">вручну</div>
                    </div>
                  </div>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    Зазвичай вчитель витрачає <span className="text-red-400 font-semibold">4-6 годин</span> на написання 
                    календарно-тематичного плану на семестр. Це цілий робочий день!
                  </p>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <span>😰</span>
                    <span>Пошук тем, розрахунок годин, заповнення таблиць...</span>
                  </div>
                </div>
              </div>

              {/* AI Speed */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-cyan-500 rounded-2xl p-8 hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/30 to-teal-500/30 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/50">
                      <Zap className="text-cyan-400" size={32} />
                    </div>
                    <div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">10 секунд</div>
                      <div className="text-slate-400 text-sm">з AI</div>
                    </div>
                  </div>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    TeacherPlan створює повний календарний план всього за <span className="text-cyan-400 font-semibold">10 секунд</span>. 
                    Просто кілька кліків — і готово!
                  </p>
                  <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
                    <span>⚡</span>
                    <span>Економія часу: 4-6 годин → 10 секунд</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Coffee Price Comparison - Slogan */}
            <div className="mt-12 max-w-3xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl blur-2xl"></div>
                <div className="relative bg-slate-900/50 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-10 hover:border-amber-500/50 transition-all duration-300">
                  <div className="text-center">
                    <div className="text-7xl mb-6">☕</div>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                      Календарний план за ціною чашки кави
                    </h3>
                    <p className="text-xl text-slate-300 leading-relaxed">
                      А заощаджений час? <span className="text-cyan-400 font-bold">Безцінний</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Чому вчителі обирають TeacherPlan?
              </h2>
              <p className="text-xl text-slate-400">
                Все що потрібно для швидкої та якісної підготовки планів
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-xl flex items-center justify-center mb-6">
                    <Zap className="text-cyan-400" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Швидкість</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Генерація календарного плану займає всього 5-15 секунд. 
                    Більше ніяких годин рутинної роботи.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-xl flex items-center justify-center mb-6">
                    <CheckCircle className="text-cyan-400" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Відповідність МОН</h3>
                  <p className="text-slate-400 leading-relaxed">
                    100% відповідність програмам Міністерства освіти і науки України. 
                    Всі теми та години враховані.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-xl flex items-center justify-center mb-6">
                    <Download className="text-cyan-400" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Google Docs</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Автоматичний експорт в Google Docs. Відредагуйте план під себе 
                    та збережіть у хмарі.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-xl flex items-center justify-center mb-6">
                    <BookOpen className="text-cyan-400" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">8 предметів</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Українська мова, література, математика, інформатика, історія, 
                    мистецтво, фізкультура та інші.
                  </p>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-xl flex items-center justify-center mb-6">
                    <Calendar className="text-cyan-400" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Гнучкість</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Налаштуйте розклад, семестр, дні тижня та інші параметри 
                    під свою школу.
                  </p>
                </div>
              </div>

              {/* Feature 6 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-xl flex items-center justify-center mb-6">
                    <FileText className="text-cyan-400" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Історія</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Всі згенеровані документи зберігаються в особистому кабінеті. 
                    Доступ завжди.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-20 px-6 bg-gradient-to-b from-transparent to-slate-900/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Як це працює?
              </h2>
              <p className="text-xl text-slate-400">
                Всього 3 кроки до готового плану
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="relative">
                <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cyan-500/50">
                  1
                </div>
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 pt-12">
                  <h3 className="text-xl font-bold text-white mb-3">Заповніть форму</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Оберіть предмет, клас, програму, семестр та розклад занять. 
                    Все інтуїтивно зрозуміло.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cyan-500/50">
                  2
                </div>
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 pt-12">
                  <h3 className="text-xl font-bold text-white mb-3">Згенеруйте план</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Натисніть кнопку "Генерувати" і зачекайте 5-15 секунд. 
                    AI створить ідеальний план.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cyan-500/50">
                  3
                </div>
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 pt-12">
                  <h3 className="text-xl font-bold text-white mb-3">Використовуйте</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Документ автоматично збережеться в Google Drive. 
                    Відредагуйте при потребі.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition - Real Cost */}
        <section className="py-16 px-6 bg-gradient-to-b from-transparent via-slate-900/30 to-transparent">
          <div className="max-w-5xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl blur-2xl"></div>
              <div className="relative bg-slate-900/50 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-10">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Скільки коштує ваш час? 💭
                  </h2>
                  <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                    Якщо ваша годинна ставка всього <span className="text-cyan-400 font-semibold">100 грн/год</span>, 
                    то 4-6 годин на календарний план = <span className="text-red-400 font-bold">400-600 грн</span> вашого часу
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* Manual Cost */}
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
                    <div className="text-red-400 text-4xl font-bold mb-2">600₴</div>
                    <div className="text-slate-300 text-sm mb-1">Ваш час (6 годин)</div>
                    <div className="text-slate-400 text-xs">при 100₴/год</div>
                  </div>

                  {/* TeacherPlan Cost */}
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
                    <div className="text-green-400 text-4xl font-bold mb-2">99₴</div>
                    <div className="text-slate-300 text-sm mb-1">TeacherPlan</div>
                    <div className="text-slate-400 text-xs">+ 10 секунд</div>
                  </div>

                  {/* Savings */}
                  <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 text-center">
                    <div className="text-cyan-400 text-4xl font-bold mb-2">501₴</div>
                    <div className="text-slate-300 text-sm mb-1">Ваша економія</div>
                    <div className="text-slate-400 text-xs">+ 6 годин часу</div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-slate-300 text-lg">
                    🎯 Натисніть кілька кнопок замість того, щоб витрачати цілий день на рутину
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Доступні ціни
              </h2>
              <p className="text-xl text-slate-400">
                Обирайте пакет що підходить саме вам
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* 1 документ */}
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 hover:border-cyan-500/50 hover:scale-105 transition-all duration-300">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-white mb-2">1 документ</h3>
                  <div className="text-4xl font-bold text-white mb-2">99 ₴</div>
                  <p className="text-slate-400">1 документ</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="text-cyan-400 flex-shrink-0" size={20} />
                    <span>1 кредит</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="text-cyan-400 flex-shrink-0" size={20} />
                    <span>Всі предмети</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="text-cyan-400 flex-shrink-0" size={20} />
                    <span>Google Docs експорт</span>
                  </li>
                </ul>
              </div>

              {/* 3 документи (Popular) */}
              <div className="relative scale-105">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-sm font-bold rounded-full">
                  Популярне
                </div>
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-cyan-500 rounded-2xl p-8 shadow-2xl shadow-cyan-500/30 hover:scale-105 transition-all duration-300 h-full">
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-bold text-white mb-2">3 документи</h3>
                    <div className="text-4xl font-bold text-white mb-2">249 ₴</div>
                    <p className="text-slate-400">3 документи</p>
                    <p className="text-green-400 text-sm mt-2">Економія 48 грн</p>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-2 text-slate-300">
                      <CheckCircle className="text-cyan-400 flex-shrink-0" size={20} />
                      <span>3 кредити</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-300">
                      <CheckCircle className="text-cyan-400 flex-shrink-0" size={20} />
                      <span>Всі предмети</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-300">
                      <CheckCircle className="text-cyan-400 flex-shrink-0" size={20} />
                      <span>Google Docs експорт</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-300">
                      <CheckCircle className="text-cyan-400 flex-shrink-0" size={20} />
                      <span>Пріоритетна підтримка</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 10 документів */}
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 hover:border-cyan-500/50 hover:scale-105 transition-all duration-300">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-white mb-2">10 документів</h3>
                  <div className="text-4xl font-bold text-white mb-2">599 ₴</div>
                  <p className="text-slate-400">10 документів</p>
                  <p className="text-green-400 text-sm mt-2">Економія 391 грн</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="text-cyan-400 flex-shrink-0" size={20} />
                    <span>10 кредитів</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="text-cyan-400 flex-shrink-0" size={20} />
                    <span>Всі предмети</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="text-cyan-400 flex-shrink-0" size={20} />
                    <span>Google Docs експорт</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="text-cyan-400 flex-shrink-0" size={20} />
                    <span>Пріоритетна підтримка</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 blur-3xl"></div>
              <div className="relative bg-slate-900/50 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-12 text-center">
                <h2 className="text-4xl font-bold text-white mb-4">
                  Готові спробувати?
                </h2>
                <p className="text-xl text-slate-400 mb-8">
                  Зареєструйтесь зараз і отримайте 1 безкоштовний кредит
                </p>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 font-semibold text-lg"
                >
                  Почати безкоштовно
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-xl mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-wrap items-center justify-between gap-6 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="text-white" size={18} />
                </div>
                <span className="text-white font-bold text-lg">TeacherPlan</span>
              </div>
              <p className="text-slate-400 text-sm">
                AI-платформа для автоматизації роботи вчителів
              </p>
            </div>
            
            <div className="flex flex-wrap gap-8">
              <div>
                <h4 className="text-white font-semibold mb-3">Компанія</h4>
                <div className="space-y-2">
                  <Link href="/about" className="block text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                    Про нас
                  </Link>
                  <Link href="/terms" className="block text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                    Умови використання
                  </Link>
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-3">Юридичне</h4>
                <div className="space-y-2">
                  <Link href="/privacy" className="block text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                    Конфіденційність
                  </Link>
                  <Link href="/refund" className="block text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                    Повернення коштів
                  </Link>
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-3">Контакти</h4>
                <div className="space-y-2">
                  <a href="mailto:teacher_plan_ai@proton.me" className="block text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                    teacher_plan_ai@proton.me
                  </a>
                  <a href="tel:+380931972061" className="block text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                    +380 93 197 20 61
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-slate-800">
            <div className="text-center mb-4">
              <p className="text-slate-500 text-xs mb-1">
                ФОП Лисун Владислав Сергійович | РНОКПП: 3494908755
              </p>
              <p className="text-slate-600 text-xs">
                Україна, 62203, Харківська обл., Богодухівський р-н, селище Золочів, вул. Народна, будинок 4
              </p>
            </div>
            <p className="text-slate-400 text-sm text-center">
              © 2024 TeacherPlan. Всі права захищені.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
