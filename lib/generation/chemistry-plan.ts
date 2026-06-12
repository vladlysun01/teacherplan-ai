// Генератор календарних планів для Хімії 7-11 клас
import { convertWeekdays, convertSemester, convertStartDate } from "./utils";
import { allModules7, type Module } from './chemistry-modules-7';
import { allModules8 } from './chemistry-modules-8';
import { allModules9 } from './chemistry-modules-9';
import { allModules10 } from './chemistry-modules-10';
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
    case 7:  return allModules7;
    case 8:  return allModules8;
    case 9:  return allModules9;
    case 10: return allModules10;
    case 11: return allModules11;
    default: return [];
  }
}

// 7 кл: 1.5 год/тиж → 51 год
// 8 кл: 2 год/тиж → 68 год
// 9 кл: 2 год/тиж → 68 год
// 10 кл: 1.5 год/тиж → 52 год
// 11 кл: 2 год/тиж → 70 год
function getMaxLessons(classNum: number, semester: number): number {
  if (classNum === 7)  return semester === 1 ? 24 : 27;
  if (classNum === 8)  return semester === 1 ? 32 : 36;
  if (classNum === 9)  return semester === 1 ? 32 : 36;
  if (classNum === 10) return semester === 1 ? 24 : 28;
  if (classNum === 11) return semester === 1 ? 32 : 38;
  return 35;
}

function generateLessonContent(topic: string, moduleName: string): string {
  let content = "";

  content += "Організаційний момент. ";
  content += "Актуалізація опорних знань: фронтальне опитування за матеріалом попереднього уроку. ";
  content += "Мотивація навчальної діяльності: повідомлення теми та мети уроку. ";

  if (topic.includes("Практична робота") || topic.includes("практична")) {
    content += "Виконання практичної роботи: дослідження властивостей речовин, проведення хімічних дослідів, оформлення результатів";
  } else if (topic.includes("Розрахункові задачі") || topic.includes("задач")) {
    content += "Вивчення нового матеріалу: пояснення алгоритму розв'язування задач, розбір прикладів. Самостійне розв'язування задач";
  } else if (topic.includes("Повторення")) {
    content += "Повторення та систематизація вивченого матеріалу: фронтальне опитування, виконання тренувальних вправ і задач";
  } else if (topic.includes("будов") || topic.includes("склад") || topic.includes("структур") || topic.includes("формул")) {
    content += "Вивчення нового матеріалу: пояснення будови молекул та речовин, демонстрація моделей, складання формул";
  } else if (topic.includes("властивост") || topic.includes("реакці") || topic.includes("взаємоді")) {
    content += "Вивчення нового матеріалу: пояснення хімічних властивостей, демонстраційні досліди, складання рівнянь реакцій";
  } else if (topic.includes("застосування") || topic.includes("роль") || topic.includes("значення")) {
    content += "Вивчення нового матеріалу: характеристика практичного застосування речовин, обговорення значення для людини і довкілля";
  } else {
    content += "Вивчення нового матеріалу: пояснення вчителя з використанням таблиці Менделєєва, схем і моделей молекул, аналіз хімічних формул і рівнянь";
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
