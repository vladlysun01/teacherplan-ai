/**
import { convertWeekdays, convertSemester, convertStartDate } from "./utils";
 * Генератор календарно-тематичних планів з мистецтва
 * Для 10-11 класів (профільний рівень)
 */

import {
  ArtModule,
  getModulesForClass,
  getAllModules,
  getTotalHours
} from './art-modules';

// ============================================================================
// ІНТЕРФЕЙСИ
// ============================================================================

export interface ArtPlanSettings {
  class: '10' | '11';
  subject: 'Мистецтво';
  schoolYear: string;
  semester: number;
  weekdays: number[]; // [2, 4] - вівторок та четвер
  startDate: Date;
  teacherName: string;
  teacherCategory: string;
  schoolName: string;
}

export interface ArtLesson {
  lessonNumber: number;
  date: string;
  topic: string;
  moduleNumber: number;
  moduleName: string;
  lessonType: 'теорія' | 'практика';
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
  modules: ArtModule[],
  semester: number
): ArtModule[] {
  if (semester === 0) {
    return modules; // весь рік
  }

  const totalHours = modules.reduce((sum, m) => sum + m.hours, 0);
  const semester1Hours = Math.ceil(totalHours / 2);

  if (semester === 1) {
    const result: ArtModule[] = [];
    let hours = 0;

    for (const module of modules) {
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
    const result: ArtModule[] = [];
    let hours = 0;
    let skipHours = semester1Hours;

    for (const module of modules) {
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

function generateDetailedContent(
  topic: string,
  moduleName: string,
  lessonType: 'теорія' | 'практика',
  lessonNumber: number
): ArtLesson['content'] {
  const isPractical = lessonType === 'практика' || topic.toLowerCase().includes('практична робота');
  const isProject = topic.toLowerCase().includes('проєкт') || topic.toLowerCase().includes('захист');
  const isFirst = lessonNumber === 1;

  const content: ArtLesson['content'] = {
    actualization: '',
    motivation: '',
    mainPart: '',
    consolidation: '',
    homework: ''
  };

  if (isFirst) {
    content.organizationalMoment =
      'Привітання. Перевірка присутніх. Ознайомлення з програмою курсу мистецтва, вимогами до предмета та системою оцінювання. Інструктаж з техніки безпеки при роботі з художніми матеріалами та інструментами.';
  }

  // Актуалізація
  if (lessonNumber === 1) {
    content.actualization =
      'Бесіда про роль мистецтва в житті людини та суспільства. Обговорення особистого досвіду відвідування виставок, музеїв, театрів.';
  } else if (isPractical) {
    content.actualization =
      'Огляд попередніх робіт учнів. Обговорення досягнень та труднощів. Перевірка готовності матеріалів та інструментів.';
  } else {
    content.actualization =
      'Фронтальне опитування з теми попереднього уроку. Перевірка домашнього завдання. Перегляд репродукцій та творів мистецтва.';
  }

  // Мотивація
  if (isProject) {
    content.motivation =
      'Презентація кращих учнівських проєктів попередніх років. Обговорення критеріїв оцінювання творчих робіт та важливості самовираження через мистецтво.';
  } else if (isPractical) {
    content.motivation =
      `Демонстрація творів професійних художників у цій техніці. Обговорення можливостей для самовираження та розвитку художніх навичок.`;
  } else {
    content.motivation =
      `Презентація репродукцій та відеофрагментів з теми "${topic}". Розповідь про цікаві факти з життя художників та історії створення шедеврів.`;
  }

  // Основна частина
  if (isProject) {
    content.mainPart =
      'Презентація учнівських проєктів. Розповідь автора про ідею, процес створення та художні рішення. Обговорення технічного виконання та художніх достоїнств робіт.';
    content.practice =
      'Учні презентують свої творчі проєкти, відповідають на запитання класу та вчителя. Колективне обговорення кожної роботи з конструктивною критикою.';
  } else if (isPractical) {
    content.mainPart =
      'Демонстрація техніки виконання вчителем. Пояснення послідовності роботи та художніх прийомів. Показ зразків та еталонних робіт.';
    content.practice =
      'Учні виконують практичну роботу за власними ескізами або з натури. Вчитель здійснює індивідуальне консультування, допомагає долати технічні труднощі, дає поради щодо композиції та кольору.';
  } else {
    content.mainPart =
      `Лекція з використанням презентації та репродукцій. Розгляд творів мистецтва, аналіз композиції, кольору, техніки виконання. Обговорення історичного та культурного контексту. Порівняння різних художніх стилів та напрямів.`;
  }

  // Закріплення
  if (isProject) {
    content.consolidation =
      'Підведення підсумків презентацій. Виділення найцікавіших художніх рішень. Нагородження найкращих робіт.';
  } else if (isPractical) {
    content.consolidation =
      'Виставка виконаних робіт. Обговорення успіхів та труднощів. Аналіз типових помилок та способів їх усунення. Поради для вдосконалення техніки.';
  } else {
    content.consolidation =
      'Фронтальне опитування для закріплення матеріалу. Вікторина з репродукціями. Обговорення ключових понять та художніх термінів. Порівняльний аналіз творів.';
  }

  // Домашнє завдання
  if (isProject) {
    content.homework =
      'Оформити портфоліо своїх робіт. Написати есе про власний творчий шлях. Відвідати виставку або музей.';
  } else if (isPractical) {
    content.homework =
      'Завершити практичну роботу (якщо не встигли). Створити 2-3 начерки для наступної роботи. Зібрати референси та ідеї з Інтернету або книг.';
  } else {
    content.homework =
      `Опрацювати конспект уроку та відповідний розділ підручника. Знайти в Інтернеті додаткові репродукції з теми "${topic}". Підготувати повідомлення про одного з художників епохи.`;
  }

  return content;
}

function generateEquipment(lessonType: 'теорія' | 'практика', topic: string): string[] {
  const basicTheoryEquipment = [
    'Мультимедійний проєктор',
    'Презентація з репродукціями',
    'Підручник',
    'Альбоми з мистецтва'
  ];

  const basicPracticeEquipment = [
    'Папір для малювання',
    'Олівці різної твердості',
    'Гумка',
    'Фарби (акварель/гуаш)'
  ];

  if (lessonType === 'теорія') {
    return basicTheoryEquipment;
  }

  if (topic.toLowerCase().includes('графік') || topic.toLowerCase().includes('гравюр')) {
    return [...basicPracticeEquipment, 'Туш', 'Перо', 'Лінолеум для гравюри'];
  }

  if (topic.toLowerCase().includes('живопис')) {
    return [...basicPracticeEquipment, 'Пензлі різних розмірів', 'Палітра', 'Полотно або картон'];
  }

  if (topic.toLowerCase().includes('декоративн') || topic.toLowerCase().includes('орнамент')) {
    return [...basicPracticeEquipment, 'Кольоровий папір', 'Ножиці', 'Клей'];
  }

  if (topic.toLowerCase().includes('дизайн')) {
    return ['Комп\'ютер', 'Графічний редактор', 'Папір для ескізів', 'Кольорові маркери'];
  }

  return basicPracticeEquipment;
}

function generateExpectedResults(topic: string, lessonType: 'теорія' | 'практика'): string {
  if (lessonType === 'теорія') {
    return `Учні знають основні факти з теми "${topic}", розуміють художні стилі та напрями, можуть аналізувати твори мистецтва, висловлювати власну думку про художні твори.`;
  } else {
    return 'Учні володіють практичними навичками роботи з художніми матеріалами, можуть створювати власні художні композиції, застосовувати вивчені техніки та прийоми.';
  }
}

// ============================================================================
// ГОЛОВНА ФУНКЦІЯ ГЕНЕРАЦІЇ
// ============================================================================

export async function generateArtCalendarPlan(
  settings: ArtPlanSettings
): Promise<{ success: boolean; lessons: ArtLesson[]; error?: string }> {
  try {
    const allModules = getAllModules(parseInt(settings.class) as 10 | 11);
    const semesterModules = distributeModulesBySemesters(allModules, settings.semester);
    const totalLessons = semesterModules.reduce((sum, module) => sum + module.hours, 0);
    const dates = generateDates(settings.startDate, settings.weekdays, totalLessons);

    const lessons: ArtLesson[] = [];
    let lessonNumber = 1;
    let dateIndex = 0;
    let moduleNumber = 1;

    for (const module of semesterModules) {
      for (let i = 0; i < module.topics.length; i++) {
        const topic = module.topics[i];

        const lesson: ArtLesson = {
          lessonNumber,
          date: formatDate(dates[dateIndex]),
          topic,
          moduleNumber,
          moduleName: module.name,
          lessonType: module.type,
          content: generateDetailedContent(topic, module.name, module.type, lessonNumber),
          equipment: generateEquipment(module.type, topic),
          expectedResults: generateExpectedResults(topic, module.type)
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

export function generateArtHTML(
  lessons: ArtLesson[],
  settings: ArtPlanSettings
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
  <title>Календарно-тематичний план: Мистецтво ${settings.class} клас (профільний рівень)</title>
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
    .theory-row { background-color: #fff8e1; }
    .practice-row { background-color: #e8f5e9; }
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
  <h2>з мистецтва для ${settings.class} класу (профільний рівень)</h2>
  <h3>${semesterText} ${settings.schoolYear} навчального року</h3>

  <div class="info-block">
    <p><strong>Заклад освіти:</strong> ${settings.schoolName}</p>
    <p><strong>Вчитель:</strong> ${settings.teacherName}</p>
    <p><strong>Категорія:</strong> ${settings.teacherCategory}</p>
    <p><strong>Рівень:</strong> профільний</p>
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
    if (lesson.moduleName !== currentModule) {
      const bgColor = lesson.lessonType === 'теорія' ? '#fff3cd' : '#d4edda';
      const typeText = lesson.lessonType === 'теорія' ? 'ТЕОРІЯ' : 'ПРАКТИКА';
      
      html += `
      <tr>
        <td colspan="6" style="background-color: ${bgColor}; font-weight: bold; text-align: center;">
          ${typeText}: Модуль ${lesson.moduleNumber}. ${lesson.moduleName}
        </td>
      </tr>
`;
      currentModule = lesson.moduleName;
    }

    const rowClass = lesson.lessonType === 'теорія' ? 'theory-row' : 'practice-row';

    html += `
      <tr class="${rowClass}">
        <td class="lesson-number">${lesson.lessonNumber}</td>
        <td class="date">${lesson.date}</td>
        <td class="topic">
          <strong>${lesson.topic}</strong><br>
          <em>(${lesson.lessonType === 'теорія' ? 'Теоретичне заняття' : 'Практичне заняття'})</em>
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
            <strong>Практична діяльність:</strong>
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
