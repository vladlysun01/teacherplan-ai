// Генератор календарних планів для Географії
import { convertWeekdays, convertSemester, convertStartDate } from "./utils";
import { allModules10, type GeographyModule } from './geography-modules-10';
import { allModules11 } from './geography-modules-11';
import { allModules6 } from './geography-modules-6';
import { allModules7 } from './geography-modules-7';
import { allModules8 } from './geography-modules-8';
import { allModules9 } from './geography-modules-9';

export interface GeographyPlanSettings {
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

// Допоміжна функція для отримання назви дня тижня
function getWeekdayName(date: Date): string {
  const days = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  return days[date.getDay()];
}

// Отримання модулів для класу
function getModulesForClass(classNum: number): GeographyModule[] {
  switch (classNum) {
    case 6:
      return allModules6;
    case 7:
      return allModules7;
    case 8:
      return allModules8;
    case 9:
      return allModules9;
    case 10:
      return allModules10;
    case 11:
      return allModules11;
    default:
      return [];
  }
}

// Розрахунок максимальної кількості уроків для семестру
function getMaxLessons(classNum: number, semester: number): number {
  // 6, 7, 8 класи: 2 год/тиждень
  if ([6, 7, 8].includes(classNum)) {
    return semester === 1 ? 32 : 38;
  }
  // 9 клас: 1.5 год/тиждень
  if (classNum === 9) {
    return semester === 1 ? 24 : 25;
  }
  // 10 клас: 1.5 год/тиждень
  if (classNum === 10) {
    return semester === 1 ? 24 : 25;
  }
  // 11 клас: 1 год/тиждень
  if (classNum === 11) {
    return semester === 1 ? 16 : 19;
  }
  return 35;
}

// Генерація змісту уроку
function generateLessonContent(topic: string, moduleName: string): string {
  let content = "";
  
  // Організаційний момент
  content += "Організаційний момент. ";
  
  // Актуалізація знань
  content += "Актуалізація опорних знань: фронтальне опитування за матеріалом попереднього уроку. ";
  
  // Мотивація
  content += "Мотивація навчальної діяльності: повідомлення теми та мети уроку. ";
  
  // Основна частина
  if (topic.includes("Практична робота")) {
    content += "Виконання практичної роботи: робота з картами, аналіз статистичних даних, виконання завдань";
  } else if (topic.includes("характеристика")) {
    content += "Вивчення нового матеріалу: пояснення вчителя з використанням карт, аналіз економіко-географічного положення, характеристика природних умов та ресурсів, особливості населення та господарства";
  } else if (topic.includes("Узагальнення")) {
    content += "Узагальнення знань: систематизація вивченого матеріалу, виконання узагальнюючих завдань, робота з картами";
  } else if (topic.includes("координат") || topic.includes("масштаб") || topic.includes("план") || topic.includes("карт")) {
    content += "Вивчення нового матеріалу: пояснення вчителя, робота з картами та планами місцевості, виконання вправ з визначення координат, масштабу та напрямків";
  } else if (moduleName.includes("Літосфера") || moduleName.includes("Атмосфера") || moduleName.includes("Гідросфера") || moduleName.includes("Біосфера")) {
    content += "Вивчення нового матеріалу: пояснення географічних закономірностей, робота з тематичними картами, аналіз схем та діаграм";
  } else if (moduleName.includes("материк") || moduleName.includes("Африка") || moduleName.includes("Америка") || moduleName.includes("Євразія") || moduleName.includes("Австралія")) {
    content += "Вивчення нового матеріалу: характеристика природи материка, робота з фізичною та тематичними картами, позначення об'єктів на контурній карті";
  } else if (moduleName.includes("господарство") || moduleName.includes("економік") || moduleName.includes("промисловість") || moduleName.includes("сектор")) {
    content += "Вивчення нового матеріалу: пояснення особливостей розвитку і розміщення галузі, аналіз статистичних даних та тематичних карт";
  } else {
    content += "Вивчення нового матеріалу: пояснення вчителя з використанням географічних карт, презентації, аналіз статистичної інформації";
  }
  
  // Закріплення
  content += ". Закріплення вивченого: фронтальне опитування, робота з контурними картами, виконання практичних завдань";
  
  // Підсумки
  content += ". Підбиття підсумків уроку, оцінювання роботи учнів, пояснення домашнього завдання.";
  
  return content;
}

// Головна функція генерації
export function generateGeographyCalendarPlan(settings: GeographyPlanSettings) {
  const classNum = parseInt(settings.class);
  const modules = getModulesForClass(classNum);
  
  if (modules.length === 0) {
    throw new Error(`Немає модулів для ${classNum} класу`);
  }
  
  // Конвертуємо параметри
  const weekdays = convertWeekdays(settings.weekdays);
  const startDate = convertStartDate(settings.startDate);
  const semester = convertSemester(settings.semester);
  
  const maxLessons = getMaxLessons(classNum, semester);
  
  // Генеруємо уроки
  const lessons: any[] = [];
  let lessonNumber = 1;
  let currentDate = new Date(startDate);
  
  modules.forEach(module => {
    module.topics.forEach(topic => {
      for (let h = 0; h < topic.hours; h++) {
        if (lessons.length >= maxLessons) {
          return;
        }
        
        // Знаходимо наступний день тижня
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
