/**
 * Генератор календарно-тематичних планів з Захисту України
 * Для 10-11 класів (профільний рівень)
 */

import {
  defenseOfUkraine10Modules,
  defenseOfUkraine10Info
} from './defense-ukraine-10-modules';

import {
  defenseOfUkraine11Modules,
  defenseOfUkraine11Info
} from './defense-ukraine-11-modules';

// ============================================================================
// ІНТЕРФЕЙСИ
// ============================================================================

export interface DefenseOfUkrainePlanSettings {
  class: '10' | '11';
  subject: 'Захист України';
  level: 'профільний';
  schoolYear: string;
  semester: number; // 0 = весь рік, 1 = I семестр, 2 = II семестр
  weekdays: number[]; // [1, 3, 5] - пн, ср, пт (6 уроків на тиждень)
  startDate: Date;
  teacherName: string;
  teacherCategory: string;
  schoolName: string;
}

export interface DefenseLesson {
  lessonNumber: number;
  date: string;
  topic: string;
  moduleNumber: number;
  moduleName: string;
  lessonType: 'теорія' | 'практика' | 'практичне заняття' | 'польове заняття';
  content: {
    organizationalMoment: string;
    checkHomework?: string;
    mainPart: string;
    practice: string;
    consolidation: string;
    homework: string;
  };
  equipment: string[];
  expectedResults: string;
  safetyRules?: string;
}

// ============================================================================
// ОТРИМАННЯ МОДУЛІВ
// ============================================================================

function getModulesForClass(className: '10' | '11') {
  if (className === '10') {
    return defenseOfUkraine10Modules;
  } else {
    return defenseOfUkraine11Modules;
  }
}

function getSubjectInfo(className: '10' | '11') {
  if (className === '10') {
    return defenseOfUkraine10Info;
  } else {
    return defenseOfUkraine11Info;
  }
}

// ============================================================================
// ГЕНЕРАЦІЯ ДАТ
// ============================================================================

