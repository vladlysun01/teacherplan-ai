// Генератор календарних планів для Технологій, 10-11 класи (рівень
// стандарту), 1 год/тиждень. Той самий патерн генератора, що й для
// Зарубіжної літератури/Основ правознавства — модулі з фіксованими
// годинами на проєктну тему.
import { convertWeekdays, convertSemester, convertStartDate } from "./utils";
import { allModulesTehnologii } from "./tehnologii-modules";

export interface TehnologiiPlanSettings {
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
  let content = "Організаційний момент, повторення правил безпечної праці. ";
  content += "Повідомлення теми й мети уроку. ";

  if (topic.includes("презентація") || topic.includes("Презентація")) {
    content += `Презентація готового проекту «${moduleName}», обговорення, оцінювання результатів, розрахунок орієнтовної вартості виробу`;
  } else if (topic.includes("виготовлення") || topic.includes("Виготовлення") || topic.includes("приготування") || topic.includes("Приготування")) {
    content += `Практична робота: виконання технологічних операцій за темою «${topic}», дотримання технологічної послідовності та правил безпечної праці`;
  } else {
    content += `Робота над проектом за темою «${topic}»: обговорення, пошук інформації, добір матеріалів/технологій, планування наступних кроків`;
  }

  content += ". Підбиття підсумків уроку, оцінювання.";

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

export function generateTehnologiiCalendarPlan(settings: TehnologiiPlanSettings) {
  const modules = allModulesTehnologii;

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
