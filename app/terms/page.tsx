export default function TermsPage() {
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
          Умови використання
        </h1>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8 space-y-8 text-slate-300">
          <section>
            <p className="text-sm text-slate-400 mb-6">
              Останнє оновлення: {new Date().toLocaleDateString('uk-UA')}
            </p>
            <p className="leading-relaxed">
              Ласкаво просимо до TeacherPlan! Використовуючи наш сервіс, ви погоджуєтеся з наступними 
              умовами. Будь ласка, уважно прочитайте їх перед використанням платформи.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Опис послуг</h2>
            <p className="leading-relaxed mb-4">
              TeacherPlan надає онлайн-платформу для автоматизованої генерації календарно-тематичних 
              та поурочних планів для вчителів шкіл України.
            </p>
            <p className="leading-relaxed font-semibold text-white mb-2">
              Послуги включають:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="flex gap-3">
                <span className="text-cyan-400">•</span>
                <span>Генерація календарно-тематичних планів</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400">•</span>
                <span>Генерація поурочних планів</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400">•</span>
                <span>Експорт документів у форматі Google Docs</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400">•</span>
                <span>Збереження історії згенерованих документів</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Ціни та оплата</h2>
            <div className="bg-slate-800/30 rounded-xl p-6 mb-4">
              <p className="font-semibold text-white mb-3">Пакети кредитів:</p>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Starter (5 кредитів)</span>
                  <span className="text-cyan-400 font-semibold">99 ₴</span>
                </li>
                <li className="flex justify-between">
                  <span>Professional (15 кредитів)</span>
                  <span className="text-cyan-400 font-semibold">249 ₴</span>
                </li>
                <li className="flex justify-between">
                  <span>Enterprise (50 кредитів)</span>
                  <span className="text-cyan-400 font-semibold">699 ₴</span>
                </li>
              </ul>
            </div>
            <p className="leading-relaxed mb-4">
              • 1 кредит = 1 згенерований документ (календарний або поурочний план)<br />
              • Кредити не мають терміну дії та не згорають<br />
              • Нові користувачі отримують 1 безкоштовний кредит<br />
              • Оплата здійснюється через платіжну систему LiqPay<br />
              • Всі ціни вказані в гривнях (UAH) та включають ПДВ
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Умови доставки послуги</h2>
            <p className="leading-relaxed mb-4">
              Послуга надається миттєво в електронному вигляді:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="flex gap-3">
                <span className="text-cyan-400">•</span>
                <span>Після оплати кредити зараховуються на баланс протягом 1-2 хвилин</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400">•</span>
                <span>Генерація документа займає 5-15 секунд</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400">•</span>
                <span>Готовий документ автоматично зберігається у вашому Google Drive</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400">•</span>
                <span>Доступ до документів зберігається в особистому кабінеті</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Реєстрація та обліковий запис</h2>
            <p className="leading-relaxed mb-4">
              Для використання сервісу необхідно створити обліковий запис. Ви зобов'язуєтеся:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="flex gap-3">
                <span className="text-cyan-400">•</span>
                <span>Надавати точну та актуальну інформацію</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400">•</span>
                <span>Зберігати конфіденційність паролю</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400">•</span>
                <span>Негайно повідомляти нас про будь-яке несанкціоноване використання</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400">•</span>
                <span>Не передавати свій обліковий запис третім особам</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Інтелектуальна власність</h2>
            <p className="leading-relaxed mb-4">
              Згенеровані документи належать вам і можуть вільно використовуватися у вашій професійній 
              діяльності. Однак, сама платформа, її код, дизайн та технологія залишаються власністю 
              TeacherPlan.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Відповідальність</h2>
            <p className="leading-relaxed mb-4">
              Ми прагнемо забезпечити найвищу якість послуг, однак:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="flex gap-3">
                <span className="text-cyan-400">•</span>
                <span>Згенеровані плани потребують перевірки та можливого редагування вчителем</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400">•</span>
                <span>Ми не несемо відповідальності за помилки у згенерованому контенті</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400">•</span>
                <span>Кінцева відповідальність за використання документів лежить на вчителі</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Припинення доступу</h2>
            <p className="leading-relaxed">
              Ми залишаємо за собою право призупинити або припинити ваш доступ до сервісу у разі 
              порушення цих умов або підозри у зловживанні платформою.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Зміни умов</h2>
            <p className="leading-relaxed">
              Ми можемо час від часу оновлювати ці умови. Про суттєві зміни ми повідомимо вас 
              електронною поштою або через повідомлення на платформі.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Контактна інформація</h2>
            <div className="bg-slate-800/30 rounded-xl p-6">
              <p className="mb-4">З питань щодо цих умов звертайтеся:</p>
              <div className="space-y-2">
                <p className="flex items-center gap-3">
                  <span>📧</span>
                  <a href="mailto:support@teacherplan.com" className="text-cyan-400 hover:text-cyan-300">
                    support@teacherplan.com
                  </a>
                </p>
                <p className="flex items-center gap-3">
                  <span>📞</span>
                  <span>+380 XX XXX XX XX</span>
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Застосовне право</h2>
            <p className="leading-relaxed">
              Ці умови регулюються законодавством України. Будь-які спори розглядаються в судах України 
              відповідно до чинного законодавства.
            </p>
          </section>

          <div className="pt-8 border-t border-slate-800">
            <p className="text-center text-slate-400">
              Використовуючи TeacherPlan, ви підтверджуєте, що прочитали та погодилися з цими умовами.
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-12 text-center space-x-6">
          <a href="/about" className="text-slate-400 hover:text-cyan-400">Про нас</a>
          <a href="/privacy" className="text-slate-400 hover:text-cyan-400">Конфіденційність</a>
          <a href="/refund" className="text-slate-400 hover:text-cyan-400">Повернення коштів</a>
        </div>
      </div>
    </div>
  );
}
