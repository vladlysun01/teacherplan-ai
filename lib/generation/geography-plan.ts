// Генератор календарних планів для Географії
import { convertWeekdays, convertSemester, convertStartDate } from "./utils";
import { allModules10, type GeographyModule } from './geography-modules-10';
import { allModules11 } from './geography-modules-11';

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

// Отримання модулів для класу
function getModulesForClass(classNum: number): GeographyModule[] {
  switch (classNum) {
    case 10:
      return allModules10;
    case 11:
      return allModules11;
    default:
      return [];
  }
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
  } else if (moduleName.includes("Топографія") || moduleName.includes("Картографія")) {
    content += "Вивчення нового матеріалу: пояснення вчителя, робота з топографічними картами, виконання вправ з визначення координат та азимутів";
  } else if (moduleName.includes("оболонка") || moduleName.includes("сфера")) {
    content += "Вивчення нового матеріалу: пояснення географічних закономірностей, робота з тематичними картами, аналіз схем та діаграм";
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
  
  // Розрахунок кількості тижнів у семестрі
  const weeksInSemester = semester === 1 ? 16 : 19; // 1 семестр: ~16 тижнів, 2 семестр: ~19 тижнів
  const lessonsPerWeek = weekdays.length * 1.5; // 1.5 год/тиждень для 10 класу, 1 год для 11 класу
  let maxLessons = Math.floor(weeksInSemester * lessonsPerWeek);
  
  // Для 11 класу - 1 год/тиждень
  if (classNum === 11) {
    maxLessons = semester === 1 ? 16 : 19;
  }
  
  // Генеруємо уроки
  const lessons: any[] = [];
  let lessonNumber = 1;
  let currentDate = new Date(startDate);
  
  modules.forEach(module => {
    module.topics.forEach(topic => {
      for (let h = 0; h < topic.hours; h++) {
        // Перевіряємо чи не перевищили ліміт уроків для семестру
        if (lessons.length >= maxLessons) {
          return;
        }
        
        // Знаходимо наступний день тижня
        while (!weekdays.includes(currentDate.getDay())) {
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
