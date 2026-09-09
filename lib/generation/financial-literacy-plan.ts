// Генератор календарних планів для курсу за вибором «Фінансова грамотність»
// (10-11 класи, 105 годин, 3 год/тиждень — 105 / 35 навчальних тижнів)
import { convertWeekdays, convertSemester, convertStartDate } from "./utils";
import { allModulesFinLit } from "./financial-literacy-modules";

export interface FinLitPlanSettings {
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

const WEEKLY_HOURS = 3;

function generateLessonContent(topic: string, moduleName: string): string {
  let content = "Організаційний момент. ";

  if (!topic.includes("Вступ")) {
    content += "Актуалізація опорних знань: усне опитування, перевірка домашнього завдання. ";
  }

  content += "Мотивація навчальної діяльності: повідомлення теми та мети уроку, зв'язок теми з повсякденним фінансовим життям учня та його родини. ";

  if (moduleName.includes("Резервний")) {
    content += "Узагальнення та систематизація вивченого матеріалу, тестування, аналіз типових помилок";
  } else if (moduleName.includes("Розділ 1")) {
    content += "Вивчення нового матеріалу: пояснення базових понять особистих фінансів, розбір прикладів із сімейного бюджету, практична робота з розрахунку надходжень/видатків";
  } else if (moduleName.includes("Розділ 2")) {
    content += "Вивчення нового матеріалу: пояснення роботи фінансових установ і послуг, аналіз реальних пропозицій банків/страхових компаній, порівняльні таблиці";
  } else if (moduleName.includes("Розділ 3")) {
    content += "Вивчення нового матеріалу: розрахунок вартості грошей у часі, простих і складних процентів, порівняння варіантів заощаджень та інвестицій";
  } else if (moduleName.includes("Розділ 4")) {
    content += "Вивчення нового матеріалу: аналіз умов кредитування, розрахунок реальної процентної ставки, розбір кредитного договору";
  } else if (moduleName.includes("Розділ 5")) {
    content += "Вивчення нового матеріалу: розбір шахрайських схем і фінансових пірамід на реальних кейсах, обговорення способів захисту прав споживача";
  } else {
    content += "Вивчення нового матеріалу, робота з практичними кейсами";
  }

  content += ". Практична робота за темою уроку. Підбиття підсумків, оцінювання, домашнє завдання.";

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

export function generateFinancialLiteracyCalendarPlan(settings: FinLitPlanSettings) {
  const modules = allModulesFinLit;

  const weekdays = convertWeekdays(settings.weekdays);
  const startDate = convertStartDate(settings.startDate);
  const semester = convertSemester(settings.semester);

  // 105 год / 35 тижнів = 3 год/тиждень. Тижні семестру — той самий поділ
  // 16/19, що й у решті генераторів (стандартний український навчальний рік).
  const maxLessons = (semester === 1 ? 16 : 19) * WEEKLY_HOURS;

  const lessons: any[] = [];
  let lessonNumber = 1;
  let currentDate = new Date(startDate);

  modules.forEach((module) => {
    module.topics.forEach((topic) => {
      for (let h = 0; h < topic.hours; h++) {
        if (lessons.length >= maxLessons) {
          return;
        }

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
