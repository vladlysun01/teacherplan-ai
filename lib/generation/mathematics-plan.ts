/**
 * Генератор календарно-тематичних планів з математики
 * Для 10-11 класів (стандарт, поглиблений, профільний рівні)
 */

import { MathematicsModule } from './mathematics-modules-standard';
import {
  getModulesForClass as getStandardModules,
  getAllModules as getAllStandardModules,
  getTotalHours as getStandardHours
} from './mathematics-modules-standard';
import {
  getModulesForClass as getAdvancedModules,
  getAllModules as getAllAdvancedModules,
  getTotalHours as getAdvancedHours
} from './mathematics-modules-advanced';
import {
  getModulesForClass as getProfileModules,
  getAllModules as getAllProfileModules,
  getTotalHours as getProfileHours
} from './mathematics-modules-profile';

// ============================================================================
// ІНТЕРФЕЙСИ
// ============================================================================

export interface MathematicsPlanSettings {
  class: '10' | '11';
  subject: 'Математика';
  level?: 'стандарт' | 'поглиблений' | 'профільний';
  programId?: string; // ✅ Додано для сумісності з dashboard
  schoolYear: string;
  semester: number | string; // ✅ Може бути рядок з форми
  weekdays: number[] | string; // ✅ Може бути рядок "Пн,Ср,Пт"
  startDate: Date | string; // ✅ Може бути рядок
  teacherName: string;
  teacherCategory: string;
  schoolName: string;
}

