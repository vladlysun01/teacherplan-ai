import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Про нас",
  description:
    "TeacherPlan AI — платформа для вчителів України, яка автоматично генерує календарно-тематичні плани відповідно до програм МОН.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <a href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">✨</span>
            </div>
            <span className="text-white font-bold text-xl">TeacherPlan</span>
          </a>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent mb-4">
            Про TeacherPlan
          </h1>
          <p className="text-xl text-slate-400">
            AI-платформа для автоматизації роботи вчителів
          </p>
        </div>

        {/* Content */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Про нас</h2>
            <p className="text-slate-300 leading-relaxed">
              TeacherPlan — це українська AI-платформа, створена для допомоги вчителям у підготовці 
              календарно-тематичних та поурочних планів. Ми розуміємо, скільки часу витрачають педагоги 
              на рутинну роботу, і прагнемо звільнити цей час для того, що дійсно важливо — навчання та 
              спілкування з учнями.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Наша місія</h2>
            <p className="text-slate-300 leading-relaxed">
              Ми прагнемо зробити роботу кожного українського вчителя простішою та ефективнішою, 
              надаючи інструменти на базі штучного інтелекту для автоматизації рутинних завдань.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Що ми пропонуємо</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="text-cyan-400 mt-1">✓</span>
                <div>
                  <h3 className="text-white font-semibold mb-1">Календарно-тематичні плани</h3>
                  <p className="text-slate-400">Автоматична генерація планів відповідно до програми МОН України</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-cyan-400 mt-1">✓</span>
                <div>
                  <h3 className="text-white font-semibold mb-1">Поурочні плани</h3>
                  <p className="text-slate-400">Детальні плани уроків з урахуванням методичних рекомендацій</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-cyan-400 mt-1">✓</span>
                <div>
                  <h3 className="text-white font-semibold mb-1">Гнучкість та адаптація</h3>
                  <p className="text-slate-400">Можливість налаштування під власні потреби та методику</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Інформація про власника</h2>
            <div className="bg-slate-800/30 rounded-xl p-6 space-y-3">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Найменування</p>
                  <p className="text-white font-medium">ФОП Лисун Владислав Сергійович</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">РНОКПП</p>
                  <p className="text-white font-medium">3494908755</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-slate-400 text-sm mb-1">Місцезнаходження</p>
                  <p className="text-white font-medium">Україна, 62203, Харківська обл., Богодухівський р-н, селище Золочів, вул. Народна, будинок 4</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Електронна пошта</p>
                  <p className="text-white font-medium">teacher_plan_ai@proton.me</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Телефон</p>
                  <p className="text-white font-medium">+380 93 197 20 61</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Наші переваги</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/30 rounded-xl p-6">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="text-white font-semibold mb-2">Швидкість</h3>
                <p className="text-slate-400 text-sm">Генерація плану за 5-10 секунд</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/30 rounded-xl p-6">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-white font-semibold mb-2">Відповідність</h3>
                <p className="text-slate-400 text-sm">100% відповідність вимогам МОН</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/30 rounded-xl p-6">
                <div className="text-3xl mb-3">💾</div>
                <h3 className="text-white font-semibold mb-2">Зручність</h3>
                <p className="text-slate-400 text-sm">Експорт в Google Docs</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/30 rounded-xl p-6">
                <div className="text-3xl mb-3">🇺🇦</div>
                <h3 className="text-white font-semibold mb-2">Українська</h3>
                <p className="text-slate-400 text-sm">Повністю українською мовою</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Контакти</h2>
            <p className="text-slate-300 mb-4">
              Маєте запитання або пропозиції? Зв'яжіться з нами!
            </p>
            <div className="space-y-2">
              <a href="mailto:teacher_plan_ai@proton.me" className="flex items-center gap-3 text-cyan-400 hover:text-cyan-300">
                <span>📧</span>
                <span>teacher_plan_ai@proton.me</span>
              </a>
              <a href="tel:+380931972061" className="flex items-center gap-3 text-cyan-400 hover:text-cyan-300">
                <span>📞</span>
                <span>+380 93 197 20 61</span>
              </a>
            </div>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-12 text-center space-x-6">
          <a href="/terms" className="text-slate-400 hover:text-cyan-400">Умови використання</a>
          <a href="/privacy" className="text-slate-400 hover:text-cyan-400">Конфіденційність</a>
          <a href="/refund" className="text-slate-400 hover:text-cyan-400">Повернення коштів</a>
        </div>
      </div>
    </div>
  );
}