function generateDates(
  startDate: Date,
  weekdays: number[],
  totalLessons: number
): Date[] {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);

  while (dates.length < totalLessons) {
    const dayOfWeek = currentDate.getDay();
    const adjustedDay = dayOfWeek === 0 ? 7 : dayOfWeek;

    if (weekdays.includes(adjustedDay)) {
      dates.push(new Date(currentDate));
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

// ============================================================================
// РОЗПОДІЛ МОДУЛІВ ПО СЕМЕСТРАХ
// ============================================================================

function distributeModulesBySemesters(
  modules: any[],
  semester: number
): any[] {
  if (semester === 0) {
    return modules; // весь рік
  }

  // Розподіляємо за чвертями (quarter)
  if (semester === 1) {
    // I семестр = 1-2 чверті
    return modules.filter(m => m.quarter === 1 || m.quarter === 2);
  } else {
    // II семестр = 3-4 чверті
    return modules.filter(m => m.quarter === 3 || m.quarter === 4);
  }
}

// ============================================================================
// ГЕНЕРАЦІЯ УРОКІВ
// ============================================================================

function generateLessonsForModule(
  module: any,
  startLessonNumber: number,
  dates: Date[]
): DefenseLesson[] {
  const lessons: DefenseLesson[] = [];
  const topicsPerLesson = Math.ceil(module.topics.length / module.hours);

  for (let i = 0; i < module.hours; i++) {
    const lessonNumber = startLessonNumber + i;
    const date = dates[lessons.length];

    // Визначаємо тип уроку
    let lessonType: DefenseLesson['lessonType'] = 'теорія';
    
    if (module.name.includes('практичн') || module.name.includes('Стройова') || 
        module.name.includes('Вогнева') || module.name.includes('Фізична')) {
      lessonType = i % 3 === 0 ? 'теорія' : 'практика';
    } else if (module.name.includes('Тактична')) {
      lessonType = i % 4 === 0 ? 'теорія' : 'польове заняття';
    } else {
      lessonType = i % 2 === 0 ? 'теорія' : 'практичне заняття';
    }

    // Визначаємо тему уроку
    const topicIndex = Math.floor(i / Math.max(1, module.hours / module.topics.length));
    const topic = module.topics[topicIndex] || module.topics[0];

    const lesson: DefenseLesson = {
      lessonNumber,
      date: formatDate(date),
      topic: `${topic}`,
      moduleNumber: module.module,
      moduleName: module.name,
      lessonType,
      content: {
        organizationalMoment: generateOrganizationalMoment(lessonType),
        checkHomework: lessonNumber > 1 ? generateHomeworkCheck(module.name) : undefined,
        mainPart: generateMainPart(module.name, topic, lessonType),
        practice: generatePractice(module.name, topic, lessonType),
        consolidation: generateConsolidation(module.name, lessonType),
        homework: generateHomework(module.name, topic, lessonType)
      },
      equipment: generateEquipment(module.name, lessonType),
      expectedResults: generateExpectedResults(module.name, topic, lessonType),
      safetyRules: needsSafetyRules(module.name) ? generateSafetyRules(module.name) : undefined
    };

    lessons.push(lesson);
  }

  return lessons;
}

// ============================================================================
// ДОПОМІЖНІ ФУНКЦІЇ ГЕНЕРАЦІЇ КОНТЕНТУ
// ============================================================================

function generateOrganizationalMoment(lessonType: string): string {
  if (lessonType === 'практика' || lessonType === 'польове заняття') {
    return "Перевірка присутності, зовнішнього вигляду, готовності до практичного заняття. Інструктаж з техніки безпеки.";
  }
  return "Перевірка присутності учнів, готовності до уроку. Оголошення теми та мети заняття.";
}

function generateHomeworkCheck(moduleName: string): string {
  return `Опитування учнів з попередньої теми. Перевірка виконання домашнього завдання з розділу "${moduleName}".`;
}

function generateMainPart(moduleName: string, topic: string, lessonType: string): string {
  if (lessonType === 'практика' || lessonType === 'польове заняття') {
    return `Практична відпрацювання навиків: ${topic}. Показ правильного виконання вправ. Індивідуальна робота з учнями.`;
  }
  return `Пояснення нового матеріалу з теми "${topic}". Розгляд теоретичних основ. Аналіз практичних прикладів. Демонстрація навчальних матеріалів.`;
}

function generatePractice(moduleName: string, topic: string, lessonType: string): string {
  if (lessonType === 'теорія') {
    return `Робота з навчальними матеріалами, аналіз схем та таблиць по темі "${topic}".`;
  }
  return `Практичне відпрацювання навиків. Виконання вправ та нормативів. Індивідуальне та групове тренування.`;
}

function generateConsolidation(moduleName: string, lessonType: string): string {
  if (lessonType === 'практика' || lessonType === 'польове заняття') {
    return "Контроль виконання практичних вправ. Аналіз помилок. Повторне виконання складних елементів.";
  }
  return "Фронтальне опитування учнів. Відповіді на запитання. Закріплення вивченого матеріалу.";
}

function generateHomework(moduleName: string, topic: string, lessonType: string): string {
  if (lessonType === 'практика' || lessonType === 'польове заняття') {
    return `Повторити теоретичний матеріал з теми "${topic}". Підготуватися до виконання контрольних нормативів.`;
  }
  return `Опрацювати конспект. Вивчити статутні вимоги по темі "${topic}". Підготувати відповіді на контрольні запитання.`;
}

function generateEquipment(moduleName: string, lessonType: string): string[] {
  const common = ['Мультимедійний проектор', 'Навчальні плакати', 'Методичні матеріали'];
  
  if (moduleName.includes('Стройова')) {
    return [...common, 'Навчальна зброя (макети)', 'Майданчик для стройової підготовки'];
  } else if (moduleName.includes('Вогнева')) {
    return [...common, 'Навчальна зброя', 'Пневматичні гвинтівки', 'Макети зброї', 'Стрілецький тир'];
  } else if (moduleName.includes('Тактична')) {
    return [...common, 'Топографічні карти', 'Макети місцевості', 'Компаси', 'Навчальні гранати'];
  } else if (moduleName.includes('Фізична')) {
    return [...common, 'Спортивний інвентар', 'Смуга перешкод', 'Спортивний майданчик'];
  } else if (moduleName.includes('Топографія')) {
    return [...common, 'Топографічні карти', 'Компаси', 'Лінійки', 'GPS-навігатори'];
  } else if (moduleName.includes('інженерна')) {
    return [...common, 'Саперний інструмент', 'Макети мін', 'Засоби зв\'язку', 'Радіостанції'];
  }
  
  return common;
}

function generateExpectedResults(moduleName: string, topic: string, lessonType: string): string {
  if (lessonType === 'практика' || lessonType === 'польове заняття') {
    return `Учні набувають практичних навиків з теми "${topic}". Вміють правильно виконувати практичні вправи та нормативи.`;
  }
  return `Учні знають основні положення з теми "${topic}". Розуміють теоретичні основи та можуть застосувати знання на практиці.`;
}

function needsSafetyRules(moduleName: string): boolean {
  return moduleName.includes('Вогнева') || 
         moduleName.includes('Фізична') || 
         moduleName.includes('Тактична') ||
         moduleName.includes('інженерна');
}

function generateSafetyRules(moduleName: string): string {
  if (moduleName.includes('Вогнева')) {
    return "ОБОВ'ЯЗКОВО! Дотримання правил поводження зі зброєю. Заборонено направляти зброю на людей навіть у розрядженому стані.";
  } else if (moduleName.includes('Фізична')) {
    return "Розминка перед виконанням вправ. Дотримання техніки безпеки при подоланні перешкод.";
  }
  return "Дотримання техніки безпеки під час практичних занять. Виконання вказівок викладача.";
}

// ============================================================================
// ГОЛОВНА ФУНКЦІЯ ГЕНЕРАЦІЇ
// ============================================================================

export function generateDefenseOfUkrainePlan(
  settings: DefenseOfUkrainePlanSettings
): DefenseLesson[] {
  const modules = getModulesForClass(settings.class);
  const selectedModules = distributeModulesBySemesters(modules, settings.semester);
  
  const totalHours = selectedModules.reduce((sum, m) => sum + m.hours, 0);
  const dates = generateDates(settings.startDate, settings.weekdays, totalHours);
  
  const allLessons: DefenseLesson[] = [];
  let lessonNumber = 1;

  for (const module of selectedModules) {
    const moduleLessons = generateLessonsForModule(
      module,
      lessonNumber,
      dates.slice(lessonNumber - 1)
    );
    allLessons.push(...moduleLessons);
    lessonNumber += module.hours;
  }

  return allLessons;
}

// Експорт для використання в інших модулях
export {
  defenseOfUkraine10Modules,
  defenseOfUkraine11Modules,
  defenseOfUkraine10Info,
  defenseOfUkraine11Info,
  getModulesForClass,
  getSubjectInfo
};
/**
 * WRAPPER ФУНКЦІЯ ДЛЯ ЗАХИСТУ УКРАЇНИ
 * Додай цей код В КІНЕЦЬ файлу lib/generation/defense-ukraine-plan.ts
 */

// ============================================
// WRAPPER ДЛЯ СУМІСНОСТІ З ROUTE.TS
// ============================================

export function generateDefenseOfUkraineCalendarPlan(formData: any) {
  // Конвертуємо параметри у правильний формат
  const settings: DefenseOfUkrainePlanSettings = {
    class: formData.class as '10' | '11',
    subject: 'Захист України',
    level: 'профільний',
    schoolYear: formData.schoolYear || '2024/2025',
    semester: parseInt(formData.semester || '0'),
    weekdays: typeof formData.weekdays === 'string' 
      ? formData.weekdays.split(',').map((d: string) => parseInt(d.trim()))
      : formData.weekdays || [1, 2, 3, 4, 5, 6], // пн-сб
    startDate: formData.startDate ? new Date(formData.startDate) : new Date('2024-09-01'),
    teacherName: formData.teacherName || '',
    teacherCategory: formData.teacherCategory || '',
    schoolName: formData.schoolName || ''
  };

  // Генеруємо уроки
  const lessons = generateDefenseOfUkrainePlan(settings);

  // Повертаємо у форматі який очікує route.ts
  return {
    subject: settings.subject,
    class: settings.class,
    schoolYear: settings.schoolYear,
    semester: settings.semester.toString(),
    teacherName: settings.teacherName,
    teacherCategory: settings.teacherCategory,
    schoolName: settings.schoolName,
    weekdays: settings.weekdays.join(', '),
    startDate: settings.startDate.toISOString().split('T')[0],
    lessons: lessons
  };
}

