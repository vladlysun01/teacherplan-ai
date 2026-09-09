// lib/programs.ts
//
// Єдине джерело правди про предмети/програми/класи — раніше було inline у
// app/dashboard/page.tsx (клієнтський компонент), тому ці дані не могли
// потрапити в жодну серверну сторінку. Винесено сюди, щоб SEO-сторінки
// /plans/[subject] могли використати ті самі дані без дублювання.

export type VariantModule = { id: string; name: string };
export type Program = {
  id: string;
  classes: number[];
  description: string;
  lessonsPerWeek?: number | number[];
  hasVariant: boolean;
  variantModules?: VariantModule[];
  variantRequired?: number;
};
export type Programs = { [subject: string]: { [program: string]: Program } };

export const PROGRAMS: Programs = {
  "Англійська мова": {
    "10-11 класи (поглиблене вивчення)": { id: "english-10-11-advanced", classes: [10,11], description: "Спецшколи з поглибленим вивченням, 5 год/тиждень (рівень В2)", lessonsPerWeek: 5, hasVariant: false },
    "10-11 класи (перша іноземна, рівень стандарту)": { id: "english-10-11-standard", classes: [10,11], description: "Рівень стандарту, 2 год/тиждень (рівень В1)", lessonsPerWeek: 2, hasVariant: false },
    "10-11 класи (друга іноземна мова)": { id: "english-10-11-second", classes: [10,11], description: "Друга іноземна мова, 2 год/тиждень (рівень А2+)", lessonsPerWeek: 2, hasVariant: false },
  },
  "Німецька мова": {
    "10-11 класи (поглиблене вивчення)": { id: "german-10-11-advanced", classes: [10,11], description: "Спецшколи з поглибленим вивченням, 5 год/тиждень (рівень В2)", lessonsPerWeek: 5, hasVariant: false },
    "10-11 класи (перша іноземна, рівень стандарту)": { id: "german-10-11-standard", classes: [10,11], description: "Рівень стандарту, 2 год/тиждень (рівень В1)", lessonsPerWeek: 2, hasVariant: false },
    "10-11 класи (друга іноземна мова)": { id: "german-10-11-second", classes: [10,11], description: "Друга іноземна мова, 2 год/тиждень (рівень А2+)", lessonsPerWeek: 2, hasVariant: false },
  },
  "Французька мова": {
    "10-11 класи (поглиблене вивчення)": { id: "french-10-11-advanced", classes: [10,11], description: "Спецшколи з поглибленим вивченням, 5 год/тиждень (рівень В2)", lessonsPerWeek: 5, hasVariant: false },
    "10-11 класи (перша іноземна, рівень стандарту)": { id: "french-10-11-standard", classes: [10,11], description: "Рівень стандарту, 2 год/тиждень (рівень В1)", lessonsPerWeek: 2, hasVariant: false },
    "10-11 класи (друга іноземна мова)": { id: "french-10-11-second", classes: [10,11], description: "Друга іноземна мова, 2 год/тиждень (рівень А2+)", lessonsPerWeek: 2, hasVariant: false },
  },
  "Іспанська мова": {
    "10-11 класи (поглиблене вивчення)": { id: "spanish-10-11-advanced", classes: [10,11], description: "Спецшколи з поглибленим вивченням, 5 год/тиждень (рівень В2)", lessonsPerWeek: 5, hasVariant: false },
    "10-11 класи (перша іноземна, рівень стандарту)": { id: "spanish-10-11-standard", classes: [10,11], description: "Рівень стандарту, 2 год/тиждень (рівень В1)", lessonsPerWeek: 2, hasVariant: false },
    "10-11 класи (друга іноземна мова)": { id: "spanish-10-11-second", classes: [10,11], description: "Друга іноземна мова, 2 год/тиждень (рівень А2+)", lessonsPerWeek: 2, hasVariant: false },
  },
  "Зарубіжна література": {
    "10-11 класи (рівень стандарту)": { id: "zarubizhna-literatura-10-11-standard", classes: [10,11], description: "1 год/тиждень, 34-35 год/рік", lessonsPerWeek: 1, hasVariant: false },
    "10-11 класи (профільний рівень)": { id: "zarubizhna-literatura-10-11-profile", classes: [10,11], description: "3 год/тиждень, 102-105 год/рік", lessonsPerWeek: 3, hasVariant: false },
  },
  "Фізична культура": {
    "НУШ 5-9 класи": { id: "fizkultura-nush-5-9", classes: [5,6,7,8,9], description: "Базова програма НУШ", lessonsPerWeek: 3, hasVariant: false },
    "10-11 класи (рівень стандарту)": { id: "fizkultura-10-11-standart", classes: [10,11], description: "2 год/тиждень", lessonsPerWeek: 2, hasVariant: true, variantModules: [{ id:"basketball",name:"Баскетбол"},{ id:"volleyball",name:"Волейбол"},{ id:"football",name:"Футбол"},{ id:"athletics",name:"Легка атлетика"},{ id:"gymnastics",name:"Гімнастика"},{ id:"badminton",name:"Бадмінтон"}], variantRequired: 2 },
    "10-11 класи (профільний рівень)": { id: "fizkultura-10-11-profil", classes: [10,11], description: "4-5 год/тиждень", lessonsPerWeek: [4,5], hasVariant: true, variantModules: [{ id:"basketball",name:"Баскетбол (поглиблений)"},{ id:"volleyball",name:"Волейбол (поглиблений)"},{ id:"football",name:"Футбол (поглиблений)"},{ id:"athletics",name:"Легка атлетика (поглиблена)"},{ id:"gymnastics",name:"Гімнастика (поглиблена)"}], variantRequired: 1 },
  },
  "Українська мова": {
    "НУШ 5-9 класи": { id: "ukrainian-nush-5-9", classes: [5,6,7,8,9], description: "Базова програма НУШ", lessonsPerWeek: [2,4], hasVariant: false },
    "10-11 класи (рівень стандарту)": { id: "ukrainian-10-11-standard", classes: [10,11], description: "2-3 год/тиждень", lessonsPerWeek: [2,3], hasVariant: false },
    "10-11 класи (профільний рівень)": { id: "ukrainian-10-11-profile", classes: [10,11], description: "4-5 год/тиждень", lessonsPerWeek: [4,5], hasVariant: false },
  },
  "Українська література": {
    "НУШ 5-9 класи": { id: "ukrainian-literature-nush-5-9", classes: [5,6,7,8,9], description: "Базова програма НУШ", lessonsPerWeek: 2, hasVariant: false },
  },
  "Математика": {
    "10-11 класи (рівень стандарту)": { id: "mathematics-10-11-standard", classes: [10,11], description: "3 год/тиждень", lessonsPerWeek: 3, hasVariant: false },
    "10-11 класи (поглиблений рівень)": { id: "mathematics-10-11-advanced", classes: [10,11], description: "4 год/тиждень", lessonsPerWeek: 4, hasVariant: false },
    "10-11 класи (профільний рівень)": { id: "mathematics-10-11-profile", classes: [10,11], description: "5-6 год/тиждень", lessonsPerWeek: [5,6], hasVariant: false },
  },
  "Інформатика": {
    "10-11 класи (рівень стандарту)": { id: "informatics-10-11-standard", classes: [10,11], description: "1-2 год/тиждень", lessonsPerWeek: [1,2], hasVariant: false },
  },
  "Історія України": {
    "10-11 класи": { id: "history-ukraine-10-11", classes: [10,11], description: "Інтегрований курс", lessonsPerWeek: 2, hasVariant: false },
  },
  "Всесвітня історія": {
    "НУШ 6-9 класи": { id: "world-history-nush-6-9", classes: [6,7,8,9], description: "Базова програма НУШ", lessonsPerWeek: 1, hasVariant: false },
    "10-11 класи": { id: "world-history-10-11", classes: [10,11], description: "Старша школа", lessonsPerWeek: 1, hasVariant: false },
  },
  "Мистецтво": {
    "10-11 класи (профільний рівень)": { id: "art-10-11-profile", classes: [10,11], description: "Поглиблене вивчення мистецтва", lessonsPerWeek: 2, hasVariant: false },
  },
  "Географія": {
    "6 клас": { id: "geography-6", classes: [6], description: "Загальна географія (2 год/тиждень, 70 год)", lessonsPerWeek: 2, hasVariant: false },
    "7 клас": { id: "geography-7", classes: [7], description: "Материки та океани (2 год/тиждень, 70 год)", lessonsPerWeek: 2, hasVariant: false },
    "8 клас": { id: "geography-8", classes: [8], description: "Україна у світі: природа, населення (2 год/тиждень, 70 год)", lessonsPerWeek: 2, hasVariant: false },
    "9 клас": { id: "geography-9", classes: [9], description: "Україна і світове господарство (1.5 год/тиждень, 52 год)", lessonsPerWeek: [1,2], hasVariant: false },
    "10 клас": { id: "geography-10", classes: [10], description: "Регіони та країни (1.5 год/тиждень, 52 год)", lessonsPerWeek: [1,2], hasVariant: false },
    "11 клас": { id: "geography-11", classes: [11], description: "Географічний простір Землі (1 год/тиждень, 35 год)", lessonsPerWeek: 1, hasVariant: false },
  },
  "Основи правознавства": {
    "9 клас": { id: "law-9", classes: [9], description: "Основи правознавства (1 год/тиждень, 35 год)", lessonsPerWeek: 1, hasVariant: false },
  },
  "Хімія": {
    "7 клас": { id: "chemistry-7", classes: [7], description: "Початкові хімічні поняття (1.5 год/тиждень, 51 год)", lessonsPerWeek: [1,2], hasVariant: false },
    "8 клас": { id: "chemistry-8", classes: [8], description: "Будова атома, хімічний зв'язок, класи сполук (2 год/тиждень, 68 год)", lessonsPerWeek: 2, hasVariant: false },
    "9 клас": { id: "chemistry-9", classes: [9], description: "Розчини, хімічні реакції, органічні сполуки (2 год/тиждень, 68 год)", lessonsPerWeek: 2, hasVariant: false },
    "10 клас (рівень стандарту)": { id: "chemistry-10-standard", classes: [10], description: "Органічна хімія (1.5 год/тиждень, 52 год)", lessonsPerWeek: [1,2], hasVariant: false },
    "11 клас (рівень стандарту)": { id: "chemistry-11-standard", classes: [11], description: "Загальна та неорганічна хімія (2 год/тиждень, 70 год)", lessonsPerWeek: 2, hasVariant: false },
  },
  "Біологія": {
    "6 клас": { id: "biology-6", classes: [6], description: "Різноманітність живої природи (2 год/тиждень, 70 год)", lessonsPerWeek: 2, hasVariant: false },
    "7 клас": { id: "biology-7", classes: [7], description: "Тварини (2 год/тиждень, 70 год)", lessonsPerWeek: 2, hasVariant: false },
    "8 клас": { id: "biology-8", classes: [8], description: "Людина (2 год/тиждень, 70 год)", lessonsPerWeek: 2, hasVariant: false },
    "9 клас": { id: "biology-9", classes: [9], description: "Молекулярна біологія, генетика, еволюція (2 год/тиждень, 70 год)", lessonsPerWeek: 2, hasVariant: false },
    "10 клас (рівень стандарту)": { id: "biology-10-standard", classes: [10], description: "Біологія і екологія (1.5 год/тиждень, 52 год)", lessonsPerWeek: [1,2], hasVariant: false },
    "11 клас (рівень стандарту)": { id: "biology-11-standard", classes: [11], description: "Біологія і екологія (1.5 год/тиждень, 52 год)", lessonsPerWeek: [1,2], hasVariant: false },
  },
  "Фізика": {
    "10 клас (рівень стандарту)": { id: "physics-10-standard", classes: [10], description: "Механіка, МКТ, електростатика (3 год/тиждень, 105 год)", lessonsPerWeek: 3, hasVariant: false },
    "11 клас (рівень стандарту)": { id: "physics-11-standard", classes: [11], description: "Електродинаміка, оптика, ядерна фізика (3 год/тиждень, 105 год)", lessonsPerWeek: 3, hasVariant: false },
  },
  "Захист України": {
    "10-11 класи (профільний рівень)": { id: "defense-ukraine-10-11-profile", classes: [10,11], description: "6 год/тиждень, 210 год на рік", lessonsPerWeek: 6, hasVariant: false },
  },
  "Фінансова грамотність": {
    "10-11 класи (курс за вибором)": { id: "financial-literacy-10-11", classes: [10,11], description: "Курс за вибором, 3 год/тиждень, 105 год", lessonsPerWeek: 3, hasVariant: false },
  },
};

