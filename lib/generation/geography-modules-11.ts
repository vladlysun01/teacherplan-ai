/**
 * Модулі та теми для географії 11 клас
 * "Географічний простір Землі"
 * 35 годин (1 год/тиждень)
 * Затверджено МОН України, наказ №698 від 03.08.2022
 */

export interface GeographyTopic {
  topic: string;
  hours: number;
}

export interface GeographyModule {
  name: string;
  topics: GeographyTopic[];
}

// Вступ (1 год)
export const intro11: GeographyModule = {
  name: "Вступ",
  topics: [
    { topic: "Географія як система наук. Геосистеми. Роль географії", hours: 1 }
  ]
};

// Розділ I. ТОПОГРАФІЯ ТА КАРТОГРАФІЯ (5 год)
export const topography11: GeographyModule = {
  name: "Розділ I. ТОПОГРАФІЯ ТА КАРТОГРАФІЯ. Топографія",
  topics: [
    { topic: "Топографічна карта. Географічні та прямокутні координати", hours: 1 },
    { topic: "Умовні позначення. Азимути. Практична робота №1", hours: 1 },
    { topic: "Плани населених пунктів. Практична робота №2", hours: 1 }
  ]
};

export const cartography11: GeographyModule = {
  name: "Розділ I. ТОПОГРАФІЯ ТА КАРТОГРАФІЯ. Картографія",
  topics: [
    { topic: "Сучасні картографічні твори. Математична основа карт", hours: 1 },
    { topic: "Електронні карти. ГІС. Навігаційні системи. Практична робота №3", hours: 1 }
  ]
};

// Розділ II. ГЕОГРАФІЧНА ОБОЛОНКА ЗЕМЛІ (12 год)
export const earthMovements11: GeographyModule = {
  name: "Розділ II. ГЕОГРАФІЧНА ОБОЛОНКА. Рухи Землі",
  topics: [
    { topic: "Рухи Землі та їх географічні наслідки. Поясний час", hours: 1 }
  ]
};

export const geographicShell11: GeographyModule = {
  name: "Розділ II. ГЕОГРАФІЧНА ОБОЛОНКА. Географічна оболонка Землі",
  topics: [
    { topic: "Склад та закономірності географічної оболонки. Антропосфера", hours: 1 }
  ]
};

export const lithosphere11: GeographyModule = {
  name: "Розділ II. ГЕОГРАФІЧНА ОБОЛОНКА. Геологічне середовище",
  topics: [
    { topic: "Літосфера. Тектоніка літосферних плит. Вулканізм і сейсмічність", hours: 1 },
    { topic: "Рельєф. Тектонічні структури та форми рельєфу", hours: 1 },
    { topic: "Мінеральні ресурси. Забезпеченість ресурсами. Практична робота №4", hours: 1 }
  ]
};

export const atmosphere11: GeographyModule = {
  name: "Розділ II. ГЕОГРАФІЧНА ОБОЛОНКА. Атмосфера та системи Землі",
  topics: [
    { topic: "Атмосфера. Температурний режим. Атмосферний тиск", hours: 1 },
    { topic: "Погода. Синоптичні карти. Практична робота №5", hours: 1 },
    { topic: "Клімат. Кліматотвірні чинники. Типи клімату", hours: 1 }
  ]
};

export const hydrosphere11: GeographyModule = {
  name: "Розділ II. ГЕОГРАФІЧНА ОБОЛОНКА. Гідросфера та системи Землі",
  topics: [
    { topic: "Світовий океан. Система течій. Практична робота №6", hours: 1 },
    { topic: "Води суходолу. Річки, озера. Водозабезпеченість", hours: 1 }
  ]
};

export const biosphere11: GeographyModule = {
  name: "Розділ II. ГЕОГРАФІЧНА ОБОЛОНКА. Біосфера та системи Землі",
  topics: [
    { topic: "Біосфера. Ґрунти та їх типи", hours: 1 },
    { topic: "Природні зони. Зв'язок ґрунтів і природних зон", hours: 1 }
  ]
};

