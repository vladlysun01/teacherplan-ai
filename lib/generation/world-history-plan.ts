// Генератор календарного плану для Всесвітньої історії (6-11 класи)
import { convertWeekdays, convertSemester, convertStartDate } from "./utils";

import { getWorldHistoryModulesByClass } from './world-history-modules';

interface WorldHistorySettings {
  class: string;
  subject: string;
  schoolYear: string;
  semester: string;
  weekdays: string;
  startDate: string;
  teacherName: string;
  teacherCategory: string;
  schoolName: string;
}

interface Lesson {
  number: number;
  date: string;
  topic: string;
  module: string;
  content?: string;
  homework?: string;
}

// Допоміжна функція для отримання назви дня тижня
function getWeekdayName(date: Date): string {
  const days = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  return days[date.getDay()];
}

export async function generateWorldHistoryCalendarPlan(settings: WorldHistorySettings) {
  try {
    const modules = getWorldHistoryModulesByClass(settings.class);
    
    if (!modules || modules.length === 0) {
      return {
        success: false,
        error: `Модулі для ${settings.class} класу не знайдено`
      };
    }

    const lessons: Lesson[] = [];
    // Конвертуємо weekdays з рядка в масив рядків
    const weekdaysArray = convertWeekdays(settings.weekdays);
    let currentDate = new Date(settings.startDate);
    let lessonNumber = 1;

    // Визначаємо діапазон дат для семестру
    const firstSemesterEnd = new Date(currentDate.getFullYear(), 11, 25); // 25 грудня
    const secondSemesterStart = new Date(currentDate.getFullYear() + 1, 0, 9); // 9 січня
    const yearEnd = new Date(currentDate.getFullYear() + 1, 4, 31); // 31 травня

    for (const module of modules) {
      const topicsPerModule = module.topics;
      let topicIndex = 0;

      for (let hour = 0; hour < module.hours; hour++) {
        // Перевіряємо семестр
        if (settings.semester === '1' && currentDate > firstSemesterEnd) break;
        if (settings.semester === '2' && currentDate < secondSemesterStart) {
          currentDate = new Date(secondSemesterStart);
        }

        // Шукаємо наступний навчальний день
        while (!isLessonDay(currentDate, weekdaysArray) || isHoliday(currentDate)) {
          currentDate.setDate(currentDate.getDate() + 1);
          
          // Перевіряємо чи не вийшли за межі навчального року
          if (currentDate > yearEnd) {
            return {
              success: true,
              lessons,
              settings: {
                ...settings,
                totalLessons: lessons.length
              }
            };
          }
        }

        const topic = topicsPerModule[topicIndex] || topicsPerModule[topicsPerModule.length - 1];
        
        lessons.push({
          number: lessonNumber++,
          date: formatDate(currentDate),
          topic: topic,
          module: module.name,
          content: `Вивчення теми: ${topic}. Аналіз історичних подій, хронології, причинно-наслідкових зв'язків.`,
          homework: generateHomework(topic, settings.class)
        });

        topicIndex++;
        if (topicIndex >= topicsPerModule.length) {
          topicIndex = topicsPerModule.length - 1;
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return {
      success: true,
      lessons,
      settings: {
        ...settings,
        totalLessons: lessons.length
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Невідома помилка'
    };
  }
}

function isLessonDay(date: Date, weekdays: string[]): boolean {
  return weekdays.includes(getWeekdayName(date));
}

function isHoliday(date: Date): boolean {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Державні свята України
  const holidays = [
    { month: 1, day: 1 },   // Новий рік
    { month: 1, day: 7 },   // Різдво
    { month: 3, day: 8 },   // 8 Березня
    { month: 5, day: 1 },   // День праці
    { month: 5, day: 9 },   // День Перемоги
    { month: 6, day: 28 },  // День Конституції
    { month: 8, day: 24 },  // День Незалежності
    { month: 10, day: 14 }, // День захисника
    { month: 12, day: 25 }, // Різдво (католицьке)
  ];

  return holidays.some(h => h.month === month && h.day === day);
}

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}.${date.getFullYear()}`;
}

function generateHomework(topic: string, classNum: string): string {
  const homeworkTypes = [
    `Опрацювати §, відповісти на питання`,
    `Скласти план-конспект теми`,
    `Підготувати повідомлення`,
    `Скласти хронологічну таблицю`,
    `Підготувати презентацію`,
    `Заповнити контурну карту`,
    `Скласти порівняльну таблицю`,
    `Написати есе`,
  ];

  // Для молодших класів - простіші завдання
  if (parseInt(classNum) <= 7) {
    return homeworkTypes[Math.floor(Math.random() * 4)];
  }

  return homeworkTypes[Math.floor(Math.random() * homeworkTypes.length)];
}

export function generateWorldHistoryHTML(lessons: Lesson[], settings: any): string {
  let html = `
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Календарний план - Всесвітня історія ${settings.class} клас</title>
    <style>
        body {
            font-family: 'Times New Roman', serif;
            margin: 40px;
            line-height: 1.6;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .info {
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f0f0f0;
            font-weight: bold;
        }
        .center {
            text-align: center;
        }
        @media print {
            body {
                margin: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>КАЛЕНДАРНИЙ ПЛАН</h2>
        <h3>з предмету "Всесвітня історія"</h3>
        <h3>${settings.class} клас</h3>
        <h3>${settings.schoolYear} навчальний рік</h3>
    </div>
    
    <div class="info">
        <p><strong>Вчитель:</strong> ${settings.teacherName}</p>
        <p><strong>Категорія:</strong> ${settings.teacherCategory}</p>
        <p><strong>Навчальний заклад:</strong> ${settings.schoolName}</p>
        <p><strong>Кількість годин на рік:</strong> ${lessons.length}</p>
        <p><strong>Дні занять:</strong> ${settings.weekdays}</p>
    </div>
    
    <table>
        <thead>
            <tr>
                <th class="center" style="width: 5%">№</th>
                <th class="center" style="width: 10%">Дата</th>
                <th style="width: 20%">Розділ/Модуль</th>
                <th style="width: 40%">Тема уроку</th>
                <th style="width: 25%">Домашнє завдання</th>
            </tr>
        </thead>
        <tbody>
`;

  lessons.forEach(lesson => {
    html += `
            <tr>
                <td class="center">${lesson.number}</td>
                <td class="center">${lesson.date}</td>
                <td>${lesson.module}</td>
                <td>${lesson.topic}</td>
                <td>${lesson.homework || ''}</td>
            </tr>
`;
  });

  html += `
        </tbody>
    </table>
    
    <div style="margin-top: 40px;">
        <p>Вчитель: ___________________ ${settings.teacherName}</p>
    </div>
</body>
</html>
`;

  return html;
}
