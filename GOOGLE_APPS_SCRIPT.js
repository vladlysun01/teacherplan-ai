// ============================================================
// Google Apps Script - КАЛЕНДАРНІ ПЛАНИ
// Версія 4.2 - Повний титульний лист (школа, категорія вчителя,
// правильні відмінки) замість мінімальної шапки з версії 4.1
// ============================================================

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    console.log("📝 Отримано дані:", data.subject, data['class']);
    console.log("📊 Уроків:", data.lessons?.length || 0);

    const result = generateUniversalPlan(data);

    return ContentService.createTextOutput(
      JSON.stringify(result)
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error("❌ Помилка:", error);
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString()
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================================
// УНІВЕРСАЛЬНА ФУНКЦІЯ для ВСІХ предметів
// ============================================================

function generateUniversalPlan(data) {
  const className = data['class'] || '';
  const doc = DocumentApp.create('Календарний план: ' + data.subject + ' ' + className + ' клас');
  const body = doc.getBody();

  // ✅ ВІДКРИВАЄМО ДОСТУП ЗА ПОСИЛАННЯМ (редагування)
  DriveApp.getFileById(doc.getId()).setSharing(
    DriveApp.Access.ANYONE_WITH_LINK,
    DriveApp.Permission.EDIT
  );

  // Налаштування сторінки
  body.setMarginTop(50);
  body.setMarginBottom(50);
  body.setMarginLeft(50);
  body.setMarginRight(50);

  // ============================================================
  // ТИТУЛЬНИЙ ЛИСТ (v4.2) — школа, повна назва плану, вчитель
  // праворуч, підпис знизу з правильним відмінком предмету.
  // ============================================================
  addTitlePage(body, data, className);
  body.appendPageBreak();

  // Парсимо уроки
  const lessons = data.lessons || [];

  if (lessons.length === 0) {
    body.appendParagraph('❌ Помилка: не знайдено уроків для генерації');
    return {
      success: false,
      error: "Не знайдено уроків"
    };
  }

  console.log('✅ Генерую ' + lessons.length + ' уроків');

  globalLessonCounter = 1;

  const hasModules = lessons[0] && lessons[0].moduleName;

  if (hasModules) {
    const lessonsByModule = {};
    lessons.forEach(function(lesson) {
      const moduleName = lesson.moduleName || 'Без модуля';
      if (!lessonsByModule[moduleName]) {
        lessonsByModule[moduleName] = [];
      }
      lessonsByModule[moduleName].push(lesson);
    });

    Object.keys(lessonsByModule).forEach(function(moduleName) {
      createModuleTable(body, moduleName, lessonsByModule[moduleName], data.subject);
    });
  } else {
    createSimpleTable(body, lessons, data.subject);
  }

  body.appendParagraph('');
  const signatureText = body.appendParagraph('Календарно-тематичний план складено відповідно до чинної навчальної програми з предмету "' + data.subject + '".');
  signatureText.setForegroundColor('#000000');

  body.appendParagraph('');
  const signature = body.appendParagraph('Вчитель: _________________ ' + (data.teacherName || ''));
  signature.setSpacingBefore(20);
  signature.setForegroundColor('#000000');

  console.log('✅ Документ створено: ' + doc.getUrl());

  return {
    success: true,
    documentUrl: doc.getUrl(),
    documentId: doc.getId()
  };
}

// ============================================================
// ТИТУЛЬНИЙ ЛИСТ — окрема функція, щоб не роздувати
// generateUniversalPlan і легше було ще колись поправити саме вигляд
// титульної сторінки, не чіпаючи логіку генерації таблиць.
// ============================================================

function addTitlePage(body, data, className) {
  // Порожні абзаци для відступу — ненадійно (висота залежить від шрифту й
  // Google щоразу трохи по-різному рендерить). Натомість точний відступ У
  // ПУНКТАХ (setSpacingBefore) на першому абзаці кожного блоку — так текст
  // розтягується на всю сторінку керовано, а не купчиться вгорі.
  function center(text, opts) {
    opts = opts || {};
    const p = body.appendParagraph(text);
    p.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    if (opts.spacingBefore) p.setSpacingBefore(opts.spacingBefore);
    const t = p.editAsText();
    t.setFontSize(opts.size || 12);
    t.setForegroundColor('#000000');
    if (opts.bold) t.setBold(true);
    return p;
  }

  // --- Назва закладу — одне поле, довгий текст сам перенесеться на
  // кілька рядків (Word wrap), так само як у зразку. ---
  if (data.schoolName) {
    center(data.schoolName, {});
  }

  // --- Заголовок і підзаголовки — великий відступ зверху опускає блок
  // приблизно до третини сторінки. ---
  center('Календарне планування', { size: 14, bold: true, spacingBefore: 170 });
  center('з предмету «' + data.subject + '» у ' + className + ' класі', { spacingBefore: 6 });
  center('курсу інваріантної складової навчального плану,', { spacingBefore: 6 });
  center('на ' + (data.schoolYear || '2024/2025') + ' навчальний рік', { spacingBefore: 6 });

  // --- Вчитель — праворуч, ще нижче (ближче до двох третин сторінки) ---
  const teacherLines = [
    'Вчитель предмету',
    '«' + data.subject + '»',
    data.teacherCategory || '',
    formatTeacherName(data.teacherName),
  ].filter(function (line) { return line && line.trim(); });

  teacherLines.forEach(function (line, i) {
    const p = body.appendParagraph(line);
    p.setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
    p.setSpacingBefore(i === 0 ? 230 : 2);
    const t = p.editAsText();
    t.setFontSize(12);
    t.setForegroundColor('#000000');
  });

  // --- Нижній рядок сторінки, з правильним відмінком предмету — великий
  // відступ притискає його ближче до низу сторінки. ---
  const footer = body.appendParagraph('Календарне планування з ' + genitiveSubject(data.subject));
  footer.setAlignment(DocumentApp.HorizontalAlignment.LEFT);
  footer.setSpacingBefore(170);
  footer.setForegroundColor('#000000');
}

// "Іванов Іван Іванович" → "Іванов І.І." (як у зразку "Завадський В.В.").
// Якщо вчитель уже ввів скорочено чи лишив 1-2 слова — не ламаємо.
function formatTeacherName(fullName) {
  if (!fullName) return '';
  if (fullName.indexOf('.') !== -1) return fullName; // вже скорочено
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 3) {
    return parts[0] + ' ' + parts[1][0] + '.' + parts[2][0] + '.';
  }
  if (parts.length === 2) {
    return parts[0] + ' ' + parts[1][0] + '.';
  }
  return fullName;
}

