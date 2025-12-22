// Генерація календарних планів для Історії: Україна і світ
import { convertWeekdays, convertSemester, convertStartDate } from "./utils";

import {
  HISTORY_10_MODULES,
  HISTORY_11_MODULES,
  type HistoryModule
} from './history-modules';

export interface HistoryPlanSettings {
  class: string;
  subject: string;
  schoolYear: string;
  semester: '0' | '1' | '2';
  weekdays: string;
  startDate: string;
  teacherName: string;
  teacherCategory: string;
  schoolName: string;
}

// Отримання модулів для класу
function getModulesForClass(classNum: number): HistoryModule[] {
  switch (classNum) {
    case 10:
      return HISTORY_10_MODULES;
    case 11:
      return HISTORY_11_MODULES;
    default:
      return [];
  }
}

// Розподіл модулів по семестрах
function distributeModulesBySemesters(modules: HistoryModule[]) {
  const semester1: HistoryModule[] = [];
  const semester2: HistoryModule[] = [];
  
  modules.forEach((module, idx) => {
    if (idx % 2 === 0) {
      semester1.push(module);
    } else {
      semester2.push(module);
    }
  });
  
  return { semester1, semester2 };
}

// Генерація детального змісту уроку
function generateDetailedContent(topic: string, lessonIndex: number, totalLessons: number, moduleName: string): string {
  const isFirstLesson = lessonIndex === 0;
  const isLastLesson = lessonIndex === totalLessons - 1;
  
  let content = "";
  
  if (isFirstLesson) {
    content += "Організаційний момент. Перевірка готовності до уроку. ";
  }
  
  // Актуалізація знань (3-5 хв)
  if (lessonIndex > 0) {
    content += "Актуалізація опорних знань: усне опитування, фронтальна бесіда за матеріалом попереднього уроку, перевірка домашнього завдання. ";
  }
  
  // Мотивація (2-3 хв)
  content += "Мотивація навчальної діяльності: повідомлення теми та мети уроку, актуалізація значення теми для розуміння історичних процесів. ";
  
  // Основна частина (30-35 хв)
  content += "Вивчення нового матеріалу: ";
  
  if (topic.includes("Контрольна") || topic.includes("Підсумкова")) {
    content += "проведення контрольної роботи для перевірки рівня засвоєння навчального матеріалу розділу/курсу, виконання тестових завдань, письмових робіт";
  } else if (moduleName.includes("Вступ")) {
    content += "пояснення вчителя з використанням презентації, робота з картою, аналіз історичних джерел, обговорення ключових понять та подій періоду";
  } else if (topic.includes("війна") || topic.includes("революція") || topic.includes("кампанії")) {
    content += "розповідь вчителя про хід історичних подій, робота з історичною картою, аналіз причин і наслідків, характеристика діячів епохи, робота з документами та ілюстраціями";
  } else if (topic.includes("політика") || topic.includes("режим") || topic.includes("держав")) {
    content += "аналіз політичних процесів та систем, характеристика форм правління, вивчення документів епохи, порівняння різних політичних систем, дискусія про роль особистості в історії";
  } else if (topic.includes("культур") || topic.includes("життя") || topic.includes("повсякденн")) {
    content += "розгляд особливостей духовного та культурного життя епохи, аналіз творів мистецтва та літератури, характеристика побуту та ментальності людей досліджуваного періоду";
  } else if (topic.includes("економ") || topic.includes("розвиток")) {
    content += "вивчення економічних процесів та змін, аналіз статистичних даних, характеристика соціально-економічного становища, робота з діаграмами та графіками";
  } else {
    content += "пояснення нового матеріалу з використанням мультимедійної презентації, робота з підручником, аналіз історичних джерел, складання хронологічних таблиць, характеристика історичних постатей";
  }
  
  // Закріплення (5-7 хв)
  if (!topic.includes("Контрольна") && !topic.includes("Підсумкова")) {
    content += ". Закріплення вивченого: фронтальне опитування, виконання практичних завдань, робота з картою, обговорення проблемних питань";
  }
  
  // Домашнє завдання та підсумки (2-3 хв)
  content += ". Підбиття підсумків уроку, оцінювання відповідей учнів, пояснення домашнього завдання";
  
  return content + ".";
}

// Допоміжні функції
function getWeekdayName(date: Date): string {
  const days = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  return days[date.getDay()];
}

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

