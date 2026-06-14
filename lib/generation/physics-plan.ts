// Генератор календарних планів для Фізики 10-11 клас
import { convertWeekdays, convertSemester, convertStartDate } from "./utils";
import { allModules10, type Module } from './physics-modules-10';
import { allModules11 } from './physics-modules-11';

export interface PhysicsPlanSettings {
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
    case 10: return allModules10;
    case 11: return allModules11;
    default: return [];
  }
}

// Стандарт: 3 год/тиж → 105 год/рік
function getMaxLessons(classNum: number, semester: number): number {
  return semester === 1 ? 48 : 57;
}

function generateLessonContent(topic: string, moduleName: string): string {
  let content = "";

  content += "Організаційний момент. ";
  content += "Актуалізація опорних знань: фронтальне опитування за матеріалом попереднього уроку. ";
  content += "Мотивація навчальної діяльності: повідомлення теми та мети уроку. ";

  if (topic.includes("Лабораторні роботи") || topic.includes("лабораторн")) {
    content += "Виконання лабораторної роботи: підготовка обладнання, проведення дослідів, вимірювання, обробка результатів, оформлення звіту";
  } else if (topic.includes("задач") || topic.includes("Розв'язування")) {
    content += "Розв'язування задач: аналіз умови, складання фізичної моделі, вибір законів та формул, математичні розрахунки, аналіз результату";
  } else if (topic.includes("Узагальнення") || topic.includes("Резерв")) {
    content += "Узагальнення та систематизація знань: повторення основних понять і законів, розв'язування задач різних типів";
  } else if (moduleName.includes("Механіка") || topic.includes("рух") || topic.includes("швидкість") || topic.includes("прискорення")) {
    content += "Вивчення нового матеріалу: пояснення законів механіки, аналіз графіків і формул, розв'язування якісних задач, демонстраційні досліди";
  } else if (moduleName.includes("Термодинаміка") || topic.includes("температур") || topic.includes("газ") || topic.includes("тепл")) {
    content += "Вивчення нового матеріалу: пояснення молекулярно-кінетичної теорії, демонстрація ізопроцесів, аналіз графіків, розв'язування задач";
  } else if (moduleName.includes("Електричне поле") || topic.includes("електрич") || topic.includes("заряд") || topic.includes("потенціал")) {
    content += "Вивчення нового матеріалу: пояснення природи електричного поля, аналіз силових ліній і еквіпотенціальних поверхонь, розв'язування задач";
  } else if (moduleName.includes("Електродинаміка") || topic.includes("струм") || topic.includes("опір") || topic.includes("магніт")) {
    content += "Вивчення нового матеріалу: пояснення законів електродинаміки, демонстраційні досліди, складання схем, розв'язування задач";
  } else if (moduleName.includes("Оптика") || topic.includes("світл") || topic.includes("лінз") || topic.includes("дифракц")) {
    content += "Вивчення нового матеріалу: пояснення оптичних явищ, демонстрація дослідів, аналіз схем, розв'язування задач";
  } else if (moduleName.includes("Атомна") || topic.includes("ядр") || topic.includes("радіоактивн") || topic.includes("фотон")) {
    content += "Вивчення нового матеріалу: пояснення будови атома і ядра, аналіз ядерних реакцій, розв'язування задач";
  } else {
    content += "Вивчення нового матеріалу: пояснення вчителя з використанням таблиць і схем, демонстраційні досліди, аналіз фізичних явищ";
  }

  content += ". Закріплення вивченого: фронтальне опитування, розв'язування задач, тестові завдання";
  content += ". Підбиття підсумків уроку, оцінювання роботи учнів, пояснення домашнього завдання.";

  return content;
}

export function generatePhysicsCalendarPlan(settings: PhysicsPlanSettings) {
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
