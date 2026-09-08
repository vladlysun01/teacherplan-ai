// lib/document-builder.ts
//
// Генерація .docx у нашому власному коді — заміна Google Apps Script.
// Причини переходу (реальні, не гіпотетичні):
// 1) кожен документ раніше падав в ОСОБИСТИЙ Google Drive власника
//    Apps Script, а не в інфраструктуру продукту — звідси "Almost out
//    of storage" на реальному акаунті;
// 2) ітерація вимагала копіювати код руками в редактор Apps Script,
//    вручну передеплоювати і чекати скріншот, щоб побачити результат;
// 3) Web App має власні квоти виконання/запитів, які могли почати
//    падати непередбачувано під реальним навантаженням.
//
// Логіка (титульна сторінка, відступи, відмінки, абревіатура ПІБ)
// перенесена з GOOGLE_APPS_SCRIPT.js 1-в-1, тільки одиниці виміру інші:
// Apps Script рахує в пунктах, docx — у твіпах (1pt = 20 twips) для
// відступів і в напівпунктах (1pt = 2) для розміру шрифту.

import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  WidthType,
  BorderStyle,
  PageBreak,
  Packer,
  VerticalAlign,
  TableLayoutType,
  LineRuleType,
} from "docx";

const PT = 20; // twips на пункт (spacing)
const HP = 2; // напівпункти на пункт (розмір шрифту)
const BLACK = "000000";

export type Lesson = {
  number?: number;
  lessonNumber?: number;
  date?: string;
  topic?: string;
  moduleName?: string;
  homework?: string;
  content?:
    | string
    | {
        organizationalMoment?: string;
        actualization?: string;
        motivation?: string;
        mainPart?: string;
        practice?: string;
        consolidation?: string;
        homework?: string;
      };
};

export type PlanData = {
  subject: string;
  class: string | number;
  schoolName?: string;
  schoolYear?: string;
  semester?: string;
  teacherName?: string;
  teacherCategory?: string;
  lessons: Lesson[];
};

// "Іванов Іван Іванович" → "Іванов І.І." Якщо вже скорочено чи 1-2 слова —
// не ламаємо. (1-в-1 з GOOGLE_APPS_SCRIPT.js formatTeacherName)
function formatTeacherName(fullName?: string): string {
  if (!fullName) return "";
  if (fullName.includes(".")) return fullName;
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 3) return `${parts[0]} ${parts[1][0]}.${parts[2][0]}.`;
  if (parts.length === 2) return `${parts[0]} ${parts[1][0]}.`;
  return fullName;
}

// Родовий відмінок для "Календарне планування з ..." — фіксований словник
// на 14 предметів (1-в-1 з GOOGLE_APPS_SCRIPT.js genitiveSubject).
const GENITIVE: Record<string, string> = {
  "Фізична культура": "фізичної культури",
  "Українська мова": "української мови",
  "Українська література": "української літератури",
  "Математика": "математики",
  "Інформатика": "інформатики",
  "Історія України": "історії України",
  "Всесвітня історія": "всесвітньої історії",
  "Мистецтво": "мистецтва",
  "Географія": "географії",
  "Основи правознавства": "основ правознавства",
  "Хімія": "хімії",
  "Біологія": "біології",
  "Фізика": "фізики",
  "Захист України": "захисту України",
};
function genitiveSubject(subject: string): string {
  return GENITIVE[subject] || subject;
}

function centerParagraph(text: string, opts: { size?: number; bold?: boolean } = {}): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text,
        bold: !!opts.bold, // завжди явно true/false — саме тут була жирність "нізвідки" в Apps Script
        size: (opts.size || 12) * HP,
        color: BLACK,
      }),
    ],
  });
}

