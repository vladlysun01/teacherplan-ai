// Генератор для Української літератури 5-9 класи
import { convertWeekdays, convertSemester, convertStartDate } from "./utils";
import { getUkrainianLiteratureModulesByClass } from './ukrainian-literature-modules';

// Допоміжна функція для отримання назви дня тижня
function getWeekdayName(date: Date): string {
  const days = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  return days[date.getDay()];
}

function isLessonDay(date: Date, weekdays: string[]): boolean {
  return weekdays.includes(getWeekdayName(date));
}

function isHoliday(date: Date): boolean {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const holidays = [[1,1], [1,7], [3,8], [5,1], [5,9], [6,28], [8,24]];
  return holidays.some(([m, d]) => m === month && d === day);
}

function formatDate(date: Date): string {
  return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
}

export async function generateUkrainianLiteratureCalendarPlan(settings: any) {
  try {
    const modules = getUkrainianLiteratureModulesByClass(settings.class);
    const lessons: any[] = [];
    
    // Конвертуємо weekdays з рядка в масив рядків
    const weekdaysArray = convertWeekdays(settings.weekdays);
    let currentDate = new Date(settings.startDate);
    let lessonNumber = 1;

    for (const module of modules) {
      for (let i = 0; i < module.hours; i++) {
        while (!isLessonDay(currentDate, weekdaysArray) || isHoliday(currentDate)) {
          currentDate.setDate(currentDate.getDate() + 1);
        }

        const topicIndex = i % module.topics.length;
        const topic = module.topics[topicIndex];
        
        lessons.push({
          number: lessonNumber++,
          date: formatDate(currentDate),
          topic: topic,
          module: module.name,
          content: `Вивчення теми: ${topic}. Аналіз літературних творів, обговорення ключових ідей.`,
          homework: 'Опрацювати матеріал підручника, підготувати усну відповідь'
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return { 
      success: true, 
      lessons, 
      settings: { ...settings, totalLessons: lessons.length } 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Помилка' 
    };
  }
}

export function generateUkrainianLiteratureHTML(lessons: any[], settings: any): string {
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Календарний план - Українська література</title></head>
<body style="font-family: Arial; padding: 20px;">
<h2 style="text-align: center;">КАЛЕНДАРНИЙ ПЛАН з української літератури ${settings.class} клас</h2>
<p><strong>Вчитель:</strong> ${settings.teacherName}</p>
<table border="1" style="width: 100%; border-collapse: collapse;">
<tr><th>№</th><th>Дата</th><th>Розділ</th><th>Тема</th><th>Д/З</th></tr>
${lessons.map(l => `<tr><td>${l.number}</td><td>${l.date}</td><td>${l.module}</td><td>${l.topic}</td><td>${l.homework}</td></tr>`).join('')}
</table></body></html>`;
}