export interface MathematicsLesson {
  lessonNumber: number;
  date: string;
  topic: string;
  moduleNumber: number;
  moduleName: string;
  branch: 'algebra' | 'geometry';
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
// ВИБІР МОДУЛІВ ЗАЛЕЖНО ВІД РІВНЯ
// ============================================================================

function getModulesByLevel(
  classNum: 10 | 11,
  level: 'стандарт' | 'поглиблений' | 'профільний'
): { algebra: MathematicsModule[]; geometry: MathematicsModule[] } {
  switch (level) {
    case 'стандарт':
      return getStandardModules(classNum, level);
    case 'поглиблений':
      return getAdvancedModules(classNum, level);
    case 'профільний':
      return getProfileModules(classNum, level);
  }
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
  modules: { algebra: MathematicsModule[]; geometry: MathematicsModule[] },
  semester: number
): MathematicsModule[] {
  // Об'єднуємо алгебру та геометрію, чергуючи їх
  const allModules: MathematicsModule[] = [];
  const maxLength = Math.max(modules.algebra.length, modules.geometry.length);
  
  for (let i = 0; i < maxLength; i++) {
    if (i < modules.algebra.length) {
      allModules.push(modules.algebra[i]);
    }
    if (i < modules.geometry.length) {
      allModules.push(modules.geometry[i]);
    }
  }

  if (semester === 0) {
    return allModules; // весь рік
  }

  const totalHours = allModules.reduce((sum, m) => sum + m.hours, 0);
  const semester1Hours = Math.ceil(totalHours / 2);

  if (semester === 1) {
    const result: MathematicsModule[] = [];
    let hours = 0;

    for (const module of allModules) {
      if (hours + module.hours <= semester1Hours) {
        result.push(module);
        hours += module.hours;
      } else if (hours < semester1Hours) {
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
    const result: MathematicsModule[] = [];
    let hours = 0;
    let skipHours = semester1Hours;

    for (const module of allModules) {
      if (skipHours >= module.hours) {
        skipHours -= module.hours;
      } else if (skipHours > 0) {
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
  if (topic.toLowerCase().includes('контрольна робота')) {
    return 'Контрольна робота';
  }
  if (topic.toLowerCase().includes('практична робота')) {
    return 'Практична робота';
  }
  if (topic.toLowerCase().includes('повторення') || topic.toLowerCase().includes('підготовка до дпа')) {
    return 'Урок узагальнення та систематизації';
  }
  if (topic.toLowerCase().includes('входний контроль')) {
    return 'Урок контролю знань';
  }
  return 'Комбінований урок';
}

function generateDetailedContent(
  topic: string,
  moduleName: string,
  branch: 'algebra' | 'geometry',
  lessonNumber: number,
  lessonType: string
): MathematicsLesson['content'] {
  const isControlWork = lessonType === 'Контрольна робота';
  const isPractical = lessonType === 'Практична робота';
  const isFirst = lessonNumber === 1;

  const content: MathematicsLesson['content'] = {
    actualization: '',
    motivation: '',
    mainPart: '',
    consolidation: '',
    homework: ''
  };

  if (isFirst) {
    content.organizationalMoment =
      'Привітання. Перевірка присутніх. Ознайомлення з програмою курсу, вимогами до предмета та системою оцінювання. Інструктаж з правил поведінки та техніки безпеки.';
  }

  if (isControlWork) {
    content.actualization = 'Організаційний момент. Інструктаж з виконання контрольної роботи.';
    content.motivation = 'Налаштування на самостійну роботу. Пояснення критеріїв оцінювання.';
    content.mainPart = 'Виконання контрольної роботи. Учні самостійно розв\'язують завдання. Вчитель спостерігає за роботою, слідкує за дисципліною.';
    content.consolidation = 'Збір робіт. Відповіді на запитання учнів щодо процедури оцінювання.';
    content.homework = 'Повторити теоретичний матеріал з теми. Проаналізувати помилки після перевірки робіт.';
    return content;
  }

  if (lessonNumber === 1) {
    content.actualization = 'Бесіда про роль математики в сучасному світі. Обговорення практичного застосування математичних знань у різних професіях.';
  } else {
    content.actualization = 'Фронтальне опитування з теми попереднього уроку. Перевірка домашнього завдання. Математичний диктант або експрес-контроль.';
  }

  if (isPractical) {
    content.motivation = `Демонстрація практичного застосування набутих умінь. Обговорення життєвих ситуацій, де потрібні ці навички.`;
    content.mainPart = 'Інструктаж з виконання практичної роботи. Демонстрація розв\'язування типових задач. Самостійна робота учнів з індивідуальним консультуванням.';
    content.practice = 'Учні самостійно розв\'язують задачі. Вчитель здійснює індивідуальне консультування, допомагає подолати труднощі.';
  } else if (branch === 'algebra') {
    content.motivation = `Постановка проблемного питання з теми "${topic}". Демонстрація практичного застосування в науці, техніці або економіці.`;
    content.mainPart = 'Пояснення нового матеріалу з використанням презентації. Виведення формул та доведення теорем. Розв\'язування типових задач біля дошки з поясненням. Робота з підручником.';
  } else {
    content.motivation = `Демонстрація просторових моделей або комп'ютерної візуалізації з теми "${topic}". Обговорення практичного застосування в архітектурі та інженерії.`;
    content.mainPart = 'Пояснення нового матеріалу з використанням просторових моделей та креслень. Доведення теорем стереометрії. Побудова зображень просторових фігур. Розв\'язування задач.';
  }

  if (isPractical) {
    content.consolidation = 'Обговорення результатів роботи. Аналіз типових помилок. Розв\'язування складніших варіантів задач.';
  } else {
    content.consolidation = 'Фронтальне опитування для перевірки засвоєння матеріалу. Розв\'язування задач учнями біля дошки. Математична вікторина або міні-тест.';
  }

  if (isPractical) {
    content.homework = 'Завершити нерозв\'язані завдання. Підготувати звіт про виконану роботу. Розв\'язати додаткові задачі аналогічного типу.';
  } else {
    content.homework = `Вивчити теоретичний матеріал за підручником. Виучити формули та означення. Розв\'язати задачі №... з підручника. Підготувати відповіді на контрольні запитання.`;
  }

  return content;
}

function generateEquipment(branch: 'algebra' | 'geometry', lessonType: string): string[] {
  const basicEquipment = [
    'Підручник',
    'Зошит',
    'Креслярські інструменти',
    'Дошка та крейда'
  ];

  if (branch === 'geometry') {
    return [
      ...basicEquipment,
      'Моделі геометричних тіл',
      'Креслення та схеми',
      'Презентація з 3D-моделями'
    ];
  } else {
    if (lessonType === 'Практична робота') {
      return [...basicEquipment, 'Калькулятор', 'Таблиці формул'];
    }
    return [...basicEquipment, 'Таблиці формул', 'Презентація'];
  }
}

function generateExpectedResults(topic: string, branch: 'algebra' | 'geometry', lessonType: string): string {
  if (lessonType === 'Контрольна робота') {
    return 'Учні демонструють знання та вміння з вивченої теми, вміють застосовувати теоретичний матеріал для розв\'язування задач.';
  }
  if (lessonType === 'Практична робота') {
    return 'Учні вміють самостійно розв\'язувати задачі, застосовувати алгоритми та формули, аналізувати результати.';
  }
  if (branch === 'algebra') {
    return `Учні знають теоретичний матеріал з теми "${topic}", розуміють математичні поняття та властивості, вміють застосовувати формули для розв'язування задач.`;
  } else {
    return `Учні знають геометричні означення та теореми, вміють будувати креслення та зображення просторових фігур, розв'язувати стереометричні задачі.`;
  }
}

// ============================================================================
// ГОЛОВНА ФУНКЦІЯ ГЕНЕРАЦІЇ
// ============================================================================

export async function generateMathematicsCalendarPlan(
  settings: MathematicsPlanSettings
): Promise<{ success: boolean; lessons: MathematicsLesson[]; error?: string }> {
  try {
    console.log("📐 Math генератор: отримано settings:", settings);
    
    // Конвертуємо weekdays з рядка в масив
    let weekdaysArray: number[] = [];
    if (typeof settings.weekdays === 'string') {
      const weekdayNames = settings.weekdays.split(',').map(d => d.trim());
      const dayMap: { [key: string]: number } = {
        'Пн': 1, 'Вт': 2, 'Ср': 3, 'Чт': 4, 'Пт': 5
      };
      weekdaysArray = weekdayNames.map(name => dayMap[name]).filter(d => d);
    } else {
      weekdaysArray = settings.weekdays;
    }
    
    console.log("📐 Дні тижня:", weekdaysArray);
    
    // Конвертуємо semester з рядка в число
    const semester = typeof settings.semester === 'string' ? parseInt(settings.semester) : settings.semester;
    
    // Конвертуємо startDate з рядка в Date
    const startDate = typeof settings.startDate === 'string' ? new Date(settings.startDate) : settings.startDate;
    
    // ✅ Конвертуємо programId в level
    let level: 'стандарт' | 'поглиблений' | 'профільний' = 'стандарт';
    if (settings.programId) {
      if (settings.programId.includes('standard')) {
        level = 'стандарт';
      } else if (settings.programId.includes('advanced')) {
        level = 'поглиблений';
      } else if (settings.programId.includes('profile')) {
        level = 'профільний';
      }
    } else if (settings.level) {
      level = settings.level;
    }
    
    console.log("📐 Отримую модулі для класу:", settings.class, "рівень:", level);
    
    const modules = getModulesByLevel(parseInt(settings.class) as 10 | 11, level);
    
    console.log("📐 Модулів отримано:", modules);
    
    const semesterModules = distributeModulesBySemesters(modules, semester);
    const totalLessons = semesterModules.reduce((sum, module) => sum + module.hours, 0);
    
    console.log("📐 Генерую", totalLessons, "уроків");
    
    const dates = generateDates(startDate, weekdaysArray, totalLessons);

    const lessons: MathematicsLesson[] = [];
    let lessonNumber = 1;
    let dateIndex = 0;
    let moduleNumber = 1;

    for (const module of semesterModules) {
      for (let i = 0; i < module.topics.length; i++) {
        const topic = module.topics[i];
        const lessonType = determineLessonType(topic);

        const lesson: MathematicsLesson = {
          lessonNumber,
          date: formatDate(dates[dateIndex]),
          topic,
          moduleNumber,
          moduleName: module.name,
          branch: module.branch,
          lessonType,
          content: generateDetailedContent(topic, module.name, module.branch, lessonNumber, lessonType),
          equipment: generateEquipment(module.branch, lessonType),
          expectedResults: generateExpectedResults(topic, module.branch, lessonType)
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

export function generateMathematicsHTML(
  lessons: MathematicsLesson[],
  settings: MathematicsPlanSettings
): string {
  const semesterText = settings.semester === 1
    ? 'І семестр'
    : settings.semester === 2
    ? 'ІІ семестр'
    : 'Річний план';

  const levelText = settings.level === 'стандарт'
    ? 'рівень стандарту'
    : settings.level === 'поглиблений'
    ? 'поглиблений рівень'
    : 'профільний рівень';

  let html = `
<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Календарно-тематичний план: Математика ${settings.class} клас (${levelText})</title>
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
    .lesson-number { width: 4%; text-align: center; }
    .date { width: 7%; text-align: center; }
    .topic { width: 22%; }
    .content { width: 42%; }
    .equipment { width: 15%; }
    .results { width: 10%; }
    .algebra-row { background-color: #e8f4f8; }
    .geometry-row { background-color: #f8f4e8; }
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
  <h2>з математики для ${settings.class} класу (${levelText})</h2>
  <h3>${semesterText} ${settings.schoolYear} навчального року</h3>

  <div class="info-block">
    <p><strong>Заклад освіти:</strong> ${settings.schoolName}</p>
    <p><strong>Вчитель:</strong> ${settings.teacherName}</p>
    <p><strong>Категорія:</strong> ${settings.teacherCategory}</p>
    <p><strong>Рівень:</strong> ${levelText}</p>
    <p><strong>Кількість годин на тиждень:</strong> ${settings.weekdays.length}</p>
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
    if (lesson.moduleName !== currentModule) {
      html += `
      <tr>
        <td colspan="6" style="background-color: ${lesson.branch === 'algebra' ? '#d0e8f0' : '#f0e8d0'}; font-weight: bold; text-align: center;">
          ${lesson.branch === 'algebra' ? 'АЛГЕБРА І ПОЧАТКИ АНАЛІЗУ' : 'ГЕОМЕТРІЯ'}: Модуль ${lesson.moduleNumber}. ${lesson.moduleName}
        </td>
      </tr>
`;
      currentModule = lesson.moduleName;
    }

    const rowClass = lesson.branch === 'algebra' ? 'algebra-row' : 'geometry-row';

    html += `
      <tr class="${rowClass}">
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
            <strong>Основна частина (25-30 хв):</strong>
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
