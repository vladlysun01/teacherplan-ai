import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Політика повернення коштів",
  description: "Умови повернення коштів на платформі TeacherPlan AI.",
  alternates: { canonical: "/refund" },
};

export default function RefundPage() {
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
        <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent mb-8">
          Політика повернення коштів
        </h1>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8 space-y-8 text-slate-300">
          <section>
            <p className="text-sm text-slate-400 mb-6">
              Останнє оновлення: {new Date().toLocaleDateString('uk-UA')}
            </p>
            <p className="leading-relaxed">
              Ми прагнемо забезпечити найкращий досвід використання TeacherPlan. Ця політика описує 
              умови повернення коштів за придбані кредити.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Загальні положення</h2>
            <p className="leading-relaxed mb-4">
              TeacherPlan працює на основі системи кредитів. Після оплати кредити зараховуються на ваш 
              обліковий запис і можуть бути використані для генерації документів.
            </p>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
              <p className="font-semibold text-white mb-2">⚠️ Важливо знати:</p>
              <ul className="space-y-2">
                <li>• Кредити не мають терміну дії</li>
                <li>• Кредити не згорають</li>
                <li>• 1 кредит = 1 згенерований документ</li>
                <li>• Кредити не можна передати іншому користувачу</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Умови повернення коштів</h2>
            
            <div className="space-y-6">
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Випадки, коли повернення можливе:
                </h3>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <span className="text-cyan-400 mt-1">•</span>
                    <div>
                      <p className="font-medium text-white mb-1">Подвійна оплата</p>
                      <p className="text-slate-400 text-sm">
                        Якщо з вашого рахунку було знято кошти двічі за одну покупку, ми повернемо 
                        дублюючий платіж протягом 5 робочих днів.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-cyan-400 mt-1">•</span>
                    <div>
                      <p className="font-medium text-white mb-1">Технічна помилка</p>
                      <p className="text-slate-400 text-sm">
                        Якщо кредити не були зараховані після успішної оплати протягом 24 годин, 
                        ми або зарахуємо кредити, або повернемо кошти.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-cyan-400 mt-1">•</span>
                    <div>
                      <p className="font-medium text-white mb-1">Помилкова покупка (перші 24 години)</p>
                      <p className="text-slate-400 text-sm">
                        Якщо ви випадково придбали пакет і не використали жодного кредита, можна 
                        повернути кошти протягом 24 годин з моменту покупки.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="text-red-400">✗</span>
                  Випадки, коли повернення НЕ можливе:
                </h3>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <span className="text-red-400 mt-1">•</span>
                    <div>
                      <p className="font-medium text-white mb-1">Використані кредити</p>
                      <p className="text-slate-400 text-sm">
                        Якщо ви використали хоча б один кредит з придбаного пакету, повернення 
                        неможливе. Послуга вважається наданою.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-400 mt-1">•</span>
                    <div>
                      <p className="font-medium text-white mb-1">Минув термін</p>
                      <p className="text-slate-400 text-sm">
                        Якщо з моменту покупки минуло більше 24 годин і ви не повідомили про 
                        проблему, повернення неможливе.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-400 mt-1">•</span>
                    <div>
                      <p className="font-medium text-white mb-1">Незадоволення якістю</p>
                      <p className="text-slate-400 text-sm">
                        Повернення через незадоволення якістю згенерованих документів не 
                        здійснюється. Рекомендуємо спочатку скористатися безкоштовним кредитом.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-400 mt-1">•</span>
                    <div>
                      <p className="font-medium text-white mb-1">Зміна думки</p>
                      <p className="text-slate-400 text-sm">
                        Після використання кредитів повернення через зміну думки неможливе.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Як подати запит на повернення</h2>
            <div className="bg-slate-800/30 rounded-xl p-6 space-y-4">
              <p className="leading-relaxed">
                Для запиту на повернення коштів виконайте наступні кроки:
              </p>
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </span>
                  <div>
                    <p className="font-medium text-white mb-1">Зв'яжіться з підтримкою</p>
                    <p className="text-slate-400 text-sm">
                      Надішліть email на support@teacherplan.com з теми "Повернення коштів"
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </span>
                  <div>
                    <p className="font-medium text-white mb-1">Вкажіть інформацію</p>
                    <p className="text-slate-400 text-sm mb-2">У листі обов'язково вкажіть:</p>
                    <ul className="text-slate-400 text-sm space-y-1 ml-4">
                      <li>• Ваше ім'я та email, зареєстрований на платформі</li>
                      <li>• Номер замовлення (Order ID)</li>
                      <li>• Дату та суму платежу</li>
                      <li>• Причину повернення</li>
                      <li>• Скріншоти підтвердження оплати (за необхідності)</li>
                    </ul>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </span>
                  <div>
                    <p className="font-medium text-white mb-1">Очікуйте на розгляд</p>
                    <p className="text-slate-400 text-sm">
                      Ми розглянемо ваш запит протягом 2 робочих днів і повідомимо про рішення
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Терміни повернення</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-800/30 rounded-xl p-6">
                <p className="font-semibold text-white mb-2">⏱️ Розгляд запиту</p>
                <p className="text-slate-400">2 робочі дні</p>
              </div>
              <div className="bg-slate-800/30 rounded-xl p-6">
                <p className="font-semibold text-white mb-2">💳 Повернення на картку</p>
                <p className="text-slate-400">5-10 робочих днів після схвалення</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm mt-4">
              * Термін зарахування коштів залежить від вашого банку
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Часткове повернення</h2>
            <p className="leading-relaxed mb-4">
              У виняткових випадках можливе часткове повернення коштів:
            </p>
            <div className="bg-slate-800/30 rounded-xl p-6">
              <p className="mb-3">
                Якщо ви використали частину кредитів з пакету і виникла технічна проблема, 
                ми можемо повернути вартість невикористаних кредитів за формулою:
              </p>
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 text-center">
                <p className="font-mono text-cyan-400">
                  Сума повернення = (Вартість пакету / Кількість кредитів) × Невикористані кредити
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Автоматичне повернення</h2>
            <p className="leading-relaxed mb-4">
              У деяких випадках повернення відбувається автоматично:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="flex gap-3">
                <span className="text-cyan-400">•</span>
                <span>Якщо генерація документа не вдалася через технічну помилку - кредит повертається автоматично</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400">•</span>
                <span>Якщо оплата була скасована платіжною системою - кошти повертаються автоматично</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Рекомендації перед покупкою</h2>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
              <p className="font-semibold text-white mb-3">💡 Щоб уникнути необхідності повернення:</p>
              <ul className="space-y-2">
                <li className="flex gap-3">
                  <span className="text-cyan-400">✓</span>
                  <span>Спочатку скористайтеся безкоштовним кредитом для тестування</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400">✓</span>
                  <span>Почніть з меншого пакету Starter (5 кредитів)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400">✓</span>
                  <span>Перевірте відповідність предмету та класу перед генерацією</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400">✓</span>
                  <span>Читайте приклади та опис перед покупкою великих пакетів</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Контактна інформація</h2>
            <p className="leading-relaxed mb-4">
              З питань повернення коштів звертайтеся:
            </p>
            <div className="bg-slate-800/30 rounded-xl p-6">
              <div className="space-y-3">
                <p className="flex items-center gap-3">
                  <span>📧</span>
                  <span className="text-slate-400">Email:</span>
                  <a href="mailto:support@teacherplan.com" className="text-cyan-400 hover:text-cyan-300">
                    teacher_plan_ai@proton.me
                  </a>
                </p>
                <p className="flex items-center gap-3">
                  <span>📞</span>
                  <span className="text-slate-400">Телефон:</span>
                  <span className="text-white">+380 XX XXX XX XX</span>
                </p>
                <p className="flex items-center gap-3">
                  <span>⏰</span>
                  <span className="text-slate-400">Час роботи:</span>
                  <span className="text-white">Пн-Пт, 9:00-18:00</span>
                </p>
              </div>
            </div>
          </section>

          <div className="pt-8 border-t border-slate-800">
            <p className="text-center text-slate-400">
              Ця політика може бути оновлена. Актуальна версія завжди доступна на нашому сайті.
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-12 text-center space-x-6">
          <a href="/about" className="text-slate-400 hover:text-cyan-400">Про нас</a>
          <a href="/terms" className="text-slate-400 hover:text-cyan-400">Умови використання</a>
          <a href="/privacy" className="text-slate-400 hover:text-cyan-400">Конфіденційність</a>
        </div>
      </div>
    </div>
  );
}