// Родовий відмінок назви предмету для "Календарне планування з ..." —
// фіксований словник на 14 предметів, а не алгоритм відмінювання
// (для довільного українського тексту це ненадійно).
function genitiveSubject(subject) {
  const map = {
    'Фізична культура': 'фізичної культури',
    'Українська мова': 'української мови',
    'Українська література': 'української літератури',
    'Математика': 'математики',
    'Інформатика': 'інформатики',
    'Історія України': 'історії України',
    'Всесвітня історія': 'всесвітньої історії',
    'Мистецтво': 'мистецтва',
    'Географія': 'географії',
    'Основи правознавства': 'основ правознавства',
    'Хімія': 'хімії',
    'Біологія': 'біології',
    'Фізика': 'фізики',
    'Захист України': 'захисту України',
  };
  return map[subject] || subject;
}

// ============================================================
// СТВОРЕННЯ ТАБЛИЦІ З МОДУЛЕМ
// ============================================================

var globalLessonCounter = 1;

function createModuleTable(body, moduleName, lessons, subject) {
  const moduleTitle = body.appendParagraph(moduleName);
  const moduleAttrs = {};
  moduleAttrs[DocumentApp.Attribute.FONT_SIZE] = 12;
  moduleAttrs[DocumentApp.Attribute.BOLD] = true;
  moduleAttrs[DocumentApp.Attribute.FOREGROUND_COLOR] = '#000000';
  moduleAttrs[DocumentApp.Attribute.SPACING_BEFORE] = 8;
  moduleAttrs[DocumentApp.Attribute.SPACING_AFTER] = 4;
  moduleTitle.setAttributes(moduleAttrs);

  const table = body.appendTable();

  const headerRow = table.appendTableRow();
  const headers = ['№', 'Дата', 'Тема уроку', 'Зміст', 'Прим.'];

  headers.forEach(function(header) {
    const cell = headerRow.appendTableCell(header);
    cell.setBackgroundColor('#ffffff');
    const para = cell.getChild(0).asParagraph();
    para.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    para.setBold(true);
    para.setForegroundColor('#000000');
    para.setFontSize(11);
  });

  headerRow.getCell(0).setWidth(40);
  headerRow.getCell(1).setWidth(70);
  headerRow.getCell(2).setWidth(160);
  headerRow.getCell(3).setWidth(186);
  headerRow.getCell(4).setWidth(40);

  lessons.forEach(function(lesson) {
    const row = table.appendTableRow();

    const lessonNum = lesson.number || lesson.lessonNumber || globalLessonCounter;
    addCell(row, lessonNum.toString(), 40, 11, true);

    if (!lesson.number && !lesson.lessonNumber) {
      globalLessonCounter++;
    }

    addCell(row, lesson.date || '', 70, 11, true);
    addCell(row, lesson.topic || '', 160, 11, false);

    let content = '';
    if (typeof lesson.content === 'string') {
      content = lesson.content;
    } else if (lesson.content && typeof lesson.content === 'object') {
      const parts = [];
      if (lesson.content.organizationalMoment) parts.push('Орг. момент: ' + lesson.content.organizationalMoment);
      if (lesson.content.actualization) parts.push('Актуалізація: ' + lesson.content.actualization);
      if (lesson.content.motivation) parts.push('Мотивація: ' + lesson.content.motivation);
      if (lesson.content.mainPart) parts.push('Основна частина: ' + lesson.content.mainPart);
      if (lesson.content.practice) parts.push('Практика: ' + lesson.content.practice);
      if (lesson.content.consolidation) parts.push('Закріплення: ' + lesson.content.consolidation);
      if (lesson.content.homework) parts.push('Д/З: ' + lesson.content.homework);
      content = parts.join('; ');
    } else {
      content = lesson.homework || '';
    }
    addCell(row, content, 186, 10, false);
    addCell(row, '', 40, 10, false);
  });

  table.setBorderWidth(1);
  table.setBorderColor('#000000');

  body.appendParagraph('');
}

