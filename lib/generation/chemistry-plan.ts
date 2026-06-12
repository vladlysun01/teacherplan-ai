// Генератор календарних планів для Хімії
import { convertWeekdays, convertSemester, convertStartDate } from "./utils";
import { allModules10, type Module } from './chemistry-modules-10';
import { allModules11 } from './chemistry-modules-11';

export interface ChemistryPlanSettings {
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

function getWeekdayName(date: Date): string {
  const days = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  return days[date.getDay()];
}

function getModulesForClass(classNum: number): Module[] {
  switch (classNum) {
    case 10:
      return allModules10;
    case 11:
      return allModules11;
    default:
      return [];
  }
}

// 10 клас: 1.5 год/тиждень → 52 год/рік
// 11 клас: 2 год/тиждень → 70 год/рік
function getMaxLessons(classNum: number, semester: number): number {
  if (classNum === 10) {
    return semester === 1 ? 24 : 28;
  }
  if (classNum === 11) {
    return semester === 1 ? 32 : 38;
  }
  return 35;
}

function generateLessonContent(topic: string, moduleName: string): string {
  let content = "";

  content += "Організаційний момент. ";
  content += "Актуалізація опорних знань: фронтальне опитування за матеріалом попереднього уроку. ";
  content += "Мотивація навчальної діяльності: повідомлення теми та мети уроку. ";

  if (topic.includes("Практична робота") || topic.includes("практична")) {
    content += "Виконання практичної роботи: розв'язування експериментальних задач, дослідження властивостей речовин, оформлення результатів";
  } else if (topic.includes("Розрахункові задачі") || topic.includes("задач")) {
    content += "Вивчення нового матеріалу: пояснення алгоритму розв'язування задач, розбір прикладів. Самостійне розв'язування задач учнями";
  } else if (topic.includes("будов") || topic.includes("структур") || topic.includes("склад")) {
    content += "Вивчення нового матеріалу: пояснення будови молекул та речовин, демонстрація моделей, робота зі схемами та формулами";
  } else if (topic.includes("властивост") || topic.includes("реакці")) {
    content += "Вивчення нового матеріалу: пояснення хімічних властивостей, демонстраційні досліди, складання рівнянь реакцій";
  } else if (topic.includes("застосування") || topic.includes("виробництв")) {
    content += "Вивчення нового матеріалу: характеристика практичного застосування речовин, аналіз схем виробництва, перегляд відеоматеріалів";
  } else if (moduleName.includes("Теорія") || topic.includes("теорія") || topic.includes("закон")) {
    content += "Вивчення нового матеріалу: пояснення теоретичних основ, аналіз наукових концепцій, розбір прикладів та вправ";
  } else if (moduleName.includes("Полімер") || topic.includes("полімер") || topic.includes("пластмас")) {
    content += "Вивчення нового матеріалу: характеристика будови та властивостей полімерів, обговорення екологічних проблем, аналіз сфер застосування";
  } else {
    content += "Вивчення нового матеріалу: пояснення вчителя з використанням таблиці Менделєєва, схем та моделей молекул, аналіз хімічних формул і рівнянь";
  }

  content += ". Закріплення вивченого: фронтальне опитування, виконання вправ і задач, тестові завдання";
  content += ". Підбиття підсумків уроку, оцінювання роботи учнів, пояснення домашнього завдання.";

  return content;
}

export function generateChemistryCalendarPlan(settings: ChemistryPlanSettings) {
  const classNum = parseInt(settings.class);
  const modules = getModulesForClass(classNum);

  if (modules.length === 0) {
    throw new Error(`Немає модулів для ${classNum} класу`);
  }

  const weekdays = convertWeekdays(settings.weekdays);
  const startDate = convertStartDate(settings.startDate);
  const semester = convertSemester(settings.semester);

  const maxLessons = getMaxLessons(classNum, semester);

  const lessons: any[] = [];
  let lessonNumber = 1;
  let currentDate = new Date(startDate);

  modules.forEach(module => {
    module.topics.forEach(topic => {
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
          content: generateLessonContent(topic.topic, module.name)
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
    lessons
  };
}

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}
