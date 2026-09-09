/**
 * Зарубіжна література, 11 клас, рівень стандарту.
 * Той самий принцип розподілу годин, що й у 10 класі —
 * див. коментар у zarubizhna-literatura-modules-10.ts.
 */
import type { LitModule } from "./zarubizhna-literatura-modules-10";

export const introLit11: LitModule = {
  name: "Вступ",
  topics: [
    { topic: "Література. Мораль. Людяність — роль перекладацької школи у формуванні читача", hours: 1 },
  ],
};

export const goldenAgesLit11: LitModule = {
  name: "Золоті сторінки далеких епох",
  topics: [
    { topic: "Й. В. Ґете. «Фауст» — пошуки сенсу буття, опозиція Фауст — Мефістофель", hours: 3 },
  ],
};

export const modernismLit11: LitModule = {
  name: "Модернізм",
  topics: [
    { topic: "Ф. Кафка. «Перевтілення» — відчуження особистості, абсурдність буття", hours: 3 },
    { topic: "А. Камю. «Чума» — притчевість твору, проблематика екзистенціалізму", hours: 3 },
  ],
};

export const lyricsLit11: LitModule = {
  name: "Шедеври європейської лірики першої половини XX ст.",
  topics: [
    { topic: "Ґійом Аполлінер. «Зарізана голубка й водограй», «Міст Мірабо» — авангардизм і верлібр", hours: 2 },
    { topic: "Р. М. Рільке. «Згаси мій зір…», «Орфей, Еврідіка, Гермес» — переосмислення античних міфів", hours: 2 },
    { topic: "Ф. Ґарсіа Лорка. «Про царівну Місяцівну», «Гітара» — своєрідність художнього світу", hours: 1 },
  ],
};

export const dystopiaLit11: LitModule = {
  name: "Антиутопія у світовій літературі",
  topics: [
    { topic: "Дж. Оруелл. «Скотоферма»/«1984» — викриття тоталітарної системи, поетика антиутопії", hours: 2 },
  ],
};

export const warPeaceLit11: LitModule = {
  name: "Проблема війни і миру в літературі XX ст.",
  topics: [
    { topic: "Б. Брехт. «Матінка Кураж та її діти» — епічний театр, ідеї попередження", hours: 2 },
    { topic: "Г. Белль. «Подорожній, коли ти прийдеш у Спа…» — трагедія війни очима юного солдата", hours: 1 },
    { topic: "П. Целан. «Фуга смерті» — художнє новаторство, тема Голокосту", hours: 1 },
  ],
};

export const senseOfLifeLit11: LitModule = {
  name: "Людина та пошуки сенсу існування в прозі другої половини XX ст.",
  topics: [
    { topic: "Е. Гемінґвей. «Старий і море» — «кодекс честі» героя, ознаки притчі", hours: 2 },
    { topic: "Ґ. Ґарсіа Маркес. «Стариган із крилами» — «магічний реалізм», символіка образу янгола", hours: 2 },
  ],
};

export const lateXXLit11: LitModule = {
  name: "Література другої половини XX – початку XXI ст.",
  topics: [
    { topic: "«Театр абсурду» (огляд) та М. Павич. «Скляний равлик» — риси постмодернізму", hours: 2 },
  ],
};

export const modernYouthLit11: LitModule = {
  name: "Сучасна література в юнацькому читанні",
  topics: [
    { topic: "Т. Халілов. «До останнього подиху» та Дж. Ґрін. «Провина зірок» — огляд за вибором учителя й учнів", hours: 2 },
  ],
};

export const summaryLit11: LitModule = {
  name: "Підсумки",
  topics: [
    { topic: "Узагальнення і систематизація вивченого за 11 клас", hours: 1 },
  ],
};

export const extraLit11: LitModule = {
  name: "Позакласне читання та резерв",
  topics: [
    { topic: "Урок позакласного читання (за списком додаткового читання, Додаток 1)", hours: 2 },
    { topic: "Резервний час — повторення й узагальнення", hours: 2 },
  ],
};

export const allModulesLit11: LitModule[] = [
  introLit11,
  goldenAgesLit11,
  modernismLit11,
  lyricsLit11,
  dystopiaLit11,
  warPeaceLit11,
  senseOfLifeLit11,
  lateXXLit11,
  modernYouthLit11,
  summaryLit11,
  extraLit11,
];
