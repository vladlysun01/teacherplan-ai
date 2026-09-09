// Генератор календарних планів для Зарубіжної літератури, 10-11 класи,
// рівень стандарту (1 год/тиждень, 34-35 год/рік).
import { convertWeekdays, convertSemester, convertStartDate } from "./utils";
import { allModulesLit10 } from "./zarubizhna-literatura-modules-10";
import { allModulesLit11 } from "./zarubizhna-literatura-modules-11";

export interface ZarLitPlanSettings {
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

function generateLessonContent(topic: string, moduleName: string): string {
  let content = "Організаційний момент. ";

  if (!moduleName.includes("Вступ") && !moduleName.includes("Позакласне")) {
    content += "Перевірка домашнього завдання, актуалізація прочитаного. ";
  }

  content += "Повідомлення теми й мети уроку. ";

  if (moduleName.includes("Позакласне")) {
    content += "Обговорення самостійно прочитаного твору, обмін враженнями, елементи дискусії";
  } else if (topic.includes("Узагальнення")) {
    content += "Узагальнення й систематизація вивченого матеріалу, підсумкове тестування";
  } else {
    content += `Вивчення нового матеріалу за темою «${topic}»: слово вчителя про митця й епоху, аналіз ідейно-тематичного змісту, композиції та образів твору, робота з текстом, елементи компаративного аналізу (зіставлення оригіналу й українського перекладу — за умови володіння мовою)`;
  }

  content += ". Обговорення, робота в групах/парах. Підбиття підсумків, оцінювання, домашнє завдання.";

  return content;
}

function getWeekdayName(date: Date): string {
  const days = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  return days[date.getDay()];
}

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

export function generateZarLitCalendarPlan(settings: ZarLitPlanSettings) {
  const classNum = parseInt(settings.class);
  const modules = classNum === 11 ? allModulesLit11 : allModulesLit10;

  const weekdays = convertWeekdays(settings.weekdays);
  const startDate = convertStartDate(settings.startDate);
  const semester = convertSemester(settings.semester);

  const maxLessons = semester === 1 ? 16 : 19;

  const lessons: any[] = [];
  let lessonNumber = 1;
  let currentDate = new Date(startDate);

  modules.forEach((module) => {
    module.topics.forEach((topic) => {
      for (let h = 0; h < topic.hours; h++) {
        if (lessons.length >= maxLessons) return;

        while (weekdays.length > 0 && !weekdays.includes(getWeekdayName(currentDate))) {
          currentDate.setDate(currentDate.getDate() + 1);
        }

        lessons.push({
          number: lessonNumber,
          date: formatDate(currentDate),
          moduleName: module.name,
          topic: topic.topic,
          content: generateLessonContent(topic.topic, module.name),
        });

        lessonNumber++;
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
  });

  return {
    subject: settings.subject,
    class: settings.class,
    schoolYear: settings.schoolYear,
    semester: settings.semester,
    teacherName: settings.teacherName,
    teacherCategory: settings.teacherCategory,
    schoolName: settings.schoolName,
    lessons,
  };
}