// Порожній абзац із ТОЧНОЮ висотою рядка (lineRule: EXACT) — надійний
// спосіб зробити вертикальний відступ на титульній сторінці.
//
// Раніше відступи робились через paragraph.spacing.before (twips) — це
// коректний OOXML, і в експортованому XML значення були саме такі, як
// задумано (120pt/160pt/210pt), перевірено прямо в document.xml. Але
// на реальному скріні з Pages текст усе одно ліг щільно вгорі сторінки
// майже без відступів, а решта сторінки лишилась порожньою "молоком" —
// тобто Pages ці "spacing before" значення на практиці проігнорував.
// Порожній рядок із власною висотою (line/lineRule) — набагато
// приземленіший прийом (буквально те, що вчитель зробив би вручну
// клавішею Enter), і його однаково розуміє і Word, і Pages, і
// LibreOffice, і Google Docs.
function blankLine(pt: number): Paragraph {
  return new Paragraph({
    spacing: { before: 0, after: 0, line: pt * PT, lineRule: LineRuleType.EXACT },
    // Невидимий нерозривний пробіл, а не порожній рядок: у порожньому
    // текстовому runі деякі рушії рахують висоту рядка зі шрифту, а не
    // з line/lineRule — символ гарантує, що рядок реально є.
    children: [new TextRun({ text: " " })],
  });
}

function buildTitlePage(data: PlanData, className: string): Paragraph[] {
  const paras: Paragraph[] = [];

  // Назва закладу — підтримуємо той самий формат: користувач може ввести
  // текст із \n (кілька рядків) або одним абзацом, що сам перенесеться
  // (word wrap робить Word/Google Docs автоматично).
  if (data.schoolName) {
    data.schoolName.split("\n").forEach((line) => paras.push(centerParagraph(line.trim())));
  }

  paras.push(blankLine(40));
  paras.push(centerParagraph("Календарне планування", { size: 14, bold: true }));
  paras.push(centerParagraph(`з предмету «${data.subject}» у ${className} класі`));
  paras.push(centerParagraph("курсу інваріантної складової навчального плану,"));
  paras.push(centerParagraph(`на ${data.schoolYear || "2024/2025"} навчальний рік`));

  // Відступ до блоку вчителя — приблизно середина сторінки, як на
  // офіційному зразку (праворуч, нижче за основний блок).
  paras.push(blankLine(260));

  const teacherLines = [
    "Вчитель предмету",
    `«${data.subject}»`,
    data.teacherCategory || "",
    formatTeacherName(data.teacherName),
  ].filter((line) => line && line.trim());

  teacherLines.forEach((line) => {
    paras.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: line, size: 12 * HP, color: BLACK, bold: false })],
      })
    );
  });

  // Відступ до нижнього рядка — ближче до низу сторінки.
  paras.push(blankLine(240));

  paras.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({
          text: `Календарне планування з ${genitiveSubject(data.subject)}`,
          size: 12 * HP,
          color: BLACK,
          bold: false,
        }),
      ],
    })
  );

  // Наступна секція (таблиці уроків) — з нової сторінки.
  paras.push(new Paragraph({ children: [new PageBreak()] }));

  return paras;
}

function lessonContentText(lesson: Lesson): string {
  if (typeof lesson.content === "string") return lesson.content;
  if (lesson.content && typeof lesson.content === "object") {
    const c = lesson.content;
    const parts: string[] = [];
    if (c.organizationalMoment) parts.push(`Орг. момент: ${c.organizationalMoment}`);
    if (c.actualization) parts.push(`Актуалізація: ${c.actualization}`);
    if (c.motivation) parts.push(`Мотивація: ${c.motivation}`);
    if (c.mainPart) parts.push(`Основна частина: ${c.mainPart}`);
    if (c.practice) parts.push(`Практика: ${c.practice}`);
    if (c.consolidation) parts.push(`Закріплення: ${c.consolidation}`);
    if (c.homework) parts.push(`Д/З: ${c.homework}`);
    return parts.join("; ");
  }
  return lesson.homework || "";
}

// Ширини колонок — ті самі пропорції (в pt), що були в Apps Script
// (40, 70, 160, 186, 40 = 496pt), переведені в twips для docx.
const COL_WIDTHS_PT = [40, 70, 160, 186, 40];
const COL_WIDTHS_DXA = COL_WIDTHS_PT.map((pt) => pt * PT);
const HEADERS = ["№", "Дата", "Тема уроку", "Зміст", "Прим."];

function headerCell(text: string, widthDxa: number): TableCell {
  return new TableCell({
    width: { size: widthDxa, type: WidthType.DXA },
    shading: { fill: "E0E0E0" },
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text, bold: true, size: 11 * HP, color: BLACK })],
      }),
    ],
  });
}

