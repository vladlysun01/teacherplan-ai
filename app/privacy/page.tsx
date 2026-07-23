import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Політика конфіденційності",
  description: "Політика конфіденційності платформи TeacherPlan AI.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
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
          Політика конфіденційності
        </h1>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8 space-y-8 text-slate-300">
          <section>
            <p className="text-sm text-slate-400 mb-6">
              Останнє оновлення: {new Date().toLocaleDateString('uk-UA')}
            </p>
            <p className="leading-relaxed">
              TeacherPlan серйозно ставиться до захисту ваших персональних даних. Ця політика описує, 
              яку інформацію ми збираємо, як ми її використовуємо та захищаємо.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Яку інформацію ми збираємо</h2>
            
            <div className="space-y-6">
              <div className="bg-slate-800/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">📝 Облікова інформація</h3>
                <p className="text-slate-400 mb-3">При реєстрації ми збираємо:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex gap-3">
                    <span className="text-cyan-400">•</span>
                    <span>Електронну адресу</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-cyan-400">•</span>
                    <span>Ім'я (необов'язково)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-cyan-400">•</span>
                    <span>Пароль (зберігається в зашифрованому вигляді)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-800/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">🏫 Професійна інформація</h3>
                <p className="text-slate-400 mb-3">Для генерації документів:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex gap-3">
                    <span className="text-cyan-400">•</span>
                    <span>ПІБ вчителя</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-cyan-400">•</span>
                    <span>Назва школи</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-cyan-400">•</span>
                    <span>Кваліфікаційна категорія</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-cyan-400">•</span>
                    <span>Предмет викладання</span>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-800/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">💳 Платіжна інформація</h3>
                <p className="text-slate-400 mb-3">
                  Ми НЕ зберігаємо дані вашої платіжної картки. Оплата обробляється через LiqPay, 
                  який відповідає стандартам PCI DSS. Ми зберігаємо лише:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="flex gap-3">
                    <span className="text-cyan-400">•</span>
                    <span>ID транзакції</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-cyan-400">•</span>
                    <span>Суму платежу</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-cyan-400">•</span>
                    <span>Дату транзакції</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-cyan-400">•</span>
                    <span>Статус платежу</span>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-800/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">📊 Технічна інформація</h3>
                <p className="text-slate-400 mb-3">Автоматично збирається:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex gap-3">
                    <span className="text-cyan-400">•</span>
                    <span>IP-адреса</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-cyan-400">•</span>
                    <span>Тип браузера та операційна система</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-cyan-400">•</span>
                    <span>Час використання сервісу</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-cyan-400">•</span>
                    <span>Дії в системі (генерація документів)</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Як ми використовуємо інформацію</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="text-cyan-400 mt-1">✓</span>
                <div>
                  <p className="font-medium text-white mb-1">Надання послуг</p>
                  <p className="text-slate-400 text-sm">
                    Генерація календарно-тематичних та поурочних планів з вашими даними
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-cyan-400 mt-1">✓</span>
                <div>
                  <p className="font-medium text-white mb-1">Обробка платежів</p>
                  <p className="text-slate-400 text-sm">
                    Зарахування кредитів після успішної оплати
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-cyan-400 mt-1">✓</span>
                <div>
                  <p className="font-medium text-white mb-1">Комунікація</p>
                  <p className="text-slate-400 text-sm">
                    Відправка повідомлень про статус замовлень, нові функції, технічну підтримку
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-cyan-400 mt-1">✓</span>
                <div>
                  <p className="font-medium text-white mb-1">Покращення сервісу</p>
                  <p className="text-slate-400 text-sm">
                    Аналіз використання для покращення функціоналу та виправлення помилок
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-cyan-400 mt-1">✓</span>
                <div>
                  <p className="font-medium text-white mb-1">Безпека</p>
                  <p className="text-slate-400 text-sm">
                    Запобігання шахрайству та зловживанням платформою
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Зберігання та захист даних</h2>
            
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6 mb-6">
              <p className="font-semibold text-white mb-3">🔒 Заходи безпеки:</p>
              <ul className="space-y-2">
                <li className="flex gap-3">
                  <span className="text-cyan-400">✓</span>
                  <span>Шифрування SSL/TLS для всіх підключень</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400">✓</span>
                  <span>Паролі зберігаються в зашифрованому вигляді</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400">✓</span>
                  <span>Регулярне резервне копіювання даних</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400">✓</span>
                  <span>Обмежений доступ до персональних даних</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400">✓</span>
                  <span>Моніторинг безпеки 24/7</span>
                </li>
              </ul>
            </div>

            <p className="leading-relaxed text-slate-400">
              Ваші дані зберігаються на захищених серверах в Європі. Ми використовуємо сучасні 
              технології захисту інформації та регулярно оновлюємо наші системи безпеки.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Передача даних третім особам</h2>
            <p className="leading-relaxed mb-4">
              Ми НЕ продаємо та НЕ передаємо ваші персональні дані третім особам, за винятком:
            </p>
            <div className="space-y-4">
              <div className="bg-slate-800/30 rounded-xl p-6">
                <p className="font-medium text-white mb-2">💳 Платіжний процесор (LiqPay)</p>
                <p className="text-slate-400 text-sm">
                  Для обробки платежів. LiqPay має власну політику конфіденційності.
                </p>
              </div>
              <div className="bg-slate-800/30 rounded-xl p-6">
                <p className="font-medium text-white mb-2">☁️ Хостинг-провайдер</p>
                <p className="text-slate-400 text-sm">
                  Для зберігання даних на захищених серверах.
                </p>
              </div>
              <div className="bg-slate-800/30 rounded-xl p-6">
                <p className="font-medium text-white mb-2">⚖️ За вимогою закону</p>
                <p className="text-slate-400 text-sm">
                  Якщо це необхідно для дотримання законодавства України.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Ваші права</h2>
            <p className="leading-relaxed mb-4">
              Згідно з законодавством України, ви маєте наступні права:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-800/30 rounded-xl p-4">
                <p className="font-medium text-white mb-2">👁️ Доступ до даних</p>
                <p className="text-slate-400 text-sm">Отримати копію ваших персональних даних</p>
              </div>
              <div className="bg-slate-800/30 rounded-xl p-4">
                <p className="font-medium text-white mb-2">✏️ Виправлення</p>
                <p className="text-slate-400 text-sm">Виправити неточні або неповні дані</p>
              </div>
              <div className="bg-slate-800/30 rounded-xl p-4">
                <p className="font-medium text-white mb-2">🗑️ Видалення</p>
                <p className="text-slate-400 text-sm">Видалити ваш обліковий запис та дані</p>
              </div>
              <div className="bg-slate-800/30 rounded-xl p-4">
                <p className="font-medium text-white mb-2">🚫 Обмеження обробки</p>
                <p className="text-slate-400 text-sm">Обмежити використання ваших даних</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm mt-4">
              Для реалізації цих прав зв'яжіться з нами: support@teacherplan.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Cookies та аналітика</h2>
            <p className="leading-relaxed mb-4">
              Ми використовуємо cookies для:
            </p>
            <ul className="space-y-2 ml-6 mb-4">
              <li className="flex gap-3">
                <span className="text-cyan-400">•</span>
                <span>Збереження сесії авторизації</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400">•</span>
                <span>Запам'ятовування налаштувань</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400">•</span>
                <span>Аналітики використання сервісу (анонімно)</span>
              </li>
            </ul>
            <p className="text-slate-400 text-sm">
              Ви можете відключити cookies в налаштуваннях браузера, але це може вплинути на 
              функціональність сайту.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Термін зберігання даних</h2>
            <div className="bg-slate-800/30 rounded-xl p-6">
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-cyan-400">•</span>
                  <span><strong>Облікові дані:</strong> доки ви не видалите обліковий запис</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400">•</span>
                  <span><strong>Згенеровані документи:</strong> доки ви не видалите їх</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400">•</span>
                  <span><strong>Історія транзакцій:</strong> 3 роки (для бухгалтерії)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400">•</span>
                  <span><strong>Логи:</strong> 90 днів</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Діти</h2>
            <p className="leading-relaxed">
              Наш сервіс призначений для дорослих користувачів (18+). Ми свідомо не збираємо 
              персональні дані від осіб молодше 18 років.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Зміни в політиці</h2>
            <p className="leading-relaxed">
              Ми можемо оновлювати цю політику час від часу. Про суттєві зміни ми повідомимо вас 
              електронною поштою або через повідомлення на платформі. Дата останнього оновлення 
              вказана на початку документа.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Контакти</h2>
            <p className="leading-relaxed mb-4">
              З питань захисту персональних даних звертайтеся:
            </p>
            <div className="bg-slate-800/30 rounded-xl p-6">
              <div className="space-y-3">
                <p className="flex items-center gap-3">
                  <span>📧</span>
                  <span className="text-slate-400">Email:</span>
                  <a href="mailto:support@teacherplan.com" className="text-cyan-400 hover:text-cyan-300">
                    support@teacherplan.com
                  </a>
                </p>
                <p className="flex items-center gap-3">
                  <span>📞</span>
                  <span className="text-slate-400">Телефон:</span>
                  <span className="text-white">+380 XX XXX XX XX</span>
                </p>
                <p className="flex items-center gap-3">
                  <span>🏢</span>
                  <span className="text-slate-400">Адреса:</span>
                  <span className="text-white">[Ваша адреса]</span>
                </p>
              </div>
            </div>
          </section>

          <div className="pt-8 border-t border-slate-800">
            <p className="text-center text-slate-400">
              Використовуючи TeacherPlan, ви погоджуєтеся з цією політикою конфіденційності.
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-12 text-center space-x-6">
          <a href="/about" className="text-slate-400 hover:text-cyan-400">Про нас</a>
          <a href="/terms" className="text-slate-400 hover:text-cyan-400">Умови використання</a>
          <a href="/refund" className="text-slate-400 hover:text-cyan-400">Повернення коштів</a>
        </div>
      </div>
    </div>
  );
}
