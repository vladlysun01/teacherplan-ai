/**
 * Генератор календарно-тематичних планів з інформатики
 * Для 10-11 класів (рівень стандарту)
 */

import {
  InformaticsModule,
  getAllModules,
  getBaseModule,
  getElectiveModules,
  selectModulesForYear,
  RECOMMENDED_SETS
} from './informatics-modules';

// ============================================================================
// ІНТЕРФЕЙСИ
// ============================================================================

export interface InformaticsPlanSettings {
  class: '10' | '11';
  subject: 'Інформатика';
  schoolYear: string;
  semester: number | string;  // ✅ Може бути рядок з форми
  weekdays: number[] | string;  // ✅ Може бути рядок "Пн,Ср"
  startDate: Date | string;  // ✅ Може бути рядок
  teacherName: string;
  teacherCategory: string;
  schoolName: string;
  selectedModules: string[]; // назви вибраних вибіркових модулів
  profile?: 'універсальний' | 'програмування' | 'веб-розробка' | 'дані-аналітика' | 'мережі';
}

export interface InformaticsLesson {
  lessonNumber: number;
  date: string;
  topic: string;
  moduleNumber: number;
  moduleName: string;
  lessonType: string;
  content: {
    organizationalMoment?: string;
    actualization: string;
    motivation: string;
    mainPart: string;
    practice?: string;
    consolidation: string;
    homework: string;
  };
  equipment: string[];
  expectedResults: string;
}

// ============================================================================
// ГЕНЕРАЦІЯ ДАТ
// ============================================================================

