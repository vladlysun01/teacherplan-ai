/**
 * Модулі та теми для географії 10 клас
 * "Географія: регіони та країни"
 * 52 години (1.5 год/тиждень)
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

// Вступ (2 год)
export const intro10: GeographyModule = {
  name: "Вступ",
  topics: [
    { topic: "Що вивчає курс «Географія: регіони і країни». Регіони світу. Глобалізація", hours: 1 },
    { topic: "Джерела знань про регіони та країни світу. Політична карта світу", hours: 1 }
  ]
};

// Розділ I. ЄВРОПА (16 год)
export const europeGeneral10: GeographyModule = {
  name: "Розділ I. ЄВРОПА. Загальна характеристика Європи",
  topics: [
    { topic: "Економіко-географічне положення Європи. Політична карта", hours: 1 },
    { topic: "Природні умови і ресурси Європи", hours: 1 },
    { topic: "Населення Європи. Демографічні процеси та урбанізація", hours: 1 },
    { topic: "Особливості економіки країн Європи. Первинний сектор", hours: 1 },
    { topic: "Вторинний сектор економіки Європи. Реіндустріалізація", hours: 1 },
    { topic: "Третинний сектор економіки. Транспортні коридори. Практична робота №1", hours: 1 }
  ]
};

export const europeCountries10: GeographyModule = {
  name: "Розділ I. ЄВРОПА. Країни Європи",
  topics: [
    { topic: "Німеччина. Економіко-географічна характеристика", hours: 2 },
    { topic: "Франція. Економіко-географічна характеристика", hours: 1 },
    { topic: "Велика Британія. Економіко-географічна характеристика", hours: 1 },
    { topic: "Італія. Економіко-географічна характеристика", hours: 1 },
    { topic: "Польща. Економіко-географічна характеристика", hours: 1 },
    { topic: "Росія. Економіко-географічна характеристика", hours: 1 },
    { topic: "Узагальнення теми «Європа». Практична робота №2", hours: 2 }
  ]
};

// Розділ II. АЗІЯ (11 год)
export const asiaGeneral10: GeographyModule = {
  name: "Розділ II. АЗІЯ. Загальна характеристика Азії",
  topics: [
    { topic: "Економіко-географічне положення Азії. Політична карта", hours: 1 },
    { topic: "Природні умови і ресурси Азії", hours: 1 },
    { topic: "Населення Азії. Урбанізація. Працересурсний потенціал", hours: 1 },
    { topic: "Особливості економіки країн Азії. Первинний та вторинний сектори", hours: 1 },
    { topic: "Третинний сектор економіки Азії. Практична робота №3", hours: 1 }
  ]
};

export const asiaCountries10: GeographyModule = {
  name: "Розділ II. АЗІЯ. Країни Азії",
  topics: [
    { topic: "Японія. Економіко-географічна характеристика", hours: 1 },
    { topic: "Китай. Економіко-географічна характеристика", hours: 2 },
    { topic: "Індія. Економіко-географічна характеристика", hours: 1 },
    { topic: "Республіка Корея. Економіко-географічна характеристика", hours: 1 },
    { topic: "Узагальнення теми «Азія». Практична робота №4", hours: 1 }
  ]
};

// Розділ III. ОКЕАНІЯ (3 год)
export const oceania10: GeographyModule = {
  name: "Розділ III. ОКЕАНІЯ",
  topics: [
    { topic: "Австралія. Економіко-географічна характеристика", hours: 2 },
    { topic: "Мікронезія, Меланезія, Полінезія. Нова Зеландія", hours: 1 }
  ]
};

// Розділ IV. АМЕРИКА (8 год)
export const americaGeneral10: GeographyModule = {
  name: "Розділ IV. АМЕРИКА. Загальна характеристика",
  topics: [
    { topic: "Географічне положення Америки. Політична карта", hours: 1 },
    { topic: "Природні умови і ресурси. Населення Америки", hours: 1 },
    { topic: "Особливості економіки країн Америки. Первинний та вторинний сектори", hours: 1 },
    { topic: "Третинний сектор економіки Америки. Практична робота №5", hours: 1 }
  ]
};

export const americaCountries10: GeographyModule = {
  name: "Розділ IV. АМЕРИКА. Країни Америки",
  topics: [
    { topic: "США. Економіко-географічна характеристика", hours: 1 },
    { topic: "Канада. Економіко-географічна характеристика", hours: 1 },
    { topic: "Бразилія. Економіко-географічна характеристика", hours: 1 },
    { topic: "Узагальнення теми «Америка». Практична робота №6", hours: 1 }
  ]
};

// Розділ V. АФРИКА (5 год)
export const africa10: GeographyModule = {
  name: "Розділ V. АФРИКА",
  topics: [
    { topic: "Загальна характеристика Африки. Політична карта", hours: 1 },
    { topic: "Природні умови, ресурси та населення Африки", hours: 1 },
    { topic: "Особливості економіки країн Африки. Практична робота №7", hours: 1 },
    { topic: "Єгипет. Економіко-географічна характеристика", hours: 1 },
    { topic: "ПАР. Економіко-географічна характеристика", hours: 1 }
  ]
};

// Розділ VI. УКРАЇНА В МІЖНАРОДНОМУ ПРОСТОРІ (2 год)
export const ukraine10: GeographyModule = {
  name: "Розділ VI. УКРАЇНА В МІЖНАРОДНОМУ ПРОСТОРІ",
  topics: [
    { topic: "Україна в геополітичному вимірі", hours: 1 },
    { topic: "Україна в системі глобальних економічних відносин", hours: 1 }
  ]
};

// Всі модулі 10 класу
export const allModules10: GeographyModule[] = [
  intro10,
  europeGeneral10,
  europeCountries10,
  asiaGeneral10,
  asiaCountries10,
  oceania10,
  americaGeneral10,
  americaCountries10,
  africa10,
  ukraine10
];

// Підрахунок годин
export function getTotalHours10(): number {
  let total = 0;
  allModules10.forEach(module => {
    module.topics.forEach(topic => {
      total += topic.hours;
    });
  });
  return total; // 47 годин + 5 резерв = 52
}

// Отримання модулів для вибраних тем
export function getSelectedModules10(selectedModules: string[]): GeographyModule[] {
  return allModules10.filter(module => selectedModules.includes(module.name));
}
