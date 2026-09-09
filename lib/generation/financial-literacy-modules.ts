/**
 * Модулі та теми для курсу за вибором «Фінансова грамотність», 10-11 класи
 * 105 годин (101 год вивчення матеріалу + 4 год резерв), 3 год/тиждень
 * Навчальна програма курсу за вибором «Фінансова грамотність»,
 * оновлена і відкоригована за результатами всеукраїнської експериментальної
 * роботи 2012-2019 рр., з урахуванням Концепції Нової української школи (2016).
 */

export interface FinLitTopic {
  topic: string;
  hours: number;
}

export interface FinLitModule {
  name: string;
  topics: FinLitTopic[];
}

export const introFinLit: FinLitModule = {
  name: "Розділ 1. Вступ до особистих фінансів",
  topics: [
    { topic: "Що таке гроші", hours: 3 },
    { topic: "Зайнятість і підприємництво", hours: 5 },
    { topic: "Фінансове планування", hours: 5 },
    { topic: "Надходження", hours: 3 },
    { topic: "Видатки", hours: 4 },
    { topic: "Складання та ведення сімейного бюджету", hours: 3 },
    { topic: "Податки", hours: 4 },
  ],
};

export const financialSystemFinLit: FinLitModule = {
  name: "Розділ 2. Фінансова система та фінансові послуги",
  topics: [
    { topic: "Як працює фінансова система", hours: 4 },
    { topic: "Банки і банківські послуги", hours: 5 },
    { topic: "Страхування", hours: 5 },
    { topic: "Небанківські фінансові установи", hours: 3 },
    { topic: "Що таке валюта", hours: 4 },
    { topic: "Платежі та платіжні системи", hours: 5 },
  ],
};

export const savingsInvestingFinLit: FinLitModule = {
  name: "Розділ 3. Заощадження та інвестиції",
  topics: [
    { topic: "Вступ до заощаджень та інвестицій", hours: 3 },
    { topic: "Депозити", hours: 4 },
    { topic: "Інвестиції", hours: 6 },
    { topic: "Пенсії", hours: 3 },
  ],
};

export const borrowingFinLit: FinLitModule = {
  name: "Розділ 4. Запозичення та кредит",
  topics: [
    { topic: "Запозичення та борг", hours: 3 },
    { topic: "Вартість кредиту", hours: 4 },
    { topic: "Обираємо кредитну пропозицію", hours: 4 },
    { topic: "Кредитні продукти", hours: 6 },
  ],
};

export const selfProtectionFinLit: FinLitModule = {
  name: "Розділ 5. Як себе захистити",
  topics: [
    { topic: "Типи ризиків та управління ними", hours: 3 },
    { topic: "Види страхування", hours: 4 },
    { topic: "Фінансова безпека та шахрайство. Фінансові піраміди", hours: 5 },
    { topic: "Захист прав споживачів фінансових послуг", hours: 3 },
  ],
};

// Резервний час, передбачений самою програмою (105 - 101 = 4 год) —
// на повторення, узагальнення та контроль знань.
export const reserveFinLit: FinLitModule = {
  name: "Резервний час",
  topics: [{ topic: "Узагальнення та систематизація вивченого матеріалу", hours: 4 }],
};

export const allModulesFinLit: FinLitModule[] = [
  introFinLit,
  financialSystemFinLit,
  savingsInvestingFinLit,
  borrowingFinLit,
  selfProtectionFinLit,
  reserveFinLit,
];
