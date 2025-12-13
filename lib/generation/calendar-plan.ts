// Типи
import { convertWeekdays, convertSemester, convertStartDate } from "./utils";
export interface CalendarPlanSettings {
  class: string;
  subject: string;
  schoolYear: string;
  semester: '0' | '1' | '2';
  weekdays: string;
  startDate: string;
  teacherName: string;
  teacherCategory: string;
  schoolName: string;
}

interface Module {
  name: string;
  hoursPerSemester: number;
  topics: string[];
}

// Модулі НУШ для 5 класу
function getModulesNUSH(): Module[] {
  return [
    {
      name: "Модуль 1: Дитяча легка атлетика",
      hoursPerSemester: 12,
      topics: [
        "Історія розвитку дитячої легкої атлетики в Україні та світі",
        "Загальнорозвивальні вправи (ЗРВ) для розвитку швидкості",
        "Спеціальні бігові вправи: техніка виконання",
        "Високий старт: постановка ніг, положення тіла",
        "Біг 30 м: техніка стартового розгону",
        "Біг 60 м: розподіл сил на дистанції",
        "Естафетний біг: передача естафетної палички",
        "Стрибки в довжину з місця: підготовчі вправи",
        "Стрибки в довжину з розбігу: фази стрибка",
        "Метання м'яча: хват, розгін, фінальне зусилля",
        "Розвиток витривалості: рівномірний біг до 1000 м",
        "Контрольні нормативи з легкої атлетики"
      ]
    },
    {
      name: "Модуль 2: Гімнастика",
      hoursPerSemester: 10,
      topics: [
        "Історія гімнастики. Правила техніки безпеки",
        "Загальнорозвивальні вправи з предметами та без",
        "Акробатичні вправи: перекиди вперед і назад",
        "Стійка на лопатках: техніка виконання",
        "Міст з положення лежачи: підготовчі вправи",
        "Вправи на гімнастичній лаві: рівновага, повороти",
        "Опорний стрибок: наскік на козла",
        "Вправи на гімнастичній стінці: лазіння, вис",
        "Танцювальні кроки та з'єднання елементів",
        "Складання та демонстрація гімнастичної комбінації"
      ]
    },
    {
      name: "Модуль 3: Спортивні ігри (баскетбол)",
      hoursPerSemester: 11,
      topics: [
        "Історія баскетболу. Основні правила гри",
        "Стійка баскетболіста. Пересування по майданчику",
        "Ведення м'яча правою та лівою рукою",
        "Передачі м'яча: від грудей, з відскоком",
        "Кидки м'яча в кошик з місця",
        "Кидки м'яча після ведення",
        "Технічні прийоми захисту: стійка, переміщення",
        "Тактика гри: позиційний напад",
        "Навчальна гра 3×3",
        "Навчальна гра 5×5",
        "Контрольні нормативи з баскетболу"
      ]
    },
    {
      name: "Модуль 4: Спортивні ігри (волейбол)",
      hoursPerSemester: 11,
      topics: [
        "Історія волейболу. Правила гри та суддівство",
        "Стійка волейболіста. Переміщення по майданчику",
        "Верхня передача м'яча над собою",
        "Верхня передача м'яча партнеру",
        "Нижня передача м'яча двома руками",
        "Подача м'яча знизу",
        "Прийом м'яча з подачі",
        "Напад: розбіг та удар по м'ячу",
        "Основи блокування",
        "Навчальна гра з спрощеними правилами",
        "Контрольні нормативи з волейболу"
      ]
    },
    {
      name: "Модуль 5: Рухливі ігри та естафети",
      hoursPerSemester: 8,
      topics: [
        "Рухливі ігри на розвиток швидкості реакції",
        "Естафети з м'ячами та предметами",
        "Ігри на координацію та спритність",
        "Командні естафети з перешкодами",
        "Народні українські рухливі ігри",
        "Ігри на розвиток уваги та мислення",
        "Естафети з елементами акробатики",
        "Підсумкові змагання та рухливі ігри"
      ]
    },
    {
      name: "Модуль 6: Футбол",
      hoursPerSemester: 10,
      topics: [
        "Історія футболу. Правила гри",
        "Техніка ведення м'яча різними способами",
        "Передачі м'яча: короткі та довгі",
        "Зупинка м'яча: ногою, грудьми",
        "Удари по воротах з місця та руху",
        "Обманні рухи (финти) з м'ячем",
        "Відбір м'яча у суперника",
        "Тактика гри: розташування гравців",
        "Навчальна гра з спрощеними правилами",
        "Контрольні нормативи з футболу"
      ]
    }
  ];
}

