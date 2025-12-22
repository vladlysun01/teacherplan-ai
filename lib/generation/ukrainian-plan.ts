// Генерація календарних планів для української мови
import { convertWeekdays, convertSemester, convertStartDate } from "./utils";

import {
  UKRAINIAN_5_MODULES,
  UKRAINIAN_6_MODULES,
  UKRAINIAN_7_MODULES,
  UKRAINIAN_8_MODULES,
  UKRAINIAN_9_MODULES,
  UKRAINIAN_10_11_STANDARD,
  UKRAINIAN_10_11_PROFILE,
  type UkrainianModule
} from './ukrainian-modules';

export interface UkrainianPlanSettings {
  class: string;
  program: string;
  programId: string;
  subject: string;
  schoolYear: string;
  semester: '0' | '1' | '2';
  weekdays: string;
  startDate: string;
  teacherName: string;
  teacherCategory: string;
  schoolName: string;
}

// Отримання модулів для класу
function getModulesForClass(classNum: number, programId: string): UkrainianModule[] {
  switch (classNum) {
    case 5:
      return UKRAINIAN_5_MODULES;
    case 6:
      return UKRAINIAN_6_MODULES;
    case 7:
      return UKRAINIAN_7_MODULES;
    case 8:
      return UKRAINIAN_8_MODULES;
    case 9:
      return UKRAINIAN_9_MODULES;
    case 10:
    case 11:
      if (programId.includes('profile')) {
        return UKRAINIAN_10_11_PROFILE;
      }
      return UKRAINIAN_10_11_STANDARD;
    default:
      return [];
  }
}

// Розподіл модулів по семестрах
function distributeModulesBySemesters(modules: UkrainianModule[]) {
  const semester1: UkrainianModule[] = [];
  const semester2: UkrainianModule[] = [];
  
  modules.forEach((module, idx) => {
    if (idx % 2 === 0) {
      semester1.push(module);
    } else {
      semester2.push(module);
    }
  });
  
  return { semester1, semester2 };
}

// Генерація детального змісту уроку
function generateDetailedContent(topic: string, lessonIndex: number, totalLessons: number, moduleName: string): string {
  const isFirstLesson = lessonIndex === 0;
  const isLastLesson = lessonIndex === totalLessons - 1;
  
  let content = "";
  
  if (isFirstLesson) {
    content += "Організаційний момент. Перевірка готовності до уроку. ";
  }
  
  // Актуалізація знань (2-3 хв)
  if (lessonIndex > 0) {
    content += "Актуалізація опорних знань: усне опитування, фронтальна бесіда за матеріалом попереднього уроку. ";
  }
  
  // Мотивація навчальної діяльності (2-3 хв)
  content += "Мотивація: повідомлення теми уроку, постановка навчальних цілей, з'ясування практичного значення матеріалу. ";
  
  // Основна частина (30-35 хв)
  content += "Вивчення нового матеріалу: ";
  
  if (moduleName.includes("Лексикологія") || moduleName.includes("Фонетика")) {
    content += "пояснення теоретичного матеріалу з використанням презентації, робота з підручником, аналіз прикладів, виконання тренувальних вправ на закріплення правила, ";
  } else if (moduleName.includes("Синтаксис") || moduleName.includes("речення")) {
    content += "пояснення нових синтаксичних конструкцій, схематичне зображення речень, аналіз текстів, виконання синтаксичного розбору, робота з пунктограмами, ";
  } else if (moduleName.includes("Морфологія") || topic.includes("слово")) {
    content += "вивчення морфологічних ознак частини мови, відпрацювання правил правопису, морфологічний розбір, виконання вправ на застосування правила, ";
  } else if (moduleName.includes("Словотвір")) {
    content += "аналіз способів словотворення, словотвірний розбір слів, виконання вправ на творення нових слів, робота зі словотвірним словником, ";
  } else if (moduleName.includes("мовлення") || topic.includes("Текст") || topic.includes("Твір")) {
    content += "аналіз зразків текстів, визначення типу та стилю мовлення, складання плану, робота над збагаченням словникового запасу, підготовка до написання творчої роботи, ";
  } else {
    content += "пояснення теоретичного матеріалу, робота з правилом, аналіз прикладів з тексту, виконання практичних завдань, ";
  }
  
  // Закріплення (5-7 хв)
  content += "закріплення вивченого матеріалу через виконання самостійних завдань, роботу в парах, групове обговорення виконаних вправ";
  
  // Контроль
  if (isLastLesson && (topic.includes("Контрольна") || topic.includes("Диктант"))) {
    content += ". Контроль знань: написання контрольної роботи (диктанту, тесту, твору) для перевірки рівня засвоєння матеріалу";
  }
  
  // Домашнє завдання та підсумки (2-3 хв)
  content += ". Підбиття підсумків уроку, оцінювання роботи учнів, пояснення домашнього завдання";
  
  return content + ".";
}