// ============================================================
// ПРОСТА ТАБЛИЦЯ (без модулів)
// ============================================================

function createSimpleTable(body, lessons, subject) {
  const table = body.appendTable();

  const headerRow = table.appendTableRow();
  const headers = ['№', 'Дата', 'Тема уроку', 'Зміст', 'Прим.'];

  headers.forEach(function(header) {
    const cell = headerRow.appendTableCell(header);
    cell.setBackgroundColor('#ffffff');
    const para = cell.getChild(0).asParagraph();
    para.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    para.setBold(true);
    para.setForegroundColor('#000000');
    para.setFontSize(11);
  });

  headerRow.getCell(0).setWidth(40);
  headerRow.getCell(1).setWidth(70);
  headerRow.getCell(2).setWidth(160);
  headerRow.getCell(3).setWidth(186);
  headerRow.getCell(4).setWidth(40);

  lessons.forEach(function(lesson) {
    const row = table.appendTableRow();

    const lessonNum = lesson.number || lesson.lessonNumber || globalLessonCounter;
    addCell(row, lessonNum.toString(), 40, 11, true);

    if (!lesson.number && !lesson.lessonNumber) {
      globalLessonCounter++;
    }

    addCell(row, lesson.date || '', 70, 11, true);
    addCell(row, lesson.topic || '', 160, 11, false);

    let content = '';
    if (typeof lesson.content === 'string') {
      content = lesson.content;
    } else if (lesson.content && typeof lesson.content === 'object') {
      const parts = [];
      if (lesson.content.organizationalMoment) parts.push('Орг. момент: ' + lesson.content.organizationalMoment);
      if (lesson.content.actualization) parts.push('Актуалізація: ' + lesson.content.actualization);
      if (lesson.content.motivation) parts.push('Мотивація: ' + lesson.content.motivation);
      if (lesson.content.mainPart) parts.push('Основна частина: ' + lesson.content.mainPart);
      if (lesson.content.practice) parts.push('Практика: ' + lesson.content.practice);
      if (lesson.content.consolidation) parts.push('Закріплення: ' + lesson.content.consolidation);
      if (lesson.content.homework) parts.push('Д/З: ' + lesson.content.homework);
      content = parts.join('; ');
    } else {
      content = lesson.homework || '';
    }
    addCell(row, content, 186, 10, false);
    addCell(row, '', 40, 10, false);
  });

  table.setBorderWidth(1);
  table.setBorderColor('#000000');

  body.appendParagraph('');
}

// ============================================================
// ДОПОМІЖНА ФУНКЦІЯ
// ============================================================

function addCell(row, text, width, fontSize, center) {
  const cell = row.appendTableCell(text);
  cell.setWidth(width);
  cell.setBackgroundColor('#ffffff');

  const para = cell.getChild(0).asParagraph();
  para.setForegroundColor('#000000');
  para.setFontSize(fontSize);

  if (center) {
    para.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  }

  return cell;
}

// ============================================================
// ТЕСТУВАННЯ
// ============================================================

function testGeography10() {
  const testData = {
    subject: "Географія",
    class: "10",
    schoolName: 'Золочівської селищної ради\nКомунальний заклад «Олександрівський ліцей»\nЗолочівської селищної ради',
    schoolYear: "2026/2027",
    semester: "1",
    teacherName: "Коваленко Марія Іванівна",
    teacherCategory: "Спеціаліст вищої категорії",
    lessons: [
      {
        number: 1,
        date: "02.09.2026",
        moduleName: "Вступ",
        topic: "Що вивчає курс «Географія: регіони і країни»",
        content: "Організаційний момент. Пояснення мети та завдань курсу. Робота з картами."
      },
      {
        number: 2,
        date: "06.09.2026",
        moduleName: "Вступ",
        topic: "Джерела знань про регіони та країни світу",
        content: "Актуалізація знань. Вивчення різних джерел географічної інформації. Практична робота."
      }
    ]
  };

  const result = generateUniversalPlan(testData);
  console.log(result);
}
