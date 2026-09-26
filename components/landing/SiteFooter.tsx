"use client";

import { useState } from "react";
import Link from "next/link";

// Спільний футер для публічних сторінок сайту (головна, /plans, /dlya-shkil,
// /about, /terms, /privacy, /refund) — раніше був лише на головній,
// продубльований інлайн. Телефон навмисно ховається за кнопкою: номер у
// відкритому тексті на кожній сторінці — це готовий здобуток для
// скрейперів-ботів, а власнику не потрібно, щоб його засипало спамом.
//
// ЗАВЖДИ темний, незалежно від theme-перемикача головної сторінки
// (light/dark, .tp-home) — той самий підхід, що й .compare-card.win/
// .price-card.popular у HomePageContent.tsx. Але на відміну від них цей
// компонент — чистий Tailwind без урахування .tp-home взагалі, і коли
// його рендерять УСЕРЕДИНІ .tp-home (на головній, <SiteFooter/> —
// останній child перед закриттям div.tp-home), правило
// ".tp-home a{ color:inherit }" (вища специфічність за text-slate-400
// клас Tailwind) переписувало колір САМЕ ПОСИЛАНЬ на --ink — у світлій
// темі це майже чорний, на темному фоні футера нечитабельно (знайдено
// користувачем скріном 2026-09-26, підтверджено напряму: getComputedStyle
// на живому сайті — a: rgb(18,22,27) замість очікуваного slate-400;
// h4/p/span/button виявились НЕ зачеплені тим самим тестом, тож фікс
// точковий лише під <a>, а не під усе). Власний <style> тієї самої
// специфічності (.site-footer a — теж клас+елемент), але фізично пізніше
// в HTML (SiteFooter — останній child), тож виграє за порядком при
// однаковій специфічності — без !important.
export default function SiteFooter() {
  const [phoneRevealed, setPhoneRevealed] = useState(false);

  return (
    <footer className="site-footer border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-xl mt-20">
      <style>{`
        .site-footer a{ color:#94A3B8; }
        .site-footer a:hover{ color:#22D3EE; }
        /* Розкритий номер телефону навмисно вже яскраво-циановий
           (text-cyan-400, не text-slate-400) — власна специфічність
           вища (клас+клас+елемент), інакше правило вище перекрило б і
           цей навмисно інший колір теж. */
        .site-footer a.text-cyan-400{ color:#22D3EE; }
      `}</style>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-6 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">✨</span>
              </div>
              <span className="text-white font-bold text-lg">TeacherPlan</span>
            </div>
            <p className="text-slate-400 text-sm">AI-платформа для автоматизації роботи вчителів</p>
          </div>

          <div className="flex flex-wrap gap-8">
            <div>
              <h4 className="text-white font-semibold mb-3">Продукт</h4>
              <div className="space-y-2">
                <Link href="/plans" className="block text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                  Плани за предметами
                </Link>
                <Link href="/dlya-shkil" className="block text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                  Для шкіл
                </Link>
                <Link href="/about" className="block text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                  Про нас
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
                <Link href="/terms" className="block text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                  Умови використання
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Контакти</h4>
              <div className="space-y-2">
                <a
                  href="mailto:teacher_plan_ai@proton.me"
                  className="block text-slate-400 hover:text-cyan-400 transition-colors text-sm"
                >
                  teacher_plan_ai@proton.me
                </a>
                {phoneRevealed ? (
                  <a href="tel:+380931972061" className="block text-cyan-400 text-sm">
                    +380 93 197 20 61
                  </a>
                ) : (
                  <button
                    onClick={() => setPhoneRevealed(true)}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 transition-colors text-sm border border-slate-700 hover:border-cyan-500/50 rounded-lg px-2.5 py-1"
                  >
                    ☏ Показати номер
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/50 pt-6 flex flex-wrap justify-between gap-2 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} TeacherPlan AI</span>
          <span>Зроблено з ❤️ для вчителів України</span>
        </div>
      </div>
    </footer>
  );
}
