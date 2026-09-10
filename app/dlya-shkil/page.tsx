import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, Users, FileText, Receipt, Phone } from "lucide-react";
import LeadForm from "./LeadForm";
import SiteFooter from "@/components/landing/SiteFooter";

export const metadata: Metadata = {
  title: "TeacherPlan AI для шкіл і методоб'єднань",
  description:
    "Пакетний доступ до TeacherPlan AI для всього педколективу — оплата рахунком на заклад, а не карткою з особистих коштів вчителя. Заявка без миттєвої оплати.",
  alternates: { canonical: "/dlya-shkil" },
};

const TIERS = [
  {
    name: "10 вчителів",
    price: "від 4 500 ₴",
    period: "на навчальний рік",
    description: "Для одного методоб'єднання або невеликого закладу.",
    features: ["10 окремих акаунтів", "До 10 документів на кожен акаунт", "Підтримка в Telegram/email"],
  },
  {
    name: "25 вчителів",
    price: "від 9 900 ₴",
    period: "на навчальний рік",
    description: "Для середньої школи — весь педколектив в одному пакеті.",
    features: ["25 окремих акаунтів", "До 10 документів на кожен акаунт", "Пріоритетна підтримка", "Знижка ≈27% проти окремих покупок"],
    popular: true,
  },
  {
    name: "Необмежено",
    price: "За домовленістю",
    period: "",
    description: "Для великих закладів, ОТГ, кількох шкіл одразу.",
    features: ["Будь-яка кількість акаунтів", "Індивідуальні умови оплати", "Персональний менеджер"],
  },
];

export default function SchoolsPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">✨</span>
            </div>
            <span className="text-white font-bold text-xl">TeacherPlan</span>
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            TeacherPlan AI для <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">шкіл і методоб'єднань</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Весь педколектив генерує календарно-тематичні плани за хвилини замість вечорів — а платить за це заклад,
            не особисті кошти вчителя з картки.
          </p>
        </div>

        {/* Чому школі */}
        <div className="grid sm:grid-cols-3 gap-4 mb-16">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
            <Receipt className="text-cyan-400 mb-3" size={28} />
            <h3 className="text-white font-semibold mb-2">Оплата рахунком</h3>
            <p className="text-slate-400 text-sm">
              Рахунок-фактура на заклад для бухгалтерії — банківський переказ, не картка вчителя.
            </p>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
            <Users className="text-cyan-400 mb-3" size={28} />
            <h3 className="text-white font-semibold mb-2">Весь колектив одразу</h3>
            <p className="text-slate-400 text-sm">
              Окремий акаунт кожному вчителю — генерують плани зі своїми предметами й класами незалежно.
            </p>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
            <FileText className="text-cyan-400 mb-3" size={28} />
            <h3 className="text-white font-semibold mb-2">За хвилини, не за вечори</h3>
            <p className="text-slate-400 text-sm">
              Готовий план відповідно до чинної програми МОН — там, де раніше йшло 4-6 годин ручної роботи.
            </p>
          </div>
        </div>

        {/* Тарифи */}
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Пакетні тарифи</h2>
        <div className="grid sm:grid-cols-3 gap-5 mb-6">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`relative bg-slate-900/50 backdrop-blur-xl border rounded-2xl p-6 ${
                tier.popular ? "border-cyan-500/60 shadow-lg shadow-cyan-500/10" : "border-slate-800"
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xs font-semibold rounded-full">
                  Популярний вибір
                </span>
              )}
              <h3 className="text-white font-bold text-lg mb-1">{tier.name}</h3>
              <p className="text-slate-400 text-sm mb-4">{tier.description}</p>
              <div className="mb-4">
                <span className="text-2xl font-bold text-white">{tier.price}</span>
                {tier.period && <span className="text-slate-500 text-sm ml-1">{tier.period}</span>}
              </div>
              <ul className="space-y-2">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-slate-300 text-sm">
                    <CheckCircle className="text-cyan-400 flex-shrink-0 mt-0.5" size={16} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-center text-slate-500 text-sm mb-16">
          Ціни орієнтовні — фінальні умови узгоджуємо особисто під розмір і потреби вашого закладу.
        </p>

        {/* Форма */}
        <div className="grid md:grid-cols-5 gap-8 items-start">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-3">Залишити заявку</h2>
            <p className="text-slate-400 text-sm mb-4">
              Заповніть форму — ми зв'яжемось, розкажемо детальніше й за потреби організуємо коротку демонстрацію
              на планерці методоб'єднання.
            </p>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Phone size={16} />
              Або одразу зателефонуйте — контакти в{" "}
              <Link href="/about" className="text-cyan-400 hover:text-cyan-300">
                розділі «Про нас»
              </Link>
              .
            </div>
          </div>
          <div className="md:col-span-3">
            <LeadForm />
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