function generateDates(
  startDate: Date,
  weekdays: number[],
  totalLessons: number
): Date[] {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);

  while (dates.length < totalLessons) {
    const dayOfWeek = currentDate.getDay();
    const adjustedDay = dayOfWeek === 0 ? 7 : dayOfWeek;

    if (weekdays.includes(adjustedDay)) {
      dates.push(new Date(currentDate));
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

// ============================================================================
// РОЗПОДІЛ МОДУЛІВ ПО СЕМЕСТРАХ
// ============================================================================

function distributeModulesBySemesters(
  modules: InformaticsModule[],
  semester: number
): InformaticsModule[] {
  if (semester === 0) {
    return modules; // весь рік
  }

  const totalHours = modules.reduce((sum, m) => sum + m.hours, 0);
  const semester1Hours = Math.ceil(totalHours / 2);

  if (semester === 1) {
    const result: InformaticsModule[] = [];
    let hours = 0;

    for (const module of modules) {
      if (hours + module.hours <= semester1Hours) {
        result.push(module);
        hours += module.hours;
      } else if (hours < semester1Hours) {
        // Розділити модуль
        const remainingHours = semester1Hours - hours;
        result.push({
          ...module,
          hours: remainingHours,
          topics: module.topics.slice(0, remainingHours)
        });
        break;
      }
    }
    return result;
  } else {
    const result: InformaticsModule[] = [];
    let hours = 0;
    let skipHours = semester1Hours;

    for (const module of modules) {
      if (skipHours >= module.hours) {
        skipHours -= module.hours;
      } else if (skipHours > 0) {
        // Продовження модуля з 1 семестру
        result.push({
          ...module,
          hours: module.hours - skipHours,
          topics: module.topics.slice(skipHours)
        });
        skipHours = 0;
      } else {
        result.push(module);
      }
    }
    return result;
  }
}

// ============================================================================
// ГЕНЕРАЦІЯ ЗМІСТУ УРОКУ
// ============================================================================

function determineLessonType(topic: string): string {
  if (topic.toLowerCase().includes('практична робота')) {
    return 'Практична робота';
  }
  if (topic.toLowerCase().includes('проєкт') || topic.toLowerCase().includes('захист')) {
    return 'Проєктна діяльність';
  }
  if (topic.toLowerCase().includes('вступ') || topic.toLowerCase().includes('підсумк')) {
    return 'Урок узагальнення';
  }
  return 'Комбінований урок';
}

function generateDetailedContent(
  topic: string,
  moduleName: string,
  lessonNumber: number,
  lessonType: string
): InformaticsLesson['content'] {
  const isPractical = lessonType === 'Практична робота';
  const isProject = lessonType === 'Проєктна діяльність';
  const isFirst = lessonNumber === 1;

  const content: InformaticsLesson['content'] = {
    actualization: '',
    motivation: '',
    mainPart: '',
    consolidation: '',
    homework: ''
  };

  // Організаційний момент (тільки для першого уроку)
  if (isFirst) {
    content.organizationalMoment = 
      'Привітання. Перевірка присутніх. Інструктаж з техніки безпеки та правил поведінки в комп\'ютерному класі. Ознайомлення з вимогами до предмета та системою оцінювання.';
  }

  // Актуалізація знань
  if (lessonNumber === 1) {
    content.actualization = 
      'Бесіда про роль інформатики в сучасному світі. Обговорення власного досвіду використання комп\'ютерів та гаджетів.';
  } else {
    content.actualization = 
      'Фронтальне опитування з теми попереднього уроку. Перевірка виконання домашнього завдання. Обговорення практичних прикладів застосування вивченого матеріалу.';
  }

  // Мотивація
  if (isPractical) {
    content.motivation = 
      `Демонстрація практичного застосування навичок, що будуть відпрацьовуватись. Обговорення важливості цих умінь для майбутньої професійної діяльності.`;
  } else if (isProject) {
    content.motivation = 
      'Презентація кращих студентських проєктів попередніх років. Обговорення критеріїв оцінювання та очікуваних результатів.';
  } else {
    content.motivation = 
      `Презентація реальних прикладів з теми "${topic}". Демонстрація актуальності матеріалу для сучасних ІТ-професій та повсякденного життя.`;
  }

  // Основна частина
  if (isPractical) {
    content.mainPart = 
      `Інструктаж з виконання практичної роботи. Демонстрація алгоритму виконання. Самостійна робота учнів за комп'ютерами з індивідуальним консультуванням вчителя. Перевірка правильності виконання завдань.`;
    
    content.practice = 
      'Учні виконують практичні завдання за комп\'ютерами. Вчитель здійснює індивідуальне консультування та контроль виконання роботи.';
  } else if (isProject) {
    content.mainPart = 
      'Презентація учнівських проєктів. Обговорення технічних рішень та креативних підходів. Оцінювання робіт за встановленими критеріями.';
  } else {
    content.mainPart = 
      `Пояснення нового матеріалу з використанням презентації та демонстрації на комп'ютері. Розгляд теоретичних основ та практичних прикладів. Інтерактивна взаємодія з учнями через запитання та обговорення. Демонстрація роботи програмного забезпечення або технологій.`;
  }

  // Закріплення
  if (isPractical) {
    content.consolidation = 
      'Обговорення результатів виконаної роботи. Аналіз типових помилок. Відповіді на запитання учнів.';
  } else if (isProject) {
    content.consolidation = 
      'Підведення підсумків презентації проєктів. Виділення найцікавіших технічних рішень та креативних підходів.';
  } else {
    content.consolidation = 
      'Фронтальне опитування для перевірки засвоєння матеріалу. Розв\'язування коротких завдань або тестових запитань. Обговорення ключових понять теми.';
  }

  // Домашнє завдання
  if (isPractical) {
    content.homework = 
      'Завершити практичну роботу (якщо не встигли на уроці). Підготувати звіт про виконану роботу. Опрацювати теоретичний матеріал за підручником.';
  } else if (isProject) {
    content.homework = 
      'Проаналізувати презентовані проєкти. Підготувати власні ідеї для наступного проєкту.';
  } else {
    content.homework = 
      `Опрацювати конспект уроку та відповідний розділ підручника. Підготувати відповіді на контрольні запитання. Знайти в Інтернеті додаткові приклади з теми "${topic}".`;
  }

  return content;
}

function generateEquipment(lessonType: string, moduleName: string): string[] {
  const basicEquipment = [
    'Комп\'ютери для учнів',
    'Комп\'ютер вчителя',
    'Проєктор або інтерактивна дошка',
    'Підключення до Інтернету'
  ];

  if (lessonType === 'Практична робота') {
    if (moduleName.includes('Веб-технології')) {
      return [...basicEquipment, 'Текстовий редактор коду (VS Code)', 'Веб-браузери'];
    }
    if (moduleName.includes('Python')) {
      return [...basicEquipment, 'Python IDE (PyCharm або IDLE)', 'Інтерпретатор Python'];
    }
    if (moduleName.includes('Мультимедійні')) {
      return [...basicEquipment, 'Графічні редактори (GIMP, Inkscape)', 'Відеоредактор'];
    }
    if (moduleName.includes('базами даних')) {
      return [...basicEquipment, 'СУБД (SQLite, MySQL Workbench)'];
    }
  }

  return basicEquipment;
}

function generateExpectedResults(topic: string, lessonType: string): string {
  if (lessonType === 'Практична робота') {
    return 'Учні вміють застосовувати отримані знання на практиці, виконують практичні завдання самостійно, демонструють сформовані практичні навички.';
  }
  if (lessonType === 'Проєктна діяльність') {
    return 'Учні демонструють вміння працювати над проєктом, презентувати результати своєї роботи, аналізувати та оцінювати роботи інших.';
  }
  return `Учні знають основні поняття з теми "${topic}", розуміють їх практичне застосування, можуть пояснити ключові концепції та навести приклади.`;
}

// ============================================================================
// ГОЛОВНА ФУНКЦІЯ ГЕНЕРАЦІЇ
// ============================================================================

export async function generateInformaticsCalendarPlan(
  settings: any
): Promise<{ success: boolean; lessons: InformaticsLesson[]; error?: string }> {
  try {
    console.log("💻 Інформатика генератор: отримано settings");
    
    // Конвертуємо weekdays з рядка в масив
    let weekdaysArray: number[] = [];
    if (typeof settings.weekdays === 'string') {
      const weekdayNames = settings.weekdays.split(',').map((d: string) => d.trim());
      const dayMap: { [key: string]: number } = {
        'Пн': 1, 'Вт': 2, 'Ср': 3, 'Чт': 4, 'Пт': 5
      };
      weekdaysArray = weekdayNames.map((name: string) => dayMap[name]).filter((d: number) => d);
    } else {
      weekdaysArray = settings.weekdays;
    }
    
    console.log("💻 Дні тижня:", weekdaysArray);
    
    // Конвертуємо semester з рядка в число
    const semester = typeof settings.semester === 'string' ? parseInt(settings.semester) : settings.semester;
    
    // Конвертуємо startDate з рядка в Date
    const startDate = typeof settings.startDate === 'string' ? new Date(settings.startDate) : settings.startDate;
    
    // Вибір модулів
    let modules: InformaticsModule[];
    
    if (settings.profile && typeof settings.profile === 'string' && settings.profile in RECOMMENDED_SETS) {
      modules = RECOMMENDED_SETS[settings.profile as keyof typeof RECOMMENDED_SETS];
    } else if (settings.selectedModules && settings.selectedModules.length > 0) {
      modules = selectModulesForYear(settings.selectedModules);
    } else {
      // За замовчуванням - універсальний набір
      modules = RECOMMENDED_SETS['універсальний'];
    }
    
    console.log("💻 Модулів вибрано:", modules.length);

    // Розподіл по семестрах
    const semesterModules = distributeModulesBySemesters(modules, semester);

    // Підрахунок загальної кількості уроків
    const totalLessons = semesterModules.reduce((sum, module) => sum + module.hours, 0);
    
    console.log("💻 Генерую", totalLessons, "уроків");

    // Генерація дат
    const dates = generateDates(startDate, weekdaysArray, totalLessons);

    // Генерація уроків
    const lessons: InformaticsLesson[] = [];
    let lessonNumber = 1;
    let dateIndex = 0;
    let moduleNumber = 1;

    for (const module of semesterModules) {
      for (let i = 0; i < module.topics.length; i++) {
        const topic = module.topics[i];
        const lessonType = determineLessonType(topic);

        const lesson: InformaticsLesson = {
          lessonNumber,
          date: formatDate(dates[dateIndex]),
          topic,
          moduleNumber,
          moduleName: module.name,
          lessonType,
          content: generateDetailedContent(topic, module.name, lessonNumber, lessonType),
          equipment: generateEquipment(lessonType, module.name),
          expectedResults: generateExpectedResults(topic, lessonType)
        };

        lessons.push(lesson);
        lessonNumber++;
        dateIndex++;
      }
      moduleNumber++;
    }

    return { success: true, lessons };
  } catch (error) {
    return {
      success: false,
      lessons: [],
      error: error instanceof Error ? error.message : 'Невідома помилка'
    };
  }
}

// ============================================================================
// ЕКСПОРТ В HTML
// ============================================================================

export function generateInformaticsHTML(
  lessons: InformaticsLesson[],
  settings: InformaticsPlanSettings
): string {
  const semesterText = settings.semester === 1 
    ? 'І семестр' 
    : settings.semester === 2 
    ? 'ІІ семестр' 
    : 'Річний план';

  let html = `
<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Календарно-тематичний план: Інформатика ${settings.class} клас</title>
  <style>
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      line-height: 1.5;
      margin: 2cm;
    }
    h1, h2, h3 {
      text-align: center;
      font-weight: bold;
    }
    h1 { font-size: 16pt; margin-bottom: 0.5cm; }
    h2 { font-size: 14pt; margin: 0.5cm 0; }
    h3 { font-size: 12pt; margin: 0.3cm 0; }
    .info-block {
      margin: 0.5cm 0;
      line-height: 1.8;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 0.5cm 0;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid black;
      padding: 0.3cm;
      vertical-align: top;
    }
    th {
      background-color: #f0f0f0;
      font-weight: bold;
      text-align: center;
    }
    .lesson-number { width: 5%; text-align: center; }
    .date { width: 8%; text-align: center; }
    .topic { width: 25%; }
    .content { width: 40%; }
    .equipment { width: 12%; }
    .results { width: 10%; }
    .content-section {
      margin: 0.2cm 0;
    }
    .content-section strong {
      display: block;
      margin-bottom: 0.1cm;
    }
    ul {
      margin: 0.2cm 0;
      padding-left: 1cm;
    }
    @media print {
      body { margin: 1.5cm; }
      table { page-break-inside: avoid; }
      tr { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <h1>КАЛЕНДАРНО-ТЕМАТИЧНИЙ ПЛАН</h1>
  <h2>з інформатики для ${settings.class} класу</h2>
  <h3>${semesterText} ${settings.schoolYear} навчального року</h3>

  <div class="info-block">
    <p><strong>Заклад освіти:</strong> ${settings.schoolName}</p>
    <p><strong>Вчитель:</strong> ${settings.teacherName}</p>
    <p><strong>Категорія:</strong> ${settings.teacherCategory}</p>
    <p><strong>Кількість годин на тиждень:</strong> 2 години</p>
    <p><strong>Всього годин за ${semesterText === 'Річний план' ? 'рік' : 'семестр'}:</strong> ${lessons.length}</p>
  </div>

  <table>
    <thead>
      <tr>
        <th class="lesson-number">№</th>
        <th class="date">Дата</th>
        <th class="topic">Тема уроку</th>
        <th class="content">Зміст уроку</th>
        <th class="equipment">Обладнання</th>
        <th class="results">Очікувані результати</th>
      </tr>
    </thead>
    <tbody>
`;

  let currentModule = '';
  
  for (const lesson of lessons) {
    // Додаємо заголовок модуля
    if (lesson.moduleName !== currentModule) {
      html += `
      <tr>
        <td colspan="6" style="background-color: #e0e0e0; font-weight: bold; text-align: center;">
          Модуль ${lesson.moduleNumber}: ${lesson.moduleName}
        </td>
      </tr>
`;
      currentModule = lesson.moduleName;
    }

    html += `
      <tr>
        <td class="lesson-number">${lesson.lessonNumber}</td>
        <td class="date">${lesson.date}</td>
        <td class="topic">
          <strong>${lesson.topic}</strong><br>
          <em>(${lesson.lessonType})</em>
        </td>
        <td class="content">
`;

    if (lesson.content.organizationalMoment) {
      html += `
          <div class="content-section">
            <strong>Організаційний момент:</strong>
            ${lesson.content.organizationalMoment}
          </div>
`;
    }

    html += `
          <div class="content-section">
            <strong>Актуалізація (3-5 хв):</strong>
            ${lesson.content.actualization}
          </div>
          <div class="content-section">
            <strong>Мотивація (2-3 хв):</strong>
            ${lesson.content.motivation}
          </div>
          <div class="content-section">
            <strong>Основна частина (30-35 хв):</strong>
            ${lesson.content.mainPart}
          </div>
`;

    if (lesson.content.practice) {
      html += `
          <div class="content-section">
            <strong>Практична робота:</strong>
            ${lesson.content.practice}
          </div>
`;
    }

    html += `
          <div class="content-section">
            <strong>Закріплення (5-7 хв):</strong>
            ${lesson.content.consolidation}
          </div>
          <div class="content-section">
            <strong>Домашнє завдання (2-3 хв):</strong>
            ${lesson.content.homework}
          </div>
        </td>
        <td class="equipment">
          <ul>
            ${lesson.equipment.map(item => `<li>${item}</li>`).join('\n            ')}
          </ul>
        </td>
        <td class="results">${lesson.expectedResults}</td>
      </tr>
`;
  }

  html += `
    </tbody>
  </table>

  <div style="margin-top: 1cm;">
    <p>Вчитель: ________________ ${settings.teacherName}</p>
    <p style="margin-top: 0.5cm;">Дата складання: ${new Date().toLocaleDateString('uk-UA')}</p>
  </div>
</body>
</html>
`;

  return html;
}
