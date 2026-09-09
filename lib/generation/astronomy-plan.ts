// Генератор календарних планів для Астрономії.
// Рівень стандарту: лише 11 клас, 1 год/тиждень, 35 год/рік.
// Профільний рівень: 10-11 класи, 1 год/тиждень, 70 год на весь курс
// (розподілений по класах у astronomy-modules.ts).
import { convertWeekdays, convertSemester, convertStartDate } from "./utils";
import {
  astronomyStandard11,
  astronomyProfil10,
  astronomyProfil11,
  type Module,
} from "./astronomy-modules";

export interface AstronomyPlanSettings {
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

function getModules(classNum: number, isProfile: boolean): Module[] {
  if (isProfile) {
    return classNum === 10 ? astronomyProfil10 : astronomyProfil11;
  }
  return astronomyStandard11;
}

function generateLessonContent(topic: string, moduleName: string): string {
  let content = "Організаційний момент. ";
  content += "Актуалізація опорних знань: фронтальне опитування за матеріалом попереднього уроку. ";
  content += "Мотивація навчальної діяльності: повідомлення теми та мети уроку. ";

  if (moduleName.includes("Узагальнювальне") || topic.includes("Узагальнення") || topic.includes("Новини")) {
    content += "Узагальнення та систематизація знань: фронтальне опитування, виконання тестових завдань, обговорення сучасних астрономічних відкриттів";
  } else if (moduleName.includes("Сонячна система") || moduleName.includes("планетна система")) {
    content += "Вивчення нового матеріалу: характеристика тіл Сонячної системи, робота зі схемами й моделями орбіт, аналіз порівняльних таблиць";
  } else if (moduleName.includes("Зорі") || topic.includes("зор") || topic.includes("Сонце")) {
    content += "Вивчення нового матеріалу: пояснення фізичних характеристик і еволюції зір, робота з діаграмою Герцшпрунга—Рассела, аналіз спектрів";
  } else if (moduleName.includes("Галактик") || moduleName.includes("Всесвіт") || topic.includes("Всесвіт")) {
    content += "Вивчення нового матеріалу: пояснення будови Галактики й Всесвіту, аналіз закону Габбла, обговорення моделі Великого Вибуху";
  } else if (moduleName.includes("Методи") || topic.includes("телескоп") || topic.includes("обсерваторі")) {
    content += "Вивчення нового матеріалу: характеристика методів і засобів астрономічних спостережень, розгляд будови телескопів, приклади сучасних обсерваторій";
  } else if (moduleName.includes("Небесна сфера") || topic.includes("координат") || topic.includes("календар") || topic.includes("час")) {
    content += "Вивчення нового матеріалу: пояснення небесних координат і систем відліку часу, практична робота з рухомою картою зоряного неба";
  } else {
    content += "Вивчення нового матеріалу: пояснення вчителя з використанням ілюстрацій, схем і астрономічних моделей, аналіз явищ і закономірностей";
  }

  content += ". Закріплення вивченого: фронтальне опитування, тестові завдання, робота з підручником";
  content += ". Підбиття підсумків уроку, оцінювання роботи учнів, пояснення домашнього завдання.";

  return content;
}

export function generateAstronomyCalendarPlan(settings: AstronomyPlanSettings) {
  const classNum = parseInt(settings.class);
  const isProfile = settings.programId?.includes("profile") ?? false;
  const modules = getModules(classNum, isProfile);

  const weekdays = convertWeekdays(settings.weekdays);
  const startDate = convertStartDate(settings.startDate);
  const semester = convertSemester(settings.semester);

  // 1 год/тиждень у всіх варіантах (35 год/рік стандарт; 35 год/рік на клас у профілі).
  const weeklyHours = 1;
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
