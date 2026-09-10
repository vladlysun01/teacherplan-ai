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
  // Офіційна назва документа МОН/ІМЗО, з якого розібрана ця програма,
  // її автори та реквізити затвердження — показуємо користувачу при
  // виборі програми, щоб було видно, що план спирається на конкретний
  // офіційний документ, а не на щось абстрактне. Необов'язкові: для
  // частини програм (додавалися раніше) ці дані ще не звірені.
  officialName?: string;
  authors?: string;
  approvedBy?: string;
};
export type Programs = { [subject: string]: { [program: string]: Program } };

export const PROGRAMS: Programs = {
  "Англійська мова": {
    "10-11 класи (поглиблене вивчення)": { id: "english-10-11-advanced", classes: [10,11], description: "Спецшколи з поглибленим вивченням, 5 год/тиждень (рівень В2)", lessonsPerWeek: 5, hasVariant: false, officialName: "Навчальні програми з іноземних мов для спеціалізованих шкіл із поглибленим вивченням іноземних мов. 10-11 класи", approvedBy: "Наказ МОН України від 19.09.2017" },
    "10-11 класи (перша іноземна, рівень стандарту)": { id: "english-10-11-standard", classes: [10,11], description: "Рівень стандарту, 2 год/тиждень (рівень В1)", lessonsPerWeek: 2, hasVariant: false, officialName: "Навчальні програми з іноземних мов для загальноосвітніх навчальних закладів. 10-11 класи", approvedBy: "Наказ МОН України від 19.09.2017" },
    "10-11 класи (друга іноземна мова)": { id: "english-10-11-second", classes: [10,11], description: "Друга іноземна мова, 2 год/тиждень (рівень А2+)", lessonsPerWeek: 2, hasVariant: false, officialName: "Навчальні програми з іноземних мов як другої. 10-11 класи", approvedBy: "Наказ МОН України від 19.09.2017" },
  },
  "Німецька мова": {
    "10-11 класи (поглиблене вивчення)": { id: "german-10-11-advanced", classes: [10,11], description: "Спецшколи з поглибленим вивченням, 5 год/тиждень (рівень В2)", lessonsPerWeek: 5, hasVariant: false, officialName: "Навчальні програми з іноземних мов для спеціалізованих шкіл із поглибленим вивченням іноземних мов. 10-11 класи", approvedBy: "Наказ МОН України від 19.09.2017" },
    "10-11 класи (перша іноземна, рівень стандарту)": { id: "german-10-11-standard", classes: [10,11], description: "Рівень стандарту, 2 год/тиждень (рівень В1)", lessonsPerWeek: 2, hasVariant: false, officialName: "Навчальні програми з іноземних мов для загальноосвітніх навчальних закладів. 10-11 класи", approvedBy: "Наказ МОН України від 19.09.2017" },
    "10-11 класи (друга іноземна мова)": { id: "german-10-11-second", classes: [10,11], description: "Друга іноземна мова, 2 год/тиждень (рівень А2+)", lessonsPerWeek: 2, hasVariant: false, officialName: "Навчальні програми з іноземних мов як другої. 10-11 класи", approvedBy: "Наказ МОН України від 19.09.2017" },
  },
  "Французька мова": {
    "10-11 класи (поглиблене вивчення)": { id: "french-10-11-advanced", classes: [10,11], description: "Спецшколи з поглибленим вивченням, 5 год/тиждень (рівень В2)", lessonsPerWeek: 5, hasVariant: false, officialName: "Навчальні програми з іноземних мов для спеціалізованих шкіл із поглибленим вивченням іноземних мов. 10-11 класи", approvedBy: "Наказ МОН України від 19.09.2017" },
    "10-11 класи (перша іноземна, рівень стандарту)": { id: "french-10-11-standard", classes: [10,11], description: "Рівень стандарту, 2 год/тиждень (рівень В1)", lessonsPerWeek: 2, hasVariant: false, officialName: "Навчальні програми з іноземних мов для загальноосвітніх навчальних закладів. 10-11 класи", approvedBy: "Наказ МОН України від 19.09.2017" },
    "10-11 класи (друга іноземна мова)": { id: "french-10-11-second", classes: [10,11], description: "Друга іноземна мова, 2 год/тиждень (рівень А2+)", lessonsPerWeek: 2, hasVariant: false, officialName: "Навчальні програми з іноземних мов як другої. 10-11 класи", approvedBy: "Наказ МОН України від 19.09.2017" },
  },
  "Іспанська мова": {
    "10-11 класи (поглиблене вивчення)": { id: "spanish-10-11-advanced", classes: [10,11], description: "Спецшколи з поглибленим вивченням, 5 год/тиждень (рівень В2)", lessonsPerWeek: 5, hasVariant: false, officialName: "Навчальні програми з іноземних мов для спеціалізованих шкіл із поглибленим вивченням іноземних мов. 10-11 класи", approvedBy: "Наказ МОН України від 19.09.2017" },
    "10-11 класи (перша іноземна, рівень стандарту)": { id: "spanish-10-11-standard", classes: [10,11], description: "Рівень стандарту, 2 год/тиждень (рівень В1)", lessonsPerWeek: 2, hasVariant: false, officialName: "Навчальні програми з іноземних мов для загальноосвітніх навчальних закладів. 10-11 класи", approvedBy: "Наказ МОН України від 19.09.2017" },
    "10-11 класи (друга іноземна мова)": { id: "spanish-10-11-second", classes: [10,11], description: "Друга іноземна мова, 2 год/тиждень (рівень А2+)", lessonsPerWeek: 2, hasVariant: false, officialName: "Навчальні програми з іноземних мов як другої. 10-11 класи", approvedBy: "Наказ МОН України від 19.09.2017" },
  },
  "Зарубіжна література": {
    "10-11 класи (рівень стандарту)": { id: "zarubizhna-literatura-10-11-standard", classes: [10,11], description: "1 год/тиждень, 34-35 год/рік", lessonsPerWeek: 1, hasVariant: false, officialName: "Зарубіжна література. 10-11 класи. Рівень стандарту", approvedBy: "Наказ МОН України №698 від 03.08.2022" },
    "10-11 класи (профільний рівень)": { id: "zarubizhna-literatura-10-11-profile", classes: [10,11], description: "3 год/тиждень, 102-105 год/рік", lessonsPerWeek: 3, hasVariant: false, officialName: "Зарубіжна література. 10-11 класи. Профільний рівень", approvedBy: "Наказ МОН України №698 від 03.08.2022" },
  },
  "Технології": {
    "10-11 класи (рівень стандарту)": { id: "tehnologii-10-11-standard", classes: [10,11], description: "Проєктні модулі: Кулінарія, Декоративно-ужиткове мистецтво, Основи підприємництва", lessonsPerWeek: 1, hasVariant: false, officialName: "Технології. 10-11 класи (рівень стандарту)", authors: "Терещук А. І. (голова робочої групи), Боринець Н. І., Боровик Д. В., Гащак В. М., Гедзик А. М., Горобець О. В., Дятленко С. М., Жерноклєєв І. В., Лапінський В. В., Лещук Р. М., Медвідь О. Ю., Павич Н. М., Приходько Ю. М., Ходзицька І. Ю., Цина А. Ю." },
  },
  "Фізична культура": {
    "НУШ 5-9 класи": { id: "fizkultura-nush-5-9", classes: [5,6,7,8,9], description: "Базова програма НУШ", lessonsPerWeek: 3, hasVariant: false },
    "10-11 класи (рівень стандарту)": { id: "fizkultura-10-11-standart", classes: [10,11], description: "2 год/тиждень", lessonsPerWeek: 2, hasVariant: true, variantModules: [{ id:"basketball",name:"Баскетбол"},{ id:"volleyball",name:"Волейбол"},{ id:"football",name:"Футбол"},{ id:"athletics",name:"Легка атлетика"},{ id:"gymnastics",name:"Гімнастика"},{ id:"badminton",name:"Бадмінтон"}], variantRequired: 2 },
    "10-11 класи (профільний рівень)": { id: "fizkultura-10-11-profil", classes: [10,11], description: "4-5 год/тиждень", lessonsPerWeek: [4,5], hasVariant: true, variantModules: [{ id:"basketball",name:"Баскетбол (поглиблений)"},{ id:"volleyball",name:"Волейбол (поглиблений)"},{ id:"football",name:"Футбол (поглиблений)"},{ id:"athletics",name:"Легка атлетика (поглиблена)"},{ id:"gymnastics",name:"Гімнастика (поглиблена)"}], variantRequired: 1 },
  },
  "Українська мова": {
    "НУШ 5-9 класи": { id: "ukrainian-nush-5-9", classes: [5,6,7,8,9], description: "Базова програма НУШ", lessonsPerWeek: [2,4], hasVariant: false },
    "10-11 класи (рівень стандарту)": { id: "ukrainian-10-11-standard", classes: [10,11], description: "2-3 год/тиждень", lessonsPerWeek: [2,3], hasVariant: false, officialName: "Українська мова. 10-11 класи. Рівень стандарту", authors: "Голуб Н.Б., Котусенко О.Ю., Горошкіна О.М., Новосьолова В.І., Романенко Ю.О., Кондесюк Т.В., Король О.М., Тарасенко О.О., Сергєєва Н.В.", approvedBy: "Наказ МОН України №1407 від 23.10.2017" },
    "10-11 класи (профільний рівень)": { id: "ukrainian-10-11-profile", classes: [10,11], description: "4-5 год/тиждень", lessonsPerWeek: [4,5], hasVariant: false, officialName: "Українська мова. 10-11 класи. Профільний рівень", approvedBy: "Наказ МОН України №1407 від 23.10.2017" },
  },
  "Українська література": {
    "НУШ 5-9 класи": { id: "ukrainian-literature-nush-5-9", classes: [5,6,7,8,9], description: "Базова програма НУШ", lessonsPerWeek: 2, hasVariant: false },
    "10-11 класи (рівень стандарту)": { id: "ukrainian-literature-10-11-standard", classes: [10,11], description: "2 год/тиждень, 70 год/рік", lessonsPerWeek: 2, hasVariant: false, officialName: "Українська література. 10-11 класи. Рівень стандарту", authors: "Мовчан Р.В. (голова робочої групи), Молочко С.Р., Дроздовський Д.І., Коваленко Л.Т., Фасоля А.М., Цимбалюк В.І.", approvedBy: "Наказ МОН України №1407 від 23.10.2017" },
  },
  "Математика": {
    "10-11 класи (рівень стандарту)": { id: "mathematics-10-11-standard", classes: [10,11], description: "3 год/тиждень", lessonsPerWeek: 3, hasVariant: false, approvedBy: "Наказ МОН України №1407 від 23.10.2017" },
    "10-11 класи (поглиблений рівень)": { id: "mathematics-10-11-advanced", classes: [10,11], description: "4 год/тиждень", lessonsPerWeek: 4, hasVariant: false, approvedBy: "Наказ МОН України №1407 від 23.10.2017" },
    "10-11 класи (профільний рівень)": { id: "mathematics-10-11-profile", classes: [10,11], description: "5-6 год/тиждень", lessonsPerWeek: [5,6], hasVariant: false, approvedBy: "Наказ МОН України №1407 від 23.10.2017" },
  },
  "Інформатика": {
    "10-11 класи (рівень стандарту)": { id: "informatics-10-11-standard", classes: [10,11], description: "1-2 год/тиждень", lessonsPerWeek: [1,2], hasVariant: false, approvedBy: "Наказ МОН України №1407 від 23.10.2017" },
  },
  "Історія України": {
    "10-11 класи": { id: "history-ukraine-10-11", classes: [10,11], description: "Інтегрований курс", lessonsPerWeek: 2, hasVariant: false, officialName: "Історія України. 10-11 класи", approvedBy: "Наказ МОН України №1407 від 23.10.2017" },
  },
  "Всесвітня історія": {
    "НУШ 6-9 класи": { id: "world-history-nush-6-9", classes: [6,7,8,9], description: "Базова програма НУШ", lessonsPerWeek: 1, hasVariant: false },
    "10-11 класи": { id: "world-history-10-11", classes: [10,11], description: "Старша школа", lessonsPerWeek: 1, hasVariant: false, officialName: "Всесвітня історія. 10-11 класи", approvedBy: "Наказ МОН України №1407 від 23.10.2017" },
  },
  "Мистецтво": {
    "10-11 класи (профільний рівень)": { id: "art-10-11-profile", classes: [10,11], description: "Поглиблене вивчення мистецтва", lessonsPerWeek: 2, hasVariant: false, officialName: "Мистецтво. 10-11 класи. Профільний рівень", authors: "Абрамян Т.О., Арістова Л.С., Гайдамака О.В., Гараздовська М.Т., Гречана О.І., Гурик О.М., Новикова Н.В., Пірог А.Г., Просіна О.В.", approvedBy: "Наказ МОН України №1407 від 23.10.2017" },
  },
  "Географія": {
    "6 клас": { id: "geography-6", classes: [6], description: "Загальна географія (2 год/тиждень, 70 год)", lessonsPerWeek: 2, hasVariant: false },
    "7 клас": { id: "geography-7", classes: [7], description: "Материки та океани (2 год/тиждень, 70 год)", lessonsPerWeek: 2, hasVariant: false },
    "8 клас": { id: "geography-8", classes: [8], description: "Україна у світі: природа, населення (2 год/тиждень, 70 год)", lessonsPerWeek: 2, hasVariant: false },
    "9 клас": { id: "geography-9", classes: [9], description: "Україна і світове господарство (1.5 год/тиждень, 52 год)", lessonsPerWeek: [1,2], hasVariant: false },
    "10 клас": { id: "geography-10", classes: [10], description: "Регіони та країни (1.5 год/тиждень, 52 год)", lessonsPerWeek: [1,2], hasVariant: false, approvedBy: "Наказ МОН України №1407 від 23.10.2017" },
    "11 клас": { id: "geography-11", classes: [11], description: "Географічний простір Землі (1 год/тиждень, 35 год)", lessonsPerWeek: 1, hasVariant: false, approvedBy: "Наказ МОН України №1407 від 23.10.2017" },
  },
  "Основи правознавства": {
    "9 клас": { id: "law-9", classes: [9], description: "Основи правознавства (1 год/тиждень, 35 год)", lessonsPerWeek: 1, hasVariant: false },
  },
  "Хімія": {
    "7 клас": { id: "chemistry-7", classes: [7], description: "Початкові хімічні поняття (1.5 год/тиждень, 51 год)", lessonsPerWeek: [1,2], hasVariant: false },
    "8 клас": { id: "chemistry-8", classes: [8], description: "Будова атома, хімічний зв'язок, класи сполук (2 год/тиждень, 68 год)", lessonsPerWeek: 2, hasVariant: false },
    "9 клас": { id: "chemistry-9", classes: [9], description: "Розчини, хімічні реакції, органічні сполуки (2 год/тиждень, 68 год)", lessonsPerWeek: 2, hasVariant: false },
    "10 клас (рівень стандарту)": { id: "chemistry-10-standard", classes: [10], description: "Органічна хімія (1.5 год/тиждень, 52 год)", lessonsPerWeek: [1,2], hasVariant: false, approvedBy: "Наказ МОН України №1407 від 23.10.2017" },
    "11 клас (рівень стандарту)": { id: "chemistry-11-standard", classes: [11], description: "Загальна та неорганічна хімія (2 год/тиждень, 70 год)", lessonsPerWeek: 2, hasVariant: false, approvedBy: "Наказ МОН України №1407 від 23.10.2017" },
  },
  "Біологія": {
    "6 клас": { id: "biology-6", classes: [6], description: "Різноманітність живої природи (2 год/тиждень, 70 год)", lessonsPerWeek: 2, hasVariant: false },
    "7 клас": { id: "biology-7", classes: [7], description: "Тварини (2 год/тиждень, 70 год)", lessonsPerWeek: 2, hasVariant: false },
    "8 клас": { id: "biology-8", classes: [8], description: "Людина (2 год/тиждень, 70 год)", lessonsPerWeek: 2, hasVariant: false },
    "9 клас": { id: "biology-9", classes: [9], description: "Молекулярна біологія, генетика, еволюція (2 год/тиждень, 70 год)", lessonsPerWeek: 2, hasVariant: false },
    "10 клас (рівень стандарту)": { id: "biology-10-standard", classes: [10], description: "Біологія і екологія (1.5 год/тиждень, 52 год)", lessonsPerWeek: [1,2], hasVariant: false },
    "11 клас (рівень стандарту)": { id: "biology-11-standard", classes: [11], description: "Біологія і екологія (1.5 год/тиждень, 52 год)", lessonsPerWeek: [1,2], hasVariant: false },
    "10 клас (профільний рівень)": { id: "biology-10-profile", classes: [10], description: "Біологія і екологія, профіль (5 год/тиждень, 175 год)", lessonsPerWeek: 5, hasVariant: false, officialName: "Біологія і екологія. 10-11 класи. Профільний рівень" },
    "11 клас (профільний рівень)": { id: "biology-11-profile", classes: [11], description: "Біологія і екологія, профіль (5 год/тиждень, 175 год)", lessonsPerWeek: 5, hasVariant: false, officialName: "Біологія і екологія. 10-11 класи. Профільний рівень" },
  },
  "Фізика": {
    "10 клас (рівень стандарту)": { id: "physics-10-standard", classes: [10], description: "Механіка, МКТ, електростатика (3 год/тиждень, 105 год)", lessonsPerWeek: 3, hasVariant: false, officialName: "Фізика. 10-11 класи. Рівень стандарту", authors: "Авторський колектив під керівництвом Локтєва В.М.", approvedBy: "Наказ МОН України №1407 від 23.10.2017" },
    "11 клас (рівень стандарту)": { id: "physics-11-standard", classes: [11], description: "Електродинаміка, оптика, ядерна фізика (3 год/тиждень, 105 год)", lessonsPerWeek: 3, hasVariant: false, officialName: "Фізика. 10-11 класи. Рівень стандарту", authors: "Авторський колектив під керівництвом Локтєва В.М.", approvedBy: "Наказ МОН України №1407 від 23.10.2017" },
  },
  "Захист України": {
    "10-11 класи (профільний рівень)": { id: "defense-ukraine-10-11-profile", classes: [10,11], description: "6 год/тиждень, 210 год на рік", lessonsPerWeek: 6, hasVariant: false },
  },
  "Фінансова грамотність": {
    "10-11 класи (курс за вибором)": { id: "financial-literacy-10-11", classes: [10,11], description: "Курс за вибором, 3 год/тиждень, 105 год", lessonsPerWeek: 3, hasVariant: false, officialName: "Навчальна програма курсу за вибором «Фінансова грамотність» для учнів 10, 11 класів" },
  },
  "Астрономія": {
    "11 клас (рівень стандарту)": { id: "astronomy-11-standard", classes: [11], description: "Рівень стандарту (1 год/тиждень, 35 год)", lessonsPerWeek: 1, hasVariant: false, officialName: "Астрономія. Рівень стандарту. 11 клас", authors: "Яцків Я. С. (голова робочої групи), Івченко В. М., Казанцев А. М., Ващенко О. П., Крячко І. П.", approvedBy: "Робоча група сформована НАН України" },
    "10-11 класи (профільний рівень)": { id: "astronomy-10-11-profile", classes: [10,11], description: "Профільний рівень (1 год/тиждень, 70 год на курс)", lessonsPerWeek: 1, hasVariant: false, officialName: "Астрономія. Профільний рівень. 10-11 класи", authors: "Яцків Я. С. (голова робочої групи), Івченко В. М., Казанцев А. М., Ващенко О. П., Крячко І. П.", approvedBy: "Робоча група сформована НАН України" },
  },
  "Природничі науки": {
    "10-11 класи (інтегрований курс)": { id: "pryrodnychi-nauky-10-11", classes: [10,11], description: "Інтегрований курс для нефізичного профілю, 4 год/тиждень, 280 год на курс", lessonsPerWeek: 4, hasVariant: false, officialName: "Природничі науки. Інтегрований курс. 10-11 класи", authors: "Дьоміна І., Задоянний В., Костик С.", approvedBy: "Наказ МОН України №1407 від 23.10.2017" },
  },
  "Історія: Україна і світ": {
    "10-11 класи (інтегрований курс)": { id: "history-ua-world-10-11", classes: [10,11], description: "Інтегрований курс історії України та всесвітньої історії, 2 год/тиждень, 70 год/рік у кожному класі", lessonsPerWeek: 2, hasVariant: false, officialName: "Історія: Україна і світ. 10-11 класи", authors: "Патриляк І. (голова робочої групи), Мудрий М., Байкеніч Г., Гриневич Л. та ін.", approvedBy: "Наказ МОН України №698 від 03.08.2022" },
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
  "Технології": "tehnologii",
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
  "Астрономія": "astronomiya",
  "Природничі науки": "pryrodnychi-nauky",
  "Історія: Україна і світ": "istoriya-ukrayina-i-svit",
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