// Розділ III. СУСПІЛЬНО-ГЕОГРАФІЧНІ ЗАКОНОМІРНОСТІ (8 год)
export const geographicSpace11: GeographyModule = {
  name: "Розділ III. СУСПІЛЬНО-ГЕОГРАФІЧНІ ЗАКОНОМІРНОСТІ. Географічний простір",
  topics: [
    { topic: "Географічний простір. Світосистема та її підсистеми", hours: 1 }
  ]
};

export const demographics11: GeographyModule = {
  name: "Розділ III. СУСПІЛЬНО-ГЕОГРАФІЧНІ ЗАКОНОМІРНОСТІ. Демографічні процеси",
  topics: [
    { topic: "Динаміка населення світу. Демографічний перехід. Практична робота №7", hours: 1 },
    { topic: "Міграції. Якість життя. Демографічні прогнози", hours: 1 }
  ]
};

export const globalEconomy11: GeographyModule = {
  name: "Розділ III. СУСПІЛЬНО-ГЕОГРАФІЧНІ ЗАКОНОМІРНОСТІ. Глобальна економіка",
  topics: [
    { topic: "Глобальна економіка. Світовий ринок технологій", hours: 1 },
    { topic: "Міжнародна спеціалізація. ТНК. Ланцюги доданої вартості", hours: 1 },
    { topic: "Сільське господарство. Видобування ресурсів. Металургія. Практична робота №8", hours: 1 },
    { topic: "Машинобудування. Легка промисловість. Транспорт. Туризм", hours: 1 }
  ]
};

export const politicalGeography11: GeographyModule = {
  name: "Розділ III. СУСПІЛЬНО-ГЕОГРАФІЧНІ ЗАКОНОМІРНОСТІ. Політична географія",
  topics: [
    { topic: "Політична географія та геополітика. Територіально-політичні системи", hours: 1 }
  ]
};

// Розділ IV. СУСПІЛЬНА ГЕОГРАФІЯ УКРАЇНИ (8 год)
export const ukraineState11: GeographyModule = {
  name: "Розділ IV. СУСПІЛЬНА ГЕОГРАФІЯ УКРАЇНИ. Українська держава",
  topics: [
    { topic: "Українська держава. Політико-географічне положення України", hours: 1 }
  ]
};

export const ukrainePopulation11: GeographyModule = {
  name: "Розділ IV. СУСПІЛЬНА ГЕОГРАФІЯ УКРАЇНИ. Населення України",
  topics: [
    { topic: "Населення України. Демографічні процеси. Практична робота №9", hours: 1 },
    { topic: "Система розселення. Урбанізація. Міграції", hours: 1 }
  ]
};

export const ukraineEconomy11: GeographyModule = {
  name: "Розділ IV. СУСПІЛЬНА ГЕОГРАФІЯ УКРАЇНИ. Економіка України",
  topics: [
    { topic: "Економіка України. Конкурентні переваги на світових ринках", hours: 1 },
    { topic: "Енергетика України. Авіаракетна техніка. Машинобудування", hours: 1 },
    { topic: "Фармацевтика. Меблі, текстиль. Транспортні коридори. Практична робота №10", hours: 1 },
    { topic: "Програмне забезпечення. Туризм. Фінанси. Інвестиції", hours: 1 },
    { topic: "Стратегія збалансованого розвитку України", hours: 1 }
  ]
};

// Всі модулі 11 класу
export const allModules11: GeographyModule[] = [
  intro11,
  topography11,
  cartography11,
  earthMovements11,
  geographicShell11,
  lithosphere11,
  atmosphere11,
  hydrosphere11,
  biosphere11,
  geographicSpace11,
  demographics11,
  globalEconomy11,
  politicalGeography11,
  ukraineState11,
  ukrainePopulation11,
  ukraineEconomy11
];

// Підрахунок годин
export function getTotalHours11(): number {
  let total = 0;
  allModules11.forEach(module => {
    module.topics.forEach(topic => {
      total += topic.hours;
    });
  });
  return total; // 33 години + 2 резерв = 35
}

// Отримання модулів для вибраних тем
export function getSelectedModules11(selectedModules: string[]): GeographyModule[] {
  return allModules11.filter(module => selectedModules.includes(module.name));
}