// Розподіл модулів по семестрах
function distributeModulesBySemesters(modules: Module[]) {
  const semester1: Module[] = [];
  const semester2: Module[] = [];
  
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
function generateDetailedContent(topic: string, lessonIndex: number, totalLessons: number): string {
  const isFirstLesson = lessonIndex === 0;
  const isLastLesson = lessonIndex === totalLessons - 1;
  
  let content = "";
  
  if (isFirstLesson) {
    content += "Теоретична частина: ознайомлення з історією та основними правилами. ";
  }
  
  content += "Підготовча частина (5-7 хв): загальнорозвивальні вправи (ЗРВ) для всіх груп м'язів, спеціальні підготовчі вправи. ";
  content += "Основна частина (25-30 хв): ";
  
  if (topic.includes("історія") || topic.includes("правила")) {
    content += "розповідь вчителя, перегляд відеоматеріалів, обговорення основних понять, демонстрація техніки виконання базових елементів";
  } else if (topic.includes("техніка") || topic.includes("вправи")) {
    content += "демонстрація правильної техніки виконання вправ, пояснення типових помилок та способів їх виправлення, практичне виконання вправ з поступовим ускладненням, індивідуальна робота над технікою, групові та парні вправи для закріплення навички";
  } else if (topic.includes("гра") || topic.includes("змагання")) {
    content += "організація навчальної гри з дотриманням правил, застосування вивчених технічних прийомів у грі, тактичні завдання для команд, аналіз типових ігрових ситуацій";
  } else {
    content += "вивчення та відпрацювання основних технічних елементів, виконання підвідних та підготовчих вправ, робота в парах та групах, виправлення помилок, контроль правильності виконання";
  }
  
  content += ". Заключна частина (3-5 хв): вправи на відновлення дихання, розтягування м'язів, підбиття підсумків уроку";
  
  if (isLastLesson) {
    content += ". Контрольні нормативи для оцінювання рівня засвоєння матеріалу";
  }
  
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
export async function generateCalendarPlan(settings: CalendarPlanSettings) {
  try {
    const modules = getModulesNUSH();
    const { semester1, semester2 } = distributeModulesBySemesters(modules);
    
    // Конвертуємо weekdays з рядка в масив чисел
    const weekdays = convertWeekdays(settings.weekdays);
    const startDate = new Date(settings.startDate);
    
    let lessonNumber = 1;
    let currentDate = new Date(startDate);
    const allLessons: any[] = [];
    
    function generateModuleLessons(modulesList: Module[]) {
      modulesList.forEach(module => {
        module.topics.forEach((topic, idx) => {
          // Перевіряємо чи поточний день входить у список weekdays
          while (!weekdays.includes(currentDate.getDay())) {
            currentDate.setDate(currentDate.getDate() + 1);
          }
          
          const lesson = {
            number: lessonNumber,
            date: formatDate(currentDate),
            moduleName: module.name,
            topic,
            content: generateDetailedContent(topic, idx, module.topics.length),
          };
          
          allLessons.push(lesson);
          lessonNumber++;
          currentDate.setDate(currentDate.getDate() + 7);
        });
      });
    }
    
    if (settings.semester === '0' || settings.semester === '1') {
      generateModuleLessons(semester1);
    }
    
    if (settings.semester === '0' || settings.semester === '2') {
      generateModuleLessons(semester2);
    }
    
    return {
      success: true,
      lessons: allLessons,
      settings
    };
  } catch (error) {
    console.error('Error generating calendar plan:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Генерація HTML для документу
export function generateHTML(lessons: any[], settings: CalendarPlanSettings): string {
  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Календарний план</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    h1 { text-align: center; color: #333; }
    .header { text-align: center; margin-bottom: 30px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #000; padding: 8px; text-align: left; }
    th { background-color: #f59e0b; color: white; font-weight: bold; }
    .module-header { background-color: #fbbf24; font-weight: bold; text-align: center; }
  </style>
</head>
<body>
  <h1>КАЛЕНДАРНО-ТЕМАТИЧНИЙ ПЛАН</h1>
  <div class="header">
    <p><strong>${settings.schoolName}</strong></p>
    <p>Вчитель: ${settings.teacherName}, ${settings.teacherCategory}</p>
    <p>Предмет: ${settings.subject}, ${settings.class} клас</p>
    <p>Навчальний рік: ${settings.schoolYear}</p>
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
      html += '<tr><th>№</th><th>Дата</th><th>Тема уроку</th><th>Зміст навчального матеріалу</th><th>Примітки</th></tr>\n';
      currentModule = lesson.moduleName;
      tableStarted = true;
    }

    html += `<tr>
      <td>${lesson.number}</td>
      <td>${lesson.date}</td>
      <td>${lesson.topic}</td>
      <td>${lesson.content}</td>
      <td></td>
    </tr>\n`;
  });

  if (tableStarted) {
    html += '</table>\n';
  }

  html += `
</body>
</html>`;

  return html;
}