// Допоміжні функції
function getWeekdayName(date: Date): string {
  const days = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  return days[date.getDay()];
}

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

// Головна функція генерації
export async function generateUkrainianCalendarPlan(settings: UkrainianPlanSettings) {
  try {
    const classNum = parseInt(settings.class);
    const modules = getModulesForClass(classNum, settings.programId);
    
    if (modules.length === 0) {
      throw new Error(`Немає модулів для ${settings.class} класу`);
    }
    
    const { semester1, semester2 } = distributeModulesBySemesters(modules);
    
    // Конвертуємо weekdays з рядка в масив рядків
    const weekdays: string[] = convertWeekdays(settings.weekdays);
    const startDate = new Date(settings.startDate);
    
    // 🔍 ДІАГНОСТИКА
    console.log('📊 UKRAINIAN PLAN DEBUG:');
    console.log('Клас:', settings.class);
    console.log('Семестр:', settings.semester);
    console.log('Weekdays:', weekdays);
    console.log('Модулів загалом:', modules.length);
    console.log('Semester1 модулів:', semester1.length);
    console.log('Semester2 модулів:', semester2.length);
    console.log('Semester1 теми:', semester1.map(m => `${m.name}: ${m.topics.length}`));
    console.log('Semester2 теми:', semester2.map(m => `${m.name}: ${m.topics.length}`));
    
    let lessonNumber = 1;
    let currentDate = new Date(startDate);
    const allLessons: any[] = [];
    
    // ✅ ДАТИ СЕМЕСТРІВ (український навчальний рік)
    const SEMESTER_1_START = new Date(startDate.getFullYear(), 8, 1);  // 1 вересня
    const SEMESTER_1_END = new Date(startDate.getFullYear(), 11, 31);  // 31 грудня
    const SEMESTER_2_START = new Date(startDate.getFullYear() + 1, 0, 9);  // 9 січня
    const SEMESTER_2_END = new Date(startDate.getFullYear() + 1, 4, 31);  // 31 травня
    
    // Функція для підрахунку уроків у періоді
    function countLessonsInPeriod(start: Date, end: Date, weekdays: string[]): number {
      let count = 0;
      const current = new Date(start);
      
      while (current <= end) {
        if (weekdays.includes(getWeekdayName(current))) {
          count++;
        }
        current.setDate(current.getDate() + 1);
      }
      
      return count;
    }
    
    // ✅ НОВА ЛОГІКА: Розтягуємо теми модулів на ВСІ уроки семестру
    function generateModuleLessons(modulesList: UkrainianModule[], semesterStart: Date, semesterEnd: Date) {
      // Рахуємо скільки РЕАЛЬНО уроків у семестрі
      const totalLessonsInSemester = countLessonsInPeriod(semesterStart, semesterEnd, weekdays);
      
      console.log(`📅 Період: ${formatDate(semesterStart)} - ${formatDate(semesterEnd)}`);
      console.log(`🎯 Уроків у семестрі: ${totalLessonsInSemester}`);
      
      // Збираємо всі теми з модулів
      const allTopics: Array<{moduleName: string, topic: string, moduleIndex: number}> = [];
      modulesList.forEach((module, moduleIdx) => {
        module.topics.forEach(topic => {
          allTopics.push({
            moduleName: module.name,
            topic: topic,
            moduleIndex: moduleIdx
          });
        });
      });
      
      const totalTopics = allTopics.length;
      console.log(`📚 Тем у модулях: ${totalTopics}`);
      
      // Розподіляємо уроки по темах
      const lessonsPerTopic = Math.floor(totalLessonsInSemester / totalTopics);
      const extraLessons = totalLessonsInSemester % totalTopics;
      
      console.log(`📊 Уроків на тему: ${lessonsPerTopic}, додаткових: ${extraLessons}`);
      
      // Генеруємо уроки для кожної теми
      allTopics.forEach((topicData, topicIdx) => {
        // Скільки уроків для цієї теми (перші теми отримують +1 якщо є залишок)
        const lessonsForThisTopic = lessonsPerTopic + (topicIdx < extraLessons ? 1 : 0);
        
        for (let lessonInTopic = 0; lessonInTopic < lessonsForThisTopic; lessonInTopic++) {
          // Перевіряємо чи не вийшли за межі семестру
          if (currentDate > semesterEnd) {
            console.log(`⚠️ Досягнуто кінця семестру на уроці ${lessonNumber}`);
            break;
          }
          
          // Знаходимо наступний день з weekdays
          while (!weekdays.includes(getWeekdayName(currentDate)) || currentDate < semesterStart) {
            currentDate.setDate(currentDate.getDate() + 1);
            if (currentDate > semesterEnd) break;
          }
          
          if (currentDate > semesterEnd) break;
          
          // Створюємо назву теми з номером уроку якщо тем мало
          let topicName = topicData.topic;
          if (lessonsForThisTopic > 1) {
            topicName = `${topicData.topic} (урок ${lessonInTopic + 1}/${lessonsForThisTopic})`;
          }
          
          const lesson = {
            number: lessonNumber,
            date: formatDate(currentDate),
            moduleName: topicData.moduleName,
            topic: topicName,
            content: generateDetailedContent(topicData.topic, topicIdx, totalTopics, topicData.moduleName),
          };
          
          allLessons.push(lesson);
          lessonNumber++;
          
          // Переходимо до наступного дня уроків
          currentDate.setDate(currentDate.getDate() + 1);
        }
      });
      
      console.log(`✅ Згенеровано ${allLessons.length} уроків, очікувалось: ${totalLessonsInSemester}`);
    }
    
    if (settings.semester === '0') {
      // Весь рік - обидва семестри
      generateModuleLessons(semester1, SEMESTER_1_START, SEMESTER_1_END);
      currentDate = new Date(SEMESTER_2_START);
      generateModuleLessons(semester2, SEMESTER_2_START, SEMESTER_2_END);
    } else if (settings.semester === '1') {
      // Тільки перший семестр
      generateModuleLessons(semester1, SEMESTER_1_START, SEMESTER_1_END);
    } else if (settings.semester === '2') {
      // Тільки другий семестр
      currentDate = new Date(SEMESTER_2_START);
      generateModuleLessons(semester2, SEMESTER_2_START, SEMESTER_2_END);
    }
    
    console.log(`🎉 ФІНАЛЬНО згенеровано ${allLessons.length} уроків`);
    
    // Перевірка чи згенеровано достатньо уроків
    if (allLessons.length === 0) {
      throw new Error('Не вдалося згенерувати жодного уроку. Перевірте налаштування.');
    }
    
    return {
      success: true,
      lessons: allLessons,
      settings
    };
  } catch (error) {
    console.error('Error generating Ukrainian calendar plan:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}


// Генерація HTML для документу
export function generateUkrainianHTML(lessons: any[], settings: UkrainianPlanSettings): string {
  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Календарно-тематичний план з української мови</title>
  <style>
    body { font-family: 'Times New Roman', serif; margin: 40px; line-height: 1.5; }
    h1 { text-align: center; color: #1a1a1a; font-size: 18pt; margin-bottom: 10px; }
    .header { text-align: center; margin-bottom: 30px; font-size: 12pt; }
    .header p { margin: 5px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11pt; }
    th, td { border: 1px solid #000; padding: 8px; text-align: left; vertical-align: top; }
    th { background-color: #e0e0e0; font-weight: bold; text-align: center; }
    .module-header { background-color: #f5f5f5; font-weight: bold; text-align: center; font-size: 12pt; }
    .topic-cell { font-weight: 500; }
  </style>
</head>
<body>
  <h1>КАЛЕНДАРНО-ТЕМАТИЧНИЙ ПЛАН</h1>
  <h1>З УКРАЇНСЬКОЇ МОВИ</h1>
  <div class="header">
    <p><strong>${settings.schoolName}</strong></p>
    <p>Вчитель: ${settings.teacherName}, ${settings.teacherCategory}</p>
    <p>Клас: ${settings.class}</p>
    <p>Навчальний рік: ${settings.schoolYear}</p>
    <p>Програма: ${settings.program}</p>
  </div>
`;

  let currentModule = '';
  let tableStarted = false;

  lessons.forEach(lesson => {
    if (lesson.moduleName !== currentModule) {
      if (tableStarted) {
        html += '</table>\n';
      }
      html += `<h2 class="module-header">${lesson.moduleName}</h2>\n`;
      html += '<table>\n';
      html += '<tr><th style="width: 5%;">№ уроку</th><th style="width: 10%;">Дата</th><th style="width: 30%;">Тема уроку</th><th style="width: 50%;">Зміст навчального матеріалу. Очікувані результати</th><th style="width: 5%;">Примітки</th></tr>\n';
      currentModule = lesson.moduleName;
      tableStarted = true;
    }

    html += `<tr>
      <td style="text-align: center;">${lesson.number}</td>
      <td style="text-align: center;">${lesson.date}</td>
      <td class="topic-cell">${lesson.topic}</td>
      <td>${lesson.content}</td>
      <td></td>
    </tr>\n`;
  });

  if (tableStarted) {
    html += '</table>\n';
  }

  html += `
  <div style="margin-top: 40px;">
    <p>Календарно-тематичний план складено відповідно до чинної навчальної програми з української мови.</p>
    <p style="margin-top: 20px;">Вчитель: _________________ ${settings.teacherName}</p>
  </div>
</body>
</html>`;

  return html;
}
