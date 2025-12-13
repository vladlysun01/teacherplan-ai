// Генератор календарних планів для Основ правознавства
import { convertWeekdays, convertSemester, convertStartDate } from "./utils";
import { allModulesLaw9, type LawModule } from './law-modules-9';

export interface LawPlanSettings {
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

// Генерація змісту уроку
function generateLessonContent(topic: string, moduleName: string): string {
  let content = "";
  
  // Організаційний момент
  content += "Організаційний момент. ";
  
  // Актуалізація знань
  if (!topic.includes("Вступ")) {
    content += "Актуалізація опорних знань: усне опитування, перевірка домашнього завдання. ";
  }
  
  // Мотивація
  content += "Мотивація навчальної діяльності: повідомлення теми та мети уроку, з'ясування значення теми для розуміння правових відносин. ";
  
  // Основна частина
  if (topic.includes("Практичне заняття") || topic.includes("Практичні заняття")) {
    content += "Практична робота: розв'язання правових ситуацій, аналіз нормативно-правових актів, робота в групах, обговорення проблемних питань";
  } else if (topic.includes("Узагальнення")) {
    content += "Узагальнення знань: систематизація вивченого матеріалу, виконання узагальнюючих завдань, тестування";
  } else if (moduleName.includes("ОСНОВИ ТЕОРІЇ ПРАВА")) {
    content += "Вивчення нового матеріалу: пояснення основних правових понять та категорій, робота з визначеннями, аналіз схем, приклади з життєвих ситуацій";
  } else if (moduleName.includes("Неповнолітні")) {
    content += "Вивчення нового матеріалу: пояснення особливостей правового статусу неповнолітніх, аналіз статей законодавства, розгляд конкретних ситуацій, робота з кодексами";
  } else if (moduleName.includes("ВЗАЄМОЗВ'ЯЗОК")) {
    content += "Вивчення нового матеріалу: пояснення конституційних норм, робота з текстом Конституції України, аналіз прав та обов'язків громадян, приклади реалізації прав";
  } else if (moduleName.includes("ПРАВНИЧА")) {
    content += "Вивчення нового матеріалу: ознайомлення з правничими професіями, перегляд відеоматеріалів, обговорення особливостей професійної діяльності правника";
  } else {
    content += "Вивчення нового матеріалу: пояснення вчителя, робота з підручником, аналіз правових документів, розгляд життєвих ситуацій";
  }
  
  // Закріплення
  if (!topic.includes("Узагальнення") && !topic.includes("Практичне заняття")) {
    content += ". Закріплення вивченого: фронтальне опитування, виконання вправ, обговорення проблемних питань";
  }
  
  // Підсумки
  content += ". Підбиття підсумків уроку, оцінювання відповідей учнів, пояснення домашнього завдання.";
  
  return content;
}

// Головна функція генерації
export function generateLawCalendarPlan(settings: LawPlanSettings) {
  const modules = allModulesLaw9;
  
  if (modules.length === 0) {
    throw new Error(`Немає модулів для 9 класу`);
  }
  
  // Конвертуємо параметри
  const weekdays = convertWeekdays(settings.weekdays);
  const startDate = convertStartDate(settings.startDate);
  const semester = convertSemester(settings.semester);
  
  // Розрахунок кількості уроків у семестрі
  // 1 год/тиждень, 1 семестр: ~16 тижнів, 2 семестр: ~19 тижнів
  const maxLessons = semester === 1 ? 16 : 19;
  
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
