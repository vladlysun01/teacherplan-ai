// Генератор календарних планів для Української літератури, 10-11 класи,
// рівень стандарту (2 год/тиждень, 70 год/рік).
import { convertWeekdays, convertSemester, convertStartDate } from "./utils";
import { ukrLit10 } from "./ukrainska-literatura-10-11-modules-10";
import { ukrLit11 } from "./ukrainska-literatura-10-11-modules-11";

export interface UkrLitPlanSettings {
  class: string;
  subject: string;
  schoolYear: string;
  semester: string;
  weekdays: string;
  startDate: string;
  teacherName: string;
  teacherCategory: string;
  schoolName: string;
  programId?: string;
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

function generateLessonContent(topic: string, moduleName: string): string {
  let content = "Організаційний момент. ";

  if (!moduleName.includes("Вступ") && !moduleName.includes("рідного краю") && !moduleName.includes("підсумки")) {
    content += "Перевірка домашнього завдання, актуалізація прочитаного. ";
  }

  content += "Повідомлення теми й мети уроку. ";

  if (topic.includes("Розвиток мовлення")) {
    content += "Виконання усної або письмової роботи з розвитку зв'язного мовлення (переказ, твір, есе) за вивченим матеріалом";
  } else if (topic.includes("Позакласне читання")) {
    content += "Обговорення самостійно прочитаного твору, обмін враженнями, елементи дискусії";
  } else if (topic.includes("Резервний час")) {
    content += "Резервний урок: закріплення, повторення або поглиблення вивченого матеріалу на розсуд учителя";
  } else if (topic.includes("Узагальнення")) {
    content += "Узагальнення й систематизація вивченого матеріалу, підсумкова бесіда про художні особливості й новаторство вивчених творів";
  } else if (topic.includes("Література рідного краю")) {
    content += "Ознайомлення з життям і творчістю письменників рідного краю, обговорення їхніх творів";
  } else {
    content += `Вивчення нового матеріалу за темою «${topic}»: слово вчителя про митця й епоху, аналіз ідейно-художнього змісту, композиції та образів твору, робота з текстом`;
  }

  content += ". Обговорення, робота в групах/парах. Підбиття підсумків, оцінювання, домашнє завдання.";

  return content;
}

export function generateUkrLitCalendarPlan(settings: UkrLitPlanSettings) {
  const classNum = parseInt(settings.class);
  const modules = classNum === 11 ? ukrLit11 : ukrLit10;

  const weekdays = convertWeekdays(settings.weekdays);
  const startDate = convertStartDate(settings.startDate);
  const semester = convertSemester(settings.semester);

  const weeklyHours = 2;
  const maxLessons = (semester === 1 ? 16 : 19) * weeklyHours;

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