function bodyCell(text: string, widthDxa: number, fontSizePt: number, center: boolean): TableCell {
  return new TableCell({
    width: { size: widthDxa, type: WidthType.DXA },
    shading: { fill: "FFFFFF" },
    children: [
      new Paragraph({
        alignment: center ? AlignmentType.CENTER : AlignmentType.LEFT,
        children: [new TextRun({ text: text || "", size: fontSizePt * HP, color: BLACK, bold: false })],
      }),
    ],
  });
}

function lessonRow(lesson: Lesson, fallbackNumber: number): TableRow {
  const num = lesson.number ?? lesson.lessonNumber ?? fallbackNumber;
  return new TableRow({
    children: [
      bodyCell(String(num), COL_WIDTHS_DXA[0], 11, true),
      bodyCell(lesson.date || "", COL_WIDTHS_DXA[1], 11, true),
      bodyCell(lesson.topic || "", COL_WIDTHS_DXA[2], 11, false),
      bodyCell(lessonContentText(lesson), COL_WIDTHS_DXA[3], 10, false),
      bodyCell("", COL_WIDTHS_DXA[4], 10, false),
    ],
  });
}

function lessonsTable(lessons: Lesson[], startCounter: { value: number }): Table {
  const headerRow = new TableRow({
    children: HEADERS.map((h, i) => headerCell(h, COL_WIDTHS_DXA[i])),
  });
  const rows = [headerRow];
  lessons.forEach((lesson) => {
    rows.push(lessonRow(lesson, startCounter.value));
    if (lesson.number == null && lesson.lessonNumber == null) startCounter.value++;
  });
  return new Table({
    width: { size: COL_WIDTHS_DXA.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    // Без layout: FIXED Word/Pages рахують ширину колонок за вмістом
    // ("autofit"), ігноруючи наші width у клітинках — саме тому текст
    // ліг по одній букві в рядок (реальний баг, зловлений на скріні
    // з готовим .docx). columnWidths дублює ширини на рівні таблиці
    // (<w:tblGrid>), яку читають і Word, і Pages.
    layout: TableLayoutType.FIXED,
    columnWidths: COL_WIDTHS_DXA,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: BLACK },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: BLACK },
      left: { style: BorderStyle.SINGLE, size: 4, color: BLACK },
      right: { style: BorderStyle.SINGLE, size: 4, color: BLACK },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: BLACK },
      insideVertical: { style: BorderStyle.SINGLE, size: 4, color: BLACK },
    },
    rows,
  });
}

export async function buildCalendarPlanDocx(data: PlanData): Promise<Buffer> {
  const className = String(data.class ?? "");
  const children: (Paragraph | Table)[] = [...buildTitlePage(data, className)];

  if (!data.lessons || data.lessons.length === 0) {
    children.push(new Paragraph({ children: [new TextRun({ text: "Помилка: не знайдено уроків для генерації" })] }));
  } else {
    const hasModules = !!data.lessons[0]?.moduleName;
    const counter = { value: 1 };

    if (hasModules) {
      const byModule = new Map<string, Lesson[]>();
      data.lessons.forEach((lesson) => {
        const name = lesson.moduleName || "Без модуля";
        if (!byModule.has(name)) byModule.set(name, []);
        byModule.get(name)!.push(lesson);
      });
      byModule.forEach((moduleLessons, moduleName) => {
        children.push(
          new Paragraph({
            spacing: { before: 8 * PT, after: 4 * PT },
            shading: { fill: "F5F5F5" },
            children: [new TextRun({ text: moduleName, bold: true, size: 12 * HP, color: BLACK })],
          })
        );
        children.push(lessonsTable(moduleLessons, counter));
        children.push(new Paragraph({ text: "" }));
      });
    } else {
      children.push(lessonsTable(data.lessons, counter));
      children.push(new Paragraph({ text: "" }));
    }

    children.push(new Paragraph({ text: "" }));
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Календарно-тематичний план складено відповідно до чинної навчальної програми з предмету "${data.subject}".`,
            color: BLACK,
          }),
        ],
      })
    );
    children.push(new Paragraph({ text: "" }));
    children.push(
      new Paragraph({
        spacing: { before: 20 * PT },
        children: [
          new TextRun({ text: `Вчитель: _________________ ${data.teacherName || ""}`, color: BLACK }),
        ],
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 50 * PT, bottom: 50 * PT, left: 50 * PT, right: 50 * PT },
          },
        },
        children,
      },
    ],
  });

  return Packer.toBuffer(doc);
}
