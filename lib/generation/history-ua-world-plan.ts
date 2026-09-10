// Генератор календарних планів для «Історія: Україна і світ»
// (інтегрований курс), 10-11 класи, 2 год/тиждень.
import { convertWeekdays, convertSemester, convertStartDate } from "./utils";
import { historyUaWorld10 } from "./history-ua-world-modules-10";
import { historyUaWorld11 } from "./history-ua-world-modules-11";

export interface HistoryUaWorldPlanSettings {
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
  content += "Актуалізація опорних знань: фронтальне опитування, робота з хронологією та картою. ";
  content += "Мотивація навчальної діяльності: повідомлення теми та мети уроку. ";

  if (topic.includes("Узагальнення") && topic.includes("тематичний контроль")) {
    content += `Узагальнення та систематизація знань за темою «${moduleName}»: виконання тестових завдань, робота з історичними джерелами, підсумкова бесіда`;
  } else if (moduleName.includes("Вступ")) {
    content += "Вивчення нового матеріалу: формування загального образу історичного періоду, актуалізація знань, здобутих раніше";
  } else if (topic.includes("Голодомор") || topic.includes("Голокост") || topic.includes("репрес") || topic.includes("терор")) {
    content += "Вивчення нового матеріалу: робота з документальними джерелами й свідченнями очевидців, аналіз причин і наслідків, дискусія";
  } else if (topic.includes("Українська революція") || topic.includes("незалежності") || topic.includes("державн")) {
    content += "Вивчення нового матеріалу: аналіз історичних документів (універсалів, актів, конституцій), характеристика політичних процесів";
  } else if (topic.includes("війни") || topic.includes("війна") || topic.includes("бойові дії") || topic.includes("фронт")) {
    content += "Вивчення нового матеріалу: робота з картою як джерелом інформації, аналіз перебігу воєнних подій, хронологія і синхронність фактів";
  } else {
    content += `Вивчення нового матеріалу за темою «${topic}»: аналіз причин, сутності та наслідків подій, робота з джерелами, порівняння й зіставлення позицій`;
  }

  content += ". Обговорення в групах/парах, виконання практичних завдань. Підбиття підсумків уроку, оцінювання роботи учнів, пояснення домашнього завдання.";

  return content;
}

export function generateHistoryUaWorldCalendarPlan(settings: HistoryUaWorldPlanSettings) {
  const classNum = parseInt(settings.class);
  const modules = classNum === 11 ? historyUaWorld11 : historyUaWorld10;

  const weekdays = convertWeekdays(settings.weekdays);
  const startDate = convertStartDate(settings.startDate);
  const semester = convertSemester(settings.semester);

  // 2 год/тиждень, 70 год/рік у кожному класі.
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
