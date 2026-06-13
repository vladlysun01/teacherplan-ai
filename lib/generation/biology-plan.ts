// Генератор календарних планів для Біології 6-11 клас
import { convertWeekdays, convertSemester, convertStartDate } from "./utils";
import { allModules6, type Module } from './biology-modules-6';
import { allModules7 } from './biology-modules-7';
import { allModules8 } from './biology-modules-8';
import { allModules9 } from './biology-modules-9';
import { allModules10 } from './biology-modules-10';
import { allModules11 } from './biology-modules-11';

export interface BiologyPlanSettings {
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
    case 6:  return allModules6;
    case 7:  return allModules7;
    case 8:  return allModules8;
    case 9:  return allModules9;
    case 10: return allModules10;
    case 11: return allModules11;
    default: return [];
  }
}

// 6-9 кл: 2 год/тиж → 70 год/рік
// 10-11 кл (стандарт): 1.5 год/тиж → 52 год/рік
function getMaxLessons(classNum: number, semester: number): number {
  if ([6, 7, 8, 9].includes(classNum)) {
    return semester === 1 ? 32 : 38;
  }
  if ([10, 11].includes(classNum)) {
    return semester === 1 ? 24 : 28;
  }
  return 35;
}

function generateLessonContent(topic: string, moduleName: string): string {
  let content = "";

  content += "Організаційний момент. ";
  content += "Актуалізація опорних знань: фронтальне опитування за матеріалом попереднього уроку. ";
  content += "Мотивація навчальної діяльності: повідомлення теми та мети уроку. ";

  if (topic.includes("Практична робота") || topic.includes("Лабораторна робота") || topic.includes("дослідження")) {
    content += "Виконання практичної (лабораторної) роботи: дослідження об'єктів, спостереження, оформлення результатів у зошиті";
  } else if (topic.includes("Узагальнення")) {
    content += "Узагальнення та систематизація знань: фронтальне опитування, виконання тестових завдань, складання схем і таблиць";
  } else if (moduleName.includes("Клітина") || topic.includes("клітин") || topic.includes("органел")) {
    content += "Вивчення нового матеріалу: пояснення будови клітини, розгляд схем і таблиць, робота з мікроскопом та мікропрепаратами";
  } else if (moduleName.includes("Екологія") || topic.includes("екосистем") || topic.includes("біосфер")) {
    content += "Вивчення нового матеріалу: пояснення екологічних закономірностей, аналіз схем ланцюгів живлення, обговорення екологічних проблем";
  } else if (moduleName.includes("Генетика") || topic.includes("спадков") || topic.includes("Менделя") || topic.includes("ген")) {
    content += "Вивчення нового матеріалу: пояснення законів спадковості, розв'язування генетичних задач, аналіз схем схрещування";
  } else if (topic.includes("Еволюція") || topic.includes("еволюц") || topic.includes("добір")) {
    content += "Вивчення нового матеріалу: пояснення рушійних сил еволюції, аналіз доказів еволюції, обговорення прикладів природного добору";
  } else if (moduleName.includes("людини") || topic.includes("людин") || topic.includes("організм")) {
    content += "Вивчення нового матеріалу: характеристика будови та функцій органів, розгляд таблиць і схем, обговорення питань гігієни та здоров'я";
  } else if (topic.includes("різноманітність") || topic.includes("систематик") || topic.includes("класифікац")) {
    content += "Вивчення нового матеріалу: характеристика груп організмів, робота з гербарієм або колекцією, порівняння основних ознак";
  } else {
    content += "Вивчення нового матеріалу: пояснення вчителя з використанням таблиць, схем і моделей, аналіз біологічних об'єктів та явищ";
  }

  content += ". Закріплення вивченого: фронтальне опитування, тестові завдання, робота з підручником";
  content += ". Підбиття підсумків уроку, оцінювання роботи учнів, пояснення домашнього завдання.";

  return content;
}

export function generateBiologyCalendarPlan(settings: BiologyPlanSettings) {
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