// Явні слаги замість автотранслітерації — передбачувані URL, без ризику,
// що бібліотека транслітерації колись інакше розбере апостроф чи "ї".
export const SUBJECT_SLUGS: Record<string, string> = {
  "Англійська мова": "angliyska-mova",
  "Німецька мова": "nimetska-mova",
  "Французька мова": "frantsuzka-mova",
  "Іспанська мова": "ispanska-mova",
  "Зарубіжна література": "zarubizhna-literatura",
  "Фізична культура": "fizkultura",
  "Українська мова": "ukrainska-mova",
  "Українська література": "ukrainska-literatura",
  "Математика": "matematyka",
  "Інформатика": "informatyka",
  "Історія України": "istoriya-ukrayiny",
  "Всесвітня історія": "vsesvitnya-istoriya",
  "Мистецтво": "mystetstvo",
  "Географія": "geografiya",
  "Основи правознавства": "osnovy-pravoznavstva",
  "Хімія": "himiya",
  "Біологія": "biologiya",
  "Фізика": "fizyka",
  "Захист України": "zahyst-ukrayiny",
  "Фінансова грамотність": "finansova-hramotnist",
};

export const SLUG_TO_SUBJECT: Record<string, string> = Object.fromEntries(
  Object.entries(SUBJECT_SLUGS).map(([subject, slug]) => [slug, subject])
);

export function getAllClassesForSubject(subject: string): number[] {
  const programs = PROGRAMS[subject];
  if (!programs) return [];
  const classes = new Set<number>();
  Object.values(programs).forEach((p) => p.classes.forEach((c) => classes.add(c)));
  return Array.from(classes).sort((a, b) => a - b);
}

// Журнал видалених/замінених програм — показується в адмінці (/admin), щоб
// було видно, чому якась програма зникла зі списку, а не просто мовчки
// пропала. Заповнюється вручну щоразу, коли прибираємо запис із PROGRAMS
// через невідповідність чинній Типовій освітній програмі МОН.
export type ProgramChangeEntry = {
  date: string; // YYYY-MM-DD
  subject: string;
  program: string;
  reason: string;
  replacedBy?: string;
};

export const REMOVED_PROGRAMS: ProgramChangeEntry[] = [];
