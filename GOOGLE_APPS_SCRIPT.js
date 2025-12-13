// Google Apps Script для генерації календарних планів
// Цей код треба додати до вашого Google Apps Script проекту

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    console.log("Отримано дані:", data.subject, data.class);
    
    // Визначаємо який предмет генерувати
    if (data.subject === "Українська мова") {
      return ContentService.createTextOutput(
        JSON.stringify(generateUkrainianPlan(data))
      ).setMimeType(ContentService.MimeType.JSON);
    } else if (data.subject === "Фізична культура") {
      return ContentService.createTextOutput(
        JSON.stringify(generatePhysicalEducationPlan(data))
      ).setMimeType(ContentService.MimeType.JSON);
    } else {
      throw new Error("Невідомий предмет: " + data.subject);
    }
    
  } catch (error) {
    console.error("Помилка:", error);
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString()
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// =====================================================
// УКРАЇНСЬКА МОВА
// =====================================================

function generateUkrainianPlan(data) {
  const doc = DocumentApp.create(`Календарний план: ${data.subject} ${data.class} клас`);
  const body = doc.getBody();
  
  // Стилі
  const titleStyle = {};
  titleStyle[DocumentApp.Attribute.FONT_SIZE] = 16;
  titleStyle[DocumentApp.Attribute.BOLD] = true;
  titleStyle[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.CENTER;
  
  // Заголовок
  const title1 = body.appendParagraph('КАЛЕНДАРНО-ТЕМАТИЧНИЙ ПЛАН');
  title1.setAttributes(titleStyle);
  
  const title2 = body.appendParagraph('З УКРАЇНСЬКОЇ МОВИ');
  title2.setAttributes(titleStyle);
  
  body.appendParagraph(''); // Порожній рядок
  
  // Дані школи
  const header = [
    data.schoolName,
    `Вчитель: ${data.teacherName}, ${data.teacherCategory}`,
    `Клас: ${data.class}`,
    `Навчальний рік: ${data.schoolYear}`,
    `Програма: ${data.program}`
  ];
  
  header.forEach(line => {
    const p = body.appendParagraph(line);
    p.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    p.setSpacingAfter(2);
  });
  
  body.appendParagraph(''); // Порожній рядок
  
  // Парсимо дані з фронтенду (якщо вони передані)
  const lessons = data.lessons || [];
  
  if (lessons.length === 0) {
    body.appendParagraph('Помилка: не знайдено уроків для генерації');
    return {
      success: false,
      error: "Не знайдено уроків"
    };
  }
  
  // Групуємо уроки по модулях
  const lessonsByModule = {};
  lessons.forEach(lesson => {
    if (!lessonsByModule[lesson.moduleName]) {
      lessonsByModule[lesson.moduleName] = [];
    }
    lessonsByModule[lesson.moduleName].push(lesson);
  });
  
  // Створюємо таблиці для кожного модуля
  Object.keys(lessonsByModule).forEach(moduleName => {
    // Назва модуля
    const moduleTitle = body.appendParagraph(moduleName);
    moduleTitle.setAttributes({
      [DocumentApp.Attribute.FONT_SIZE]: 14,
      [DocumentApp.Attribute.BOLD]: true,
      [DocumentApp.Attribute.BACKGROUND_COLOR]: '#f5f5f5',
      [DocumentApp.Attribute.SPACING_BEFORE]: 10,
      [DocumentApp.Attribute.SPACING_AFTER]: 5
    });
    
    // Таблиця
    const moduleLessons = lessonsByModule[moduleName];
    const table = body.appendTable();
    
    // Заголовок таблиці
    const headerRow = table.appendTableRow();
    const headers = ['№ уроку', 'Дата', 'Тема уроку', 'Зміст навчального матеріалу', 'Примітки'];
    const widths = [50, 80, 200, 350, 50];
    
    headers.forEach((header, i) => {
      const cell = headerRow.appendTableCell(header);
      cell.setWidth(widths[i]);
      cell.setBackgroundColor('#e0e0e0');
      cell.getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
      cell.getChild(0).asParagraph().setBold(true);
    });
    
    // Рядки з уроками
    moduleLessons.forEach(lesson => {
      const row = table.appendTableRow();
      
      // № уроку
      const cellNum = row.appendTableCell(lesson.number.toString());
      cellNum.setWidth(50);
      cellNum.getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
      
      // Дата
      const cellDate = row.appendTableCell(lesson.date);
      cellDate.setWidth(80);
      cellDate.getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
      
      // Тема
      const cellTopic = row.appendTableCell(lesson.topic);
      cellTopic.setWidth(200);
      cellTopic.getChild(0).asParagraph().setBold(true);
      
      // Зміст
      const cellContent = row.appendTableCell(lesson.content);
      cellContent.setWidth(350);
      
      // Примітки
      const cellNotes = row.appendTableCell('');
      cellNotes.setWidth(50);
    });
    
    // Стилі таблиці
    table.setBorderWidth(1);
    table.setBorderColor('#000000');
    
    body.appendParagraph(''); // Порожній рядок після таблиці
  });
  
  // Підпис
  body.appendParagraph('');
  body.appendParagraph('Календарно-тематичний план складено відповідно до чинної навчальної програми з української мови.');
  body.appendParagraph('');
  body.appendParagraph(`Вчитель: _________________ ${data.teacherName}`);
  
  return {
    success: true,
    documentUrl: doc.getUrl(),
    documentId: doc.getId()
  };
}

// =====================================================
// ФІЗИЧНА КУЛЬТУРА (існуючий код)
// =====================================================

function generatePhysicalEducationPlan(data) {
  // Тут ваш існуючий код для фізкультури
  // ...
  const doc = DocumentApp.create(`Календарний план: ${data.subject} ${data.class} клас`);
  const body = doc.getBody();
  
  // (весь існуючий код для фізкультури)
  
  return {
    success: true,
    documentUrl: doc.getUrl(),
    documentId: doc.getId()
  };
}

// =====================================================
// ТЕСТУВАННЯ
// =====================================================

function testUkrainianGeneration() {
  const testData = {
    subject: "Українська мова",
    class: "5",
    program: "НУШ 5-9 класи",
    programId: "ukrainian-nush-5-9",
    schoolYear: "2024/2025",
    semester: "1",
    weekdays: "Пн,Ср",
    startDate: "2024-09-01",
    teacherName: "Іванова О.П.",
    teacherCategory: "вчитель вищої категорії",
    schoolName: "Київська ЗОШ №10",
    lessons: [
      {
        number: 1,
        date: "02.09.2024",
        moduleName: "Лексикологія",
        topic: "Лексичне значення слова",
        content: "Організаційний момент. Вивчення нового матеріалу..."
      }
    ]
  };
  
  const result = generateUkrainianPlan(testData);
  console.log(result);
}