// Головна функція генерації
export async function generateHistoryCalendarPlan(settings: HistoryPlanSettings) {
  try {
    const classNum = parseInt(settings.class);
    const modules = getModulesForClass(classNum);
    
    if (modules.length === 0) {
      throw new Error(`Немає модулів для ${settings.class} класу`);
    }
    
    const { semester1, semester2 } = distributeModulesBySemesters(modules);
    
    // Конвертуємо weekdays з рядка в масив рядків
    const weekdays = convertWeekdays(settings.weekdays);
    const startDate = new Date(settings.startDate);
    
    let lessonNumber = 1;
    let currentDate = new Date(startDate);
    const allLessons: any[] = [];
    
    function generateModuleLessons(modulesList: HistoryModule[]) {
      modulesList.forEach(module => {
        module.topics.forEach((topic, idx) => {
          // Перевіряємо чи поточний день входить у список weekdays
          while (weekdays.length > 0 && !weekdays.includes(getWeekdayName(currentDate))) {
            currentDate.setDate(currentDate.getDate() + 1);
          }
          
          const lesson = {
            number: lessonNumber,
            date: formatDate(currentDate),
            moduleName: module.name,
            topic,
            content: generateDetailedContent(topic, idx, module.topics.length, module.name),
          };
          
          allLessons.push(lesson);
          lessonNumber++;
          currentDate.setDate(currentDate.getDate() + 7);
        });
      });
    }
    
    if (settings.semester === '0' || settings.semester === '1') {
      generateModuleLessons(semester1);
    }
    
    if (settings.semester === '0' || settings.semester === '2') {
      generateModuleLessons(semester2);
    }
    
    return {
      success: true,
      lessons: allLessons,
      settings
    };
  } catch (error) {
    console.error('Error generating history calendar plan:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Генерація HTML для документу
export function generateHistoryHTML(lessons: any[], settings: HistoryPlanSettings): string {
  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Календарно-тематичний план з історії</title>
  <style>
    body { font-family: 'Times New Roman', serif; margin: 40px; line-height: 1.5; }
    h1 { text-align: center; color: #1a1a1a; font-size: 18pt; margin-bottom: 10px; }
    .header { text-align: center; margin-bottom: 30px; font-size: 12pt; }
    .header p { margin: 5px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11pt; }
    th, td { border: 1px solid #000; padding: 8px; text-align: left; vertical-align: top; }
    th { background-color: #e0e0e0; font-weight: bold; text-align: center; }
    .module-header { background-color: #f5f5f5; font-weight: bold; text-align: center; font-size: 12pt; }
    .topic-cell { font-weight: 500; }
  </style>
</head>
<body>
  <h1>КАЛЕНДАРНО-ТЕМАТИЧНИЙ ПЛАН</h1>
  <h1>З ІСТОРІЇ: УКРАЇНА І СВІТ</h1>
  <div class="header">
    <p><strong>${settings.schoolName}</strong></p>
    <p>Вчитель: ${settings.teacherName}, ${settings.teacherCategory}</p>
    <p>Клас: ${settings.class}</p>
    <p>Навчальний рік: ${settings.schoolYear}</p>
  </div>
`;

  let currentModule = '';
  let tableStarted = false;

  lessons.forEach(lesson => {
    if (lesson.moduleName !== currentModule) {
      if (tableStarted) {
        html += '</table>\n';
      }
      html += `<h2 class="module-header">${lesson.moduleName}</h2>\n`;
      html += '<table>\n';
      html += '<tr><th style="width: 5%;">№ уроку</th><th style="width: 10%;">Дата</th><th style="width: 30%;">Тема уроку</th><th style="width: 50%;">Зміст навчального матеріалу</th><th style="width: 5%;">Примітки</th></tr>\n';
      currentModule = lesson.moduleName;
      tableStarted = true;
    }

    html += `<tr>
      <td style="text-align: center;">${lesson.number}</td>
      <td style="text-align: center;">${lesson.date}</td>
      <td class="topic-cell">${lesson.topic}</td>
      <td>${lesson.content}</td>
      <td></td>
    </tr>\n`;
  });

  if (tableStarted) {
    html += '</table>\n';
  }

  html += `
  <div style="margin-top: 40px;">
    <p>Календарно-тематичний план складено відповідно до чинної навчальної програми з історії.</p>
    <p style="margin-top: 20px;">Вчитель: _________________ ${settings.teacherName}</p>
  </div>
</body>
</html>`;

  return html;
}
