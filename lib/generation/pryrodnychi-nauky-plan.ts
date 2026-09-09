// Генератор календарних планів для «Природничі науки» (інтегрований курс),
// 10-11 класи, 4 год/тиждень (Дьоміна, Задоянний, Костик).
import { convertWeekdays, convertSemester, convertStartDate } from "./utils";
import { pryrodnychiNauky10 } from "./pryrodnychi-nauky-modules-10";
import { pryrodnychiNauky11 } from "./pryrodnychi-nauky-modules-11";

export interface PryrodnychiNaukyPlanSettings {
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
  content += "Актуалізація опорних знань: фронтальне опитування, обговорення міжпредметних зв'язків. ";
  content += "Мотивація навчальної діяльності: повідомлення теми та мети уроку. ";

  if (moduleName.includes("Наука")) {
    content += "Вивчення нового матеріалу: обговорення природи наукового пізнання, розбір ознак псевдонауки, аналіз наукових і науково-популярних джерел";
  } else if (moduleName.includes("Частинки") || moduleName.includes("Енергія")) {
    content += "Вивчення нового матеріалу: пояснення фізичних явищ і закономірностей, аналіз кейсів, обговорення внеску українських вчених";
  } else if (moduleName.includes("Хвилі") || moduleName.includes("Космос")) {
    content += "Вивчення нового матеріалу: пояснення явищ і закономірностей, розгляд ілюстративних прикладів, виконання практичної роботи або кейс-завдання";
  } else if (moduleName.includes("Речовини") || moduleName.includes("Суміші")) {
    content += "Вивчення нового матеріалу: характеристика хімічних явищ і процесів, виконання лабораторної або практичної роботи, аналіз кейсу";
  } else if (moduleName.includes("Клітина") || moduleName.includes("Харчування") || moduleName.includes("Психофізіологічний")) {
    content += "Вивчення нового матеріалу: пояснення біологічних процесів і закономірностей, аналіз кейсу, виконання практичної роботи";
  } else {
    content += "Вивчення нового матеріалу: міждисциплінарний розгляд теми, аналіз кейсу, обговорення в групах";
  }

  content += `. Робота за темою «${topic}»: індивідуальні або групові проєкти, обговорення наскрізних змістових ліній`;
  content += ". Підбиття підсумків уроку, оцінювання роботи учнів, пояснення домашнього завдання.";

  return content;
}

export function generatePryrodnychiNaukyCalendarPlan(settings: PryrodnychiNaukyPlanSettings) {
  const classNum = parseInt(settings.class);
  const modules = classNum === 11 ? pryrodnychiNauky11 : pryrodnychiNauky10;

  const weekdays = convertWeekdays(settings.weekdays);
  const startDate = convertStartDate(settings.startDate);
  const semester = convertSemester(settings.semester);

  // 4 год/тиждень, 140 год/рік у кожному класі (280 год на весь курс 10-11).
  const weeklyHours = 4;
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
